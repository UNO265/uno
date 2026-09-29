/** 육영수 편 2D 장면: 조사자 화면(문서·표·지도 도식)과 글자 장면 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SP, clamp, ease, sAt, wAt } from "../jeongjo/kit";
import { COL, MONO, Note, SERIF, TAGC, TagBox, UI, fadeIn } from "./kit";
import { Desk } from "./Views";

const BG = "radial-gradient(ellipse at 50% 40%, #1E232A 0%, #0B0D10 75%)";
const Dark: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ background: BG }}>{children}</AbsoluteFill>;
const INK = "#15181D";
const GREY = "#5A606A";

/** 천천히 다가가는 카메라 */
const Push: React.FC<{ d: number; k?: number; children: React.ReactNode }> = ({ d, k = 0.05, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, d], [1, 1 + k], clamp)})` }}>{children}</AbsoluteFill>;
};

/** 카드(어두운 바탕 위) */
const Card: React.FC<{ color: string; o: number; x: number; y: number; w: number; children: React.ReactNode; dy?: number }> = ({ color, o, x, y, w, children, dy = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y + (1 - o) * 24 + dy, width: w, opacity: o, background: "rgba(14,17,21,0.92)", border: `2px solid ${color}`, borderRadius: 10, padding: "26px 34px", fontFamily: UI, color: "#FFFFFF" }}>{children}</div>
);

const Stamp: React.FC<{ text: string; o: number; x: number; y: number; color?: string; size?: number; rot?: number }> = ({ text, o, x, y, color = "#C8262B", size = 72, rot = -10 }) => (
  <div style={{ position: "absolute", left: x, top: y, padding: "8px 26px", border: `8px solid ${color}`, borderRadius: 10, fontFamily: UI, fontWeight: 700, fontSize: size, color, transform: `rotate(${rot}deg) scale(${interpolate(o, [0, 1], [1.8, 1])})`, opacity: o > 0 ? 0.92 : 0, whiteSpace: "nowrap" }}>{text}</div>
);

const Typed: React.FC<{ text: string; at: number; f: number; speed?: number }> = ({ text, at, f, speed = 1.4 }) => {
  const n = Math.floor(interpolate(f, [at, at + text.length * speed], [0, text.length], clamp));
  return <>{text.slice(0, n)}</>;
};

/* ─── 프롤로그 ─── */

export const Film: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const glow = ease(f, sAt(cut, 1), sAt(cut, 1) + 14);
  return (
    <Dark>
      <Push d={cut.duration}>
        <div style={{ position: "absolute", left: 360, right: 360, top: 250, height: 420, border: "3px solid #3A424B", borderRadius: 12, background: "#0E1115", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div style={{ fontFamily: MONO, fontSize: 34, color: "#8E97A1", letterSpacing: 6, opacity: fadeIn(f, 6) }}>2026. 9. 23. 개봉</div>
          <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 150, color: "#FFFFFF", opacity: 0.35 + 0.65 * glow, textShadow: `0 0 ${40 * glow}px rgba(255,255,255,0.35)` }}>암살자(들)</div>
        </div>
      </Push>
      <Note style={{ left: 0, right: 0, bottom: 180, textAlign: "center" }}>영화 포스터·장면은 사용하지 않았습니다</Note>
    </Dark>
  );
};

export const Counter: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const a = sAt(cut, 0);
  const v = Math.round(interpolate(f, [a, a + 60], [0, 1000000], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) }));
  return (
    <Dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
        <div style={{ fontFamily: UI, fontSize: 44, color: "#9AA4B0" }}>개봉 나흘 · 누적 관객</div>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 210, color: "#FFFFFF" }}>{v.toLocaleString("en-US")}</div>
        <div style={{ fontFamily: UI, fontSize: 36, color: "#6C7580", opacity: fadeIn(f, a + 60) }}>배급사 집계 보도(2026. 9. 26.)</div>
      </AbsoluteFill>
    </Dark>
  );
};

export const Paren: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const z = ease(f, 10, cut.duration - 10);
  const red = fadeIn(f, wAt(cut, "「들」", 20), 10);
  return (
    <Dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 220, color: "#FFFFFF", transform: `scale(${1 + z * 0.6}) translateX(${-z * 260}px)`, whiteSpace: "nowrap" }}>
          <span style={{ opacity: 1 - z * 0.7 }}>암살자</span>
          <span style={{ color: red > 0 ? `rgba(255,77,79,${0.4 + 0.6 * red})` : "#FFFFFF" }}>(들)</span>
        </div>
      </AbsoluteFill>
    </Dark>
  );
};

export const Statements: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const a = sAt(cut, 0);
  const b = wAt(cut, "제작진", a + 60);
  return (
    <Dark>
      <Note style={{ left: 0, right: 0, top: 150, textAlign: "center" }}>보도 요지 · 2026. 9. 28~29.</Note>
      <Card color="#8E97A1" o={fadeIn(f, a + 4, 12)} x={170} y={320} w={720}>
        <div style={{ fontSize: 36, color: "#9AA4B0" }}>박정희기념재단</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 10 }}>상영 중단 요구</div>
      </Card>
      <Card color="#8E97A1" o={fadeIn(f, b, 12)} x={1030} y={320} w={720}>
        <div style={{ fontSize: 36, color: "#9AA4B0" }}>영화 제작진</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 10 }}>왜곡 목적 없다</div>
      </Card>
    </Dark>
  );
};

const GRADES: [string, string][] = [
  ["기록", "기록으로 확인된 것"],
  ["증언", "누군가 증언하거나"],
  ["주장", "주장한 것"],
  ["미공개", "공개된 기록이 없는 것"],
];

export const Grades: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const step = cut.p.step;
  const when = (i: number) => (step === 0 ? sAt(cut, 1) + 10 + i * 6 : sAt(cut, i === 0 ? 0 : i === 3 ? 2 : 1) + (i === 2 ? 14 : 0));
  return (
    <Dark>
      {step === 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: UI, fontWeight: 700, fontSize: 76, color: "#FFFFFF", opacity: fadeIn(f, sAt(cut, 0)) * (1 - 0.6 * fadeIn(f, sAt(cut, 1))) }}>
          판정하지 않습니다
        </div>
      )}
      <div style={{ position: "absolute", left: 150, right: 150, top: step === 0 ? 400 : 260, display: "flex", gap: 36 }}>
        {GRADES.map(([g, t], i) => {
          const o = fadeIn(f, when(i), 12);
          return (
            <div key={g} style={{ flex: 1, height: 400, border: `3px solid ${TAGC[g]}`, borderRadius: 12, background: step === 1 ? `rgba(255,255,255,${0.04 * o})` : "transparent", opacity: step === 0 ? o * 0.7 : 0.25 + 0.75 * o, padding: 30, fontFamily: UI, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 60, fontWeight: 700, color: TAGC[g] }}>{g}</div>
              <div style={{ fontSize: 38, color: "#E8ECF0" }}>{t}</div>
            </div>
          );
        })}
      </div>
    </Dark>
  );
};

export const GradeDemo: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const tags = ["기록", "증언", "주장", "미공개", "해석"];
  const i = Math.floor(Math.max(0, f - 10) / 22) % tags.length;
  return (
    <Dark>
      <TagBox tag={tags[i]} o={fadeIn(f, 6)} />
      <svg width={600} height={300} style={{ position: "absolute", left: 250, top: 120, opacity: fadeIn(f, 12) }}>
        <path d="M 560 260 C 400 250 200 180 60 40" stroke="#FFFFFF" strokeWidth={6} fill="none" />
        <path d="M 60 40 L 72 86 M 60 40 L 104 58" stroke="#FFFFFF" strokeWidth={6} fill="none" />
      </svg>
      <div style={{ position: "absolute", left: 760, top: 360, fontFamily: UI }}>
        {tags.map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 44, color: t === tags[i] ? "#FFFFFF" : "#6C7580", lineHeight: 1.7 }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: TAGC[t] }} />
            {t}
            <span style={{ fontSize: 34, color: "#8E97A1" }}>{{ 기록: "판결 · 공식 발표 · 공개 문서", 증언: "당사자의 말 · 글", 주장: "분석 · 의혹", 미공개: "확인할 공개 기록 없음", 해석: "제작진 의견" }[t]}</span>
          </div>
        ))}
      </div>
    </Dark>
  );
};

/* ─── 1장 ─── */

export const Profile: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  return (
    <Desk title="인물 기록" zoom={interpolate(f, [0, cut.duration], [1, 1.04], clamp)}>
      <div style={{ position: "absolute", left: 100, top: 90, fontFamily: SERIF, fontWeight: 600, fontSize: 200, color: INK, opacity: fadeIn(f, 4) }}>육영수</div>
      <div style={{ position: "absolute", left: 110, top: 380, fontFamily: MONO, fontSize: 64, color: GREY, opacity: fadeIn(f, sAt(cut, 1)) }}>1925 — 1974</div>
      <div style={{ position: "absolute", left: 110, top: 490, fontFamily: UI, fontSize: 50, color: INK, opacity: fadeIn(f, sAt(cut, 1) + 10) }}>충청북도 옥천 출생</div>
    </Desk>
  );
};

export const Yadang: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const s1 = sAt(cut, 1);
  const flow = interpolate(f, [8, s1], [0, 1], clamp);
  return (
    <Dark>
      {[...Array(9)].map((_, i) => {
        const t = Math.max(0, Math.min(1, flow * 1.6 - i * 0.08));
        return (
          <div key={i} style={{ position: "absolute", left: 120 + t * 640 + (i % 3) * 30, top: 250 + i * 50 - t * (i - 4) * 40, padding: "10px 24px", border: "2px solid #6C7580", borderRadius: 8, fontFamily: UI, fontSize: 34, color: "#C3CBD4", opacity: (1 - t) * 0.9 + 0.1 }}>여론</div>
        );
      })}
      <div style={{ position: "absolute", left: 900, top: 380, padding: "24px 40px", border: "3px solid #FFFFFF", borderRadius: 10, fontFamily: UI, fontSize: 52, color: "#FFFFFF", opacity: fadeIn(f, 20) }}>대통령에게 쓴소리</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 110, color: "#FFFFFF", opacity: fadeIn(f, wAt(cut, "「청와대", s1), 12) }}>
        “청와대 안의 야당”
      </div>
    </Dark>
  );
};

export const Age: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const p = ease(f, 6, 40);
  return (
    <Dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: UI, fontSize: 46, color: "#9AA4B0" }}>1974년 여름</div>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 300, color: "#FFFFFF", lineHeight: 1.1 }}>{Math.round(48 * p)}</div>
        <div style={{ fontFamily: UI, fontSize: 46, color: "#E8ECF0" }}>세</div>
      </AbsoluteFill>
    </Dark>
  );
};

export const Score: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const mode = cut.p.mode;
  const nameAt = mode === "name" ? sAt(cut, 1) : mode === "quiet" ? -99 : 10;
  const dim = mode === "quiet" ? interpolate(f, [0, cut.duration], [1, 0.6], clamp) : 1;
  const notes = [0, 1, 2, 3].map((r) => [...Array(12)].map((_, i) => ({ x: 90 + i * 100, y: ((i * 7 + r * 3) % 9) * 7 })));
  return (
    <Dark>
      <Push d={cut.duration} k={0.04}>
        <div style={{ position: "absolute", left: 300, top: 110, width: 1320, height: 740, background: "#EDEBE4", borderRadius: 6, opacity: 0.9 * dim, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", overflow: "hidden" }}>
          {notes.map((row, r) => (
            <div key={r} style={{ position: "absolute", left: 60, right: 60, top: 90 + r * 160, height: 64 }}>
              {[0, 1, 2, 3, 4].map((l) => (
                <div key={l} style={{ position: "absolute", left: 0, right: 0, top: l * 16, height: 2, background: "#9C9A92" }} />
              ))}
              {row.map((n, i) => (
                <div key={i} style={{ position: "absolute", left: n.x, top: n.y - 4, width: 22, height: 16, borderRadius: "50%", background: "#55534D", transform: "rotate(-20deg)", opacity: fadeIn(f, i * 2 + r * 6, 20) * 0.8 }} />
              ))}
            </div>
          ))}
          <div style={{ position: "absolute", right: 60, top: 26, fontFamily: UI, fontSize: 32, color: "#6C6A62" }}>축가 · 합창단</div>
        </div>
      </Push>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", opacity: fadeIn(f, nameAt, 16) * (mode === "quiet" ? 1 : 1) }}>
        {mode !== "quiet" && (
          <div style={{ display: "inline-block", background: "rgba(10,12,15,0.9)", padding: "30px 70px", borderRadius: 10 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 130, color: "#FFFFFF" }}>장봉화</div>
            <div style={{ fontFamily: UI, fontSize: 40, color: "#C3CBD4", marginTop: 6 }}>성동여자실업고등학교 2학년</div>
          </div>
        )}
      </div>
      {mode === "quiet" && (
        <Card color={COL.wit} o={fadeIn(f, sAt(cut, 0) + 6)} x={560} y={360} w={800}>
          <div style={{ fontSize: 34, color: COL.wit }}>2005년 유족 인터뷰 보도</div>
          <div style={{ fontSize: 56, fontWeight: 700, marginTop: 10 }}>“국가는 아무 보상도 안 했다”</div>
        </Card>
      )}
    </Dark>
  );
};

export const Dayline: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const pts: [string, string, number][] = [
    ["오전", "국립극장 피격", 0],
    ["", "서울대병원 · 뇌수술", 0],
    ["오후 7시쯤", "사망", 1],
    ["8월 19일", "국민장", 2],
  ];
  return (
    <Dark>
      <div style={{ position: "absolute", left: 180, right: 180, top: 520, height: 4, background: "#3A424B" }} />
      <div style={{ position: "absolute", left: 180, top: 520, height: 4, background: "#FFFFFF", width: interpolate(f, [0, cut.duration], [0, 1560], clamp) }} />
      {pts.map(([t, l, s], i) => {
        const o = fadeIn(f, sAt(cut, s) + (s === 0 ? i * 20 : 4), 12);
        return (
          <div key={i} style={{ position: "absolute", left: 180 + i * 500 - 150, top: 360, width: 300, textAlign: "center", fontFamily: UI, opacity: o }}>
            <div style={{ fontFamily: MONO, fontSize: 44, color: "#9AA4B0", height: 60 }}>{t}</div>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: "#FFFFFF", margin: "88px auto 30px" }} />
            <div style={{ fontSize: 48, fontWeight: 600, color: "#FFFFFF" }}>{l}</div>
          </div>
        );
      })}
      <Note style={{ left: 180, top: 200 }}>1974년 8월 15일 그날</Note>
    </Dark>
  );
};

/* ─── 2장 ─── */

export const Suspect: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const rows: [string, string, number][] = [
    ["성명", "문세광", 0],
    ["출생", "일본", 1],
    ["구분", "재일교포 2세", 1],
    ["나이", "22세", 1],
    ["체포", "1974. 8. 15. 현장", 0],
  ];
  return (
    <Desk title="신원 기록 (재구성 문서)">
      <div style={{ position: "absolute", left: 80, top: 70, width: 300, height: 380, border: "3px dashed #B8BBB6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: UI, fontSize: 34, color: "#8E918C" }}>사진 없음</div>
      {rows.map(([k, v, s], i) => (
        <div key={k} style={{ position: "absolute", left: 460, top: 70 + i * 110, display: "flex", gap: 40, fontFamily: UI, alignItems: "baseline", opacity: fadeIn(f, sAt(cut, s) + i * 8) }}>
          <div style={{ width: 120, fontSize: 38, color: GREY }}>{k}</div>
          <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 60, color: INK }}>
            <Typed text={v} at={sAt(cut, s) + i * 8} f={f} />
          </div>
        </div>
      ))}
    </Desk>
  );
};

export const Route: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const step = cut.p.step;
  const SE = { x: 560, y: 360 };
  const OS = { x: 1360, y: 700 };
  const line = step === 2 ? ease(f, sAt(cut, 0), sAt(cut, 0) + 50) : 0;
  const pulse = 0.6 + 0.4 * Math.sin(f / 6);
  const mk = (p: { x: number; y: number }, name: string, o: number, color = "#FFFFFF") => (
    <div style={{ position: "absolute", left: p.x - 16, top: p.y - 16, opacity: o }}>
      <div style={{ width: 32, height: 32, borderRadius: 16, background: color, boxShadow: `0 0 ${30 * pulse}px ${color}` }} />
      <div style={{ position: "absolute", left: 50, top: -14, fontFamily: UI, fontWeight: 700, fontSize: 52, color: "#FFFFFF", whiteSpace: "nowrap" }}>{name}</div>
    </div>
  );
  return (
    <Dark>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[...Array(20)].map((_, i) => (
          <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={1080} stroke="#161A1F" strokeWidth={2} />
        ))}
        {[...Array(11)].map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 100} x2={1920} y2={i * 100} stroke="#161A1F" strokeWidth={2} />
        ))}
        {line > 0 && (
          <path d={`M ${OS.x} ${OS.y} Q ${(SE.x + OS.x) / 2} ${SE.y + 40} ${SE.x} ${SE.y}`} stroke="#FFFFFF" strokeWidth={6} strokeDasharray="18 14" fill="none" pathLength={1} strokeDashoffset={0} style={{ clipPath: `inset(0 0 0 ${(1 - line) * 100}%)` }} />
        )}
      </svg>
      {mk(SE, "서울", step === 2 ? 1 : 0.35)}
      {mk(OS, "오사카", 1, step === 0 ? "#FFFFFF" : "#C3CBD4")}
      <Card color={COL.rec} o={step === 0 ? fadeIn(f, sAt(cut, 1)) : 1} x={1100} y={220} w={620}>
        <div style={{ fontFamily: MONO, fontSize: 40, color: "#9AA4B0" }}>1974. 7. 18.</div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 8 }}>파출소 권총 도난</div>
      </Card>
      {step === 1 && (
        <>
          <Stamp text="한국 수사 ✓" o={fadeIn(f, sAt(cut, 1), 6)} x={200} y={620} color="#E8ECF0" size={60} />
          <Stamp text="일본 수사 ✓" o={fadeIn(f, sAt(cut, 1) + 14, 6)} x={560} y={780} color="#E8ECF0" size={60} rot={-6} />
        </>
      )}
      {step === 2 && (
        <>
          <Card color={COL.rec} o={fadeIn(f, sAt(cut, 0) + 30)} x={880} y={440} w={380}>
            <div style={{ fontFamily: MONO, fontSize: 40, color: "#9AA4B0" }}>8. 6.</div>
            <div style={{ fontSize: 48, fontWeight: 700 }}>입국</div>
          </Card>
          <Card color={COL.rec} o={fadeIn(f, sAt(cut, 1))} x={260} y={440} w={440}>
            <div style={{ fontFamily: MONO, fontSize: 40, color: "#9AA4B0" }}>8. 15.</div>
            <div style={{ fontSize: 48, fontWeight: 700 }}>국립극장</div>
          </Card>
        </>
      )}
      <Note style={{ left: 60, bottom: 180 }}>도식 · 실제 지도 아님</Note>
    </Dark>
  );
};

export const Passport: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  return (
    <Dark>
      <div style={{ position: "absolute", left: 230, top: 170, width: 560, height: 740, background: "#23303F", borderRadius: 18, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", transform: `rotate(-5deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, fontFamily: UI, color: "#C9B98A", opacity: fadeIn(f, 4) }}>
        <div style={{ fontSize: 64, letterSpacing: 10 }}>여 권</div>
        <div style={{ width: 160, height: 160, borderRadius: 80, border: "4px solid #C9B98A" }} />
        <div style={{ fontSize: 32, color: "#8E97A1" }}>재구성 · 실제 여권 아님</div>
      </div>
      <Card color={COL.rec} o={fadeIn(f, sAt(cut, 1))} x={900} y={220} w={860}>
        <div style={{ fontSize: 36, color: "#9AA4B0" }}>명의</div>
        <div style={{ fontSize: 60, fontWeight: 700, marginTop: 8 }}>학창 시절 친구의 남편</div>
      </Card>
      <Card color={COL.rec} o={fadeIn(f, sAt(cut, 2))} x={900} y={520} w={860}>
        <div style={{ fontSize: 36, color: "#9AA4B0" }}>그 친구 · 일본 법원</div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 8 }}>여권법 위반 등</div>
        <div style={{ fontSize: 52, fontWeight: 700 }}>징역 3개월 · 집행유예 1년</div>
      </Card>
    </Dark>
  );
};

