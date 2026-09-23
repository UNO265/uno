"""data/cuts.json からナレーションを合成し、public/timeline.json を書き出す。

音声: VOICEVOX（雀松朱司 / style 52）。事前に scripts/setup_voicevox.sh で
エンジン一式（core・ONNX Runtime・辞書・音声モデル）を .voicevox/ に取得しておく。

各カットの "/" 区切りを 1 セグメントとして個別に合成し、内容に応じて
テンポと間を変える（質問はゆっくり＋余白、数字・結論はゆっくり）。
セグメントの開始・終了時刻は字幕とアニメーションのタイミングに使う。
"""
import json
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np
from numpy.lib.stride_tricks import sliding_window_view

ROOT = Path(__file__).resolve().parent.parent
VV = ROOT / ".voicevox"
FPS = 30
SR = 48000
STYLE_ID = 52  # 雀松朱司 ノーマル
LEAD = 0.4     # カット頭から声が始まるまで
TAIL = 0.6     # 声が終わってから次のカットまで
GAP = 0.28     # セグメント間の間
Q_GAP = 0.5    # 質問の後の間
TARGET_RMS = 0.1   # 発話部分の RMS（約 -20 dBFS）
CEIL = 0.89        # ピーク上限（約 -1 dBFS）

# 読み上げ専用の表記補正（字幕には影響しない）
READINGS = {
    "Standard Products": "スタンダードプロダクツ",
    "THREEPPY": "スリーピー",
    "DAISO": "ダイソー",
    "Seria": "セリア",
    "矢野博丈": "やのひろたけ",
    "粗利益率": "あらりえきりつ",
    "脱・100円": "脱100円",
    "――": "、",
}

# 結論部はゆっくり、重みを持たせる
SLOW_CUTS = {"C118", "C119", "C120", "C127", "C128", "C129", "C130", "C131"}


def prosody(cut_id: str, seg: str) -> dict:
    p = {"speed": 0.98, "intonation": 1.12}
    if seg.endswith(("？", "?")) or seg.endswith("のか。"):
        p = {"speed": 0.93, "intonation": 1.18}
    elif any(ch.isdigit() for ch in seg):
        p["speed"] = 0.94
    if cut_id in SLOW_CUTS:
        p["speed"] = min(p["speed"], 0.92)
    return p


class Voice:
    def __init__(self) -> None:
        from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile

        lib = next((VV / "onnxruntime" / "lib").glob("libvoicevox_onnxruntime.so.*.*"))
        ort = Onnxruntime.load_once(filename=str(lib))
        self.syn = Synthesizer(ort, OpenJtalk(str(VV / "open_jtalk_dic_utf_8-1.11")))
        with VoiceModelFile.open(str(VV / "vvms" / "12.vvm")) as m:
            self.syn.load_voice_model(m)

    def say(self, text: str, speed: float, intonation: float) -> np.ndarray:
        for k, v in READINGS.items():
            text = text.replace(k, v)
        q = self.syn.create_audio_query(text, STYLE_ID)
        q.speed_scale = speed
        q.intonation_scale = intonation
        q.pre_phoneme_length = 0.05
        q.post_phoneme_length = 0.1
        wav = self.syn.synthesis(q, STYLE_ID)
        with tempfile.TemporaryDirectory() as d:
            src, dst = Path(d) / "a.wav", Path(d) / "b.wav"
            src.write_bytes(wav)
            # 24kHz → 48kHz（高品質リサンプラー）
            subprocess.run(
                ["ffmpeg", "-v", "error", "-y", "-i", str(src), "-af", "aresample=48000:resampler=soxr", "-ac", "1", str(dst)],
                check=True,
            )
            return read_wav(dst)


def read_wav(path: Path) -> np.ndarray:
    with wave.open(str(path)) as w:
        assert w.getframerate() == SR, f"{path}: {SR}Hz が必要です"
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        if w.getnchannels() == 2:
            data = data.reshape(-1, 2).mean(axis=1)
    return trim(data)


def trim(x: np.ndarray, thresh: float = 0.01) -> np.ndarray:
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(0.03 * SR))
    b = min(len(x), idx[-1] + int(0.12 * SR))
    return x[a:b]


def level(x: np.ndarray) -> np.ndarray:
    """発話部分の RMS をそろえ、ピークだけをなめらかに抑える（歪みを出さない）"""
    active = x[np.abs(x) > 0.02]
    rms = np.sqrt(np.mean(active**2)) if len(active) else 1.0
    y = x * (TARGET_RMS / max(rms, 1e-6))
    win = int(0.005 * SR)
    env = sliding_window_view(np.pad(np.abs(y), (win // 2, win - win // 2 - 1), mode="edge"), win).max(axis=1)
    gain = np.minimum(1.0, CEIL / np.maximum(env, 1e-9))
    k = int(0.01 * SR)
    gain = np.convolve(np.pad(gain, (k // 2, k - k // 2 - 1), mode="edge"), np.ones(k) / k, mode="valid")
    return y * np.minimum(gain, 1.0)


def write_wav(path: Path, data: np.ndarray) -> None:
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(data, -1, 1) * 32767).astype(np.int16).tobytes())


def main() -> None:
    cuts = json.loads((ROOT / "data" / "cuts.json").read_text(encoding="utf-8"))
    voice_dir = ROOT / "public" / "voice"
    voice_dir.mkdir(parents=True, exist_ok=True)
    voice = Voice()

    timeline, frame = [], 0
    for cut in cuts:
        lead = cut.get("lead", LEAD)
        tail = cut.get("tail", TAIL)
        gap = cut.get("gap", GAP)
        pauses = {int(k): v for k, v in cut.get("pauses", {}).items()}
        segs = [s for s in cut["text"].split("/") if s]
        entry = {"id": cut["id"], "segments": []}

        if segs:
            parts, t = [], 0.0
            for i, s in enumerate(segs):
                if i > 0:
                    prev = segs[i - 1]
                    g = pauses.get(i, Q_GAP if prev.endswith(("？", "?")) else gap)
                    parts.append(np.zeros(int(g * SR)))
                    t += g
                p = prosody(cut["id"], s)
                audio = voice.say(s, p["speed"], p["intonation"])
                d = len(audio) / SR
                entry["segments"].append({"text": s, "start": lead + t, "end": lead + t + d})
                parts.append(audio)
                t += d
            out = voice_dir / f"{cut['id']}.wav"
            write_wav(out, level(np.concatenate(parts)))
            entry["voice"] = f"voice/{cut['id']}.wav"
            entry["voiceStart"] = lead
            seconds = lead + t + tail
        else:
            seconds = cut["fixed"]
        seconds = max(seconds, cut.get("min", 0))

        entry["from"] = frame
        entry["duration"] = round(seconds * FPS)
        frame += entry["duration"]
        timeline.append(entry)
        print(f"{cut['id']}  {seconds:5.1f}s", flush=True)

    (ROOT / "public" / "timeline.json").write_text(
        json.dumps({"fps": FPS, "totalFrames": frame, "cuts": timeline}, ensure_ascii=False, indent=1),
        encoding="utf-8",
    )
    print(f"total {frame / FPS:.1f}s")


if __name__ == "__main__":
    main()
