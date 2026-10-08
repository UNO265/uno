"""자막 최종 검수 시트(0.5초 단위) — 렌더링 전 필수 단계 (04 E9-7, 2026-10-08 사용자 결정).

한 장 = 16초(15초 간격, 1초 겹침):
  위: 0.5초마다 화면(자막이 입혀진 모습, 화자 색 그대로)
  아래: 대사 목소리 파형(음원 분리한 목소리만) / 말소리 구간(VAD, 초록 막대)
        / 새로 인식한 단어(빨강, --asr) / 원본 단어 시각(파랑) / 자막 막대(화자 색·시각·문장)
→ 자막 시작·끝이 말과 맞는지, 말했는데 자막이 없는지, 화면 속 말하는 사람과 화자 색이 맞는지,
  어린이 대사(인식이 약함)가 빠지거나 밀렸는지를 눈으로 전부 확인한다.

사용(렌더링 없이):
  1) python3 assemble.py <plan> <cues> <sources.json> <out.mp4> --ass-only   # out.ass + out.timeline.json
  2) python3 subs_zoom.py <case_dir> <out.ass> [--asr] [--from 초] [--to 초] [--video 렌더본.mp4]
     case_dir 에 sources.json, stems/(<ep>_<s0>_<s1>.wav), words_<ep>.json 이 있어야 한다.
     결과: <case_dir>/zoom_<ass이름>/z_XXXX.jpg, report.txt(어긋남·자막 없는 말 목록)
  --video 를 주면 렌더본 화면을 쓰고, 없으면 원본 프레임에 ASS를 입혀 만든다(렌더링 불필요).
"""
import glob, json, re, shutil, subprocess, sys, tempfile
from pathlib import Path
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont

FONTS = "/home/user/media/fonts"
SR = 16000
COL = {"C": (92, 200, 255), "E": (255, 128, 192), "B": (255, 230, 0), "J": (124, 224, 124), "-": (255, 212, 0), "N": (255, 255, 255)}


def sec(x):
    if isinstance(x, (int, float)): return float(x)
    p = x.split(":"); return sum(float(v) * 60 ** i for i, v in enumerate(reversed(p)))


def ass_time(x): h, m, s = x.split(":"); return int(h) * 3600 + int(m) * 60 + float(s)


def load_subs(ass):
    subs = []
    for l in open(ass, encoding="utf8"):
        if not l.startswith("Dialogue"): continue
        p = l.rstrip("\n").split(",", 9); st = p[3]
        if not (st.startswith("Y") or st == "N"): continue
        subs.append((ass_time(p[1]), ass_time(p[2]), "N" if st == "N" else (st[1:] or "-"),
                     re.sub(r"\{[^}]*\}", "", p[9]).replace("\\N", "")))
    return sorted(subs)


def voc_track(case, items, out):
    """타임라인대로 대사 목소리(stem)만 이어 붙인 16kHz 트랙."""
    stems = []
    for p in (case / "stems").glob("*.wav"):
        if p.name.endswith(".rest.wav"): continue
        ep, a, b = p.stem.split("_"); stems.append((ep, int(a), int(b), p))
    total = max(i["start"] + i["dur"] for i in items)
    buf = np.zeros(int(total * SR) + SR, np.float32)
    for it in items:
        if it["type"] != "clip": continue
        a, b = sec(it["src"][0]), sec(it["src"][1])
        c = [s for s in stems if s[0] == it["ep"] and s[1] <= a and s[2] >= b]
        if not c: print("stem 없음:", it); continue
        _, s0, _, p = min(c, key=lambda s: s[2] - s[1]); sr = sf.info(p).samplerate
        x, _ = sf.read(p, start=int((a - s0) * sr), frames=int(it["dur"] * sr), dtype="float32")
        x = x.mean(1) if x.ndim > 1 else x
        x = np.interp(np.arange(0, len(x), sr / SR), np.arange(len(x)), x).astype(np.float32)
        i0 = int(it["start"] * SR); buf[i0:i0 + len(x)] = x[:len(buf) - i0]
    sf.write(out, buf, SR)


def run_asr(wav, out):
    from faster_whisper import WhisperModel
    m = WhisperModel("medium", device="cpu", compute_type="int8")
    segs, _ = m.transcribe(str(wav), language="en", word_timestamps=True, condition_on_previous_text=False,
                           vad_filter=True, vad_parameters=dict(min_silence_duration_ms=300, threshold=0.3))
    json.dump([dict(s=s.start, e=s.end, w=[(w.start, w.end, w.word) for w in s.words]) for s in segs], open(out, "w"))