const TRIAL: [string, string, number][] = [
  ["8. 15.", "사건", 0],
  ["10. 7.", "첫 공판", 53],
  ["10. 19.", "1심 사형", 65],
  ["11. 20.", "항소 기각", 97],
  ["12. 17.", "대법원 확정", 124],
  ["12. 20.", "사형 집행", 127],
];

export const Trial: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const show: number[][] = cut.p.show;
  const pre: number[] = cut.p.pre;
  const when = (i: number) => {
    if (pre.includes(i) || i === 0) return -99;
    const s = show.findIndex((xs) => xs.includes(i));
    return s < 0 ? 1e9 : sAt(cut, s) + 4;
  };
  const X = (day: number) => 160 + (day / 127) * 1600;
  const last = sAt(cut, 3);
  return (
    <Dark>
      <Note style={{ left: 160, top: 150 }}>1974년 · 재판 일정</Note>
      <div style={{ position: "absolute", left: 160, width: 1600, top: 520, height: 4, background: "#3A424B" }} />
      {TRIAL.map(([d, l, day], i) => {
        const o = fadeIn(f, when(i), 10);
        const up = i % 2 === 0;
        return (
          <div key={i} style={{ position: "absolute", left: X(day) - 130, top: up ? 280 : 560, width: 260, textAlign: "center", fontFamily: UI, opacity: o }}>
            {!up && <div style={{ width: 24, height: 24, borderRadius: 12, background: i === 4 ? COL.key : "#FFFFFF", margin: "-50px auto 26px" }} />}
            <div style={{ fontFamily: MONO, fontSize: 40, color: "#9AA4B0" }}>{d}</div>
            <div style={{ fontSize: 46, fontWeight: 700, color: "#FFFFFF" }}>{l}</div>
            {up && <div style={{ width: 24, height: 24, borderRadius: 12, background: "#FFFFFF", margin: "34px auto 0" }} />}
          </div>
        );
      })}
      {!cut.p.total && <Card color={COL.rec} o={fadeIn(f, last)} x={620} y={740} w={680}><div style={{ fontSize: 48, fontWeight: 700 }}>공소 사실 6가지 모두 유죄</div></Card>}
      {cut.p.total && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", opacity: fadeIn(f, last) }}>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 130, color: "#FFFFFF" }}>127</span>
          <span style={{ fontFamily: UI, fontSize: 60, color: "#C3CBD4" }}> 일</span>
        </div>
      )}
    </Dark>
  );
};

