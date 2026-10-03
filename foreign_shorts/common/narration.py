"""ナレーション合成（VOICEVOX）。声は script.json の "voice": {"vvm", "style", "speed"} で CASE ごとに選ぶ。
narration の行に "voice": false を付けると字幕だけ（音は無音、字幕を出す長さは読む長さのまま）。
usage: python3 narration.py SCRIPT.json OUT_DIR  → OUT_DIR/NN.wav
"""
import json, sys, wave
from pathlib import Path
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile

VV = Path(__file__).resolve().parents[2] / "video" / ".voicevox"
S = json.loads(Path(sys.argv[1]).read_text())
OUT = Path(sys.argv[2])
v = S["voice"]

ort = Onnxruntime.load_once(filename=str(next((VV / "onnxruntime" / "lib").glob("libvoicevox_onnxruntime.so.*.*"))))
syn = Synthesizer(ort, OpenJtalk(str(VV / "open_jtalk_dic_utf_8-1.11")))
with VoiceModelFile.open(str(VV / "vvms" / f"{v['vvm']}.vvm")) as m:
    syn.load_voice_model(m)

OUT.mkdir(parents=True, exist_ok=True)
lines = S["narration"]
for i, ln in enumerate(lines):
    q = syn.create_audio_query(ln["say"], v["style"])
    q.speed_scale = ln.get("speed", v.get("speed", 1.0))
    q.intonation_scale = v.get("intonation", 1.1)
    q.pre_phoneme_length = 0.05
    q.post_phoneme_length = 0.1
    p = OUT / f"{i:02d}.wav"
    p.write_bytes(syn.synthesis(q, v["style"]))
    with wave.open(str(p)) as w:
        d = w.getnframes() / w.getframerate()
        params, nf = w.getparams(), w.getnframes()
    if ln.get("voice", True) is False:  # 字幕だけの行: 読む長さ（字幕を出す長さ）はそのままで音は無音にする
        with wave.open(str(p), "w") as w:
            w.setparams(params)
            w.writeframes(b"\0" * nf * params.sampwidth * params.nchannels)
    nxt = lines[i + 1]["start"] if i + 1 < len(lines) else None
    warn = "  ⚠ 次のセリフに重なる" if nxt is not None and ln["start"] + d > nxt - 0.1 else ""
    mute = "  (字幕のみ)" if ln.get("voice", True) is False else ""
    print(f"{i:02d} start={ln['start']:5.1f} dur={d:4.2f} end={ln['start']+d:5.2f}{warn}{mute}  {ln['say']}")
