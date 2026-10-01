/** CUT 032–043（E31–E43）。CLUE → この先 → 新しい契約 → 皿の計算し直し → 限界 → 買う側（最初の棚へ戻る）→ 2027 → MONEY FLOW → FINAL → 答え → 固定エンディング */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, Veil, mk } from "../case002/ui";
import { Cam } from "../case008/kit2";
import {
  CalcNote,
  Clock,
  Coin10,
  Doc,
  Easing,
  FONT,
  K,
  NightShelf,
  Onigiri,
  P,
  Plates,
  ReceiptClue,
  SERIF,
  Sfx,
  Sticker,
  StoreFront,
  T,
  TrashBag,
  ease,
  fade,
  pop,
  slot,
} from "./kit";

/* CUT 032 — [CLUE / LEVEL 3] E31: レシートの CLUE 01 */
const E31 = mk(({ s }) => <ReceiptClue no="01" at={s(0) + 6} />, { bg: "paper", noSub: true });

/* CUT 033 — [QUESTION / LEVEL 1] E32: 夜の棚のシルエット、明かりがまたたく */
const E32 = mk(({ f }) => (
  <>
    <Stage>
      <NightShelf n={12} bento={6} dim={0.55 + 0.15 * Math.sin(f / 5)} />
    </Stage>
    <Sfx at={4} name="question" volume={0.45} />
  </>
), { bg: "night" });

/* 契約の行 */
const Term: React.FC<{ y: number; label: string; from: string; to: string; p: number; big?: boolean; color?: string; o?: number }> = ({ y, label, from, to, p, big, color = P.green, o = 1 }) => (
  <g transform={`translate(0 ${y})`} opacity={o}>
    <T x={-560} y={0} size={big ? 44 : 32} anchor="start">
      {label}
    </T>
    <T x={160} y={0} size={big ? 56 : 38} color={K.inkSoft} o={1 - p * 0.5}>
      {from}
    </T>
    {p > 0.05 && <line x1={60} x2={60 + 200 * Math.min(1, p * 2)} y1={0} y2={0} stroke={P.red} strokeWidth={5} />}
    <T x={330} y={0} size={big ? 48 : 34} color="#9FB3C8" o={p}>
      →
    </T>
    <T x={480} y={0} size={big ? 64 : 42} color={color} o={p}>
      {to}
    </T>
  </g>
);

/* CUT 034 — [INFOGRAPHIC / LEVEL 3] E33: 古い契約書の上に新しい契約書が重なる → 廃棄の行だけ大きく 15:85 → 50:50、横に上限の鍵 */
const E33 = mk(({ f, s }) => {
  const nw = ease(f, s(0) + 20, s(0) + 50, 0, 1, Easing.out(Easing.cubic));
  const p = ease(f, s(4), s(4) + 30);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(3), s: 1 }, { at: s(3) + 30, s: 1.15, x: 1000, y: 600 }]}>
          <Doc x={760} y={560} w={760} h={820} title="加盟店契約（今まで）" rot={-4} dust={0.6} />
          <g transform={`translate(${1960 - nw * 860} 560)`}>
            <Doc x={0} y={0} w={1240} h={820} title="新しい契約" color={P.green}>
              <T x={0} y={-290} size={34} color={K.inkSoft} o={fade(f, s(1))}>
                2026年6月 発表 → 2027年秋ごろ 開始
              </T>
              <T x={0} y={-230} size={28} color={K.inkSoft} o={fade(f, s(2))}>
                本部が土地・建物を用意するタイプ
              </T>
              <g opacity={fade(f, s(3))}>
                <rect x={-580} y={-110} width={1160} height={200} rx={16} fill="#EAF7F0" />
                <T x={-540} y={-60} size={36} anchor="start">
                  捨てた分の仕入れ値
                </T>
                <T x={-200} y={30} size={64} color={K.inkSoft} o={1 - p * 0.5}>
                  本部15 : 店85
                </T>
                <T x={160} y={30} size={56} color="#9FB3C8" o={p}>
                  →
                </T>
                <T x={390} y={30} size={80} color={P.green} o={p}>
                  50 : 50
                </T>
              </g>
              <g opacity={fade(f, s(5))} transform="translate(420 220)">
                <rect x={-40} y={-20} width={80} height={70} rx={10} fill={P.hq} />
                <path d="M -24 -20 L -24 -44 Q 0 -74 24 -44 L 24 -20" fill="none" stroke={P.hq} strokeWidth={10} />
                <T x={120} y={14} size={40} color={P.hq} anchor="start">
                  上限
                </T>
              </g>
            </Doc>
          </g>
        </Cam>
      </Stage>
      <EvidenceMark no="#14" source="セブン-イレブン 新契約タイプ発表（2026年6月・報道）" at={s(0)} />
      <Sfx at={s(4)} name="stamp" volume={0.5} />
    </>
  );
}, { bg: "white" });

