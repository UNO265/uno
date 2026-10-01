/** CUT 014–031（E14–E30B）。計算（106円 vs 6円）→ 棚を空けるな → 12個の計算 → 2009 命令 → 2020 調査 → 買う側 → なぜ今 → 本部が払い始める → 各社の工夫 → リサイクル */
import React from "react";
import { EvidenceMark, Stage, count, mk } from "../case002/ui";
import { Cam, Person8 } from "../case008/kit2";
import {
  Bento,
  CalcNote,
  Clock,
  Coin10,
  Doc,
  Easing,
  FONT,
  HBar,
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
} from "./kit";

/* 計算用の一段の棚。state: "shelf" | "sold" | "waste" | "disc"（値引きして売れた） */
type St = "shelf" | "sold" | "waste" | "disc";
const Row: React.FC<{ f: number; n: number; states: (i: number) => { st: St; at: number }; y?: number; label?: boolean; bagX?: number }> = ({ f, n, states, y = 240, label = true, bagX = 1640 }) => {
  const w = Math.min(130, 1300 / n);
  const x0 = 960 - ((n - 1) * w) / 2 - 120;
  return (
    <g>
      <rect x={x0 - 80} y={y + 50} width={n * w + 80} height={20} rx={4} fill="#C9D1DB" />
      {label && (
        <g>
          <T x={x0 - 40} y={y + 110} size={26} color="#9FB3C8" anchor="start">
            仕入れ 80円 → 売値 100円
          </T>
        </g>
      )}
      <TrashBag x={bagX} y={y + 10} s={0.75} fill={0} />
      {Array.from({ length: n }, (_, i) => {
        const { st, at } = states(i);
        const p = ease(f, at, at + 22, 0, 1, Easing.inOut(Easing.cubic));
        const x = x0 + i * w;
        if (st === "sold" || st === "disc") {
          return (
            <g key={i}>
              {st === "disc" && <Sticker x={x + 26} y={y - 34 - p * 120} text="50円" s={0.55} o={1 - p} />}
              <Onigiri x={x} y={y - p * 120} s={0.9} o={1 - p} />
            </g>
          );
        }
        if (st === "waste") return <Onigiri key={i} x={x + (bagX - x) * p} y={y + p * 20} s={0.9 - p * 0.4} gray={p > 0.4} />;
        return <Onigiri key={i} x={x} y={y} s={0.9} />;
      })}
    </g>
  );
};

/* CUT 014 — [SIMULATION / LEVEL 3] E14: おにぎり 10 個 → 8 個売れて 2 個が袋へ → 本部 56 / 店 −56 */
const E14 = mk(({ f, s }) => {
  const states = (i: number) => (i < 8 ? { st: "sold" as St, at: s(2) + i * 4 } : { st: (f > s(4) ? "waste" : "shelf") as St, at: s(4) });
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <Row f={f} n={10} states={states} />
        </g>
        <Plates hq={f > s(4) + 10 ? 56 : null} store={f > s(5) ? -56 : null} y={600} s={0.8} o={fade(f, s(3))} />
        <g opacity={fade(f, s(3)) * (1 - fade(f, s(4)))}>
          <T x={960} y={440} size={34} color="#9FB3C8">
            利益を半分ずつ（※イメージ）
          </T>
        </g>
      </Stage>
      <CalcNote at={s(1)} />
      <Sfx at={s(4)} name="thud" volume={0.4} />
    </>
  );
}, { bg: "night" });

/* CUT 015 — [SIMULATION / LEVEL 4 HERO] E15: 残り 2 個に 50円シール → 売れる → 本部 50 / 店 +50 → 差の棒：店 +106（長い） vs 本部 −6（短い） */
const E15 = mk(({ f, s }) => {
  const states = (i: number) => (i < 8 ? { st: "sold" as St, at: -100 } : { st: "disc" as St, at: s(0) + 40 });
  const bars = ease(f, s(3), s(3) + 30);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1 }, { at: s(3), s: 1 }, { at: s(3) + 30, s: 1.08, y: 600 }]}>
          <g opacity={1 - fade(f, s(3))}>
            <Row f={f} n={10} states={states} />
            <Plates hq={f > s(1) ? 50 : 56} store={f > s(2) ? 50 : -56} y={600} s={0.8} />
          </g>
          <g opacity={fade(f, s(3))}>
            <T x={960} y={240} size={40} color="#9FB3C8">
              捨てる → 値引きして売り切る
            </T>
            <rect x={460} y={380} width={1000 * bars} height={110} rx={14} fill={P.store} />
            <T x={440} y={435} size={44} color={P.store} anchor="end">
              店
            </T>
            <text x={480 + 1000 * bars} y={435} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={88} fill="#FFFFFF" opacity={bars > 0.9 ? 1 : 0} textAnchor="end">
              +106円
            </text>
            <rect x={460} y={600} width={60 * bars} height={110} rx={14} fill={P.hq} />
            <T x={440} y={655} size={44} color={P.hq} anchor="end">
              本部
            </T>
            <T x={560} y={655} size={72} color={P.hq} anchor="start" o={bars > 0.9 ? 1 : 0}>
              −6円
            </T>
          </g>
        </Cam>
      </Stage>
      <CalcNote at={0} />
      <Sfx at={s(0) + 40} name="pop" volume={0.4} />
      <Sfx at={s(3) + 30} name="ding" volume={0.45} />
    </>
  );
}, { bg: "night" });

