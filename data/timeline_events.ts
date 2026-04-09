import type { TimelineEventRecord } from "../types/timeline_type";

export const timelineEvents = [
  {
    "id": "timeline-md-1-proposal-generated",
    "title": "Next Matchday Proposal Generated",
    "description": "Local Ladbrokes proposal slate regenerated for Matchday 1.",
    "timestampIso": "2026-04-03T14:47:00+00:00",
    "kind": "matchday_proposal_generated",
    "matchdayId": "md-1"
  },
  {
    "id": "timeline-md-2-proposal-generated",
    "title": "Matchday AI Analysis Ready",
    "description": "Defensive: 3.77\nBalanced: 5.12\nAggressive: 15.41\nAI recommended: Defensive",
    "timestampIso": "2026-04-08T17:18:00+00:00",
    "kind": "matchday_proposal_generated",
    "matchdayId": "md-2"
  },
  {
    "id": "timeline-md-3-proposal-generated",
    "title": "Matchday AI Analysis Ready",
    "description": "Defensive: 3.04\nBalanced: 4.65\nAggressive: 21.75\nAI recommended: Defensive",
    "timestampIso": "2026-04-09T18:25:00+00:00",
    "kind": "matchday_proposal_generated",
    "matchdayId": "md-3"
  }
] as unknown as TimelineEventRecord[];
