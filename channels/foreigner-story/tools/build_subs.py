"""자막(ASS)·내레이션을 만들어 컷 영상에 입힌다.

사용: python3 build_subs.py <case_dir> <cut.mp4> <words.json> <out.mp4>
  case_dir: skeleton.json(현재 컷), subs_v1.py(CUES, ABS_CUES, V2_SHIFT 계산용) 가 있는 폴더
  words.json: cut.mp4 음성의 단어 단위 전사(faster-whisper word_timestamps)

- CUES의 시각은 「뼈대 v2」 기준이다. skeleton.json 의 v2→v3 차이(포켓몬 구간 앞 4.1초)를 원본 시각으로 환산해 옮긴다.
- 노란 자막(Y)은 단어 시각에 맞춰 시작·끝을 다시 잡는다(겹치면 앞 자막을 줄인다).
- 내레이션(N)은 VOICEVOX No.7 読み聞かせ(style 31)로 합성해 그 자리에 넣고, 그동안 원본 음량을 낮춘다.
- 화면: 1280x720(원본 1280x540 + 위아래 검은 띠). 자막은 아래 띠 쪽, 출처는 위 띠 왼쪽, 로고 워터마크는 위 띠 오른쪽.
"""
import importlib.util, json, os, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]           # 레포 루트
VV = ROOT / "video" / ".voicevox"
FONTS = Path("/home/user/media/fonts")
WATERMARK = Path(__file__).resolve().parents[1] / "brand" / "tabinome-watermark-300.png"
NARR_STYLE = 31          # No.7 読み聞かせ
DUCK = 0.3               # 내레이션 중 원본 음량
CREDIT = "映像：SilkyRonTheRoad（YouTube）"
READINGS = {"その夜": "そのよる"}   # 내레이션 읽기 보정
# 화자별 노란 계열 색(E3, 2026-10-02 사용자 결정): S=シルケ 노랑, K=キーラン 주황빛 노랑, J=일본인 출연자 연둣빛 노랑
SPEAKERS = {"S": "シルケ", "K": "キーラン", "J": "モリさん"}

V2_SEG15_SRC = "19:02.80"   # 뼈대 v2 의 포켓몬 구간 시작(원본 시각)


def sec(t):
    m, s = t.split(":")
    return int(m) * 60 + float(s)


def timeline(segs):
    out, off = [], 0.0
    for a, b, _ in segs:
        out.append((sec(a), sec(b), off))
        off += sec(b) - sec(a)
    return out


def v2_to_v3(t, seg, v2, v3):
    sa, sb, off = v2[seg - 1]
    src = sa + (t - off)
    sa3, sb3, off3 = v3[seg - 1]
    return off3 + (src - sa3)


def snap(cues, words):
    """노란 자막의 시작·끝을 단어 시각에 맞춘다."""
    ws = [(w["s"], w["e"]) for s in words for w in s["words"]]
    for c in cues:
        if c["kind"] != "Y" or c.get("abs"):
            continue
        inside = [w for w in ws if c["t0"] - 0.6 <= (w[0] + w[1]) / 2 <= c["t1"] + 0.6]
        if inside:
            c["t0"], c["t1"] = inside[0][0], inside[-1][1] + 0.35
    cues.sort(key=lambda c: c["t0"])
    for a, b in zip(cues, cues[1:]):
        if a["t1"] > b["t0"] - 0.05:
            a["t1"] = max(a["t0"] + 0.5, b["t0"] - 0.05)
    for a, b in zip(cues, cues[1:] + [None]):
        need = 0.9 + 0.11 * len(a["ja"].replace("\\N", ""))      # 읽을 시간
        room = (b["t0"] - 0.05) if b else a["t1"] + 3
        if a["t1"] - a["t0"] < need:
            a["t1"] = min(a["t0"] + need, room)
    return cues


def one_line(cues):
    """두 줄(\\N) 노란 자막을 글자 수 비율로 나눠 한 줄씩 차례로 보여 준다(E3: 한 줄 우선, 원본 화면 글자를 가리지 않게)."""
    out = []
    for c in cues:
        if c["kind"] == "Y" and "\\N" in c["ja"]:
            parts = c["ja"].split("\\N")
            n = [len(p) for p in parts]
            t, span = c["t0"], c["t1"] - c["t0"]
            for p, k in zip(parts, n):
                d = span * k / sum(n)
                out.append(dict(c, ja=p, t0=t, t1=t + d - 0.04))
                t += d
        else:
            out.append(c)
    return out