/* CUT 016 — [QUESTION / LEVEL 2] E16: 暗い中に小さな 6円の硬貨がひとつ */
const E16 = mk(({ f, s }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1 }, { at: s(1) + 30, s: 1.6 }]}>
        <Coin10 x={960} y={520} r={60 * pop(f, 4)} label="6円" color={P.hq} />
      </Cam>
    </Stage>
    <Sfx at={s(1)} name="question" volume={0.45} />
  </>
), { bg: "black" });

/* CUT 017 — [STORY / LEVEL 2] E17: 空の棚の前で客が引き返す → いっぱいの棚の前で手に取る → バーコードと商品ごとの販売棒（単品管理） */
const E17 = mk(({ f, s }) => {
  const full = fade(f, s(2), 20);
  const walk = ease(f, s(1), s(1) + 50);
  return (
    <>
      <Stage>
        <g opacity={1 - fade(f, s(4))}>
          <NightShelf n={full > 0.5 ? 12 : 2} window={false} />
          <Person8 x={full > 0.5 ? 960 : 960 + walk * 700} y={900} s={2.2} color="#C9D6E6" o={full > 0.5 ? fade(f, s(3)) : 1 - walk * 0.8} bag={full > 0.5 && f > s(3) + 20} />
        </g>
        <g opacity={fade(f, s(4))}>
          <rect width={1920} height={1080} fill={P.night} />
          <g transform="translate(560 520)">
            <rect x={-200} y={-140} width={400} height={280} rx={16} fill="#FFFFFF" />
            {Array.from({ length: 22 }, (_, i) => (
              <rect key={i} x={-170 + i * 15} y={-90} width={i % 3 ? 6 : 10} height={150} fill="#1E2230" />
            ))}
            <line x1={-200} x2={200} y1={-20 + 60 * Math.sin(f / 6)} y2={-20 + 60 * Math.sin(f / 6)} stroke={P.red} strokeWidth={4} />
          </g>
          {[0.9, 0.5, 0.75, 0.3, 0.6].map((v, i) => (
            <g key={i}>
              <rect x={960 + i * 150} y={760 - 400 * v * ease(f, s(4) + i * 5, s(4) + 30 + i * 5)} width={100} height={400 * v * ease(f, s(4) + i * 5, s(4) + 30 + i * 5)} rx={8} fill={i === 0 ? P.store : "#5E6B7D"} />
              <Onigiri x={1010 + i * 150} y={820} s={0.6} />
            </g>
          ))}
          <T x={1260} y={920} size={36} color="#C9D6E6">
            単品管理
          </T>
        </g>
      </Stage>
    </>
  );
}, { bg: "night" });

/* CUT 018 — [SIMULATION / LEVEL 3] E18: 12 個 → 9 個売れて 3 個が袋へ → 本部 54（10個のとき 56 とほぼ同じ）/ 店 −114 で皿が大きく傾く */
const E18 = mk(({ f, s }) => {
  const states = (i: number) => (i < 9 ? { st: "sold" as St, at: s(1) + 30 + i * 4 } : { st: (f > s(1) + 80 ? "waste" : "shelf") as St, at: s(1) + 80 });
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <Row f={f} n={12} states={states} />
        </g>
        <Plates hq={f > s(2) ? 54 : null} store={f > s(3) ? -114 : null} y={600} s={0.8} o={fade(f, s(2))} />
        <g opacity={fade(f, s(2) + 20)}>
          <T x={500} y={460} size={28} color="#9FB3C8">
            （10個のとき 56円）
          </T>
        </g>
      </Stage>
      <CalcNote at={0} />
      <Sfx at={s(3)} name="thud" volume={0.5} />
    </>
  );
}, { bg: "night" });

/* CUT 019 — [EVIDENCE / LEVEL 2] E19: 2009 年の命令書カード → 青い 15% のかけらが灰色の原価ブロックにつく */
const E19 = mk(({ f, s }) => {
  const stick = ease(f, s(2), s(2) + 30);
  return (
    <>
      <Stage>
        <Cam keys={[{ at: 0, s: 1.1, x: 760 }, { at: s(1), s: 1.1, x: 760 }, { at: s(2), s: 1 }]}>
          <Doc x={700} y={540} w={720} h={760} title="排除措置命令" o={fade(f, s(0))}>
            <T x={0} y={-120} size={34} color={K.inkSoft}>
              公正取引委員会 → セブン-イレブン・ジャパン
            </T>
            <T x={0} y={-30} size={44}>
              値引き販売の制限
            </T>
            <line x1={-200} x2={200} y1={-30} y2={-30} stroke={P.red} strokeWidth={6} opacity={fade(f, s(1) + 40)} />
          </Doc>
          <StampMark x={1000} y={260} text="2009" o={fade(f, s(1) + 20, 4)} s={pop(f, s(1) + 20)} />
          <g transform="translate(1440 540)" opacity={fade(f, s(2))}>
            <rect x={-200} y={-60} width={400} height={120} rx={12} fill={P.waste} />
            <T x={0} y={0} size={32} color="#FFFFFF">
              捨てた分の仕入れ値
            </T>
            <g transform={`translate(${200 - 60 + (1 - stick) * 160} ${-(1 - stick) * 160})`}>
              <rect x={0} y={-60} width={60} height={120} rx={12} fill={P.hq} />
            </g>
            <T x={170} y={110} size={40} color={P.hq} o={stick}>
              本部 15%
            </T>
          </g>
        </Cam>
      </Stage>
      <Sfx at={s(1) + 20} name="stamp" volume={0.55} />
    </>
  );
}, { bg: "white" });