export const Conclusion: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const s1 = sAt(cut, 1);
  return (
    <Desk title="판결 요지 (재구성 문서)">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ position: "absolute", left: 90, top: 70 + i * 70, width: 900 - (i % 3) * 140, height: 22, background: "#DADBD7", borderRadius: 4 }} />
      ))}
      <div style={{ position: "absolute", left: 80, top: 520, fontFamily: UI, fontWeight: 700, fontSize: 62, color: INK, opacity: fadeIn(f, s1) }}>
        <span style={{ background: `linear-gradient(90deg, #FFE27A ${ease(f, s1, s1 + 20) * 100}%, transparent 0)` }}>육 여사를 쏜 사람 · 문세광</span>
      </div>
      <Stamp text="판결" o={fadeIn(f, s1 + 22, 6)} x={1120} y={160} size={110} />
    </Desk>
  );
};

/* ─── 3장 ─── */

export const Dual: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const st = cut.p.step;
  const gap = st === "gap" ? ease(f, sAt(cut, 1), sAt(cut, 1) + 40) : 0;
  const L = -gap * 90;
  const R = gap * 90;
  return (
    <Dark>
      <div style={{ position: "absolute", left: 0 + L, top: 0, width: 958, height: 1080, background: "#101419" }} />
      <div style={{ position: "absolute", left: 962 + R, top: 0, width: 958, height: 1080, background: "#101419" }} />
      <div style={{ position: "absolute", left: 0 + L, width: 958, top: 140, textAlign: "center", fontFamily: UI, fontWeight: 700, fontSize: 64, color: "#FFFFFF" }}>한국</div>
      <div style={{ position: "absolute", left: 962 + R, width: 958, top: 140, textAlign: "center", fontFamily: UI, fontWeight: 700, fontSize: 64, color: "#FFFFFF" }}>일본</div>
      {st === "frozen" && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", opacity: fadeIn(f, sAt(cut, 1)) }}>
          <div style={{ display: "inline-block", background: "rgba(10,12,15,0.95)", border: "2px solid #7FB2FF", borderRadius: 10, padding: "20px 50px", fontFamily: UI, fontSize: 60, fontWeight: 700, color: "#CFE2FF" }}>1973년부터 · 관계 냉각</div>
        </div>
      )}
      {st !== "frozen" && (
        <>
          <Card color={COL.rec} o={st === "korea" ? fadeIn(f, sAt(cut, 1)) : 1} x={110 + L} y={330} w={740}>
            <div style={{ fontSize: 36, color: "#9AA4B0" }}>한국 수사 당국 발표</div>
            <div style={{ fontSize: 58, fontWeight: 700, marginTop: 10 }}>북한 · 조총련 지시</div>
          </Card>
          {st !== "korea" && (
            <Card color={COL.rec} o={st === "japan" ? fadeIn(f, sAt(cut, 1)) : 1} x={1070 + R} y={330} w={740}>
              <div style={{ fontSize: 36, color: "#9AA4B0" }}>일본 수사 당국</div>
              <div style={{ fontSize: 52, fontWeight: 700, marginTop: 10 }}>권총 절도 확인 ✓</div>
              <div style={{ fontSize: 52, fontWeight: 700, marginTop: 6, opacity: st === "japan" ? fadeIn(f, sAt(cut, 2)) : 1 }}>조총련 관여 증거 부족</div>
            </Card>
          )}
        </>
      )}
      {st === "gap" && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", opacity: fadeIn(f, sAt(cut, 2)) }}>
          <div style={{ display: "inline-block", background: "rgba(10,12,15,0.95)", border: `2px solid ${COL.rec}`, borderRadius: 10, padding: "20px 50px", fontFamily: UI }}>
            <span style={{ fontFamily: MONO, fontSize: 48, color: "#9AA4B0" }}>1974. 9. 6.  </span>
            <span style={{ fontSize: 56, fontWeight: 700, color: "#FFFFFF" }}>주한 일본대사관 난입</span>
          </div>
        </div>
      )}
    </Dark>
  );
};