/* CUT 034B — [INFOGRAPHIC / LEVEL 2] E33B: 条件の表。大きい 2 行（チャージ・光熱費）+ 小さい 3 行 → 最後に新しい店のアイコンが増える */
const E33B = mk(({ f, s }) => {
  const r = (i: number) => ease(f, s(i) + 10, s(i) + 30);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }]}>
          <g transform="translate(960 0)">
            <Term y={220} label="チャージの率（最大）" from="76%" to="67%" p={r(0)} big color={P.hq} />
            <Term y={360} label="光熱費の本部負担" from="80%" to="50%" p={r(1)} big color={P.store} o={fade(f, s(1))} />
            <line x1={-580} x2={580} y1={450} y2={450} stroke="#C9D1DB" strokeWidth={3} />
            <Term y={520} label="契約の期間" from="15年" to="10年" p={r(2)} o={fade(f, s(2))} />
            <Term y={590} label="2店目から（毎月）" from="―" to="−10万円" p={r(3)} o={fade(f, s(3))} />
            <Term y={660} label="24時間営業（毎月）" from="利益の2%" to="−20万円" p={r(4)} o={fade(f, s(4))} />
          </g>
          <g opacity={fade(f, s(5))}>
            {[0, 1, 2, 3, 4].map((i) => (
              <StoreFront key={i} x={560 + i * 200} y={850} s={0.4 * pop(f, s(5) + i * 6)} label="" />
            ))}
            <T x={960} y={110} size={34} color={P.green}>
              新しい加盟店を増やす（会社の説明）
            </T>
          </g>
        </Cam>
      </Stage>
      <EvidenceMark no="#14" source="セブン-イレブン 新契約タイプ発表（2026年6月・報道）" at={0} />
    </>
  );
}, { bg: "white" });

/* CUT 035 — [SIMULATION / LEVEL 4 HERO] E34: 二つの皿（010・014 に戻る）。捨てた分が 50:50 に → 本部の皿 56 → 0 / 値引きすれば 50 → 矢印の向きが逆になる */
const E34 = mk(({ f, s }) => {
  const zero = ease(f, s(2), s(2) + 30);
  const hq = f < s(2) ? 56 : 56 - 56 * zero;
  const store = f < s(2) ? -56 : -56 + 56 * zero;
  const flip = ease(f, s(4), s(4) + 30);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(4), s: 1 }, { at: s(4) + 30, s: 1.05, y: 520 }]}>
          <g opacity={fade(f, s(1))}>
            <T x={960} y={140} size={36} color="#9FB3C8">
              捨てた分の仕入れ値：本部 50 : 店 50
            </T>
          </g>
          <Plates hq={hq} store={store} y={470} s={0.8} />
          <g opacity={fade(f, s(3))}>
            <T x={560} y={760} size={34} color={P.waste}>
              捨てる：本部 0円
            </T>
            <T x={1360} y={760} size={34} color={P.sticker}>
              値引きして売り切る：本部 50円
            </T>
          </g>
          <g opacity={fade(f, s(4))} transform="translate(960 860)">
            <g transform={`scale(${-1 + 2 * flip} 1)`}>
              <path d="M -300 0 L 260 0" stroke={P.green} strokeWidth={18} />
              <path d="M 240 -36 L 300 0 L 240 36 Z" fill={P.green} />
            </g>
            <T x={(-1 + 2 * flip) * 380} y={-60} size={34} color={P.green}>
              得
            </T>
          </g>
        </Cam>
      </Stage>
      <CalcNote at={0} text="※計算・イメージ（仕入れ80円・売値100円・利益を半分ずつ、捨てた分は半分ずつ）" />
      <Sfx at={s(2) + 30} name="ding" volume={0.45} />
    </>
  );
}, { bg: "night" });

