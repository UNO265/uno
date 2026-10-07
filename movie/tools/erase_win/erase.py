"""한국어 자막·채널 로고를 AI(ProPainter)로 지운 영상을 만든다. Windows + NVIDIA GPU(8GB) 기준.

동작
1. 영역(regions.json)마다 원본에서 그 부분만 잘라 프레임(PNG)으로 뽑는다.
2. 프레임마다 글자(흰/색 글자 + 검은 테두리)를 찾아 마스크를 만든다. 로고 영역은 고정 마스크.
3. ProPainter로 마스크 부분을 앞뒤 프레임을 참고해 메운다(구간을 나눠 8GB VRAM 안에서).
4. 메운 조각을 원본 위치에 다시 붙이고 원본 소리를 그대로 넣어 <원본이름>_clean.mp4로 저장한다.

사용:  python erase.py 원본.mp4 [--regions regions.json] [--preview 20]
필요:  ffmpeg(PATH), ProPainter 폴더(README 참고), Python 패키지(opencv-python numpy)
"""
import argparse, json, os, shutil, subprocess, sys
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
PROPAINTER = Path(os.environ.get("PROPAINTER_DIR", HERE / "ProPainter"))


def run(cmd, **kw):
    print(">", " ".join(map(str, cmd)))
    subprocess.run(cmd, check=True, **kw)


def probe(src):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=width,height,r_frame_rate", "-of", "json", str(src)], capture_output=True, text=True, check=True).stdout
    s = json.loads(out)["streams"][0]
    n, d = s["r_frame_rate"].split("/")
    return s["width"], s["height"], float(n) / float(d)


def text_mask(img, dilate, down=0):
    """흰 글자 또는 밝은 색 글자 중 검은 테두리가 붙어 있는 픽셀 = 자막 글자."""
    a = img.astype(np.int16)
    mx, mn = a.max(2), a.min(2)
    white = mn > 200
    col = (mx > 160) & ((mx - mn) > 70)
    dark = (mx < 55).astype(np.uint8)
    near_dark = cv2.dilate(dark, np.ones((9, 9), np.uint8)) > 0
    t = ((white | col) & near_dark).astype(np.uint8)
    # 글자가 모인 가로 줄만 남긴다(배경의 우연한 밝은 점 제거)
    rows = t.sum(1)
    t[rows < 6] = 0
    if t.sum() < 150:
        return np.zeros(t.shape, np.uint8)
    t = cv2.morphologyEx(t, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    t = cv2.dilate(t, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (dilate, dilate)))
    if down:  # 글자 아래로 번진 그림자까지 덮는다(흰 배경에서 회색 자국이 남는 것 방지)
        t = cv2.dilate(t, np.ones((down + 1, 1), np.uint8), anchor=(0, down))
    return t * 255


