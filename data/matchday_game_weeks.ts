import type { MatchdayGameWeekRecord } from "../types/matchday_type";

export const matchdayGameWeeks: MatchdayGameWeekRecord[] = [
  {
    id: "md-1",
    slug: "matchday-1",
    name: "Matchday 1 Voting Stage",
    description:
      "Fresh Ladbrokes weekend slate for the opening April window, with the pot still at the original GBP70 baseline and no settled betting run pushing the AI away from a balanced call.",
    windowStartIso: "2026-04-04T08:00:00.000Z",
    windowEndIso: "2026-04-06T22:00:00.000Z",
    startsIn: "Starts tomorrow",
    proposalIds: [
      "proposal-md-1-safe",
      "proposal-md-1-balanced",
      "proposal-md-1-aggressive",
    ],
    votesByUserId: {},
  },
  {
    id: "md-2",
    slug: "matchday-2",
    name: "Matchday 2 Voting Stage",
    description:
      "After a full-loss opener, this slate leans more protective: stronger home anchors remain central, with only controlled away-favourite exposure in higher-risk variants.",
    windowStartIso: "2026-04-11T08:00:00.000Z",
    windowEndIso: "2026-04-13T22:00:00.000Z",
    startsIn: "Starts Saturday",
    proposalIds: [
      "proposal-md-2-safe",
      "proposal-md-2-balanced",
      "proposal-md-2-aggressive",
    ],
    votesByUserId: {},
  },
];
