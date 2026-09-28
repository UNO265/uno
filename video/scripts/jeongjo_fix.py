"""정조 편 내레이션 점검: 음성인식 결과를 대본과 비교해(숫자는 한글로 풀어 비교) 반복·누락이 있는 문장만 다시 합성한다."""
import difflib
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import jeongjo as J  # noqa: E402
import sejong_voice as V  # noqa: E402

norm = lambda s: re.sub(r"[^가-힣]", "", V.clean(s))


def score(model, wav, text):
    segs, _ = model.transcribe(str(wav), language="ko", beam_size=5)
    hyp = "".join(x.text for x in segs)
    a, b = norm(text), norm(hyp)
    r = difflib.SequenceMatcher(None, a, b).ratio()
    over = len(b) / max(1, len(a))
    return r - max(0, over - 1.08) * 2, hyp


def main():
    from faster_whisper import WhisperModel

    m = WhisperModel("small", device="cpu", compute_type="int8")
    t = json.loads((ROOT / "public/jeongjo/timeline.json").read_text())
    for c in t["cuts"]:
        for s in c["sentences"]:
            wav = ROOT / "public" / s["voice"]
            sc, hyp = score(m, wav, s["text"])
            if sc >= 0.9:
                continue
            print(f"FIX {wav.name} {sc:.2f} | {s['text']} | {hyp}", flush=True)
            best = (sc, wav.read_bytes())
            for k in range(5):
                tmp = wav.with_suffix(".try.wav")
                J.tts_para(V.clean(s["text"]), tmp)
                sc2, hyp2 = score(m, tmp, s["text"])
                print(f"   try{k} {sc2:.2f} | {hyp2}", flush=True)
                if sc2 > best[0]:
                    best = (sc2, tmp.read_bytes())
                tmp.unlink()
                if sc2 >= 0.95:
                    break
            wav.write_bytes(best[1])


if __name__ == "__main__":
    main()
