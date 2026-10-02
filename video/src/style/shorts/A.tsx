// A: 今の方式（平面のベクター）
import React from "react";
import { Onigiri, Sticker, TrashBag } from "../../case010/kit";
import { SANS, Shell, Telop, at, k, pop, useG } from "./common";

const BG = "#101a2e";
const OR = "#F39A3C", BL = "#4C8DF0", RD = "#F0605A";
const slot = (i: number): [number, number] => [140 + (i % 5) * 200, 700 + Math.floor(i / 5) * 190];

const Row: React.FC<{ y: number; label: string; color: string; value: string; o: number }> = ({ y, label, color, value, o }) => (
  <g opacity={o}>
    <text x={170} y={y} fontFamily={SANS} fontWeight={700} fontSize={56} fill="#cfd8e8">{label}</text>
    <text x={740} y={y} textAnchor="end" fontFamily={SANS} fontWeight={900} fontSize={84} fill={color}>{value}</text>
  </g>
);

export const ShortA: React.FC = () => {
  const g = useG();
  const t2 = at("T02"), t3 = at("T03"), t4 = at("T04"), t5 = at("T05"), t6 = at("T06");
  const inHook = g < t2;
  return (
    <Shell bg={BG}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
        {inHook && (
          <g>
            <Telop x={540} y={400} size={92} color="#fff" edge="#101a2e">値引きで、本部の損は</Telop>
            <Telop x={540} y={540} size={140} color="#FFD84D" edge="#101a2e">6円だけ？</Telop>
            <Onigiri x={540} y={930} s={4 + 0.12 * Math.sin(g / 5)} />
            <Sticker x={700} y={820} text="50円" s={2 + 0.1 * Math.sin(g / 4)} />
          </g>
        )}
        {g >= t2 && g < t5 && (
          <g>
            <text x={540} y={470} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={50} fill="#9fb0cc" opacity={k(g, t2, t2 + 10)}>仕入れ 80円 → 売値 100円</text>
            {Array.from({ length: 10 }, (_, i) => {
              const [x, y] = slot(i);
              const left = i >= 8;
              const gray = left && g >= at("T02", 1) && g < t4;
              // 捨てる: ごみ袋へ / 値引き: シールが付いて売れる
              const fly = left ? k(g, t3 + 6, t3 + 30) * (g < t4 ? 1 : 0) : 0;
              const sold = left ? k(g, at("T04", 1), at("T04", 1) + 14) : 0;
              const fx = x + (900 - x) * fly, fy = y + (980 - y) * fly - 160 * Math.sin(Math.PI * fly);
              return (
                <g key={i} opacity={pop(g, t2 + i * 3) * (1 - fly * 0.9) * (1 - sold)}>
                  <Onigiri x={fx} y={fy} s={1.55 * (1 - fly * 0.5)} gray={gray} />
                  {left && g >= t4 && <Sticker x={x + 50} y={y - 40} text="50円" s={pop(g, t4 + 4 + (i - 8) * 4)} />}
                </g>
              );
            })}
            {g >= at("T02", 1) && g < t3 + 6 && <text x={840} y={1000} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} fill={RD} opacity={k(g, at("T02", 1), at("T02", 1) + 8)}>売れ残り 2個</text>}
            {g >= t3 && g < t4 && (
              <g>
                <TrashBag x={900} y={1000} s={0.75} fill={0.6} o={k(g, t3, t3 + 8)} />
                <Row y={1080} label="本部" color={BL} value="+56円" o={pop(g, at("T03", 0) + 18)} />
                <Row y={1190} label="店" color={RD} value="−56円" o={pop(g, at("T03", 1))} />
              </g>
            )}
            {g >= t4 && (
              <g>
                <Row y={1080} label="本部" color={BL} value="+50円" o={pop(g, at("T04", 1))} />
                <Row y={1190} label="店" color={OR} value="+50円" o={pop(g, at("T04", 1) + 10)} />
              </g>
            )}
          </g>
        )}
        {g >= t5 && g < t6 && (
          <g>
            <text x={540} y={500} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={54} fill="#9fb0cc">捨てる → 50円で売り切る</text>
            <text x={130} y={720} fontFamily={SANS} fontWeight={700} fontSize={56} fill="#cfd8e8">店</text>
            <rect x={250} y={660} width={680 * k(g, t5 + 4, t5 + 30)} height={90} rx={10} fill={OR} />
            <Telop x={920} y={850} size={120} color={OR} edge={BG} anchor="end" o={k(g, t5 + 20, t5 + 30)}>+106円</Telop>
            <text x={130} y={1040} fontFamily={SANS} fontWeight={700} fontSize={56} fill="#cfd8e8" opacity={k(g, at("T05", 1), at("T05", 1) + 8)}>本部</text>
            <rect x={250} y={985} width={680 * (6 / 106) * k(g, at("T05", 1), at("T05", 1) + 12)} height={70} rx={8} fill={BL} />
            <text x={320} y={1045} fontFamily={SANS} fontWeight={900} fontSize={64} fill={BL} opacity={k(g, at("T05", 1) + 6, at("T05", 1) + 14)}>−6円</text>
          </g>
        )}
        {g >= t6 && (
          <g>
            <Telop x={540} y={420} size={86} color="#fff" edge={BG} o={k(g, t6, t6 + 8)}>コンビニ、なぜ</Telop>
            <Telop x={540} y={540} size={96} color="#FFD84D" edge={BG} o={k(g, t6, t6 + 8)}>値引きせず捨てる？</Telop>
            <TrashBag x={540} y={880} s={2.0 * (0.9 + 0.1 * pop(g, t6))} fill={1} />
            <Telop x={540} y={1180} size={64} color="#fff" edge={BG} o={k(g, at("T06", 1), at("T06", 1) + 8)}>1店 年468万円</Telop>
          </g>
        )}
      </svg>
    </Shell>
  );
};
