"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Crown,
  Flag,
  Flame,
  Receipt,
  Scale,
  Shield,
  Sparkles,
  Target,
  Vote,
} from "lucide-react";
import type {
  GameWeekProposalRecord,
  SimulatedSlipLegStatus,
} from "../../../types/matchday_type";
import type { GameWeekViewState } from "../../../types/game_week_type";
import {
  getBetLineDisplayOdds,
  getBetLineInsight,
  getLatestAccessibleGameWeek,
  getCashoutStrategy,
  getGameWeeks,
  getGameWeekTimingStatusLabel,
  getMatchdayHref,
  getOrderedBetLines,
  getProposalDisplayOdds,
  getRecommendedStake,
  getUserVoteForGameWeek,
} from "../../../services/game_week_service";
import { formatLadbrokesSourceLabel } from "../../../services/ladbrokes_odds_service";
import { trackEvent } from "../../../lib/analytics";
import { getMembers } from "../../../repositories/user_repository";
import {
  getGameWeekSimulation,
  getSimulatedNow,
} from "../../../services/league_simulation_service";
import {
  ConsensusVoteBreakdown,
  VotesAvatarRow,
} from "./ConsensusPanel";
import { useAuth } from "../auth/AuthProvider";
import { useCurrentGameWeek } from "./GameWeekProvider";
import { MatchBetSummaryRow } from "./MatchBetSummaryRow";
import { markMatchdayBetAsPlaced } from "../../../services/matchday_admin_service";

type GameweekBoardProps = {
  decidedProposal?: GameWeekProposalRecord | null;
  viewState: GameWeekViewState;
};

type DisplayedBetLineStatus =
  | SimulatedSlipLegStatus
  | "pending"
  | "in_play"
  | "ended";

type DisplayedBetLineState = {
  status: DisplayedBetLineStatus;
  label?: string;
};

