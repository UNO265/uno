/** CASE #002 のショート 3 本（縦 1080×1920）。組み立て方は CASE #001 のショートと同じ */
import t1 from "../../public/case002_shorts/short1/timeline.json";
import t2 from "../../public/case002_shorts/short2/timeline.json";
import t3 from "../../public/case002_shorts/short3/timeline.json";
import c1 from "../../public/case002_shorts/short1/music/cues.json";
import c2 from "../../public/case002_shorts/short2/music/cues.json";
import c3 from "../../public/case002_shorts/short3/music/cues.json";
import { make } from "../shorts001/Main";
import { SHORT1 } from "./short1";
import { SHORT2 } from "./short2";
import { SHORT3 } from "./short3";

type Cue = { file: string; from: number; to: number; mood: string };

export const SHORTS002 = [
  { id: "Short002-1", ...make(t1, c1 as Cue[], SHORT1) },
  { id: "Short002-2", ...make(t2, c2 as Cue[], SHORT2) },
  { id: "Short002-3", ...make(t3, c3 as Cue[], SHORT3) },
];