/* CUT 036 — [INFOGRAPHIC / LEVEL 1] E35: 本部負担の上限の鍵、米・人件費 ↑ の矢印が残る */
const E35 = mk(({ f, s }) => (
  <Stage>
    <g opacity={fade(f, s(1))} transform="translate(700 520)">
      <rect x={-120} y={-60} width={240} height={200} rx={20} fill={P.hq} />
      <path d="M -70 -60 L -70 -120 Q 0 -210 70 -120 L 70 -60" fill="none" stroke={P.hq} strokeWidth={26} />
      <T x={0} y={40} size={52} color="#FFFFFF">
        上限
      </T>
    </g>
    <g opacity={fade(f, s(2))}>
      {[
        [1180, "米"],
        [1440, "人件費"],
      ].map(([x, t], i) => (
        <g key={i} transform={`translate(${x} 560)`}>
          <path d="M 0 120 L 0 -80" stroke={P.red} strokeWidth={22} />
          <path d="M -44 -60 L 0 -130 L 44 -60 Z" fill={P.red} />
          <T x={0} y={180} size={40}>
            {t}
          </T>
        </g>
      ))}
    </g>
  </Stage>
), { bg: "white" });

/* CUT 037 — [STORY / LEVEL 3] E36: 最初の棚（001 と同じアングル）。今度は視聴者の手：期限 −2:00 → シールの商品 → 手前の商品から取る（てまえどり）→ 袋が小さくなる */
const E36 = mk(({ f, s }) => {
  const st = [0, 1, 2].map((i) => ({ i, text: "値引", o: fade(f, s(1) + i * 8), color: f > s(2) ? P.sticker : P.green }));
  const take = ease(f, s(3) + 10, s(3) + 40);
  const [bx, by] = slot(0);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(3), s: 1 }, { at: s(3) + 30, s: 1.35, x: bx + 200, y: by + 80 }, { at: s(5), s: 1, x: 960, y: 540 }]}>
          <NightShelf n={12} bento={6} stickers={st} />
          <Clock x={1700} y={110} text="−2:00" s={0.8} color={P.green} o={fade(f, s(1))} />
          <g transform={`translate(${bx} ${by + 10 - take * 240})`} opacity={take > 0 ? 1 : 0}>
            <rect x={-40} y={20} width={80} height={240} rx={30} fill="#E7C8A8" />
          </g>
          <g opacity={fade(f, s(3) + 40)}>
            <rect x={bx + 240} y={by - 160} width={420} height={140} rx={16} fill={P.night} opacity={0.9} />
            <T x={bx + 260} y={by - 120} size={44} color="#FFFFFF" anchor="start">
              てまえどり
            </T>
            <T x={bx + 260} y={by - 60} size={26} color="#C9D6E6" anchor="start" o={fade(f, s(4))}>
              国の呼びかけ（2021年〜）
            </T>
          </g>
          <g opacity={fade(f, s(5))}>
            <TrashBag x={1700} y={900} s={0.9 - 0.3 * ease(f, s(5), s(5) + 40)} />
          </g>
        </Cam>
      </Stage>
    </>
  );
}, { bg: "night" });