export const News1973: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const s1 = sAt(cut, 1);
  const s2 = sAt(cut, 2);
  const arrow = (flip: boolean, o: number, label: string, color: string) => (
    <div style={{ position: "absolute", left: 1080, top: flip ? 560 : 330, width: 700, opacity: o, fontFamily: UI }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 52, fontWeight: 700, color: "#FFFFFF" }}>
        <span>{flip ? "한국" : "일본"}</span>
        <span>{flip ? "일본" : "한국"}</span>
      </div>
      <div style={{ position: "relative", height: 8, background: color, margin: "20px 0" }}>
        <div style={{ position: "absolute", right: -6, top: -14, width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: `30px solid ${color}` }} />
      </div>
      <div style={{ textAlign: "center", fontSize: 44, color }}>{label}</div>
    </div>
  );
  return (
    <Dark>
      <div style={{ position: "absolute", left: 120, top: 150, width: 820, height: 760, background: "#E4E1D8", borderRadius: 4, padding: "40px 46px", fontFamily: SERIF, color: INK, transform: `rotate(-2deg)`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", opacity: fadeIn(f, 4) }}>
        <div style={{ fontFamily: UI, fontSize: 32, color: GREY, borderBottom: "3px solid #15181D", paddingBottom: 10 }}>신문 지면 재구성 · 1973년 8월</div>
        <div style={{ fontSize: 88, fontWeight: 600, lineHeight: 1.2, marginTop: 30 }}>김대중<br />도쿄서 납치</div>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ height: 18, background: "#C9C5BA", margin: "26px 0", width: `${90 - (i % 3) * 12}%` }} />
        ))}
      </div>
      {arrow(false, fadeIn(f, s1), "항의", "#9AA4B0")}
      {arrow(true, fadeIn(f, s2), "책임 추궁 · 해석", COL.view)}
    </Dark>
  );
};

