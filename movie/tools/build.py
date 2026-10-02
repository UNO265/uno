"""원본 영상 + script.json → 일본어 숏츠 완성본(MP4·SRT·ASS).

전제: tools/narrate.py(해설 음성), tools/bgm.py(BGM), demucs 분리(work/<slug>/sep/...), events.json(한국어 자막 이벤트)이 끝나 있어야 한다.
사용: python3 tools/build.py <slug> [--preview 시작 길이]
"""
import json, re, subprocess, sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
slug = sys.argv[1]
P = ROOT / f"projects/{slug}"; W = ROOT / f"work/{slug}"; O = ROOT / f"outputs/{slug}"
O.mkdir(parents=True, exist_ok=True)
S = json.load(open(P / "script.json"))
L = S["layout"]
SR = 44100
FPS = 30


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


def load(path, ch=2):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()


DUR = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(ROOT / S["source"])],
                           capture_output=True, text=True).stdout)
NS = int(DUR * SR)


def env(spans, ramp, n=NS):
    """spans 안에서 1, 밖에서 0인 포락선(ramp초 경사)."""
    e = np.zeros(n, np.float32)
    for a, b in spans:
        e[max(0, int(a * SR)):min(n, int(b * SR))] = 1
    k = max(1, int(ramp * SR))
    ker = np.ones(k, np.float32) / k
    return np.clip(np.convolve(e, ker, mode="same"), 0, 1)


# ---------- 해설 배치 정보 ----------
narr = {x["id"]: x for x in json.load(open(W / "narr.json"))}
nspans = [(narr[n["id"]]["start"], narr[n["id"]]["end"]) for n in S["narration"]]
dspans = [tuple(d["t"]) for d in S["dialogue"]]