/* CUT 038 — [STORY / LEVEL 2] E37: 2027 のカレンダーと夜の棚。少し空いて、シールが貼られた姿を点線で（可能性 ※イメージ） */
const E37 = mk(({ f, s }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1.1 }, { at: s(1) + 60, s: 1 }]}>
        <NightShelf n={9} bento={4} />
        {[9, 10, 11].map((i) => {
          const [x, y] = slot(i);
          return <path key={i} d={`M ${x} ${y - 46} Q ${x + 10} ${y - 46} ${x + 44} ${y + 22} L ${x - 44} ${y + 22} Q ${x - 10} ${y - 46} ${x} ${y - 46} Z`} fill="none" stroke="#9FB3C8" strokeWidth={3} strokeDasharray="8 8" />;
        })}
        {[2, 3].map((i) => {
          const [x, y] = slot(i);
          return <circle key={i} cx={x + 34} cy={y - 30} r={36} fill="none" stroke={P.green} strokeWidth={4} strokeDasharray="8 8" opacity={fade(f, s(0) + 20)} />;
        })}
        <g transform="translate(1700 110)" opacity={fade(f, s(0))}>
          <rect x={-120} y={-60} width={240} height={120} rx={14} fill="#FFFFFF" />
          <rect x={-120} y={-60} width={240} height={34} rx={14} fill={P.red} />
          <T x={0} y={18} size={52}>
            2027
          </T>
        </g>
      </Cam>
    </Stage>
    <div style={{ position: "absolute", right: 56, bottom: 200, fontFamily: FONT, fontSize: 24, fontWeight: 800, color: "#9FB3C8" }}>※イメージ</div>
  </>
), { bg: "night" });

/* CUT 039 — [MONEY FLOW / LEVEL 3] E38: 客の 100円 → 店 → 売れた利益は二つの皿へ / 捨てた仕入れ値 店85・本部15 → 50・50 / 値引き → 二つの皿（字幕なし） */
const E38 = mk(({ f }) => {
  const t = ((f % 60) / 60);
  const nw = ease(f, 150, 190);
  return (
    <>
      <Stage>
        <Coin10 x={200 + t * 400} y={300} r={34} label="100" />
        <T x={200} y={380} size={30} color="#C9D6E6">
          客
        </T>
        <StoreFront x={800} y={360} s={0.7} lit={1} label="店" />
        <path d="M 900 300 L 1200 220 M 900 300 L 1200 420" stroke="#E9C46A" strokeWidth={6} strokeDasharray="12 10" opacity={fade(f, 20)} />
        <g opacity={fade(f, 20)}>
          <circle cx={1300} cy={220} r={60} fill={P.hq} />
          <T x={1300} y={220} size={34} color="#FFFFFF">
            本部
          </T>
          <circle cx={1300} cy={420} r={60} fill={P.store} />
          <T x={1300} y={420} size={34} color="#FFFFFF">
            店
          </T>
          <T x={1500} y={320} size={28} color="#C9D6E6" anchor="start">
            売れた分の利益
          </T>
        </g>
        <g opacity={fade(f, 60)} transform="translate(960 760)">
          <TrashBag x={-560} y={0} s={0.8} />
          <rect x={-380} y={-50} width={760 * (0.85 - 0.35 * nw)} height={100} fill={P.store} />
          <rect x={-380 + 760 * (0.85 - 0.35 * nw)} y={-50} width={760 * (0.15 + 0.35 * nw)} height={100} fill={P.hq} />
          <T x={-380 + 380 * (0.85 - 0.35 * nw)} y={0} size={40} color="#FFFFFF">
            店 {Math.round(85 - 35 * nw)}
          </T>
          <T x={-380 + 760 * (0.85 - 0.35 * nw) + 380 * (0.15 + 0.35 * nw)} y={0} size={40} color="#FFFFFF">
            本部 {Math.round(15 + 35 * nw)}
          </T>
          <T x={0} y={100} size={28} color="#C9D6E6">
            捨てた分の仕入れ値
          </T>
        </g>
        <Sticker x={1620} y={760} text="値引" s={fade(f, 100)} />
        <path d="M 1580 700 Q 1450 560 1330 470 M 1600 700 Q 1500 400 1330 260" stroke={P.sticker} strokeWidth={5} fill="none" strokeDasharray="10 8" opacity={fade(f, 110)} />
      </Stage>
    </>
  );
}, { bg: "night", noSub: true });

