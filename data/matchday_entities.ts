import type {
  BetLineForm,
  GameWeekRecord,
  RiskLevel,
  SimulatedSlipRecord,
} from "./matchday_seed";

export type MatchdayFormRecord = {
  id: string;
  gameWeekId: string;
  proposalId: string;
  betLineId: string;
  form: BetLineForm;
};

export type MatchdayBetLineRecord = {
  id: string;
  gameWeekId: string;
  proposalEntityId: string;
  order: number;
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
