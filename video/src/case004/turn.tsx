/** N35–N44: MID REVEAL（クリーニングは縮小・店数も逆転）→ なぜ逆に？ → 理由は一つではない → 誰が作業をしているか → クリーニング vs コインランドリー → 店が増えたら選ばれる → CLUE 04 → 最初の問いが変わって見える */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Pill, R, Stage, mk, yen, count } from "../case002/ui";
import { CareTag, Easing, FONT, Figure, K, NightStore, SERIF, T, Washer, Dryer, ease, fade, pop } from "./kit";
import { YANO } from "./demand";

const JIJI = "時事通信（2024年6月）";
const NIKKEI = "日本経済新聞（2024年9月）";

/* N35 DATA + EVIDENCE #01: 店頭型クリーニング 1540億円 ↓ / コインランドリー 1155億円 ↑ */
const N35 = mk(({ f, s }) => {
  const v = count(f, s(2) - 6, 36, 0, 1540);
  return (
    <>
      <Stage>
        <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink} opacity={fade(f, s(0))}>
          同じ2025年
        </text>
        <g opacity={fade(f, s(1))}>
          <text x={560} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={K.inkSoft}>
            店頭型クリーニング
          </text>
          <text x={560} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={K.ink} opacity={fade(f, s(2) - 6, 4)}>
            {yen(v)}
            <tspan fontSize={70}>億円</tspan>
          </text>
          <text x={560} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#3A6EA5" opacity={fade(f, s(3))}>
            ↓ 前年比 98.7%
          </text>
        </g>
        <g opacity={fade(f, s(0) + 10)}>
          <text x={1400} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={K.inkSoft}>
            コインランドリー
          </text>
          <text x={1400} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={K.red}>
            1,155<tspan fontSize={70}>億円</tspan>
          </text>
          <text x={1400} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.red}>
            ↑ 前年比 100.9%
          </text>
        </g>
        <line x1={960} x2={960} y1={260} y2={700} stroke={K.line} strokeWidth={4} />
      </Stage>
      <EvidenceMark no="#01" source={YANO} />
    </>
  );
}, { bg: "white", hideSubs: [2] });

/* N36 GRAPH + EVIDENCE #03 #04: 店の数（報道の要約。絶対値なし＝イメージ） */
const N36 = mk(({ f, s }) => {
  const a = ease(f, s(1), s(1) + 40, 0, 1, Easing.inOut(Easing.cubic));
  const b = ease(f, s(2), s(2) + 40, 0, 1, Easing.inOut(Easing.cubic));
  const x0 = 360;
  const x1 = 1500;
  return (
    <>
      <Stage>
        <text x={960} y={160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.ink}>
          店の数（この10年）
        </text>
        <text x={1840} y={100} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={28} fill={K.inkSoft}>
          ※ 報道をもとにしたイメージ
        </text>
        <line x1={x0} x2={x1} y1={760} y2={760} stroke={K.ink} strokeWidth={4} />
        <path d={`M ${x0} 320 L ${x0 + (x1 - x0) * a} ${320 + 170 * a}`} stroke="#3A6EA5" strokeWidth={14} strokeLinecap="round" />
        <text x={x1 + 30} y={500} fontFamily={FONT} fontWeight={900} fontSize={40} fill="#3A6EA5" opacity={a}>
          クリーニング店
        </text>
        <text x={x1 + 30} y={550} fontFamily={FONT} fontWeight={800} fontSize={34} fill="#3A6EA5" opacity={a}>
          3割以上減（時事）
        </text>
        <path d={`M ${x0} 640 L ${x0 + (x1 - x0) * b} ${640 - 230 * b}`} stroke={K.red} strokeWidth={14} strokeLinecap="round" />
        <text x={x1 + 30} y={400} fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.red} opacity={b}>
          コインランドリー
        </text>
        <text x={x1 + 30} y={440} fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.red} opacity={b}>
          上回った（日経）
        </text>
      </Stage>
      <EvidenceMark no="#03・#04" source={`${JIJI} / ${NIKKEI}`} />
    </>
  );
}, { bg: "white" });

/* N37 GRAPH: 期待はクリーニング↑、実際は↓ → なぜ、逆に動く？ */
const N37 = mk(({ f, s }) => {
  const exp = fade(f, s(1));
  const real = ease(f, s(2), s(2) + 20);
  return (
    <>
      <Stage>
        <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={46} fill={K.inkSoft} opacity={fade(f, s(0))}>
          どちらも、衣類をきれいにするサービス
        </text>
        <g transform="translate(700 730)">
          <path d={`M 0 0 L 360 ${-200}`} stroke={K.inkSoft} strokeWidth={10} strokeDasharray="20 16" opacity={exp} />
          <text x={380} y={-215} fontFamily={FONT} fontWeight={900} fontSize={40} fill={K.inkSoft} opacity={exp}>
            予想: クリーニング ↑
          </text>
          <path d={`M 0 0 L ${360 * real} ${140 * real}`} stroke="#3A6EA5" strokeWidth={14} strokeLinecap="round" />
          <text x={380} y={170} fontFamily={FONT} fontWeight={900} fontSize={40} fill="#3A6EA5" opacity={real}>
            実際: ↓
          </text>
          <circle r={14} fill={K.ink} />
        </g>
      </Stage>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 230 }}>
        <div style={{ fontFamily: SERIF, fontSize: 96, fontWeight: 900, color: K.ink, opacity: fade(f, s(3)) }}>
          なぜ、<R>逆</R>に動く？
        </div>
      </AbsoluteFill>
    </>
  );
}, { bg: "white", hideSubs: [3] });

