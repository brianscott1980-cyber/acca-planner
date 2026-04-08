import type { TimelineEventRecord } from "../types/timeline_type";

export const timelineEvents: TimelineEventRecord[] = [
  {
    id: "timeline-md-1-proposal-generated",
    title: "Matchday AI Analysis Ready",
    description:
      "Defensive: 3.27\nBalanced: 4.41\nAggressive: 7.37\nAI recommended: Balanced",
    timestampIso: "2026-04-03T14:47:00.000Z",
    kind: "matchday_proposal_generated",
    matchdayId: "md-1",
  },
  {
    id: "timeline-md-2-proposal-generated",
    title: "Matchday AI Analysis Ready",
    description:
      "Defensive: 2.20\nBalanced: 3.60\nAggressive: 13.49\nAI recommended: Defensive",
    timestampIso: "2026-04-07T11:30:00.000Z",
    kind: "matchday_proposal_generated",
    matchdayId: "md-2",
  },
];
