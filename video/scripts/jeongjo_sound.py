"""정조 편 소리 연출: 장(章)별 wav(public/jeongjo/sound/<장>.wav) + cues.json.

층: 공간 소리(장면 종류별) + 음악 패드(장별 곡상, 12초마다 화음 이동) + 가야금풍 뜯음(드문드문) + 강조 효과음.
내레이션이 나오는 동안 음악은 자동으로 낮춘다(공간 소리는 유지). 모두 numpy 로 직접 합성한 오리지널.
"""
import json
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import jeongjo_look as L  # noqa: E402  (crackle, crickets, pad, rustle, thump, swell, bell, lp)

SR = L.SR
FPS = 30
OUT = ROOT / "public/jeongjo/sound"
rng = np.random.default_rng(1800)


def smooth(x, k):
    """이동 평균(누적합, 긴 창에서도 빠름)."""
    c = np.cumsum(np.concatenate([np.zeros(1), x]))
    y = (c[k:] - c[:-k]) / k
    pad = k // 2
    return np.concatenate([np.full(pad, y[0]), y, np.full(len(x) - len(y) - pad, y[-1])])

WARM = {"unfold", "room", "macro", "flame", "hesitate", "datemark", "reading", "outro", "endscreen", "quote", "duality", "scales", "moods", "word", "count", "decree", "draft", "stack", "number", "figures", "angry", "medicine", "person", "datecard", "time", "choice"}
NIGHT = {"messenger", "sleepless", "walk", "drawer"}
DAWN = {"court", "wait", "sillok"}
DAY = {"study", "family"}
MODERN = {"phone", "meeting", "museum", "resign"}

# 장별 곡상: 화음 진행(Hz), 뜯음 음계(MIDI), 음량
def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


MOODS = {
    "open": ([[45, 52, 57], [43, 50, 55], [41, 48, 57]], [57, 60, 62, 64, 67, 69], 0.055),
    "pro": ([[45, 52, 57, 64], [41, 48, 53, 60], [43, 50, 55, 62]], [57, 60, 62, 64, 67, 69], 0.05),
    "ch1": ([[40, 47, 53], [41, 46, 53], [40, 47, 52]], [52, 55, 57, 59, 62], 0.05),
    "ch2": ([[40, 47, 55], [36, 43, 52], [38, 45, 53]], [64, 67, 69, 71, 74], 0.05),
    "ch3": ([[38, 45, 52, 57], [36, 43, 50, 55], [38, 45, 50, 57]], [50, 53, 55, 57, 60], 0.05),
    "ch4": ([[36, 43, 49], [37, 44, 50], [36, 43, 48]], [48, 51, 53, 55, 58], 0.045),
    "ch5": ([[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 57, 64]], [60, 62, 64, 67, 69, 72], 0.055),
    "epi": ([[41, 48, 57, 64], [43, 50, 59, 62], [48, 55, 60, 64]], [60, 62, 65, 67, 69, 72], 0.055),
    "end": ([[48, 55, 60, 64]], [60, 64, 67], 0.05),
}


def roomtone(n, k=0.02):
    """방 울림: 아주 낮고 부드러운 잡음(딸깍거림 없음)."""
    return smooth(smooth(rng.normal(0, 1, n), 600), 600) * 25 * k


