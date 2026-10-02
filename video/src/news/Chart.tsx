// 経済メディア風のチャート（KANENAZO ニュースグラフィック・パッケージの試作）
import React from "react";
import { AbsoluteFill } from "remotion";
import d from "./data010.json";

const SANS = "'Noto Sans CJK JP', sans-serif";
const INK = "#121417", GRAY = "#6b7079", GRID = "#d9d6cf", RED = "#d23a2f", NAVY = "#1f3a5f", BG = "#f7f5f0";

const Frame: React.FC<{ tag: string; title: string; sub: string; source: string; children: React.ReactNode }> = ({ tag, title, sub, source, children }) => (
  <AbsoluteFill style={{ background: BG, fontFamily: SANS }}>
    <div style={{ position: "absolute", left: 120, top: 70, width: 90, height: 14, background: RED }} />
    <div style={{ position: "absolute", left: 120, top: 100, fontSize: 30, fontWeight: 700, color: RED, letterSpacing: 2 }}>{tag}</div>
    <div style={{ position: "absolute", left: 120, top: 150, fontSize: 64, fontWeight: 900, color: INK }}>{title}</div>
    <div style={{ position: "absolute", left: 120, top: 245, fontSize: 32, color: GRAY }}>{sub}</div>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>{children}</svg>
    <div style={{ position: "absolute", left: 120, bottom: 60, fontSize: 24, color: GRAY }}>{source}</div>
    <div style={{ position: "absolute", right: 120, bottom: 56, fontSize: 28, fontWeight: 900, letterSpacing: 4, color: INK }}>KANENAZO</div>
  </AbsoluteFill>
);

/** 折れ線（年 × 値）。注目する 2 点に印と数字 */
const Line: React.FC<{ key2: "cust_per_store_day" | "avg_spend"; lo: number; hi: number; ticks: number[]; marks: number[]; unit: string; band?: [number, number] }> = ({ key2, lo, hi, ticks, marks, unit, band }) => {
  const X0 = 200, X1 = 1720, Y0 = 900, Y1 = 340;
  const x = (y: number) => X0 + ((y - 2005) / 20) * (X1 - X0);
  const y = (v: number) => Y0 - ((v - lo) / (hi - lo)) * (Y0 - Y1);
  const pts = d.jfa.map((r) => [x(r.year), y(r[key2])]);
  return (
    <g fontFamily={SANS}>
      {band && <rect x={x(band[0])} y={Y1 - 20} width={x(band[1]) - x(band[0])} height={Y0 - Y1 + 20} fill="#ece7dc" />}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={X0} x2={X1} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={2} />
          <text x={X1 + 16} y={y(t) + 10} fontSize={26} fill={GRAY}>{t}</text>
        </g>
      ))}
      {[2005, 2010, 2015, 2020, 2025].map((yr) => (
        <text key={yr} x={x(yr)} y={Y0 + 50} fontSize={26} fill={GRAY} textAnchor="middle">{yr}</text>
      ))}
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={NAVY} strokeWidth={7} strokeLinejoin="round" />
      {marks.map((yr) => {
        const r = d.jfa.find((q) => q.year === yr)!;
        return (
          <g key={yr}>
            <circle cx={x(yr)} cy={y(r[key2])} r={13} fill={RED} stroke={BG} strokeWidth={4} />
            <text x={x(yr)} y={y(r[key2]) - 30} fontSize={44} fontWeight={900} fill={RED} textAnchor="middle">{r[key2].toLocaleString()}{unit}</text>
            <text x={x(yr)} y={y(r[key2]) + 56} fontSize={26} fill={GRAY} textAnchor="middle">{yr}年</text>
          </g>
        );
      })}
    </g>
  );
};

export const ChartCustomers: React.FC = () => (
  <Frame tag="DATA 01 ／ コンビニ" title="1店に来る客は、コロナ前に戻っていない" sub="1店あたり・1日の来店客数（人）　※年間来店客数 ÷ 12月の店舗数 ÷ 365 で計算" source="出典：日本フランチャイズチェーン協会「コンビニエンスストア統計調査」（2005〜2025年）をもとに KANENAZO が計算">
    <Line key2="cust_per_store_day" lo={740} hi={900} ticks={[750, 800, 850, 900]} marks={[2019, 2025]} unit="人" band={[2020, 2021]} />
  </Frame>
);

export const ChartSpend: React.FC = () => (
  <Frame tag="DATA 02 ／ コンビニ" title="客単価は、6年で15%上がった" sub="平均客単価（円）　2005〜2016年はほぼ横ばい" source="出典：日本フランチャイズチェーン協会「コンビニエンスストア統計調査」（2005〜2025年）">
    <Line key2="avg_spend" lo={560} hi={760} ticks={[600, 650, 700, 750]} marks={[2019, 2025]} unit="円" />
  </Frame>
);

