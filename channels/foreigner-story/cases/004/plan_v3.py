"""CASE #004 plan v3 (2026-10-08 자막 최종 검수 반영): plan_v2.json 의 클립 경계는 그대로 두고(음원 분리 결과 재사용)
- 글자 크기 1.6배(대사 80·내레이션 70)·화자 색(하늘·분홍·노랑·초록) — 사용자 확정
- 13:02 내레이션의 정지 화면이 원본의 검은 컷(O 37:21.5)이라 37:23.0 으로
- 원본 화면 글자(요금 표시)와 겹치는 구간은 자막을 위로(sub_top, 출력 시각)
사용: python3 plan_v3.py <plan_v2.json> <plan_v3.json>"""
import json, sys
p = json.load(open(sys.argv[1]))
p.update(note="CASE #004 v3: 시청자 고령층·TV 65.7% → 대사 80·내레이션 70(사용자 확정)·화자 색 색상 분리·내레이션 1.1배속",
         font_scale=1.6, narr_line_chars=17,
         speaker_colors={"C": "5CC8FF", "E": "FF80C0", "B": "FFE600", "J": "7CE07C"},
         sub_top=[[91.2, 95.8], [390.2, 393.8], [646.5, 650.1], [799.3, 801.7], [1675.3, 1678.4]])
fz = [it for it in p["items"] if it["type"] == "freeze" and it["ep"] == "O" and it["at"] == "37:21.50"]
assert len(fz) == 1
fz[0]["at"] = "37:23.00"
json.dump(p, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
print("plan v3 →", sys.argv[2])
