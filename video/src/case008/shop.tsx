/** J17–J29: QUESTION 2 → 定価で売れる自分の店 → ダイドー → 場所の持ち主 → 災害 → 台数で稼ぐ → 長く同じ値段 → QUESTION 3 → CCBJH 881億円 → DyDo 298億円 → 台数を減らす → QUESTION 4 → 悪循環 → CLUE 02 → 台数 × 赤字 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { EvidenceMark, Lines, R, Stage, count, mk } from "../case002/ui";
import { Badge, FArrow, FNode, Head, Timeline6 } from "../case006/kit";
import { Can, CanClue, Doc, Easing, FONT, K, Led, Machine, Mini, SERIF, Sfx, Street, Truck, V, ease, fade, pop } from "./kit";

/* J17 DARK: QUESTION 2。街じゅうの自販機のシルエット */
const J17 = mk(({ f, s }) => (
  <>
    <Stage>
      <Street n={16} on={16 * fade(f, 0, 30)} y={900} s={1} />
    </Stage>
    <Lines
      dark
      y={-280}
      lines={[
        { t: "そんなに費用がかかるなら、", at: s(1), size: 64 },
        { t: <>なぜ、<R>こんなに置かれた</R>？</>, at: s(2), size: 100 },
      ]}
    />
    <Sfx at={s(2)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* J18 FLAT: スーパー（値段を決めるのは店・特売で下がる）vs 自販機（飲料会社が決める・定価） */
const J18 = mk(({ f, s }) => {
  const down = ease(f, s(2), s(2) + 24);
  return (
    <>
      <Stage>
        <Head text={"自販機 ＝ 「定価で売れる自分の店」"} at={s(0)} y={150} size={54} />
        <g opacity={fade(f, s(1))} transform="translate(520 560)">
          <rect x={-320} y={-260} width={640} height={420} rx={24} fill="#FFFFFF" stroke={K.inkSoft} strokeWidth={4} />
          <text y={-190} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.inkSoft}>
            スーパー・コンビニ
          </text>
          <text y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            値段を決めるのは お店
          </text>
          {[0, 1, 2].map((i) => (
            <Can key={i} x={-160 + i * 160} y={0} color="#81B29A" s={1.2} bottle />
          ))}
          <g transform={`translate(0 ${110 + 20 * down})`}>
            <rect x={-150} y={-36} width={300} height={72} rx={10} fill={down > 0.5 ? V.red : "#FFFFFF"} stroke={V.red} strokeWidth={4} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={down > 0.5 ? "#FFFFFF" : V.red}>
              {down > 0.5 ? "特売 ↓" : "定価"}
            </text>
          </g>
        </g>
        <g opacity={fade(f, s(3))} transform="translate(1400 560)">
          <rect x={-320} y={-260} width={640} height={420} rx={24} fill="#FFFFFF" stroke={V.band} strokeWidth={6} />
          <text y={-190} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={V.band}>
            自販機
          </text>
          <text y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
            値段を決めるのは 飲料会社・系列の会社
          </text>
          <Mini x={-150} y={110} s={1.3} />
          <Led x={110} y={10} text="定価" size={70} w={220} />
        </g>
      </Stage>
    </>
  );
}, { bg: "paper" });

/* J19 EVIDENCE: ダイドー 国内飲料の8〜9割が自販機（報道）/ 25万台前後 */
const J19 = mk(({ f, s }) => (
  <>
    <Stage>
      <Doc
        x={140}
        y={200}
        w={900}
        title="ダイドーグループ（国内の飲料）"
        rows={[
          { k: "売上のうち 自販機", v: "約8〜9割", at: s(1) + 10, color: V.red, big: true },
          { k: "自販機の台数", v: "25万台前後", at: s(2) + 6 },
        ]}
      />
      <g opacity={fade(f, s(1) + 10)} transform="translate(590 740)">
        <rect x={-450} y={-40} width={900} height={60} rx={12} fill="#E8EBF0" />
        <rect x={-450} y={-40} width={900 * 0.85 * ease(f, s(1) + 20, s(1) + 50)} height={60} rx={12} fill={V.red} />
        <text x={-440} y={60} fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft}>
          ※報道。8〜9割の中ほどで表示
        </text>
      </g>
      <g opacity={fade(f, s(3))}>
        <Mini x={1360} y={820} s={2.6} />
        <Can x={1630} y={700} color="#8C6E3F" s={2.4} />
        <text x={1500} y={260} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.ink}>
          自分の自販機で 缶コーヒー
        </text>
      </g>
    </Stage>
    <EvidenceMark no="#11" source="報道（日本経済新聞 ほか）" at={s(1)} />
    <Sfx at={s(1) + 10} name="paper" volume={0.45} />
  </>
), { bg: "paper" });

