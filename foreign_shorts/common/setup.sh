#!/usr/bin/env bash
# 새 세션(빈 컨테이너)에서 쇼츠 제작 환경을 한 번에 준비한다.
#   ffmpeg(imageio-ffmpeg) / fluidsynth + FluidR3_GM / Python 패키지 / VOICEVOX(엔진·사전·음성 모델 0–15) / 폰트
# 사용: bash foreign_shorts/common/setup.sh   → 마지막 줄에 FONT 경로를 출력
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VV="$ROOT/video/.voicevox"
FONT_DIR="$ROOT/foreign_shorts/.fonts"

apt-get update -qq >/dev/null 2>&1 || true
apt-get install -y -qq fluidsynth fluid-soundfont-gm >/dev/null
pip install -q pillow numpy mido imageio-ffmpeg 2>&1 | grep -v WARNING || true
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
command -v ffmpeg >/dev/null || ln -sf "$FF" /usr/local/bin/ffmpeg

mkdir -p "$VV/vvms" "$FONT_DIR"
GH=https://github.com/VOICEVOX
if ! python3 -c "import voicevox_core" 2>/dev/null; then
  W="$VV/voicevox_core-0.17.0-cp310-abi3-manylinux_2_34_x86_64.whl"
  [ -f "$W" ] || curl -fsSL -o "$W" "$GH/voicevox_core/releases/download/0.17.0/voicevox_core-0.17.0-cp310-abi3-manylinux_2_34_x86_64.whl"
  pip install -q "$W" 2>&1 | grep -v WARNING || true
fi
if [ ! -d "$VV/onnxruntime" ]; then
  curl -fsSL "$GH/onnxruntime-builder/releases/download/voicevox_onnxruntime-1.23.2/voicevox_onnxruntime-linux-x64-1.23.2.tgz" | tar xz -C "$VV"
  mv "$VV/voicevox_onnxruntime-linux-x64-1.23.2" "$VV/onnxruntime"
fi
[ -d "$VV/open_jtalk_dic_utf_8-1.11" ] || curl -fsSL https://github.com/r9y9/open_jtalk/releases/download/v1.11.1/open_jtalk_dic_utf_8-1.11.tar.gz | tar xz -C "$VV"
for n in $(seq 0 15); do
  [ -f "$VV/vvms/$n.vvm" ] || curl -fsSL -o "$VV/vvms/$n.vvm" "$GH/voicevox_vvm/releases/download/0.17.0/$n.vvm"
done
[ -f "$VV/TERMS.txt" ] || curl -fsSL -o "$VV/TERMS.txt" "$GH/voicevox_vvm/releases/download/0.17.0/TERMS.txt"

FONT="$FONT_DIR/ZenMaruGothic-Black.ttf"
[ -f "$FONT" ] || curl -fsSL -o "$FONT" https://raw.githubusercontent.com/google/fonts/main/ofl/zenmarugothic/ZenMaruGothic-Black.ttf
G=https://raw.githubusercontent.com/google/fonts/main/ofl  # nimaru 用
[ -f "$FONT_DIR/DelaGothicOne-Regular.ttf" ] || curl -fsSL -o "$FONT_DIR/DelaGothicOne-Regular.ttf" $G/delagothicone/DelaGothicOne-Regular.ttf
[ -f "$FONT_DIR/MochiyPopOne-Regular.ttf" ] || curl -fsSL -o "$FONT_DIR/MochiyPopOne-Regular.ttf" $G/mochiypopone/MochiyPopOne-Regular.ttf
echo "READY  FONT=$FONT"
