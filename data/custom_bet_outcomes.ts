import type { CustomBetOutcomeRow } from "../types/league_simulation_type";

export const customBetOutcomes = [
  {
    "id": "outcome-europa-2026",
    "customBetId": "custom-bet-2026-04-09-porto-bologna-bet-builder",
    "outcomeStatus": "lost",
    "outcomeValueAmount": 0,
    "outcomeAtIso": "2026-04-09T22:15:00+00:00",
    "summary": "Bet builder failed on Bologna vs Villa result (Villa 3-1).",
    "submittedBy": "Brian Scott",
    "createdAt": "2026-04-15T21:01:12.448834+00:00",
    "updatedAt": "2026-04-15T21:01:12.448834+00:00"
  },
  {
    "id": "outcome-masters-2026",
    "customBetId": "custom-bet-2026-04-09-masters-tournament-win",
    "outcomeStatus": "won",
    "outcomeValueAmount": 12.5,
    "outcomeAtIso": "2026-04-12T22:00:00+00:00",
    "summary": "Scottie Scheffler finished 2nd. Each Way return paid £12.50.",
    "submittedBy": "Brian Scott",
    "createdAt": "2026-04-15T21:01:12.448834+00:00",
    "updatedAt": "2026-04-15T21:01:12.448834+00:00"
  },
  {
    "id": "outcome-national-2026",
    "customBetId": "custom-bet-2026-04-11-grand-national-win",
    "outcomeStatus": "lost",
    "outcomeValueAmount": 0,
    "outcomeAtIso": "2026-04-11T17:00:00+00:00",
    "summary": "User confirmed loss despite top pick I Am Maximus winning the race.",
    "submittedBy": "Brian Scott",
    "createdAt": "2026-04-15T21:01:12.448834+00:00",
    "updatedAt": "2026-04-15T21:01:12.448834+00:00"
  }
] as unknown as CustomBetOutcomeRow[];
