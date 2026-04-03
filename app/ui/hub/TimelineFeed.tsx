"use client";

import { useRouter } from "next/navigation";
import {
  formatCurrency,
} from "../../../services/ledger_service";
import { getSimulatedNow } from "../../../services/league_simulation_service";
import {
  getGameWeekById,
  getMatchdayHref,
  getProposalDisplayOdds,
  getVisibleGameWeekTimelineRecords,
} from "../../../services/game_week_service";
import { formatGameWeekDateRange } from "../../../services/league_simulation_service";
import { getMembers } from "../../../repositories/user_repository";
import { getCurrentLedgerTransactions } from "../../../services/ledger_service";
import { getTimelineEvents } from "../../../repositories/timeline_event_repository";
import { getUserInitials } from "../../../services/user_service";

type TimelineEntry = {
  id: string;
  title: string;
  dateRange: string;
  status: "win" | "loss" | "cashout" | "funded" | "placed" | "voted" | "generated";
  label?: string;
  stake: string;
  stakeLabel?: string;
  odds?: string;
  oddsLabel?: string;
  potentialValue?: string;
  potentialLabel?: string;
  returnValue: string;
  returnLabel?: string;
  returnTone?: "positive" | "neutral" | "negative";
  infoLabel?: string;
  infoAvatarLabel?: string;
  infoAvatarTitle?: string;
  outcomeLabel?: string;
  timestampIso: string;
  matchdayId?: string;
};

