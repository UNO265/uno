"""오프라인 한국어 TTS: Mycroft Mimic3 ko_KO/kss_low (VITS, ONNX) + espeak-ng 발음 변환.

준비(한 번):
  apt-get install -y espeak-ng && pip install onnxruntime numpy
  mkdir -p .models/ko_kss && cd .models/ko_kss
  B=https://media.githubusercontent.com/media/MycroftAI/mimic3-voices/master/voices/ko_KO/kss_low
  R=https://raw.githubusercontent.com/MycroftAI/mimic3-voices/master/voices/ko_KO/kss_low
  curl -LO $B/generator.onnx && curl -LO $R/phonemes.txt

주의: KSS 데이터셋(여성 단일 화자)으로 학습된 모델. 데이터셋 라이선스가 비상업(CC BY-NC-SA)이므로
수익화 영상의 최종 음성으로는 쓰지 말고, 미리보기·타이밍 확인용으로 쓴다.
"""
import re
import subprocess
from pathlib import Path

import numpy as np

DIR = Path(__file__).resolve().parent.parent / ".models/ko_kss"
SR = 22050
_sess = None
_ids = None


def _load():
    global _sess, _ids
    if _sess is None:
        import onnxruntime as ort

        _ids = {}
        for line in (DIR / "phonemes.txt").read_text(encoding="utf-8").splitlines():
            if line:
                i, p = line.split(" ", 1)
                _ids[p] = int(i)
        _sess = ort.InferenceSession(str(DIR / "generator.onnx"))
    return _sess, _ids


def _phonemes(text):
    out = subprocess.run(["espeak-ng", "-v", "ko", "-q", "--ipa=3", text], capture_output=True, text=True).stdout
    return out.replace("‍", "").replace("-", "").split()


def synth(text: str, length: float = 1.12, seed: int = 0) -> np.ndarray:
    """text → float32 mono 22.05kHz. length>1 이면 느리게(다큐 내레이션 속도)."""
    sess, ids = _load()
    np.random.seed(seed)
    seq = [ids["^"], ids["_"]]
    for chunk in re.split(r"([,.?!])", text):
        if chunk in (",", ".", "?", "!"):
            seq += [ids["," if chunk == "," else "."], ids["_"]]
            continue
        for w in _phonemes(chunk):
            for ch in w:
                if ch in ids:
                    seq += [ids[ch], ids["_"]]
            seq += [ids["#"], ids["_"]]
    if seq[-2] not in (ids["."], ids[","]):
        seq += [ids["."], ids["_"]]
    seq.append(ids["$"])
    x = np.array([seq], dtype=np.int64)
    audio = sess.run(None, {"input": x, "input_lengths": np.array([x.shape[1]], dtype=np.int64),
                            "scales": np.array([0.667, length, 0.8], dtype=np.float32)})[0].squeeze()
    return audio.astype(np.float32)
