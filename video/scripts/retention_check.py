"""대본(컷)의 시청지속 위험 구간을 찾는다（시청지속 지침 11-1, 32~34번）.

사용법:
    python3 scripts/retention_check.py --case case004

- cuts.json（cases/<case>/cuts.json）만 있으면 글자 수로 시각을 추정한다（약 5.55자/초, CASE #003 실측）.
- timeline.json（public/<case>/timeline.json）이 있으면 실제 발화 시각을 쓴다.
- 결과는 경고 목록이다. 경고가 곧 오류는 아니며, 해당 문장을 보고 판단한다.
"""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CPS = 5.55  # 1초당 글자 수（CASE #003 실측: 4,593자 / 828초）

FILLER = ["追いかけてみよう", "見ていこう", "確かめよう", "見てみよう", "考えてみよう"]
RECAP = ["振り返", "ここまで見てきた", "今回わかった", "まとめると", "おさらい", "整理すると", "ここまでの話"]
QUESTION_END = ("？", "?", "のか。", "のだろう。", "のだろうか。")


def load(case: str):
    cuts = json.loads((ROOT.parent / "cases" / case / "cuts.json").read_text(encoding="utf-8"))
    tl_path = ROOT / "public" / case / "timeline.json"
    segs = []  # (cut_id, text, start_sec)
    if tl_path.exists():
        tl = json.loads(tl_path.read_text(encoding="utf-8"))
        for c in tl["cuts"]:
            for s in c["segments"]:
                segs.append((c["id"], s["text"], c["from"] / 30 + s["start"]))
        total = tl["totalFrames"] / 30
        measured = True
    else:
        t = 0.0
        for c in cuts:
            for s in [x for x in c["text"].split("/") if x]:
                segs.append((c["id"], s, t))
                t += len(re.sub(r"\s", "", s)) / CPS + 0.35
            t += 0.6
        total = t
        measured = False
    return cuts, segs, total, measured


def mmss(x: float) -> str:
    return f"{int(x // 60)}:{x % 60:04.1f}"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--case", required=True)
    ap.add_argument("--max-run", type=float, default=45.0, help="같은 컷 안에서 이어지는 설명의 상한(초)")
    args = ap.parse_args()
    cuts, segs, total, measured = load(args.case)
    warn, ok = [], []

    # 11-1: 첫 문장은 제목의 질문
    first = segs[0][1]
    (ok if first.endswith(QUESTION_END) else warn).append(f"[11-1] 첫 문장: 「{first}」" + ("" if first.endswith(QUESTION_END) else " → 질문으로 시작하지 않음"))

    # 11-1: 타이틀 35초 이내
    title = next((s for s in segs if "今日のカネナゾ" in s[1]), None)
    if title:
        (ok if title[2] <= 35 else warn).append(f"[11-1] 타이틀 {mmss(title[2])}" + ("" if title[2] <= 35 else " → 35초를 넘음"))
        # 32: 타이틀 직후 20초에 채움말
        after = [s for s in segs if title[2] < s[2] <= title[2] + 25 and "今日のカネナゾ" not in s[1] and not s[1].startswith("「")]
        fill = [s for s in after if any(w in s[1] for w in FILLER)]
        for s in fill:
            warn.append(f"[32] 타이틀 직후 {mmss(s[2])} {s[0]} 「{s[1]}」 → 새 정보 없는 전환 문장")
        if not fill:
            ok.append("[32] 타이틀 직후 25초에 채움말 없음")
    else:
        warn.append("[11-1] 「今日のカネナゾ」 타이틀 문장을 찾지 못함")

    # 33: 같은 컷에서 설명이 오래 이어짐（컷 = 한 화면）
    tl_path = ROOT / "public" / args.case / "timeline.json"
    if tl_path.exists():
        tl = json.loads(tl_path.read_text(encoding="utf-8"))
        long_cuts = [(c["id"], c["duration"] / 30, c["from"] / 30) for c in tl["cuts"] if c["duration"] / 30 > args.max_run]
    else:
        long_cuts = []
        for c in cuts:
            d = len(re.sub(r"[\s/]", "", c["text"])) / CPS
            if d > args.max_run:
                long_cuts.append((c["id"], d, 0.0))
    for cid, d, st in long_cuts:
        warn.append(f"[33] {cid}（{mmss(st)}〜）한 컷 {d:.0f}초 → 중간에 새 숫자·질문·화면 전환을 넣었는지 확인")
    if not long_cuts:
        ok.append(f"[33] {args.max_run:.0f}초를 넘는 컷 없음")

    # 34: 마지막 20%에서 앞의 나열（짧은 항목 3개 이상이 이어진 목록）을 내레이션으로 다시 나열
    def item(t: str) -> str:
        return re.sub(r"^(そして|さらに|まず|そこから)、", "", re.sub(r"[。「」]", "", t))
    early = [x for x in segs if x[2] < total * 0.8]
    short = [len(item(x[1])) <= 8 and x[1].endswith("。") for x in early]
    items, i = set(), 0
    while i < len(early):
        j = i
        while j < len(early) and short[j]:
            j += 1
        if j - i >= 3:
            items |= {item(x[1]) for x in early[i:j] if len(item(x[1])) >= 2}
        i = max(j, i + 1)
    for sg in segs:
        if sg[2] >= total * 0.8:
            hit = [w for w in items if w in sg[1]]
            if len(hit) >= 3:
                warn.append(f"[34] 마지막 20% {mmss(sg[2])} {sg[0]} 「{sg[1]}」 → 앞에서 나열한 항목({'・'.join(hit)})을 내레이션으로 다시 나열(화면으로 처리)")

    # 34: 마지막 20%의 요약 표현
    tail_from = total * 0.8
    recap = [s for s in segs if s[2] >= tail_from and any(w in s[1] for w in RECAP)]
    for s in recap:
        warn.append(f"[34] 마지막 20% {mmss(s[2])} {s[0]} 「{s[1]}」 → 요약 표현")
    if not recap:
        ok.append(f"[34] 마지막 20%（{mmss(tail_from)}〜）에 요약 표현 없음")

    # 34: 최종 답 → 엔딩 60초 이내
    ans = next((s for s in segs if s[2] >= total * 0.7 and s[1].startswith("答えは")), None)
    end = next((s for s in segs if "身近なお金には" in s[1]), None)
    if ans and end:
        gap = end[2] - ans[2]
        (ok if gap <= 60 else warn).append(f"[34] 최종 답 {mmss(ans[2])} → 엔딩 {mmss(end[2])}: {gap:.0f}초" + ("" if gap <= 60 else " → 60초를 넘음"))
    else:
        warn.append("[34] 최종 답（「答えは」로 시작, 70% 이후）또는 엔딩 문장을 찾지 못함")

    print(f"== {args.case}  길이 {mmss(total)}（{'실측' if measured else '추정'}）")
    for w in ok:
        print("  OK  ", w)
    for w in warn:
        print("  WARN", w)


if __name__ == "__main__":
    main()