/* J20 MONEY FLOW ②: 飲料会社 → 自販機 → 客、場所の持ち主に売上の一部 / 事業所 47.7%・大企業 約8割 */
const J20 = mk(({ f, s }) => {
  const stat = fade(f, s(4));
  return (
    <>
      <Stage>
        <g opacity={1 - stat}>
          <FNode x={320} y={420} label="飲料会社" sub="補充・修理" o={fade(f, s(2))} color={V.band} />
          <FNode x={960} y={420} label="自販機" sub="定価" o={fade(f, s(0))} />
          <FNode x={1600} y={420} label="客" o={fade(f, s(0))} />
          <FNode x={960} y={740} label="場所の持ち主" sub="置くだけ" o={fade(f, s(1))} color="#C98A2B" w={360} />
          <FArrow d="M 1460 380 L 1110 380" o={fade(f, s(0) + 10)} label="お金" lx={1285} ly={340} />
          <FArrow d="M 1110 460 L 1460 460" o={fade(f, s(0) + 10)} color={K.inkSoft} label="飲み物" lx={1285} ly={500} />
          <FArrow d="M 960 500 L 960 660" o={fade(f, s(1) + 10)} color="#C98A2B" label="売上の一部" lx={1120} ly={580} />
          <FArrow d="M 470 420 L 810 420" o={fade(f, s(2) + 10)} color={V.band} />
        </g>
        <g opacity={stat}>
          <Head text="事業所に自販機を置いている会社（2026年）" at={s(4)} y={200} size={42} color={K.inkSoft} />
          <text x={620} y={480} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={K.ink}>
            47.7<tspan fontSize={80}>%</tspan>
          </text>
          <text x={620} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
            全体
          </text>
          <g opacity={fade(f, s(5))}>
            <text x={1320} y={480} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={140} fill={V.band}>
              約8割
            </text>
            <text x={1320} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.inkSoft}>
              大企業（79.8%）
            </text>
          </g>
          {Array.from({ length: 6 }, (_, i) => (
            <Mini key={i} x={560 + i * 160} y={800} s={0.8} />
          ))}
        </g>
      </Stage>
      <EvidenceMark no={f < s(4) ? "#07" : "#12"} source={f < s(4) ? "業界の解説" : "東京商工リサーチ（2026年）"} at={s(1)} />
    </>
  );
}, { bg: "white" });

/* J20B OBJECT: 災害のとき、中の飲み物を無料で（夜の公園） */
const J20B = mk(({ f, s }) => {
  const k = Math.floor(Math.max(0, f - s(0) - 20) / 24) % 4;
  return (
    <>
      <Stage>
        <rect x={0} y={800} width={1920} height={280} fill={V.street} />
        <g stroke="#3B4B68" strokeWidth={8} fill="none">
          <path d="M 1500 800 L 1500 520 M 1440 520 L 1560 520" />
        </g>
        <Machine x={760} y={960} s={0.85} free led="0" drop={((f - s(0)) % 24) / 24} />
        <g opacity={fade(f, s(0))}>
          {[0, 1, 2, 3].map((i) => (
            <Can key={i} x={1060 + i * 70} y={900} color="#81B29A" bottle s={0.9} o={i <= k ? 1 : 0.2} />
          ))}
        </g>
        <g opacity={fade(f, s(0))} transform="translate(1400 300)">
          <rect x={-300} y={-80} width={600} height={160} rx={20} fill="rgba(13,22,40,0.85)" stroke="#FFD66E" strokeWidth={4} />
          <text textAnchor="middle" y={-10} fontFamily={FONT} fontWeight={900} fontSize={54} fill="#FFD66E">
            災害のとき 無料
          </text>
          <text textAnchor="middle" y={50} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#C9D6E6" opacity={fade(f, s(1))}>
            自治体と協定を結んで設置
          </text>
        </g>
        <text x={1400} y={560} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={48} fill="#F4EEE3" opacity={fade(f, s(2))}>
          売り場で、街の備え
        </text>
      </Stage>
      <EvidenceMark no="#13" source="コカ･コーラ ボトラーズジャパン・各自治体" at={s(0)} dark />
    </>
  );
}, { bg: "night" });

