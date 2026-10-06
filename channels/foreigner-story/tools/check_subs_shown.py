"""화면에 실제로 나오는 자막 기준 검사(04 E9): assemble.py 와 같은 규칙으로 클립마다 표시될 자막을 정하고
 ① 클립 안에서 말했는데 표시 자막에 안 덮인 단어(받아쓰기 기준)  ② 0.8초 미만으로 잘려 보이는 자막 조각
 ③ 클립 경계에서 말이 잘리는 곳(클립 끝 0.3초 안에 단어가 걸침)을 찾는다.
사용: python3 check_subs_shown.py <plan.json> <cues_all.json> <words_dir>"""
import json, sys
from pathlib import Path
def sec(t): m, s = t.split(":"); return int(m) * 60 + float(s)
plan, cues, wd = json.load(open(sys.argv[1])), json.load(open(sys.argv[2])), Path(sys.argv[3])
W = {}
n_miss = n_frag = n_cut = 0
for k, it in enumerate(plan["items"]):
    if it["type"] != "clip": continue
    ep = it["ep"]; a, b = map(sec, it["src"])
    if ep not in W: W[ep] = [w for s in json.load(open(wd / f"{ep}.words.json")) for w in s["words"]]
    shown = [c for c in cues if c.get("ep") == ep and c["kind"] == "Y" and min(c["s1"], b) - max(c["s0"], a) > 0.3]
    for c in shown:
        vis = min(c["s1"], b) - max(c["s0"], a)
        if vis < 0.8: n_frag += 1; print(f"[조각] item{k} {ep} {it['src']} {vis:.2f}s {c['ja'][:24]}")
    for w in W[ep]:
        if a + 0.05 <= w["s"] < b - 0.05 and len(w["w"].strip(" ,.?!")) > 2 and \
           not any(max(c["s0"], a) - 0.3 <= w["s"] <= min(c["s1"], b) + 0.3 for c in shown):
            n_miss += 1; print(f"[자막없음] item{k} {ep} {it['src']} {w['s']:.1f} {w['w']}")
        if w["s"] < b < w["e"] - 0.05 or w["s"] < a < w["e"] - 0.05:
            n_cut += 1; print(f"[말 잘림] item{k} {ep} {it['src']} {w['s']:.2f}-{w['e']:.2f} {w['w']}")
print(f"자막없음 {n_miss} / 조각 {n_frag} / 말 잘림 {n_cut}")
