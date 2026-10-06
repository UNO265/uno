"""원본 분석(지침 2장): 레이아웃 측정, 한국어 자막 이벤트, 판독용 자막 시트, 음성 인식(한·영), 해설 분리.

사용: python3 tools/analyze.py <slug> [layout|events|asr|sep|all]
결과: work/<slug>/layout.json, events.json, evsheet*.png, asr_ko.json, asr_en.json, sep/htdemucs/orig/*.wav
"""
import json, subprocess, sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
slug = sys.argv[1]; step = sys.argv[2] if len(sys.argv) > 2 else "all"
W = ROOT / f"work/{slug}"; SRC = W / "source.mp4"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def frames_gray(vf, fps=None, ss=None, t=None):
    cmd = ["ffmpeg", "-v", "error"]
    if ss is not None: cmd += ["-ss", str(ss)]
    if t is not None: cmd += ["-t", str(t)]
    cmd += ["-i", str(SRC), "-vf", (f"fps={fps}," if fps else "") + vf, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    return subprocess.run(cmd, capture_output=True).stdout


def layout():
    """영화 화면의 위·아래 경계: 시간에 따라 거의 변하지 않는 줄(장식 배경)과 변하는 줄(영화)을 가른다."""
    raw = frames_gray("scale=270:480", fps=0.5)
    a = np.frombuffer(raw, np.uint8).reshape(-1, 480, 270, 3).astype(float).mean(3)
    var = a.std(0).mean(1)  # 줄마다 시간 변화량
    moving = var > max(8, np.percentile(var, 60) * 0.5)
    ys = np.where(moving)[0]
    # 가장 긴 연속 구간
    best, cur = (0, 0), [ys[0], ys[0]]
    for y in ys[1:]:
        if y == cur[1] + 1: cur[1] = y
        else:
            if cur[1] - cur[0] > best[1] - best[0]: best = tuple(cur)
            cur = [y, y]
    if cur[1] - cur[0] > best[1] - best[0]: best = tuple(cur)
    y0, y1 = best[0] * 4, (best[1] + 1) * 4
    # 1px 단위로 다듬기
    f = np.array(Image.open(W / "_l.png").convert("L")) if False else None
    out = dict(movie_y0=int(y0), movie_y1=int(y1))
    json.dump(out, open(W / "layout.json", "w")); print("layout", out)
    return out


def events(band=(1180, 1420)):
    """한국어 자막(흰 글자=해설, 색 글자=대사, 검은 테두리) 이벤트를 0.1초 단위로 찾는다."""
    y0, y1 = band
    raw = frames_gray(f"crop=1080:{y1 - y0}:0:{y0}", fps=10)
    A = np.frombuffer(raw, np.uint8).reshape(-1, y1 - y0, 1080, 3)  # 프레임별로 int 변환(메모리 절약)
    masks, kinds = [], []
    for a in A:
        a = a.astype(np.int16)
        mx, mn, g = a.max(2), a.min(2), a[..., 1]
        white = mn > 215; col = (mx > 170) & ((mx - mn) > 80)
        dark = mx < 45
        dl = np.zeros_like(dark)
        for s in range(1, 6):
            dl[:, s:] |= dark[:, :-s]; dl[:, :-s] |= dark[:, s:]
        t = (white | col) & dl
        # 자막 줄(글자가 몰린 가로 띠)만 남긴다
        rows = t.sum(1); keep = rows > 12
        t &= keep[:, None]
        masks.append(t); kinds.append(((white & dl).sum(), (col & dl).sum()))
    cnt = np.array([m.sum() for m in masks])
    ev, cur = [], None
    for i in range(len(masks)):
        on = cnt[i] > 250
        if on and cur is not None:
            inter = (masks[i] & masks[cur["ref"]]).sum(); uni = (masks[i] | masks[cur["ref"]]).sum()
            if inter / uni > 0.45: cur["end"] = i; continue
        if cur: ev.append(cur); cur = None
        if on: cur = dict(start=i, end=i, ref=i)
    if cur: ev.append(cur)
    out = []
    for e in ev:
        if e["end"] - e["start"] < 2: continue
        mid = e["start"] + (e["end"] - e["start"]) // 2
        m = masks[mid]; ys, xs = np.where(m)
        w_, c_ = kinds[mid]
        out.append(dict(s=e["start"] / 10, e=(e["end"] + 1) / 10, ref=mid, x0=int(np.percentile(xs, 2)), x1=int(np.percentile(xs, 98)),
                        y0=int(ys.min()) + y0, y1=int(ys.max()) + y0, kind="C" if c_ > w_ else "W"))
    json.dump(out, open(W / "events.json", "w"))
    # 판독용 시트
    f = ImageFont.truetype(FONT, 22)
    per = 24
    for k in range(0, len(out), per):
        ch = out[k:k + per]
        sheet = Image.new("RGB", (1120, ((len(ch) + 1) // 2) * 80), (40, 40, 40))
        for j, e in enumerate(ch):
            fr = A[e["ref"]].astype(np.uint8)
            cy = (e["y0"] + e["y1"]) // 2 - y0
            im = Image.fromarray(fr[max(0, cy - 45):cy + 45, 140:940]).resize((460, 52))
            x = (j % 2) * 560; y = (j // 2) * 80
            sheet.paste(im, (x + 95, y + 12))
            ImageDraw.Draw(sheet).text((x + 2, y + 5), f"{k + j}\n{e['s']:.1f}", font=f, fill=(255, 255, 0))
        sheet.save(W / f"evsheet{k // per}.png")
    print("events", len(out))


def asr():
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-ac", "1", "-ar", "16000", str(W / "a16k.wav")], check=True)
    from faster_whisper import WhisperModel
    m = WhisperModel("medium", device="cpu", compute_type="int8")
    for lang in ("ko", "en"):
        segs, _ = m.transcribe(str(W / "a16k.wav"), language=lang, word_timestamps=True, beam_size=5, condition_on_previous_text=False)
        res = [dict(start=round(s.start, 2), end=round(s.end, 2), text=s.text,
                    words=[(round(w.start, 2), round(w.end, 2), w.word) for w in s.words]) for s in segs]
        json.dump(res, open(W / f"asr_{lang}.json", "w"), ensure_ascii=False, indent=1)
        print(f"asr {lang}", len(res))


def sep():
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-ar", "44100", str(W / "orig.wav")], check=True)
    subprocess.run([sys.executable, "-m", "demucs", "--two-stems=vocals", "-n", "htdemucs", "-o", str(W / "sep"), str(W / "orig.wav")],
                   check=True, capture_output=True)
    print("sep done")


if __name__ == "__main__":
    steps = {"layout": layout, "events": events, "asr": asr, "sep": sep}
    for k, fn in steps.items():
        if step in (k, "all"): fn()
