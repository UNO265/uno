/** #011 お米 の場面（F01〜F38）。docs/case011-conti-v5.md。rel(id, i) = その場面の中で、カット id の i 番目の文が始まるフレーム */
import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Bar3D, BlobLayer, Chapter, CompareCards, Document, KeyLine, KeyLineDark, LineChart, ListCard, NumberPunch, QuestionDrum, Stamp, countText } from "../tpl/templates";
import { Balance, SizeBars, StackBag, SwingLoop } from "./heroes";

type P = { dur: number; rel: (id: string, i: number) => number };
type Scene = { ids: string[]; light?: boolean; el: React.FC<P> };

const S: React.FC<{ at: number; name: string; v?: number }> = ({ at, name, v = 0.5 }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
  </Sequence>
);
const Part: React.FC<{ from: number; to?: number; children: (f: number, dur: number) => React.ReactNode; total: number }> = ({ from, to, children, total }) => {
  const f = useCurrentFrame();
  const end = to ?? total;
  if (f < from || f >= end) return null;
  return <>{children(f - from, end - from)}</>;
};
const use = () => useCurrentFrame();
const SRC_COST = "出典：米穀安定供給確保支援機構「米のコスト指標」（2026年4月）";
const SRC_GAISAN = "概算金：新潟 一般コシヒカリ（報道）／費用：コスト指標　5キロ換算は計算";

