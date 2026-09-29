"""육영수 편 「육영수를 맞힌 총알은 어디로 갔나」: data/yuk/cuts.json → 내레이션·자막 → public/yuk/timeline.json.

정조 편 파이프라인(jeongjo.py)을 그대로 쓰고 이름·읽기표·등급 표시만 바꾼다.
- 등급 표시: 【기록】【증언】【주장】【미공개】【해석】 — 그 문장부터 컷 끝까지 화면 왼쪽 위에 보인다.
- scene "silent": 내레이션 없는 컷(고지 카드·제목), 길이는 dur.

  python3 scripts/yuk.py            # 음성·타임라인
  python3 scripts/yuk.py --sound    # 소리
"""
import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import jeongjo as J  # noqa: E402

J.NAME = "yuk"
J.OUT = ROOT / "public/yuk"
J.TAGS = "기록|증언|주장|미공개|해석"
# 자막은 숫자, 읽기는 한글. 고유어로 읽거나 쉼표가 든 숫자는 여기서 정한다.
J.SPEAK = {
    "「암살자(들)」": "암살자들",
    "「들」": "들",
    "1,000여 명": "천여 명",
    "3,000쪽": "삼천 쪽",
    "100만 명": "백만 명",
    "6가지": "여섯 가지",
    "오후 7시": "오후 일곱 시",
    "3개월": "삼 개월",
    "「청와대 안의 야당」": "청와대 안의 야당",
}

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--sound", action="store_true")
    if ap.parse_args().sound:
        import yuk_sound

        yuk_sound.main()
    else:
        J.build()
