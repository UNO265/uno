"""세종 영상: 내레이션 음성 → 실제 길이로 컷·자막 타이밍을 정해 public/sejong/timeline.json 에 쓴다.

음성은 줄(자막 한 줄) 단위 파일 public/sejong/voice/<컷ID>_<줄번호>.wav 로 둔다.
  --engine files     이미 있는 음성 파일만 쓴다. 없는 줄은 글자 수로 길이를 추정한다(기본값).
  --engine edge      edge-tts 로 합성(네트워크에서 speech.platform.bing.com 허용 필요). 기본 목소리 ko-KR-InJoonNeural.
  --engine google    Google Cloud Text-to-Speech 로 합성. 환경 변수 GOOGLE_TTS_API_KEY 필요. 기본 목소리 ko-KR-Neural2-C.
  --engine kss       오프라인 합성(scripts/sejong_tts_kss.py, 여성 단일 화자·비상업 데이터셋 → 미리보기용).
  --voice NAME       목소리 이름을 바꾼다.  --rate  말하기 속도(edge: -8%, google: 0.92 형식).
  --force            이미 있는 음성 파일도 다시 합성한다.

직접 녹음한 음성을 쓸 때는 같은 파일명으로 wav 를 넣고 `--engine files` 로 다시 실행하면 된다.
음성이 하나도 없으면 timeline.json 에 "placeholder": true 가 붙고, 영상은 자막·BGM 만으로 렌더링된다.
"""
import argparse
import asyncio
import base64
import json
import os
import re
import subprocess
import urllib.request
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CUTS = ROOT / "data/sejong/cuts.json"
OUT = ROOT / "public/sejong"
VOICE = OUT / "voice"
FPS = 30
COMP = ROOT / "node_modules/@remotion/compositor-linux-x64-gnu"

LEAD = 0.45          # 컷 시작 → 첫 줄
GAP = 0.38           # 줄 사이
TAIL = 0.75          # 마지막 줄 → 다음 컷
CHAPTER_LEAD = 1.6   # 장 제목을 먼저 보여주는 시간
# 말한 뒤 한 박자 더 머무는 컷(강조 문장)
HOLD = {"H01": 1.2, "H06": 1.0, "H08": 1.2, "P05": 0.6, "C108": 0.6, "C309": 0.8, "C402": 0.6,
        "C509": 0.6, "C510": 0.8, "C512": 1.0, "C514": 0.8, "E05": 1.0, "E06": 1.2, "E07": 2.5}


def speak_len(text: str) -> float:
    """음성이 없을 때의 길이 추정: 다큐 내레이션 약 310음절/분 + 쉼표·마침표 쉼."""
    syl = len(re.findall(r"[가-힣0-9]", text))
    return syl / 5.2 + 0.2 * text.count(",") + 0.25 * len(re.findall(r"[.?]", text)) + 0.2


def clean(text: str) -> str:
    """읽기용 텍스트: 따옴표·책 괄호 제거, 연도는 한자어로 읽도록 그대로 둔다."""
    return re.sub(r"[\"『』']", "", text)


def ffmpeg(*args):
    env = dict(os.environ, LD_LIBRARY_PATH=str(COMP))
    subprocess.run([str(COMP / "ffmpeg"), "-y", "-loglevel", "error", *args], check=True, env=env)


def to_wav(src: Path, dst: Path):
    ffmpeg("-i", str(src), "-ac", "1", "-ar", "48000", str(dst))


async def tts_edge(text, dst, voice, rate):
    import edge_tts

    tmp = dst.with_suffix(".mp3")
    await edge_tts.Communicate(text, voice, rate=rate).save(str(tmp))
    to_wav(tmp, dst)
    tmp.unlink()


def tts_google(text, dst, voice, rate):
    key = os.environ["GOOGLE_TTS_API_KEY"]
    body = {"input": {"text": text}, "voice": {"languageCode": "ko-KR", "name": voice},
            "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": 48000, "speakingRate": float(rate)}}
    req = urllib.request.Request(f"https://texttospeech.googleapis.com/v1/text:synthesize?key={key}",
                                 data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    audio = base64.b64decode(json.load(urllib.request.urlopen(req))["audioContent"])
    tmp = dst.with_suffix(".raw.wav")
    tmp.write_bytes(audio)
    to_wav(tmp, dst)
    tmp.unlink()


def tts_kss(text, dst, length):
    import sys

    sys.path.insert(0, str(ROOT / "scripts"))
    import numpy as np
    from sejong_tts_kss import SR, synth

    a = synth(text, length)
    # 앞뒤 무음 정리 + 음량 정규화
    idx = np.where(np.abs(a) > 0.02 * np.abs(a).max())[0]
    a = a[max(0, idx[0] - 600): idx[-1] + 1500] if len(idx) else a
    a = a / max(1e-6, np.abs(a).max()) * 0.85
    tmp = dst.with_suffix(".22k.wav")
    with wave.open(str(tmp), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((a * 32767).astype(np.int16).tobytes())
    to_wav(tmp, dst)
    tmp.unlink()


def wav_len(p: Path) -> float:
    with wave.open(str(p)) as w:
        return w.getnframes() / w.getframerate()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", choices=["files", "edge", "google", "kss"], default="files")
    ap.add_argument("--voice")
    ap.add_argument("--rate")
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    voice = a.voice or {"edge": "ko-KR-InJoonNeural", "google": "ko-KR-Neural2-C"}.get(a.engine)
    rate = a.rate or {"edge": "-8%", "google": "0.92"}.get(a.engine)

    cuts = json.loads(CUTS.read_text())
    VOICE.mkdir(parents=True, exist_ok=True)
    t = 0
    voiced = 0
    out = []
    for c in cuts:
        at = CHAPTER_LEAD if c["scene"] == "chapter" else LEAD
        segs = []
        for i, line in enumerate(c["lines"]):
            wav = VOICE / f"{c['id']}_{i}.wav"
            if a.engine != "files" and (a.force or not wav.exists()):
                print("TTS", wav.name, line[:30])
                if a.engine == "edge":
                    asyncio.run(tts_edge(clean(line), wav, voice, rate))
                elif a.engine == "kss":
                    tts_kss(clean(line), wav, float(rate or 1.12))
                else:
                    tts_google(clean(line), wav, voice, rate)
            if wav.exists():
                dur = wav_len(wav)
                voiced += 1
                seg = {"text": line, "start": round(at, 3), "end": round(at + dur, 3), "voice": f"sejong/voice/{wav.name}"}
            else:
                dur = speak_len(line)
                seg = {"text": line, "start": round(at, 3), "end": round(at + dur, 3)}
            segs.append(seg)
            at += dur + GAP
        length = at - GAP + TAIL + HOLD.get(c["id"], 0)
        frames = round(length * FPS)
        out.append({**c, "segments": segs, "from": t, "duration": frames})
        t += frames
    total = sum(len(c["lines"]) for c in cuts)
    tl = {"fps": FPS, "totalFrames": t, "placeholder": voiced == 0, "voicedLines": voiced, "lines": total, "cuts": out}
    (OUT / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    print(f"{len(out)} cuts, {t} frames = {t / FPS / 60:.1f} min, voiced lines {voiced}/{total}")


if __name__ == "__main__":
    main()
