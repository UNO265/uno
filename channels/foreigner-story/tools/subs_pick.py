"""시트 검수 대상 고르기 — 의심 구간 + 아이 대사 + 무작위 20% (04 E9-3, 2026-10-08 사용자 결정).

자동 검사(subs_zoom 의 report.txt) + 화자 판별(spk_assign 의 spk_conf) + 화면 검사(검은 화면)로
「눈으로 봐야 하는 16초 창」만 고른다. 나머지 창 중 20%를 무작위로(고정 시드) 더한다.
무작위 창에서 오류가 하나라도 나오면, 그 창이 속한 장(카드~다음 카드) 전체를 본다(사람이 판단해 --to 로 넓힘).

사용: python3 subs_pick.py <case_dir> <out.ass> <cues.json> [--rate 0.2] > windows.txt
      python3 subs_zoom.py <case_dir> <out.ass> --windows windows.txt
"""
import json, random, re, subprocess, sys
from pathlib import Path

STEP = 15


def main():
    case, ass, cues_p = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
    rate = float(sys.argv[sys.argv.index("--rate") + 1]) if "--rate" in sys.argv else 0.2
    items = json.load(open(ass.with_suffix(".timeline.json")))["items"]
    total = max(i["start"] + i["dur"] for i in items)
    why = {}
    def flag(t, r): why.setdefault(int(t // STEP) * STEP, set()).add(r)
    # ① 자동 검사(어긋남·자막 없는 말)
    rep = case / f"zoom_{ass.stem}" / "report.txt"
    if rep.exists():
        for l in open(rep, encoding="utf8"):      # 인식 오차(±0.3초)·감탄사 한마디는 빼고, 실제로 볼 만한 것만
            m = re.match(r"(\d+):(\d+\.\d+)", l)
            if not m: continue
            t = int(m[1]) * 60 + float(m[2])
            big = [float(v) for k, v in re.findall(r"(자막먼저|자막늦음|말이남음)([\d.]+)", l) if float(v) >= 1.0]
            big += [float(v) for v in re.findall(r"자막길게([\d.]+)", l) if float(v) >= 2.0]
            if big or "말 없음" in l: flag(t, "싱크")
            g = re.match(r"\d+:[\d.]+-\d+:[\d.]+ \(([\d.]+)s\) (.*)", l)
            if g and float(g[1]) >= 1.0 and len(g[2].split()) >= 3: flag(t, "자막없는말")
    # ② 화자 애매·나눈 줄·아이 대사
    def sec(x): mm, s = x.split(":"); return int(mm) * 60 + float(s)
    for c in json.load(open(cues_p)):
        for it in items:
            if it["type"] == "clip" and it.get("ep") == c.get("ep") and sec(it["src"][0]) <= c["s0"] < sec(it["src"][1]):
                t = it["start"] + c["s0"] - sec(it["src"][0])
                if c.get("spk_conf") == "low": flag(t, "화자애매")
                if c.get("split_from"): flag(t, "나눈줄")
                if c.get("spk") == "B": flag(t, "아이")
    # ③ 검은 화면(0.4초 이상) — 원본 컷·정지 화면 실수
    srcs = json.load(open(case / "sources.json"))
    for it in items:
        if it["type"] == "freeze":
            out = subprocess.run(["ffmpeg", "-v", "error", "-ss", it["at"], "-i", srcs[it["ep"]], "-frames:v", "1", "-vf",
                                  "scale=32:18,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
            if out and sum(out) / len(out) < 20: flag(it["start"], "검은정지화면")
    picked = sorted(why)
    rest = [w for w in range(0, int(total), STEP) if w not in why]
    random.Random(4).shuffle(rest)
    rnd = sorted(rest[:round(len(rest) * rate)])
    for w in picked: print(w, ",".join(sorted(why[w])))
    for w in rnd: print(w, "무작위")
    print(f"# 의심 {len(picked)}창 + 무작위 {len(rnd)}창 / 전체 {len(range(0, int(total), STEP))}창", file=sys.stderr)


if __name__ == "__main__":
    main()