/* CUT 040 — [CLUE / LEVEL 3] E39: FINAL のレシート */
const E39 = mk(({ s }) => <ReceiptClue no="FINAL" at={s(0) + 8} />, { bg: "paper", noSub: true });

/* CUT 041 — [IMPACT / LEVEL 4 HERO] E40: 最終の答え。最後の文で二つの皿が水平になる */
const E40 = mk(({ f, s }) => {
  const lv = ease(f, s(1), s(1) + 40);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(1) + 40, s: 1.05, y: 600 }]}>
          <Plates hq={56 * (1 - lv)} store={-56 * (1 - lv)} y={780} s={0.75} fmt={() => ""} />
          <Onigiri x={960} y={640} s={1.6} />
        </Cam>
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70, fontFamily: SERIF }}>
        <div style={{ fontSize: 60, fontWeight: 900, color: "#FFFFFF", opacity: fade(f, s(0)), textAlign: "center", lineHeight: 1.45 }}>
          答えは――捨てた分は<span style={{ color: P.store }}>店</span>が払い、
          <br />
          値引きした分は<span style={{ color: P.hq }}>本部</span>も払う仕組みだったから。
        </div>
      </AbsoluteFill>
      <Sfx at={s(1) + 20} name="ding" volume={0.35} />
    </>
  );
}, { bg: "night", noSub: true });

/* CUT 042 — [ENDING] E41–E43: 固定エンディング（名前は音声で 1 回、画面はロゴ） */
const E41 = mk(
  ({ s }) => (
    <Lines
      lines={[
        { t: "身近なお金には、", at: s(0), size: 84, serif: false },
        { t: <>まだまだ<R>謎</R>がある。</>, at: s(0) + 26, size: 112, serif: false },
      ]}
    />
  ),
  { noSub: true },
);
const E42 = mk(
  ({ f, s }) => {
    const p = ease(f, s(0), s(0) + 16, 0, 1, Easing.out(Easing.back(1.6)));
    return (
      <>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 100, fontFamily: FONT }}>
          <div style={{ transform: `scale(${p})`, textAlign: "center" }}>
            <div style={{ fontSize: 170, fontWeight: 900, color: K.ink, letterSpacing: 28 }}>KANENAZO</div>
            <div style={{ display: "inline-block", marginTop: 8, background: K.red, color: K.white, fontSize: 48, fontWeight: 900, letterSpacing: 16, padding: "4px 30px", borderRadius: 12 }}>カネナゾ</div>
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, color: K.inkSoft, letterSpacing: 10, marginTop: 44, opacity: ease(f, s(1), s(1) + 12) }}>身近なお金の謎を解く。</div>
        </AbsoluteFill>
        <Sfx at={s(0)} name="jingle" volume={0.8} />
      </>
    );
  },
  { noSub: true },
);
const E43 = mk(
  ({ f, s, d }) => (
    <>
      <Lines lines={[{ t: "では、次の謎で。", at: s(0), size: 90, serif: false }]} />
      <Veil o={ease(f, d - 40, d)} />
    </>
  ),
  { noSub: true },
);

export const END10 = { E31, E32, E33, E33B, E34, E35, E36, E37, E38, E39, E40, E41, E42, E43 };
export { Onigiri };
