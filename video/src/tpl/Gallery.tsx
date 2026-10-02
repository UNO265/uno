// テンプレート見本（各 5 秒前後）。中身は #009 の数字
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, F, useFonts } from "../kinetic/kit";
import { Bar3D, BlobLayer, Chapter, CompareCards, Document, KeyLine, LineChart, MoneyFlow, NumberPunch, QuestionDrum, Timeline } from "./templates";

const S = (n: number) => n * 30;
const LIST: { id: string; name: string; dur: number; el: (f: number, dur: number) => React.ReactNode }[] = [
  { id: "T02", name: "NUMBER PUNCH", dur: S(4), el: (f, d) => <><NumberPunch f={f} dur={d} value="10兆307億円" label="ドラッグストアの売上（2024年度）" source="出典：日本チェーンドラッグストア協会" wall="10兆円" /><BlobLayer f={f} /></> },
  { id: "T03", name: "QUESTION DRUM", dur: S(4), el: (f, d) => <QuestionDrum f={f} dur={d} text="薬屋なのに、なぜ食品が安い？" hot="食品安い" band="WHY CHEAP?  ✦  なぜ安い？" /> },
  { id: "T04", name: "CHAPTER", dur: S(3), el: (f, d) => <Chapter f={f} dur={d} no={2} title="食品は、いくら残る？" sub="the margin" /> },
  { id: "T05", name: "LINE CHART", dur: S(6), el: (f, d) => <LineChart f={f} dur={d} title="ドラッグストア市場は、24年で約4倍" sub="全国の売上（兆円）" unit="兆" yMax={12} data={[{ x: 2000, y: 2.6 }, { x: 2008, y: 5.2 }, { x: 2020, y: 8.0 }, { x: 2024, y: 10.0 }]} source="出典：大和総研（2009）・日本チェーンドラッグストア協会 実態調査" /> },
  { id: "T06", name: "BAR 3D", dur: S(5), el: (f, d) => <Bar3D f={f} dur={d} title="いちばん伸びたのは、食品" unit="%" items={[{ k: "フーズ", v: 13.2, hot: true }, { k: "ビューティ", v: 11.7 }, { k: "調剤・ヘルス", v: 8.7 }, { k: "ホーム", v: 2.1 }]} source="出典：日本チェーンドラッグストア協会（2024年度・前年比）" /> },
  { id: "T07", name: "COMPARE CARDS", dur: S(5), el: (f, d) => <CompareCards f={f} dur={d} lead="100円売ると、残るのは（計算・目安）" cards={[{ title: "食品", value: "18円", hot: true }, { title: "医薬品", value: "39円" }, { title: "調剤", value: "37円" }]} source="ウエルシアHD 有価証券報告書（2025年2月期）の品目別 売上と仕入から KANENAZO が計算" /> },
  { id: "T08", name: "MONEY FLOW", dur: S(6), el: (f, d) => <MoneyFlow f={f} dur={d} title="お金は、どこから入る？" nodes={[{ id: "c", label: "お客", x: 420, y: 520 }, { id: "i", label: "保険", x: 420, y: 860 }, { id: "s", label: "店", x: 1460, y: 680, hot: true }]} edges={[{ from: "c", to: "s", label: "食品・日用品" }, { from: "c", to: "s", label: "薬・化粧品" }, { from: "i", to: "s", label: "調剤（保険から約7割）", hot: true }]} /> },
  { id: "T09", name: "DOCUMENT", dur: S(5), el: (f, d) => <Document f={f} dur={d} name="ウエルシアHD 有価証券報告書（2025年2月期）品目別" lines={["医薬品　売上 2,333億円 / 仕入 1,429億円", "化粧品　売上 2,030億円 / 仕入 1,396億円", "食品　　売上 2,995億円 / 仕入 2,457億円", "調剤　　売上 2,825億円 / 仕入 1,775億円"]} mark={2} source="出典：ウエルシアホールディングス 有価証券報告書" /> },
  { id: "T10", name: "TIMELINE", dur: S(7), el: (f, d) => <Timeline f={f} dur={d} title="ドラッグストアが食品の店になるまで" events={[{ year: "2009", text: "登録販売者ができ、薬剤師なしで市販薬を売れる" }, { year: "2020", text: "売上 8兆円" }, { year: "2024", text: "初めて 10兆円を超える", hot: true }, { year: "2025", text: "ウエルシアとツルハが経営統合" }, { year: "2030", text: "業界の目標 13兆円" }]} /> },
  { id: "T11", name: "KEY LINE", dur: S(4), el: (f, d) => <KeyLine f={f} dur={d} parts={[{ t: "食品は、" }, { t: "100円売っても" }, { t: "18円", hot: true }, { t: "しか残らない。" }]} note="※ウエルシアの品目別 売上・仕入からの計算" /> },
];
export const GALLERY_TOTAL = LIST.reduce((a, b) => a + b.dur, 0);

export const Gallery: React.FC = () => {
  useFonts();
  const g = useCurrentFrame();
  let at = 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {LIST.map((t) => {
        const from = at;
        at += t.dur;
        return (
          <Sequence key={t.id} from={from} durationInFrames={t.dur}>
            <Local el={t.el} dur={t.dur} />
            <div style={{ position: "absolute", left: 40, top: 30, fontFamily: F.mono, fontSize: 22, color: C.or, background: "rgba(0,0,0,.6)", padding: "4px 12px" }}>{t.id} {t.name}</div>
          </Sequence>
        );
      })}
      <div style={{ display: "none" }}>{g}</div>
    </AbsoluteFill>
  );
};
const Local: React.FC<{ el: (f: number, dur: number) => React.ReactNode; dur: number }> = ({ el, dur }) => {
  const f = useCurrentFrame();
  return <>{el(f, dur)}</>;
};
