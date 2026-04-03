import type { TimelineEventRecord } from "../types/timeline_type";

export const timelineEvents: TimelineEventRecord[] = [
  {
    id: "timeline-md-1-proposal-generated",
    title: "Next Matchday Proposal Generated",
    description: "Local Ladbrokes proposal slate regenerated for Matchday 1.",
    timestampIso: "2026-04-03T14:47:00.000Z",
    kind: "matchday_proposal_generated",
    matchdayId: "md-1",
  },
];
