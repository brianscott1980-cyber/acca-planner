export type RiskLevel = "safe" | "balanced" | "aggressive";
export type BetLineFormOutcome = "W" | "D" | "L";

export type BetLineFormMatch = {
  opponent: string;
  venue: "H" | "A";
  finalScore: string;
  goalsScored: number;
  outcome: BetLineFormOutcome;
};

export type BetLineFormTeam = {
  matches: BetLineFormMatch[];
};

export type BetLineForm = {
  home: BetLineFormTeam;
  away: BetLineFormTeam;
};

export type SimulatedSlipLegStatus = "won" | "lost" | "cashed_out";

export type SimulatedSlipLegRecord = {
  betLineLabel: string;
  kickoffAt: string;
  settledAt: string;
  finalScore: string;
  status: SimulatedSlipLegStatus;
  actualStatus: "won" | "lost";
};

export type SimulatedSlipRecord = {
  proposalId: string;
  timelineLabel: string;
  stake: number;
  stakePlacedAt: string;
  settledAt: string;
  settlementKind: "settled" | "cashout";
  returnAmount: number;
  status: "win" | "loss";
  legResults?: SimulatedSlipLegRecord[];
};

export type ProposalBetLineRecord = {
  label: string;
  scheduleNote?: string;
  aiReasoning?: string;
  form?: BetLineForm;
  formNote?: string;
  odds?: string;
  marketId?: string;
};

export type GameWeekProposalRecord = {
  id: string;
  riskLevel: RiskLevel;
  title: string;
  summary: string;
  legs: number;
  betLines: ProposalBetLineRecord[];
  statusLabel: string;
  aiRecommended?: boolean;
};

export type GameWeekRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  windowStartIso: string;
  windowEndIso: string;
  startsIn: string;
  proposals: GameWeekProposalRecord[];
  votesByUserId: Record<string, string>;
  simulatedSlip?: SimulatedSlipRecord;
};

export type MatchdayFormRecord = {
  id: string;
  gameWeekId: string;
  proposalId: string;
  betLineId: string;
};

export type MatchdayFormMatchRecord = {
  id: string;
  formId: string;
  teamSide: keyof BetLineForm;
  sortOrder: number;
  opponent: string;
  venue: "H" | "A";
  finalScore: string;
  goalsScored: number;
  outcome: BetLineFormOutcome;
};

export type MatchdayBetLineRecord = {
  id: string;
  gameWeekId: string;
  proposalEntityId: string;
  sortOrder: number;
  label: string;
  scheduleNote?: string;
  aiReasoning?: string;
  formId?: string;
  formNote?: string;
  odds?: string;
  marketId?: string;
};

export type MatchdayProposalRecord = {
  id: string;
  gameWeekId: string;
  proposalId: string;
  riskLevel: RiskLevel;
  title: string;
  summary: string;
  legs: number;
  statusLabel: string;
  aiRecommended?: boolean;
  betLineIds: string[];
};

export type MatchdayGameWeekRecord = Omit<GameWeekRecord, "proposals"> & {
  proposalIds: string[];
  simulatedSlip?: SimulatedSlipRecord;
};
