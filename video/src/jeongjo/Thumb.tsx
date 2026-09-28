/** 정조 편 썸네일(1280×720) — 세종 썸네일과 같은 구성: 한지 바탕 + 굵은 질문 + 빨간 큰 숫자 + 도장 찍힌 물체 + 이름표 */
import "@fontsource/gowun-batang/700.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/noto-sans-kr/900.css";
import "@fontsource/liu-jian-mao-cao/400.css";
import "@fontsource/zhi-mang-xing/400.css";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile } from "remotion";
import { S, SERIF } from "../sejong/ui";
import { CHARS, Letter } from "./kit";

const SANS = "'Noto Sans KR', sans-serif";

export const ThumbJ: React.FC = () => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all([
      document.fonts.load("700 40px 'Gowun Batang'", "297통없애라"),
      document.fonts.load("900 40px 'Noto Sans KR'", "없애라고했는데?"),
      document.fonts.load("700 40px 'Noto Sans KR'", "정조가심환지에게보낸편지"),
      document.fonts.load("400 40px 'Liu Jian Mao Cao'", CHARS),
      document.fonts.load("400 40px 'Zhi Mang Xing'", "日月初十五"),
    ]).then(() => continueRender(h));
  }, [h]);
  return (
    <AbsoluteFill style={{ background: S.paper }}>
      <Img src={staticFile("sejong/hanji.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(40,30,20,0.35) 100%)" }} />
      {/* 물체: 초서 편지 + 빨간 도장 */}
      <div style={{ position: "absolute", left: 110, top: 130, transform: "rotate(-5deg)" }}>
        <Letter w={640} h={800} seed={11} cols={6} fold />
      </div>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <g transform="translate(300 800) rotate(-12)">
          <rect x={-150} y={-85} width={300} height={170} rx={12} fill="rgba(168,50,42,0.06)" stroke={S.seal} strokeWidth={10} />
          <text x={0} y={30} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={88} fill={S.seal}>없애라</text>
        </g>
      </svg>
      {/* 질문 + 숫자 */}
      <div style={{ position: "absolute", left: 900, top: 90, width: 960, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 132, lineHeight: 1.15, color: S.ink }}>없애라고 했는데?</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 400, lineHeight: 1.05, color: S.seal, marginTop: 10 }}>
          297<span style={{ fontSize: 220 }}>통</span>
        </div>
      </div>
      {/* 이름표 */}
      <div style={{ position: "absolute", left: 990, top: 870, width: 780, height: 110, borderRadius: 16, background: S.ink, opacity: 0.92, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: SANS, fontWeight: 700, fontSize: 62, color: S.darkInk }}>
        <span style={{ color: S.flame }}>정조</span>가 심환지에게 보낸 편지
      </div>
    </AbsoluteFill>
  );
};
