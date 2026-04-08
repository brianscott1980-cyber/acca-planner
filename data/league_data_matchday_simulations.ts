import type { LeagueMatchdaySimulationRow } from "../types/league_simulation_type";

export const leagueDataMatchdaySimulations: LeagueMatchdaySimulationRow[] = [
  {
    id: "sim-md-1",
    gameWeekId: "md-1",
    voteResolvedAtIso: "2026-04-03T22:00:00.000Z",
    betPlacedAtIso: "2026-04-03T22:34:00.000Z",
    selectedProposalId: "proposal-md-1-balanced",
    slipId: "slip-md-1-balanced",
  },
  {
    id: "sim-md-2",
    gameWeekId: "md-2",
    voteResolvedAtIso: "2026-04-10T23:00:00.000Z",
    betPlacedAtIso: "2026-04-10T14:00:00.000Z",
    selectedProposalId: "proposal-md-2-safe",
    slipId: "slip-md-2-safe",
  },
];
