import type { LeagueSimulationSlipRow } from "../types/league_simulation_type";

export const leagueDataSlips = [
  {
    "id": "slip-md-1",
    "simulationId": "simulation-md-1",
    "gameWeekId": "md-1",
    "proposalId": "balanced",
    "timelineLabel": "Balanced Accumulator",
    "stake": 19,
    "stakePlacedAt": "2026-04-03T22:34:00+00:00",
    "settledAt": "2026-04-04T15:35:00+00:00",
    "settlementKind": "settled",
    "returnAmount": 0,
    "status": "loss",
    "placedDecimalOdds": 3.6,
    "isFreeStake": null
  },
  {
    "id": "slip-md-2",
    "simulationId": "simulation-md-2",
    "gameWeekId": "md-2",
    "proposalId": "safe",
    "timelineLabel": "Defensive Accumulator",
    "stake": 16,
    "stakePlacedAt": "2026-04-09T12:42:00+00:00",
    "settledAt": "2026-04-09T12:42:00+00:00",
    "settlementKind": "settled",
    "returnAmount": 0,
    "status": "loss",
    "placedDecimalOdds": 3.77,
    "isFreeStake": null
  },
  {
    "id": "slip-md-3",
    "simulationId": "simulation-md-3",
    "gameWeekId": "md-3",
    "proposalId": "safe",
    "timelineLabel": "Defensive Accumulator",
    "stake": 7,
    "stakePlacedAt": "2026-05-17T11:14:46.603+00:00",
    "settledAt": "2026-05-24T11:14:46.603+00:00",
    "settlementKind": "settled",
    "returnAmount": 0,
    "status": "loss",
    "placedDecimalOdds": null,
    "isFreeStake": null
  }
] as unknown as LeagueSimulationSlipRow[];