def process_region(src, reg, work, fps, preview):
    name = reg["name"]; x, y, w, h = reg["box"]
    w -= w % 8; h -= h % 8  # ProPainter는 8의 배수가 안전
    sc = reg.get("scale", 1.0)  # 0.5면 가로세로 반으로 줄여 메운다(약 4배 빠름). 지운 자리만 원래 크기로 되돌려 붙인다
    pw, ph = max(8, int(w * sc) // 8 * 8), max(8, int(h * sc) // 8 * 8)
    d = work / name
    if d.exists(): shutil.rmtree(d)
    (d / "frames").mkdir(parents=True); (d / "masks").mkdir()
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if preview: cmd += ["-t", str(preview)]
    cmd += ["-i", str(src), "-vf", f"crop={w}:{h}:{x}:{y}", "-start_number", "0", str(d / "frames" / "%05d.png")]
    run(cmd)
    frames = sorted((d / "frames").glob("*.png"))
    fixed = None
    if reg.get("mode") == "fixed":
        fixed = np.zeros((h, w), np.uint8)
        mx, my, mw, mh = reg.get("mask_box", [0, 0, w, h])
        fixed[my:my + mh, mx:mx + mw] = 255
    on = 0
    for f in frames:
        m = fixed if fixed is not None else text_mask(cv2.imread(str(f)), reg.get("dilate", 15), reg.get("shadow_down", 0))
        on += int(m.any())
        cv2.imwrite(str(d / "masks" / f.name), m)
    print(f"[{name}] frames {len(frames)}, frames with mask {on}")
    # ProPainter는 모든 프레임을 GPU에 한꺼번에 올린다 → 구간(chunk)으로 나눠 실행(8GB VRAM)
    out = d / "out"; out.mkdir()
    chunk, ov = reg.get("chunk", 240), 12
    n = len(frames); s0 = 0; k = 0
    while s0 < n:
        a0 = max(0, s0 - ov); e0 = min(n, s0 + chunk)
        cd = d / f"c{k:03d}"; (cd / "f").mkdir(parents=True); (cd / "m").mkdir()
        names = [frames[i].name for i in range(a0, e0)]
        if not any(cv2.imread(str(d / "masks" / nm), 0).any() for nm in names):
            for nm in names[s0 - a0:]: shutil.copy(d / "frames" / nm, out / nm)  # 지울 것이 없는 구간
        else:
            for nm in names:
                if (pw, ph) == (w, h):
                    shutil.copy(d / "frames" / nm, cd / "f" / nm); shutil.copy(d / "masks" / nm, cd / "m" / nm)
                else:
                    cv2.imwrite(str(cd / "f" / nm), cv2.resize(cv2.imread(str(d / "frames" / nm)), (pw, ph), interpolation=cv2.INTER_AREA))
                    m = cv2.resize(cv2.imread(str(d / "masks" / nm), 0), (pw, ph), interpolation=cv2.INTER_AREA)
                    cv2.imwrite(str(cd / "m" / nm), np.where(m > 0, 255, 0).astype(np.uint8))
            run([sys.executable, str(PROPAINTER / "inference_propainter.py"),
                 "--video", str(cd / "f"), "--mask", str(cd / "m"), "--output", str(cd / "pp"),
                 "--fp16", "--save_frames", "--subvideo_length", str(reg.get("subvideo_length", 60)),
                 "--neighbor_length", "10", "--ref_stride", "10", "--width", str(pw), "--height", str(ph)],
                cwd=str(PROPAINTER))
            res = sorted((cd / "pp" / "f" / "frames").glob("*.png"))
            if len(res) != len(names):
                raise SystemExit(f"ProPainter 결과 프레임 수가 맞지 않습니다: {cd}")
            for i, nm in enumerate(names):
                if i < s0 - a0: continue  # 앞쪽 겹침 구간은 버림
                if (pw, ph) == (w, h):
                    shutil.copy(res[i], out / nm); continue
                # 줄여서 메운 결과를 키워, 마스크(부드러운 가장자리) 부분만 원본 프레임에 섞는다 → 글자 없는 곳은 원본 화질 그대로
                big = cv2.resize(cv2.imread(str(res[i])), (w, h), interpolation=cv2.INTER_CUBIC)
                org = cv2.imread(str(d / "frames" / nm))
                al = cv2.GaussianBlur(cv2.imread(str(d / "masks" / nm), 0), (9, 9), 0).astype(np.float32)[..., None] / 255
                cv2.imwrite(str(out / nm), (org * (1 - al) + big * al).astype(np.uint8))
        shutil.rmtree(cd)
        s0 = e0; k += 1
    return out, (x, y, w, h)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--regions", default=str(HERE / "regions.json"))
    ap.add_argument("--preview", type=float, default=0, help="앞부분 N초만 처리(테스트용)")
    a = ap.parse_args()
    src = Path(a.src).resolve()
    W, H, fps = probe(src)
    regs = json.load(open(a.regions, encoding="utf-8"))["regions"]
    work = src.parent / (src.stem + "_erase_work")
    work.mkdir(exist_ok=True)
    done = [process_region(src, r, work, fps, a.preview) for r in regs]
    # 원본 위에 메운 조각을 덮어 합성
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if a.preview: cmd += ["-t", str(a.preview)]
    cmd += ["-i", str(src)]
    for fdir, _ in done:
        cmd += ["-framerate", str(fps), "-start_number", "0", "-i", str(fdir / "%05d.png")]
    chain, last = [], "[0:v]"
    for i, (_, (x, y, w, h)) in enumerate(done):
        chain.append(f"{last}[{i + 1}:v]overlay={x}:{y}:shortest=1[v{i}]"); last = f"[v{i}]"
    out = src.with_name(src.stem + ("_clean_preview" if a.preview else "_clean") + ".mp4")
    cmd += ["-filter_complex", ";".join(chain), "-map", last, "-map", "0:a?", "-c:v", "libx264", "-crf", "16",
            "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "copy", str(out)]
    run(cmd)
    print("완료:", out)


if __name__ == "__main__":
    main()
