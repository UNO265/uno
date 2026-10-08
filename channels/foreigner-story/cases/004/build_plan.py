"""CASE #004 plan 만들기: clips.json(편집점) + cues_v1.json + narr_v1.json → plan_v1.json
- 클립 경계: 클립과 절반 이상 겹치는 자막은 통째로 들어오게 넓히고(앞 0.3초·뒤 0.4초), 단어 중간이면 단어 끝까지 넓힌다.
사용: python3 build_plan.py <out.json>"""
import json, sys
from pathlib import Path
H = Path(__file__).parent; M = Path("/home/user/media/case004c")
def mmss(t): return f"{int(t // 60):02d}:{t % 60:05.2f}"
clips = json.load(open(M / "clips.json")); cues = json.load(open(H / "cues_v1.json"))
narr = json.load(open(H / "narr_v1.json"))["lines"]; N = [x[1] for x in narr]
W = {ep: [w for s in json.load(open(M / f"words_{ep}.json")) for w in s["w"]] for ep in ("O", "T")}
CAP = {("O", 392.0): 425.9, ("O", 2241.0): 2252.9, ("O", 3143.0): 3173.7, ("O", 3099.0): 3115.0, ("O", 1467.0): 1512.3,  # 클립 끝의 관계없는 말(구독 요청·다음 장소 이야기 등)은 자른다
       ("T", 282.0): 306.2, ("T", 610.0): 629.0, ("T", 917.0): 941.5, ("T", 1071.0): 1108.7, ("T", 1018.0): 1023.7, ("O", 162.0): 180.5,
       ("O", 1885.0): 1956.2, ("T", 417.0): 546.8}
START = {("O", 392.0): 399.40, ("O", 2319.0): 2314.75, ("T", 189.0): 184.75}   # 문장 첫머리가 클립 앞에 있으면 클립을 앞당긴다
def fit(i, ep, a, b):
    cap = CAP.get((ep, a))
    a = START.get((ep, a), a)
    if cap: b = min(b, cap)
    if i == 1: return a, b                                   # 첫 장면 「Welcome to Tokyo」는 짧게
    inc = []
    for _ in range(3):                                       # 자막은 통째로 넣거나 통째로 뺀다(절반 기준)
        for c in cues:
            if c["ep"] != ep: continue
            ov = min(c["s1"], b) - max(c["s0"], a)
            if ov <= 0: continue
            if ov >= 0.5 * (c["s1"] - c["s0"]) and not (cap and c["s0"] >= cap):
                a, b = min(a, c["s0"] - 0.25), max(b, c["s1"] + 0.35)
                if c not in inc: inc.append(c)
            elif c["s0"] < a: a = c["s1"] + 0.05
            else: b = c["s0"] - 0.05
    ws = sorted(W[ep]); gaps = [(x[1] + y[0]) / 2 for x, y in zip(ws, ws[1:]) if y[0] - x[1] >= 0.2]
    gaps += [(x[1] + y[0]) / 2 for x, y in zip(ws, ws[1:]) if 0 <= y[0] - x[1] < 0.2]   # 쉬는 곳이 없으면 단어 사이
    cov = lambda t: any(c["s0"] - 0.3 <= t <= c["s1"] + 0.3 for c in inc)
    def word_at(t): return next((w for w in ws if w[0] - 0.05 < t < w[1] + 0.05), None)
    back = lambda t, lo: max((g for g in gaps if t - 2.5 <= g <= lo), default=None)
    fwd = lambda t, hi: min((g for g in gaps if hi <= g <= t + 2.5), default=None)
    w = word_at(a)
    if w:                                                    # 단어 중간이면: 자막 있는 말이면 넓히고, 없으면 그 말을 빼고 자른다(2.5초 안)
        c = cov((w[0] + w[1]) / 2)
        a = (back(a, w[0]) if c else fwd(a, w[1])) or (fwd(a, w[1]) if c else back(a, w[0])) or a
    w = word_at(b)
    if w:
        c = cov((w[0] + w[1]) / 2)
        b = (fwd(b, w[1]) if c else back(b, w[0])) or (back(b, w[0]) if c else fwd(b, w[1])) or b
    return round(a, 2), round(b, 2)
