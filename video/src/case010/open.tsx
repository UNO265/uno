/** CUT 001–013（E01–E13B）。06 DIRECTION。画面は語りを書き写さない（数字・ラベル・出典だけ。例外: 最初の答え E11 と CLUE） */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, count, mk } from "../case002/ui";
import { Cam, JapanMap, Person8 } from "../case008/kit2";
import {
  Bento,
  CalcNote,
  Clock,
  Coin10,
  Doc,
  Easing,
  FONT,
  HQBuilding,
  K,
  MONO,
  NightShelf,
  Onigiri,
  P,
  Plates,
  SERIF,
  Sfx,
  StampMark,
  Sticker,
  StoreFront,
  T,
  TrashBag,
  ease,
  fade,
  pop,
  slot,
} from "./kit";

export const TITLE_Q = (
  <>
    コンビニ、<R>なぜ値引きせず捨てる？</R>
  </>
);

/* CUT 001 — [REAL(再現) / LEVEL 3] E01–E02: 夜の棚。客の手が弁当を取って値札を見て戻す（Slow Push In） */
const Hand: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={-40} y={0} width={80} height={260} rx={30} fill="#E7C8A8" />
    <rect x={-46} y={150} width={92} height={160} rx={20} fill="#3B4B68" />
  </g>
);
const E01 = mk(({ f, d }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1 }, { at: d, s: 1.12, y: 560 }]}>
        <NightShelf n={12} bento={6} price="弁当" />
        <Clock x={1720} y={900} text="23:00" s={0.8} o={fade(f, 10)} />
      </Cam>
    </Stage>
    <Lines y={-420} lines={[{ t: TITLE_Q, at: -10, size: 76 }]} dark />
  </>
), { bg: "night" });

const E02 = mk(({ f, s }) => {
  const lift = ease(f, 6, 30) - ease(f, s(1), s(1) + 24);
  const [bx, by] = slot(2);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.12, y: 560 }, { at: s(1) + 30, s: 1.35, x: bx, y: by + 60 }]}>
          <NightShelf n={12} bento={6} price="弁当" />
          <rect x={bx - 70} y={by - 44} width={140} height={90} fill={P.shelf} opacity={lift > 0.05 ? 1 : 0} />
          <Bento x={bx} y={by + 10 - lift * 260} s={1.2} />
          <Hand x={bx} y={by + 40 - lift * 260} o={Math.min(1, lift * 3)} />
          {/* シールの場所は空いたまま */}
          <circle cx={bx + 34} cy={by - 30} r={36} fill="none" stroke={P.sticker} strokeWidth={4} strokeDasharray="8 8" opacity={fade(f, s(1)) * 0.9} />
        </Cam>
      </Stage>
    </>
  );
}, { bg: "night" });

/* CUT 002 — [IMPACT / LEVEL 4] E03: 弁当がごみ袋へ → 袋が積み上がって 468万円（Zoom Out） */
const E03 = mk(({ f, s }) => {
  const drop = ease(f, 8, 34, 0, 1, Easing.in(Easing.quad));
  const n = Math.round(ease(f, s(1), s(1) + 60) * 11);
  const v = Math.round(count(f, s(1) + 10, 50, 0, 468));
  return (
    <>
      <Stage>
        <rect width={1920} height={1080} fill={P.night} />
        <Cam keys={[{ at: 0, s: 1.6, x: 960, y: 620 }, { at: s(1), s: 1.6, x: 960, y: 620 }, { at: s(1) + 60, s: 1, x: 960, y: 560 }]}>
          <TrashBag x={960} y={720} s={1.1} fill={drop} />
          {drop < 1 && <Bento x={960} y={300 + drop * 380} s={1} />}
          {Array.from({ length: n }, (_, i) => {
            const row = i < 5 ? 0 : i < 9 ? 1 : 2;
            const col = i < 5 ? i : i < 9 ? i - 5 : i - 9;
            const cols = [5, 4, 2][row];
            const x = 960 + (col - (cols - 1) / 2) * 200 + (col >= 2 && row === 0 ? 0 : 0);
            if (row === 0 && col === 2) return null;
            return <TrashBag key={i} x={x} y={720 - row * 170} s={0.8} />;
          })}
        </Cam>
        <g opacity={fade(f, s(1) + 10)}>
          <text x={960} y={190} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill="#FFFFFF">
            {v}
            <tspan fontSize={70}>万円</tspan>
          </text>
          <T x={960} y={290} size={34} color="#C9D6E6">
            1店・1年
          </T>
        </g>
      </Stage>
      <EvidenceMark no="#01" source="公正取引委員会 実態調査（2020年）" at={s(1)} dark />
      <Sfx at={30} name="thud" volume={0.5} />
    </>
  );
}, { bg: "night" });

