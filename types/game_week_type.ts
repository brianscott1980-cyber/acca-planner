import type { GameWeekProposalRecord } from "./matchday_type";

export type ProposalBetLine = GameWeekProposalRecord["betLines"][number];

export type CashoutStrategy = {
  upperTarget: string;
  lowerTarget: string;
  noCashoutValue: string;
  watchList: string[];
};

export type BetLineInsight = {
  aiReasoning: string;
  sequenceReasoning: string | null;
};

export type GameWeekViewState =
  | "voting"
  | "locked"
  | "placed"
  | "review";