/* CUT 020 — [QUESTION / LEVEL 1] E20: カレンダー 2009 → 2020 */
const E20 = mk(({ f }) => {
  const y = Math.round(ease(f, 6, 60, 2009, 2020));
  return (
    <Stage>
      <g transform="translate(960 480)">
        <rect x={-260} y={-220} width={520} height={440} rx={20} fill="#FFFFFF" />
        <rect x={-260} y={-220} width={520} height={100} rx={20} fill={P.red} />
        <text y={40} textAnchor="middle" dominantBaseline="central" fontFamily={MONO} fontWeight={700} fontSize={150} fill={K.ink}>
          {y}
        </text>
      </g>
    </Stage>
  );
}, { bg: "black" });

/* CUT 021 — [EVIDENCE / LEVEL 3] E21: 調査票 5万7,524店 → 円グラフ 70%（値引きしていない）→ 書類の山・「更新」✕ の印（発言は文字にしない） */
const E21 = mk(({ f, s }) => {
  const pie = ease(f, s(2), s(2) + 40) * 0.7;
  const a = pie * Math.PI * 2;
  const r = 220;
  const arc = `M 0 0 L 0 ${-r} A ${r} ${r} 0 ${pie > 0.5 ? 1 : 0} 1 ${r * Math.sin(a)} ${-r * Math.cos(a)} Z`;
  return (
    <>
      <Stage>
        <Doc x={420} y={520} w={480} h={620} title="実態調査" o={fade(f, s(0))}>
          <T x={0} y={-100} size={30} color={K.inkSoft}>
            大手コンビニの加盟店
          </T>
          <T x={0} y={0} size={72} o={fade(f, s(1))}>
            5万7,524<tspan fontSize={36}>店</tspan>
          </T>
        </Doc>
        <g transform="translate(1100 480)" opacity={fade(f, s(2))}>
          <circle r={r} fill="#E8EBF0" />
          <path d={arc} fill={P.waste} />
          <T x={0} y={-10} size={110} color={K.ink}>
            {Math.round(pie * 100)}%
          </T>
          <T x={0} y={290} size={34} color={K.ink}>
            値引き販売をしていない
          </T>
        </g>
        <g opacity={fade(f, s(3))} transform="translate(1600 330)">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={-90 + i * 6} y={-i * 22} width={180} height={120} rx={6} fill="#FFFFFF" stroke="#C9D1DB" strokeWidth={3} />
          ))}
        </g>
        <g opacity={fade(f, s(4))} transform="translate(1600 700)">
          <Doc x={0} y={0} w={200} h={240} title="契約" s={1} />
          <StampMark x={0} y={20} text="更新 ✕" s={0.8 * pop(f, s(4) + 10)} />
        </g>
      </Stage>
      <EvidenceMark no="#05" source="公正取引委員会 実態調査（2020年）" at={s(0)} />
      <Sfx at={s(4) + 10} name="stamp" volume={0.45} />
    </>
  );
}, { bg: "white" });

/* CUT 022 — [GRAPH / LEVEL 3] E22: 1店のごみ袋の山（468万円）→ 引いて全国の山 約2,692億円 → 1日 約1万3,000円 → 給与袋 478万円とほぼ同じ高さ */
const E22 = mk(({ f, s }) => {
  const sal = fade(f, s(4));
  return (
    <>
      <Stage>
        <rect width={1920} height={1080} fill={P.night} />
        <Cam keys={[{ at: 0, s: 1.4, x: 700, y: 600 }, { at: s(1), s: 1.4, x: 700, y: 600 }, { at: s(1) + 50, s: 1, x: 960, y: 540 }]}>
          {Array.from({ length: f > s(1) ? 40 : 6 }, (_, i) => (
            <TrashBag key={i} x={260 + (i % 10) * 95 + (Math.floor(i / 10) % 2) * 45} y={640 - Math.floor(i / 10) * 70} s={0.5} o={i < 6 ? 1 : fade(f, s(1) + (i - 6))} />
          ))}
        </Cam>
        <g opacity={1 - fade(f, s(1))}>
          <T x={1460} y={320} size={110} color="#FFFFFF">
            468<tspan fontSize={50}>万円</tspan>
          </T>
          <T x={1460} y={400} size={28} color="#C9D6E6">
            1店・1年（中央値）
          </T>
        </g>
        <g opacity={fade(f, s(1)) * (1 - fade(f, s(3)))}>
          <T x={1460} y={320} size={96} color="#FFFFFF">
            約2,692<tspan fontSize={46}>億円</tspan>
          </T>
          <T x={1460} y={400} size={28} color="#C9D6E6">
            大手コンビニ全体（計算）
          </T>
          <T x={1460} y={460} size={26} color="#9FB3C8" o={fade(f, s(2))}>
            真ん中の店の数字 ≠ 平均
          </T>
        </g>
        <g opacity={fade(f, s(3)) * (1 - sal * 0.6)}>
          <T x={1460} y={320} size={96} color="#FFFFFF">
            約1万3,000<tspan fontSize={46}>円</tspan>
          </T>
          <T x={1460} y={400} size={28} color="#C9D6E6">
            毎日（468万円 ÷ 365・計算）
          </T>
        </g>
        <g opacity={sal}>
          <rect x={1300} y={500} width={150} height={300} rx={10} fill={P.waste} />
          <T x={1375} y={840} size={28} color="#C9D6E6">
            468万円
          </T>
          <rect x={1520} y={493} width={150} height={307} rx={10} fill="#E9C46A" />
          <T x={1595} y={840} size={28} color="#C9D6E6">
            478万円
          </T>
          <T x={1595} y={880} size={22} color="#9FB3C8">
            平均給与（2024年分）
          </T>
        </g>
      </Stage>
      <EvidenceMark no="#05" source="公正取引委員会 実態調査（2020年）・国税庁 民間給与実態統計（2024年分）" at={0} dark />
    </>
  );
}, { bg: "night" });

