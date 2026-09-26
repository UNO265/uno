/** CASE #004 の入口ショート 1 本（縦 1080×1920）。組み立て方は CASE #001 のショートと同じ */
import t1 from "../../public/case004_shorts/short1/timeline.json";
import c1 from "../../public/case004_shorts/short1/music/cues.json";
import { make } from "../shorts001/Main";
import { SHORT1 } from "./short1";

type Cue = { file: string; from: number; to: number; mood: string };

export const SHORTS004 = [{ id: "Short004-1", ...make(t1, c1 as Cue[], SHORT1) }];
