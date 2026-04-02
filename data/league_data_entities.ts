export type LeagueSimulationLegStatus = "won" | "lost" | "cashed_out";

export type LeagueDataMetaRecord = {
  id: string;
  simulatedAtIso: string;
  updatedAtIso: string;
};

export type LeagueMatchdaySimulationRow = {
  id: string;
  gameWeekId: string;
  voteResolvedAtIso: string;
  betPlacedAtIso: string;
  selectedProposalId: string;
  slipId: string;
};

export type LeagueMatchdayVoteRow = {
  id: string;
  simulationId: string;
  gameWeekId: string;
  userId: string;
  proposalId: string;
};

export type LeagueMatchdayBetLineOddsRow = {
  id: string;
  simulationId: string;
  gameWeekId: string;
  order: number;
  betLineLabel: string;
  odds: string;
};

export type LeagueSimulationSlipRow = {
  id: string;
  simulationId: string;
  gameWeekId: string;
  proposalId: string;
  timelineLabel: string;
  stake: number;
  stakePlacedAt: string;
  settledAt: string;
  settlementKind: "settled" | "cashout";
  returnAmount: number;
  status: "win" | "loss";
};

export type LeagueSimulationLegResultRow = {
  id: string;
  simulationId: string;
  slipId: string;
  gameWeekId: string;
  order: number;
  betLineLabel: string;
  kickoffAt: string;
  settledAt: string;
  finalScore: string;
  status: LeagueSimulationLegStatus;
  actualStatus: "won" | "lost";
};