/* CUT 023 — [STORY / LEVEL 2] E23: レシート 737.9円 + 12 年の階段 / 入口の客が少し減る（−0.5%）/ 値引きの棚の前、10 人中 3 人が手に取り、1 人は立ち止まる */
const E23 = mk(({ f, s }) => {
  const v = count(f, s(2), 40, 597, 737.9);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1)) * (1 - fade(f, s(5)))}>
          <g transform="translate(520 480)">
            <rect x={-220} y={-300} width={440} height={600} fill="#FFFFFF" />
            <T x={0} y={-240} size={30} color="#6B7280">
              RECEIPT
            </T>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={-170} y={-170 + i * 50} width={340} height={14} rx={7} fill="#E3DDD0" />
            ))}
            <line x1={-190} x2={190} y1={60} y2={60} stroke="#9AA3AF" strokeWidth={3} strokeDasharray="8 8" />
            <T x={0} y={150} size={84} o={fade(f, s(2))}>
              {v.toFixed(1)}
              <tspan fontSize={40}>円</tspan>
            </T>
            <T x={0} y={230} size={22} color="#6B7280" o={fade(f, s(2))}>
              客1人・1回（2025年）
            </T>
          </g>
          <g opacity={fade(f, s(3))}>
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x={900 + i * 70} y={620 - (i + 1) * 28 * ease(f, s(3) + i * 2, s(3) + 20 + i * 2)} width={52} height={(i + 1) * 28 * ease(f, s(3) + i * 2, s(3) + 20 + i * 2)} rx={4} fill={P.store} />
            ))}
            <T x={1320} y={670} size={34}>
              12年連続 ↑
            </T>
          </g>
          <g opacity={fade(f, s(4))}>
            {Array.from({ length: 10 }, (_, i) => (
              <circle key={i} cx={940 + i * 76} cy={800} r={20} fill={i === 9 ? "#D5DAE1" : "#5E6B7D"} opacity={i === 9 ? 1 - ease(f, s(4) + 10, s(4) + 40) * 0.7 : 1} />
            ))}
            <T x={1700} y={800} size={40} color={P.red} anchor="start">
              −0.5%
            </T>
          </g>
        </g>
        <g opacity={fade(f, s(5))}>
          <NightShelf n={6} window={false} stickers={[0, 1, 2, 3, 4, 5].map((i) => ({ i, text: "値引", o: 1 }))} />
          {Array.from({ length: 10 }, (_, i) => {
            const pick = i < 3;
            const hesitate = i === 3 && f > s(7);
            return (
              <Person8 key={i} x={260 + i * 155} y={880 - (pick ? ease(f, s(6) + i * 8, s(6) + 30 + i * 8) * 40 : 0)} s={1.1} color={pick ? P.store : hesitate ? "#F5C431" : "#5E6B7D"} bag={pick && f > s(6) + 40} />
            );
          })}
          <T x={960} y={160} size={40} color="#FFFFFF" o={fade(f, s(6))}>
            積極的に選ぶ人 3割（調査）
          </T>
        </g>
      </Stage>
      <EvidenceMark no="#06" source="日本フランチャイズチェーン協会（2025年）" at={s(2)} dark={f > s(5)} />
    </>
  );
}, { bg: "white" });

/* CUT 024 — [QUESTION / LEVEL 2] E24: ほこりをかぶった契約書が揺れて、ほこりが落ちる */
const E24 = mk(({ f, s }) => (
  <>
    <Stage>
      <Cam keys={[{ at: 0, s: 1 }, { at: s(1) + 30, s: 1.25 }]}>
        <Doc x={960 + Math.sin(f / 2) * (f > s(1) ? 6 : 0)} y={540} w={560} h={700} title="加盟店契約" dust={1 - ease(f, s(1), s(1) + 40)} />
        {f > s(1) &&
          Array.from({ length: 14 }, (_, i) => (
            <circle key={i} cx={700 + i * 40} cy={220 + ((f - s(1)) * (3 + (i % 4))) % 700} r={4} fill="#B8A88A" opacity={0.6} />
          ))}
        <T x={960} y={120} size={44} color="#D8D2C6" o={fade(f, s(0))}>
          50年
        </T>
      </Cam>
    </Stage>
    <Sfx at={s(1)} name="question" volume={0.45} />
  </>
), { bg: "black" });