def soft_swell(dur):
    """암전 직전 부풂: 거친 잡음 대신 낮은 소리로."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    return smooth(rng.normal(0, 1, n), 200) * 6 * (t / dur) ** 3 * 0.25 + np.sin(2 * np.pi * 55 * t) * (t / dur) ** 3 * 0.08


def wind(n, k=0.03):
    y = L.lp(rng.normal(0, 1, n), 60)
    return y * (0.6 + 0.4 * np.sin(2 * np.pi * 0.05 * np.arange(n) / SR + 1)) * k


def birds(n, rate=0.25, k=0.02):
    y = np.zeros(n)
    t = np.arange(int(0.18 * SR)) / SR
    for p in rng.choice(n, size=max(1, int(n / SR * rate)), replace=False):
        f0 = rng.uniform(2800, 4200)
        chirp = np.sin(2 * np.pi * (f0 + 1800 * t) * t) * np.sin(np.pi * t / t[-1]) ** 2
        for r in range(rng.integers(1, 4)):
            q = p + int(r * 0.22 * SR)
            y[q:q + len(chirp)] += chirp[: len(y[q:q + len(chirp)])]
    return y * k


def hum(n, k=0.012):
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 60 * t) * 0.4 + np.sin(2 * np.pi * 120 * t) * 0.2 + smooth(rng.normal(0, 1, n), 200) * 2) * k


def pluck(freq, dur=2.5, amp=0.12):
    n = int(dur * SR)
    per = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, per)
    for _ in range(3):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.zeros(n + per)
    out[:per] = buf
    i = per
    while i < n:
        k = min(per, n - i)
        prev = out[i - per:i - per + k + 1]
        out[i:i + k] = 0.996 * 0.5 * (prev[:k] + prev[1:k + 1])
        i += k
    return out[:n] * amp * np.minimum(1, np.arange(n) / (0.012 * SR))


def impact():
    t = np.arange(int(1.6 * SR)) / SR
    return np.sin(2 * np.pi * 42 * t * (1 - 0.3 * t)) * np.exp(-t * 3.5) * np.minimum(1, t / 0.02) * 0.6


def thud():
    t = np.arange(int(0.6 * SR)) / SR
    return (np.sin(2 * np.pi * 75 * t * (1 - 0.4 * t)) * np.exp(-t * 16) + smooth(rng.normal(0, 1, len(t)), 40) * np.exp(-t * 35) * 0.3) * np.minimum(1, t / 0.006) * 0.5


def step():
    t = np.arange(int(0.25 * SR)) / SR
    return (L.lp(rng.normal(0, 1, len(t)), 25) * np.exp(-t * 30) + np.sin(2 * np.pi * 110 * t) * np.exp(-t * 25) * 0.4) * 0.25


def pop():
    t = np.arange(int(0.12 * SR)) / SR
    return np.sin(2 * np.pi * 1200 * t) * np.exp(-t * 50) * 0.08


def add(y, x, at):
    p = int(at * SR)
    if p >= len(y) or p < -len(x):
        return
    if p < 0:
        x, p = x[-p:], 0
    x = x[: len(y) - p]
    y[p:p + len(x)] += x


def word_at(c, key, default):
    for s in c["sentences"]:
        for w in s["words"]:
            if key in w["text"]:
                return w["start"]
    return default


def main():
    tl = json.loads((ROOT / "public/jeongjo/timeline.json").read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    secs = []
    for c in tl["cuts"]:
        if not secs or secs[-1]["sec"] != c["sec"]:
            secs.append({"sec": c["sec"], "from": c["from"], "to": c["from"] + c["duration"], "cuts": [c]})
        else:
            secs[-1]["to"] = c["from"] + c["duration"]
            secs[-1]["cuts"].append(c)
    cues = []
    for s in secs:
        tail = 2.0
        dur = (s["to"] - s["from"]) / FPS + tail
        n = int(dur * SR)
        amb = np.zeros(n)
        mus = np.zeros(n)
        fx = np.zeros(n)
        speech = np.zeros(n)
        chords, scale, lvl = MOODS[s["sec"]]
        # 음악: 12초마다 화음 이동, 3초 크로스페이드
        seg = int(12 * SR)
        for k in range(0, n, seg):
            ch = chords[(k // seg) % len(chords)]
            m = min(n - k, seg + 3 * SR)
            y = L.pad(m, [hz(x) for x in ch], lvl)
            env = np.minimum(1, np.arange(m) / (3 * SR)) * np.minimum(1, (m - np.arange(m)) / (3 * SR))
            add(mus, y * env, k / SR)
        # 뜯음: 5~9초마다 한 음
        tt = rng.uniform(2, 5)
        while tt < dur - 3:
            add(mus, pluck(hz(rng.choice(scale)), amp=0.07), tt)
            tt += rng.uniform(5, 9)
        for c in s["cuts"]:
            a = (c["from"] - s["from"]) / FPS
            d = c["duration"] / FPS + 0.5
            m = int(d * SR)
            sc = c["scene"]
            if sc in WARM:
                y = roomtone(m)  # 촛불 타닥임·벌레 소리(치지직)는 빼고 부드러운 방 울림만
            elif sc in NIGHT:
                y = L.crickets(m) * 0.4 + wind(m, 0.02)
            elif sc in DAWN:
                y = wind(m, 0.025)
            elif sc in DAY:
                y = wind(m, 0.018) + roomtone(m)
            elif sc in MODERN:
                y = hum(m)
            else:
                y = wind(m, 0.02)
            if sc == "chapter":
                y = wind(m, 0.02)
                add(fx, impact() * 0.7, a + 0.2)
                add(fx, L.bell() * 0.8, a + 0.9)
            env = np.minimum(1, np.arange(m) / (0.5 * SR)) * np.minimum(1, (m - np.arange(m)) / (0.5 * SR))
            add(amb, y * env, a)
            for sn in c["sentences"]:
                speech[int((a + sn["start"]) * SR):int((a + sn["end"] + 0.2) * SR)] = 1
            p = c["p"]
            if sc == "unfold":
                t0 = 26 / FPS if p.get("quote") else (c["sentences"][1]["start"] - 0.3 if p.get("close") and len(c["sentences"]) > 1 else 0.6)
            if sc in ("flame",):
                add(fx, L.thump(3), a + word_at(c, p.get("stopWord", "없애"), d - 3))
            if sc == "drawer" and p.get("title"):
                ti = c["sentences"][-1]["end"] + 0.2
                add(fx, soft_swell(1.1), a + c["sentences"][0]["start"] - 1.2)
                add(fx, L.bell(), a + ti)
            if sc == "angry":
                add(fx, impact(), a + word_at(c, "개돼지", 1.0) - 0.05)
            if sc == "macro" and p.get("stamps"):
                for i, key in enumerate(["의견", "당부", "꾸짖", "언제"][: len(p["stamps"])]):
                    add(fx, thud() * 0.6, a + word_at(c, key, 1 + i))
            if sc == "decree":
                add(fx, thud(), a + c["sentences"][0]["start"] + 1.0)
            if sc == "count":
                for key in ("25자", "20자", "45자"):
                    add(fx, thud() * 0.4, a + word_at(c, key, 2))
            if sc == "walk" and p.get("mode") == "walk" and len(c["sentences"]) >= 4:
                for w0, w1 in ((c["sentences"][2]["start"], c["sentences"][2]["start"] + 2.6), (c["sentences"][3]["start"] - 2, c["sentences"][3]["start"] + 2.3)):
                    t = w0
                    while t < w1:
                        add(fx, step(), a + t)
                        t += 0.62
            if sc == "phone":
                for sn in c["sentences"]:
                    add(fx, pop(), a + sn["start"] + 0.4)
            if sc == "stack":
                t = 0.4
                while t < d - 2:
                    t += rng.uniform(0.15, 0.4)
                add(fx, L.bell() * 0.6, a + d - 1.6)
            if sc == "hesitate":
                pass
        # 내레이션 동안 음악 낮추기(부드럽게)
        duck = 1 - 0.55 * smooth(speech, int(0.3 * SR))
        if s["sec"] == "end":
            duck[:] = 1
        mix = amb + mus * duck + fx
        fade = np.minimum(1, (n - np.arange(n)) / (tail * SR))
        mix = np.tanh(mix * fade * 1.1) / 1.1
        st = np.stack([mix, np.roll(mix, int(0.011 * SR)) * 0.97], 1)
        pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
        with wave.open(str(OUT / f"{s['sec']}.wav"), "w") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(pcm.tobytes())
        cues.append({"file": f"jeongjo/sound/{s['sec']}.wav", "from": s["from"], "to": s["to"] + int(tail * FPS), "vol": 1.0})
        print(s["sec"], f"{dur:.0f}s")
    (OUT / "cues.json").write_text(json.dumps(cues, indent=1))


if __name__ == "__main__":
    main()
