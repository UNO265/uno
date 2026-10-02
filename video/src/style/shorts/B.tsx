// B: 紙の質感 + 捜査ボード
import React from "react";
import { Card, PaperOnigiri, Pin } from "../Frames";
import { SANS, SERIF, Shell, Telop, at, k, pop, useG } from "./common";

const RED = "#d8443a", ORANGE = "#e57f1e", BLUE = "#2f6fc9";

const Defs: React.FC = () => (
  <defs>
    <filter id="cork">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={4} />
      <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.16  0 0 0 0.55 0" />
    </filter>
    <filter id="paper" x="-10%" y="-10%" width="120%" height="125%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={2} result="n" />
      <feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" result="spots" />
      <feComposite in="spots" in2="SourceGraphic" operator="in" result="tex" />
      <feMerge result="m"><feMergeNode in="SourceGraphic" /><feMergeNode in="tex" /></feMerge>
      <feDropShadow in="m" dx={6} dy={12} stdDeviation={8} floodOpacity={0.35} />
    </filter>
    <filter id="cut" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx={3} dy={6} stdDeviation={3} floodOpacity={0.3} />
    </filter>
    <radialGradient id="vig" cx="50%" cy="45%" r="75%">
      <stop offset="60%" stopColor="#000" stopOpacity={0} />
      <stop offset="100%" stopColor="#000" stopOpacity={0.5} />
    </radialGradient>
  </defs>
);

/** カードが上から貼られる動き */
const slap = (g: number, a: number) => {
  const p = k(g, a, a + 10);
  return { o: Math.min(1, p * 2), s: 1.25 - 0.25 * p, r: (1 - p) * -8 };
};
const Pinned: React.FC<{ g: number; a: number; x: number; y: number; w: number; h: number; r: number; children: React.ReactNode; color?: string }> = ({ g, a, x, y, w, h, r, children, color }) => {
  const m = slap(g, a);
  if (g < a) return null;
  return (
    <g opacity={m.o} transform={`translate(${x} ${y}) scale(${m.s}) translate(${-x} ${-y})`}>
      <Card x={x} y={y} w={w} h={h} r={r + m.r} color={color}>{children}</Card>
      <Pin x={x} y={y - h / 2 + 8} />
    </g>
  );
};

const Bag: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70,-60 L70,-60 L84,80 Q0,100 -84,80Z" fill="#dfe6ea" opacity={0.9} filter="url(#cut)" />
    <path d="M-16,-60 L0,-90 L16,-60" fill="none" stroke="#b9c6cf" strokeWidth={6} />
    <PaperOnigiri x={-28} y={20} s={0.55} r={-20} gray />
    <PaperOnigiri x={30} y={36} s={0.55} r={25} gray />
  </g>
);

