/** 육영수 편 공통: 색·글꼴·등급 표시·자막 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Cut, FPS, clamp, ease, fr } from "../jeongjo/kit";

export const UI = "'IBM Plex Sans KR', 'Noto Sans KR', sans-serif";
export const MONO = "'IBM Plex Mono', monospace";
export const SERIF = "'Noto Serif KR', serif";

export const COL = {
  bg: "#0B0D10",
  floor: "#111418",
  model: "#7D8792",
  stage: "#4B535D",
  wall: "#2B3139",
  seat: "#3A424B",
  edge: "#C8D0DA",
  rec: "#F2F4F7", // 기록
  wit: "#F2C94C", // 증언
  claim: "#B69CFF", // 주장
  miss: "#FF4D4F", // 미공개
  view: "#7FB2FF", // 해석
  key: "#FFB547", // 자막 핵심어
};

export const TAGC: Record<string, string> = { 기록: COL.rec, 증언: COL.wit, 주장: COL.claim, 미공개: COL.miss, 해석: COL.view };

/** 화면 왼쪽 위 등급 표시 */
export const TagBox: React.FC<{ tag: string; o: number }> = ({ tag, o }) => (
  <div style={{ position: "absolute", left: 56, top: 48, display: "flex", alignItems: "center", gap: 14, padding: "10px 22px 10px 18px", background: "rgba(8,10,12,0.78)", border: `2px solid ${TAGC[tag]}`, borderRadius: 6, opacity: o }}>
    <div style={{ width: 16, height: 16, borderRadius: 8, background: TAGC[tag] }} />
    <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 34, color: TAGC[tag], letterSpacing: 2 }}>{tag}</div>
  </div>
);

const KEYS = ["1974년 8월 15일", "육영수", "문세광", "탄두", "총알", "넉 달", "반세기", "판결"];

/** 자막: 반투명 회색 상자 + 흰 글씨, 마침표·쉼표 없음, 핵심어 하나만 주황 */
const SubLine: React.FC<{ text: string }> = ({ text }) => {
  const t = text.replace(/[.,]/g, "").trim();
  const k = KEYS.find((x) => t.includes(x));
  if (!k) return <>{t}</>;
  const i = t.indexOf(k);
  return (
    <>
      {t.slice(0, i)}
      <span style={{ color: COL.key }}>{k}</span>
      {t.slice(i + k.length)}
    </>
  );
};

export const Subs: React.FC<{ cut: Cut }> = ({ cut }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cards = cut.sentences.flatMap((s) => s.cards);
  const c = cards.find((c, k) => t >= c.start - 0.05 && t < Math.min((cards[k + 1]?.start ?? c.end + 0.6) - 0.02, c.end + 0.6));
  const cur = [...cut.sentences].reverse().find((s) => t >= s.start - 0.1);
  const tag = cur?.tag;
  const tagO = tag ? ease(f, fr(cur!.start) - 6, fr(cur!.start) + 4) : 0;
  return (
    <>
      {tag && <TagBox tag={tag} o={tagO} />}
      {c && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "rgba(34,36,40,0.78)", padding: "12px 34px 16px", borderRadius: 8, fontFamily: UI, fontWeight: 600, fontSize: 54, color: "#FFFFFF", opacity: ease(f, fr(c.start) - 3, fr(c.start) + 2) }}>
            <SubLine text={c.text} />
          </div>
        </div>
      )}
    </>
  );
};

/** 작은 설명 글(32px 이상) */
export const Note: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", fontFamily: UI, fontSize: 32, color: "#9AA4B0", letterSpacing: 1, ...style }}>{children}</div>
);

export const fadeIn = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], clamp);