/* CUT 025 — [INFOGRAPHIC / LEVEL 2] E25: 店の点は増えても 1 店の売上の線は横ばい → 人件費の矢印が加盟店の利益を押しつぶす → 米袋の値段 ↑、おにぎり 1 個が重くなる */
const E25 = mk(({ f, s }) => {
  const press = ease(f, s(2), s(2) + 40);
  const rice = ease(f, s(3), s(3) + 40);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(1)) * (1 - fade(f, s(3)))}>
          {Array.from({ length: 30 }, (_, i) => (
            <circle key={i} cx={220 + (i % 10) * 60} cy={520 - Math.floor(i / 10) * 60} r={18} fill={P.store} opacity={fade(f, s(1) + i * 2)} />
          ))}
          <T x={490} y={620} size={30} color={K.inkSoft}>
            店の数 ↑
          </T>
          <path d="M 1000 400 L 1700 400" stroke={P.green} strokeWidth={10} strokeDasharray={`${700 * ease(f, s(1), s(1) + 40)} 700`} />
          <T x={1350} y={350} size={30} color={K.inkSoft}>
            1店の売上 → 横ばい
          </T>
          <g opacity={fade(f, s(2))}>
            <rect x={1050} y={560 + press * 60} width={600} height={200 - press * 60} rx={12} fill={P.store} opacity={0.85} />
            <T x={1350} y={660 + press * 30} size={34} color="#FFFFFF">
              加盟店の利益
            </T>
            <path d={`M 1350 ${440 + press * 60} L 1350 ${540 + press * 60}`} stroke={P.red} strokeWidth={22} />
            <path d={`M 1310 ${520 + press * 60} L 1350 ${570 + press * 60} L 1390 ${520 + press * 60} Z`} fill={P.red} />
            <T x={1500} y={480 + press * 60} size={30} color={P.red} anchor="start">
              人件費 ↑
            </T>
          </g>
        </g>
        <g opacity={fade(f, s(3))}>
          <g transform="translate(560 560)">
            <rect x={-130} y={-170} width={260} height={340} rx={30} fill="#F4EEE3" stroke="#B8A88A" strokeWidth={5} />
            <T x={0} y={-40} size={70} serif>
              米
            </T>
            <T x={0} y={80} size={44} color={P.red} o={rice}>
              ¥ ↑
            </T>
          </g>
          <g transform={`translate(1300 560) rotate(${-rice * 10})`}>
            <line x1={-300} x2={300} y1={0} y2={0} stroke="#5E6B7D" strokeWidth={10} />
            <Onigiri x={-200} y={-60} s={1.2 + rice * 0.5} />
            <rect x={160} y={-70} width={80} height={70} rx={6} fill="#C9D1DB" />
          </g>
          <path d="M 1300 560 L 1260 700 L 1340 700 Z" fill="#5E6B7D" />
        </g>
      </Stage>
      <EvidenceMark no="#07" source="経済産業省「新たなコンビニのあり方検討会」報告書（2020年）" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 026 — [GRAPH / LEVEL 2] E26: 食品ロスの棒 2000 → 2023 231万t（−58%）、目標 −60% の点線 / 464万t・1人 年37kg の箱 */
