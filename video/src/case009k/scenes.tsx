/** #009 本編の場面（D07〜D36）。rel(id, i) = その場面の中で、カット id の i 番目の文が始まるフレーム */
import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Bar3D, BlobLayer, Chapter, CompareCards, Document, KeyLine, KeyLineDark, LineChart, ListCard, LoopFlow, MoneyFlow, NumberPunch, QuestionDrum, Stamp, Timeline, countText } from "../tpl/templates";

type P = { dur: number; rel: (id: string, i: number) => number };
type Scene = { ids: string[]; light?: boolean; el: React.FC<P> };

/** 効果音（public/sfx） */
const S: React.FC<{ at: number; name: string; v?: number }> = ({ at, name, v = 0.5 }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
  </Sequence>
);
/** 場面の中で途中から別のテンプレートに切り替える */
const Part: React.FC<{ from: number; to?: number; children: (f: number, dur: number) => React.ReactNode; total: number }> = ({ from, to, children, total }) => {
  const f = useCurrentFrame();
  const end = to ?? total;
  if (f < from || f >= end) return null;
  return <>{children(f - from, end - from)}</>;
};
const use = () => useCurrentFrame();
const yen = (n: number) => Math.round(n).toLocaleString();

export const SCENES: Scene[] = [
  /* D07 非公開 → ある大手は品目別の売上と仕入れを載せている */
  { ids: ["D07"], el: ({ dur, rel }) => {
    const b = rel("D07", 1) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <Stamp f={f} dur={d} lines={["食品だけの利益", "商品ごとの原価"]} stamp="非公開" at={rel("D07", 0) + 52} />}</Part>
      <Part from={b} total={dur}>{(f, d) => <Document f={f} dur={d} name="ある大手（ウエルシアHD）有価証券報告書 ─ 品目別" lines={["医薬品　売上 2,333億円 / 仕入 1,429億円", "化粧品　売上 2,030億円 / 仕入 1,396億円", "食品　　売上 2,995億円 / 仕入 2,457億円", "調剤　　売上 2,825億円 / 仕入 1,775億円"]} mark={2} source="出典：ウエルシアホールディングス 有価証券報告書（2025年2月期）" />}</Part>
      <S at={rel("D07", 0) + 52} name="stamp0" v={0.7} /><S at={b} name="paper0" />
    </>);
  } },
  /* D08 10兆307億円・2万3723店 */
  { ids: ["D08"], el: ({ dur, rel }) => {
    const f = use(); const b = rel("D08", 2) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(ff, d) => <><NumberPunch f={ff} dur={d} value="10兆307億円" label="全国のドラッグストアの売上（2024年度）" source="出典：日本チェーンドラッグストア協会 実態調査" wall="10兆円" /><BlobLayer f={ff} /></>}</Part>
      <Part from={b} total={dur}>{(ff, d) => <NumberPunch f={ff} dur={d} value={`${countText(ff, 0, 24, 23723, (n) => (n >= 10000 ? `${Math.floor(n / 10000)}万${String(Math.round(n) % 10000).padStart(4, "0")}` : yen(n)))}店`} label="店の数" source="出典：日本チェーンドラッグストア協会 実態調査（2024年度）" wall="2万3723店" />}</Part>
      <S at={2} name="whoosh0" /><S at={20} name="thud" v={0.6} /><S at={b} name="whoosh1" />{void f}
    </>);
  } },
  /* D09 よく言われる答えは半分正しい → 調剤・ヘルスケア vs フーズ */
  { ids: ["D09"], el: ({ dur, rel }) => {
    const b = rel("D09", 3) - 4, q = rel("D09", 1) - 4;
    return (<>
      <Part from={0} to={q} total={dur}>{(f, d) => <KeyLineDark f={f} dur={d} parts={[{ t: "では、なぜ", at: 4 }, { t: "食品が安い？", hot: true, at: 14 }]} size={110} />}</Part>
      <Part from={q} to={b} total={dur}>{(f, d) => <KeyLineDark f={f} dur={d} parts={[{ t: "「薬や化粧品で稼いでいる」", at: rel("D09", 1) - q }, { t: "これは、", at: rel("D09", 2) - q }, { t: "半分正しい", hot: true, at: rel("D09", 2) + 14 - q }]} size={92} />}</Part>
      <Part from={b} total={dur}>{(f, d) => <Bar3D f={f} dur={d} title="売上の内訳（2024年度・兆円）" unit="兆" items={[{ k: "調剤・ヘルスケア", v: 3.33 }, { k: "フーズ", v: 2.83, hot: true }, { k: "ホーム", v: 2.04 }, { k: "ビューティ", v: 1.83 }]} source="出典：日本チェーンドラッグストア協会 実態調査" />}</Part>
      <S at={14} name="pop0" /><S at={rel("D09", 2) + 14} name="pop0" /><S at={b} name="whoosh2" />
    </>);
  } },
  /* D10 割に合うのか？ */
  { ids: ["D10"], el: ({ dur }) => { const f = use(); return (<><QuestionDrum f={f} dur={dur} text="本当に割に合うのか？" hot="割に合う" band="WORTH IT?  ✦  割に合う？" /><S at={0} name="whoosh0" /></>); } },
  /* D11 先に答え */
  { ids: ["D11"], el: ({ dur, rel }) => { const f = use(); return (<><KeyLineDark f={f} dur={dur} parts={[{ t: "結論から言うと――", at: rel("D11", 0) }, { t: "食品は、儲けるための商品ではない。", at: rel("D11", 1) }, { t: "客を、何度も来させる", hot: true, at: rel("D11", 2) }, { t: "ための値段だ。", at: rel("D11", 2) + 20 }]} size={78} /><S at={rel("D11", 2)} name="thud" v={0.6} /></>); } },
  /* D12 ウエルシアの数字 → 100円で残るのは 18円 / 39円 */
  { ids: ["D12"], el: ({ dur, rel }) => {
    const b = rel("D12", 1) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <Document f={f} dur={d} name="ウエルシアHD 有価証券報告書（2025年2月期）" lines={["食品　売上 2,995億円", "食品　仕入 2,457億円"]} mark={1} source="出典：ウエルシアホールディングス 有価証券報告書" />}</Part>
      <Part from={b} total={dur}>{(f, d) => <CompareCards f={f} dur={d} lead="100円売ると、残るのは（売上−仕入れ・計算）" cards={[{ title: "食品", value: "18円", hot: true, note: "ここから給料・家賃・電気代" }, { title: "薬", value: "39円", note: "食品の約2倍" }]} source="ウエルシアHD 有価証券報告書の品目別 売上・仕入れから KANENAZO が計算（目安）" />}</Part>
      <S at={b} name="pop1" />
    </>);
  } },
  /* D13 来店のループ（HERO 1） */
  { ids: ["D13"], el: ({ dur, rel }) => { const f = use(); return <LoopFlow f={f} dur={dur} title="安い食品は、「来店」を呼ぶ値段" nodes={[{ label: "卵・牛乳（週に何度も）", at: rel("D13", 1) }, { label: "来店", at: rel("D13", 2), hot: true }, { label: "ついでに 薬・化粧品", at: rel("D13", 3) }]} />; } },
  /* D13B 市場は約4倍 → 2009 登録販売者 */
  { ids: ["D13B"], light: true, el: ({ dur, rel }) => {
    const b = rel("D13B", 3) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <LineChart f={f} dur={d} title="業界の売上は、四半世紀で4倍近く" sub="全国のドラッグストアの売上（兆円）" unit="兆" yMax={12} data={[{ x: 2000, y: 2.6 }, { x: 2008, y: 5.2 }, { x: 2020, y: 8.0 }, { x: 2024, y: 10.0 }]} source="出典：大和総研（2009）・日本チェーンドラッグストア協会 実態調査" />}</Part>
      <Part from={b} total={dur}>{(f, d) => <Timeline f={f} dur={d} title="転機は2009年" events={[{ year: "2009", text: "「登録販売者」ができ、薬剤師なしで多くの市販薬を売れる", hot: true }, { year: "2020", text: "売上 8兆円" }, { year: "2024", text: "売上 10兆円" }]} />}</Part>
    </>);
  } },
  /* D14 なぜ今「本気で」？ */
  { ids: ["D14"], el: ({ dur }) => { const f = use(); return (<><QuestionDrum f={f} dur={dur} text="なぜ今、本気で食品を？" hot="本気食品" band="WHY NOW?  ✦  なぜ今？" /><S at={0} name="whoosh1" /></>); } },
  /* D15 物価高 */
  { ids: ["D15"], light: true, el: ({ dur, rel }) => {
    const b = rel("D15", 3) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <ListCard f={f} dur={d} title="きっかけは、物価高" items={[{ t: "食料品のお金が「増えた」24.6%", at: rel("D15", 1) }, { t: "その理由は「物価高」67.4%", at: rel("D15", 2), hot: true }]} />}</Part>
      <Part from={b} total={dur}>{(f, d) => <KeyLine f={f} dur={d} parts={[{ t: "家庭の食料の支出は減る。" }, { t: "安い店を求めて、" }, { t: "ドラッグストアへ", hot: true }]} note="出典：デロイト トーマツ 消費者調査（2025年）・日本経済新聞（報道）" />}</Part>
    </>);
  } },
  /* D16 アオキ 51.3% → 売上・利益 */
  { ids: ["D16"], el: ({ dur, rel }) => {
    const b = rel("D16", 3) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <NumberPunch f={f} dur={d} value="51.3%" label="クスリのアオキ　売上に占める食品" source="出典：クスリのアオキHD 決算（2025年5月期）" wall="食品 51.3%" />}</Part>
      <Part from={b} total={dur}>{(f, d) => <CompareCards f={f} dur={d} lead="利益の薄い食品を増やして、損をしないのか？（2025年5月期）" cards={[{ title: "売上", value: "+14.8%" }, { title: "営業利益", value: "+43.3%", hot: true }]} source="出典：クスリのアオキHD 決算" />}</Part>
      <S at={2} name="whoosh2" /><S at={20} name="thud" v={0.6} /><S at={b + 6} name="pop2" />
    </>);
  } },
  /* D17 買う側の理由 */
  { ids: ["D17"], light: true, el: ({ dur, rel }) => { const f = use(); return <ListCard f={f} dur={dur} title="買う側にとっての理由" items={[{ t: "家から近い", at: rel("D17", 1) }, { t: "薬も洗剤も食べ物も、一度に", at: rel("D17", 2) }, { t: "安い", at: rel("D17", 3), hot: true }, { t: "でも、スーパーとも使い分ける", at: rel("D17", 5) }]} />; } },
  /* D18 どうやって安くする？ */
  { ids: ["D18"], el: ({ dur }) => { const f = use(); return (<><QuestionDrum f={f} dur={dur} text="どうやってここまで安く？" hot="安く" band="HOW SO CHEAP?  ✦  どうやって？" /><S at={0} name="whoosh0" /></>); } },
  /* D19 コスモス: やらないこと（HERO） */
  { ids: ["D19"], el: ({ dur, rel }) => { const f = use(); return (<><ListCard dark f={f} dur={dur} title="コスモス薬品が「やめた」こと" items={[{ t: "チラシ", at: rel("D19", 1), strike: true }, { t: "日替わり・時間帯の特売", at: rel("D19", 2), strike: true }, { t: "ポイントカード", at: rel("D19", 3), strike: true }, { t: "毎日、同じ安い値段", at: rel("D19", 4), hot: true }]} />{[1, 2, 3].map((i) => <S key={i} at={rel("D19", i) + 10} name={`tok${i}`} />)}</>); } },
  /* D20 販管費 15% vs 21.2% → 1兆113億円 */
  { ids: ["D20"], el: ({ dur, rel }) => {
    const b = rel("D20", 3) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <Bar3D f={f} dur={d} title="売上に対する販売管理費の割合" unit="%" items={[{ k: "コスモス薬品", v: 15, hot: true }, { k: "業界平均", v: 21.2 }]} source="出典：報道（FISCO・日本経済新聞）" />}</Part>
      <Part from={b} total={dur}>{(f, d) => <NumberPunch f={f} dur={d} value="1兆113億円" label="コスモス薬品の売上（2025年5月期）　営業利益 +25.8%" source="出典：コスモス薬品 決算" wall="1兆円" />}</Part>
      <S at={b} name="whoosh1" /><S at={b + 18} name="thud" v={0.55} />
    </>);
  } },
  /* D20B 食品型 vs 美容型 */
  { ids: ["D20B"], el: ({ dur }) => { const f = use(); return <CompareCards f={f} dur={dur} lead="食品で集めるか、美容で稼ぐか（営業利益率・計算）" cards={[{ title: "コスモス薬品", value: "4.0%", note: "食品で客を集める" }, { title: "マツキヨココカラ", value: "7.6%", hot: true, note: "「美と健康」72.4%" }]} source="各社決算（コスモス 2025年5月期・マツキヨココカラ 2026年3月期）から KANENAZO が計算" />; } },
  /* D21 残りのお金は？ */
  { ids: ["D21"], el: ({ dur, rel }) => {
    const b = rel("D21", 2) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <KeyLineDark f={f} dur={d} parts={[{ t: "食品で残るのは", at: rel("D21", 0) }, { t: "18%ほど", hot: true, at: rel("D21", 0) + 24 }, { t: "それでも、10兆円", at: rel("D21", 1) }]} size={96} />}</Part>
      <Part from={b} total={dur}>{(f, d) => <QuestionDrum f={f} dur={d} text="残りのお金は、どこから？" hot="どこから" band="WHERE FROM?  ✦  どこから？" />}</Part>
      <S at={b} name="whoosh2" />
    </>);
  } },
  /* D22 財布が三つ（HERO） */
  { ids: ["D22"], el: ({ dur, rel }) => { const f = use(); return (<><CompareCards f={f} dur={dur} lead="ドラッグストアには、財布が三つある" cards={[{ title: "一つ目", value: "客", note: "食品・日用品" }, { title: "二つ目", value: "ついで", note: "薬・化粧品（ビューティ +11.7%）" }, { title: "三つ目", value: "?", hot: true }]} />{[0, 1, 2].map((i) => <S key={i} at={6 + i * 7} name={`pop${i}`} v={0.45} />)}{void rel}</>); } },
  /* D23 三つ目 = 調剤（保険から）→ 37円 */
  { ids: ["D23"], el: ({ dur, rel }) => {
    const b = rel("D23", 7) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <MoneyFlow f={f} dur={d} title="三つ目の財布 ＝ 調剤" nodes={[{ id: "c", label: "客（3割）", x: 420, y: 520 }, { id: "i", label: "医療保険", x: 420, y: 860, hot: true }, { id: "s", label: "店の薬局", x: 1460, y: 680, hot: true }]} edges={[{ from: "c", to: "s", label: "自己負担 原則3割" }, { from: "i", to: "s", label: "残りは保険から", hot: true }]} />}</Part>
      <Part from={b} total={dur}>{(f, d) => <CompareCards f={f} dur={d} lead="同じ計算で、100円あたり残るのは（計算・目安）" cards={[{ title: "食品", value: "18円" }, { title: "調剤", value: "37円", hot: true, note: "値段は国が決める" }]} source="ウエルシアHD 有価証券報告書の品目別 売上・仕入れから KANENAZO が計算" />}</Part>
      <S at={0} name="whoosh0" /><S at={b} name="pop1" />
    </>);
  } },
  /* D24 調剤 +8.4% vs 全国 +1.6% → 5倍 */
  { ids: ["D24"], el: ({ dur, rel }) => {
    const b = rel("D24", 3) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <Bar3D f={f} dur={d} title="調剤の伸び（2024年度・前年比）" unit="%" items={[{ k: "ドラッグストア", v: 8.4, hot: true }, { k: "全国", v: 1.6 }]} source="出典：日本チェーンドラッグストア協会・厚生労働省" />}</Part>
      <Part from={b} total={dur}>{(f, d) => <NumberPunch f={f} dur={d} value="18.4%" label="全国の調剤に占めるドラッグストア（伸びは全体の約5倍）" source="出典：日本チェーンドラッグストア協会・厚生労働省（計算）" wall="調剤" />}</Part>
      <S at={b} name="whoosh1" /><S at={b + 18} name="thud" v={0.6} />
    </>);
  } },
  /* D25 安い卵の向こうに、処方箋がある（HERO） */
  { ids: ["D25"], el: ({ dur }) => { const f = use(); return (<><KeyLineDark f={f} dur={dur} parts={[{ t: "安い卵の向こうに、", at: 2 }, { t: "処方箋がある。", hot: true, at: 40 }]} size={120} /><S at={40} name="thud" v={0.5} /></>); } },
  /* D26 食品の客 ↔ 調剤の客（HERO 2） */
  { ids: ["D26"], el: ({ dur, rel }) => { const f = use(); return <LoopFlow f={f} dur={dur} title="食品の客が、調剤の客に。調剤の客が、食品の客に。" nodes={[{ label: "処方箋（決まった間隔）", at: rel("D26", 0) }, { label: "来店", at: rel("D26", 1), hot: true }, { label: "売り場を一回り", at: rel("D26", 2) }, { label: "卵と牛乳も", at: rel("D26", 3) }]} />; } },
  /* D27 これから */
  { ids: ["D27"], el: ({ dur }) => { const f = use(); return (<><Chapter f={f} dur={dur} no={4} title="これから、どうなる？" sub="what's next" /><S at={0} name="whoosh2" /></>); } },
  /* D28 統合 2兆3124億円 */
  { ids: ["D28"], el: ({ dur }) => { const f = use(); return (<><NumberPunch f={f} dur={dur} value="2兆3124億円" label="ウエルシア＋ツルハ（2025年12月 経営統合）　国内 5659店" source="出典：統合説明資料・報道（世界6位の規模と報じられている）" wall="統合" /><S at={2} name="whoosh0" /><S at={20} name="thud" v={0.55} /></>); } },
  /* D29 備蓄米 */
  { ids: ["D29"], el: ({ dur, rel }) => { const f = use(); const a = 10; return <NumberPunch f={f} dur={dur} value={`${countText(f, a, 30, 400, (n) => Math.round(n).toString())}万袋`} label="コスモス薬品が引き受けた備蓄米 2万トン（5キロ・約2000円）" source="出典：コスモス薬品 発表（2025年）" wall="備蓄米" />; } },
  /* D30 倒産 358件 */
  { ids: ["D30"], light: true, el: ({ dur }) => { const f = use(); return <KeyLine f={f} dur={dur} parts={[{ t: "飲食料品の小売店の倒産、" }, { t: "358件", hot: true }, { t: "（4年連続で増加）" }]} note={`出典：帝国データバンク（2025年度）`} />; } },
  /* D30B スーパーの反撃 */
  { ids: ["D30B"], light: true, el: ({ dur }) => { const f = use(); return <KeyLine f={f} dur={dur} parts={[{ t: "薬と食品の境目は、" }, { t: "店の側からも", hot: true }, { t: "なくなりつつある。" }]} note="スーパーの調剤薬局買収・並び出店（報道）" />; } },
  /* D31 +0.08% → 3万5000店 */
  { ids: ["D31"], el: ({ dur, rel }) => {
    const b = rel("D31", 4) - 4;
    return (<>
      <Part from={0} to={b} total={dur}>{(f, d) => <NumberPunch f={f} dur={d} value="+0.08%" label="2026年度の調剤報酬の改定" source="出典：厚生労働省（改定率）" wall="調剤報酬" />}</Part>
      <Part from={b} total={dur}>{(f, d) => <Bar3D f={f} dur={d} title="ドラッグストアの店の数と、コンビニ（店）" unit="" items={[{ k: "2030年の目標", v: 35000, hot: true }, { k: "今の店の数", v: 23723 }, { k: "今のコンビニ", v: 56000 }]} source="出典：日本チェーンドラッグストア協会・日本フランチャイズチェーン協会" />}</Part>
      <S at={0} name="whoosh1" /><S at={20} name="thud" v={0.55} />
    </>);
  } },
  /* D32 買う側は */
  { ids: ["D32"], el: ({ dur }) => { const f = use(); return (<><Chapter f={f} dur={dur} no={5} title="買う側は、どう使う？" sub="for you" /><S at={0} name="whoosh0" /></>); } },
  /* D33 使い分け */
  { ids: ["D33"], light: true, el: ({ dur, rel }) => { const f = use(); return <ListCard f={f} dur={dur} title="こう使い分ける" items={[{ t: "毎日の食品・日用品 → ドラッグストア", at: rel("D33", 0) }, { t: "野菜・肉・魚を選ぶ日 → スーパー", at: rel("D33", 1) }, { t: "ポイントの日を見逃さない", at: rel("D33", 2), hot: true }]} />; } },
  /* D33B セルフメディケーション税制 */
  { ids: ["D33B"], light: true, el: ({ dur }) => { const f = use(); return <Document f={f} dur={dur} name="セルフメディケーション税制（厚生労働省）" lines={["対象の市販薬を 1年に 1万2000円 を超えて買うと", "超えた分を所得から差し引ける", "差し引ける上限は 8万8000円", "パッケージに目印のマークがある薬も多い"]} mark={1} source="出典：厚生労働省（2026年12月31日まで・スイッチOTCは恒久化の予定）" />; } },
  /* D34+D35 MONEY FLOW（HERO 最大） */
  { ids: ["D34", "D35"], el: ({ dur, rel }) => { const f = use(); return (<><MoneyFlow f={f} dur={dur} title="ドラッグストアの MONEY FLOW" nodes={[{ id: "c", label: "客", x: 360, y: 520 }, { id: "i", label: "医療保険", x: 360, y: 820 }, { id: "f", label: "安い食品", x: 960, y: 280 }, { id: "s", label: "店", x: 1560, y: 520, hot: true }]} edges={[{ from: "f", to: "c", label: "来店を呼ぶ" }, { from: "c", to: "s", label: "ついで買い（薬・化粧品）" }, { from: "i", to: "s", label: "調剤", hot: true }, { from: "s", to: "f", label: "規模で、もっと安く", hot: true }]} />{void rel}</>); } },
  /* D36 最後の答え */
  { ids: ["D36"], el: ({ dur, rel }) => { const f = use(); return (<><KeyLineDark f={f} dur={dur} parts={[{ t: "答えは――", at: rel("D36", 0) }, { t: "食品は、", at: rel("D36", 0) + 20 }, { t: "客を何度も来させる", hot: true, at: rel("D36", 0) + 34 }, { t: "ための値段。", at: rel("D36", 0) + 60 }, { t: "その来店が、薬と調剤の稼ぎにつながる。", at: rel("D36", 1) }]} size={80} /><S at={rel("D36", 0) + 34} name="thud" v={0.5} /></>); } },
];