export function GameweekBoard({
  decidedProposal = null,
  viewState,
}: GameweekBoardProps) {
  const router = useRouter();
  const { member: currentUser } = useAuth();
  const [simulatedNow, setSimulatedNow] = useState(() => getSimulatedNow());
  const initialSimulatedNowRef = useRef<Date | null>(null);
  const mountedAtRef = useRef<number | null>(null);
  const {
    currentGameWeek,
    loggedInUserId,
    castVote,
    endVoting,
    isEndingVote,
    refreshVoteSimulation,
    voteSimulationResult,
    voteSimulationStatus,
  } = useCurrentGameWeek();
  const isDecisionView = viewState !== "voting" && Boolean(decidedProposal);
  const isAdminUser = currentUser?.role === "admin";
  const proposals =
    isDecisionView && decidedProposal ? [decidedProposal] : currentGameWeek.proposals;
  const members = getMembers();
  const timingLabel = getGameWeekTimingStatusLabel(currentGameWeek);
  const gameWeeks = getGameWeeks();
  const latestAccessibleGameWeek = getLatestAccessibleGameWeek();
  const latestAccessibleGameWeekIndex = gameWeeks.findIndex(
    (gameWeek) => gameWeek.id === latestAccessibleGameWeek.id,
  );
  const currentGameWeekIndex = gameWeeks.findIndex(
    (gameWeek) => gameWeek.id === currentGameWeek.id,
  );
  const previousGameWeek =
    currentGameWeekIndex > 0 ? gameWeeks[currentGameWeekIndex - 1] : null;
  const nextGameWeek =
    currentGameWeekIndex >= 0 &&
    currentGameWeekIndex < gameWeeks.length - 1 &&
    currentGameWeekIndex < latestAccessibleGameWeekIndex
      ? gameWeeks[currentGameWeekIndex + 1]
      : null;
  const decisionVotesByUserId = getDisplayedVotesByUserId({
    gameWeek: currentGameWeek,
    members,
  });
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const selectedCardId =
    (isDecisionView
      ? decidedProposal?.id
      : loggedInUserId
      ? getUserVoteForGameWeek(currentGameWeek, loggedInUserId)
      : null) ?? "";
  const mobileCard = proposals[
    ((activeCardIndex % proposals.length) + proposals.length) % proposals.length
  ];

  const sectionTitle = getMatchdaySectionTitle(currentGameWeek.name, viewState);
  const sectionDescription = getMatchdaySectionDescription({
    gameWeek: currentGameWeek,
    viewState,
    decidedProposal,
  });

  useEffect(() => {
    initialSimulatedNowRef.current = getSimulatedNow();
    mountedAtRef.current = Date.now();

    const intervalId = window.setInterval(() => {
      const mountedAt = mountedAtRef.current;

      if (mountedAt === null) {
        return;
      }

      setSimulatedNow(
        new Date(
          (initialSimulatedNowRef.current ?? getSimulatedNow()).getTime() +
            (Date.now() - mountedAt),
        ),
      );
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const navigateToGameWeek = (gameWeekId: string) => {
    const targetGameWeek =
      gameWeeks.find((gameWeek) => gameWeek.id === gameWeekId) ?? null;

    if (!targetGameWeek) {
      return;
    }

    const href = getMatchdayHref({
      gameWeekId,
    });

    router.push(href);
  };

  return (
    <>
      <div className="hub-section-head">
        <div>
          <div className="hub-title-row">
            <h1 className="hub-title">{sectionTitle}</h1>
            {previousGameWeek || nextGameWeek ? (
              <div className="hub-matchday-nav" aria-label="Matchday navigation">
                <button
                  type="button"
                  className="hub-matchday-nav-button"
                  onClick={() => previousGameWeek && navigateToGameWeek(previousGameWeek.id)}
                  disabled={!previousGameWeek}
                  aria-label={
                    previousGameWeek
                      ? `View ${previousGameWeek.name}`
                      : "No previous matchday"
                  }
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="hub-matchday-nav-button"
                  onClick={() => nextGameWeek && navigateToGameWeek(nextGameWeek.id)}
                  disabled={!nextGameWeek}
                  aria-label={
                    nextGameWeek ? `View ${nextGameWeek.name}` : "No next matchday"
                  }
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : null}
          </div>
          <p className="hub-subtitle">{sectionDescription}</p>
          <p className="hub-data-note">
            Odds reference: {formatLadbrokesSourceLabel(currentGameWeek.id)}
          </p>
        </div>

        <div className="hub-timer">
          <Clock3 size={16} />
          <span>{timingLabel}</span>
        </div>
      </div>

      {viewState === "voting" && voteSimulationStatus === "running" ? (
        <div className="hub-vote-simulation-banner">
          <div>
            <p className="hub-vote-simulation-banner-title">
              Voting In Progress
            </p>
            <p className="hub-vote-simulation-banner-copy">
              Votes are still coming in. The consensus graph will keep updating
              until the result is decided.
            </p>
          </div>
        </div>
      ) : null}

      {viewState === "voting" &&
      voteSimulationStatus === "closed" &&
      voteSimulationResult ? (
        <div className="hub-modal-backdrop" role="presentation">
          <div
            className="hub-modal hub-vote-closed-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vote-closed-title"
            aria-describedby="vote-closed-copy"
          >
            <div className="hub-modal-header hub-vote-closed-modal-header">
              <div>
                <h2 id="vote-closed-title" className="hub-panel-title">
                  Voting Closed
                </h2>
                <p id="vote-closed-copy" className="hub-subtitle">
                  {voteSimulationResult.hasConsensus
                    ? `${voteSimulationResult.leadingProposalTitle ?? "The selected strategy"} won the vote and is now locked in for this matchday.`
                    : "All matchday votes were cast without consensus. Refresh to return to the matchday board."}
                </p>
              </div>
            </div>

            <button
              className="hub-primary-button hub-vote-closed-modal-action"
              type="button"
              onClick={refreshVoteSimulation}
            >
              Refresh Matchday
            </button>
          </div>
        </div>
      ) : null}

      {isDecisionView ? (
        <div
          className={`hub-decision-banner hub-decision-banner-${getMatchdayBannerTone(
            viewState,
            currentGameWeek,
            decidedProposal,
          )}`}
        >
          <div className="hub-decision-banner-main">
            <span className="hub-decision-banner-icon">
              <MatchdayStateIcon viewState={viewState} />
            </span>
            <div>
              <p className="hub-decision-banner-title">
                {getMatchdayBannerTitle(viewState, currentGameWeek)}
              </p>
              <p className="hub-decision-banner-copy">
                {getMatchdayBannerCopy({
                  decidedProposal,
                  gameWeek: currentGameWeek,
                  viewState,
                })}
              </p>
            </div>
          </div>
          <VotesAvatarRow
            className="hub-voter-block-banner"
            members={members}
            votesByUserId={decisionVotesByUserId}
          />
        </div>
      ) : null}

      {viewState === "voting" && isAdminUser ? (
        <div className="hub-admin-controls">
          <div className="hub-admin-controls-main">
            <span className="hub-admin-controls-icon">
              <Crown size={16} />
            </span>
            <div>
              <p className="hub-admin-controls-title">Admin Controls</p>
              <p className="hub-admin-controls-copy">
                Review the three acca groups and commit the matchday vote once
                the final strategy is ready to be locked in.
              </p>
            </div>
          </div>
          <button
            className="hub-primary-button"
            type="button"
            disabled={isEndingVote}
            onClick={() => {
              trackEvent("admin_commit_vote_clicked", {
                matchday_id: currentGameWeek.id,
              });
              void endVoting();
            }}
          >
            {isEndingVote ? "Ending Voting..." : "End Voting"}
          </button>
        </div>
      ) : null}

      <div className="hub-card-stack hub-card-stack-desktop">
        {proposals.map((card) => (
          <AccumulatorCard
            key={card.id}
            card={card}
            gameWeek={currentGameWeek}
            displayedVotesByUserId={decisionVotesByUserId}
            selected={card.id === selectedCardId}
            votingLocked={isDecisionView}
            viewState={viewState}
            simulatedNowMs={simulatedNow.getTime()}
            voteSimulationStatus={voteSimulationStatus}
            onVote={() => castVote(card.id)}
          />
        ))}
      </div>

      {!isDecisionView ? (
        <div className="hub-card-carousel-mobile">
          <AccumulatorCard
            key={mobileCard.id}
            card={mobileCard}
            gameWeek={currentGameWeek}
            displayedVotesByUserId={decisionVotesByUserId}
            selected={mobileCard.id === selectedCardId}
            compactTitle
            viewState={viewState}
            simulatedNowMs={simulatedNow.getTime()}
            voteSimulationStatus={voteSimulationStatus}
            onPrevious={() => {
              trackEvent("carousel_navigate", {
                direction: "previous",
                surface: "matchday_mobile",
                proposal_id: mobileCard.id,
              });
              setActiveCardIndex((previous) =>
                previous === 0 ? proposals.length - 1 : previous - 1,
              );
            }}
            onNext={() => {
              trackEvent("carousel_navigate", {
                direction: "next",
                surface: "matchday_mobile",
                proposal_id: mobileCard.id,
              });
              setActiveCardIndex((previous) =>
                previous === proposals.length - 1 ? 0 : previous + 1,
              );
            }}
            onVote={() => castVote(mobileCard.id)}
          />
        </div>
      ) : null}
    </>
  );
}

function AccumulatorCard({
  card,
  gameWeek,
  displayedVotesByUserId,
  selected,
  compactTitle = false,
  onPrevious,
  onNext,
  onVote,
  votingLocked = false,
  viewState,
  simulatedNowMs,
  voteSimulationStatus,
}: {
  card: GameWeekProposalRecord;
  gameWeek: ReturnType<typeof useCurrentGameWeek>["currentGameWeek"];
  displayedVotesByUserId: Record<string, string>;
  selected: boolean;
  compactTitle?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onVote: () => void;
  votingLocked?: boolean;
  viewState: GameWeekViewState;
  simulatedNowMs: number;
  voteSimulationStatus: ReturnType<typeof useCurrentGameWeek>["voteSimulationStatus"];
}) {
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    null,
  );
  const { member: currentUser } = useAuth();
  const { refreshCurrentGameWeek } = useCurrentGameWeek();
  const isAdminUser = currentUser?.role === "admin";
  const orderedBetLines = getOrderedBetLines(card);
  const cashoutStrategy = getCashoutStrategy(gameWeek, card);
  const members = getMembers();
  const consensusVotesByUserId = displayedVotesByUserId;
  const simulation = getGameWeekSimulation(gameWeek.id);
  const actualStake =
    votingLocked && simulation?.simulatedSlip.proposalId === card.id
      ? simulation.simulatedSlip.stake
      : getRecommendedStake(gameWeek, card);
  const currentPlacedDecimalOdds =
    votingLocked && simulation?.simulatedSlip.proposalId === card.id
      ? simulation.simulatedSlip.placedDecimalOdds
      : undefined;
  const hasPlacedDecimalOdds =
    typeof currentPlacedDecimalOdds === "number" &&
    Number.isFinite(currentPlacedDecimalOdds);
  const isAwaitingAdminPlacement =
    viewState === "locked" &&
    simulation?.selectedProposalId === card.id &&
    isAdminUser;
  const [stakeAmount, setStakeAmount] = useState(() => actualStake.toFixed(2));
  const [placedDecimalOdds, setPlacedDecimalOdds] = useState(() =>
    Number.parseFloat(getProposalDisplayOdds(card)).toFixed(2),
  );
  const [placedAt, setPlacedAt] = useState(() =>
    toDateTimeLocalValue(new Date().toISOString()),
  );
  const [placementStatusMessage, setPlacementStatusMessage] = useState<string | null>(null);
  const [placementErrorMessage, setPlacementErrorMessage] = useState<string | null>(null);
  const [isSubmittingPlacement, setIsSubmittingPlacement] = useState(false);
  const Icon =
    card.riskLevel === "safe"
      ? Shield
      : card.riskLevel === "balanced"
        ? Scale
        : Flame;
  const voteLabel =
    card.riskLevel === "safe"
      ? "Vote Defensive"
      : card.riskLevel === "balanced"
        ? "Vote Balanced"
        : "Vote Aggressive";
  const approachLabel =
    card.riskLevel === "safe"
      ? "Preserve"
      : card.riskLevel === "balanced"
        ? "Progress"
        : "Profit";
  const displayTitle = compactTitle
    ? getCompactProposalTitle(card.riskLevel)
    : card.title;
  const betLineDisplayStatesByLabel = getBetLineDisplayStatesForView({
    card,
    gameWeek,
    simulatedNowMs,
    viewState,
  });
  const handleVote = () => {
    trackEvent("vote_proposal", {
      proposal_id: card.id,
      risk_level: card.riskLevel,
      proposal_title: card.title,
      surface: compactTitle ? "matchday_mobile" : "matchday_desktop",
    });
    onVote();
  };
  const betLinesContent = (
    <div className={`hub-bet-lines${votingLocked ? " hub-bet-lines-locked" : ""}`}>
      {orderedBetLines.map((betLine) => {
        const isExpanded = expandedSectionId === betLine.label;
        const insight = getBetLineInsight(card, betLine);
        const displayState = betLineDisplayStatesByLabel[betLine.label];

        return (
          <MatchBetSummaryRow
            key={betLine.label}
            betLine={betLine}
            displayOdds={getBetLineDisplayOdds(betLine)}
            insight={insight}
            settlementStatus={displayState?.status}
            statusLabel={displayState?.label}
            isExpanded={isExpanded}
            onToggle={() =>
              setExpandedSectionId((previous) =>
                previous === betLine.label ? null : betLine.label,
              )
            }
          />
        );
      })}
    </div>
  );
  const cashoutPanel = (
    <div className={`hub-cashout-panel${votingLocked ? " hub-cashout-panel-inline" : ""}`}>
      <button
        className="hub-cashout-toggle"
        type="button"
        onClick={() =>
          setExpandedSectionId((previous) => {
            const isExpanding = previous !== "cashout";
            trackEvent("toggle_cashout_strategy", {
              proposal_id: card.id,
              risk_level: card.riskLevel,
              expanded: isExpanding,
            });
            return previous === "cashout" ? null : "cashout";
          })
        }
        aria-expanded={expandedSectionId === "cashout"}
      >
        <div className="hub-cashout-title-row">
          <span className="hub-bet-line-title">
            <ChevronRight
              size={15}
              className={`hub-bet-line-chevron${
                expandedSectionId === "cashout" ? " is-expanded" : ""
              }`}
            />
            <Target size={16} />
            <span>Cashout strategy</span>
          </span>

          <div className="hub-cashout-inline-stats">
            <span className="hub-cashout-inline-stat">
              <span className="hub-metric-label">Lower</span>
              <span className="hub-metric-value">{cashoutStrategy.lowerTarget}</span>
            </span>
            <span className="hub-cashout-inline-stat">
              <span className="hub-metric-label">Upper</span>
              <span className="hub-metric-value">{cashoutStrategy.upperTarget}</span>
            </span>
            <span className="hub-cashout-inline-stat">
              <span className="hub-metric-label">None</span>
              <span className="hub-metric-value">{cashoutStrategy.noCashoutValue}</span>
            </span>
          </div>
        </div>
      </button>

      {expandedSectionId === "cashout" ? (
        <div className="hub-cashout-watch">
          <span className="hub-metric-label">What to watch</span>
          <ul className="hub-watch-list">
            {cashoutStrategy.watchList.map((watchItem) => (
              <li key={watchItem}>{watchItem}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
  const handleMarkPlaced = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextStakeAmount = Number.parseFloat(stakeAmount);
    const nextPlacedDecimalOdds = Number.parseFloat(placedDecimalOdds);
    const nextPlacedAtIso = fromDateTimeLocalValue(placedAt);

    if (
      !Number.isFinite(nextStakeAmount) ||
      nextStakeAmount <= 0 ||
      !Number.isFinite(nextPlacedDecimalOdds) ||
      nextPlacedDecimalOdds <= 1 ||
      !nextPlacedAtIso
    ) {
      setPlacementErrorMessage("Enter a valid stake, odds, and placement date/time.");
      return;
    }

    setIsSubmittingPlacement(true);
    setPlacementStatusMessage(null);
    setPlacementErrorMessage(null);

    try {
      await markMatchdayBetAsPlaced({
        gameWeekId: gameWeek.id,
        stakeAmount: nextStakeAmount,
        placedDecimalOdds: nextPlacedDecimalOdds,
        placedAtIso: nextPlacedAtIso,
      });

      setPlacementStatusMessage("Matchday bet marked as placed.");
      refreshCurrentGameWeek();
    } catch (error) {
      setPlacementErrorMessage(
        error instanceof Error ? error.message : "Failed to update the matchday bet.",
      );
    } finally {
      setIsSubmittingPlacement(false);
    }
  };

  return (
    <article className={`hub-proposal-card${selected ? " is-selected" : ""}`}>
      <div className={`hub-proposal-top${votingLocked ? " hub-proposal-top-locked" : ""}`}>
        <div className="hub-proposal-overview">
          <div className="hub-proposal-title-wrap">
            <div
              className={`hub-proposal-icon hub-proposal-icon-${card.riskLevel}`}
            >
              <Icon size={20} />
            </div>
            <div>
              <div className="hub-proposal-heading-row">
                {compactTitle && onPrevious && onNext ? (
                  <>
                    <div className="hub-carousel-title-row">
                      <button
                        className="hub-carousel-button"
                        type="button"
                        onClick={onPrevious}
                        aria-label="Previous accumulator"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <h2 className="hub-proposal-title">{displayTitle}</h2>
                      <button
                        className="hub-carousel-button"
                        type="button"
                        onClick={onNext}
                        aria-label="Next accumulator"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    {card.aiRecommended ? (
                      <span className="hub-ai-tag hub-ai-tag-compact">
                        <Sparkles size={12} />
                        AI
                      </span>
                    ) : null}
                  </>
                ) : (
                  <h2 className="hub-proposal-title">{displayTitle}</h2>
                )}
              </div>
            </div>
            {compactTitle ? (
              <div
                className="hub-proposal-icon hub-proposal-icon-spacer"
                aria-hidden="true"
              />
            ) : null}
          </div>
          <p className="hub-proposal-summary">{card.summary}</p>
          <div className="hub-proposal-meta-row">
            <span
              className={`hub-tag hub-tag-${card.riskLevel} hub-risk-indicator`}
            >
              {card.statusLabel}
            </span>
            {card.aiRecommended ? (
              <span className="hub-ai-tag hub-ai-tag-full">
                <Sparkles size={12} />
                Ai Recommended Strategy
              </span>
            ) : null}
          </div>
        </div>

        {!votingLocked ? (
          <div className="hub-proposal-side">
            <div className="hub-proposal-metrics">
              <div className="hub-approach-metric">
                <span className="hub-metric-label">Approach</span>
                <span className={`hub-tag hub-tag-${card.riskLevel}`}>
                  {approachLabel}
                </span>
              </div>
              <div className="hub-metric-divider hub-approach-divider" />
              <div>
                <span className="hub-metric-label">Stake</span>
                <span className="hub-metric-value">
                  £{actualStake}
                </span>
              </div>
              <div className="hub-metric-divider" />
              <div className="hub-metric-block-center">
                <span className="hub-metric-label">Legs</span>
                <span className="hub-metric-value">{card.legs}</span>
              </div>
              <div className="hub-metric-divider" />
              <div>
                <span className="hub-metric-label">Odds</span>
                <span className="hub-metric-pill">
                  {getProposalDisplayOdds(card)}
                </span>
              </div>
            </div>
            <div className="hub-proposal-actions">
              {selected ? (
                <button
                  className={`hub-primary-button hub-primary-button-${card.riskLevel}`}
                  type="button"
                  onClick={handleVote}
                  disabled={voteSimulationStatus !== "idle"}
                >
                  <Vote size={16} />
                  {voteSimulationStatus === "idle"
                    ? "You voted"
                    : voteSimulationStatus === "running"
                      ? "Vote submitted"
                      : "Voting closed"}
                </button>
              ) : (
                <button
                  className={`hub-secondary-button hub-secondary-button-${card.riskLevel}`}
                  type="button"
                  onClick={handleVote}
                  disabled={voteSimulationStatus !== "idle"}
                >
                  <Vote size={16} />
                  {voteSimulationStatus === "idle"
                    ? voteLabel
                    : voteSimulationStatus === "running"
                      ? "Awaiting votes"
                      : "Voting closed"}
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {votingLocked ? (
        <div className="hub-proposal-detail-layout">
          <div className="hub-proposal-detail-main">
            {betLinesContent}
            {cashoutPanel}
          </div>
          <aside className="hub-proposal-detail-side">
            <div className="hub-proposal-metrics hub-proposal-metrics-stacked">
              <div className="hub-approach-metric hub-approach-metric-locked">
                <span className="hub-metric-label">Approach</span>
                <span className={`hub-tag hub-tag-${card.riskLevel}`}>
                  {approachLabel}
                </span>
              </div>
              <div>
                <span className="hub-metric-label">Stake</span>
                <span className="hub-metric-value">
                  £{actualStake}
                </span>
              </div>
              <div>
                <span className="hub-metric-label">Legs</span>
                <span className="hub-metric-value">{card.legs}</span>
              </div>
              <div>
                <span className="hub-metric-label">Odds</span>
                <span className="hub-metric-pill">
                  {getProposalDisplayOdds(card)}
                </span>
              </div>
              {hasPlacedDecimalOdds ? (
                <div>
                  <span className="hub-metric-label">Placed Odds</span>
                  <span className="hub-metric-value">{currentPlacedDecimalOdds.toFixed(2)}</span>
                </div>
              ) : null}
              {hasPlacedDecimalOdds ? (
                <div>
                  <span className="hub-metric-label">Placed At</span>
                  <span className="hub-metric-value">
                    {formatPlacedAt(simulation?.simulatedSlip.stakePlacedAt ?? "")}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="hub-consensus-inline-panel">
              <ConsensusVoteBreakdown
                members={members}
                votesByUserId={consensusVotesByUserId}
              />
            </div>

            {isAwaitingAdminPlacement ? (
              <div className="hub-consensus-inline-panel">
                <div className="hub-panel-title-row">
                  <Flag size={18} />
                  <h2 className="hub-panel-title">Admin Placement</h2>
                </div>
                <p className="hub-subtitle">
                  Record the actual stake, placed odds, and placement time to move this matchday into the placed state.
                </p>
                <form className="auth-form" onSubmit={handleMarkPlaced}>
                  <label className="auth-field">
                    <span className="hub-label">Actual Stake</span>
                    <input
                      className="auth-input"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={stakeAmount}
                      onChange={(event) => setStakeAmount(event.target.value)}
                      required
                    />
                  </label>
                  <label className="auth-field">
                    <span className="hub-label">Placed Odds</span>
                    <input
                      className="auth-input"
                      type="number"
                      min="1.01"
                      step="0.01"
                      value={placedDecimalOdds}
                      onChange={(event) => setPlacedDecimalOdds(event.target.value)}
                      required
                    />
                  </label>
                  <label className="auth-field">
                    <span className="hub-label">Placed At</span>
                    <input
                      className="auth-input"
                      type="datetime-local"
                      value={placedAt}
                      onChange={(event) => setPlacedAt(event.target.value)}
                      required
                    />
                  </label>
                  <button
                    className={`hub-primary-button hub-primary-button-${card.riskLevel}`}
                    type="submit"
                    disabled={isSubmittingPlacement}
                  >
                    {isSubmittingPlacement ? "Saving..." : "Mark Bet Placed"}
                  </button>
                </form>
                {placementStatusMessage ? (
                  <p className="auth-status auth-status-success">{placementStatusMessage}</p>
                ) : null}
                {placementErrorMessage ? (
                  <p className="auth-status auth-status-error">{placementErrorMessage}</p>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      ) : (
        <>
          {betLinesContent}
          {cashoutPanel}
        </>
      )}
    </article>
  );
}

function getCompactProposalTitle(
  riskLevel: GameWeekProposalRecord["riskLevel"],
) {
  if (riskLevel === "safe") {
    return "Defensive";
  }

  if (riskLevel === "balanced") {
    return "Balanced";
  }

  return "Aggressive";
}

function MatchdayStateIcon({ viewState }: { viewState: GameWeekViewState }) {
  if (viewState === "locked") {
    return <Crown size={16} />;
  }

  if (viewState === "placed") {
    return <Receipt size={16} />;
  }

  return <Target size={16} />;
}

function getMatchdaySectionTitle(
  matchdayName: string,
  viewState: GameWeekViewState,
) {
  if (viewState === "locked") {
    return getLockedMatchdayTitle(matchdayName);
  }

  if (viewState === "placed") {
    return matchdayName.replace(/\s+(Preparation|Voting) Stage$/i, " Bet Placed");
  }

  if (viewState === "review") {
    return matchdayName.replace(/\s+(Preparation|Voting) Stage$/i, " Review");
  }

  return matchdayName;
}

function getMatchdaySectionDescription({
  gameWeek,
  viewState,
  decidedProposal,
}: {
  gameWeek: ReturnType<typeof useCurrentGameWeek>["currentGameWeek"];
  viewState: GameWeekViewState;
  decidedProposal: GameWeekProposalRecord | null;
}) {
  if (viewState === "locked") {
    return "Consensus has been reached and the selected slip is locked ahead of placement.";
  }

  if (viewState === "placed") {
    return `The ${decidedProposal?.title ?? "selected"} strategy has been placed and is awaiting the remaining leg results.`;
  }

  if (viewState === "review") {
    const simulatedSlip = gameWeek.simulatedSlip;

    if (!simulatedSlip) {
      return gameWeek.description;
    }

    if (simulatedSlip.settlementKind === "cashout") {
      return `The matchday was cashed out for £${simulatedSlip.returnAmount.toFixed(2)}. Review how the legs played out below.`;
    }

    if (simulatedSlip.status === "win") {
      return `The selected slip landed for £${simulatedSlip.returnAmount.toFixed(2)}. Review the winning legs below.`;
    }

    return "The selected slip lost. Review the leg sequence and final outcome below.";
  }

  return gameWeek.description;
}

function getMatchdayBannerTitle(
  viewState: GameWeekViewState,
  gameWeek: ReturnType<typeof useCurrentGameWeek>["currentGameWeek"],
) {
  if (viewState === "locked") {
    return "Voting has closed";
  }

  if (viewState === "placed") {
    return "Bet Placed and Awaiting Result";
  }

  if (gameWeek.simulatedSlip?.settlementKind === "cashout") {
    return "Cashout Review";
  }

  return gameWeek.simulatedSlip?.status === "win"
    ? "Winning Matchday Review"
    : "Matchday Review";
}

function getMatchdayBannerCopy({
  decidedProposal,
  gameWeek,
  viewState,
}: {
  decidedProposal: GameWeekProposalRecord | null;
  gameWeek: ReturnType<typeof useCurrentGameWeek>["currentGameWeek"];
  viewState: GameWeekViewState;
}) {
  const simulatedSlip = gameWeek.simulatedSlip;

  if (viewState === "locked") {
    return `${decidedProposal?.title ?? "Selected"} was voted through as the acca group decision.`;
  }

  if (viewState === "placed") {
    return `Stake committed: £${simulatedSlip?.stake.toFixed(2) ?? "0.00"}${
      simulatedSlip?.placedDecimalOdds ? ` at ${simulatedSlip.placedDecimalOdds.toFixed(2)}` : ""
    }. The open legs now determine whether this matchday reaches a full result or an earlier cashout.`;
  }

  if (!simulatedSlip) {
    return "";
  }

  if (simulatedSlip.settlementKind === "cashout") {
    return `The group exited the ${decidedProposal?.title ?? "selected"} strategy early for £${simulatedSlip.returnAmount.toFixed(2)}.`;
  }

  if (simulatedSlip.status === "win") {
    return `The ${decidedProposal?.title ?? "selected"} strategy settled as a winner and returned £${simulatedSlip.returnAmount.toFixed(2)}.`;
  }

  return `The ${decidedProposal?.title ?? "selected"} strategy ran through to a full loss with no cashout taken.`;
}

function getMatchdayBannerTone(
  viewState: GameWeekViewState,
  gameWeek: ReturnType<typeof useCurrentGameWeek>["currentGameWeek"],
  decidedProposal?: GameWeekProposalRecord | null,
) {
  if (viewState === "locked") {
    if (decidedProposal?.riskLevel === "safe") {
      return "locked-safe";
    }

    if (decidedProposal?.riskLevel === "balanced") {
      return "locked-balanced";
    }

    if (decidedProposal?.riskLevel === "aggressive") {
      return "locked-aggressive";
    }

    return "locked";
  }

  if (viewState === "placed") {
    return "placed";
  }

  const simulatedSlip = gameWeek.simulatedSlip;

  if (!simulatedSlip) {
    return "review-loss";
  }

  if (simulatedSlip.settlementKind === "cashout") {
    return "review-cashout";
  }

  if (simulatedSlip.returnAmount < simulatedSlip.stake) {
    return "review-loss";
  }

  const allLegsWon =
    (simulatedSlip.legResults?.length ?? 0) > 0 &&
    simulatedSlip.legResults?.every(
      (legResult) =>
        legResult.status === "won" && legResult.actualStatus === "won",
    );

  if (simulatedSlip.status === "win" && allLegsWon) {
    return "review-win";
  }

  return "review-loss";
}

function getBetLineDisplayStatesForView({
  card,
  gameWeek,
  simulatedNowMs,
  viewState,
}: {
  card: GameWeekProposalRecord;
  gameWeek: ReturnType<typeof useCurrentGameWeek>["currentGameWeek"];
  simulatedNowMs: number;
  viewState: GameWeekViewState;
}) {
  if (viewState !== "placed" && viewState !== "review") {
    return {};
  }

  const simulatedSlip = gameWeek.simulatedSlip;

  if (!simulatedSlip || simulatedSlip.proposalId !== card.id) {
    return {};
  }

  return Object.fromEntries(
    (simulatedSlip.legResults ?? []).map((legResult) => [
      legResult.betLineLabel,
      getDisplayedBetLineState({
        legResult,
        simulatedNow: simulatedNowMs,
        viewState,
      }),
    ]),
  ) as Record<string, DisplayedBetLineState>;
}

function getDisplayedBetLineState({
  legResult,
  simulatedNow,
  viewState,
}: {
  legResult: NonNullable<
    NonNullable<
      ReturnType<typeof useCurrentGameWeek>["currentGameWeek"]["simulatedSlip"]
    >["legResults"]
  >[number];
  simulatedNow: number;
  viewState: GameWeekViewState;
}) {
  if (viewState === "review") {
    return {
      status: legResult.status,
    };
  }

  const kickoffAtMs = new Date(legResult.kickoffAt).getTime();
  const elapsedMinutes = Math.floor((simulatedNow - kickoffAtMs) / (1000 * 60));

  if (elapsedMinutes < 0) {
    return {
      status: "pending",
      label: getPendingCountdownLabel(legResult.kickoffAt, simulatedNow),
    };
  }

  if (elapsedMinutes < 45) {
    return {
      status: "in_play",
      label: `'${Math.max(1, elapsedMinutes + 1)}`,
    };
  }

  if (elapsedMinutes < 60) {
    return {
      status: "in_play",
      label: "HT",
    };
  }

  if (elapsedMinutes < 111) {
    return {
      status: "in_play",
      label: `'${Math.min(95, 45 + (elapsedMinutes - 60))}`,
    };
  }

  return {
    status: "ended",
    label: "Ended",
  };
}

function toDateTimeLocalValue(isoValue: string) {
  const date = new Date(isoValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function fromDateTimeLocalValue(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

function formatPlacedAt(isoValue: string) {
  const date = new Date(isoValue);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/London",
    timeZoneName: "short",
  }).format(date);
}

function getDisplayedVotesByUserId({
  gameWeek,
  members,
}: {
  gameWeek: ReturnType<typeof useCurrentGameWeek>["currentGameWeek"];
  members: ReturnType<typeof getMembers>;
}) {
  return gameWeek.votesByUserId;
}

function getPendingCountdownLabel(
  kickoffAtIso: string | undefined,
  simulatedNowMs: number,
) {
  if (!kickoffAtIso) {
    return "Pending";
  }

  const remainingMs = Math.max(
    0,
    new Date(kickoffAtIso).getTime() - simulatedNowMs,
  );
  const totalMinutes = Math.floor(remainingMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

function getLockedMatchdayTitle(matchdayName: string) {
  return matchdayName.replace(/\s+(Preparation|Voting) Stage$/i, " Strategy Locked");
}
