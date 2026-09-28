/** 정조 편 「정조가 없애라던 편지 297통」 본편 */
import "@fontsource/noto-serif-kr/400.css";
import "@fontsource/noto-serif-kr/600.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/liu-jian-mao-cao/400.css";
import "@fontsource/zhi-mang-xing/400.css";
import "@fontsource/nanum-brush-script/400.css";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import timeline from "../../public/jeongjo/timeline.json";
import sound from "../../public/jeongjo/sound/cues.json";
import { BAR, CHARS, Cut, FPS, SANS, SP, W, clamp, ease, fr } from "./kit";
import * as A from "./scenesA";
import * as B from "./scenesB";

export const cutsJ = timeline.cuts as unknown as Cut[];
export const totalJ = timeline.totalFrames;
const XF = 15; // 장면 사이 크로스페이드

const SCENES: Record<string, React.FC<SP>> = {
  unfold: A.Unfold, room: A.Room, macro: A.Macro, flame: A.FlameScene, drawer: A.Drawer, chapter: A.Chapter, quote: A.Quote, figures: A.Figures,
  person: A.Person, duality: A.Duality, hesitate: A.Hesitate, datemark: A.DateMark, scales: A.Scales, moods: A.Moods,
  medicine: B.Medicine, angry: B.Angry, phone: B.PhoneScene, study: B.Study, family: B.Family, datecard: B.DateCard, word: B.Word, walk: B.Walk,
  sleepless: B.Sleepless, reading: B.Reading, messenger: B.Messenger, court: B.Court, sillok: B.Sillok, wait: B.Wait, count: B.Count, decree: B.Decree,
  resign: B.Resign, draft: B.Draft, museum: B.Museum, meeting: B.Meeting, stack: B.Stack, number: B.Number, time: B.Time, choice: B.Choice,
  outro: B.Outro, endscreen: B.EndScreen,
};

/* 레터박스 + 한 줄 자막 + 【재구성】·【해석】 표시 */
const Bars: React.FC<{ cut: Cut }> = ({ cut }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cards = cut.sentences.flatMap((s) => s.cards);
  const c = cards.find((c, k) => t >= c.start - 0.05 && t < Math.min((cards[k + 1]?.start ?? c.end + 0.7) - 0.02, c.end + 0.7));
  const o = c ? ease(f, fr(c.start) - 3, fr(c.start) + 3) : 0;
  const cur = [...cut.sentences].reverse().find((s) => t >= s.start - 0.1);
  const tag = cur?.tag;
  return (
    <>
      {tag && (
        <div style={{ position: "absolute", right: 60, top: 50, fontFamily: SANS, fontSize: 24, color: "#8F8472", letterSpacing: 4, border: "1px solid #5A5246", padding: "4px 14px" }}>
          {tag}
        </div>
      )}
      <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: BAR, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {c && <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 48, color: "#EDE6D8", letterSpacing: "-0.01em", opacity: o }}>{c.text}</div>}
      </div>
    </>
  );
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id="grainJ">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 97} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={1080} filter="url(#grainJ)" />
    </svg>
  );
};

const Fade: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, XF], [0, 1], clamp) * interpolate(f, [len - 2, len], [1, 1], clamp) }}>{children}</AbsoluteFill>;
};

const useFonts = () => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const text = JSON.stringify(timeline.cuts) + "받는사람심환지沈煥之홍낙임외삼촌正祖實錄卷四十九御札帖王命戊午三月十四日到≠?";
    const specs = ["400 40px 'Noto Serif KR'", "600 40px 'Noto Serif KR'", "500 40px 'Noto Sans KR'", "700 40px 'Noto Sans KR'", "400 40px 'Nanum Brush Script'"];
    const loads = specs.map((s) => document.fonts.load(s, text));
    loads.push(document.fonts.load("400 40px 'Liu Jian Mao Cao'", CHARS), document.fonts.load("400 40px 'Zhi Mang Xing'", "日月初十五戊午三月十四到"));
    Promise.all(loads).then(() => document.fonts.ready).then(() => continueRender(h));
  }, [h]);
};

type Cue = { file: string; from: number; to: number; vol: number };

export const MainJ: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {cutsJ.map((c) => {
        const Scene = SCENES[c.scene];
        const len = c.duration + XF;
        return (
          <Sequence key={c.id} from={c.from} durationInFrames={len} name={`${c.id} ${c.scene}`}>
            <Fade len={len}>
              <Scene cut={c} />
            </Fade>
          </Sequence>
        );
      })}
      <Grain />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: BAR, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: BAR, background: "#000" }} />
      {cutsJ.map((c) => (
        <Sequence key={`b${c.id}`} from={c.from} durationInFrames={c.duration} layout="none">
          <Bars cut={c} />
          {c.sentences.map((s, i) =>
            s.voice ? (
              <Sequence key={i} from={fr(s.start)} layout="none">
                <Audio src={staticFile(s.voice)} />
              </Sequence>
            ) : null,
          )}
        </Sequence>
      ))}
      {(sound as Cue[]).map((q) => (
        <Sequence key={q.file} from={q.from} durationInFrames={q.to - q.from} layout="none">
          <Audio src={staticFile(q.file)} volume={q.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