/* N38 FLAT: 理由は一つではない（指摘されている背景） */
const N38 = mk(({ f, s }) => (
  <Stage>
    <text x={960} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={K.ink} opacity={fade(f, s(0))}>
      理由は、一つではない
    </text>
    <Pill x={620} y={460} text="家で洗えるスーツ" at={s(1)} size={54} color="#3A6EA5" />
    <Pill x={1320} y={460} text="店を続けるコスト ↑" at={s(2)} size={54} color="#3A6EA5" />
    <text x={960} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.inkSoft} opacity={fade(f, s(3))}>
      クリーニング店が減る背景として、指摘されている
    </text>
  </Stage>
), { hideSubs: [1, 2] });

/* N39 KEY: 誰が、作業をしているか */
const N39 = mk(({ f, s }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 110, fontFamily: SERIF }}>
    <div style={{ fontSize: 50, fontWeight: 800, fontFamily: FONT, color: K.inkSoft, opacity: fade(f, s(0)) }}>お金の流れから見た、はっきりした違い</div>
    <div style={{ fontSize: 130, fontWeight: 900, color: K.ink, marginTop: 30, transform: `scale(${pop(f, s(1))})` }}>
      <R>誰が</R>、作業をしているか
    </div>
  </AbsoluteFill>
), { bg: "white", noSub: true });

/* 作業のレーン（人・客・機械） */
const Step: React.FC<{ x: number; y: number; t: string; who: "staff" | "guest" | "machine"; at: number; f: number }> = ({ x, y, t, who, at, f }) => {
  const p = pop(f, at);
  const color = who === "staff" ? "#3A6EA5" : who === "guest" ? K.ink : K.red;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
      {who === "machine" ? <Washer x={0} y={-10} s={0.28} /> : <Figure x={0} y={20} s={0.75} color={color} />}
      <text y={140} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={color}>
        {t}
      </text>
    </g>
  );
};

/* N40 FLAT: クリーニング店 = 人が提供するサービス */
const N40 = mk(({ f, s }) => {
  const STEPS = ["預ける", "受け取る", "洗う", "仕上げる", "返す"];
  return (
    <Stage>
      <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#3A6EA5">
        クリーニング店
      </text>
      {STEPS.map((t, i) => (
        <Step key={i} f={f} x={320 + i * 320} y={420} t={t} who={i === 0 ? "guest" : "staff"} at={i === 0 ? s(0) + 10 : s(1) + (i - 1) * 8} />
      ))}
      <text x={960} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#3A6EA5" opacity={fade(f, s(2))}>
        人が、サービスを提供する
      </text>
    </Stage>
  );
}, { hideSubs: [2] });

/* N41 FLAT: コインランドリー = 客が作業の一部、機械が中心（人は清掃・管理・故障対応） */
const N41 = mk(({ f, s }) => {
  const STEPS: { t: string; who: "guest" | "machine" }[] = [
    { t: "持ち込む", who: "guest" },
    { t: "選ぶ", who: "guest" },
    { t: "払う", who: "guest" },
    { t: "洗う・乾かす", who: "machine" },
  ];
  return (
    <Stage>
      <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={K.red}>
        コインランドリー
      </text>
      {STEPS.map((st, i) => (
        <Step key={i} f={f} x={360 + i * 400} y={400} t={st.t} who={st.who} at={s(1) + i * 10} />
      ))}
      <g opacity={fade(f, s(3))}>
        <rect x={420} y={640} width={1080} height={110} rx={20} fill="none" stroke="#3A6EA5" strokeWidth={4} strokeDasharray="14 10" />
        {["清掃", "管理", "故障対応"].map((t, i) => (
          <Pill key={i} x={660 + i * 300} y={695} text={t} at={s(4 + i)} size={40} color="#3A6EA5" />
        ))}
      </g>
      <text x={960} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.red} opacity={fade(f, s(7))}>
        サービスの中心は、機械
      </text>
    </Stage>
  );
}, { hideSubs: [4, 5, 6, 7] });