export function TimelineFeed() {
  const simulatedNow = getSimulatedNow().getTime();
  const members = getMembers();
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
        };
        const entries = [votedEntry];

	        if (new Date(simulation.simulatedSlip.stakePlacedAt).getTime() <= simulatedNow) {
          const submitter = getTimelineSubmitter(members, `${gameWeek.id}:placed`);

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
              infoLabel: "Submitter",
              infoAvatarLabel: getUserInitials(submitter.displayName),
              infoAvatarTitle: submitter.displayName,
	            outcomeLabel: "Placed",
	            timestampIso: simulation.simulatedSlip.stakePlacedAt,
	            matchdayId: gameWeek.id,
          });
        }

        if (new Date(simulation.simulatedSlip.settledAt).getTime() <= simulatedNow) {
          const returnTone =
            simulation.simulatedSlip.settlementKind === "cashout"
              ? getCashoutReturnTone(
                  simulation.simulatedSlip.returnAmount,
                  simulation.simulatedSlip.stake,
                )
              : undefined;

          entries.push({
            id: `${gameWeek.id}-settled`,
            title: gameWeek.name.replace(/\s+Voting Stage$/i, ""),
            dateRange: formatGameWeekDateRange(gameWeek),
            status:
              simulation.simulatedSlip.settlementKind === "cashout"
                ? "cashout"
                : simulation.simulatedSlip.status,
            stake: formatCurrency(simulation.simulatedSlip.stake, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            odds: getProposalDisplayOdds(proposal),
            potentialLabel: "Potential",
            potentialValue: formatCurrency(
              simulation.simulatedSlip.stake * proposalOdds,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            ),
            returnValue: formatCurrency(simulation.simulatedSlip.returnAmount, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            returnTone,
            outcomeLabel:
              simulation.simulatedSlip.settlementKind === "cashout"
                ? "Cashout"
                : undefined,
            timestampIso: simulation.simulatedSlip.settledAt,
            matchdayId: gameWeek.id,
          });
        }

        return entries;
      },
    ),
    ...getCustomTimelineEntries(),
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

      {timelineEntries.length === 0 ? (
        <div className="hub-panel hub-empty-state">
          <h2 className="hub-panel-title">The Syndicate Is Ready To Start</h2>
          <p className="hub-subtitle">
            No syndicate activity has been recorded yet. Once the first matchday vote
            is in, your shared timeline will begin to build here.
          </p>
        </div>
      ) : null}

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
  const isNavigable = Boolean(entry.matchdayId && getGameWeekById(entry.matchdayId));
  const isWin = entry.status === "win";
  const isFundedEntry = entry.status === "funded";
  const outcomeLabel =
    entry.outcomeLabel ??
    (isWin
      ? "Won"
      : entry.status === "loss"
        ? "Lost"
        : entry.status === "cashout"
          ? "Cashout"
        : entry.status === "placed"
          ? "Placed"
        : entry.status === "voted"
          ? "Voted"
        : entry.status === "generated"
          ? "Generated"
          : "Funded");

  const navigateToMatchday = () => {
    if (!entry.matchdayId) {
      return;
    }

    router.push(
      getMatchdayHref({
        gameWeekId: entry.matchdayId,
        stage: entry.status === "voted" ? "pending" : null,
      }),
    );
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
          <div className="hub-timeline-head-row">
            <h2>{entry.title}</h2>
            {!isFundedEntry ? (
              <span className={`hub-outcome ${getTimelineStatusClassName(entry.status)}`}>
                {outcomeLabel}
              </span>
            ) : null}
          </div>
          <div className="hub-timeline-meta-row">
            {isFundedEntry ? (
              <span className={`hub-outcome ${getTimelineStatusClassName(entry.status)}`}>
                {outcomeLabel}
              </span>
            ) : (
              <span className="hub-timeline-meta-spacer" aria-hidden="true" />
            )}
            <p>{entry.dateRange}</p>
          </div>
        </div>

        {shouldShowTimelineStrategyLabel(entry) ? (
          <div className="hub-badge-row">
            {shouldShowTimelineStrategyLabel(entry) ? (
              <span className={`hub-tag ${getTimelineTagClassName(entry)}`}>
                {entry.label}
              </span>
            ) : null}
          </div>
        ) : null}

        <div
          className={`hub-stat-grid${entry.odds ? "" : " is-compact"}${
            entry.potentialValue ? " has-potential" : ""
          }${
            entry.infoAvatarLabel ? " has-info" : ""
          }`}
        >
          <div>
            <span className="hub-metric-label">{entry.stakeLabel ?? "Stake"}</span>
            <span
              className={`hub-metric-value${
                entry.status === "funded"
                  ? " hub-success-text"
                  : entry.status === "placed"
                    ? " hub-danger-text"
                    : entry.status === "voted"
                      ? ` ${getTimelineStrategyTextClassName(entry)}`
                    : ""
              }`}
            >
              {entry.stake}
            </span>
          </div>
          {entry.odds ? (
            <div>
              <span className="hub-metric-label">{entry.oddsLabel ?? "Odds"}</span>
              <span className="hub-metric-value hub-accent-text">{entry.odds}</span>
            </div>
          ) : null}
          {entry.potentialValue ? (
            <div>
              <span className="hub-metric-label">
                {entry.potentialLabel ?? "Potential"}
              </span>
              <span className="hub-metric-value hub-accent-text">
                {entry.potentialValue}
              </span>
            </div>
          ) : null}
          <div>
            <span className="hub-metric-label">{entry.returnLabel ?? "Return"}</span>
            <span
              className={`hub-metric-value ${
                entry.status === "win" || entry.status === "funded"
                  ? "hub-success-text"
                  : entry.returnTone === "positive"
                    ? "hub-success-text"
                  : entry.returnTone === "neutral"
                    ? "hub-warning-text"
                  : entry.returnTone === "negative"
                    ? "hub-danger-text"
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
          {entry.infoAvatarLabel ? (
            <div>
              <span className="hub-metric-label">{entry.infoLabel ?? "Info"}</span>
              <span
                className="hub-timeline-submitter-avatar"
                title={entry.infoAvatarTitle}
                aria-label={entry.infoAvatarTitle}
              >
                {entry.infoAvatarLabel}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function getInitialDepositTimelineEntries(): TimelineEntry[] {
  const depositEntries = [...getCurrentLedgerTransactions()]
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

function getCustomTimelineEntries(): TimelineEntry[] {
  return getTimelineEvents()
    .map((event) => {
      const gameWeek = event.matchdayId ? getGameWeekById(event.matchdayId) : null;

      const timelineEntry: TimelineEntry = {
        id: event.id,
        title: event.title,
        dateRange: formatTimelineDateTime(event.timestampIso),
        status: "generated",
        label: gameWeek?.name ?? undefined,
        stakeLabel: "Event",
        stake: event.description ?? "Local proposal slate updated",
        returnLabel: "Matchday",
        returnValue: gameWeek?.name ?? event.matchdayId ?? "Timeline",
        outcomeLabel: "Generated",
        timestampIso: event.timestampIso,
        matchdayId: gameWeek?.id,
      };

      return timelineEntry;
    })
    .sort(
      (left, right) =>
        new Date(right.timestampIso).getTime() -
        new Date(left.timestampIso).getTime(),
    );
}

function getTimelineStatusClassName(status: TimelineEntry["status"]) {
  if (status === "win") {
    return "is-win";
  }

  if (status === "loss") {
    return "is-loss";
  }

  if (status === "cashout") {
    return "is-cashed-out";
  }

  if (status === "placed") {
    return "is-placed";
  }

  if (status === "voted") {
    return "is-voted";
  }

  if (status === "generated") {
    return "is-funded";
  }

  return "is-funded";
}

function getTimelineTagClassName(entry: TimelineEntry) {
  const normalizedLabel = entry.label?.toLowerCase() ?? "";

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

  if (entry.status === "generated") {
    return "hub-tag-balanced";
  }

  return "hub-tag-safe";
}

function shouldShowTimelineStrategyLabel(entry: TimelineEntry) {
  return (
    Boolean(entry.label) &&
    entry.status !== "generated" &&
    entry.status !== "voted" &&
    entry.status !== "placed" &&
    entry.status !== "win" &&
    entry.status !== "loss"
  );
}

function getTimelineStrategyTextClassName(entry: TimelineEntry) {
  const normalizedLabel = entry.label?.toLowerCase() ?? entry.stake.toLowerCase();

  if (normalizedLabel.includes("defensive")) {
    return "hub-strategy-safe-text";
  }

  if (normalizedLabel.includes("neutral")) {
    return "hub-strategy-balanced-text";
  }

  if (normalizedLabel.includes("aggressive")) {
    return "hub-strategy-aggressive-text";
  }

  return "hub-text";
}

function getTimelineSubmitter(
  members: ReturnType<typeof getMembers>,
  seedInput: string,
) {
  const memberIndex = getTimelineSeedHash(seedInput) % Math.max(members.length, 1);
  return members[memberIndex] ?? members[0];
}

function getTimelineSeedHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function formatTimelineDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(new Date(value));
}

function getCashoutReturnTone(returnAmount: number, stakeAmount: number) {
  if (Math.abs(returnAmount - stakeAmount) < 0.005) {
    return "neutral";
  }

  return returnAmount > stakeAmount ? "positive" : "negative";
}
