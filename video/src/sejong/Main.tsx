/** 세종 영상「고기 없인 못 살던 왕과 꺼지지 않는 편전의 불빛」 */
import "@fontsource/nanum-myeongjo/400.css";
import "@fontsource/nanum-myeongjo/700.css";
import "@fontsource/nanum-myeongjo/800.css";
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/noto-sans-kr/900.css";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import timeline from "../../public/sejong/timeline.json";
import cueList from "../../public/sejong/music/cues.json";
import { Cut, FPS, NoteTag, S, Subtitle, Vignette, at, clamp, visionAt } from "./ui";
import * as T from "./scenes_text";
import * as A from "./scenes_art";

const SCENES: Record<string, React.FC<{ cut: Cut }>> = {
  quote: T.Quote,
  word: T.Word,
  list: T.List,
  flip: T.Flip,
  question: T.Question,
  chapter: T.Chapter,
  title: T.Title,
  record: T.Record,
  gloss: T.Gloss,
  chart: T.Chart,
  years: T.Years,
  counter: T.Counter,
  calendar: T.Calendar,
  person: T.Person,
  stamp: T.Stamp,
  receipt: T.Receipt,
  choice: T.Choice,
  end: T.End,
  day: T.Day,
  night: A.Night,
  phone: A.Phone,
  bill: A.Bill,
  scroll: A.Scroll,
  table: A.Table,
  drama: A.Drama,
  bow: A.Bow,
  book: A.Book,
  fuel: A.Fuel,
  eye: A.Eye,
  cane: A.Cane,
  spine: A.Spine,
  gwejang: A.Gwejang,
  map: A.MapScene,
  sleep: A.Sleep,
  sundial: A.Sundial,
  rain: A.Rain,
  hangul: A.Hangul,
  legacy: A.Legacy,
  subway: A.Subway,
};

export const cutsSejong = timeline.cuts as unknown as Cut[];
export const totalSejong = timeline.totalFrames;
const placeholder = (timeline as any).placeholder as boolean;

/* ── 글꼴: 대본에 쓰이는 모든 글자의 글꼴 조각을 먼저 불러온다 ───────── */
const ALL_TEXT = JSON.stringify(timeline.cuts) + "ㄱㅋㆁㄷㅌㄴㅂㅍㅁㅈㅊㅅㆆㅎㅇㄹㅿㆍㅡㅣㅗㅏㅜㅓㅛㅑㅠㅕ진료기록부환자종합병원급영수증지불시간건강받는사람오늘의우리댓글구독좋아요✓≈";
const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const specs = ["400 40px 'Nanum Myeongjo'", "700 40px 'Nanum Myeongjo'", "800 40px 'Nanum Myeongjo'", "400 40px 'Noto Sans KR'", "500 40px 'Noto Sans KR'", "700 40px 'Noto Sans KR'", "900 40px 'Noto Sans KR'"];
    Promise.all(specs.map((s) => document.fonts.load(s, ALL_TEXT)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle));
  }, [handle]);
};

/* ── BGM: 파트별, 목소리 나올 때 낮춤 ───────── */
type Cue = { file: string; from: number; to: number; mood: string };
const VOICE: [number, number][] = cutsSejong.flatMap((c) => c.segments.map((s) => [c.from + Math.round(s.start * FPS), c.from + Math.round(s.end * FPS)] as [number, number]));
const DUCK = placeholder ? 0.75 : 0.32;
const duck = (f: number) => {
  let g = 1;
  for (const [a, b] of VOICE) {
    if (f >= a && f <= b) return DUCK;
    if (f < a && a - f < 12) g = Math.min(g, DUCK + ((1 - DUCK) * (a - f)) / 12);
    if (f > b && f - b < 24) g = Math.min(g, DUCK + ((1 - DUCK) * (f - b)) / 24);
  }
  return g;
};
const LEVEL: Record<string, number> = { hook: 0.34, prologue: 0.36, ch1: 0.3, ch2: 0.32, ch3: 0.3, ch4: 0.34, ch5: 0.34, epilogue: 0.36 };
const CueTrack: React.FC<{ cue: Cue }> = ({ cue }) => {
  const len = cue.to - cue.from;
  return (
    <Sequence from={cue.from} durationInFrames={len + 30} layout="none">
      <Audio
        src={staticFile(cue.file)}
        volume={(f) => (LEVEL[cue.mood] ?? 0.32) * interpolate(f, [0, 30, len - 10, len + 30], [0, 1, 1, 0], clamp) * duck(cue.from + f)}
      />
    </Sequence>
  );
};

/* ── 효과음 ───────── */
const SFX: { id: string; seg?: number; off?: number; file: string; vol: number }[] = [
  ...cutsSejong.filter((c) => c.scene === "chapter").map((c) => ({ id: c.id, file: "whoosh", vol: 0.5, off: 0 })),
  { id: "H04", seg: 1, off: 20, file: "stamp", vol: 0.9 },
  { id: "C306", seg: 2, off: 8, file: "stamp", vol: 0.9 },
  { id: "H06", seg: 1, off: 0, file: "bell", vol: 0.5 },
  { id: "C505", seg: 2, off: 0, file: "bell", vol: 0.4 },
  { id: "C511", seg: 1, off: 0, file: "bell", vol: 0.55 },
  { id: "C105", seg: 2, off: 0, file: "stamp", vol: 0.6 },
];

/** 컷 하나: 화면 + 시야 흐림 + 자막 + 표시 */
const CutView: React.FC<{ cut: Cut; prev: number }> = ({ cut, prev }) => {
  const f = useCurrentFrame();
  const Comp = SCENES[cut.scene] ?? T.Missing;
  const v = visionAt(cut, f, prev);
  const fadeIn = interpolate(f, [0, 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: S.dark }}>
      <AbsoluteFill style={{ opacity: fadeIn, filter: v > 0.02 ? `blur(${(v * 5).toFixed(2)}px)` : undefined }}>
        <Comp cut={cut} />
      </AbsoluteFill>
      <Vignette v={v} />
      <NoteTag text={cut.note} />
      <Subtitle cut={cut} />
      {cut.segments.map((s, i) =>
        s.voice ? (
          <Sequence key={i} from={Math.round(s.start * FPS)} layout="none">
            <Audio src={staticFile(s.voice)} />
          </Sequence>
        ) : null,
      )}
    </AbsoluteFill>
  );
};

const endVision = (c: Cut) => (c.visionTo !== undefined ? c.visionTo : c.vision ?? 0);

export const MainSejong: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: S.dark }}>
      {cutsSejong.map((c, i) => (
        <Sequence key={c.id} from={c.from} durationInFrames={c.duration} name={`${c.id} ${c.scene}`}>
          <CutView cut={c} prev={i ? endVision(cutsSejong[i - 1]) : 0} />
        </Sequence>
      ))}
      {(cueList as Cue[]).map((cue) => (
        <CueTrack key={cue.file} cue={cue} />
      ))}
      {SFX.map((s, i) => {
        const c = cutsSejong.find((x) => x.id === s.id);
        if (!c) return null;
        const from = c.from + (s.seg !== undefined ? at(c, s.seg) : 0) + (s.off ?? 0);
        return (
          <Sequence key={i} from={from} durationInFrames={120} layout="none">
            <Audio src={staticFile(`sejong/music/${s.file}.wav`)} volume={s.vol} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
