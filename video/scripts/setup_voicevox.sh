#!/usr/bin/env bash
# VOICEVOX（core 0.17.0 / ONNX Runtime 1.23.2 / 辞書 / 音声モデル 12.vvm）を .voicevox/ に取得する。
# 12.vvm には 雀松朱司（style 52）が含まれる。利用規約: https://github.com/VOICEVOX/voicevox_vvm の TERMS.txt
set -euo pipefail
cd "$(dirname "$0")/.."
D=.voicevox
mkdir -p "$D/vvms"
GH=https://github.com/VOICEVOX
curl -fsSL -o "$D/vvms/12.vvm" "$GH/voicevox_vvm/releases/download/0.17.0/12.vvm"
curl -fsSL -o "$D/TERMS.txt" "$GH/voicevox_vvm/releases/download/0.17.0/TERMS.txt"
curl -fsSL -o "$D/core.whl" "$GH/voicevox_core/releases/download/0.17.0/voicevox_core-0.17.0-cp310-abi3-manylinux_2_34_x86_64.whl"
curl -fsSL "$GH/onnxruntime-builder/releases/download/voicevox_onnxruntime-1.23.2/voicevox_onnxruntime-linux-x64-1.23.2.tgz" | tar xz -C "$D"
rm -rf "$D/onnxruntime" && mv "$D/voicevox_onnxruntime-linux-x64-1.23.2" "$D/onnxruntime"
curl -fsSL https://github.com/r9y9/open_jtalk/releases/download/v1.11.1/open_jtalk_dic_utf_8-1.11.tar.gz | tar xz -C "$D"
pip install -q "$D/core.whl"
echo "VOICEVOX ready in $D"
