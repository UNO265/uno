/** 육영수 편 장면 목록: cuts.json 의 p.view → 컴포넌트 */
import React from "react";
import { SP } from "../jeongjo/kit";
import { VIEWS } from "./Views";
import * as D from "./Views2D";
import * as T from "./Views3D";

export const ALL: Record<string, React.FC<SP>> = {
  ...VIEWS,
  hall: T.HallView, shots: T.Shots, rifling: T.Rifling, endscreen: T.EndScreen,
  film: D.Film, counter: D.Counter, paren: D.Paren, statements: D.Statements, grades: D.Grades, gradeDemo: D.GradeDemo,
  profile: D.Profile, yadang: D.Yadang, age: D.Age, score: D.Score, dayline: D.Dayline,
  suspect: D.Suspect, route: D.Route, passport: D.Passport, trial: D.Trial, conclusion: D.Conclusion,
  dual: D.Dual, news1973: D.News1973, archive: D.Archive, envoy: D.Envoy, cable: D.Cable, memoir: D.Memoir,
  testimony: D.Testimony, chain: D.Chain, waveform: D.Waveform, claim: D.Claim, twoviews: D.TwoViews,
  ledger: D.Ledger, answer: D.Answer, blank: D.Blank, chapter: D.Chapter,
};