# ---------- 오디오 ----------
def build_audio():
    orig = load(W / "orig.wav")[:NS]
    nov = load(W / "sep/htdemucs/orig/no_vocals.wav")[:NS]
    n = min(len(orig), len(nov), NS)
    orig, nov = orig[:n], nov[:n]
    # 한국어 해설 구간만 해설 제거 트랙으로 바꾼다(경계 80ms 크로스페이드). 나머지는 원본(배우 대사·효과음) 그대로.
    k = env(S["korean_narration_spans"], 0.08, n)[:, None]
    movie = orig * (1 - k) + nov * k
    # 일본어 해설 중에는 영화 소리를 약 -5dB
    duck = 1 - 0.44 * env([(a - 0.15, b + 0.2) for a, b in nspans], 0.3, n)
    movie *= duck[:, None]
    # 해설 음성
    voice = np.zeros((n, 2), np.float32)
    for nn in S["narration"]:
        v = load(W / f"tts/{nn['id']}.wav", 1)[:, 0]
        v = v * (0.12 / (np.sqrt((v ** 2).mean()) + 1e-9))  # 문장 묶음끼리 같은 크기
        a = int(narr[nn["id"]]["start"] * SR)
        b = min(n, a + len(v))
        voice[a:b] += v[: b - a, None]
    # BGM: 해설·대사 중에는 낮추고(-11dB), 비는 구간은 조금 올린다
    bgm = load(W / "bgm.wav")[:n]
    if len(bgm) < n:
        bgm = np.vstack([bgm, np.zeros((n - len(bgm), 2), np.float32)])
    talk = env([(a - 0.2, b + 0.3) for a, b in nspans + dspans], 0.4, n)
    bgm *= (0.55 - 0.40 * talk)[:, None]
    mix = movie + voice + bgm
    raw = W / "mix_raw.wav"
    pcm = (np.clip(mix, -1, 1) * 32767).astype("<i2")
    import wave
    with wave.open(str(raw), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    # 2패스 loudnorm(-14 LUFS, TP -1.5)
    m = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(raw), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
    af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
          f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,alimiter=limit=0.8:level=false")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", af, "-ar", str(SR), str(W / "mix.wav")])
    # 확인용: 영화 소리만(해설·BGM 없이) — 한국어 해설 잔여 검사에 쓴다
    pcm = (np.clip(movie, -1, 1) * 32767).astype("<i2")
    with wave.open(str(W / "movie_only.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


# ---------- 자막 ----------
def ts_ass(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"


def ts_srt(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def narration_lines():
    out = []
    for nn in S["narration"]:
        info = narr[nn["id"]]
        words = json.load(open(W / f"tts/{nn['id']}.words.json"))
        # 단어 토큰의 누적 글자 위치 → 시각
        pos = []; c = 0
        for w in words:
            t = re.sub(r"[、。，,.\s]", "", w["w"])
            pos.append((c, w["t"], w["t"] + w["d"])); c += len(t)
        chunks = [re.sub(r"。$", "", x) for x in nn["sub"].split("|")]
        starts = []; c = 0
        for ch in chunks:
            st = next((p[1] for p in pos if p[0] >= c), pos[-1][1])
            # 토큰 중간에서 시작하면 그 토큰 시작 시각
            for p in pos:
                if p[0] <= c: st = p[1]
            starts.append(st); c += len(re.sub(r"[、。]", "", ch))
        endv = pos[-1][2]
        for i, ch in enumerate(chunks):
            a = info["start"] + starts[i]
            b = info["start"] + (starts[i + 1] if i + 1 < len(chunks) else endv + 0.25)
            b = min(b, info["win"][1] + 0.3)
            text = ch.rstrip("、")
            out.append(dict(a=round(a, 2), b=round(b, 2), text=text, kind="narr", id=nn["id"]))
    return out


def build_subs():
    lines = narration_lines()
    for d in S["dialogue"]:
        lines.append(dict(a=d["t"][0], b=d["t"][1], text=d["ja"], kind="dia"))
    for c in S.get("captions", []):
        lines.append(dict(a=c["t"][0], b=c["t"][1], text=c["ja"], kind="cap", y=c["y"]))
    lines.sort(key=lambda x: x["a"])
    # 같은 종류 자막끼리 겹치지 않게(한 줄 규칙)
    main = [x for x in lines if x["kind"] != "cap"]
    for i in range(len(main) - 1):
        # 겹치면 자르고, 0.35초 미만의 빈틈은 이어 붙인다(블러만 남는 깜빡임 방지)
        if main[i]["b"] > main[i + 1]["a"] or main[i + 1]["a"] - main[i]["b"] < 0.35:
            main[i]["b"] = main[i + 1]["a"]
    title = "".join((r"{\c&H0049DCFF&}" if col == "yellow" else r"{\c&HFFFFFF&}") + txt for txt, col in S["title"])
    ty = L["movie_y0"] // 2
    ass = [
        "[Script Info]", "ScriptType: v4.00+", "PlayResX: 1080", "PlayResY: 1920", "WrapStyle: 2", "ScaledBorderAndShadow: yes", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        f"Style: Title,Dela Gothic One,{S.get('title_size', 144)},&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,5,60,60,0,1",
        "Style: Narr,Noto Sans CJK JP,80,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,4,1,5,60,60,0,1",
        "Style: Dia,Noto Sans CJK JP,80,&H0049DCFF,&H0049DCFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,4,1,5,60,60,0,1",
        "Style: Cap,Noto Sans CJK JP,60,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,3,1,5,60,60,0,1",
        "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
        f"Dialogue: 1,{ts_ass(0)},{ts_ass(DUR)},Title,,0,0,0,,{{\\pos(540,{ty})}}{title}",
    ]
    srt = []
    for i, x in enumerate(lines):
        style = {"narr": "Narr", "dia": "Dia", "cap": "Cap"}[x["kind"]]
        y = x.get("y", L["narr_y"])
        ass.append(f"Dialogue: 0,{ts_ass(x['a'])},{ts_ass(x['b'])},{style},,0,0,0,,{{\\pos(540,{y})}}{x['text']}")
        srt.append(f"{i + 1}\n{ts_srt(x['a'])} --> {ts_srt(x['b'])}\n{x['text']}\n")
    (O / f"{slug}_ja.ass").write_text("\n".join(ass) + "\n", encoding="utf-8")
    (O / f"{slug}_ja.srt").write_text("\n".join(srt), encoding="utf-8")
    json.dump(lines, open(W / "sublines.json", "w"), ensure_ascii=False, indent=1)
    return lines


# ---------- 블러 마스크(한국어 자막·캡션) ----------
MY0, MY1 = 1120, 1370  # 마스크 띠(자막 띠 + 캡션 위치 포함)


def build_mask():
    ev = json.load(open(W / "events.json"))
    rects = []
    for e in ev:
        half = max(540 - e["x0"], e["x1"] - 540) + 34
        half = min(half, 520)
        rects.append((e["s"] - 0.1, e["e"] + 0.12, 540 - half, L["sub_band"][0], 540 + half, L["sub_band"][1]))
    for c in S.get("captions", []):
        x, y, w, h = c["box"]
        rects.append((c["t"][0] - 0.1, c["t"][1] + 0.1, x, y, x + w, y + h))
    H = MY1 - MY0; Wd = 1080; F = 18
    yy, xx = np.mgrid[0:H, 0:Wd]
    nf = int(np.ceil(DUR * FPS))
    cache = {}
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{Wd}x{H}", "-r", str(FPS), "-i", "-",
                          "-c:v", "ffv1", str(W / "mask.mkv")], stdin=subprocess.PIPE)
    for f in range(nf):
        t = (f + 0.5) / FPS
        act = tuple(i for i, r in enumerate(rects) if r[0] <= t <= r[1])
        if act not in cache:
            m = np.zeros((H, Wd), np.float32)
            for i in act:
                _, _, x0, y0, x1, y1 = rects[i]
                y0 -= MY0; y1 -= MY0
                dx = np.minimum(xx - x0, x1 - xx); dy = np.minimum(yy - y0, y1 - yy)
                m = np.maximum(m, np.clip(np.minimum(dx, dy) / F + 0.5, 0, 1))
            cache[act] = (m * 255).astype(np.uint8).tobytes()
        p.stdin.write(cache[act])
    p.stdin.close(); p.wait()


# ---------- 영상 ----------
def render(preview=None):
    lx, ly, lw, lh = L["logo_blur"]
    box = L["box_color"].replace("#", "0x")
    # 원본 자체가 깨진 프레임은 직전 정상 프레임으로 바꾼다(layout.freeze: [첫, 끝, 대체] 프레임 번호)
    fz = L.get("freeze", [])
    freeze = "".join(f"[src{i}]split[fa{i}][fb{i}];[fa{i}][fb{i}]freezeframes=first={a}:last={b}:replace={r}[src{i + 1}];"
                     for i, (a, b, r) in enumerate(fz))
    fc = (
        f"[0:v]null[src0];{freeze}[src{len(fz)}]split=3[base][lg][bd];"
        f"[lg]crop={lw}:{lh}:{lx}:{ly},gblur=sigma=9[lgb];"
        f"[bd]crop=1080:{MY1 - MY0}:0:{MY0},gblur=sigma=26,boxblur=6:2[bdb];"
        f"[bdb][1:v]alphamerge[bdm];"
        f"[base][lgb]overlay={lx}:{ly}[v1];"
        f"[v1][bdm]overlay=0:{MY0}[v2];"
        f"[v2]drawbox=x=0:y=0:w=1080:h={L['movie_y0']}:color={box}:t=fill,"
        f"drawbox=x=0:y={L['movie_y1']}:w=1080:h={1920 - L['movie_y1']}:color={box}:t=fill,"
        + (f"setpts=PTS+{preview[0]}/TB," if preview else "")
        + f"ass={O / (slug + '_ja.ass')}:fontsdir={ROOT / 'work/fonts'}"
        + (",setpts=PTS-STARTPTS" if preview else "") + "[v]"
    )
    out = O / f"{slug}_ja.mp4" if not preview else W / "preview.mp4"
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if preview:
        cmd += ["-ss", str(preview[0]), "-t", str(preview[1])]
    cmd += ["-i", str(ROOT / S["source"])]
    if preview:
        cmd += ["-ss", str(preview[0]), "-t", str(preview[1])]
    cmd += ["-i", str(W / "mask.mkv")]
    if preview:
        cmd += ["-ss", str(preview[0]), "-t", str(preview[1])]
    cmd += ["-i", str(W / "mix.wav")]
    br = S.get("brand")
    if br:
        cmd += ["-loop", "1", "-i", str(ROOT / br["image"])]
        fc = fc.replace("[v]", "[vt]") + f";[3:v]scale=-1:{br['height']},format=rgba[brd];[vt][brd]overlay={br.get('x', '(W-w)/2')}:{br['y']}:shortest=1[v]"
    cmd += ["-filter_complex", fc, "-map", "[v]", "-map", "2:a",
            "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS),
            "-c:a", "aac", "-b:a", "192k", "-ar", str(SR), "-movflags", "+faststart", "-shortest", str(out)]
    run(cmd)
    print("wrote", out)


if __name__ == "__main__":
    pv = None
    if "--preview" in sys.argv:
        i = sys.argv.index("--preview"); pv = (float(sys.argv[i + 1]), float(sys.argv[i + 2]))
    if "--no-audio" not in sys.argv:
        build_audio()
    build_subs()
    if "--no-mask" not in sys.argv:
        build_mask()
    render(pv)
