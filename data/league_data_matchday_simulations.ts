import type { LeagueMatchdaySimulationRow } from "../types/league_simulation_type";

export const leagueDataMatchdaySimulations = [
  {
    "id": "simulation-md-1",
    "gameWeekId": "md-1",
    "voteResolvedAtIso": "2026-04-03T20:56:46.227+00:00",
    "betPlacedAtIso": "2026-04-03T22:34:00+00:00",
    "selectedProposalId": "balanced",
    "slipId": "slip-md-1"
  },
  {
    "id": "simulation-md-2",
    "gameWeekId": "md-2",
    "voteResolvedAtIso": "2026-04-09T12:41:24.574+00:00",
    "betPlacedAtIso": "2026-04-09T12:42:00+00:00",
    "selectedProposalId": "safe",
    "slipId": "slip-md-2"
  }
] as unknown as LeagueMatchdaySimulationRow[];
