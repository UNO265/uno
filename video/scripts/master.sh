#!/usr/bin/env bash
# レンダリング結果の音量を YouTube 向け（-14 LUFS / TruePeak -1.5 dB）に整える（2 パス loudnorm + リミッター）。
# 使い方: scripts/master.sh out/render.mp4 out/final.mp4
set -euo pipefail
in=$1
out=$2
target="I=-14:TP=-1.5:LRA=11"
stats=$(ffmpeg -hide_banner -nostats -i "$in" -af "loudnorm=$target:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$stats" | sed -n "s/.*\"$1\" : \"\([^\"]*\)\".*/\1/p"; }
ffmpeg -hide_banner -v error -y -i "$in" -c:v copy \
  -af "loudnorm=$target:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,alimiter=limit=0.84:level=false" \
  -ar 48000 -c:a aac -b:a 192k "$out"
