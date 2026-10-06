"""cues_ep*.json(use=true) + 장 구성 → plan_v<N>.json (assemble.py 입력).
클립 = 사용하는 자막을 4초 이내 간격으로 묶은 구간(앞 0.4초·뒤 0.5초 여유) + EXTRA(말 없는 화면, 예: 조립 장면).
사용: python3 build_plan.py <out.json>"""
import json, sys
from pathlib import Path
H = Path(__file__).parent
def mmss(t): return f"{int(t // 60):02d}:{t % 60:05.2f}"
EXTRA = {  # 말이 없어도 꼭 보여 줄 화면(원본 시각, 초)
    "Ep24": [(1384.6, 1404.0)],           # 가게 도착 → 정비사가 바퀴를 봄
    "Ep27": [(69.0, 101.6)],              # 다케치 사이클에서 림 조립
    "Ep28": [(2382.0, 2397.4)],           # 비 오는 날의 벚꽃
}
CH = [  # (ep, 카드 큰 글자, 카드 작은 글자, 카드 배경 시각, 첫 클립 라벨)
    ("Ep24", "何かおかしい", "今治 → 四国中央", "17:20.00", "今治"),
    ("Ep25", "ヒビ7か所で、70キロ", "四国中央 → 高松 → 直島", "06:35.00", "四国中央"),
    ("Ep26", "倉敷まで、もってくれ", "直島 → 宇野 → 倉敷", "24:30.00", "直島"),
    ("Ep27", "完全に、静か", "倉敷", "01:20.00", "倉敷"),
    ("Ep28", "雨の再出発", "倉敷 → 津山", "39:50.00", "倉敷"),
]
NARR = {  # (ep, 이 시각 이후 첫 클립 앞에 정지 화면 내레이션)
    ("Ep24", 1426.0): ("24:00.00", "リムとは、タイヤをはめる、ホイールの外側の輪のことです。"),
}
WORDS = {}
def words(ep):
    if ep not in WORDS:
        WORDS[ep] = sorted((w["s"], w["e"]) for g in json.load(open(f"/home/user/media/case003/work/{ep}.words.json")) for w in g["words"])
    return WORDS[ep]
def snap(ep, a, b):
    """클립 경계를 단어에 맞춘다: 경계에 걸친 단어는 통째로 넣고(시작은 그 단어 앞, 끝은 그 단어 뒤),
    여유(앞 0.4·뒤 0.5초)는 바로 앞·뒤 단어에 닿기 0.1초 전까지만."""
    ws = words(ep)
    for s0, e0 in ws:                      # 경계에 걸친 단어 → 포함
        if s0 < a < e0: a = s0
        if s0 < b < e0: b = e0
    prev_end = max([e0 for s0, e0 in ws if e0 <= a + 1e-6] or [a - 1])
    next_start = min([s0 for s0, e0 in ws if s0 >= b - 1e-6] or [b + 1])
    a2 = max(a - 0.4, prev_end + 0.1) if prev_end < a else a
    b2 = min(b + 0.5, next_start - 0.1) if next_start > b else b
    return round(min(a, a2), 2), round(max(b, b2), 2)
def clips(ep):
    c = sorted([x for x in json.load(open(H / f"cues_{ep.lower()}.json")) if x.get("use", True)], key=lambda x: x["s0"])
    spans = [[x["s0"], x["s1"]] for x in c] + [list(e) for e in EXTRA.get(ep, [])]
    spans.sort()
    out = []
    for a, b in spans:
        if out and a - out[-1][1] < 4.9: out[-1][1] = max(out[-1][1], b)
        else: out.append([a, b])
    return [list(snap(ep, a, b)) for a, b in out]
def snapped(ep, a, b):
    a, b = snap(ep, sec_(a), sec_(b)); return [mmss(a), mmss(b)]
def sec_(t): return int(t[:2]) * 60 + float(t[3:])
TITLE = "{\\fs60}リムに7つのヒビ…\\N{\\fs48}日本縦断中のフィンランド人は、倉敷までたどり着けるのか"
items = [  # 0장: 첫 30초(나중 장면을 먼저 — 그 장면의 발언만, 02 T5)
    dict(type="clip", ep="Ep24", src=snapped("Ep24", "23:33.00", "23:37.40"), audio="vocals"),
    dict(type="clip", ep="Ep24", src=snapped("Ep24", "23:56.88", "24:08.35"), audio="vocals"),
    dict(type="clip", ep="Ep26", src=snapped("Ep26", "27:28.20", "27:46.70"), audio="vocals"),
    dict(type="card", dur=4.0, ep="Ep24", bg="24:02.00", big=TITLE, small=""),
    # 프롤로그: 1년 반 만에 다시 달리는 길(Ep23)
    dict(type="freeze", ep="Ep23", at="16:15.50",
         narr="フィンランドに住むマルクスさん。鹿児島から札幌まで、3か月かけて、自転車で日本を縦断しています。"),
] + [dict(type="clip", ep="Ep23", src=[mmss(a), mmss(b)], audio="vocals", **({"label": "しまなみ海道"} if k == 0 else {}))
     for k, (a, b) in enumerate(clips("Ep23"))]
