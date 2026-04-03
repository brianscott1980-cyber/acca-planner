import type { MatchdayGameWeekRecord } from "../types/matchday_type";

export const matchdayGameWeeks: MatchdayGameWeekRecord[] = [
  {
    id: "md-1",
    slug: "matchday-1",
    name: "Matchday 1 Voting Stage",
    description:
      "Weekend Ladbrokes slate built from Spain, Germany, and Italy prices for the 4-6 April window.",
    windowStartIso: "2026-04-04T08:00:00.000Z",
    windowEndIso: "2026-04-06T22:00:00.000Z",
    startsIn: "Weekend voting slate is live",
    proposalIds: [
      "md-1-proposal-safe",
      "md-1-proposal-balanced",
      "md-1-proposal-aggressive",
    ],
    votesByUserId: {},
  },
];