CARDS = {2: ("第1章", "アナウンスがわからない", "大阪・鶴橋", "O", "01:05.00"), 7: ("第2章", "数量限定", "大阪城の近く", "O", "07:40.00"),
         14: ("第3章", "大阪城と、初めての自販機", "", "O", "20:05.00"), 20: ("第4章", "びしょびしょ事件", "鶴橋", "O", "31:50.00"),
         22: ("第5章", "わさびがない？", "大阪・はじめての回転寿司", "O", "38:50.00"), 31: ("第6章", "45キロの荷物", "鶴橋 → 新大阪", "T", "01:10.00"),
         36: ("第7章", "改札が開かない", "新大阪駅", "T", "06:10.00"), 38: ("第8章", "時速300キロ", "新大阪 → 品川", "T", "10:15.00"),
         41: ("第9章", "東京", "品川", "T", "17:00.00")}
BEFORE = {2: [2], 3: [], 6: [6], 7: [8], 8: [10], 9: [9], 14: [11, 12], 16: [13], 18: [14], 20: [15, 16], 22: [17],
          23: [18], 25: [19], 31: [21], 32: [22], 33: [23], 36: [24], 37: [25], 38: [27], 39: [28], 40: [29]}
AFTER = {1: [0, 1], 2: [4], 6: [7], 30: [20], 37: [26], 42: [30, 31]}
LABEL = {2: "大阪・鶴橋", 7: "大阪城の近く", 14: "大阪城", 22: "大阪", 31: "大阪・鶴橋", 36: "新大阪駅", 41: "品川駅"}
FREEZE_AT = {29: ("T", "10:55.00")}   # 후지산 문장: 화장실 화면 대신 창밖 화면
HOOK = [("T", 463.95, 466.75), ("T", 469.85, 480.05), ("O", 1910.13, 1915.85), ("T", 94.20, 103.45), ("O", 771.92, 777.85)]  # 첫 20초: 사건 몽타주(#002 지속 그래프 근거)
items = []
SKIP = {3, 5}                                                # v2: 도입을 빠르게(목표 팬케이크·「다들 친절」 장면 뺌)
for i, (ch, ep, a, b) in enumerate(clips):
    if i in SKIP: continue
    if i in (0, 1):                                          # v2: 원래 첫 장면 대신 사건 몽타주 + 질문 + 제목
        if i == 1:
            for e, x, y in HOOK:
                items.append(dict(type="clip", ep=e, src=[mmss(x), mmss(y)], audio="vocals"))
            for k in AFTER[1]:
                items.append(dict(type="freeze", ep="T", at="07:44.20", narr=N[k]))
        continue
    a, b = fit(i, ep, a, b)
    if i in CARDS:
        n, big, small, cep, bg = CARDS[i]
        items.append(dict(type="card", dur=3.5, ep=cep, bg=bg, big="{\\fs40}" + n + "\\N{\\fs84}" + big, small=small))
    for k in BEFORE.get(i, []):
        fe, fat = FREEZE_AT.get(k, (ep, mmss(a + 0.5)))
        items.append(dict(type="freeze", ep=fe, at=fat, narr=N[k]))
    it = dict(type="clip", ep=ep, src=[mmss(a), mmss(b)], audio="vocals")
    if i in LABEL: it["label"] = LABEL[i]
    items.append(it)
    for k in AFTER.get(i, []):
        items.append(dict(type="freeze", ep=ep, at=mmss(b - 0.5), narr=N[k]))
used = sorted({k for v in list(BEFORE.values()) + list(AFTER.values()) for k in v})
DROP = {3, 5}                                                   # v2: 안 쓰는 내레이션
assert used == [k for k in range(len(N)) if k not in DROP], set(range(len(N))) - set(used) - DROP
plan = dict(note="CASE #004 v1: 구성안 v2 + 내레이션 v1 + 자막 v1(검수 전)", frame="fill", narr_speed=1.25,
            stems_dir=str(M / "stems"), credit="映像：World Family Explorers（YouTube）",
            speakers={"C": "クリス", "E": "エリー", "B": "息子", "J": "店員さん"},
            speaker_colors={"C": "FF8A00", "E": "FFF680", "B": "FFD400", "J": "8EE070"},
            readings=json.load(open(H / "narr_v1.json"))["readings"], items=items)
json.dump(plan, open(sys.argv[1], "w"), ensure_ascii=False, indent=1)
def sec(t): m, s = t.split(":"); return int(m) * 60 + float(s)
src = sum(sec(x["src"][1]) - sec(x["src"][0]) for x in items if x["type"] == "clip")
nar = sum(x[3] + 1.1 for k, x in enumerate(narr) if k not in DROP); cards = sum(x["dur"] for x in items if x["type"] == "card")
print(f"클립 {src/60:.1f}분, 내레이션 {nar/60:.1f}분, 카드 {cards:.0f}초 → 약 {(src+nar+cards)/60:.1f}분, 내레이션 {nar/(src+nar+cards)*100:.0f}%")