/* N42 BLUEPRINT/MAP: 店が増える＝客は選べる。選ばれない店の機械は止まる */
const N42 = mk(({ f, s }) => {
  const pick = ease(f, s(5), s(5) + 40, 0, 1, Easing.inOut(Easing.cubic));
  const stop = fade(f, s(6));
  const STORE = [
    { x: 520, label: "A", good: false },
    { x: 1400, label: "B", good: true },
  ];
  return (
    <Stage>
      {[260, 540, 820].map((y, i) => (
        <line key={i} x1={80} x2={1840} y1={y} y2={y} stroke={T.bpSoft} strokeWidth={30} />
      ))}
      {[340, 960, 1580].map((x, i) => (
        <line key={i} x1={x} x2={x} y1={120} y2={900} stroke={T.bpSoft} strokeWidth={30} />
      ))}
      {STORE.map((st, i) => (
        <g key={i} opacity={fade(f, s(1))}>
          <rect x={st.x - 200} y={330} width={400} height={170} rx={10} fill="#0F2748" stroke={T.bp} strokeWidth={5} />
          <text x={st.x} y={370} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={T.bp}>
            店 {st.label}
          </text>
          {[-100, 0, 100].map((dx, k) => (
            <Washer key={k} x={st.x + dx} y={440} s={0.15} spin={st.good || stop < 0.5 ? 1 : 0} />
          ))}
        </g>
      ))}
      <g opacity={fade(f, s(2))}>
        <Pill x={1400} y={600} text="大きな乾燥機" at={s(2)} size={34} color="#FFFFFF" fill="#2A4E7A" />
      </g>
      <Pill x={1400} y={690} text="車を停めやすい" at={s(3)} size={34} color="#FFFFFF" fill="#2A4E7A" />
      <Pill x={1400} y={780} text="きれいで明るい" at={s(4)} size={34} color="#FFFFFF" fill="#2A4E7A" />
      {/* 客（ピン） */}
      <g transform={`translate(${960 + 440 * pick} ${680 - 150 * pick})`} opacity={fade(f, s(5) - 10)}>
        <path d="M 0 0 C -30 -40 -30 -80 0 -80 C 30 -80 30 -40 0 0 Z" fill={K.red} />
        <circle cy={-55} r={12} fill="#FFFFFF" />
      </g>
      <text x={520} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#F4EEE3" opacity={stop}>
        選ばれない機械は、回らない
      </text>
    </Stage>
  );
}, { bg: "blueprint", hideSubs: [2, 3, 4] });

/* N43 BLUEPRINT → CLUE 04: どこに置く / どんな機械 / どう選ばれる → 「選ばれて、回るかどうか」 */
const N43 = mk(({ f, s }) => {
  const tag = fade(f, s(2) - 4);
  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - tag }}>
        <Stage>
          <text x={960} y={220} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#F4EEE3" opacity={fade(f, s(0))}>
            機械を置くだけでは、足りない
          </text>
          {["どこに置く", "どんな機械", "どう選ばれる"].map((t, i) => (
            <g key={i} opacity={fade(f, s(1) + i * 10)}>
              <rect x={260 + i * 500} y={420} width={420} height={140} rx={20} fill="#0F2748" stroke={T.bp} strokeWidth={5} />
              <text x={470 + i * 500} y={490} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#FFFFFF">
                ✓ {t}
              </text>
            </g>
          ))}
        </Stage>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: tag }}>
        <CareTag no="4" at={s(2)} />
      </AbsoluteFill>
    </>
  );
}, { bg: "blueprint", hideSubs: [2] });

/* N44 BLUEPRINT（RESET）: 夜の店に戻る。最初の問いが二つに分かれる */
const N44 = mk(({ f, s }) => {
  const q = fade(f, s(1));
  const split = ease(f, s(3), s(3) + 20);
  return (
    <>
      <Stage>
        <g opacity={0.45}>
          <NightStore lit={1} inside={1} y={640} s={0.85} />
        </g>
      </Stage>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 110, fontFamily: SERIF }}>
        <div style={{ fontSize: 70, fontWeight: 900, color: "#F4EEE3", opacity: q * (1 - split * 0.6), textDecoration: fade(f, s(2)) > 0.5 ? "line-through" : "none", textDecorationColor: K.red }}>
          「人がいないのに、なぜ儲かる？」
        </div>
        <div style={{ display: "flex", gap: 60, marginTop: 40, opacity: split }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: T.glow, background: "rgba(12,24,48,0.8)", padding: "10px 30px", borderRadius: 14 }}>機械が何度サービスを生むか</div>
          <div style={{ fontSize: 56, fontWeight: 900, color: T.glow, background: "rgba(12,24,48,0.8)", padding: "10px 30px", borderRadius: 14, opacity: fade(f, s(4)) }}>使いたい人がいるか</div>
        </div>
      </AbsoluteFill>
    </>
  );
}, { bg: "blueprint", hideSubs: [1] });

export const TURN4 = { N35, N36, N37, N38, N39, N40, N41, N42, N43, N44 };
export { Dryer };
