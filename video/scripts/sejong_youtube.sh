#!/usr/bin/env bash
# 렌더링된 세종 영상(out/sejong.mp4)을 YouTube 업로드용 한 파일로 압축한다.
# 1080p HEVC 2단계 인코딩으로 전체 용량을 목표치(기본 28.5MB)에 맞춘다.
# 사용법: scripts/sejong_youtube.sh [입력] [출력] [목표 MB]
set -euo pipefail
cd "$(dirname "$0")/.."
IN=${1:-out/sejong.mp4}
OUT=${2:-out/sejong_youtube.mp4}
MB=${3:-28.5}
ABR=80
COMP=node_modules/@remotion/compositor-linux-x64-gnu
FF="env LD_LIBRARY_PATH=$COMP $COMP/ffmpeg -y -loglevel error"
DUR=$(env LD_LIBRARY_PATH=$COMP $COMP/ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
VBR=$(python3 -c "print(int($MB * 8192 / $DUR - $ABR - 4))")
echo "duration ${DUR}s → video ${VBR}k + audio ${ABR}k"
LOG=$(mktemp -d)
$FF -i "$IN" -c:v libx265 -preset medium -b:v ${VBR}k -tag:v hvc1 \
  -x265-params pass=1:stats=$LOG/x265.log:log-level=error -an -f mp4 /dev/null
$FF -i "$IN" -c:v libx265 -preset medium -b:v ${VBR}k -tag:v hvc1 \
  -x265-params pass=2:stats=$LOG/x265.log:log-level=error \
  -c:a libfdk_aac -b:a ${ABR}k -movflags +faststart "$OUT"
rm -rf "$LOG"
ls -la "$OUT"