def run_vad(wav, out):
    from faster_whisper.audio import decode_audio
    from faster_whisper.vad import get_speech_timestamps, VadOptions
    a = decode_audio(str(wav), sampling_rate=SR)
    ts = get_speech_timestamps(a, VadOptions(threshold=0.35, min_silence_duration_ms=150, speech_pad_ms=30, min_speech_duration_ms=120))
    json.dump([(t["start"] / SR, t["end"] / SR) for t in ts], open(out, "w"))


def proxy_frames(case, items, ass, t0, t1, d):
    """원본 프레임(0.5초 격자)에 ASS를 입힌 화면 — 렌더링 없이."""
    srcs = json.load(open(case / "sources.json")); raw = Path(d) / "raw"; raw.mkdir()
    grid = np.arange(t0, t1, 0.5)
    vf = "scale=640:360:force_original_aspect_ratio=increase,crop=640:360"
    for k, t in enumerate(grid):
        it = next((i for i in items if i["start"] <= t < i["start"] + i["dur"]), None)
        dst = raw / f"{k:05d}.png"
        if it is None: Image.new("RGB", (640, 360)).save(dst); continue
        if it["type"] == "clip": st = sec(it["src"][0]) + t - it["start"]
        elif it["type"] == "freeze": st = sec(it["at"])
        else: st = sec(it.get("bg", 0))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{st:.3f}", "-i", srcs[it["ep"]], "-frames:v", "1", "-vf", vf, str(dst)])
        if not dst.exists(): Image.new("RGB", (640, 360)).save(dst)
    shifted = Path(d) / "s.ass"   # 창 시작을 0초로 당긴 ASS
    txt = open(ass, encoding="utf8").read()
    def sh(m):
        v = max(0.0, ass_time(m.group(0)) - t0); return f"{int(v // 3600)}:{int(v % 3600 // 60):02d}:{v % 60:05.2f}"
    shifted.write_text(re.sub(r"\d+:\d\d:\d\d\.\d\d", sh, txt), encoding="utf8")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "2", "-i", str(raw / "%05d.png"), "-vf",
                    f"scale=1280:720,subtitles={shifted}:fontsdir={FONTS},scale=256:144", "-start_number", "1", f"{d}/f%03d.png"], check=True)


