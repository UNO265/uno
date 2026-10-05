"""(ep, 대략 시각, 영어 원문, ja, ko) → 단어 시각으로 s0/s1 를 정한다.
영어 원문의 첫 단어들·마지막 단어들을 대략 시각 ±20초 안에서 찾는다."""
import json, re
from pathlib import Path
W = {}
def words(ep):
    if ep not in W:
        d = json.load(open(f"/home/user/media/case003/work/{ep}.words.json"))
        W[ep] = [(w["s"], w["e"], re.sub(r"[^a-z0-9%]", "", w["w"].lower())) for s in d for w in s["words"]]
    return W[ep]
def norm(t):
    return [x for x in (re.sub(r"[^a-z0-9%]", "", w.lower()) for w in t.split()) if x]
def find(ep, t, en):
    ws = words(ep); toks = norm(en); n = len(toks)
    best = None
    for i in range(len(ws)):
        if abs(ws[i][0] - t) > 20: continue
        k = 0; j = i; hit = 0
        while k < n and j < len(ws):
            if ws[j][2] == toks[k]: hit += 1
            k += 1; j += 1
        sc = hit / n - abs(ws[i][0] - t) / 400
        if best is None or sc > best[0]: best = (sc, i, j - 1)
    sc, i, j = best
    return ws[i][0], ws[j][1], sc
def build(ep, rows):
    out = []
    for t, en, ja, ko in rows:
        a, b, sc = find(ep, t, en)
        if sc < 0.6: print(f"! 낮은 일치 {sc:.2f} {ep} {t} {en}")
        out.append(dict(ep=ep, s0=round(a, 2), s1=round(b, 2), kind="Y", spk="M", ja=ja, ko=ko, en=en))
    return out
def dump(ep, a, b):
    for s, e, w in words(ep):
        pass
    d = json.load(open(f"/home/user/media/case003/work/{ep}.words.json"))
    for seg in d:
        for w in seg["words"]:
            if a <= w["s"] < b: print(f"{w['s']:.2f}{w['w']}", end=" ")
    print()
