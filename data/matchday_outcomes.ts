import type { MatchdayOutcomeRow } from "../types/league_simulation_type";

export const matchdayOutcomes = [
  {
    "id": "matchday-outcome-md-1",
    "gameWeekId": "md-1",
    "proposalId": "balanced",
    "outcomeStatus": "lost",
    "outcomeValueAmount": 0,
    "outcomeAtIso": "2026-04-04T15:35:00+00:00",
    "summary": "Big upset.",
    "submittedBy": "Brian Scott",
    "createdAt": "2026-04-04T22:52:43.138834+00:00",
    "updatedAt": "2026-04-04T22:52:43.138834+00:00"
  },
  {
    "id": "matchday-outcome-md-2",
    "gameWeekId": "md-2",
    "proposalId": "safe",
    "outcomeStatus": "lost",
    "outcomeValueAmount": 0,
    "outcomeAtIso": "2026-04-09T12:42:00+00:00",
    "summary": "Matchday bet lost.",
    "submittedBy": "Brian Scott",
    "createdAt": "2026-04-09T12:42:42.190313+00:00",
    "updatedAt": "2026-04-09T12:42:42.190313+00:00"
  }
] as unknown as MatchdayOutcomeRow[];