export const SCENES: Scene[] = [
  /* ── オープニング（F01〜F06）: 音楽と一緒に始まる（06 PART 27） ── */
  { ids: ["F01"], el: ({ dur, rel }) => (<>
    <Part from={0} total={dur}>{(f, d) => <><NumberPunch f={f} dur={d} value="4,279円" label="お米5キロ（2025年12月・全国のスーパー平均）" source="出典：農林水産省 公表値（報道）" wall="お米5キロ" /><BlobLayer f={f} /></>}</Part>
    <S at={2} name="whoosh0" /><S at={rel("F01", 1) + 6} name="thud" v={0.6} />
  </>) },
  { ids: ["F02"], el: ({ dur }) => { const f = use(); return (<><KeyLineDark f={f} dur={dur} parts={[{ t: "これだけ高いなら、", at: 4 }, { t: "農家は儲かったはず", hot: true, at: 22 }]} size={104} /><S at={22} name="pop0" /></>); } },
  { ids: ["F03"], el: ({ dur, rel }) => {
    const b = rel("F03", 1) - 4, c = rel("F03", 2) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <NumberPunch f={f} dur={d} value="−4割" label="新潟の農家が受け取るお金（概算金・前年比）" source="報道（2026年8月）" wall="概算金" />}</Part>
      <Part from={b} to={c} total={dur}>{(f, d) => <KeyLineDark f={f} dur={d} parts={[{ t: "国が認めたコストの指標も", at: 4 }, { t: "下回る", hot: true, at: 26 }]} size={100} />}</Part>
      <Part from={c} total={dur}>{(f, d) => <KeyLineDark f={f} dur={d} parts={[{ t: "「収穫しない方がいい」", hot: true, at: 6 }]} size={110} note="農家の声（報道）" />}</Part>
      <S at={6} name="thud" v={0.6} /><S at={b} name="whoosh1" /><S at={c + 6} name="pop1" />
    </>);
  } },
  { ids: ["F04"], el: ({ dur }) => { const f = use(); return (<><QuestionDrum f={f} dur={dur} text="お米5キロ、農家に残るのは？" hot="残る" band="HOW MUCH LEFT?  ✦  残るのは？" /><S at={0} name="whoosh2" /></>); } },
  { ids: ["F05"], el: ({ dur, rel }) => { const f = use(); return (<><KeyLineDark f={f} dur={dur} parts={[{ t: "答えは2分で出る。", at: 4 }, { t: "残る田んぼ", hot: true, at: rel("F05", 1) + 40 }, { t: "と", at: rel("F05", 1) + 52 }, { t: "残らない田んぼ", hot: true, at: rel("F05", 1) + 62 }]} size={92} /><S at={rel("F05", 1) + 40} name="pop0" /></>); } },
  { ids: ["F06"], el: ({ dur }) => { const f = use(); return (<><Chapter f={f} dur={dur} no={1} title="お米" sub="KANENAZO CASE #010" /><S at={0} name="whoosh0" /></>); } },

  /* ── 1. 5キロの中身 → 答え ── */
  { ids: ["F07"], el: ({ dur, rel }) => (<>
    <Part from={0} total={dur}>{(f, d) => <Stamp f={f} dur={d} lines={["農家一軒ごとの", "儲け"]} stamp="非公表" at={rel("F07", 0) + 40} />}</Part>
    <S at={rel("F07", 0) + 40} name="stamp0" v={0.7} />
  </>) },
  { ids: ["F08"], el: ({ dur, rel }) => { const f = use(); const a = rel("F08", 1) + 60; return (<><NumberPunch f={f} dur={dur} value={`${countText(f, a, 30, 2816, (n) => Math.round(n).toLocaleString())}円`} label="お米5キロ、田んぼから店の棚までの費用（儲けは含まない）" source={SRC_COST} wall="コスト指標" /><S at={a} name="thud" v={0.6} /></>); } },
  { ids: ["F09"], el: ({ dur, rel }) => { const f = use(); return (<>
    <StackBag f={f} dur={dur} total={2816} source={`${SRC_COST}　5キロ換算は計算`} parts={[
      { k: "田んぼで作る", v: 1902, at: rel("F09", 4), hot: true },
      { k: "農家から集める", v: 235, at: rel("F09", 3) },
      { k: "卸売り", v: 217, at: rel("F09", 2) },
      { k: "お店で売る", v: 462, at: rel("F09", 1) },
    ]} />
    <S at={rel("F09", 1)} name="tok1" /><S at={rel("F09", 2)} name="tok2" /><S at={rel("F09", 3)} name="tok3" /><S at={rel("F09", 4)} name="thud" v={0.6} />
  </>); } },
  { ids: ["F10"], el: ({ dur, rel }) => { const f = use(); return (<>
    <ListCard f={f} dur={dur} dark title="お米が高いのは…" items={[{ t: "間に入る業者が取っている？", at: 6, strike: true }, { t: "集める＋卸売り＝費用の2割未満", at: rel("F10", 1) + 40, hot: true }]} />
    <S at={rel("F10", 1) + 40} name="pop1" />
  </>); } },
  { ids: ["F11"], el: ({ dur, rel }) => { const f = use(); return (<>
    <CompareCards f={f} dur={dur} lead="概算金＝JAなどが農家に先に払うお金（玄米60キロ）" cards={[{ title: "新潟コシヒカリ", value: "30,000円", note: "2025年産・前年の約1.7倍", hot: true }]} source="報道（2025年8月）" />
    <S at={6} name="whoosh1" />
  </>); } },
  { ids: ["F12", "F13"], el: ({ dur, rel }) => { const f = use(); return (<>
    <Balance f={f} dur={dur} title="お米5キロ：農家が受け取るお金 vs 作る費用" source={SRC_GAISAN} states={[
      { at: rel("F12", 0), label: "去年（概算金 3万円）", recv: 2778, cost: 1839 },
      { at: rel("F13", 1), label: "今年（概算金 1万8500円）", recv: 1713, cost: 1902 },
    ]} />
    <S at={rel("F12", 1) + 30} name="pop0" /><S at={rel("F13", 1)} name="whoosh2" /><S at={rel("F13", 4)} name="thud" v={0.6} />
  </>); } },
  { ids: ["F14"], el: ({ dur, rel }) => { const f = use(); return (<>
    <KeyLineDark f={f} dur={dur} parts={[{ t: "今年、5キロで農家に残るのは", at: 10 }, { t: "0円以下", hot: true, at: rel("F14", 0) + 70 }]} size={98} note="費用に、農家が自分で働いた分（家族の労働）を含めた場合　計算" />
    <S at={rel("F14", 0) + 70} name="thud" v={0.7} />
  </>); } },
  { ids: ["F14B"], el: ({ dur, rel }) => { const f = use(); return (<>
    <CompareCards f={f} dur={dur} lead="ご飯1杯（お米65グラム）で計算すると" cards={[{ title: "店の値段", value: "41円" }, { title: "農家が受け取る", value: "22円", hot: true }, { title: "作る費用", value: "25円" }]} source="5キロ3191円・概算金1万8500円・コスト指標から計算（目安）" />
    <S at={rel("F14B", 4)} name="pop1" />
  </>); } },
  { ids: ["F14C"], light: true, el: ({ dur }) => { const f = use(); return <KeyLine f={f} dur={dur} parts={[{ t: "概算金は" }, { t: "「仮払い」", hot: true }, { t: "あとで追加されることも" }]} note="例：JA阿蘇 1万3000円＋最大6000円（報道）" />; } },
  { ids: ["F15"], el: ({ dur }) => { const f = use(); return (<>
    <SizeBars f={f} dur={dur} title="2026年産の概算金（玄米60キロ）とコスト指標" items={[{ k: "新潟", v: 18500 }, { k: "千葉", v: 18000 }, { k: "熊本 早期米", v: 20700 }]} line={20535} lineLabel="コスト指標 20,535円" lineAt={200} source="概算金：報道（2026年8〜9月）／コスト指標：米穀機構" />
    <S at={200} name="thud" v={0.5} />
  </>); } },
  { ids: ["F15A", "F15B", "F15C"], light: true, el: ({ dur, rel }) => {
    const b = rel("F15B", 0) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <ListCard f={f} dur={d} title="田んぼの1902円（5キロあたり・計算）" items={[{ t: "働く人の費用　約630円", at: rel("F15A", 1) + 30, hot: true }, { t: "機械　約390円", at: rel("F15A", 2) }, { t: "肥料 約130円・農薬 約100円", at: rel("F15A", 3) }, { t: "（お店の462円のうち人件費 約180円）", at: rel("F15A", 4) }]} />}</Part>
      <Part from={b} total={dur}>{(f, d) => <Document f={f} dur={d} name="米のコスト指標（米穀安定供給確保支援機構）" lines={["前の試算　精米5キロ 2,736円", "今回（2026年4月）　2,816円", "代表的な規模　1〜3ヘクタール"]} mark={1} source={SRC_COST} />}</Part>
    </>);
  } },

  /* ── 2. なぜ店の値段は遅い？なぜ高かった？ ── */
  { ids: ["F16"], el: ({ dur, rel }) => {
    const b = rel("F16", 1) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <Chapter f={f} dur={d} no={2} title="なぜ、店はゆっくり？" sub="something odd" />}</Part>
      <Part from={b} total={dur}>{(f, d) => <CompareCards f={f} dur={d} lead="下がり方が違う" cards={[{ title: "農家の概算金", value: "−4割", hot: true }, { title: "店の5キロ", value: "−25%", note: "4279→3191円" }]} source="概算金：報道／店頭：農林水産省 公表値（報道）・計算" />}</Part>
      <S at={0} name="whoosh2" /><S at={b} name="whoosh1" />
    </>);
  } },
  { ids: ["F17"], el: ({ dur }) => { const f = use(); return (<><QuestionDrum f={f} dur={dur} text="なぜ1年前は、あんなに高かった？" hot="高かった" band="WHY SO HIGH?  ✦  なぜ高い？" /><S at={0} name="whoosh0" /></>); } },
  { ids: ["F17B"], light: true, el: ({ dur }) => { const f = use(); return <KeyLine f={f} dur={dur} parts={[{ t: "主食用のお米の需要は" }, { t: "毎年10万トンほど", hot: true }, { t: "減ってきた" }]} note="出典：農林水産省（報道）" />; } },
  { ids: ["F18"], el: ({ dur, rel }) => { const f = use(); const a = rel("F18", 1) + 90; return (<><NumberPunch f={f} dur={dur} value={`${countText(f, a, 24, 60.9, (n) => n.toFixed(1))}%`} label="2023年産「1等米」の割合（前年78.5%・現行検査で最低）" source="出典：農林水産省" wall="1等米" /><S at={a} name="thud" v={0.6} /></>); } },
  { ids: ["F18B"], el: ({ dur, rel }) => { const f = use(); return (<>
    <CompareCards f={f} dur={dur} lead="2024年、作れる量が減ったところに…" cards={[{ title: "1人1年の消費", value: "53.4kg", note: "前年より3.1キロ多い", hot: true }, { title: "店の棚", value: "空っぽ", note: "2024年夏" }]} source="出典：農林水産省 食料需給表（概算）" />
    <S at={rel("F18B", 4)} name="whoosh1" />
  </>); } },
  { ids: ["F19"], el: ({ dur, rel }) => { const f = use(); const a = rel("F19", 3); return (<><NumberPunch f={f} dur={dur} value={`${countText(f, a, 24, 95, (n) => Math.round(n).toString())}倍`} label="民間のお米の輸入 2025年 9万6834トン（関税 1キロ341円）" source="出典：財務省 貿易統計（報道）" wall="輸入" /><S at={a} name="thud" v={0.6} /></>); } },
  { ids: ["F19B"], light: true, el: ({ dur }) => { const f = use(); return <KeyLine f={f} dur={dur} parts={[{ t: "政府備蓄米の放出 " }, { t: "約59万トン", hot: true }, { t: "（2025年・玄米）" }]} note="5キロ2000円ほどで店に並んだものも（農林水産省・報道）" />; } },
  { ids: ["F20"], light: true, el: ({ dur }) => { const f = use(); return <KeyLine f={f} dur={dur} parts={[{ t: "341円払っても売れるほど、" }, { t: "国産が高かった", hot: true }]} />; } },
  { ids: ["F21"], el: ({ dur }) => { const f = use(); return <Bar3D f={f} dur={dur} title="主食用米の収穫量（万トン）" unit="" items={[{ k: "2024年産", v: 652 }, { k: "2025年産", v: 718, hot: true }]} source="出典：農林水産省（2025年産は前年比＋66万トン）" />; } },
  { ids: ["F22"], el: ({ dur, rel }) => { const f = use(); const a = rel("F22", 1) + 30; return (<><NumberPunch f={f} dur={dur} value={`${countText(f, a, 24, 243, (n) => Math.round(n).toString())}万トン`} label="お米の民間在庫（2026年6月末）＝過去最大　適正 180〜200万トン" source="出典：農林水産省（報道）" wall="在庫" /><S at={a} name="thud" v={0.6} /></>); } },
  { ids: ["F23"], light: true, el: ({ dur }) => { const f = use(); return <KeyLine f={f} dur={dur} parts={[{ t: "余れば下がる → " }, { t: "概算金 4割安", hot: true }]} />; } },
  { ids: ["F24", "F24B"], el: ({ dur, rel }) => { const b = rel("F24B", 0) - 4; return (<>
    <Part from={0} to={b} total={dur}>{(f, d) => <LineChart f={f} dur={d} title="去年のお米は、まだ高い" sub="2025年産の相対取引価格（玄米60キロ・円）" unit="" yMax={40000} data={[{ x: 0, y: 37058, label: "37,058", xl: "25年10月" }, { x: 2, y: 36075, label: "36,075", xl: "12月" }, { x: 3, y: 35465, label: "35,465", xl: "26年1月" }, { x: 5, y: 33345, label: "33,345", xl: "3月" }, { x: 8, y: 31305, label: "31,305", xl: "6月" }, { x: 10, y: 31556, label: "31,556", xl: "8月" }]} source="出典：農林水産省 相対取引価格" />}</Part>
    <Part from={b} total={dur}>{(f, d) => <CompareCards f={f} dur={d} lead="店や卸に残る、高く仕入れたお米" cards={[{ title: "去年のお米（8月）", value: "31,556円", hot: true }, { title: "新しい概算金", value: "18,500円" }]} source="玄米60キロ　農林水産省 相対取引価格・報道" />}</Part>
    <S at={b} name="whoosh1" />
  </>); } },

  /* ── 3. 同じ値段、違う田んぼ ── */
  { ids: ["F25"], el: ({ dur }) => { const f = use(); return (<><Chapter f={f} dur={dur} no={3} title="同じ値段、違う田んぼ" sub="size matters" /><S at={0} name="whoosh2" /></>); } },
  { ids: ["F26"], el: ({ dur, rel }) => { const f = use(); return (<>
    <SizeBars f={f} dur={dur} title="お米を作る費用（2024年産・玄米60キロ・田んぼの広さ別）" items={[{ k: "0.5ha未満", v: 27217, at: rel("F26", 1) + 20 }, { k: "0.5〜1", v: 22027, at: rel("F26", 1) + 60 }, { k: "1〜3", v: 17781, at: rel("F26", 1) + 100 }, { k: "3ha以上", v: 12912, at: rel("F26", 2) }, { k: "平均", v: 15814, at: rel("F26", 4) }, { k: "50ha以上", v: 9978, at: rel("F26", 2) + 30 }]} line={18500} lineLabel="今年の概算金 18,500円（新潟）" lineAt={rel("F26", 5)} source="出典：農林水産省 令和6年産米生産費（全算入生産費）" />
    <S at={rel("F26", 3)} name="pop0" /><S at={rel("F26", 5)} name="thud" v={0.6} />
  </>); } },
  { ids: ["F27"], el: ({ dur, rel }) => { const f = use(); const b = rel("F27", 3) - 4; return (<>
    <Part from={0} to={b} total={dur}>{(ff, d) => <CompareCards f={ff} dur={d} lead="農機具の費用（玄米60キロ）" cards={[{ title: "0.5ha未満", value: "4,554円", hot: true }, { title: "50ha以上", value: "1,774円" }]} source="出典：農林水産省 令和6年産米生産費" />}</Part>
    <Part from={b} total={dur}>{(ff, d) => <CompareCards f={ff} dur={d} lead="自分で働いた分の費用（家族労働費・玄米60キロ）" cards={[{ title: "0.5ha未満", value: "8,352円", hot: true }, { title: "50ha以上", value: "888円" }]} source="出典：農林水産省 令和6年産米生産費" />}</Part>
    <S at={b} name="whoosh1" />{void f}
  </>); } },
  { ids: ["F28"], el: ({ dur, rel }) => { const f = use(); return (<>
    <Balance f={f} dur={dur} title="今年の概算金で、5キロあたり（目安）" note="費用は2024年産の統計、概算金は新潟の例　計算" source="出典：農林水産省 令和6年産米生産費・報道" states={[
      { at: rel("F28", 1), label: "小さな田んぼ（0.5ha未満）", recv: 1713, cost: 2520 },
      { at: rel("F28", 2), label: "大きな田んぼ（50ha以上）", recv: 1713, cost: 924 },
    ]} />
    <S at={rel("F28", 1)} name="thud" v={0.5} /><S at={rel("F28", 2)} name="pop1" />
  </>); } },
  { ids: ["F29"], light: true, el: ({ dur }) => { const f = use(); return <KeyLine f={f} dur={dur} parts={[{ t: "50ha以上は" }, { t: "会社に近い", hot: true }]} note="人を雇う費用 1,193円 ＞ 家族の労働費 888円（玄米60キロ・農林水産省）" />; } },
  { ids: ["F30"], el: ({ dur, rel }) => { const f = use(); const a = rel("F30", 3); return (<><NumberPunch f={f} dur={dur} value={`${countText(f, a, 24, 67.6, (n) => n.toFixed(1))}歳`} label="農業を主な仕事にする人の平均年齢　102万1000人（5年で−25%）" source="出典：農林業センサス 2025（報道）" wall="担い手" /><S at={a} name="thud" v={0.6} /></>); } },

  /* ── 4. 買う側と、これから ── */
  { ids: ["F31"], el: ({ dur, rel }) => { const b = rel("F31", 4) - 4; return (<>
    <Part from={0} to={b} total={dur}>{(f, d) => <Chapter f={f} dur={d} no={4} title="買う側は、どうする？" sub="for you" />}</Part>
    <Part from={b} total={dur}>{(f, d) => <Bar3D f={f} dur={d} title="国内の収穫と、民間の輸入（2025年・万トン）" unit="" items={[{ k: "国内の収穫", v: 718 }, { k: "民間の輸入", v: 9.7, hot: true }]} source="出典：農林水産省・財務省 貿易統計（報道）　輸入は収穫の約1%（計算）" />}</Part>
    <S at={0} name="whoosh0" /><S at={b} name="whoosh1" />
  </>); } },
  { ids: ["F32"], light: true, el: ({ dur }) => { const f = use(); return <KeyLine f={f} dur={dur} parts={[{ t: "田んぼを、誰が続けるか" }, { t: "経営体 5年で−23%", hot: true }]} note="出典：農林業センサス 2025（報道）" />; } },
  { ids: ["F32B"], el: ({ dur }) => { const f = use(); return <CompareCards f={f} dur={dur} lead="お米の輸出（2025年）" cards={[{ title: "輸出量", value: "4.7万t", note: "前年を上回る", hot: true }, { title: "1キロあたり", value: "約300円", note: "139億円÷数量（計算）" }]} source="出典：農林水産省 輸出実績（収穫718万トンの1%未満）" />; } },
  { ids: ["F33"], el: ({ dur, rel }) => { const f = use(); const b = rel("F33", 3) - 4; return (<>
    <Part from={0} to={b} total={dur}>{(ff, d) => <NumberPunch f={ff} dur={d} value={`${countText(ff, rel("F33", 1) + 30, 24, 34000, (n) => Math.round(n).toLocaleString())}円`} label="1人が1年に食べるお米（今の値段・去年の冬なら4万5000円超）" source="消費53.4キロ × 5キロ3191円／4279円で計算" wall="1年分" />}</Part>
    <Part from={b} total={dur}>{(ff, d) => <CompareCards f={ff} dur={d} lead="これから店に並ぶ新米" cards={[{ title: "専門家の予想", value: "3,000円前後", note: "5キロ（報道）", hot: true }]} />}</Part>
    <S at={rel("F33", 1) + 30} name="thud" v={0.6} /><S at={b} name="whoosh1" />{void f}
  </>); } },
  { ids: ["F33B"], light: true, el: ({ dur, rel }) => { const f = use(); return <ListCard f={f} dur={dur} title="こう選ぶ" items={[{ t: "在庫の多い去年のお米と、新米の値段の差", at: 6 }, { t: "袋の精米日も一緒に見る", at: rel("F33B", 2), hot: true }]} />; } },
  { ids: ["F34"], el: ({ dur, rel }) => { const f = use(); return <KeyLineDark f={f} dur={dur} parts={[{ t: "安くなるのは、うれしい。", at: 6 }, { t: "でも、下がりすぎれば", at: rel("F34", 1) }, { t: "小さな田んぼから", at: rel("F34", 1) + 60 }, { t: "来年の作り手が減る", hot: true, at: rel("F34", 2) + 26 }]} size={88} note="費用の重い小さな田んぼから（可能性）" />; } },

  /* ── 5. MONEY FLOW → 答え ── */
  { ids: ["F35", "F36", "F36B"], el: ({ dur, rel }) => { const f = use(); return (<>
    <SwingLoop f={f} dur={dur} title="お米の値段は、揺れる" nodes={[
      { label: "足りない", num: "1等米 60.9%", at: rel("F36", 0) },
      { label: "値段が上がる", num: "輸入 95倍", at: rel("F36", 0) + 40, hot: true },
      { label: "もっと作る", num: "718万t", at: rel("F36", 1) },
      { label: "余る", num: "在庫 243万t", at: rel("F36", 2) },
      { label: "値段が下がる", num: "概算金 −4割", at: rel("F36", 2) + 40, hot: true },
    ]} />
    <S at={rel("F36", 0)} name="whoosh2" /><S at={rel("F36B", 2)} name="thud" v={0.5} />
  </>); } },
  { ids: ["F37"], el: ({ dur, rel }) => { const c = rel("F37", 2) - 4; return (<>
    <Part from={0} to={c} total={dur}>{(f, d) => <KeyLineDark f={f} dur={d} parts={[{ t: "誰かが儲けている？", at: 10 }, { t: "341円払っても買われた年", at: rel("F37", 1) + 30 }, { t: "費用を回収できない年", hot: true, at: rel("F37", 1) + 150 }]} size={90} />}</Part>
    <Part from={c} total={dur}>{(f, d) => <KeyLineDark f={f} dur={d} parts={[{ t: "揺れの商売", hot: true, at: 10 }, { t: "耐えられるかは", at: rel("F37", 3) - c }, { t: "田んぼの大きさ", hot: true, at: rel("F37", 3) - c + 50 }]} size={96} />}</Part>
    <S at={rel("F37", 1) + 150} name="pop0" /><S at={c} name="whoosh1" />
  </>); } },
  { ids: ["F38"], el: ({ dur, rel }) => { const f = use(); return (<><KeyLineDark f={f} dur={dur} parts={[{ t: "答えは――今年、5キロで農家に残るのは", at: 10 }, { t: "0円以下", hot: true, at: rel("F38", 0) + 80 }, { t: "（去年は約940円）", at: rel("F38", 1) }]} size={84} note="新潟コシヒカリ・家族の労働を費用に含めた場合（計算）" /><S at={rel("F38", 0) + 80} name="thud" v={0.7} /></>); } },
];