export const ChartDiet: React.FC = () => {
  const rows = d.kokkai.filter((r) => r.word === "見切り販売" && r.year >= 2005);
  const years = Array.from({ length: 21 }, (_, i) => 2005 + i);
  const X0 = 200, X1 = 1720, Y0 = 900, H = 520, max = 14;
  const bw = (X1 - X0) / years.length;
  return (
    <Frame tag="DATA 03 ／ 国会" title="国会で「見切り販売」が最も語られたのは2019年" sub="国会会議録で「見切り販売」を含む発言の数（件）" source="出典：国立国会図書館「国会会議録検索システム」API（2026年10月取得）をもとに KANENAZO が集計">
      {[0, 5, 10].map((t) => (
        <g key={t}>
          <line x1={X0} x2={X1} y1={Y0 - (t / max) * H} y2={Y0 - (t / max) * H} stroke={GRID} strokeWidth={2} />
          <text x={X1 + 16} y={Y0 - (t / max) * H + 10} fontSize={26} fill={GRAY} fontFamily={SANS}>{t}</text>
        </g>
      ))}
      {years.map((yr, i) => {
        const n = rows.find((r) => r.year === yr)?.n ?? 0;
        const hot = yr === 2019;
        return (
          <g key={yr} fontFamily={SANS}>
            <rect x={X0 + i * bw + bw * 0.18} y={Y0 - (n / max) * H} width={bw * 0.64} height={(n / max) * H} fill={hot ? RED : NAVY} opacity={hot ? 1 : 0.75} />
            {n > 0 && <text x={X0 + i * bw + bw / 2} y={Y0 - (n / max) * H - 14} fontSize={hot ? 44 : 26} fontWeight={hot ? 900 : 400} fill={hot ? RED : GRAY} textAnchor="middle">{n}</text>}
            {yr % 5 === 0 && <text x={X0 + i * bw + bw / 2} y={Y0 + 50} fontSize={26} fill={GRAY} textAnchor="middle">{yr}</text>}
          </g>
        );
      })}
      <text x={X0 + 14 * bw + bw / 2} y={Y0 + 50} fontSize={26} fill={RED} fontWeight={700} textAnchor="middle" fontFamily={SANS}>2019</text>
      <text x={X0 + 14 * bw - 20} y={Y0 - H + 10} fontSize={28} fill={INK} textAnchor="end" fontFamily={SANS}>食品ロス削減推進法が成立した年 →</text>
    </Frame>
  );
};

export const ChartHQ: React.FC = () => {
  const rows = d.hq;
  const X0 = 200, X1 = 1720, Y0 = 900, H = 500, max = 1400;
  const bw = (X1 - X0) / rows.length;
  return (
    <Frame tag="DATA 04 ／ 本部" title="本部が1店から得る利益も、6年で約17%減った" sub="セブン-イレブン（国内コンビニ事業）の営業利益 ÷ 期末の店舗数（万円）　※計算・22年2月期から新セグメント" source="出典：セブン＆アイ・ホールディングス「セグメント情報」「月次営業情報」（2018〜2026年2月期）をもとに KANENAZO が計算">
      {[0, 500, 1000].map((t) => (
        <g key={t}>
          <line x1={X0} x2={X1} y1={Y0 - (t / max) * H} y2={Y0 - (t / max) * H} stroke={GRID} strokeWidth={2} />
          <text x={X1 + 16} y={Y0 - (t / max) * H + 10} fontSize={26} fill={GRAY} fontFamily={SANS}>{t.toLocaleString()}</text>
        </g>
      ))}
      {rows.map((r, i) => {
        const hot = r.fy === 2020 || r.fy === 2026;
        const h = (r.per_store_man / max) * H;
        return (
          <g key={r.fy} fontFamily={SANS}>
            <rect x={X0 + i * bw + bw * 0.2} y={Y0 - h} width={bw * 0.6} height={h} fill={hot ? RED : NAVY} opacity={hot ? 1 : 0.7} />
            <text x={X0 + i * bw + bw / 2} y={Y0 - h - 16} fontSize={hot ? 44 : 28} fontWeight={hot ? 900 : 400} fill={hot ? RED : GRAY} textAnchor="middle">{r.per_store_man.toLocaleString()}</text>
            <text x={X0 + i * bw + bw / 2} y={Y0 + 50} fontSize={26} fill={hot ? RED : GRAY} fontWeight={hot ? 700 : 400} textAnchor="middle">{String(r.fy).slice(2)}/2期</text>
          </g>
        );
      })}
      <text x={X0 + 5.5 * bw} y={Y0 - H - 10} fontSize={28} fill={INK} textAnchor="middle" fontFamily={SANS}>1店あたり1日に直すと 約3万3,600円 → 約2万8,100円</text>
    </Frame>
  );
};