def ass_time(t):
    h, r = divmod(max(t, 0), 3600)
    m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def write_ass(cues, total, path):
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Y,TBN Noto Sans JP Bold,50,&H0000D4FF,&H0000D4FF,&H00000000,&H00000000,0,0,0,0,100,100,1,0,1,4,0,2,60,60,22,1
Style: YS,TBN Noto Sans JP Bold,50,&H0000D4FF,&H0000D4FF,&H00000000,&H00000000,0,0,0,0,100,100,1,0,1,4,0,2,60,60,22,1
Style: YK,TBN Noto Sans JP Bold,50,&H0033A7FF,&H0033A7FF,&H00000000,&H00000000,0,0,0,0,100,100,1,0,1,4,0,2,60,60,22,1
Style: YJ,TBN Noto Sans JP Bold,50,&H006BF2D9,&H006BF2D9,&H00000000,&H00000000,0,0,0,0,100,100,1,0,1,4,0,2,60,60,22,1
Style: N,TBN Noto Sans JP Bold,44,&H00FFFFFF,&H00FFFFFF,&H40141414,&H40141414,0,0,0,0,100,100,1,0,3,12,0,2,60,60,30,1
Style: C,TBN Noto Sans JP Medium,20,&H40FFFFFF,&H40FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,22,22,34,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = [f"Dialogue: 0,{ass_time(0)},{ass_time(total)},C,,0,0,0,,{CREDIT}"]
    seen = set()
    for c in cues:
        style, text = c["kind"], c["ja"]
        spk = c.get("spk")
        if style == "Y" and spk in SPEAKERS:
            style = "Y" + spk
            if spk not in seen:          # 처음 등장할 때만 이름을 작게 붙인다(E3)
                text = "{\\fs32}" + SPEAKERS[spk] + "{\\fs50}　" + text
                seen.add(spk)
        lines.append(f"Dialogue: 1,{ass_time(c['t0'])},{ass_time(c['t1'])},{style},,0,0,0,,{text}")
    Path(path).write_text(head + "\n".join(lines) + "\n", encoding="utf-8")


def narrate(cues, tmp):
    from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile
    lib = next((VV / "onnxruntime" / "lib").glob("libvoicevox_onnxruntime.so.*.*"))
    syn = Synthesizer(Onnxruntime.load_once(filename=str(lib)), OpenJtalk(str(VV / "open_jtalk_dic_utf_8-1.11")))
    with VoiceModelFile.open(str(VV / "vvms" / "6.vvm")) as m:
        syn.load_voice_model(m)
    out = []
    for i, c in enumerate(cues):
        if c["kind"] != "N":
            continue
        text = c["ja"].replace("\\N", "").replace("——", "、")
        for k, v in READINGS.items():
            text = text.replace(k, v)
        q = syn.create_audio_query(text, NARR_STYLE)
        q.speed_scale, q.pre_phoneme_length, q.post_phoneme_length = 0.95, 0.05, 0.2
        raw = Path(tmp) / f"n{i}.wav"
        raw.write_bytes(syn.synthesis(q, NARR_STYLE))
        wav = Path(tmp) / f"n{i}_48k.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", "aresample=48000:resampler=soxr",
                        "-ac", "2", str(wav)], check=True)
        d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                           "-of", "csv=p=0", str(wav)]))
        c["t1"] = max(c["t1"], c["t0"] + d + 0.3)
        out.append((c["t0"], d, wav))
    return out


def main():
    case, cut, words_json, out = sys.argv[1:5]
    case = Path(case)
    spec = importlib.util.spec_from_file_location("subs", case / "subs_v1.py")
    S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
    segs3 = json.load(open(case / "skeleton.json"))["segments"]
    segs2 = [list(s) for s in segs3]
    for s in segs2:
        if s[0] == "18:58.70":
            s[0] = V2_SEG15_SRC
    v2, v3 = timeline(segs2), timeline(segs3)
    total = v3[-1][2] + v3[-1][1] - v3[-1][0]

    cues = [dict(t0=v2_to_v3(t0, seg, v2, v3), t1=v2_to_v3(t1, seg, v2, v3), kind=k, ja=ja, ko=ko)
            for seg, t0, t1, k, ja, ko in S.CUES]
    cues += [dict(t0=t0, t1=t1, kind=k, ja=ja, ko=ko, abs=True) for t0, t1, k, ja, ko in S.ABS_CUES]
    cues = one_line(snap(cues, json.load(open(words_json))))

    sp = case / "speakers_v1.json"
    if sp.exists():
        for c, x in zip(cues, json.load(open(sp))):
            assert c["ja"] == x["ja"], (c["ja"], x["ja"])
            c["spk"] = x["spk"]

    tmp = tempfile.mkdtemp(prefix="subs_")
    narr = narrate(cues, tmp)
    ass = Path(out).with_suffix(".ass")
    write_ass(cues, total, ass)
    json.dump(cues, open(Path(out).with_suffix(".cues.json"), "w"), ensure_ascii=False, indent=1)
    if "--ass-only" in sys.argv:
        print(f"ASS → {ass}")
        return

    inputs = ["-i", cut, "-i", str(WATERMARK)]
    for _, _, w in narr:
        inputs += ["-i", str(w)]
    duck = "+".join(f"between(t,{t0 - 0.15:.2f},{t0 + d + 0.25:.2f})" for t0, d, _ in narr) or "0"
    fc = [f"[0:v]subtitles={ass}:fontsdir={FONTS}[s]",
          "[1:v]scale=58:-1,format=rgba,colorchannelmixer=aa=0.85[w]",
          "[s][w]overlay=W-w-20:16[v]",
          f"[0:a]volume='if({duck},{DUCK},1)':eval=frame[o]"]
    mix = "[o]"
    for i, (t0, _, _) in enumerate(narr):
        ms = int(t0 * 1000)
        fc.append(f"[{i + 2}:a]adelay={ms}|{ms},volume=1.6[n{i}]")
        mix += f"[n{i}]"
    fc.append(f"{mix}amix=inputs={len(narr) + 1}:normalize=0:duration=first[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fc),
                    "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
                    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], check=True)
    ny = sum(c["kind"] == "Y" for c in cues)
    print(f"Y {ny}, N {len(narr)}, total {int(total // 60)}:{total % 60:04.1f} → {out}")


if __name__ == "__main__":
    main()
