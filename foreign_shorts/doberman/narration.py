"""ナレーション合成: VOICEVOX 冥鳴ひまり(style 14)。各セリフを voice/NN.wav に書き出し、長さを表示する。"""
import json, sys, wave
from pathlib import Path
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile

HERE = Path(__file__).parent
VV = HERE.parent.parent / "video" / ".voicevox"
OUT = Path(sys.argv[1])
STYLE = 14
lines = json.loads((HERE / "script.json").read_text())["narration"]

ort = Onnxruntime.load_once(filename=str(next((VV / "onnxruntime" / "lib").glob("libvoicevox_onnxruntime.so.*.*"))))
syn = Synthesizer(ort, OpenJtalk(str(VV / "open_jtalk_dic_utf_8-1.11")))
with VoiceModelFile.open(str(VV / "vvms" / "1.vvm")) as m:
    syn.load_voice_model(m)

OUT.mkdir(parents=True, exist_ok=True)
for i, ln in enumerate(lines):
    q = syn.create_audio_query(ln["say"], STYLE)
    q.speed_scale = ln.get("speed", 0.95)
    q.intonation_scale = 1.1
    q.pre_phoneme_length = 0.05
    q.post_phoneme_length = 0.1
    p = OUT / f"{i:02d}.wav"
    p.write_bytes(syn.synthesis(q, STYLE))
    with wave.open(str(p)) as w:
        d = w.getnframes() / w.getframerate()
    print(f"{i:02d} start={ln['start']:5.1f} dur={d:4.2f} end={ln['start']+d:5.2f}  {ln['say']}")