/* CUT 003 — [QUESTION / LEVEL 3] E04: 左 = スーパーの弁当に半額シール / 右 = コンビニの弁当、シールの場所は空いたまま → 右だけ残る */
const E04 = mk(({ f, s }) => {
  const dark = ease(f, s(1), s(1) + 20);
  return (
    <>
      <Stage>
        <rect width={1920} height={1080} fill="#101826" />
        <Cam keys={[{ at: 0, s: 1 }, { at: s(1), s: 1 }, { at: s(1) + 40, s: 1.2, x: 1300, y: 540 }]}>
          <g opacity={1 - dark * 0.8}>
            <rect x={240} y={300} width={560} height={420} rx={20} fill="#1C2738" />
            <Bento x={520} y={540} s={2.4} />
            <Sticker x={640} y={420} text="半額" s={1.4 * pop(f, 10)} />
            <T x={520} y={780} size={36} color="#9FB3C8">
              SUPER
            </T>
          </g>
          <rect x={1020} y={300} width={560} height={420} rx={20} fill="#1C2738" />
          <Bento x={1300} y={540} s={2.4} />
          <circle cx={1420} cy={420} r={60} fill="none" stroke={P.sticker} strokeWidth={5} strokeDasharray="10 10" />
          <T x={1300} y={780} size={36} color="#9FB3C8">
            コンビニ
          </T>
        </Cam>
      </Stage>
      <Sfx at={s(1)} name="question" volume={0.5} />
    </>
  );
}, { bg: "night" });

/* CUT 004 — [QUESTION / LEVEL 2] E05: 時計 2:00、折りたたまれた契約書に「50年ぶり」が透ける */
const E05 = mk(({ f, s }) => (
  <>
    <Stage>
      <g transform="translate(960 300)" opacity={fade(f, s(0)) * (1 - 0.6 * fade(f, s(1)))}>
        <circle r={140} fill="none" stroke="#F4EEE3" strokeWidth={10} />
        <line x1={0} y1={0} x2={0} y2={-105} stroke="#F4EEE3" strokeWidth={10} strokeLinecap="round" transform={`rotate(${ease(f, s(0), s(0) + 30) * 360})`} />
        <text y={220} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={70} fill={P.store}>
          2:00
        </text>
      </g>
      <g opacity={fade(f, s(1))}>
        <Doc x={960} y={760} w={420} h={300} title="契約" s={0.9} rot={-4} />
        <text x={960} y={800} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill={P.red} opacity={0.35 + 0.25 * Math.sin(f / 8)}>
          50年ぶり
        </text>
      </g>
    </Stage>
  </>
), { bg: "black" });

