#!/bin/sh
# 사용: mix_bgm.sh <영상(대화+내레이션).mp4> <music.wav> <out.mp4>
# BGM을 말소리에 맞춰 완만하게 줄이고(sidechain), YouTube 기준 -14 LUFS·순간 최대 -1.5 dB 이하로 마스터링한다(E6).
# 영상 스트림은 다시 인코딩하지 않는다.
set -e
ffmpeg -v error -y -i "$1" -i "$2" -filter_complex \
"[0:a]asplit[v][k];[1:a]aresample=48000[mu];[mu][k]sidechaincompress=threshold=0.04:ratio=3:attack=150:release=1000[m];\
[v][m]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-2:LRA=11,aresample=48000,alimiter=limit=0.60:attack=5:release=60:level=disabled[a]" \
-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$3"
ffmpeg -v info -i "$3" -vn -af ebur128=peak=true:framelog=quiet -f null - 2>&1 | grep -E "I:|Peak:" | head -2
