/**
 * 정조 편 썸네일(1280×720) — 세종 본편 썸네일 형식:
 * 왼쪽 한지 + 거친 붓 느낌의 굵은 글씨(검정 / 큰 빨강 / 검은 띠 흰 글씨), 오른쪽 먹 번진 어둠 + 붉은 곤룡포의 왕 + 도장 찍힌 편지.
 */
import "@fontsource/black-han-sans/400.css";
import "@fontsource/gowun-batang/700.css";
import "@fontsource/liu-jian-mao-cao/400.css";
import "@fontsource/zhi-mang-xing/400.css";
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile } from "remotion";
import { CHARS, Letter, rand } from "./kit";

const HEAVY = "'Black Han Sans', sans-serif";
const RED = "#B3231B";
const INK = "#15100C";

/** 거친 붓 질감(글자 가장자리를 흔들고 군데군데 긁힘) */
const Rough: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={3} seed={7} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" result="d" />
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={3} result="speck" />
      <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.35" result="mask" />
      <feComposite in="d" in2="mask" operator="in" />
    </filter>
    <filter id="inkEdge">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={4} seed={11} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={120} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

export const ThumbJ: React.FC = () => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all([
      document.fonts.load("400 40px 'Black Han Sans'", "정조의비밀편지읽은뒤없애라"),
      document.fonts.load("700 40px 'Gowun Batang'", "없애라"),
      document.fonts.load("400 40px 'Liu Jian Mao Cao'", CHARS),
      document.fonts.load("400 40px 'Zhi Mang Xing'", "日月初十五"),
    ]).then(() => continueRender(h));
  }, [h]);
  const splats = useMemo(() => {
    const r = rand(29);
    return [...Array(40)].map(() => ({ x: 820 + r() * 260, y: r() * 1080, s: 3 + r() * 16 }));
  }, []);
  return (
    <AbsoluteFill style={{ background: "#E9DFC9", overflow: "hidden" }}>
      <Rough />
      <Img src={staticFile("sejong/hanji.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
      {/* 오른쪽 먹 번짐 */}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M 1120 -100 C 1000 150 1060 300 980 480 C 920 640 1020 780 960 1180 L 2100 1180 L 2100 -100 Z" fill="#0E0B09" filter="url(#inkEdge)" />
        {splats.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.s} fill="#0E0B09" opacity={0.85} />
        ))}
        {/* 뒤쪽 문서 더미 */}
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(${k ? 1700 : 1080} ${k ? 420 : 380})`}>
            {[...Array(9)].map((_, i) => (
              <rect key={i} x={(i % 2) * 6} y={i * 26} width={220} height={22} fill="#3A2E24" stroke="#1C140E" strokeWidth={3} />
            ))}
          </g>
        ))}
        {/* 촛불 빛 */}
        <radialGradient id="warm" cx="70%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#FFB45E" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#FFB45E" stopOpacity={0} />
        </radialGradient>
        <rect x={900} y={0} width={1020} height={1080} fill="url(#warm)" />
        {/* 왕: 붉은 곤룡포 + 금빛 용보 + 익선관, 얼굴은 역광 그림자 */}
        <g transform="translate(1540 1160)">
          <linearGradient id="robe" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B42A20" />
            <stop offset="100%" stopColor="#5E0F0B" />
          </linearGradient>
          <path d="M -520 0 C -520 -300 -430 -560 -170 -640 L 170 -640 C 430 -560 520 -300 520 0 Z" fill="url(#robe)" />
          <path d="M -120 -640 L 0 -520 L 120 -640 Z" fill="#EDE5D6" />
          <circle cx={-250} cy={-420} r={120} fill="#7A1A12" stroke="#D2A24C" strokeWidth={10} />
          <circle cx={250} cy={-420} r={120} fill="#7A1A12" stroke="#D2A24C" strokeWidth={10} />
          {[-250, 250].map((x) => (
            <g key={x} stroke="#D9AE58" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9}>
              <path d={`M ${x - 70} ${-380} C ${x - 90} ${-470} ${x - 10} ${-520} ${x + 40} ${-480} C ${x + 90} ${-440} ${x + 40} ${-390} ${x} ${-410} C ${x - 30} ${-425} ${x - 10} ${-460} ${x + 20} ${-450}`} />
              <path d={`M ${x + 40} ${-360} C ${x + 80} ${-370} ${x + 95} ${-350} ${x + 85} ${-330}`} />
            </g>
          ))}
          <path d="M -95 -660 C -110 -760 -90 -860 0 -880 C 90 -860 110 -760 95 -660 Z" fill="#1E130D" />
          <path d="M -60 -700 C -40 -620 40 -620 60 -700 C 40 -670 -40 -670 -60 -700 Z" fill="#0B0705" />
          <path d="M 70 -820 C 110 -760 100 -700 70 -670" stroke="#E6A860" strokeWidth={6} fill="none" opacity={0.8} />
          <path d="M -110 -850 C -115 -960 115 -960 110 -850 Z" fill="#0B0908" />
          <path d="M -80 -930 C -80 -1000 80 -1000 80 -930 Z" fill="#0B0908" />
          <path d="M -110 -855 L 110 -855" stroke="#C9A060" strokeWidth={6} />
          <path d="M -60 -960 C -95 -1010 -80 -1040 -45 -1015 Z M 60 -960 C 95 -1010 80 -1040 45 -1015 Z" fill="#0B0908" />
        </g>
      </svg>
      {/* 앞쪽 편지 + 도장 */}
      <div style={{ position: "absolute", left: 1150, top: 640, transform: "rotate(12deg)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
        <Letter w={620} h={560} seed={11} cols={6} fold={false} />
      </div>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <g transform="translate(1440 900) rotate(-10)" filter="url(#rough)">
          <rect x={-170} y={-95} width={340} height={190} rx={12} fill="rgba(179,35,27,0.08)" stroke={RED} strokeWidth={14} />
          <text x={0} y={34} textAnchor="middle" fontFamily="'Gowun Batang', serif" fontWeight={700} fontSize={100} fill={RED}>없애라</text>
        </g>
      </svg>
      {/* 왼쪽 글씨 */}
      <div style={{ position: "absolute", left: 90, top: 70, filter: "url(#rough)" }}>
        <div style={{ fontFamily: HEAVY, fontSize: 190, lineHeight: 1.05, color: INK }}>정조의</div>
        <div style={{ fontFamily: HEAVY, fontSize: 330, lineHeight: 1.0, color: RED, marginLeft: -10 }}>비밀편지</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 790, width: 1060, height: 190, background: INK, filter: "url(#rough)" }} />
      <div style={{ position: "absolute", left: 80, top: 800, fontFamily: HEAVY, fontSize: 150, lineHeight: 1.12, color: "#F4ECDD", filter: "url(#rough)" }}>읽은 뒤 없애라</div>
    </AbsoluteFill>
  );
};