export const ShortB: React.FC = () => {
  const g = useG();
  const t2 = at("T02"), t3 = at("T03"), t4 = at("T04"), t5 = at("T05"), t6 = at("T06");
  // カメラ: ボードの上をゆっくり移動（縦にパン）
  const camY = g < t5 ? 0 : -60 * k(g, t5, t5 + 20);
  return (
    <Shell bg="#a87b4f">
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
        <Defs />
        <rect width={1080} height={1920} filter="url(#cork)" />
        <g transform={`translate(0 ${camY})`}>
          {g < t2 && (
            <g>
              <g transform="translate(540 450) rotate(-2)">
                <rect x={-430} y={-150} width={860} height={300} fill="#fffaf0" filter="url(#paper)" />
                <text textAnchor="middle" y={-30} fontFamily={SERIF} fontWeight={700} fontSize={80} fill="#3a2e22">値引きで、本部の損は</text>
                <text textAnchor="middle" y={100} fontFamily={SERIF} fontWeight={700} fontSize={120} fill={RED}>6円だけ？</text>
              </g>
              <Pin x={540} y={312} />
              <PaperOnigiri x={540} y={900} s={3.6 + 0.12 * Math.sin(g / 5)} r={-4} />
              <g transform={`translate(700 800) rotate(-12) scale(${1.9 + 0.1 * Math.sin(g / 4)})`}>
                <circle r={46} fill="#f6c63b" filter="url(#cut)" />
                <text textAnchor="middle" y={11} fontFamily={SANS} fontWeight={900} fontSize={32} fill="#6b3d00">50円</text>
              </g>
            </g>
          )}
          {g >= t2 && g < t5 && (
            <Pinned g={g} a={t2} x={540} y={560} w={920} h={420} r={-1.5}>
              <text x={-420} y={-140} fontFamily={SERIF} fontWeight={700} fontSize={46} fill="#3a2e22">仕入れ80円 → 100円で 10個</text>
              {Array.from({ length: 10 }, (_, i) => {
                const left = i >= 8;
                const gone = left && g >= t3 + 6 && g < t4;
                const sold = left && g >= at("T04", 1) + 6;
                return gone || sold ? null : <PaperOnigiri key={i} x={-340 + (i % 5) * 170} y={-30 + Math.floor(i / 5) * 140} s={0.95 * pop(g, t2 + 4 + i * 2)} r={(i * 7) % 9 - 4} gray={left && g >= at("T02", 1) && g < t4} />;
              })}
              {g >= at("T02", 1) && g < t3 + 6 && (
                <g transform="translate(330 110) rotate(8)" opacity={k(g, at("T02", 1), at("T02", 1) + 6)}>
                  <ellipse rx={150} ry={95} fill="none" stroke={RED} strokeWidth={6} />
                  <text x={-40} y={-245} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={40} fill={RED}>売れ残り 2個</text>
                </g>
              )}
              {g >= t4 && g < at("T04", 1) + 6 && [8, 9].map((i) => (
                <g key={i} transform={`translate(${-340 + (i % 5) * 170 + 40} ${-30 + 140 - 50}) rotate(-12) scale(${pop(g, t4 + 2 + (i - 8) * 4)})`}>
                  <circle r={34} fill="#f6c63b" filter="url(#cut)" />
                  <text textAnchor="middle" y={9} fontFamily={SANS} fontWeight={900} fontSize={26} fill="#6b3d00">50円</text>
                </g>
              ))}
            </Pinned>
          )}
          {g >= t3 && g < t5 && (
            <Pinned g={g} a={t3} x={300} y={1000} w={500} h={300} r={-3}>
              <text x={-220} y={-90} fontFamily={SERIF} fontWeight={700} fontSize={44} fill="#3a2e22">① 捨てる</text>
              <Bag x={150} y={-40} s={0.8} />
              <text x={-220} y={30} fontFamily={SANS} fontWeight={900} fontSize={52} fill={BLUE} opacity={k(g, t3 + 14, t3 + 20)}>本部 +56円</text>
              <text x={-220} y={110} fontFamily={SANS} fontWeight={900} fontSize={52} fill={RED} opacity={k(g, at("T03", 1), at("T03", 1) + 6)}>店 −56円</text>
            </Pinned>
          )}
          {g >= t4 && g < t5 && (
            <Pinned g={g} a={t4} x={790} y={1010} w={500} h={300} r={2.5}>
              <text x={-220} y={-90} fontFamily={SERIF} fontWeight={700} fontSize={40} fill="#3a2e22">② 50円で売り切る</text>
              <text x={-220} y={30} fontFamily={SANS} fontWeight={900} fontSize={52} fill={BLUE} opacity={k(g, at("T04", 1), at("T04", 1) + 6)}>本部 +50円</text>
              <text x={-220} y={110} fontFamily={SANS} fontWeight={900} fontSize={52} fill={ORANGE} opacity={k(g, at("T04", 1) + 8, at("T04", 1) + 14)}>店 +50円</text>
            </Pinned>
          )}
          {g >= t5 && g < t6 && (
            <g>
              <g stroke={RED} strokeWidth={5} fill="none" opacity={k(g, t5, t5 + 10)}>
                <path d="M200,420 Q360,620 540,700" />
                <path d="M880,420 Q720,620 540,700" />
              </g>
              <Pinned g={g} a={t5 - 2} x={250} y={420} w={380} h={180} r={-4}>
                <text textAnchor="middle" y={-20} fontFamily={SERIF} fontWeight={700} fontSize={38} fill="#3a2e22">① 捨てる</text>
                <text textAnchor="middle" y={50} fontFamily={SANS} fontWeight={900} fontSize={44} fill={RED}>店 −56円</text>
              </Pinned>
              <Pinned g={g} a={t5 - 2} x={830} y={420} w={380} h={180} r={3}>
                <text textAnchor="middle" y={-20} fontFamily={SERIF} fontWeight={700} fontSize={38} fill="#3a2e22">② 売り切る</text>
                <text textAnchor="middle" y={50} fontFamily={SANS} fontWeight={900} fontSize={44} fill={ORANGE}>店 +50円</text>
              </Pinned>
              <Pinned g={g} a={t5 + 8} x={540} y={900} w={820} h={440} r={-1} color="#fffaf0">
                <text textAnchor="middle" y={-130} fontFamily={SERIF} fontWeight={700} fontSize={46} fill="#6b5a44">値引きすると</text>
                <text x={-250} y={20} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={50} fill="#3a2e22">店</text>
                <text x={-220} y={40} fontFamily={SANS} fontWeight={900} fontSize={150} fill={ORANGE}>+106円</text>
                <text x={-250} y={150} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={42} fill="#3a2e22" opacity={k(g, at("T05", 1), at("T05", 1) + 6)}>本部</text>
                <text x={-220} y={155} fontFamily={SANS} fontWeight={900} fontSize={56} fill={BLUE} opacity={k(g, at("T05", 1), at("T05", 1) + 6)}>−6円 だけ</text>
              </Pinned>
            </g>
          )}
          {g >= t6 && (
            <g>
              <g transform={`translate(540 460) rotate(4) scale(${0.85 + 0.15 * pop(g, t6)})`}>
                <rect x={-400} y={-170} width={800} height={340} fill="#ffe26a" filter="url(#paper)" />
                <text textAnchor="middle" y={-40} fontFamily={SERIF} fontWeight={700} fontSize={76} fill="#4a3a10">コンビニ、なぜ</text>
                <text textAnchor="middle" y={80} fontFamily={SERIF} fontWeight={700} fontSize={84} fill={RED}>値引きせず捨てる？</text>
              </g>
              <Pin x={540} y={300} />
              <Bag x={540} y={860} s={2.5} />
              <Telop x={540} y={1195} size={66} color="#fff" edge="#5a3f22" serif o={k(g, at("T06", 1), at("T06", 1) + 8)}>1店 年468万円</Telop>
            </g>
          )}
        </g>
        <rect width={1080} height={1920} fill="url(#vig)" />
      </svg>
    </Shell>
  );
};