export const Archive: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [6, 70], [0, 3000], clamp));
  const s1 = sAt(cut, 1);
  return (
    <Dark>
      {[...Array(14)].map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 240 + (i % 2) * 8, top: 820 - i * 34 * Math.min(1, (n / 3000) * 1.2), width: 560, height: 30, background: i % 2 ? "#DAD7CE" : "#CFCBC0", border: "1px solid #9C9A92", opacity: n / 3000 > i / 14 ? 1 : 0 }} />
      ))}
      <div style={{ position: "absolute", left: 900, top: 240, fontFamily: UI }}>
        <div style={{ fontSize: 40, color: "#9AA4B0" }}>2005년 공개 외교문서</div>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 160, color: "#FFFFFF" }}>{n.toLocaleString("en-US")}<span style={{ fontFamily: UI, fontSize: 60 }}> 쪽</span></div>
        <div style={{ fontSize: 40, color: "#9AA4B0" }}>15권 · 30년 만의 공개</div>
      </div>
      <Stamp text="국교 단절 방안 준비" o={fadeIn(f, wAt(cut, "국교를", s1 + 20), 6)} x={880} y={660} size={70} rot={-4} />
    </Dark>
  );
};

export const Envoy: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [sAt(cut, 0), sAt(cut, 1) + 20], [1500, 700], clamp);
  return (
    <Dark>
      <div style={{ position: "absolute", left: 160, top: 170, fontFamily: UI, fontWeight: 700, fontSize: 64, color: "#FFFFFF" }}>한국</div>
      <div style={{ position: "absolute", right: 160, top: 170, fontFamily: UI, fontWeight: 700, fontSize: 64, color: "#FFFFFF" }}>일본</div>
      <div style={{ position: "absolute", left: x, top: 300, width: 520, height: 330, background: "#E9E6DC", borderRadius: 6, boxShadow: "0 30px 60px rgba(0,0,0,0.6)", fontFamily: SERIF, padding: 34, opacity: fadeIn(f, sAt(cut, 0)) }}>
        <div style={{ fontFamily: UI, fontSize: 32, color: GREY }}>{f > sAt(cut, 1) ? "일본 총리 친서 · 특사 전달" : "특사 방한"}</div>
        <div style={{ fontSize: 50, fontWeight: 600, color: INK, marginTop: 24, opacity: fadeIn(f, sAt(cut, 2)) }}>· 책임 인정</div>
        <div style={{ fontSize: 50, fontWeight: 600, color: INK, marginTop: 12, opacity: fadeIn(f, sAt(cut, 2) + 12) }}>· 한국 수사 협조</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 770, textAlign: "center", opacity: fadeIn(f, sAt(cut, 3)) }}>
        <div style={{ display: "inline-block", border: "2px solid #9AA4B0", borderRadius: 10, padding: "16px 44px", fontFamily: UI, fontSize: 52, fontWeight: 700, color: "#FFFFFF", background: "rgba(10,12,15,0.95)" }}>미국 · 중재</div>
      </div>
    </Dark>
  );
};

