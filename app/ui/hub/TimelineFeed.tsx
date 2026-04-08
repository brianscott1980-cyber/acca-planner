"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Flag, Wallet } from "lucide-react";
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
import { getCustomBetHref } from "../../../services/custom_bet_service";
import { formatGameWeekDateRange } from "../../../services/league_simulation_service";
import { getMembers } from "../../../repositories/user_repository";
import { getCurrentLedgerTransactions } from "../../../services/ledger_service";
import { getCustomBets } from "../../../repositories/custom_bet_repository";
import { getTimelineEvents } from "../../../repositories/timeline_event_repository";
import { getUserInitials } from "../../../services/user_service";
import { GolfBallIcon, HorseHeadIcon, SoccerBallIcon } from "./SportIcons";

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
  customBetId?: string;
  multilineStake?: boolean;
  generatedStrategies?: GeneratedStrategySummary[];
  iconKind: "football" | "horse_racing" | "golf" | "money";
};

type GeneratedStrategySummary = {
  id: string;
  label: string;
  odds: string;
  riskLevel: "safe" | "balanced" | "aggressive";
  isRecommended: boolean;
};

export function TimelineFeed() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const timelineEntries = isHydrated ? buildTimelineEntries() : [];

  return (
    <section className="hub-wide">
      <div className="hub-page-copy">
        <h1 className="hub-title">Timeline</h1>
        <p className="hub-subtitle">
          Chronological record of syndicate matchdays and one-off custom bets.
        </p>
      </div>

      {!isHydrated ? (
        <div className="hub-panel hub-empty-state">
          <h2 className="hub-panel-title">Loading Timeline</h2>
          <p className="hub-subtitle">Syncing the latest timeline view.</p>
        </div>
      ) : null}

      {isHydrated && timelineEntries.length === 0 ? (
        <div className="hub-panel hub-empty-state">
          <h2 className="hub-panel-title">The Syndicate Is Ready To Start</h2>
          <p className="hub-subtitle">
            No syndicate activity has been recorded yet. Once the first matchday vote
            is in, your shared timeline will begin to build here.
          </p>
        </div>
      ) : null}

      {isHydrated ? (
        <div className="hub-timeline">
          {timelineEntries.map((entry) => (
            <TimelineMatchday key={entry.id} entry={entry} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function buildTimelineEntries(): TimelineEntry[] {
  const simulatedNow = getSimulatedNow().getTime();
  const members = getMembers();

  return [
    ...getVisibleGameWeekTimelineRecords().flatMap(({ gameWeek, proposal, simulation }) => {
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
        iconKind: "football",
      };
      const entries = [votedEntry];

      if (new Date(simulation.simulatedSlip.stakePlacedAt).getTime() <= simulatedNow) {
        const placedDecimalOdds = simulation.simulatedSlip.placedDecimalOdds;
        const hasPlacedDecimalOdds =
          typeof placedDecimalOdds === "number" && Number.isFinite(placedDecimalOdds);
        const displayOdds = hasPlacedDecimalOdds
          ? placedDecimalOdds.toFixed(2)
          : getProposalDisplayOdds(proposal);
        const effectiveOdds = hasPlacedDecimalOdds
          ? placedDecimalOdds
          : Number.parseFloat(getProposalDisplayOdds(proposal));
        const submitterName =
          getStakeSubmitterNameForMatchday(gameWeek.id) ??
          getTimelineSubmitter(members, `${gameWeek.id}:placed`).displayName;

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
          odds: displayOdds,
          oddsLabel: "Odds",
          returnLabel: "Potential",
          returnValue: formatCurrency(simulation.simulatedSlip.stake * effectiveOdds, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          infoLabel: "Submitter",
          infoAvatarLabel: getUserInitials(submitterName),
          infoAvatarTitle: submitterName,
          outcomeLabel: "Placed",
          timestampIso: simulation.simulatedSlip.stakePlacedAt,
          matchdayId: gameWeek.id,
          iconKind: "football",
        });
      }

      if (new Date(simulation.simulatedSlip.settledAt).getTime() <= simulatedNow) {
        const placedDecimalOdds = simulation.simulatedSlip.placedDecimalOdds;
        const hasPlacedDecimalOdds =
          typeof placedDecimalOdds === "number" && Number.isFinite(placedDecimalOdds);
        const displayOdds = hasPlacedDecimalOdds
          ? placedDecimalOdds.toFixed(2)
          : getProposalDisplayOdds(proposal);
        const effectiveOdds = hasPlacedDecimalOdds
          ? placedDecimalOdds
          : Number.parseFloat(getProposalDisplayOdds(proposal));
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
          odds: displayOdds,
          potentialLabel: "Potential",
          potentialValue: formatCurrency(
            simulation.simulatedSlip.stake * effectiveOdds,
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
            simulation.simulatedSlip.settlementKind === "cashout" ? "Cashout" : undefined,
          timestampIso: simulation.simulatedSlip.settledAt,
          matchdayId: gameWeek.id,
          iconKind: "football",
        });
      }

      return entries;
    }),
    ...getCustomBetTimelineEntries(),
    ...getCustomTimelineEntries(),
    ...getInitialDepositTimelineEntries(),
  ].sort(
    (left, right) =>
      new Date(right.timestampIso).getTime() - new Date(left.timestampIso).getTime(),
  );
}

function TimelineMatchday({ entry }: { entry: TimelineEntry }) {
  const router = useRouter();
  const isNavigable = Boolean(entry.matchdayId || entry.customBetId);
  const isWin = entry.status === "win";
  const isFundedEntry = entry.status === "funded";
  const hasGeneratedStrategies =
    entry.status === "generated" &&
    Boolean(entry.generatedStrategies && entry.generatedStrategies.length > 0);
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

  const navigateToEntry = () => {
    if (entry.customBetId) {
      router.push(getCustomBetHref(entry.customBetId));
      return;
    }

    if (!entry.matchdayId) {
      return;
    }

    router.push(getMatchdayHref({
      gameWeekId: entry.matchdayId,
      stage: entry.status === "voted" ? "pending" : null,
    }));
  };

  return (
    <article className="hub-timeline-item">
      <div className={`hub-timeline-dot ${getTimelineDotClassName(entry.iconKind)}`} />
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

          navigateToEntry();
        }}
        onKeyDown={(event) => {
          if (!isNavigable || (event.key !== "Enter" && event.key !== " ")) {
            return;
          }

          event.preventDefault();
          navigateToEntry();
        }}
      >
        <div className="hub-timeline-content-row">
          <div className={`hub-proposal-icon ${getTimelineIconClassName(entry.iconKind)}`}>
            {renderTimelineEntryIcon(entry.iconKind)}
          </div>
          <div className="hub-timeline-content">
            <div className="hub-timeline-head">
              <div className="hub-timeline-head-row">
                <h2>{entry.title}</h2>
                <span className={`hub-outcome ${getTimelineStatusClassName(entry.status)}`}>
                  {outcomeLabel}
                </span>
              </div>
              <div className="hub-timeline-meta-row">
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

            {hasGeneratedStrategies ? (
              <div className="hub-generated-strategy-row">
                {entry.generatedStrategies?.map((strategy) => (
                  <div
                    key={strategy.id}
                    className={`hub-generated-strategy-card ${getGeneratedStrategyClassName(
                      strategy.riskLevel,
                    )}`}
                  >
                    <span className="hub-generated-strategy-label">{strategy.label}</span>
                    <div className="hub-generated-strategy-odds-row">
                      <span className="hub-generated-strategy-odds">{strategy.odds}</span>
                      {strategy.isRecommended ? (
                        <span className="hub-ai-tag">AI</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`hub-stat-grid${entry.odds ? "" : " is-compact"}${
                  entry.potentialValue ? " has-potential" : ""
                }${
                  entry.infoAvatarLabel ? " has-info" : ""
                }${
                  entry.status === "placed" && entry.matchdayId
                    ? " has-mobile-hidden-info"
                    : ""
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
                    }${entry.multilineStake ? " is-multiline" : ""}`}
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
                  <div
                    className={`hub-timeline-info-cell${
                      entry.status === "placed" && entry.matchdayId
                        ? " hub-timeline-info-cell-hide-mobile"
                        : ""
                    }`}
                  >
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
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function getCustomBetTimelineEntries(): TimelineEntry[] {
  return getCustomBets().flatMap((customBet) => {
    const baseEntry: TimelineEntry = {
      id: `custom-bet-${customBet.id}`,
      title: customBet.timelineTitle,
      dateRange: formatTimelineDateTime(customBet.placedAtIso ?? customBet.generatedAtIso),
      status: customBet.state === "staked" ? "placed" : "generated",
      label: `${formatCustomBetSport(customBet.sport)} · ${customBet.eventName}`,
      stakeLabel: "Event",
      stake: `${customBet.eventName}\n${customBet.competitionName}`,
      multilineStake: true,
      oddsLabel: customBet.state === "staked" ? "Stake" : "Recommendation",
      odds:
        customBet.state === "staked"
          ? customBet.stakeAmount !== undefined
            ? formatCurrency(customBet.stakeAmount, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "N/A"
          : customBet.recommendedSelection,
      returnLabel: customBet.state === "staked" ? "Placed Odds" : "Odds",
      returnValue:
        customBet.state === "staked"
          ? customBet.placedDecimalOdds?.toFixed(2) ?? customBet.decimalOdds.toFixed(2)
          : customBet.decimalOdds.toFixed(2),
      outcomeLabel: customBet.state === "staked" ? "Staked" : "Custom Bet",
      timestampIso: customBet.placedAtIso ?? customBet.generatedAtIso,
      customBetId: customBet.id,
      iconKind: customBet.sport,
    };

    if (customBet.state !== "staked" || !customBet.outcomeStatus || !customBet.outcomeAtIso) {
      return [baseEntry];
    }

    const outcomeStatus =
      customBet.outcomeStatus === "cashed_out"
        ? "cashout"
        : customBet.outcomeStatus === "won"
          ? "win"
          : "loss";
    const outcomeValue =
      customBet.outcomeStatus === "won" || customBet.outcomeStatus === "cashed_out"
        ? customBet.outcomeValueAmount ?? 0
        : 0;
    const returnTone =
      outcomeStatus === "cashout" && customBet.stakeAmount
        ? getCashoutReturnTone(outcomeValue, customBet.stakeAmount)
        : undefined;
    const outcomeEntry: TimelineEntry = {
      id: `custom-bet-outcome-${customBet.id}`,
      title: `${customBet.title} Outcome`,
      dateRange: formatTimelineDateTime(customBet.outcomeAtIso),
      status: outcomeStatus,
      label: `${formatCustomBetSport(customBet.sport)} · ${customBet.eventName}`,
      stakeLabel: "Stake",
      stake:
        customBet.stakeAmount !== undefined
          ? formatCurrency(customBet.stakeAmount, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "N/A",
      oddsLabel: "Placed Odds",
      odds: customBet.placedDecimalOdds?.toFixed(2) ?? customBet.decimalOdds.toFixed(2),
      returnLabel: "Return",
      returnValue: formatCurrency(outcomeValue, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      returnTone,
      outcomeLabel:
        outcomeStatus === "cashout"
          ? "Cashout"
          : outcomeStatus === "win"
            ? "Won"
            : "Lost",
      timestampIso: customBet.outcomeAtIso,
      customBetId: customBet.id,
      iconKind: customBet.sport,
    };

    return [baseEntry, outcomeEntry];
  });
}

function formatCustomBetSport(sport: "horse_racing" | "football" | "golf") {
  if (sport === "horse_racing") {
    return "Horse Racing";
  }

  if (sport === "football") {
    return "Football";
  }

  return "Golf";
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
      iconKind: "money",
    },
  ];
}

function getCustomTimelineEntries(): TimelineEntry[] {
  return getTimelineEvents()
    .map((event) => {
      const gameWeek = event.matchdayId ? getGameWeekById(event.matchdayId) : null;
      const resolvedMatchdayId = event.matchdayId ?? gameWeek?.id;
      const generatedStrategies = gameWeek?.proposals.map((proposal) => ({
        id: proposal.id,
        label: getGeneratedStrategyLabel(proposal.riskLevel),
        odds: getProposalDisplayOdds(proposal),
        riskLevel: proposal.riskLevel,
        isRecommended: Boolean(proposal.aiRecommended),
      }));

      const timelineEntry: TimelineEntry = {
        id: event.id,
        title: event.title,
        dateRange: formatTimelineDateTime(event.timestampIso),
        status: "generated",
        label: gameWeek?.name ?? undefined,
        stakeLabel: "Event",
        stake: event.description ?? "Local proposal slate updated",
        returnLabel: "Matchday",
        returnValue: gameWeek?.name ?? resolvedMatchdayId ?? "Timeline",
        outcomeLabel: "Generated",
        timestampIso: event.timestampIso,
        matchdayId: resolvedMatchdayId,
        multilineStake: true,
        generatedStrategies,
        iconKind: "football",
      };

      return timelineEntry;
    })
    .sort(
      (left, right) =>
        new Date(right.timestampIso).getTime() -
        new Date(left.timestampIso).getTime(),
    );
}

function renderTimelineEntryIcon(
  iconKind: TimelineEntry["iconKind"],
): ReactNode {
  if (iconKind === "money") {
    return <Wallet size={18} />;
  }

  if (iconKind === "football") {
    return <SoccerBallIcon size={18} />;
  }

  if (iconKind === "golf") {
    return <GolfBallIcon size={18} />;
  }

  return <HorseHeadIcon size={18} />;
}

function getTimelineIconClassName(iconKind: TimelineEntry["iconKind"]) {
  if (iconKind === "money") {
    return "hub-proposal-icon-safe";
  }

  if (iconKind === "football") {
    return "hub-proposal-icon-balanced";
  }

  if (iconKind === "golf") {
    return "hub-proposal-icon-safe";
  }

  return "hub-proposal-icon-aggressive";
}

function getTimelineDotClassName(iconKind: TimelineEntry["iconKind"]) {
  if (iconKind === "money") {
    return "is-safe";
  }

  if (iconKind === "football") {
    return "is-balanced";
  }

  if (iconKind === "golf") {
    return "is-safe";
  }

  return "is-aggressive";
}

function getGeneratedStrategyLabel(riskLevel: "safe" | "balanced" | "aggressive") {
  if (riskLevel === "safe") {
    return "Defensive";
  }

  if (riskLevel === "balanced") {
    return "Balanced";
  }

  return "Aggressive";
}

function getGeneratedStrategyClassName(riskLevel: "safe" | "balanced" | "aggressive") {
  if (riskLevel === "safe") {
    return "hub-tag-safe";
  }

  if (riskLevel === "balanced") {
    return "hub-tag-balanced";
  }

  return "hub-tag-aggressive";
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

  if (normalizedLabel.includes("balanced") || normalizedLabel.includes("neutral")) {
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

  if (normalizedLabel.includes("balanced") || normalizedLabel.includes("neutral")) {
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

function getStakeSubmitterNameForMatchday(gameWeekId: string) {
  const latestStake = [...getCurrentLedgerTransactions()]
    .filter((entry) => entry.kind === "stake" && entry.gameWeekId === gameWeekId)
    .sort(
      (left, right) =>
        new Date(right.dateIso).getTime() - new Date(left.dateIso).getTime(),
    )[0];

  if (!latestStake) {
    return null;
  }

  const matchedName = latestStake.title.match(/^(.*)\s+Market Bet Placed$/i)?.[1]?.trim();
  return matchedName && matchedName.length > 0 ? matchedName : null;
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
