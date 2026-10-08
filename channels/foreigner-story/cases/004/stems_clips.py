"""clips.json 의 구간을 20초 이내 간격으로 묶어(±4초 여유) 음원 분리(htdemucs, 목소리/나머지).
사용: python3 stems_clips.py <case_dir>   (case_dir 에 clips.json, sources.json, stems/)"""
import json, subprocess, shutil, tempfile, sys
from pathlib import Path
R = Path(sys.argv[1]); srcs = json.load(open(R / "sources.json"))
todo = {}
for ch, ep, a, b in json.load(open(R / "clips.json")):
    todo.setdefault(ep, []).append([a, b])
for ep, spans in todo.items():
    spans.sort(); g = []
    for a, b in spans:
        if g and a - g[-1][1] <= 20: g[-1][1] = max(g[-1][1], b)
        else: g.append([a, b])
    for a, b in g:
        s0, s1 = max(0, int(a - 4)), int(b + 5)
        out = R / "stems" / f"{ep}_{s0}_{s1}.wav"
        if out.exists(): continue
        tmp = Path(tempfile.mkdtemp(dir=R / "stems"))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(s0), "-t", str(s1 - s0), "-i", srcs[ep],
                        "-vn", "-ac", "2", "-ar", "44100", str(tmp / "in.wav")], check=True)
        subprocess.run(["python3", "-m", "demucs", "-n", "htdemucs", "--two-stems=vocals", "-j", "1", "-o", str(tmp), str(tmp / "in.wav")],
                       check=True, capture_output=True)
        shutil.move(str(tmp / "htdemucs/in/vocals.wav"), out)
        shutil.move(str(tmp / "htdemucs/in/no_vocals.wav"), out.with_suffix(".rest.wav"))
        shutil.rmtree(tmp)
        print("분리", out.name, flush=True)
print("STEMSDONE", flush=True)