/* J21 TIMELINE: 台数 ↑ = 売り場 ↑ / 2000年ごろ 560万台 */
const J21 = mk(({ f, s }) => {
  const n = Math.round(count(f, s(0), s(2) - s(0) + 30, 2, 24));
  return (
    <>
      <Stage>
        <Head text="台数 ＝ 売り場の数" at={s(0)} y={170} size={60} />
        <g transform="translate(160 720)">
          {Array.from({ length: n }, (_, i) => (
            <Mini key={i} x={(i % 12) * 130 + 60} y={-Math.floor(i / 12) * 170} s={0.8} />
          ))}
        </g>
        <Badge x={960} y={280} text="自販機は、台数で稼ぐ商売" at={s(1)} size={44} fill={K.ink} />
        <g opacity={fade(f, s(2))}>
          <text x={1500} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.inkSoft}>
            2000年ごろ
          </text>
          <text x={1500} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill={V.red}>
            560万台
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#01" source="日本自動販売システム機械工業会" at={s(2)} />
    </>
  );
}, { bg: "white" });

/* J21B TIMELINE: 1983 100円 → 1992 110円（と言われる）… 2023 缶コーヒー +25円（25年ぶり） */
const J21B = mk(({ f, s }) => {
  const led = f < s(1) + 40 ? "100" : f < s(4) ? "110" : "+25";
  return (
    <>
      <Stage>
        <Timeline6
          y={330}
          items={[
            { year: "1983", text: "缶 100円", at: s(1) },
            { year: "1992", text: "缶 110円", at: s(1) + 40 },
            { year: "2023", text: "缶コーヒー +25円", at: s(4), color: V.red },
          ]}
        />
        <text x={1600} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft} opacity={fade(f, s(1))}>
          ※年は「と言われる」
        </text>
        <Led x={600} y={640} text={led} size={120} w={340} o={fade(f, s(1))} />
        <g opacity={fade(f, s(2))}>
          <text x={1180} y={610} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.ink}>
            値段はそのまま、台数を増やす
          </text>
        </g>
        <Badge x={1180} y={700} text="自販機の勝ちパターン" at={s(3)} size={40} fill={V.band} />
        <Badge x={1180} y={810} text="25年ぶりの大きな値上げ（報道）" at={s(5)} size={34} fill={V.red} />
      </Stage>
      <EvidenceMark no="#14" source="日本経済新聞 ほか（報道）" at={s(1)} />
      <Sfx at={s(4)} name="tok" volume={0.4} />
    </>
  );
}, { bg: "paper" });