/* CUT 005 — [TITLE / LEVEL 2] E06: レシートの形のタイトル（印字されて出てくる） */
const E06 = mk(({ f, s }) => {
  const p = ease(f, s(1) - 10, s(1) + 16, 0, 1, Easing.out(Easing.cubic));
  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
        <div style={{ color: "#D8D2C6", fontSize: 40, fontWeight: 800, letterSpacing: 10, opacity: fade(f, s(0)) }}>今日のカネナゾ ― CASE #010</div>
        <div style={{ marginTop: 40, background: "#FFFFFF", clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`, padding: "26px 60px 34px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
          <div style={{ fontFamily: MONO, textAlign: "center", fontSize: 26, letterSpacing: 8, color: "#6B7280" }}>RECEIPT ― KANENAZO</div>
          <div style={{ borderTop: "4px dashed #9AA3AF", margin: "16px 0 22px" }} />
          <div style={{ fontFamily: SERIF, fontSize: 84, fontWeight: 900, color: K.ink, whiteSpace: "nowrap" }}>{TITLE_Q}</div>
        </div>
      </AbsoluteFill>
      <Sfx at={s(1) - 10} name="paper" volume={0.6} />
    </>
  );
}, { bg: "black", noSub: true });

/* CUT 006 — [INFOGRAPHIC / LEVEL 1] E07: 黒く塗られたレシート 2 枚 → 契約書と調査報告書（カメラ固定） */
const Receipt10: React.FC<{ x: number; y: number; title: string; o: number; lockO: number }> = ({ x, y, title, o, lockO }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={-230} y={-220} width={460} height={440} fill="#FFFFFF" stroke="#D8D2C6" strokeWidth={3} />
    <text y={-160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={K.ink}>
      {title}
    </text>
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-180} y={-100 + i * 60} width={360} height={36} rx={4} fill="#1E2230" opacity={lockO} />
    ))}
    <text y={180} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill="#9AA3AF" opacity={lockO}>
      非公表
    </text>
  </g>
);
const E07 = mk(({ f, s }) => (
  <>
    <Stage>
      <Receipt10 x={560} y={320} title="商品ごとの仕入れ値" o={fade(f, 10)} lockO={fade(f, 34)} />
      <Receipt10 x={1360} y={320} title="店に残る額" o={fade(f, 50)} lockO={fade(f, 70)} />
      <g opacity={fade(f, s(1))}>
        <Doc x={760} y={720} w={300} h={220} title="契約" s={1} />
        <Doc x={1160} y={720} w={300} h={220} title="調査" s={1} />
      </g>
    </Stage>
    <Sfx at={34} name="tok" volume={0.5} />
  </>
), { bg: "white" });

/* CUT 007 — [GRAPH / LEVEL 2] E08: 日本地図に店の点（1点 = 約200店）。12兆583億円のカウントアップ → 最大手のカード */
const E08 = mk(({ f, s }) => {
  const n = Math.round(280 * ease(f, s(0), s(1) + 20, 0, 1, Easing.inOut(Easing.cubic)));
  const oku = Math.round(count(f, s(1), 60, 0, 120583));
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.25, x: 760, y: 470 }, { at: s(1) + 20, s: 1, x: 960, y: 540 }]}>
          <JapanMap x={700} y={470} s={0.95} n={n} r={5} />
        </Cam>
        <g opacity={fade(f, s(0) + 20)}>
          <text x={1500} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill={K.ink}>
            5万6,054<tspan fontSize={44}>店</tspan>
          </text>
          <T x={1500} y={320} size={24} color={K.inkSoft}>
            ● = 約200店（※イメージ）
          </T>
        </g>
        <g opacity={fade(f, s(1))}>
          <text x={1500} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={P.store}>
            {oku >= 100000 ? `${Math.floor(oku / 10000)}兆${oku % 10000}` : `${(oku / 10000).toFixed(1)}兆`}
            <tspan fontSize={46}>億円</tspan>
          </text>
          <T x={1500} y={530} size={26} color={K.inkSoft}>
            2025年 売上（過去最高）
          </T>
        </g>
        <g opacity={fade(f, s(2))} transform={`translate(1500 760) scale(${pop(f, s(2))})`}>
          <rect x={-300} y={-120} width={600} height={240} rx={18} fill="#FFFFFF" stroke={P.hq} strokeWidth={5} />
          <T x={0} y={-70} size={32} color={P.hq}>
            最大手（セブン-イレブン）
          </T>
          <T x={-140} y={20} size={56}>
            2万1,722<tspan fontSize={28}>店</tspan>
          </T>
          <T x={150} y={20} size={56} color={P.hq}>
            2,202<tspan fontSize={28}>億円</tspan>
          </T>
          <T x={150} y={78} size={22} color={K.inkSoft}>
            本部の営業利益
          </T>
        </g>
      </Stage>
      <EvidenceMark no="#02" source="日本フランチャイズチェーン協会（2025年）・セブン&アイ 決算（2026年2月期）" at={s(0)} />
    </>
  );
}, { bg: "white" });

/* CUT 008 — [STORY / LEVEL 2] E09: よく言われる答え（衛生・イメージ）が薄れ、スーパーの閉店前に半額シールが次々に貼られる */
const E09 = mk(({ f, s }) => {
  const gone = fade(f, s(2), 20);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1)) * (1 - gone * 0.85)}>
          <g transform="translate(700 420)">
            <circle r={130} fill="#DDEBF5" />
            <path d="M -50 10 Q -50 -60 0 -60 Q 50 -60 50 10 L 50 60 L -50 60 Z" fill="#FFFFFF" stroke={P.hq} strokeWidth={6} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={-30 + i * 30} cy={-90} r={10} fill="#9FD3F0" />
            ))}
            <T x={0} y={190} size={40} color={P.hq}>
              衛生？
            </T>
          </g>
          <g transform="translate(1220 420)">
            <circle r={130} fill="#FBE7D3" />
            <path d="M 0 -80 L 22 -26 L 80 -26 L 34 8 L 52 64 L 0 30 L -52 64 L -34 8 L -80 -26 L -22 -26 Z" fill={P.store} />
            <T x={0} y={190} size={40} color={P.store}>
              イメージ？
            </T>
          </g>
        </g>
        <g opacity={gone}>
          <rect x={360} y={300} width={1200} height={420} rx={16} fill="#F4F6F8" stroke="#C9D1DB" strokeWidth={4} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <Bento x={480 + i * 240} y={520} s={1.3} />
              <Sticker x={540 + i * 240} y={460} text="半額" s={pop(f, s(2) + 20 + i * 8)} o={fade(f, s(2) + 20 + i * 8, 4)} />
            </g>
          ))}
          <Clock x={1440} y={250} text="20:00" s={0.7} dark={false} />
          <T x={960} y={780} size={34} color={K.inkSoft}>
            SUPER（閉店前）
          </T>
        </g>
        <g opacity={fade(f, s(3))}>
          {[0, 1, 2].map((i) => (
            <Coin10 key={i} x={860 + i * 100} y={900 - ease(f, s(3) + i * 6, s(3) + 30 + i * 6) * 30} r={30} label="円" />
          ))}
        </g>
      </Stage>
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} at={s(2) + 20 + i * 8} name="pop" volume={0.3} />
      ))}
    </>
  );
}, { bg: "white" });

/* CUT 009 — [QUESTION / LEVEL 2] E10: 袋に入るおにぎり。硬貨がすべて灰色になる */
const E10 = mk(({ f, s }) => {
  const g = ease(f, s(0) + 10, s(0) + 40);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(1) + 30, s: 1.2, y: 600 }]}>
          <TrashBag x={960} y={640} s={1.5} fill={1} />
          {[0, 1, 2, 3, 4].map((i) => (
            <Coin10 key={i} x={620 + i * 170} y={300} r={44} label="円" gray={g > i / 5} />
          ))}
        </Cam>
      </Stage>
      <Sfx at={s(1)} name="question" volume={0.45} />
    </>
  );
}, { bg: "night" });

/* CUT 010 — [IMPACT / LEVEL 4] E11: 二つの皿だけ。ごみ袋から太い灰色の線が店の皿へ、値引きシールから細い線が両方の皿へ（BGM なし） */
const E11 = mk(({ f, s }) => {
  const a = ease(f, s(1), s(1) + 30);
  const b = ease(f, s(2), s(2) + 30);
  return (
    <>
      <Stage>
        <Plates hq={null} store={null} y={760} s={0.85} />
        <TrashBag x={640} y={360} s={0.7} o={fade(f, s(1))} />
        <path d="M 700 440 Q 1000 520 1181 690" fill="none" stroke={P.waste} strokeWidth={34} strokeDasharray={`${700 * a} 700`} strokeLinecap="round" />
        <Sticker x={1300} y={360} text="値引" s={1.2 * pop(f, s(2))} />
        <path d="M 1290 420 Q 1240 560 1181 690" fill="none" stroke={P.sticker} strokeWidth={10} strokeDasharray={`${400 * b} 400`} strokeLinecap="round" />
        <path d="M 1270 420 Q 1000 520 739 690" fill="none" stroke={P.sticker} strokeWidth={10} strokeDasharray={`${700 * b} 700`} strokeLinecap="round" />
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 40, fontFamily: SERIF }}>
        <div style={{ fontSize: 44, fontWeight: 900, color: "#9FB3C8", opacity: fade(f, s(0)) }}>結論から言うと――</div>
        <div style={{ fontSize: 58, fontWeight: 900, color: "#FFFFFF", marginTop: 6, textAlign: "center", lineHeight: 1.35 }}>
          <span style={{ opacity: fade(f, s(1)) }}>
            捨てた分は、ほとんど<R c={P.store}>店</R>が払い、
          </span>
          <br />
          <span style={{ opacity: fade(f, s(2)) }}>
            値引きした分は、<R c={P.hq}>本部</R>も払う仕組みだった。
          </span>
        </div>
      </AbsoluteFill>
      <Sfx at={s(1)} name="stamp" volume={0.6} />
    </>
  );
}, { bg: "night", noSub: true });

/* CUT 011 — [INFOGRAPHIC / LEVEL 2] E12: 本部が看板・商品・仕組みの箱を店に渡す → 利益の硬貨の一部が「チャージ」で本部へ → 45% / 56〜76% → 「推奨価格」の札、値札を握るのはオーナー */
const E12 = mk(({ f, s }) => {
  const box = ease(f, s(1), s(1) + 40);
  const coinT = ((f - s(2)) % 60) / 60;
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(3) - 10, s: 1 }, { at: s(3) + 20, s: 1, x: 960, y: 540 }]}>
          <HQBuilding x={420} y={440} s={0.8} o={fade(f, s(0))} />
          <StoreFront x={1500} y={440} s={0.8} o={fade(f, s(0) + 10)} label="店（オーナー）" />
          {["看板", "商品", "仕組み"].map((t, i) => (
            <g key={t} transform={`translate(${560 + box * 640} ${220 + i * 70})`} opacity={fade(f, s(1)) * (1 - fade(f, s(1) + 44))}>
              <rect x={-70} y={-26} width={140} height={52} rx={8} fill={P.hq} />
              <T x={0} y={0} size={28} color="#FFFFFF">
                {t}
              </T>
            </g>
          ))}
          {f > s(2) && f < s(3) + 10 &&
            [0, 1, 2].map((i) => {
              const t = (coinT + i / 3) % 1;
              return <Coin10 key={i} x={1340 - t * 760} y={400 - Math.sin(t * Math.PI) * 120} r={26} />;
            })}
          <g opacity={fade(f, s(2))}>
            <T x={960} y={540} size={48} color={P.hq}>
              チャージ
            </T>
            <path d="M 1300 500 L 640 500" stroke={P.hq} strokeWidth={6} markerEnd="url(#ar10)" opacity={0.6} />
          </g>
        </Cam>
        <defs>
          <marker id="ar10" markerWidth={10} markerHeight={10} refX={6} refY={5} orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill={P.hq} />
          </marker>
        </defs>
        <g opacity={fade(f, s(3)) * (1 - fade(f, s(5) - 6))}>
          <rect x={460} y={600} width={1000} height={200} rx={20} fill="#FFFFFF" stroke="#C9D1DB" strokeWidth={4} />
          <T x={720} y={650} size={26} color={K.inkSoft}>
            土地・建物はオーナー
          </T>
          <T x={720} y={730} size={80} color={P.hq}>
            45%
          </T>
          <g opacity={fade(f, s(4))}>
            <T x={1200} y={650} size={26} color={K.inkSoft}>
              本部が用意
            </T>
            <T x={1200} y={730} size={80} color={P.hq}>
              56〜76%
            </T>
          </g>
        </g>
        <g opacity={fade(f, s(5))} transform="translate(960 700)">
          <rect x={-150} y={-60} width={300} height={120} rx={10} fill="#FFFFFF" stroke={P.store} strokeWidth={5} />
          <T x={0} y={-20} size={26} color={K.inkSoft}>
            推奨価格
          </T>
          <T x={0} y={26} size={52} color={K.ink}>
            ¥ ―
          </T>
          <rect x={120} y={-20} width={70} height={110} rx={30} fill="#E7C8A8" opacity={fade(f, s(5) + 20)} />
        </g>
      </Stage>
      <EvidenceMark no="#03" source="セブン-イレブン 加盟店募集（契約タイプ）" at={s(3)} />
    </>
  );
}, { bg: "white" });

/* CUT 012 — [MONEY FLOW / LEVEL 3] E13: 計算式。捨てた原価のブロックは式の外へ押し出され「店の経費」へ → 85% / 15% に割れる */
const E13 = mk(({ f, s }) => {
  const push = ease(f, s(2), s(2) + 30);
  const split = ease(f, s(4), s(4) + 30);
  const blk = (x: number, w: number, t: string, c: string, o = 1) => (
    <g opacity={o}>
      <rect x={x} y={-50} width={w} height={100} rx={12} fill={c} />
      <T x={x + w / 2} y={0} size={34} color="#FFFFFF">
        {t}
      </T>
    </g>
  );
  return (
    <>
      <Stage>
        <g transform="translate(0 380)" opacity={fade(f, s(0))}>
          {blk(160, 260, "売上", "#5E6B7D")}
          <T x={460} y={0} size={60}>
            −
          </T>
          {blk(500, 360, "売れた分の原価", "#8A94A3")}
          <T x={900} y={0} size={60}>
            =
          </T>
          {blk(940, 220, "利益", P.green)}
          <g opacity={fade(f, s(1))}>
            <T x={1210} y={0} size={60}>
              ×
            </T>
            {blk(1250, 160, "率", P.hq)}
            <T x={1450} y={0} size={60}>
              →
            </T>
            {blk(1500, 240, "本部", P.hq)}
          </g>
        </g>
        <g transform={`translate(${680 + push * 610} ${560 + push * 190})`} opacity={fade(f, s(2))}>
          {split < 0.05 ? (
            <g>
              <rect x={-180} y={-50} width={360} height={100} rx={12} fill={P.waste} />
              <T x={0} y={0} size={32} color="#FFFFFF">
                捨てた分の仕入れ値
              </T>
            </g>
          ) : (
            <g>
              <rect x={-180 - split * 20} y={-50} width={306} height={100} rx={12} fill={P.store} />
              <T x={-27 - split * 20} y={0} size={40} color="#FFFFFF">
                店 85%
              </T>
              <rect x={126 + split * 20} y={-50} width={54} height={100} rx={12} fill={P.hq} />
              <T x={153 + split * 20} y={90} size={30} color={P.hq}>
                本部 15%
              </T>
            </g>
          )}
        </g>
        <g opacity={fade(f, s(2) + 30)}>
          <rect x={1060} y={680} width={460} height={140} rx={16} fill="none" stroke={P.store} strokeWidth={5} strokeDasharray="14 10" />
          <T x={1290} y={650} size={40} color={P.store}>
            店の経費
          </T>
        </g>
        <g opacity={fade(f, s(3))}>
          <T x={960} y={190} size={64} serif>
            コンビニ会計
          </T>
        </g>
      </Stage>
      <EvidenceMark no="#04" source="公正取引委員会 排除措置命令（2009年）以降の負担割合" at={s(4)} />
    </>
  );
}, { bg: "white" });

/* CUT 013 — [EVIDENCE / LEVEL 2] E13B: 判決文カード。「売上商品原価」に下線 → 売れた商品の原価 / 捨てた原価は含まない → 2007 の印 */
const E13B = mk(({ f, s }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1 }, { at: s(1), s: 1.15, x: 960, y: 500 }, { at: s(3), s: 1, x: 960, y: 540 }]}>
        <Doc x={960} y={560} w={900} h={720} title="判決（最高裁判所）" o={fade(f, s(0))}>
          <g opacity={fade(f, s(1))}>
            <rect x={-360} y={-140} width={720} height={90} rx={10} fill="#FFF1C2" />
            <T x={0} y={-95} size={52} serif>
              「売上商品原価」
            </T>
            <line x1={-250} x2={-250 + 500 * ease(f, s(1) + 10, s(1) + 40)} y1={-40} y2={-40} stroke={P.red} strokeWidth={6} />
            <T x={0} y={20} size={40} color={P.green}>
              ＝ 売れた商品の原価
            </T>
          </g>
          <g opacity={fade(f, s(2))}>
            <T x={0} y={110} size={40} color={P.waste}>
              捨てた商品の原価
            </T>
            <line x1={-200} y1={110} x2={200} y2={110} stroke={P.red} strokeWidth={6} />
            <T x={0} y={170} size={30} color={P.red}>
              含まれない
            </T>
          </g>
        </Doc>
        <StampMark x={1330} y={300} text="2007" o={fade(f, s(1), 4)} s={pop(f, s(1))} />
      </Cam>
    </Stage>
    <Sfx at={s(1)} name="stamp" volume={0.55} />
  </>
), { bg: "white" });

export const OPEN10 = { E01, E02, E03, E04, E05, E06, E07, E08, E09, E10, E11, E12, E13, E13B };
export { Person8, Onigiri, CalcNote, Plates };