export const Cable: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const s1 = sAt(cut, 1);
  const s2 = sAt(cut, 2);
  const s3 = sAt(cut, 3);
  return (
    <Dark>
      <div style={{ position: "absolute", left: 300, top: 110, width: 1320, height: 800, background: "#ECEAE2", borderRadius: 4, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", fontFamily: MONO, color: INK, padding: "46px 60px", opacity: fadeIn(f, 4) }}>
        <div style={{ fontSize: 40, fontWeight: 600, color: "#B3261E", letterSpacing: 8 }}>SECRET</div>
        <div style={{ fontSize: 34, marginTop: 14, opacity: fadeIn(f, s1) }}>
          <Typed text="FM AMEMBASSY SEOUL  TO SECSTATE WASHDC" at={s1} f={f} speed={0.8} />
        </div>
        <div style={{ fontSize: 34, marginTop: 6, opacity: fadeIn(f, s1 + 10) }}>1974. 8. 20.</div>
        <div style={{ borderTop: "2px solid #9C9A92", margin: "30px 0" }} />
        <div style={{ fontFamily: UI, fontSize: 58, fontWeight: 700, opacity: fadeIn(f, s2) }}>분위기 · 침통하고 가라앉음</div>
        <div style={{ fontFamily: UI, fontSize: 58, fontWeight: 700, marginTop: 30, opacity: fadeIn(f, s3) }}>전망 · 대통령은 온건해지지 않을 것</div>
        <div style={{ fontFamily: UI, fontSize: 32, color: GREY, position: "absolute", left: 60, bottom: 40 }}>주한 미국대사관 전문 요지 · 원문 영어 · 국사편찬위원회 공개(2026)</div>
      </div>
    </Dark>
  );
};

export const Memoir: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const st = cut.p.step;
  const lines = ["일본의 공동 수사 제안 → 자신이 반대해 무산", "일본 수사관이 직접 조사하면 진술이 바뀔 수 있다고 걱정"];
  return (
    <Dark>
      <div style={{ position: "absolute", left: 260, top: 120, width: 1400, height: 780, background: "#EFEDE6", borderRadius: 4, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", padding: "46px 64px", fontFamily: UI, color: INK }}>
        <div style={{ fontSize: 34, color: GREY }}>미발간 회고록 · 보도 인용(주간경향 2026. 9.)</div>
        <div style={{ fontFamily: SERIF, fontSize: 70, fontWeight: 600, marginTop: 20, opacity: st === 0 ? fadeIn(f, sAt(cut, 1)) : 1 }}>김기춘 · 당시 수사 검사</div>
        {st === 0 && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{ height: 20, background: "#D8D5CC", margin: "34px 0", width: `${92 - (i % 3) * 14}%` }} />)}
        {st === 1 &&
          lines.map((l, i) => (
            <div key={i} style={{ fontSize: 50, fontWeight: 600, marginTop: i ? 30 : 60, opacity: fadeIn(f, sAt(cut, i)) }}>
              <span style={{ background: `linear-gradient(90deg, rgba(242,201,76,0.55) ${ease(f, sAt(cut, i), sAt(cut, i) + 24) * 100}%, transparent 0)` }}>{l}</span>
            </div>
          ))}
      </div>
      {st === 1 && (
        <Card color={COL.wit} o={fadeIn(f, sAt(cut, 2))} x={560} y={700} w={800}>
          <div style={{ fontSize: 44, fontWeight: 700, color: COL.wit }}>본인의 기억 · 다른 공개 기록으로 미확인</div>
        </Card>
      )}
    </Dark>
  );
};