/* J22 DARK: QUESTION 3。自販機に「撤去」の札 */
const J22 = mk(({ f, s }) => (
  <>
    <Stage>
      <Machine x={960} y={1060} s={0.6} lit={0.7} led="---" tag={f > s(1) ? "撤去" : undefined} />
    </Stage>
    <Lines dark y={-330} lines={[{ t: <>なぜ今、大手が<R>手放す</R>？</>, at: s(1), size: 100 }]} />
    <Sfx at={s(1)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* J23 EVIDENCE: CCBJH 約65万〜70万台・売上の約1/4 / 減損881億円 / 減損とは / 最終赤字507億円 */
const J23 = mk(({ f, s }) => {
  const cut = ease(f, s(3) + 20, s(3) + 60);
  return (
    <>
      <Stage>
        <Doc
          x={100}
          y={150}
          w={900}
          title="コカ･コーラ ボトラーズジャパン"
          rows={[
            { k: "自販機", v: "約65万〜70万台", at: s(1) },
            { k: "売上のうち自販機", v: "約1/4", at: s(1) + 40 },
            { k: "自販機事業の減損（2025年）", v: "881億円", at: s(2) + 10, color: V.red, big: true },
            { k: "最終損益（2025年12月期）", v: "−507億円", at: s(4) + 10, color: V.red, big: true },
          ]}
        />
        <g opacity={fade(f, s(3))} transform="translate(1420 200)">
          <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={K.ink}>
            減損 ＝
          </text>
          <text y={60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            「もう思ったほど稼げない」と認めて
          </text>
          <text y={104} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.inkSoft}>
            帳簿の価値を切り下げる
          </text>
          <Mini x={-150} y={480} s={1.8} />
          <text x={80} y={220} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={K.inkSoft}>
            帳簿の価値
          </text>
          <rect x={20} y={240} width={120} height={260} rx={10} fill="#E8EBF0" />
          <rect x={20} y={240 + 260 * cut * 0.6} width={120} height={260 - 260 * cut * 0.6} rx={10} fill={V.band} />
          <text x={80} y={228 + 260 * cut * 0.6 + 60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={V.red} opacity={cut}>
            ↓
          </text>
        </g>
      </Stage>
      <EvidenceMark no="#15" source="CCBJH 決算（日本経済新聞・東洋経済）" at={s(1)} />
      <Sfx at={s(2) + 10} name="stamp" volume={0.5} />
    </>
  );
}, { bg: "paper" });

/* J24 EVIDENCE: DyDo 減損298億円・最終赤字307億円 / 国内飲料 営業赤字20億円 / 売上1,426億円(−3.3%) / 数量 −2.7% */
const J24 = mk(({ f, s }) => (
  <>
    <Stage>
      <Doc
        x={260}
        y={140}
        w={1400}
        title="ダイドーグループ（2026年1月期）"
        rows={[
          { k: "減損", v: "298億円", at: s(1), color: V.red },
          { k: "最終損益", v: "−307億円", at: s(1) + 30, color: V.red, big: true },
          { k: "国内の飲料事業 営業損益", v: "−20億円", at: s(2) + 10, color: V.red },
          { k: "国内の飲料 売上", v: "1,426億円（−3.3%）", at: s(3) + 10 },
          { k: "自販機で売れた数量", v: "−2.7%", at: s(4) + 10, color: V.blue },
        ]}
      />
    </Stage>
    <EvidenceMark no="#11" source="DyDo 決算（日本経済新聞・日本食糧新聞）" at={s(1)} />
    <Sfx at={s(1)} name="paper" volume={0.45} />
  </>
), { bg: "paper" });

/* J25 OBJECT: 街の自販機の灯りが大量に消え、トラックが運ぶ / 2万台撤去（報道）/ ポッカサッポロ 約4万台 → 別会社へ */
const J25 = mk(({ f, s }) => {
  const n = 18;
  const on = count(f, s(0) + 10, 60, n, n * 0.7);
  const tr = ease(f, s(1), s(1) + 120);
  return (
    <>
      <Stage>
        <Street n={n} on={on} y={860} s={0.95} />
        <Truck x={-200 + 2300 * tr} y={1000} s={1} color="#5E6B7D" />
        <g opacity={fade(f, s(0))}>
          <rect x={200} y={200} width={680} height={180} rx={20} fill="rgba(13,22,40,0.85)" stroke={V.led} strokeWidth={4} />
          <text x={540} y={270} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#C9D6E6">
            ダイドー（報道）
          </text>
          <text x={540} y={345} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={V.led}>
            約2万台を撤去
          </text>
        </g>
        <g opacity={fade(f, s(1))}>
          <rect x={1040} y={200} width={680} height={180} rx={20} fill="rgba(13,22,40,0.85)" stroke="#FFD66E" strokeWidth={4} />
          <text x={1380} y={270} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill="#C9D6E6">
            ポッカサッポロ 約4万台
          </text>
          <text x={1380} y={345} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#FFD66E">
            2026年10月 別会社へ
          </text>
        </g>
        <text x={960} y={560} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={56} fill="#F4EEE3" opacity={fade(f, s(3))}>
          台数で稼いできた会社が、台数を減らす
        </text>
      </Stage>
      <EvidenceMark no={f < s(1) ? "#11" : "#08"} source={f < s(1) ? "報道" : "ポッカサッポロ 発表"} at={s(0)} dark />
    </>
  );
}, { bg: "night" });

/* J26 DARK: QUESTION 4 */
const J26 = mk(({ s }) => (
  <>
    <Lines
      dark
      y={-60}
      lines={[
        { t: "台数で稼ぐはずが、", at: s(0), size: 72 },
        { t: <>なぜ<R>台数で苦しむ</R>？</>, at: s(1), size: 100 },
      ]}
    />
    <Sfx at={s(1)} name="question" volume={0.5} />
  </>
), { bg: "black", noSub: true });

/* J27 MONEY FLOW ③: 悪循環のループ（イメージ） */
const J27 = mk(({ f, s }) => {
  const nodes = [
    { t: "値上げ", at: s(1), c: V.red },
    { t: "売れる本数 ↓", at: s(2), c: V.blue },
    { t: "1台の売上 ↓", at: s(3), c: V.blue },
    { t: "費用はそのまま", at: s(4), c: K.ink },
    { t: "赤字の自販機 ↑", at: s(5), c: V.red },
  ];
  const cx = 960;
  const cy = 470;
  const R0 = 300;
  const spin = f > s(7) ? (f - s(7)) * 1.2 : 0;
  return (
    <>
      <Stage>
        <circle cx={cx} cy={cy} r={R0} fill="none" stroke="#E4DED2" strokeWidth={16} />
        <g transform={`rotate(${spin} ${cx} ${cy})`} opacity={fade(f, s(7))}>
          <path d={`M ${cx + R0} ${cy} A ${R0} ${R0} 0 0 1 ${cx} ${cy + R0}`} fill="none" stroke={V.red} strokeWidth={16} strokeLinecap="round" />
          <path d={`M ${cx + 20} ${cy + R0 - 26} L ${cx - 10} ${cy + R0} L ${cx + 20} ${cy + R0 + 26}`} fill="none" stroke={V.red} strokeWidth={14} strokeLinecap="round" />
        </g>
        {nodes.map((n, i) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / nodes.length;
          const x = cx + R0 * Math.cos(a);
          const y = cy + R0 * Math.sin(a);
          const p = pop(f, n.at);
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${p})`} opacity={Math.min(1, p * 1.4)}>
              <rect x={-190} y={-50} width={380} height={100} rx={50} fill="#FFFFFF" stroke={n.c} strokeWidth={6} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={40} fill={n.c}>
                {n.t}
              </text>
            </g>
          );
        })}
        <text x={cx} y={cy - 10} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={60} fill={K.ink} opacity={fade(f, s(0))}>
          悪循環
        </text>
        <text x={cx} y={cy + 50} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft} opacity={fade(f, s(0))}>
          ※イメージ
        </text>
        <Badge x={1560} y={820} text="赤字機 2〜3割とも（報道）" at={s(6)} size={32} fill={V.red} />
      </Stage>
      <EvidenceMark no="#16" source="東洋経済（2025年）" at={s(6)} />
      {nodes.map((n, i) => (
        <Sfx key={i} at={n.at} name="tok" volume={0.3} />
      ))}
    </>
  );
}, { bg: "white" });

/* J28 CLUE 02 */
const J28 = mk(({ s }) => <CanClue no="02" at={s(0) + 6} />, { bg: "paper", noSub: true });

/* J29 DATA: 小さな赤字 × 65万台 = 大きな金額（イメージ）/ 881億円・298億円 */
const J29 = mk(({ f, s }) => {
  const spread = ease(f, s(2), s(2) + 60);
  const cols = 40;
  const rows = 14;
  return (
    <>
      <Stage>
        <Head text="65万台 × 1台あたりの小さな赤字" at={s(1)} y={140} size={46} />
        <g transform="translate(360 210)">
          {Array.from({ length: cols * rows }, (_, i) => {
            const on = (((i * 53) % (cols * rows)) / (cols * rows)) < spread * 0.35;
            return <rect key={i} x={(i % cols) * 30} y={Math.floor(i / cols) * 30} width={22} height={22} rx={4} fill={on ? V.red : "#D5DBE3"} />;
          })}
        </g>
        <text x={1600} y={860} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={K.inkSoft} opacity={fade(f, s(2))}>
          ※イメージ（1マス＝多数の台）
        </text>
        <g opacity={fade(f, s(3))}>
          <rect x={460} y={680} width={1000} height={130} rx={65} fill={K.ink} />
          <text x={960} y={745} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={52} fill="#FFFFFF">
            881億円・298億円 ＝ その重さ
          </text>
        </g>
      </Stage>
    </>
  );
}, { bg: "white" });

export const SHOP8 = { J17, J18, J19, J20, J20B, J21, J21B, J22, J23, J24, J25, J26, J27, J28, J29 };
export { AbsoluteFill };
