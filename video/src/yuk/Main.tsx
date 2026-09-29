/** 육영수 편 「육영수를 맞힌 총알은 어디로 갔나」 본편 */
import "@fontsource/ibm-plex-sans-kr/400.css";
import "@fontsource/ibm-plex-sans-kr/500.css";
import "@fontsource/ibm-plex-sans-kr/600.css";
import "@fontsource/ibm-plex-sans-kr/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/noto-serif-kr/600.css";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import timeline from "../../public/yuk/timeline.json";
import sound from "../../public/yuk/sound/cues.json";
import { Cut, clamp, fr } from "../jeongjo/kit";
import { Subs } from "./kit";
import { GLYPHS } from "./glyphs";
import { ALL as VIEWS } from "./registry";

export const cutsY = timeline.cuts as unknown as Cut[];
export const totalY = timeline.totalFrames;
const XF = 8; // 짧은 크로스페이드(탐사 보도 느낌으로 빠르게)

const Fade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, XF], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};

const useFonts = () => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const text = JSON.stringify(timeline.cuts) + GLYPHS;
    const specs = ["400 40px 'IBM Plex Sans KR'", "500 40px 'IBM Plex Sans KR'", "600 40px 'IBM Plex Sans KR'", "700 40px 'IBM Plex Sans KR'", "400 40px 'IBM Plex Mono'", "600 40px 'IBM Plex Mono'", "600 40px 'Noto Serif KR'"];
    Promise.all(specs.map((s) => document.fonts.load(s, text)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(h));
  }, [h]);
};

type Cue = { file: string; from: number; to: number; vol: number };

export const MainY: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: "#0B0D10" }}>
      {cutsY.map((c) => {
        const View = VIEWS[c.p.view];
        return (
          <Sequence key={c.id} from={c.from} durationInFrames={c.duration + XF} name={`${c.id} ${c.p.view}`}>
            <Fade>
              <View cut={c} />
            </Fade>
          </Sequence>
        );
      })}
      {cutsY.map((c) => (
        <Sequence key={`s${c.id}`} from={c.from} durationInFrames={c.duration} layout="none">
          <Subs cut={c} />
          {(c as any).voice && (
            <Sequence from={fr((c as any).vat)} layout="none">
              <Audio src={staticFile((c as any).voice)} />
            </Sequence>
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