/* ─── 4장 ─── */

export const Testimony: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  return (
    <Dark>
      <Card color={COL.wit} o={fadeIn(f, sAt(cut, 1))} x={200} y={200} w={1520}>
        <div style={{ fontSize: 38, color: COL.wit }}>집도의 · 신경외과 전문의 최길수 · 보도 인용</div>
        <div style={{ fontFamily: SERIF, fontSize: 72, fontWeight: 600, marginTop: 24, lineHeight: 1.35, opacity: fadeIn(f, sAt(cut, 2)) }}>
          “총알은 이마로 들어가<br />머리 뒤쪽으로 빠져나갔다”
        </div>
      </Card>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", opacity: fadeIn(f, sAt(cut, 3)) }}>
        <span style={{ fontFamily: UI, fontSize: 48, color: "#C3CBD4" }}>머릿속 탄두 · </span>
        <span style={{ fontFamily: UI, fontSize: 64, fontWeight: 700, color: "#FFFFFF" }}>나오지 않음</span>
      </div>
    </Dark>
  );
};

export const Chain: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const st = cut.p.step;
  const nodes: [string, string, string][] = [
    ["현장 수거", "경호실장 · 기록과 증언", COL.wit],
    ["누구에게 넘겼나", "?", COL.miss],
    ["어디에 보관했나", "?", COL.miss],
    ["대조 감정", "?", COL.miss],
  ];
  const when = (i: number) => (i === 0 ? (st === 0 ? sAt(cut, 1) : -99) : st === 1 ? sAt(cut, i - 1) + 4 : 1e9);
  return (
    <Dark>
      <div style={{ position: "absolute", left: 110, right: 110, top: 380, display: "flex", gap: 40, alignItems: "stretch" }}>
        {nodes.map(([t, s, c], i) => (
          <div key={i} style={{ flex: 1, border: `3px ${i ? "dashed" : "solid"} ${c}`, borderRadius: 12, padding: "30px 24px", fontFamily: UI, textAlign: "center", opacity: i && st === 0 ? 0.15 : fadeIn(f, when(i), 12), background: "rgba(14,17,21,0.9)" }}>
            <div style={{ fontSize: 46, fontWeight: 700, color: "#FFFFFF" }}>{t}</div>
            <div style={{ fontSize: i ? 90 : 34, fontWeight: 700, color: c, marginTop: 14 }}>{s}</div>
          </div>
        ))}
      </div>
      {st === 1 && <Stamp text="공개 기록 없음" o={fadeIn(f, sAt(cut, 3), 6)} x={640} y={740} color={COL.miss} size={80} rot={-3} />}
    </Dark>
  );
};

export const Waveform: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const w = 1600;
  const pts = [...Array(400)].map((_, i) => {
    const x = (i / 399) * w;
    const spikes = [60, 110, 150, 175, 230, 262, 300].some((s) => Math.abs(i - s) < 3) ? 1 : 0;
    const a = 0.08 + 0.05 * Math.sin(i * 1.7) + spikes * (0.6 + 0.3 * Math.sin(i));
    return `${x},${200 - a * 180 * Math.sin(i * 2.3)}`;
  });
  const reveal = interpolate(f, [4, 60], [0, 1], clamp);
  const s2 = sAt(cut, 2);
  return (
    <Dark>
      <svg width={w} height={400} style={{ position: "absolute", left: 160, top: 260, clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}>
        <polyline points={pts.join(" ")} fill="none" stroke="#C3CBD4" strokeWidth={3} />
      </svg>
      <Note style={{ left: 160, top: 690 }}>도식 · 실제 녹음 파형 아님</Note>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: UI, fontSize: 48, fontWeight: 700, color: COL.miss, opacity: fadeIn(f, sAt(cut, 1)) }}>공식 음향 감정 기록 · 미공개</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 770, display: "flex", justifyContent: "center", gap: 90 }}>
        {["5?", "6?", "7?"].map((t, i) => (
          <div key={t} style={{ fontFamily: MONO, fontWeight: 600, fontSize: 110, color: COL.claim, opacity: fadeIn(f, s2 + i * 10) }}>{t}</div>
        ))}
      </div>
    </Dark>
  );
};

export const Claim: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  return (
    <Dark>
      <Card color={COL.claim} o={fadeIn(f, 4)} x={260} y={200} w={1400}>
        <div style={{ fontSize: 38, color: COL.claim }}>2005 · 숭실대 배명진 교수팀 · SBS 의뢰</div>
        <div style={{ fontSize: 70, fontWeight: 700, marginTop: 16 }}>방송 녹음 총성 분석</div>
        <div style={{ fontSize: 56, marginTop: 30, opacity: fadeIn(f, sAt(cut, 1)) }}>→ 뒤쪽 경호원 총탄이라는 주장</div>
      </Card>
      <Stamp text="한 연구팀의 분석" o={fadeIn(f, sAt(cut, 2), 6)} x={640} y={700} color={COL.claim} size={72} rot={-3} />
    </Dark>
  );
};