for i, (ep, big, small, bg, label) in enumerate(CH, 1):
    items.append(dict(type="card", dur=4.0, ep=ep, bg=bg, big=f"{{\\fs40}}第{i}章\\N{{\\fs84}}{big}", small=small))
    for k, (a, b) in enumerate(clips(ep)):
        for (nep, at), (fr, text) in NARR.items():
            if nep == ep and a <= at < b:
                pass
        it = dict(type="clip", ep=ep, src=[mmss(a), mmss(b)], audio="vocals")
        if k == 0: it["label"] = label
        items.append(it)
        for (nep, at), (fr, text) in NARR.items():
            if nep == ep and a <= at < b:
                items.append(dict(type="freeze", ep=ep, at=fr, narr=text))
plan = dict(note="CASE #003 v3: 클립 경계를 단어 시각에 맞춤(말 잘림·자막 조각 제거), 첫 30초 클립 재설정, 겹치는 자막 모두 표시. / v2: v1 + 내레이션 정지 화면 24:00, 자막 분할 시점 단어 기준, 번역 2곳 수정(タケチ・バイクス, 木曜日に開くということだった).",
            frame="fill", narr_speed=1.25, stems_dir="/home/user/media/case003/stems",
            credit="映像：Markus Kiili（YouTube）", speakers={"M": "マルクス"},
            readings={"鹿児島": "かごしま", "札幌": "さっぽろ", "3か月": "さんかげつ", "四国中央": "しこくちゅうおう", "直島": "なおしま", "宇野": "うの", "津山": "つやま"},
            items=items)
json.dump(plan, open(sys.argv[1], "w"), ensure_ascii=False, indent=1)
n = sum(1 for x in items if x["type"] == "clip")
from datetime import timedelta
tot = sum((lambda a, b: (int(b[:2]) * 60 + float(b[3:])) - (int(a[:2]) * 60 + float(a[3:])))(*x["src"]) for x in items if x["type"] == "clip")
print(f"items {len(items)}, clips {n}, clip total {tot / 60:.1f} min")

# BGM 배치(bgm_bed.py 입력) — 곡은 audio-credits.md 의 선정곡
B = "/home/user/media/case003/bgm/"
card = [i for i, x in enumerate(items) if x["type"] == "card"]   # 0:제목, 1~5:장
freeze0 = next(i for i, x in enumerate(items) if x["type"] == "freeze")
bgm = dict(tracks={"A": B + "A_Stay the Course.mp3", "B": B + "B_Morning.mp3", "C": B + "C_Beauty Flow.mp3",
                   "D": B + "D_Carefree.mp3", "E": B + "E_Danse Morialta.mp3", "F": B + "F_Fretless.mp3",
                   "G": B + "G_The Parting.mp3"},
           cues=[dict(item=0, track="A"),                               # 첫 30초: 조용한 긴장
                 dict(item=freeze0, track="B"),                         # 프롤로그: 잔잔한 여행
                 dict(item=card[1], track="B", **{"from": 40.0}),       # 1장 앞부분(가벼운 주행)
                 dict(ep="Ep24", t=1020.0, track="A"),                  # 「何かおかしい」부터 긴장
                 dict(item=card[2], track="C"),                         # 2장: 담담하게 버티며
                 dict(item=card[3], track="C", **{"from": 120.0}),      # 3장
                 dict(ep="Ep26", t=332.7, track="D"),                   # 전기자전거 웃음
                 dict(ep="Ep26", t=771.0, track="C", **{"from": 200.0}),
                 dict(ep="Ep26", t=1452.4, track="E"),                  # 「これはひどい」 바닥
                 dict(ep="Ep26", t=1762.7, track="F"),                  # 「帰ってきたような」 구라시키
                 dict(item=card[4], track="A", **{"from": 60.0}),       # 4장: 림 도착, 불안
                 dict(ep="Ep27", t=95.5, track="F", **{"from": 30.0}),  # 「いい感じ。大丈夫だ」 안도
                 dict(item=card[5], track="G"),                         # 5장: 비 속 재출발 → 엔딩
                 ])
json.dump(bgm, open(Path(sys.argv[1]).with_name("bgm_" + Path(sys.argv[1]).stem.split("_")[-1] + ".json"), "w"), ensure_ascii=False, indent=1)
