"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { BetLineInsight, ProposalBetLine } from "../../../repositories/gameWeekRepository";
import { MatchBetSummaryRow } from "./MatchBetSummaryRow";

type TimelineEntry = {
  title: string;
  dateRange: string;
  status: "win" | "loss";
  label: string;
  stake: string;
  odds?: string;
  returnValue: string;
  legs?: number;
  betLines?: Array<{
    betLine: ProposalBetLine;
    displayOdds: string;
    insight?: BetLineInsight | null;
    settlementStatus?: "won" | "lost";
  }>;
};

const timelineEntries: TimelineEntry[] = [
  {
    title: "Matchday 31",
    dateRange: "Feb 10 - Feb 12",
    status: "win",
    label: "Mid-Risk AI Pick",
    stake: "GBP 50.00",
    odds: "5.50",
    returnValue: "GBP 275.00",
    legs: 4,
    betLines: [
      {
        betLine: {
          label: "Arsenal vs West Ham: Arsenal -1.5 Handicap",
          scheduleNote: "Sat 10 Feb, 17:30 GMT",
          odds: "2.10",
        },
        displayOdds: "2.10",
        insight: {
          aiReasoning: "Arsenal's home dominance supported a stronger handicap angle.",
          sequenceReasoning:
            "This landed as a mid-sequence leg in the archived acca build.",
        },
        settlementStatus: "won",
      },
    ],
  },
];

export function TimelineFeed() {
  return (
    <section className="hub-wide">
      <div className="hub-page-copy">
        <h1 className="hub-title">Timeline</h1>
        <p className="hub-subtitle">
          Chronological record of all syndicate accumulator plays by matchday.
        </p>
      </div>

      <div className="hub-timeline">
        {timelineEntries.map((entry) => (
          <TimelineMatchday key={entry.title} entry={entry} />
        ))}
      </div>
    </section>
  );
}

function TimelineMatchday({ entry }: { entry: TimelineEntry }) {
  const [expandedBetLineLabel, setExpandedBetLineLabel] = useState<
    string | null
  >(null);
  const isWin = entry.status === "win";

  return (
    <article className="hub-timeline-item">
      <div className={`hub-timeline-dot ${isWin ? "is-win" : "is-loss"}`} />
      <div className={`hub-timeline-card${isWin ? "" : " is-muted"}`}>
        <div className="hub-timeline-head">
          <div>
            <h2>{entry.title}</h2>
            <p>{entry.dateRange}</p>
          </div>
          <span className={`hub-outcome ${isWin ? "is-win" : "is-loss"}`}>
            {isWin ? "Won" : "Lost"}
          </span>
        </div>

        <div className="hub-badge-row">
          <span className={`hub-tag ${isWin ? "hub-tag-balanced" : "hub-tag-muted"}`}>
            {entry.label}
          </span>
          {entry.legs ? (
            <span className="hub-inline-meta">
              <ChevronRight size={14} />
              {entry.legs} legs
            </span>
          ) : null}
        </div>

        <div className={`hub-stat-grid${entry.odds ? "" : " is-compact"}`}>
          <div>
            <span className="hub-metric-label">Stake</span>
            <span className="hub-metric-value">{entry.stake}</span>
          </div>
          {entry.odds ? (
            <div>
              <span className="hub-metric-label">Odds</span>
              <span className="hub-metric-value hub-accent-text">{entry.odds}</span>
            </div>
          ) : null}
          <div>
            <span className="hub-metric-label">Return</span>
            <span
              className={`hub-metric-value ${
                isWin ? "hub-success-text" : ""
              }`}
            >
              {entry.returnValue}
            </span>
          </div>
        </div>

        {entry.betLines?.length ? (
          <div className="hub-bet-lines">
            {entry.betLines.map((item) => (
              <MatchBetSummaryRow
                key={item.betLine.label}
                betLine={item.betLine}
                displayOdds={item.displayOdds}
                insight={item.insight}
                settlementStatus={item.settlementStatus}
                isExpanded={expandedBetLineLabel === item.betLine.label}
                onToggle={() =>
                  setExpandedBetLineLabel((previous) =>
                    previous === item.betLine.label ? null : item.betLine.label,
                  )
                }
              />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