const E26 = mk(({ f, s }) => {
  const g = ease(f, s(1), s(1) + 40);
  const base = 430;
  const h2000 = 520;
  const h2023 = h2000 * 0.42;
  return (
    <>
      <Stage>
        <g transform="translate(0 0)" opacity={fade(f, s(0))}>
          <line x1={300} x2={1300} y1={base + 300} y2={base + 300} stroke="#9FB3C8" strokeWidth={4} />
          <rect x={420} y={base + 300 - h2000} width={220} height={h2000} rx={10} fill="#C9D1DB" />
          <T x={530} y={base + 350} size={34}>
            2000年度
          </T>
          <rect x={860} y={base + 300 - h2023 * g} width={220} height={h2023 * g} rx={10} fill={P.waste} />
          <T x={970} y={base + 350} size={34}>
            2023年度
          </T>
          <T x={970} y={base + 260 - h2023} size={60} color={K.ink} o={fade(f, s(1) + 30)}>
            231万t
          </T>
          <T x={760} y={base - 120} size={52} color={P.green} o={fade(f, s(2))}>
            −58%
          </T>
          <g opacity={fade(f, s(3))}>
            <line x1={820} x2={1200} y1={base + 300 - h2000 * 0.4} y2={base + 300 - h2000 * 0.4} stroke={P.red} strokeWidth={5} strokeDasharray="14 10" />
            <T x={1220} y={base + 300 - h2000 * 0.4} size={34} color={P.red} anchor="start">
              目標 −60%（2030年度）
            </T>
          </g>
        </g>
        <g opacity={fade(f, s(4))} transform="translate(1560 300)">
          <rect x={-200} y={-120} width={400} height={240} rx={18} fill="#FFFFFF" stroke="#C9D1DB" strokeWidth={4} />
          <T x={0} y={-50} size={30} color={K.inkSoft}>
            家庭も合わせて
          </T>
          <T x={0} y={20} size={66}>
            464万t
          </T>
          <T x={0} y={84} size={30} color={K.inkSoft}>
            1人 年37kg
          </T>
        </g>
      </Stage>
      <EvidenceMark no="#08" source="農林水産省・環境省・消費者庁（2023年度推計）" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 027 — [MONEY FLOW / LEVEL 3] E27: 本部の青い硬貨が初めて「期限の近い商品」の側へ流れる。2019 ポイント5% → 2024.5 緑のシール */
const E27 = mk(({ f, s }) => {
  const flow = (at: number) => (f < at ? -1 : ((f - at) % 50) / 50);
  return (
    <>
      <Stage>
        <g opacity={fade(f, s(0))}>
          <rect x={160} y={240} width={300} height={240} rx={16} fill={P.hq} />
          <T x={310} y={360} size={52} color="#FFFFFF">
            本部
          </T>
          <g transform="translate(1500 360)">
            <rect x={-220} y={-120} width={440} height={240} rx={16} fill="#F4F6F8" stroke="#C9D1DB" strokeWidth={4} />
            <Onigiri x={-100} y={0} s={1} />
            <Bento x={80} y={10} s={1} />
            <T x={0} y={160} size={30} color={K.inkSoft}>
              期限の近い商品
            </T>
          </g>
          {[0, 1, 2, 3].map((i) => {
            const t = (flow(s(0) + 10) + i / 4) % 1;
            if (f < s(0) + 10) return null;
            return <Coin10 key={i} x={480 + t * 780} y={360 - Math.sin(t * Math.PI) * 80} r={24} color={P.hq} />;
          })}
        </g>
        <g transform="translate(0 660)">
          <line x1={240} x2={1680} y1={0} y2={0} stroke="#9FB3C8" strokeWidth={6} />
          <g opacity={fade(f, s(1))}>
            <circle cx={500} cy={0} r={16} fill={P.hq} />
            <T x={500} y={-60} size={40}>
              2019
            </T>
            <T x={500} y={70} size={30} color={P.hq}>
              ポイント 5%（本部負担）
            </T>
          </g>
          <g opacity={fade(f, s(3))}>
            <T x={900} y={70} size={26} color={K.inkSoft}>
              （別チェーンも 約450店で実験）
            </T>
          </g>
          <g opacity={fade(f, s(4))}>
            <circle cx={1400} cy={0} r={16} fill={P.green} />
            <T x={1400} y={-60} size={40}>
              2024.5
            </T>
            <Sticker x={1560} y={-60} text="値引" s={pop(f, s(4) + 10)} color={P.green} />
          </g>
        </g>
      </Stage>
      <EvidenceMark no="#09" source="日本経済新聞（2019年）・各社発表" at={s(1)} />
    </>
  );
}, { bg: "white" });

/* CUT 028 — [REAL(再現) / LEVEL 3] E28: 夜の棚（001 と同じアングル）。期限 −2:00、緑のシールが貼られる → 袋が 1 割小さく → 本部 4万円 / 表彰メダル（文字） */
const E28 = mk(({ f, s }) => {
  const st = [0, 1, 2, 3, 4, 5].map((i) => ({ i, text: ["20円", "30円", "50円", "100円", "30円", "50円"][i], o: ease(f, 20 + i * 10, 34 + i * 10), color: P.green }));
  return (
    <>
      <Stage>
        <g opacity={1 - fade(f, s(1))}>
          <NightShelf n={12} bento={6} stickers={st} />
          <Clock x={1700} y={110} text="−2:00" s={0.8} color={P.green} />
        </g>
        <g opacity={fade(f, s(1)) * (1 - fade(f, s(3) + 40))}>
          <rect width={1920} height={1080} fill={P.night} />
          <TrashBag x={640} y={560} s={1.6} />
          <TrashBag x={1280} y={580} s={1.6 * (1 - 0.1 * ease(f, s(1) + 20, s(1) + 60))} />
          <T x={640} y={820} size={34} color="#C9D6E6">
            実験前
          </T>
          <T x={1280} y={820} size={34} color="#C9D6E6">
            約200店・1年
          </T>
          <T x={960} y={240} size={80} color={P.green}>
            −1割
          </T>
          <T x={960} y={320} size={26} color="#9FB3C8">
            （報道）
          </T>
          <g opacity={fade(f, s(2))}>
            <Coin10 x={1560} y={260} r={56} label="4万" color={P.hq} />
            <T x={1560} y={350} size={28} color="#C9D6E6">
              1店あたり最大（2か月）
            </T>
          </g>
        </g>
        <g opacity={fade(f, s(3) + 40)}>
          <rect width={1920} height={1080} fill={P.night} />
          <circle cx={960} cy={360} r={150} fill="#E9C46A" stroke="#B8902A" strokeWidth={10} />
          <path d="M 880 500 L 840 680 L 960 620 L 1080 680 L 1040 500 Z" fill={P.red} />
          <T x={960} y={360} size={40} color="#7A5A10">
            2024年度
          </T>
          <T x={960} y={770} size={44} color="#FFFFFF">
            消費者庁長官賞
          </T>
        </g>
      </Stage>
      <EvidenceMark no="#10" source="セブン-イレブン 発表・日経（2024年）" at={s(1)} dark />
      {st.map((x, i) => (
        <Sfx key={i} at={20 + i * 10} name="pop" volume={0.25} />
      ))}
    </>
  );
}, { bg: "night" });

/* CUT 029 — [REAL(再現) / LEVEL 2] E29: バーコードのシール → 28.9% の棒 → 涙目のおにぎりシール（自前の絵）→ 1日 +5個 → 廃棄 −5%・3,000t → シールがほかの店・自治体へ広がる */
const E29 = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={1 - fade(f, s(2))}>
        <g transform="translate(560 480)" opacity={fade(f, s(0))}>
          <rect x={-170} y={-110} width={340} height={220} rx={16} fill={P.sticker} />
          {Array.from({ length: 18 }, (_, i) => (
            <rect key={i} x={-130 + i * 14} y={-60} width={i % 3 ? 5 : 9} height={100} fill="#1E2230" />
          ))}
          <T x={0} y={70} size={28} color="#5A3E00">
            値引
          </T>
        </g>
        <g opacity={fade(f, s(1))}>
          <HBar x={1000} y={360} w={700} v={(17.5 / 35) * ease(f, s(1), s(1) + 20)} color="#9FB3C8" label="2020年度" value="17.5%" />
          <HBar x={1000} y={520} w={700} v={(28.9 / 35) * ease(f, s(1) + 20, s(1) + 40)} color={P.green} label="2023年度" value="28.9%" />
          <T x={1350} y={680} size={26} color={K.inkSoft}>
            食品ロス削減率（2018年度比）
          </T>
        </g>
      </g>
      <g opacity={fade(f, s(2)) * (1 - fade(f, s(5)))}>
        <g transform={`translate(700 520) scale(${1.4 * pop(f, s(3))})`}>
          <circle r={130} fill={P.sticker} stroke="#FFFFFF" strokeWidth={8} />
          <Onigiri x={0} y={10} s={1.8} sad />
        </g>
        <T x={700} y={760} size={26} color={K.inkSoft}>
          ※イメージ（自作の絵）
        </T>
        <g opacity={fade(f, s(4))}>
          <T x={1340} y={420} size={110} color={P.green}>
            +5<tspan fontSize={50}>個</tspan>
          </T>
          <T x={1340} y={510} size={30} color={K.inkSoft}>
            1日あたり（実験）
          </T>
        </g>
      </g>
      <g opacity={fade(f, s(5)) * (1 - fade(f, s(7)))}>
        <T x={620} y={460} size={130} color={P.green}>
          −5%
        </T>
        <T x={620} y={570} size={30} color={K.inkSoft}>
          店から出る廃棄（前年比）
        </T>
        <g opacity={fade(f, s(6))}>
          <T x={1320} y={460} size={110} color={K.ink}>
            3,000<tspan fontSize={50}>t</tspan>
          </T>
          <T x={1320} y={570} size={30} color={K.inkSoft}>
            年間・全店（見込み）
          </T>
        </g>
      </g>
      <g opacity={fade(f, s(7))}>
        <g transform="translate(960 330)">
          <circle r={90} fill={P.sticker} />
          <Onigiri x={0} y={8} s={1.2} sad />
        </g>
        {[
          [480, 600, "パン屋"],
          [800, 650, "和菓子"],
          [1120, 650, "食堂"],
          [1440, 600, "区役所"],
        ].map(([x, y, t], i) => (
          <g key={i} opacity={fade(f, s(7) + 20 + i * 8)}>
            <path d={`M 960 410 L ${x} ${Number(y) - 40}`} stroke={P.sticker} strokeWidth={5} strokeDasharray="10 8" />
            <StoreFront x={Number(x)} y={Number(y) + 80} s={0.5} label="" />
            <T x={Number(x)} y={Number(y) + 130} size={28} color={K.inkSoft}>
              {t}
            </T>
          </g>
        ))}
        <T x={960} y={200} size={34} color={K.inkSoft}>
          2025.10 無料の素材に
        </T>
      </g>
    </Stage>
    <EvidenceMark no="#11" source="ファミリーマート 発表（2021〜2025年）" at={s(0)} />
  </>
), { bg: "white" });

/* CUT 030 — [INFOGRAPHIC / LEVEL 2] E30: 天気・販売データが AI チップへ → 値引き額・個数の提案 / −2.5%・+0.6% / おにぎりの時計 +6h / 2030 半分 */
const E30 = mk(({ f, s }) => (
  <>
    <Stage>
      <g opacity={fade(f, s(0)) * (1 - fade(f, s(3)))}>
        <g transform="translate(960 440)">
          <rect x={-130} y={-130} width={260} height={260} rx={24} fill={P.dark} />
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <rect x={-160} y={-100 + i * 40} width={30} height={10} fill={P.dark} />
              <rect x={130} y={-100 + i * 40} width={30} height={10} fill={P.dark} />
            </g>
          ))}
          <T x={0} y={0} size={80} color="#7FE0A8">
            AI
          </T>
        </g>
        <g opacity={fade(f, s(1))}>
          <circle cx={360} cy={300} r={60} fill="#F5C431" />
          <T x={360} y={400} size={28} color={K.inkSoft}>
            天気
          </T>
          {[0.4, 0.8, 0.6].map((v, i) => (
            <rect key={i} x={300 + i * 50} y={640 - 160 * v} width={36} height={160 * v} fill="#5E6B7D" />
          ))}
          <T x={360} y={690} size={28} color={K.inkSoft}>
            売れ方
          </T>
          <path d="M 440 300 L 800 400 M 460 580 L 800 480" stroke="#9FB3C8" strokeWidth={5} strokeDasharray={`${400 * ease(f, s(1), s(1) + 30)} 400`} />
          <path d="M 1120 440 L 1400 440" stroke={P.green} strokeWidth={6} opacity={fade(f, s(1) + 30)} />
          <g opacity={fade(f, s(1) + 40)} transform="translate(1560 440)">
            <Sticker x={0} y={-40} text="−30円" s={1.2} />
            <T x={0} y={80} size={30} color={K.inkSoft}>
              × 3個
            </T>
          </g>
        </g>
        <g opacity={fade(f, s(2))}>
          <T x={760} y={750} size={72} color={P.green}>
            −2.5%
          </T>
          <T x={760} y={820} size={26} color={K.inkSoft}>
            捨てた金額
          </T>
          <T x={1160} y={750} size={72} color={P.hq}>
            +0.6%
          </T>
          <T x={1160} y={820} size={26} color={K.inkSoft}>
            粗利
          </T>
        </g>
      </g>
      <g opacity={fade(f, s(3))}>
        <Onigiri x={640} y={520} s={2.4} />
        <Clock x={1100} y={520} text="+6h" s={1.4} dark={false} color={P.green} />
        <g opacity={fade(f, s(4))}>
          <T x={960} y={780} size={48}>
            2030年 食品ロスを 2018年の半分に
          </T>
        </g>
      </g>
    </Stage>
    <EvidenceMark no="#12" source="ローソン 発表・日経（2021〜2024年）" at={s(0)} />
  </>
), { bg: "white" });

