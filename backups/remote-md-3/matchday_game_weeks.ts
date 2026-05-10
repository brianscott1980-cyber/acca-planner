import type { MatchdayGameWeekRecord } from "../types/matchday_type";

export const matchdayGameWeeks = [
  {
    "id": "md-1",
    "slug": "matchday-1",
    "name": "Matchday 1 Voting Stage",
    "description": "Fresh Ladbrokes weekend slate for the opening April window, with the pot still at the original GBP70 baseline and no settled betting run pushing the AI away from a balanced call.",
    "windowStartIso": "2026-04-04T08:00:00+00:00",
    "windowEndIso": "2026-04-06T22:00:00+00:00",
    "startsIn": "Starts tomorrow",
    "proposalIds": [
      "proposal-md-1-safe",
      "proposal-md-1-balanced",
      "proposal-md-1-aggressive"
    ],
    "votesByUserId": {
      "brian-scott": "balanced",
      "paul-devine": "balanced",
      "tony-mclean": "aggressive",
      "alasdair-head": "aggressive",
      "derek-mcmillan": "balanced",
      "john-colreavey": "balanced"
    },
    "simulatedSlip": {
      "stake": 19,
      "status": "loss",
      "settledAt": "2026-04-06T22:00:00+00:00",
      "proposalId": "balanced",
      "returnAmount": 0,
      "stakePlacedAt": "2026-04-03T22:34:00+00:00",
      "timelineLabel": "Matchday 1 Result",
      "settlementKind": "settled",
      "placedDecimalOdds": 4.41
    }
  },
  {
    "id": "md-2",
    "slug": "matchday-2",
    "name": "Matchday 2 Voting Stage",
    "description": "Midweek European card focused on this evening's Champions League ties and the Europa follow-up, with the pot now at GBP51 after Matchday 1 so the recommendation tilts more protective.",
    "windowStartIso": "2026-04-08T16:30:00+00:00",
    "windowEndIso": "2026-04-09T22:30:00+00:00",
    "startsIn": "Live tonight",
    "proposalIds": [
      "proposal-md-2-safe",
      "proposal-md-2-balanced",
      "proposal-md-2-aggressive"
    ],
    "votesByUserId": {
      "paul-devine": "safe"
    },
    "simulatedSlip": {
      "stake": 10,
      "status": "loss",
      "settledAt": "2026-04-09T22:30:00+00:00",
      "proposalId": "safe",
      "returnAmount": 0,
      "stakePlacedAt": "2026-04-09T12:42:00+00:00",
      "timelineLabel": "Matchday 2 Result",
      "settlementKind": "settled",
      "placedDecimalOdds": 3.77
    }
  },
  {
    "id": "md-3",
    "slug": "matchday-3",
    "name": "Matchday 3 Voting Stage",
    "description": "High-stakes weekend card after a period of consolidation. The pot stands at GBP27.65, so the focus is on a high-probability win to sustain the next run of European fixtures.",
    "windowStartIso": "2026-04-18T08:00:00+00:00",
    "windowEndIso": "2026-04-20T22:00:00+00:00",
    "startsIn": "Opens this weekend",
    "proposalIds": [
      "proposal-md-3-safe",
      "proposal-md-3-balanced",
      "proposal-md-3-aggressive"
    ],
    "votesByUserId": {
      "brian_scott": "balanced",
      "paul_devine": "balanced",
      "alasdair_head": "safe",
      "paul_melville": "safe",
      "derek_mcmillan": "aggressive",
      "john_colreavey": "safe"
    },
    "simulatedSlip": null
  }
] as unknown as MatchdayGameWeekRecord[];
