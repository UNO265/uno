#!/usr/bin/env bash
# 세종 영상을 구간별로 렌더링하고 합친다. 중간에 끊겨도 다시 실행하면 끝난 구간은 건너뛴다.
# 사용법: REMOTION_CHROME=<chrome 경로> scripts/sejong_render.sh [출력 파일]
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=${1:-out/sejong.mp4}
PARTS=out/sejong_parts
CHUNK=${CHUNK:-4000}
mkdir -p "$PARTS"
TOTAL=$(python3 -c "import json;print(json.load(open('public/sejong/timeline.json'))['totalFrames'])")
BROWSER=${REMOTION_CHROME:+--browser-executable=$REMOTION_CHROME}
COMP=node_modules/@remotion/compositor-linux-x64-gnu
FF="env LD_LIBRARY_PATH=$COMP $COMP/ffmpeg -y -loglevel error"

npx remotion bundle src/sejong/index.ts --out-dir "$PARTS/bundle" >/dev/null
: > "$PARTS/list.txt"
for ((s = 0; s < TOTAL; s += CHUNK)); do
  e=$((s + CHUNK - 1)); ((e >= TOTAL)) && e=$((TOTAL - 1))
  f="$PARTS/v_$(printf %06d $s).mp4"
  echo "file '$(basename "$f")'" >> "$PARTS/list.txt"
  [[ -s "$f" ]] && { echo "skip $s-$e"; continue; }
  echo "render $s-$e / $TOTAL"
  npx remotion render "$PARTS/bundle" Sejong "$f.tmp.mp4" --frames=$s-$e --muted --concurrency=4 --crf=20 $BROWSER --log=error
  mv "$f.tmp.mp4" "$f"
done
[[ -s "$PARTS/audio.wav" ]] || npx remotion render "$PARTS/bundle" Sejong "$PARTS/audio.wav" --codec=wav $BROWSER --log=error
$FF -f concat -safe 0 -i "$PARTS/list.txt" -c copy "$PARTS/video.mp4"
$FF -i "$PARTS/video.mp4" -i "$PARTS/audio.wav" -c:v copy -c:a aac -b:a 192k -shortest "$OUT"
echo "done $OUT"
