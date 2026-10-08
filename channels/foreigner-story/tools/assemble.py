"""구성안(plan JSON)대로 원본 구간·정지 화면·카드를 이어 붙이고, 자막·내레이션을 입힌다.

사용: python3 assemble.py <plan.json> <cues_src.json> <source.mp4 | sources.json> <out.mp4> [--ass-only]
  원본이 여러 편이면 sources.json({"Ep24": "/path/ep24.mp4", ...})을 주고, item·cue에 "ep"를 적는다(#003부터).
  item "audio": "vocals" 이면 plan["stems_dir"]/<ep>_<IN>_<OUT>.wav(음원 분리한 목소리)를 소리로 쓴다(원본 음악 제거, 04 E6).

plan items
  clip   : {"src": [IN, OUT], "label"?: 날짜·장소 표시, "narr"?: 장면 위 내레이션, "narr_at"?: 시작 오프셋}
  freeze : {"at": 원본 시각, "narr": 내레이션}  → 그 프레임을 천천히 확대하며 멈추고 내레이션(길이는 음성에 맞춤)
  card   : {"dur": 초, "big": 큰 글자, "small": 작은 글자}  → 남색 바탕 카드
cues_src : 원본 시각 기준 노란 자막(화자 포함). clip 구간 안의 자막만 그 위치로 옮긴다.

v1.2 §8: 장면 순서는 바꿔도 각 장면의 발언은 그 장면에만 붙는다(자막은 원본 시각으로만 매핑).
"""
import json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import build_subs as B  # 스타일·내레이션 설정 재사용

W, H, FPS = 1280, 720, 25
PIC_H = 540
NAVY = "0x1B2A41"
ENC = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS),
       "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"]


def sec(t):
    m, s = t.split(":")
    return int(m) * 60 + float(s)


def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                          "-of", "csv=p=0", str(p)]))


