"""자막 형식 맞추기(04 E9): 한 줄 22자 이하·두 줄까지, 표시 시간 ≥ 0.8초+0.09초×글자 수.
- 44자를 넘으면 문장 부호(。？！ → 、)에서 두 자막으로 나누고, 원본 단어 시각으로 나눌 시점을 정한다.
- 22자를 넘으면 가운데에 가까운 문장 부호 뒤에서 \\N 으로 줄을 바꾼다(없으면 가운데).
여러 번 돌려도 결과가 같다. 사용: python3 normalize_cues.py cues_ep*.json"""
import json, re, sys

import os
MAX = int(os.environ.get("SUB_MAX", 22))
WORDS = {}   # 환경 변수 WORDS_DIR 에 words_<ep>.json 이 있으면 나누는 시점을 단어 시작에 맞춘다
if os.environ.get("WORDS_DIR"):
    for _ep in ("O", "T"):
        _p = os.path.join(os.environ["WORDS_DIR"], f"words_{_ep}.json")
        if os.path.exists(_p):
            WORDS[_ep] = [w for _s in json.load(open(_p)) for w in _s["w"]]   # 한 줄 글자 수(#004: 20 — 글자를 키워서)


def plain(s):
    return s.replace("\\N", "")


def best_cut(s, lo, hi, marks="。？！、」"):
    mid = len(s) / 2
    cands = [i + 1 for i, ch in enumerate(s) if ch in marks and lo <= i + 1 <= hi and (i + 1 >= len(s) or s[i + 1] not in "」』）")]
    return min(cands, key=lambda i: abs(i - mid)) if cands else None


from janome.tokenizer import Tokenizer
TK = Tokenizer()


def soft_cut(s, lo, hi):
    """문장 부호가 없을 때: 형태소 분석으로 조사·조동사 뒤(다음이 조사·조동사·닫는 괄호가 아닌 곳)에서만 자른다."""
    toks = list(TK.tokenize(s))
    pos, cuts = 0, []
    for a, b in zip(toks, toks[1:]):
        pos += len(a.surface)
        pa, pb = a.part_of_speech.split(",")[0], b.part_of_speech.split(",")[0]
        if pa in ("助詞", "助動詞") and pb not in ("助詞", "助動詞", "記号") and b.surface[0] not in "」』）。、？！" and "接尾" not in b.part_of_speech:
            if lo <= pos <= hi:
                cuts.append(pos)
    mid = len(s) / 2
    return min(cuts, key=lambda i: abs(i - mid)) if cuts else None


def wrap_cut(s):
    lo, hi = max(len(s) - MAX, 6), min(MAX, len(s) - 6)      # 한쪽 줄이 6자 미만이 되게 자르지 않는다
    return best_cut(s, lo, hi) or soft_cut(s, lo, hi)


def wrap(s):
    s = plain(s)
    if len(s) <= MAX:
        return s
    k = wrap_cut(s)
    return s[:k] + "\\N" + s[k:]


def split(c):
    s = plain(c["ja"])
    if len(s) <= MAX or (len(s) <= 2 * MAX and wrap_cut(s)):
        return [c]
    k = best_cut(s, 1, len(s) - 1, "。？！") or best_cut(s, 1, len(s) - 1) or soft_cut(s, 1, len(s) - 1) or len(s) // 2
    t = c["s0"] + (c["s1"] - c["s0"]) * k / len(s)
    ws = [w for w in WORDS.get(c.get("ep"), []) if c["s0"] + 0.3 < w[0] < c["s1"] - 0.3]
    if ws:                                   # 글자 비율로 잡은 시점을 가장 가까운 단어 시작으로(싱크, #004 v2부터)
        t = min((w[0] for w in ws), key=lambda x: abs(x - t))
    a = dict(c, ja=s[:k], s1=round(t - 0.05, 2))
    b = dict(c, ja=s[k:], s0=round(t, 2))
    return split(a) + split(b)


for p in sys.argv[1:]:
    cues = sorted(json.load(open(p)), key=lambda x: x["s0"])
    out = [x for c in cues for x in split(c)]
    for i, c in enumerate(out):
        c["ja"] = wrap(c["ja"])
        need = 0.8 + 0.09 * len(plain(c["ja"]))
        nxt = out[i + 1]["s0"] - 0.05 if i + 1 < len(out) else c["s0"] + need
        if c["s1"] - c["s0"] < need:
            c["s1"] = round(min(c["s0"] + need, max(c["s1"], nxt)), 2)
    json.dump(out, open(p, "w"), ensure_ascii=False, indent=1)
    bad = [c for c in out if any(len(l) > MAX for l in c["ja"].split("\\N")) or c["ja"].count("\\N") > 1]
    short = [c for c in out if c["s1"] - c["s0"] < 0.8 + 0.09 * len(plain(c["ja"])) - 0.01]
    print(p, len(cues), "→", len(out), "| 넘침", len(bad), "| 짧음(다음 자막 때문에 못 늘림)", len(short))
    for c in short:
        print("   짧음", c["s0"], c["ja"])
