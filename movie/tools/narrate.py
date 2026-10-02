"""해설 문장 묶음마다 일본어 음성을 만들고, 창(win) 안에 들어가도록 속도를 맞춘다.

순서(지침 4장): 문장 축약(대본에서) → 합성 속도(rate) → 필요할 때만 후처리 가속(atempo ≤ 1.25).
결과: work/<slug>/tts/<id>.wav, <id>.json(단어 경계, 가속 반영), narr.json(배치 정보).
"""
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
slug = sys.argv[1]
S = json.load(open(ROOT / f"projects/{slug}/script.json"))
W = ROOT / f"work/{slug}/tts"; W.mkdir(parents=True, exist_ok=True)

def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True).stdout)

def synth(text, base, rate):
    subprocess.run([sys.executable, str(ROOT / "tools/tts.py"), text, str(base), rate, S["voice"]], check=True)
    # 앞뒤 무음 제거(말끝 자음 보존을 위해 끝은 여유를 둔다)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{base}.mp3", "-af",
                    "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,apad=pad_dur=0.06,areverse",
                    "-ar", "44100", "-ac", "1", f"{base}.raw.wav"], check=True)
    words = json.load(open(f"{base}.json"))
    # 무음 제거로 앞부분이 잘린 만큼 단어 시각을 당긴다
    lead = words[0]["t"] if words else 0
    for w in words: w["t"] = round(w["t"] - lead + 0.06, 3)
    return words, dur(f"{base}.raw.wav")

out = []
for n in S["narration"]:
    win = n["win"][1] - n["win"][0]
    base = W / n["id"]
    chosen = None
    for r in [0, 4, 8, 12, 16, 20]:
        words, d = synth(n["ja"], base, f"+{r}%")
        chosen = (r, words, d)
        if d <= win - 0.05: break
    r, words, d = chosen
    tempo = 1.0
    if d > win - 0.05:
        tempo = round(d / (win - 0.05), 3)
    af = f"atempo={tempo}" if tempo > 1.0 else "anull"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{base}.raw.wav", "-af", af, "-ar", "44100", f"{base}.wav"], check=True)
    for w in words:
        w["t"] = round(w["t"] / tempo, 3); w["d"] = round(w["d"] / tempo, 3)
    fd = dur(f"{base}.wav")
    json.dump(words, open(f"{base}.words.json", "w"), ensure_ascii=False)
    out.append(dict(id=n["id"], start=n["win"][0], win=n["win"], rate=r, tempo=tempo, dur=round(fd, 3), end=round(n["win"][0] + fd, 3)))
    flag = "  <-- 1.25배 초과, 대본 축약 필요" if tempo > 1.25 else ""
    print(f"{n['id']} win {win:5.2f}s  rate +{r:2d}%  tempo {tempo:.3f}  dur {fd:5.2f}s{flag}")
json.dump(out, open(W.parent / "narr.json", "w"), indent=1)