export const TwoViews: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const st = cut.p.step;
  const apart = st === 1 ? ease(f, sAt(cut, 2), sAt(cut, 2) + 30) : 0;
  return (
    <Dark>
      <Card color={COL.rec} o={st === 0 ? fadeIn(f, 4) : 1} x={120 - apart * 60} y={220} w={760}>
        <div style={{ fontSize: 36, color: "#9AA4B0" }}>공식 결론 · 수사 당국</div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 12 }}>위치·탄도상 문세광 쪽</div>
      </Card>
      <Card color={COL.claim} o={st === 0 ? fadeIn(f, 16) : 1} x={1040 + apart * 60} y={220} w={760}>
        <div style={{ fontSize: 36, color: COL.claim }}>2005 분석 · 주장</div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 12 }}>경호원 총탄</div>
      </Card>
      {st === 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity: fadeIn(f, sAt(cut, 1)) }}>
          <span style={{ fontFamily: UI, fontSize: 64, fontWeight: 700, color: "#FFFFFF", border: "2px solid #9AA4B0", borderRadius: 10, padding: "16px 44px" }}>공식 재조사 · 없음</span>
        </div>
      )}
      {st === 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", flexDirection: "column", alignItems: "center", opacity: fadeIn(f, sAt(cut, 2)) }}>
          <svg width={440} height={240} viewBox="0 0 220 120">
            <path d="M 10 30 L 140 30 Q 210 60 140 90 L 10 90 Z" fill="none" stroke={COL.miss} strokeWidth={6} strokeDasharray="14 10" />
          </svg>
          <div style={{ fontFamily: UI, fontSize: 56, fontWeight: 700, color: COL.miss, marginTop: 20, opacity: fadeIn(f, sAt(cut, 3)) }}>탄두 기록 · 미공개</div>
        </div>
      )}
    </Dark>
  );
};

/* ─── 5장 ─── */

const LEDGER: Record<string, [string, string]> = {
  h0: ["h", "확인된 것"],
  r0: ["기록", "현장 체포 · 세 번의 재판 · 사형"],
  r1: ["기록", "판결 · 네 번째 총알이 육 여사를 맞힘"],
  r2: ["기록", "권총은 일본 파출소 · 여권은 남의 이름"],
  r3: ["기록", "장봉화 학생 · 경호원 총탄"],
  h1: ["h", "결론이 갈린 것"],
  s0: ["증언", "배후 · 한국: 북한·조총련 / 일본: 증거 부족"],
  h2: ["h", "확인할 수 없는 것"],
  m0: ["미공개", "육 여사를 맞힌 탄두의 행방"],
  m1: ["미공개", "그 탄두의 대조 감정 여부"],
};

export const Ledger: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const rows: string[][] = cut.p.rows;
  const pre: string[] = cut.p.pre;
  const order = [...pre, ...rows.flat()];
  const when = (k: string) => (pre.includes(k) ? -99 : sAt(cut, rows.findIndex((r) => r.includes(k))) + 2);
  let y = 30;
  return (
    <Desk title="확인표 · 1974. 8. 15. 사건">
      {order.map((k) => {
        const [g, t] = LEDGER[k];
        const top = y;
        y += g === "h" ? 64 : 58;
        const o = fadeIn(f, when(k), 10);
        const col = g === "h" ? INK : g === "미공개" ? COL.miss : g === "증언" ? "#B8860B" : "#1F9D55";
        return (
          <div key={k} style={{ position: "absolute", left: 60, right: 60, top, display: "flex", alignItems: "baseline", gap: 24, fontFamily: UI, opacity: o }}>
            {g === "h" ? (
              <div style={{ fontSize: 42, fontWeight: 700, color: INK, marginTop: 8 }}>{t}</div>
            ) : (
              <>
                <div style={{ width: 30, fontFamily: MONO, fontSize: 40, fontWeight: 700, color: col }}>{g === "미공개" ? "?" : "✓"}</div>
                <div style={{ fontSize: 38, color: INK }}>{t}</div>
              </>
            )}
          </div>
        );
      })}
    </Desk>
  );
};

export const Answer: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  return (
    <Dark>
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", fontFamily: UI, fontSize: 60, color: "#9AA4B0", opacity: fadeIn(f, sAt(cut, 1)) }}>육 여사를 쏜 사람은?</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 180, color: "#FFFFFF", opacity: fadeIn(f, sAt(cut, 2), 14) }}>문세광</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontFamily: UI, fontSize: 46, color: "#C3CBD4", opacity: fadeIn(f, sAt(cut, 2) + 10) }}>판결 · 공식 결론</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", opacity: fadeIn(f, sAt(cut, 3)) }}>
        <span style={{ fontFamily: UI, fontSize: 52, fontWeight: 700, color: "#FFFFFF", border: "2px solid #9AA4B0", borderRadius: 10, padding: "14px 40px" }}>뒤집는 공개 기록 · 없음</span>
      </div>
    </Dark>
  );
};

export const Blank: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  const blink = Math.floor(f / 15) % 2;
  return (
    <Desk title="확인표 · 비어 있는 칸">
      <div style={{ position: "absolute", left: 90, top: 150, fontFamily: UI, fontSize: 50, color: INK }}>탄두의 행방 · 대조 감정</div>
      <div style={{ position: "absolute", left: 90, top: 260, width: 1320, height: 170, border: `4px dashed ${COL.miss}`, borderRadius: 10, display: "flex", alignItems: "center", paddingLeft: 40 }}>
        <div style={{ width: 6, height: 90, background: INK, opacity: blink }} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 500, fontFamily: UI, fontSize: 46, color: GREY, opacity: fadeIn(f, sAt(cut, 1)) }}>
        채울 수 있는 것 · <b style={{ color: INK }}>이야기가 아니라 기록</b>
      </div>
    </Desk>
  );
};

/* 장 제목 */
export const Chapter: React.FC<SP> = ({ cut }) => {
  const f = useCurrentFrame();
  return (
    <Dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 26 }}>
        <div style={{ fontFamily: MONO, fontSize: 44, color: "#9AA4B0", letterSpacing: 8, opacity: fadeIn(f, 4) }}>{cut.p.num}</div>
        <div style={{ width: interpolate(f, [6, 30], [0, 520], clamp), height: 3, background: "#FFFFFF" }} />
        <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 110, color: "#FFFFFF", opacity: fadeIn(f, 12) }}>{cut.p.title}</div>
      </AbsoluteFill>
    </Dark>
  );
};
