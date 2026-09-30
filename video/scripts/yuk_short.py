"""육영수 편 쇼츠(1080×1920): data/yuk_short/cuts.json → public/yuk_short/timeline.json + 소리.

본편 파이프라인(yuk.py → jeongjo.py)을 그대로 쓰고, 쇼츠에 맞게 조금 빠르게 읽고(1.0배, 문장 사이 0.3초)
자막 한 줄을 16자로 줄인다(세로 화면). BGM·효과음은 yuk_sound 의 곡을 sec 이름으로 다시 쓴다.

  python3 scripts/yuk_short.py            # 음성·타임라인
  python3 scripts/yuk_short.py --sound    # 소리
  npx remotion render src/yuk/short-index.ts YukShort out/yuk_short.mp4 --gl=angle
"""
import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import yuk  # noqa: E402  (읽기표·등급·음성인식 보정을 그대로 가져온다)

J = yuk.J
J.NAME = "yuk_short"
J.OUT = ROOT / "public/yuk_short"
J.SPEED = 1.0
J.SIL = 0.3
J.LEAD = 0.35
J.TAIL = 0.6
J.MAXC = 16

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--sound", action="store_true")
    if ap.parse_args().sound:
        import yuk_sound

        yuk_sound.OUT = ROOT / "public/yuk_short"
        yuk_sound.main("yuk_short")
    else:
        J.build()
