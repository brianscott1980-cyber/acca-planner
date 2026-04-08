import type { LeagueSimulationSlipRow } from "../types/league_simulation_type";

export const leagueDataSlips: LeagueSimulationSlipRow[] = [
  {
    id: "slip-md-1-balanced",
    simulationId: "sim-md-1",
    gameWeekId: "md-1",
    proposalId: "proposal-md-1-balanced",
    timelineLabel: "Matchday 1 Bet Placed",
    stake: 19,
    placedDecimalOdds: 4.41,
    stakePlacedAt: "2026-04-03T22:34:00.000Z",
    settledAt: "2026-04-05T19:50:00.000Z",
    settlementKind: "settled",
    returnAmount: 0,
    status: "loss",
  },
  {
    id: "slip-md-2-safe",
    simulationId: "sim-md-2",
    gameWeekId: "md-2",
    proposalId: "proposal-md-2-safe",
    timelineLabel: "Matchday 2 Bet Placed",
    stake: 17,
    placedDecimalOdds: 2.45,
    stakePlacedAt: "2026-04-10T14:00:00.000Z",
    settledAt: "2026-04-13T21:55:00.000Z",
    settlementKind: "settled",
    returnAmount: 0,
    status: "loss",
  },
];
