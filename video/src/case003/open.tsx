/** M01–M11: 問い → 家と映画館 → 2200円 → チケットとは別の支払い → 謎の入口 → CASE TITLE（約30秒）→ 売店 → 原料以外のコスト → 主役は映画 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Lines, R, Stage, Pill, Veil, mk } from "../case002/ui";
import { Aroma, Cup, Draw, Easing, FONT, K, Note, PopPile, SERIF, Sfx, T, TicketDoc, ease, fade, pop } from "./kit";

/* M01 OBJECT: 0 フレームから、カップにポップコーンが弾け、問いが画面に出ている */
const M01 = mk(
  ({ f, s }) => (
    <>
      <Stage>
        <Cup x={960} y={740} s={0.95} fill={ease(f, -10, 40)} />
        <PopPile at={-12} n={30} dur={70} cx={960} base={660} w={480} s={1.05} />
      </Stage>
      <Lines
        dark
        y={-340}
        lines={[
          { t: "映画館のポップコーンは、", at: -16, size: 76 },
          { t: <>なぜこんなに<R>高い</R>のか？</>, at: -6, size: 104 },
        ]}
      />
      {[0, 9, 17, 26, 38, 52].map((k, i) => (
        <Sfx key={i} at={k} name="pop" volume={0.3} />
      ))}
    </>
  ),
  { bg: "black", noSub: true },
);

/* M02 FLAT: 家で作れば、材料費はわずか。なのに映画館では買いたくなる */
const M02 = mk(({ f, s }) => {
  const q = fade(f, s(1));
  return (
    <Stage>
      <g opacity={1 - q * 0.55}>
        <g transform="translate(560 560)">
          <path d="M -200 -40 L 200 -40 L 170 160 L -170 160 Z" fill="#6E7F99" />
          <rect x={-230} y={-60} width={460} height={34} rx={14} fill="#55647C" />
          <rect x={230} y={-50} width={140} height={20} rx={10} fill="#55647C" />
          <text y={260} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={K.ink}>
            家で作る
          </text>
        </g>
        <text x={560} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.inkSoft} opacity={fade(f, s(0) + 20)}>
          材料費は、わずか
        </text>
      </g>
      <g transform={`translate(1360 520) scale(${1 + 0.18 * ease(f, s(1), s(1) + 16)}) translate(-1360 -520)`}>
        <Cup x={1360} y={520} s={0.75} fill={1} />
        <text x={1360} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={K.ink}>
          映画館で買う
        </text>
      </g>
      <text x={1360} y={250} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={90} fill={K.red} opacity={q}>
        なぜか、買う
      </text>
    </Stage>
  );
});

/* M03 DATA: 白地に「2200円」だけ */
const M03 = mk(
  ({ f, s }) => (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60, fontFamily: FONT }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: K.inkSoft, letterSpacing: 6, opacity: fade(f, s(0) + 4) }}>映画のチケット</div>
      <div style={{ fontSize: 300, fontWeight: 900, color: K.ink, letterSpacing: 4, lineHeight: 1.1, opacity: fade(f, 0, 6) }}>
        2200<span style={{ fontSize: 140 }}>円</span>
      </div>
      <div style={{ fontSize: 40, fontWeight: 700, color: K.inkSoft, opacity: fade(f, s(1)) }}>都心の一部の映画館の一般料金（2026年7月〜）</div>
    </AbsoluteFill>
  ),
  { bg: "white", hideSubs: [0] },
);

/* M04 OBJECT: チケットとは別の支払い → 払ったお金は、どこへ？ */
const M04 = mk(({ f, s }) => {
  const bill = ease(f, 0, 20);
  const q = fade(f, s(1));
  return (
    <Stage>
      <g transform={`translate(${-300 * bill} 0)`}>
        <Cup x={960} y={560} s={1.1} fill={1} />
        <Aroma x={960} y={330} o={0.6} />
      </g>
      <g opacity={bill}>
        <rect x={1180} y={420} width={560} height={300} rx={20} fill="#F3E9D2" />
        <text x={1460} y={500} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#3A2A1A">
          チケット
        </text>
        <line x1={1220} x2={1700} y1={540} y2={540} stroke="#3A2A1A" strokeWidth={3} opacity={0.3} />
        <text x={1460} y={630} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={K.red}>
          ＋ 売店
        </text>
      </g>
      <g opacity={q}>
        <path d="M 1460 410 C 1460 280 1600 220 1720 250" stroke={K.red} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="24 18" strokeDashoffset={-f * 2} />
        <text x={1560} y={190} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={90} fill={K.red}>
          どこへ？
        </text>
      </g>
    </Stage>
  );
}, { bg: "black" });

