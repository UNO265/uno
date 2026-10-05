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
    ("Ep24", 1426.0): ("23:57.50", "リムとは、タイヤをはめる、ホイールの外側の輪のことです。"),
}
def clips(ep):
    c = sorted([x for x in json.load(open(H / f"cues_{ep.lower()}.json")) if x.get("use", True)], key=lambda x: x["s0"])
    spans = [[x["s0"] - 0.4, x["s1"] + 0.5] for x in c] + [list(e) for e in EXTRA.get(ep, [])]
    spans.sort()
    out = []
    for a, b in spans:
        if out and a - out[-1][1] < 4: out[-1][1] = max(out[-1][1], b)
        else: out.append([a, b])
    return out
TITLE = "{\\fs60}リムに7つのヒビ…\\N{\\fs48}日本縦断中のフィンランド人は、倉敷までたどり着けるのか"
items = [  # 0장: 첫 30초(나중 장면을 먼저 — 그 장면의 발언만, 02 T5)
    dict(type="clip", ep="Ep24", src=["23:33.00", "23:38.00"], audio="vocals"),
    dict(type="clip", ep="Ep24", src=["23:58.40", "24:08.80"], audio="vocals"),
    dict(type="clip", ep="Ep26", src=["27:27.90", "27:46.90"], audio="vocals"),
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
plan = dict(note="CASE #003 v1: 초벌(0장 첫 30초·프롤로그·1~5장).",
            frame="fill", narr_speed=1.25, stems_dir="/home/user/media/case003/stems",
            credit="映像：Markus Kiili（YouTube）", speakers={"M": "マルクス"},
            readings={"鹿児島": "かごしま", "札幌": "さっぽろ", "3か月": "さんかげつ", "四国中央": "しこくちゅうおう", "直島": "なおしま", "宇野": "うの", "津山": "つやま"},
            items=items)
json.dump(plan, open(sys.argv[1], "w"), ensure_ascii=False, indent=1)
n = sum(1 for x in items if x["type"] == "clip")
from datetime import timedelta
tot = sum((lambda a, b: (int(b[:2]) * 60 + float(b[3:])) - (int(a[:2]) * 60 + float(a[3:])))(*x["src"]) for x in items if x["type"] == "clip")
print(f"items {len(items)}, clips {n}, clip total {tot / 60:.1f} min")
