"""plan 의 vocals 클립 중 기존 분리 덩어리로 덮이지 않는 것을 모아(20초 이내 간격 병합, ±4초 여유) 음원 분리.
사용: python3 stems_plan.py <plan.json>"""
import json, subprocess, shutil, tempfile, sys
from pathlib import Path
R = Path("/home/user/media/case003")
srcs = {p.name.split("Ep ")[1].split(".")[0].strip(): p for p in (R / "src").glob("*.mp4")}
def sec(t): m, s = t.split(":"); return int(m) * 60 + float(s)
def covered(ep, a, b):
    for f in (R / "stems").glob(f"{ep}_*.wav"):
        if f.name.endswith(".rest.wav"): continue
        s0, s1 = map(float, f.stem.split("_")[1:3])
        if s0 <= a and b <= s1: return True
    return False
plan = json.load(open(sys.argv[1]))
todo = {}
for it in plan["items"]:
    if it["type"] == "clip" and it.get("audio") == "vocals":
        a, b = map(sec, it["src"])
        if not covered(it["ep"], a, b): todo.setdefault(it["ep"], []).append([a, b])
for ep, spans in todo.items():
    spans.sort(); g = []
    for a, b in spans:
        if g and a - g[-1][1] <= 20: g[-1][1] = max(g[-1][1], b)
        else: g.append([a, b])
    for a, b in g:
        s0, s1 = max(0, int(a - 4)), int(b + 5)
        out = R / "stems" / f"{ep}_{s0}_{s1}.wav"
        tmp = Path(tempfile.mkdtemp(dir=R / "stems"))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(s0), "-t", str(s1 - s0), "-i", str(srcs[ep[2:]]),
                        "-vn", "-ac", "2", "-ar", "44100", str(tmp / "in.wav")], check=True)
        subprocess.run(["python3", "-m", "demucs", "-n", "htdemucs", "--two-stems=vocals", "-j", "1", "-o", str(tmp), str(tmp / "in.wav")],
                       check=True, capture_output=True)
        shutil.move(str(tmp / "htdemucs/in/vocals.wav"), out)
        shutil.move(str(tmp / "htdemucs/in/no_vocals.wav"), out.with_suffix(".rest.wav"))
        shutil.rmtree(tmp)
        print("분리", out.name, flush=True)
print("완료")