/* M05 DOCUMENT: チケットが「謎の入口」 */
const M05 = mk(
  ({ f, s }) => (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 80 }}>
      <TicketDoc at={0} w={1000} />
      <div style={{ marginTop: 60, fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: T.butter, opacity: fade(f, s(0) + 30) }}>謎の入口</div>
    </AbsoluteFill>
  ),
  { bg: "black" },
);

/* M06 G: CASE タイトル */
const M06 = mk(
  ({ f, s }) => {
    const a = ease(f, s(0), s(0) + 14);
    const b = ease(f, s(1), s(1) + 16);
    const line = ease(f, s(1) + 10, s(1) + 40);
    return (
      <>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60, fontFamily: FONT }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: a }}>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 14, color: "#C9C2B6" }}>KANENAZO</div>
            <div style={{ background: K.red, color: K.white, fontWeight: 900, fontSize: 38, letterSpacing: 4, padding: "4px 18px", borderRadius: 8 }}>CASE #003</div>
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: "#F4EEE3", marginTop: 44, opacity: b, letterSpacing: 4 }}>映画館のポップコーン、</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 124, color: "#F4EEE3", opacity: b, letterSpacing: 4 }}>
            なぜこんなに<span style={{ color: T.butter }}>高い？</span>
          </div>
          <div style={{ height: 8, width: 1100 * line, background: K.red, borderRadius: 4, marginTop: 26 }} />
        </AbsoluteFill>
        <Sfx at={s(1)} name="jingle" volume={0.8} />
      </>
    );
  },
  { bg: "velvet", noSub: true },
);

/* M07 BLUEPRINT: 入口からスクリーンまでの道。途中に売店 */
const LobbyPlan: React.FC<{ f: number; at: number; walk: number; glow: number }> = ({ f, at, walk, glow }) => {
  const path = "M 240 860 L 240 560 L 960 560 L 960 300 L 1560 300";
  const pts: [number, number][] = [[240, 860], [240, 560], [960, 560], [960, 300], [1560, 300]];
  // 歩く点の位置
  const segLen = [300, 720, 260, 600];
  const total = segLen.reduce((a, b) => a + b, 0);
  let d = walk * total;
  let px = pts[0][0], py = pts[0][1];
  for (let i = 0; i < segLen.length; i++) {
    if (d <= segLen[i]) {
      const t = d / segLen[i];
      px = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t;
      py = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t;
      break;
    }
    d -= segLen[i];
  }
  return (
    <g>
      <Draw d="M 140 940 L 140 180 L 1780 180 L 1780 940 Z" at={at} len={5000} />
      <Draw d="M 1380 180 L 1380 420 L 1780 420" at={at + 10} len={700} />
      <Note x={1580} y={250} text="SCREEN" at={at + 20} />
      <Draw d="M 140 700 L 460 700" at={at + 14} len={400} />
      <Note x={260} y={920} text="入口" at={at + 20} />
      <path d={path} fill="none" stroke={T.bpSoft} strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" />
      <g opacity={glow}>
        <rect x={700} y={600} width={520} height={150} rx={12} fill="rgba(226,69,47,0.25)" stroke={K.red} strokeWidth={6} />
        <text x={960} y={690} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#FFFFFF">
          売店
        </text>
      </g>
      <circle cx={px} cy={py} r={20} fill="#FFFFFF" />
    </g>
  );
};
const M07 = mk(({ f, s, e }) => (
  <Stage>
    <LobbyPlan f={f} at={0} walk={ease(f, s(0), e(1), 0, 0.62)} glow={ease(f, s(1) + 20, s(1) + 34)} />
  </Stage>
), { bg: "blueprint" });