/* CUT 031 — [STORY / LEVEL 1] E30B: ごみ袋 → トラック → 豚・畑のアイコン、70% のゲージ / それでも「売れる」矢印のほうが太い */
const E30B = mk(({ f, s }) => {
  const t = ease(f, s(0), s(0) + 80);
  return (
    <>
      <Stage>
        <TrashBag x={300} y={520} s={1} />
        <g transform={`translate(${520 + t * 600} 520)`}>
          <rect x={-120} y={-80} width={180} height={120} rx={8} fill="#5E6B7D" />
          <rect x={60} y={-50} width={70} height={90} rx={8} fill="#8A94A3" />
          <circle cx={-70} cy={50} r={22} fill="#1E2230" />
          <circle cx={90} cy={50} r={22} fill="#1E2230" />
        </g>
        <g opacity={fade(f, s(1))}>
          <g transform="translate(1500 380)">
            <ellipse rx={90} ry={60} fill="#F6C6CF" />
            <circle cx={70} cy={-10} r={34} fill="#F6C6CF" />
            <T x={0} y={110} size={30} color={K.inkSoft}>
              餌
            </T>
          </g>
          <g transform="translate(1500 700)">
            <rect x={-110} y={-30} width={220} height={60} fill="#8B6B4A" />
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M ${-80 + i * 55} -30 L ${-80 + i * 55} -80`} stroke={P.green} strokeWidth={8} />
            ))}
            <T x={0} y={80} size={30} color={K.inkSoft}>
              肥料
            </T>
          </g>
          <g transform="translate(960 780)">
            <rect x={-300} y={-30} width={600} height={60} rx={30} fill="#E8EBF0" />
            <rect x={-300} y={-30} width={600 * 0.7 * ease(f, s(1) + 20, s(1) + 60)} height={60} rx={30} fill={P.green} />
            <T x={0} y={70} size={28} color={K.inkSoft}>
              リサイクル率 70%（2030年 目標）
            </T>
          </g>
        </g>
        <g opacity={fade(f, s(2))}>
          <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.85} />
          <Onigiri x={600} y={520} s={2} />
          <path d="M 760 520 L 1300 520" stroke={P.store} strokeWidth={60} />
          <path d="M 1300 460 L 1400 520 L 1300 580 Z" fill={P.store} />
          <T x={1500} y={520} size={60} color={P.store} anchor="start">
            売れる
          </T>
          <path d="M 760 700 L 1100 700" stroke={P.waste} strokeWidth={14} />
          <T x={1140} y={700} size={34} color={P.waste} anchor="start">
            リサイクル
          </T>
        </g>
      </Stage>
      <EvidenceMark no="#13" source="セブン-イレブン サステナビリティ" at={s(1)} />
    </>
  );
}, { bg: "white" });

export const MID10 = { E14, E15, E16, E17, E18, E19, E20, E21, E22, E23, E24, E25, E26, E27, E28, E29, E30, E30B };
