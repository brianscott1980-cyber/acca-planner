"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ledgerData } from "../../../data/ledgerData";
import {
  formatCurrency,
} from "./ledgerService";
import { getSimulatedNow } from "../../../repositories/leagueSimulationRepository";
import {
  getBetLineDisplayOdds,
  getBetLineInsight,
  getProposalDisplayOdds,
  getVisibleGameWeekTimelineRecords,
  type BetLineInsight,
  type ProposalBetLine,
} from "../../../repositories/gameWeekRepository";
import { formatGameWeekDateRange } from "../../../repositories/leagueSimulationRepository";
import { MatchBetSummaryRow } from "./MatchBetSummaryRow";

type TimelineEntry = {
  id: string;
  title: string;
  dateRange: string;
  status: "win" | "loss" | "funded" | "placed" | "voted";
  label: string;
  stake: string;
  stakeLabel?: string;
  odds?: string;
  oddsLabel?: string;
  returnValue: string;
  returnLabel?: string;
  outcomeLabel?: string;
  timestampIso: string;
  matchdayId?: string;
  decisionParam?: string;
  legs?: number;
  betLines?: Array<{
    betLine: ProposalBetLine;
    displayOdds: string;
    insight?: BetLineInsight | null;
    settlementStatus?: "won" | "lost";
  }>;
};