/* M08 OBJECT: 黒地にポップコーンが弾けて山になる（音だけ） */
const M08 = mk(
  ({ f, s }) => (
    <>
      <Stage>
        <PopPile at={s(1) - 4} n={120} dur={40} base={900} w={1100} s={1.3} />
      </Stage>
      <Lines dark y={-420} lines={[{ t: "売店。", at: s(0), size: 64, serif: false, weight: 800, color: "#C9C2B6" }]} />
      {[0, 8, 15, 21, 28].map((k, i) => (
        <Sfx key={i} at={s(1) - 4 + k} name="pop" volume={0.35} />
      ))}
    </>
  ),
  { bg: "black", noSub: true },
);

/* M09 FLAT: 原料以外のコスト → 「ほとんどが利益」ではない */
const M09 = mk(({ f, s }) => {
  const ITEMS = ["オイル", "容器", "人件費", "廃棄"];
  const strike = ease(f, s(6) + 20, s(6) + 36);
  return (
    <Stage>
      <Cup x={960} y={480} s={0.8} fill={1} />
      <g opacity={fade(f, s(0)) * (1 - fade(f, s(1)))}>
        <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={56} fill={K.inkSoft}>
          トウモロコシは、高級食材ではない
        </text>
      </g>
      {ITEMS.map((t, i) => {
        const ang = -Math.PI / 2 + ((i - 1.5) / 4) * Math.PI * 1.3;
        const x = 960 + Math.cos(ang) * 560;
        const y = 500 + Math.sin(ang) * 360 + 140;
        return <Pill key={i} x={x} y={y} text={t} at={s(2 + i)} size={44} color={K.soy} />;
      })}
      <g opacity={fade(f, s(6))}>
        <rect x={560} y={90} width={800} height={110} rx={55} fill={K.white} stroke={K.ink} strokeWidth={5} />
        <text x={960} y={146} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
          「ほとんどが利益」
        </text>
        <line x1={600} x2={600 + 720 * strike} y1={146} y2={146} stroke={K.red} strokeWidth={12} strokeLinecap="round" />
      </g>
    </Stage>
  );
}, { hideSubs: [2, 3, 4, 5] });

/* M10 VELVET: 主役はスクリーンの映画。なのに売店にポップコーン */
const M10 = mk(({ f, s }) => {
  const small = fade(f, s(2));
  const q = fade(f, s(4));
  return (
    <Stage>
      <rect x={360} y={170} width={1200} height={500} rx={10} fill={T.screen} opacity={0.12 + 0.8 * ease(f, s(1), s(1) + 20)} />
      <text x={960} y={440} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={110} fill={K.ink} opacity={fade(f, s(1) + 6)}>
        主役は、映画
      </text>
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={420 + i * 135} cy={900} r={60} fill="#1A0507" />
      ))}
      <g opacity={small} transform={`translate(1660 ${780 - 30 * q})`}>
        <Cup x={0} y={0} s={0.5} fill={1} />
      </g>
      <text x={1715} y={560} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={90} fill={T.butter} opacity={q}>
        なぜ？
      </text>
    </Stage>
  );
}, { bg: "velvet" });

/* M11 TYPO: 100円 → 1000円 → 映画館の ？ */
const M11 = mk(({ f, s }) => {
  const Tag3 = ({ x, at, big, label, color }: { x: number; at: number; big: string; label: string; color: string }) => {
    const p = pop(f, at);
    return (
      <div style={{ position: "absolute", left: x - 240, top: 360, width: 480, textAlign: "center", fontFamily: FONT, opacity: Math.min(1, p * 1.4), transform: `scale(${p})` }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: K.inkSoft }}>{label}</div>
        <div style={{ fontSize: 130, fontWeight: 900, color, whiteSpace: "nowrap" }}>{big}</div>
      </div>
    );
  };
  return (
    <>
      <Lines y={-60} lines={[{ t: <>ポップコーンの<R>原価</R>だけではない</>, at: s(0), size: 88, out: s(1) - 6 }]} />
      <Lines y={-360} lines={[{ t: "映画館は、何で成り立っている？", at: s(1), size: 60, out: s(2) - 6 }]} />
      <Tag3 x={420} at={s(2)} big="100円" label="CASE #001" color={K.inkSoft} />
      <Tag3 x={960} at={s(3)} big="1000円" label="CASE #002" color={K.inkSoft} />
      <Tag3 x={1500} at={s(4)} big="？" label="CASE #003" color={K.red} />
    </>
  );
}, { bg: "white", hideSubs: [2, 3] });

export const OPEN3 = { M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11 };
export { Veil, Easing };
