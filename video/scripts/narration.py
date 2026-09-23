"""data/cuts.json からナレーションを合成し、public/timeline.json を書き出す。

各カットの "/" 区切りを 1 セグメントとして Open JTalk で個別に合成し、
セグメント間に短い間を入れて 1 本の wav に連結する。
セグメントの開始・終了時刻は字幕のタイミングに使う。

録音済み音声に差し替える場合は public/voice/<ID>.wav を置き、
--keep-voice を付けて実行すると合成をスキップして長さだけ測り直す。
"""
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
SR = 48000
DIC = "/var/lib/mecab/dic/open-jtalk/naist-jdic"
VOICE = ROOT / "voices" / "mei_normal.htsvoice"
SPEED = 0.95      # 落ち着いた語り口
LEAD = 0.4        # カット頭から声が始まるまで
TAIL = 0.6        # 声が終わってから次のカットまで
GAP = 0.25        # セグメント間の間
PEAK = 0.93       # ナレーションのピーク（効果音より前に出す）

# 読み上げ専用の表記ゆれ補正（字幕には影響しない）
READINGS = {
    "DAISO": "ダイソー",
    "Seria": "セリア",
    "Standard Products": "スタンダードプロダクツ",
    "THREEPPY": "スリーピー",
    "矢野博丈": "やのひろたけ",
    "大創産業": "だいそうさんぎょう",
    "粗利益率": "あらりえきりつ",
    "脱・100円": "脱100円",
    "――": "、",
}


def synth(text: str) -> np.ndarray:
    with tempfile.TemporaryDirectory() as d:
        src, out = Path(d) / "t.txt", Path(d) / "t.wav"
        for k, v in READINGS.items():
            text = text.replace(k, v)
        src.write_text(text, encoding="utf-8")
        subprocess.run(
            ["open_jtalk", "-x", DIC, "-m", str(VOICE), "-r", str(SPEED),
             "-s", str(SR), "-ow", str(out), str(src)],
            check=True,
        )
        return read_wav(out)


def read_wav(path: Path) -> np.ndarray:
    with wave.open(str(path)) as w:
        assert w.getframerate() == SR, f"{path}: {SR}Hz が必要です"
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
        if w.getnchannels() == 2:
            data = data.reshape(-1, 2).mean(axis=1).astype(np.int16)
    return trim(data)


def trim(x: np.ndarray, thresh: int = 300) -> np.ndarray:
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(0.03 * SR))
    b = min(len(x), idx[-1] + int(0.08 * SR))
    return x[a:b]


def loud(x: np.ndarray) -> np.ndarray:
    """ピーク正規化 + 軽いコンプレッションで声を前に出す"""
    y = x.astype(np.float64) / 32768
    y = y / (np.max(np.abs(y)) or 1)
    y = np.tanh(y * 1.8) / np.tanh(1.8)
    return (y * PEAK * 32767).astype(np.int16)


def write_wav(path: Path, data: np.ndarray) -> None:
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.astype(np.int16).tobytes())


def main() -> None:
    keep = "--keep-voice" in sys.argv
    cuts = json.loads((ROOT / "data" / "cuts.json").read_text(encoding="utf-8"))
    voice_dir = ROOT / "public" / "voice"
    voice_dir.mkdir(parents=True, exist_ok=True)

    timeline, frame = [], 0
    for cut in cuts:
        lead = cut.get("lead", LEAD)
        tail = cut.get("tail", TAIL)
        gap = cut.get("gap", GAP)
        segs = [s for s in cut["text"].split("/") if s]
        out = voice_dir / f"{cut['id']}.wav"
        entry = {"id": cut["id"], "segments": []}

        if segs and not (keep and out.exists()):
            parts, t = [], 0.0
            for s in segs:
                audio = synth(s)
                d = len(audio) / SR
                entry["segments"].append({"text": s, "start": lead + t, "end": lead + t + d})
                parts += [audio, np.zeros(int(gap * SR), dtype=np.int16)]
                t += d + gap
            write_wav(out, loud(np.concatenate(parts[:-1])))
        elif segs:
            # 差し替え音声: セグメント時刻は文字数で按分する
            total = len(read_wav(out)) / SR
            n = sum(len(s) for s in segs)
            t = 0.0
            for s in segs:
                d = total * len(s) / n
                entry["segments"].append({"text": s, "start": lead + t, "end": lead + t + d})
                t += d

        if segs:
            voice_len = len(read_wav(out)) / SR
            entry["voice"] = f"voice/{cut['id']}.wav"
            entry["voiceStart"] = lead
            seconds = lead + voice_len + tail
        else:
            seconds = cut["fixed"]
        seconds = max(seconds, cut.get("min", 0))

        entry["from"] = frame
        entry["duration"] = round(seconds * FPS)
        frame += entry["duration"]
        timeline.append(entry)
        print(f"{cut['id']}  {seconds:5.1f}s")

    (ROOT / "public" / "timeline.json").write_text(
        json.dumps({"fps": FPS, "totalFrames": frame, "cuts": timeline}, ensure_ascii=False, indent=1),
        encoding="utf-8",
    )
    print(f"total {frame / FPS:.1f}s")


if __name__ == "__main__":
    main()