export function TimelineFeed() {
  const simulatedNow = getSimulatedNow().getTime();
  const timelineEntries: TimelineEntry[] = [
    ...getVisibleGameWeekTimelineRecords().flatMap(
      ({ gameWeek, proposal, simulation }) => {
        const proposalOdds = Number.parseFloat(getProposalDisplayOdds(proposal));
        const voteCount = Object.values(simulation.votesByUserId).filter(
          (vote) => vote === simulation.selectedProposalId,
        ).length;
        const votedEntry: TimelineEntry = {
          id: `${gameWeek.id}-voted`,
          title: `${gameWeek.name.replace(/\s+Voting Stage$/i, "")} Vote Resolved`,
          dateRange: formatTimelineDateTime(simulation.voteResolvedAtIso),
          status: "voted",
          label: `${proposal.title} selected`,
          stakeLabel: "Outcome",
          stake: proposal.title,
          returnLabel: "Votes",
          returnValue: `${voteCount}/${Object.keys(simulation.votesByUserId).length}`,
          outcomeLabel: "Voted",
          timestampIso: simulation.voteResolvedAtIso,
          matchdayId: gameWeek.id,
          decisionParam: simulation.selectedProposalId,
        };
        const entries = [votedEntry];

        if (new Date(simulation.simulatedSlip.stakePlacedAt).getTime() <= simulatedNow) {
          entries.push({
            id: `${gameWeek.id}-placed`,
            title: `${gameWeek.name.replace(/\s+Voting Stage$/i, "")} Bet Placed`,
            dateRange: formatTimelineDateTime(simulation.simulatedSlip.stakePlacedAt),
            status: "placed",
            label: simulation.simulatedSlip.timelineLabel,
            stakeLabel: "Stake",
            stake: formatCurrency(simulation.simulatedSlip.stake, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            odds: getProposalDisplayOdds(proposal),
            oddsLabel: "Odds",
            returnLabel: "Potential",
            returnValue: formatCurrency(simulation.simulatedSlip.stake * proposalOdds, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            outcomeLabel: "Placed",
            timestampIso: simulation.simulatedSlip.stakePlacedAt,
            matchdayId: gameWeek.id,
            decisionParam: simulation.selectedProposalId,
            legs: proposal.legs,
          });
        }

        if (new Date(simulation.simulatedSlip.settledAt).getTime() <= simulatedNow) {
          entries.push({
            id: `${gameWeek.id}-settled`,
            title: gameWeek.name.replace(/\s+Voting Stage$/i, ""),
            dateRange: formatGameWeekDateRange(gameWeek),
            status: simulation.simulatedSlip.status,
            label: simulation.simulatedSlip.timelineLabel,
            stake: formatCurrency(simulation.simulatedSlip.stake, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            odds: getProposalDisplayOdds(proposal),
            returnValue: formatCurrency(simulation.simulatedSlip.returnAmount, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            timestampIso: simulation.simulatedSlip.settledAt,
            matchdayId: gameWeek.id,
            decisionParam: simulation.selectedProposalId,
            legs: proposal.legs,
            betLines: proposal.betLines.map((betLine) => ({
              betLine,
              displayOdds: getBetLineDisplayOdds(betLine),
              insight: getBetLineInsight(proposal, betLine),
              settlementStatus:
                simulation.simulatedSlip.status === "win" ? "won" : "lost",
            })),
          });
        }

        return entries;
      },
    ),
    ...getInitialDepositTimelineEntries(),
  ].sort(
    (left, right) =>
      new Date(right.timestampIso).getTime() -
      new Date(left.timestampIso).getTime(),
  );

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
          <TimelineMatchday key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}

function TimelineMatchday({ entry }: { entry: TimelineEntry }) {
  const router = useRouter();
  const [expandedBetLineLabel, setExpandedBetLineLabel] = useState<
    string | null
  >(null);
  const isNavigable = Boolean(entry.matchdayId);
  const isWin = entry.status === "win";
  const outcomeLabel =
    entry.outcomeLabel ??
    (isWin
      ? "Won"
      : entry.status === "loss"
        ? "Lost"
        : entry.status === "placed"
          ? "Placed"
          : entry.status === "voted"
            ? "Voted"
          : "Funded");

  const navigateToMatchday = () => {
    if (!entry.matchdayId) {
      return;
    }

    const searchParams = new URLSearchParams({ matchday: entry.matchdayId });

    if (entry.decisionParam) {
      searchParams.set("decision", entry.decisionParam);
    }

    router.push(`/matchday?${searchParams.toString()}`);
  };

  return (
    <article className="hub-timeline-item">
      <div className={`hub-timeline-dot ${getTimelineStatusClassName(entry.status)}`} />
      <div
        className={`hub-timeline-card${entry.status === "loss" ? " is-muted" : ""}${
          isNavigable ? " is-clickable" : ""
        }`}
        role={isNavigable ? "link" : undefined}
        tabIndex={isNavigable ? 0 : undefined}
        onClick={(event) => {
          if (
            !isNavigable ||
            !(event.target instanceof HTMLElement) ||
            event.target.closest("button")
          ) {
            return;
          }

          navigateToMatchday();
        }}
        onKeyDown={(event) => {
          if (!isNavigable || (event.key !== "Enter" && event.key !== " ")) {
            return;
          }

          event.preventDefault();
          navigateToMatchday();
        }}
      >
        <div className="hub-timeline-head">
          <div>
            <h2>{entry.title}</h2>
            <p>{entry.dateRange}</p>
          </div>
          <span className={`hub-outcome ${getTimelineStatusClassName(entry.status)}`}>
            {outcomeLabel}
          </span>
        </div>

        <div className="hub-badge-row">
          <span className={`hub-tag ${getTimelineTagClassName(entry)}`}>
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
            <span className="hub-metric-label">{entry.stakeLabel ?? "Stake"}</span>
            <span className="hub-metric-value">{entry.stake}</span>
          </div>
          {entry.odds ? (
            <div>
              <span className="hub-metric-label">{entry.oddsLabel ?? "Odds"}</span>
              <span className="hub-metric-value hub-accent-text">{entry.odds}</span>
            </div>
          ) : null}
          <div>
            <span className="hub-metric-label">{entry.returnLabel ?? "Return"}</span>
            <span
              className={`hub-metric-value ${
                entry.status === "win" || entry.status === "funded"
                  ? "hub-success-text"
                  : entry.status === "placed"
                    ? "hub-accent-text"
                  : entry.status === "voted"
                    ? "hub-text"
                  : ""
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

function getInitialDepositTimelineEntries(): TimelineEntry[] {
  const depositEntries = [...ledgerData]
    .filter((entry) => entry.kind === "deposit")
    .sort(
      (left, right) =>
        new Date(left.dateIso).getTime() - new Date(right.dateIso).getTime(),
    );

  if (depositEntries.length === 0) {
    return [];
  }

  const firstDepositDateKey = depositEntries[0].dateIso.slice(0, 10);
  const openingDeposits = depositEntries.filter(
    (entry) => entry.dateIso.slice(0, 10) === firstDepositDateKey,
  );

  if (openingDeposits.length === 0) {
    return [];
  }

  const perPlayerAmount = openingDeposits[0].amount;
  const totalPot = openingDeposits.reduce((sum, entry) => sum + entry.amount, 0);
  const dateRange = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(openingDeposits[0].dateIso));

  return [
    {
      id: "collective-deposit",
      title: "Collective Deposit",
      dateRange,
      status: "funded",
      label: `${openingDeposits.length} players x ${formatCurrency(perPlayerAmount, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} each`,
      stakeLabel: "Deposits",
      stake: `${openingDeposits.length} x ${formatCurrency(perPlayerAmount, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      returnLabel: "Pot",
      returnValue: formatCurrency(totalPot, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      outcomeLabel: "Funded",
      timestampIso: openingDeposits[0].dateIso,
    },
  ];
}

function getTimelineStatusClassName(status: TimelineEntry["status"]) {
  if (status === "win") {
    return "is-win";
  }

  if (status === "loss") {
    return "is-loss";
  }

  if (status === "placed") {
    return "is-placed";
  }

  if (status === "voted") {
    return "is-voted";
  }

  return "is-funded";
}

function getTimelineTagClassName(entry: TimelineEntry) {
  const normalizedLabel = entry.label.toLowerCase();

  if (normalizedLabel.includes("defensive")) {
    return "hub-tag-safe";
  }

  if (normalizedLabel.includes("neutral")) {
    return "hub-tag-balanced";
  }

  if (normalizedLabel.includes("aggressive")) {
    return "hub-tag-aggressive";
  }

  if (entry.status === "win") {
    return "hub-tag-balanced";
  }

  if (entry.status === "loss") {
    return "hub-tag-muted";
  }

  return "hub-tag-safe";
}

function formatTimelineDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
