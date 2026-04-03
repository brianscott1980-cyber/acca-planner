export type TimelineEventKind = "matchday_proposal_generated";

export type TimelineEventRecord = {
  id: string;
  title: string;
  description?: string;
  timestampIso: string;
  kind: TimelineEventKind;
  matchdayId?: string;
};