def run(args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def synth(texts, readings, tmp, speed=1.25):
    from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile
    lib = next((B.VV / "onnxruntime" / "lib").glob("libvoicevox_onnxruntime.so.*.*"))
    syn = Synthesizer(Onnxruntime.load_once(filename=str(lib)), OpenJtalk(str(B.VV / "open_jtalk_dic_utf_8-1.11")))
    with VoiceModelFile.open(str(B.VV / "vvms" / "6.vvm")) as m:
        syn.load_voice_model(m)
    out = {}
    for i, t in enumerate(texts):
        s = t.replace("——", "、")
        for k, v in readings.items():
            s = s.replace(k, v)
        q = syn.create_audio_query(s, B.NARR_STYLE)
        q.speed_scale, q.pre_phoneme_length, q.post_phoneme_length = speed, 0.05, 0.15
        raw = Path(tmp) / f"nr{i}.wav"
        raw.write_bytes(syn.synthesis(q, B.NARR_STYLE))
        wav = Path(tmp) / f"n{i}.wav"
        run(["-i", str(raw), "-af", "aresample=48000:resampler=soxr", "-ac", "2", str(wav)])
        out[t] = (wav, dur(wav))
    return out


def pic_vf(it, fill):
    """원본(1280x540, 약 2.37:1)을 화면에 놓는 방법. fill=16:9 가득(좌우를 잘라 확대, it['cx']로 자르는 위치 0~1),
    아니면 위아래 검은 띠(letterbox)."""
    if fill:
        cx = it.get("cx", 0.5)
        return f"scale=-2:{H},crop={W}:{H}:(iw-{W})*{cx}:0"
    return f"scale={W}:-2,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:black"


def src_of(src, it):
    return src[it["ep"]] if isinstance(src, dict) else src


def stem_of(plan, it):
    """그 클립을 덮는 음원 분리 덩어리(<ep>_<시작초>_<끝초>.wav)와 덩어리 안의 시작 위치."""
    a, b = map(sec, it["src"])
    for f in sorted(Path(plan["stems_dir"]).glob(f"{it['ep']}_*.wav")):
        if f.name.endswith(".rest.wav"):
            continue
        s0, s1 = map(float, f.stem.split("_")[1:3])
        if s0 <= a and b <= s1:
            return f, a - s0
    raise SystemExit(f"음원 분리 덩어리 없음: {it['ep']} {it['src']}")


def render_items(plan, srcs, tmp, narr):
    fill = plan.get("frame") == "fill"
    files = []
    for i, it in enumerate(plan["items"]):
        p = Path(tmp) / f"{i:03d}.mp4"
        src = src_of(srcs, it) if it["type"] != "card" or it.get("bg") else None
        if it["type"] == "clip":
            a, b = map(sec, it["src"])
            d = b - a
            f = min(0.06, d / 4)
            af = f"aresample=48000,afade=t=in:d={f},afade=t=out:st={d - f:.3f}:d={f}"
            if it.get("audio") == "vocals":       # 음원 분리한 목소리만(원본 음악 제거)
                stem, off = stem_of(plan, it)
                run(["-ss", f"{a:.3f}", "-i", src, "-ss", f"{off:.3f}", "-i", str(stem),
                     "-t", f"{d:.3f}", "-map", "0:v", "-map", "1:a",
                     "-vf", f"{pic_vf(it, fill)},fps={FPS},format=yuv420p", "-af", af, *ENC, str(p)])
            else:
                run(["-ss", f"{max(0, a - 3):.3f}", "-i", src, "-ss", f"{min(3, a):.3f}", "-t", f"{d:.3f}",
                     "-vf", f"{pic_vf(it, fill)},fps={FPS},format=yuv420p", "-af", af, *ENC, str(p)])
        elif it["type"] == "freeze":
            png = Path(tmp) / f"{i:03d}.png"
            run(["-ss", f"{sec(it['at']):.3f}", "-i", src, "-frames:v", "1", str(png)])
            d = narr[it["narr"]][1] + 1.1
            n = int(d * FPS)
            if fill:
                zp = (f"{pic_vf(it, True)},scale={W * 2}:-2,zoompan=z='1+0.05*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
                      f":d={n}:s={W}x{H}:fps={FPS},format=yuv420p")
            else:
                zp = (f"scale={W * 2}:-2,zoompan=z='1+0.05*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
                      f":d={n}:s={W}x{PIC_H}:fps={FPS},pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:black,format=yuv420p")
            run(["-i", str(png), "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", f"{d:.3f}",
                 "-vf", zp, *ENC, str(p)])
        elif it["type"] == "card" and it.get("bg"):
            # 그 장을 대표하는 장면을 흐리고 어둡게 깔고(남색을 살짝 섞음) 위에 큰 글자를 올린다
            a = sec(it["bg"])
            vf = (f"scale=-2:{H},crop={W}:{H},boxblur=10:2,eq=brightness=-0.18:saturation=0.75,"
                  f"drawbox=x=0:y=0:w={W}:h={H}:color={NAVY}@0.45:t=fill,fps={FPS},format=yuv420p")
            run(["-ss", f"{max(0, a - 3):.3f}", "-i", src, "-ss", f"{min(3, a):.3f}", "-t", str(it["dur"]),
                 "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-map", "0:v", "-map", "1:a",
                 "-vf", vf, "-t", str(it["dur"]), *ENC, str(p)])
        elif it["type"] == "card":
            run(["-f", "lavfi", "-i", f"color=c={NAVY}:s={W}x{H}:r={FPS}:d={it['dur']}",
                 "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", str(it["dur"]), *ENC, str(p)])
        files.append(p)
    return files


def split_narr(e, limit=None):
    limit = limit or NARR_LIMIT
    """긴 내레이션 자막을 문장(。)·쉼표(、) 단위로 나눠 차례로 보여 준다(한 줄 원칙, 화면 밖으로 넘치지 않게)."""
    import re
    parts = [p for p in re.split(r"(?<=。)", e["ja"]) if p]
    out = []
    for p in parts:
        if len(p) > limit:
            sub = [q for q in re.split(r"(?<=、)", p) if q]
            buf = ""
            for q in sub:
                if buf and len(buf + q) > limit:
                    out.append(buf); buf = q
                else:
                    buf += q
            if buf:
                out.append(buf)
        else:
            out.append(p)
    n = [len(x) for x in out]
    t, span, res = e["t0"], e["t1"] - e["t0"], []
    for x, k in zip(out, n):
        d = span * k / sum(n)
        res.append(dict(e, ja=x, t0=t, t1=t + d - 0.04))
        t += d
    return res


def build_events(plan, cues, starts, durs, narr):
    ev, narr_pos = [], []
    for it, t0, d in zip(plan["items"], starts, durs):
        if it["type"] == "clip":
            a, b = map(sec, it["src"])
            for c in cues:
                if c.get("ep") != it.get("ep"):
                    continue
                # 클립과 겹치는 자막은 모두(클립 앞에서 시작한 말도) — 겹침이 0.3초 이하인 조각만 뺀다
                if c["kind"] == "Y" and min(c["s1"], b) - max(c["s0"], a) > 0.3:
                    ev.append(dict(t0=t0 + max(0, c["s0"] - a), t1=t0 + min(c["s1"], b) - a, kind="Y",
                                   spk=c.get("spk"), ja=c["ja"]))
            if it.get("label"):
                ev.append(dict(t0=t0 + 0.2, t1=t0 + min(d, 3.8), kind="L", ja=it["label"]))
            if it.get("narr"):
                at = t0 + it.get("narr_at", 0.5)
                ln = narr[it["narr"]][1]
                ev.append(dict(t0=at, t1=at + ln + 0.3, kind="N", ja=it["narr"]))
                narr_pos.append((at, ln, narr[it["narr"]][0]))
        elif it["type"] == "freeze":
            at = t0 + 0.4
            ln = narr[it["narr"]][1]
            ev.append(dict(t0=at, t1=t0 + d - 0.1, kind="N", ja=it["narr"]))
            narr_pos.append((at, ln, narr[it["narr"]][0]))
        elif it["type"] == "card":
            ev.append(dict(t0=t0 + 0.25, t1=t0 + d - 0.2, kind="CB", ja=it["big"]))
            if it.get("small"):
                ev.append(dict(t0=t0 + 0.25, t1=t0 + d - 0.2, kind="CS", ja=it["small"]))
    ev = [x for e in ev for x in (split_narr(e) if e["kind"] == "N" else [e])]
    ev.sort(key=lambda e: e["t0"])
    ys = [e for e in ev if e["kind"] == "Y"]
    for x, y in zip(ys, ys[1:]):
        if x["t1"] > y["t0"] - 0.05:
            x["t1"] = max(x["t0"] + 0.4, y["t0"] - 0.05)
    return ev, narr_pos


FILL = False
FONT_SCALE = 1.0
NARR_LIMIT = 22
SPK_COLORS = {}   # plan["speaker_colors"]: {"C": "FF8A00", ...} 화자별 노란 계열 색(#RRGGBB), #004부터


def write_ass(ev, cards, total, path):
    head = Path(path).with_suffix(".head")
    B.write_ass([], total, head)                      # 기본 스타일(Y·YS·YK·YJ·N·C)을 받아 온다
    base = head.read_text(encoding="utf-8").split("Format: Layer")[0]
    base += "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"
    styles_extra = (
        "Style: L,TBN Noto Sans JP Medium,26,&H00EAF3F7,&H00EAF3F7,&H00000000,&H00000000,0,0,0,0,100,100,2,0,1,0,0,8,20,20,30,1\n"
        "Style: CB,TBN Noto Sans JP Bold,84,&H00EAF3F7,&H00EAF3F7,&H00000000,&H00000000,0,0,0,0,100,100,2,0,1,0,0,5,80,80,0,1\n"
        "Style: CS,TBN Noto Sans JP Medium,40,&H002E10C8,&H002E10C8,&H00000000,&H00000000,0,0,0,0,100,100,4,0,1,0,0,5,80,80,0,1\n")
    for k, rgb in SPK_COLORS.items():     # plan 의 화자 색(기본 YS·YK·YJ 외)
        bgr = rgb[4:6] + rgb[2:4] + rgb[0:2]
        base = re.sub(rf"Style: Y{k},[^\n]*\n", "", base)
        styles_extra += f"Style: Y{k},TBN Noto Sans JP Bold,50,&H00{bgr},&H00{bgr},&H00000000,&H00000000,0,0,0,0,100,100,1,0,1,4,0,2,60,60,22,1\n"
    base = base.replace("\n[Events]", styles_extra + "\n[Events]")
    if FILL:   # 16:9 가득: 글자가 화면 위에 올라가므로 테두리·그림자를 더하고 자막을 조금 올린다
        base = re.sub(r"(Style: Y[A-Z]?,[^\n]*?),1,4,0,2,60,60,22,1", r"\1,1,4,2,2,60,60,64,1", base)
        base = base.replace("&H40FFFFFF,&H40FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,22,22,34,1",
                            "&H30FFFFFF,&H30FFFFFF,&H80000000,&H80000000,0,0,0,0,100,100,0,0,1,1.5,0,7,22,22,22,1")
        base = base.replace("&H00EAF3F7,&H00EAF3F7,&H00000000,&H00000000,0,0,0,0,100,100,2,0,1,0,0,8,20,20,30,1",
                            "&H00EAF3F7,&H00EAF3F7,&H00000000,&H80000000,0,0,0,0,100,100,2,0,1,2.5,1,8,20,20,26,1")
    if FONT_SCALE != 1.0:   # plan["font_scale"]: 대사(Y*)·내레이션(N) 글자 크기 배율(#004부터, 시청자 고령층)
        base = re.sub(r"(Style: (?:Y[A-Z]?|N),TBN Noto Sans JP Bold,)(\d+)", lambda m: m.group(1) + str(round(int(m.group(2)) * FONT_SCALE)), base)
    lines = []
    # 출처 표시는 카드 위에는 띄우지 않는다
    edges = [0.0]
    for a, b in cards:
        edges += [a, b]
    edges.append(total)
    for a, b in zip(edges[::2], edges[1::2]):
        if b - a > 0.2:
            lines.append(f"Dialogue: 0,{B.ass_time(a)},{B.ass_time(b)},C,,0,0,0,,{B.CREDIT}")
    seen = set()
    for e in ev:
        st, tx = e["kind"], e["ja"]
        if st == "Y":
            spk = e.get("spk")
            if spk in B.SPEAKERS:
                st = "Y" + spk if f"Style: Y{spk}," in base else "Y"   # 화자 색 스타일이 없으면 기본 노랑
                if spk not in seen:
                    tx = "{\\fs%d}" % round(32 * FONT_SCALE) + B.SPEAKERS[spk] + "{\\fs%d}　" % round(50 * FONT_SCALE) + tx
                    seen.add(spk)
        elif st == "CB":
            tx = "{\\pos(640,380)\\fad(250,200)\\bord2\\3c&H00141414&}" + tx
        elif st == "CS":
            tx = "{\\pos(640,262)\\fad(250,200)}" + tx
        lines.append(f"Dialogue: 1,{B.ass_time(e['t0'])},{B.ass_time(e['t1'])},{st},,0,0,0,,{tx}")
    Path(path).write_text(base + "\n".join(lines) + "\n", encoding="utf-8")
    head.unlink()


def main():
    plan_p, cues_p, src, out = sys.argv[1:5]
    if src.endswith(".json"):
        src = json.load(open(src))
    plan = json.load(open(plan_p))
    if plan.get("credit"):                 # CASE별 출처 표기·화자 이름(plan에 있으면 그것을 쓴다)
        B.CREDIT = plan["credit"]
    if plan.get("speakers"):
        B.SPEAKERS = plan["speakers"]
    global FILL, SPK_COLORS, FONT_SCALE, NARR_LIMIT
    FONT_SCALE = plan.get("font_scale", 1.0)
    NARR_LIMIT = plan.get("narr_line_chars", 22)
    FILL = plan.get("frame") == "fill"
    SPK_COLORS = plan.get("speaker_colors", {})
    cues = json.load(open(cues_p))
    tmp = tempfile.mkdtemp(prefix="asm_", dir=os.path.dirname(os.path.abspath(out)))
    texts = [it["narr"] for it in plan["items"] if it.get("narr")]
    narr = synth(texts, plan.get("readings", {}), tmp, plan.get("narr_speed", 1.25))
    files = render_items(plan, src, tmp, narr)
    durs = [dur(f) for f in files]
    starts = [sum(durs[:i]) for i in range(len(durs))]
    total = sum(durs)
    ev, narr_pos = build_events(plan, cues, starts, durs, narr)
    cards = [(s, s + d) for it, s, d in zip(plan["items"], starts, durs) if it["type"] == "card"]
    ass = Path(out).with_suffix(".ass")
    write_ass(ev, cards, total, ass)
    json.dump(dict(items=[dict(it, start=round(s, 2), dur=round(d, 2)) for it, s, d in zip(plan["items"], starts, durs)],
                   events=ev), open(Path(out).with_suffix(".timeline.json"), "w"), ensure_ascii=False, indent=1)
    lst = Path(tmp) / "list.txt"
    lst.write_text("".join(f"file '{f}'\n" for f in files))
    cut = Path(tmp) / "cut.mp4"
    run(["-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(cut)])
    if "--ass-only" in sys.argv:
        print(f"ASS → {ass}, cut → {cut}, total {total:.1f}s")
        return
    inputs = ["-i", str(cut), "-i", str(B.WATERMARK)]
    for _, _, w in narr_pos:
        inputs += ["-i", str(w)]
    duck = "+".join(f"between(t,{a - 0.15:.2f},{a + l + 0.25:.2f})" for a, l, _ in narr_pos) or "0"
    fc = [f"[0:v]subtitles={ass}:fontsdir={B.FONTS}[s]",
          "[1:v]scale=58:-1,format=rgba,colorchannelmixer=aa=0.85[w]",
          "[s][w]overlay=W-w-20:16[v]",
          f"[0:a]volume='if({duck},{B.DUCK},1)':eval=frame[o]"]
    mix = "[o]"
    for i, (a, _, _) in enumerate(narr_pos):
        ms = int(a * 1000)
        fc.append(f"[{i + 2}:a]adelay={ms}|{ms},volume=1.6[n{i}]")
        mix += f"[n{i}]"
    fc.append(f"{mix}amix=inputs={len(narr_pos) + 1}:normalize=0:duration=first[a]")
    run([*inputs, "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]",
         "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-c:a", "aac", "-b:a", "192k",
         "-movflags", "+faststart", out])
    ny = sum(e["kind"] == "Y" for e in ev)
    print(f"items {len(files)}, Y {ny}, N {len(narr_pos)}, total {int(total // 60)}:{total % 60:04.1f} → {out}")
    shutil.rmtree(tmp, ignore_errors=True)          # 클립 조각 정리(디스크 보호)


if __name__ == "__main__":
    main()
