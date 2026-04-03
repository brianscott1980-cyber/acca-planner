import type { LeagueSimulationLegResultRow } from "../types/league_simulation_type";

export const leagueDataLegResults: LeagueSimulationLegResultRow[] = [
  {
    "id": "md-32:defensive:slip:leg:1",
    "simulationId": "md-32:simulation",
    "slipId": "md-32:defensive:slip",
    "gameWeekId": "md-32",
    "sortOrder": 0,
    "betLineLabel": "Arsenal v Bournemouth: Arsenal Draw No Bet",
    "kickoffAt": "2026-04-11T11:30:00.000Z",
    "settledAt": "2026-04-11T13:30:00.000Z",
    "finalScore": "Arsenal 4-0 Bournemouth",
    "status": "won",
    "actualStatus": "won"
  },
  {
    "id": "md-32:defensive:slip:leg:2",
    "simulationId": "md-32:simulation",
    "slipId": "md-32:defensive:slip",
    "gameWeekId": "md-32",
    "sortOrder": 1,
    "betLineLabel": "Liverpool v Fulham: Over 1.5 Goals",
    "kickoffAt": "2026-04-11T16:30:00.000Z",
    "settledAt": "2026-04-11T18:21:00.000Z",
    "finalScore": "Liverpool 1-0 Fulham",
    "status": "cashed_out",
    "actualStatus": "lost"
  },
  {
    "id": "md-32:defensive:slip:leg:3",
    "simulationId": "md-32:simulation",
    "slipId": "md-32:defensive:slip",
    "gameWeekId": "md-32",
    "sortOrder": 2,
    "betLineLabel": "Chelsea v Man City: Over 1.5 Goals",
    "kickoffAt": "2026-04-12T15:30:00.000Z",
    "settledAt": "2026-04-12T17:18:00.000Z",
    "finalScore": "Chelsea 2-0 Man City",
    "status": "cashed_out",
    "actualStatus": "won"
  }
];