def sheet(case, items, ass, subs, words, srcw, vad, wav, t0, t1, out, video):
    F = ImageFont.truetype(f"{FONTS}/NotoSansJP-Bold.ttf", 15); Fs = ImageFont.truetype(f"{FONTS}/NotoSansJP-Medium.ttf", 13)
    d = tempfile.mkdtemp()
    if video:
        subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t0), "-t", str(t1 - t0), "-i", video, "-vf", "fps=2,scale=256:144", f"{d}/f%03d.png"], check=True)
    else:
        proxy_frames(case, items, ass, t0, t1, d)
    fr = sorted(glob.glob(d + "/f*.png"))
    W, cols = 1536, 6; rows = (len(fr) + cols - 1) // cols; TL = 400
    img = Image.new("RGB", (W, rows * 144 + TL), (20, 20, 20)); dr = ImageDraw.Draw(img)
    for i, f in enumerate(fr):
        x, y = (i % cols) * 256, (i // cols) * 144; img.paste(Image.open(f), (x, y))
        tt = t0 + i * 0.5; dr.rectangle([x, y, x + 70, y + 18], fill=(0, 0, 0)); dr.text((x + 3, y), f"{int(tt // 60)}:{tt % 60:05.2f}", font=Fs, fill=(255, 255, 0))
    shutil.rmtree(d)
    Y = rows * 144; px = lambda t: int((t - t0) / (t1 - t0) * W)
    for s in np.arange(np.ceil(t0 * 2) / 2, t1, 0.5):
        dr.line([px(s), Y, px(s), Y + TL], fill=(60, 60, 60) if s % 1 else (110, 110, 110))
        if s % 1 == 0: dr.text((px(s) + 2, Y + 2), f"{int(s // 60)}:{int(s % 60):02d}", font=Fs, fill=(200, 200, 200))
    a, _ = sf.read(wav, start=int(t0 * SR), frames=int((t1 - t0) * SR))
    env = np.array([np.abs(a[int(i * len(a) / W):int((i + 1) * len(a) / W)]).max() if len(a) else 0 for i in range(W)])
    env = env / max(env.max(), 1e-4)
    for x, e in enumerate(env): dr.line([x, Y + 60 - int(e * 40), x, Y + 60 + int(e * 40)], fill=(80, 160, 80))
    for v in vad:
        if v[1] > t0 and v[0] < t1: dr.rectangle([px(v[0]), Y + 102, px(v[1]), Y + 108], fill=(0, 255, 0))
    for base, ws, c1, c2 in ((112, words, (255, 120, 120), (255, 170, 170)), (170, srcw, (120, 200, 255), (150, 215, 255))):
        ws = [w for w in ws if w[1] > t0 and w[0] < t1]
        for k, w in enumerate(ws):
            yy = Y + base + (k % 3) * 18; dr.line([px(w[0]), yy, px(w[0]), yy + 16], fill=c1); dr.text((px(w[0]) + 2, yy), w[2], font=Fs, fill=c2)
    sel = [s for s in subs if s[1] > t0 and s[0] < t1]
    for k, (a_, b_, sp, tx) in enumerate(sel):
        yy = Y + 228 + (k % 4) * 42; c = COL.get(sp, (200, 200, 200))
        dr.rectangle([px(a_), yy, px(b_), yy + 34], outline=c, width=2)
        dr.text((max(px(a_), 0) + 3, yy + 1), f"[{sp}] {a_ % 60:.2f}-{b_ % 60:.2f} {tx}", font=F, fill=c)
    img.save(out, quality=85)


def report(subs, words, out):
    ys = [s for s in subs if s[2] != "N"]; L = []
    f = lambda x: f"{int(x // 60)}:{x % 60:05.2f}"
    L.append("== 자막별 어긋남(새 인식 단어 기준, ±0.3초 오차 있음) ==")
    for a, b, sp, tx in ys:
        ov = [w for w in words if w[1] > a - 0.15 and w[0] < b + 0.15]
        if not ov: L.append(f"{f(a)} [{sp}] 말 없음 | {tx}"); continue
        d0, d1 = ov[0][0] - a, ov[-1][1] - b; fl = []
        if d0 > 0.7: fl.append(f"자막먼저{d0:.1f}")
        if d0 < -0.4: fl.append(f"자막늦음{-d0:.1f}")
        if d1 > 0.4: fl.append(f"말이남음{d1:.1f}")
        if d1 < -1.2: fl.append(f"자막길게{-d1:.1f}")
        if b - a < 0.8 + 0.09 * len(tx.split("　")[-1]): fl.append(f"짧음{b - a:.1f}s")
        if fl: L.append(f"{f(a)} [{sp}] {','.join(fl)} | {tx} | EN: {' '.join(w[2] for w in ov)[:90]}")
    L.append("== 자막 없는 말 ==")
    unc = [w for w in words if not any(s[0] - 0.1 <= (w[0] + w[1]) / 2 <= s[1] + 0.1 for s in ys)]
    g = []
    for w in unc:
        if g and w[0] - g[-1][-1][1] < 0.8: g[-1].append(w)
        else: g.append([w])
    for x in g: L.append(f"{f(x[0][0])}-{f(x[-1][1])} ({x[-1][1] - x[0][0]:.1f}s) {' '.join(w[2] for w in x)[:120]}")
    Path(out).write_text("\n".join(L) + "\n", encoding="utf8")


def main():
    case, ass = Path(sys.argv[1]), Path(sys.argv[2]); a = sys.argv
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    items = json.load(open(ass.with_suffix(".timeline.json")))["items"]
    od = case / f"zoom_{ass.stem}"; od.mkdir(exist_ok=True)
    wav = od / "voc.wav"
    if not wav.exists(): voc_track(case, items, wav)
    if "--asr" in a and not (od / "asr.json").exists(): run_asr(wav, od / "asr.json")
    if not (od / "vad.json").exists(): run_vad(wav, od / "vad.json")
    words = [(w[0], w[1], w[2].strip()) for s in json.load(open(od / "asr.json")) for w in s["w"]] if (od / "asr.json").exists() else []
    vad = json.load(open(od / "vad.json"))
    SW = {}
    for p in case.glob("words_*.json"):
        SW[p.stem[6:]] = [(w[0], w[1], w[2].strip()) for x in json.load(open(p)) for w in x["w"]]
    srcw = []
    for it in items:
        if it["type"] != "clip" or it["ep"] not in SW: continue
        s0, s1 = sec(it["src"][0]), sec(it["src"][1])
        srcw += [(it["start"] + w[0] - s0, it["start"] + w[1] - s0, w[2]) for w in SW[it["ep"]] if s0 - 0.05 <= w[0] < s1]
    subs = load_subs(ass)
    if words: report(subs, words, od / "report.txt")
    total = max(i["start"] + i["dur"] for i in items)
    for s in np.arange(float(opt("--from", 0)), float(opt("--to", total)), 15):
        out = od / f"z_{int(s):04d}.jpg"
        sheet(case, items, ass, subs, words, srcw, vad, wav, s, min(s + 16, total), out, opt("--video"))
        print(out.name, flush=True)
    print("ZOOMDONE", od)


if __name__ == "__main__":
    main()
