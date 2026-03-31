"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Scale,
  Shield,
  Sparkles,
  Target,
  Vote,
} from "lucide-react";
import type { GameWeekProposalRecord } from "../../../data/gameWeeks";
import {
  getBetLineDisplayOdds,
  getBetLineInsight,
  getCashoutStrategy,
  getOrderedBetLines,
  getProposalDisplayOdds,
  getRecommendedStake,
  getUserVoteForGameWeek,
} from "../../../repositories/gameWeekRepository";
import { formatLadbrokesSourceLabel } from "../../../repositories/ladbrokesOddsRepository";
import { trackEvent } from "../../../lib/analytics";
import { useCurrentGameWeek } from "./GameWeekProvider";
import { MatchBetSummaryRow } from "./MatchBetSummaryRow";

export function GameweekBoard() {
  const { currentGameWeek, loggedInUserId, castVote } = useCurrentGameWeek();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const selectedCardId =
    (loggedInUserId
      ? getUserVoteForGameWeek(currentGameWeek, loggedInUserId)
      : null) ?? "";
  const mobileCard =
    currentGameWeek.proposals[
      ((activeCardIndex % currentGameWeek.proposals.length) +
        currentGameWeek.proposals.length) %
        currentGameWeek.proposals.length
    ];

  return (
    <>
      <div className="hub-section-head">
        <div>
          <h1 className="hub-title">{currentGameWeek.name}</h1>
          <p className="hub-subtitle">{currentGameWeek.description}</p>
          <p className="hub-data-note">
            Odds reference: {formatLadbrokesSourceLabel(currentGameWeek.id)}
          </p>
        </div>

        <div className="hub-timer">
          <Clock3 size={16} />
          <span>{currentGameWeek.startsIn}</span>
        </div>
      </div>

      <div className="hub-card-stack hub-card-stack-desktop">
        {currentGameWeek.proposals.map((card) => (
          <AccumulatorCard
            key={card.id}
            card={card}
            gameWeek={currentGameWeek}
            selected={card.id === selectedCardId}
            onVote={() => castVote(card.id)}
          />
        ))}
      </div>

      <div className="hub-card-carousel-mobile">
        <AccumulatorCard
          key={mobileCard.id}
          card={mobileCard}
          gameWeek={currentGameWeek}
          selected={mobileCard.id === selectedCardId}
          compactTitle
          onPrevious={() => {
            trackEvent("carousel_navigate", {
              direction: "previous",
              surface: "matchday_mobile",
              proposal_id: mobileCard.id,
            });
            setActiveCardIndex((previous) =>
              previous === 0
                ? currentGameWeek.proposals.length - 1
                : previous - 1,
            );
          }}
          onNext={() => {
            trackEvent("carousel_navigate", {
              direction: "next",
              surface: "matchday_mobile",
              proposal_id: mobileCard.id,
            });
            setActiveCardIndex((previous) =>
              previous === currentGameWeek.proposals.length - 1
                ? 0
                : previous + 1,
            );
          }}
          onVote={() => castVote(mobileCard.id)}
        />
      </div>
    </>
  );
}

function AccumulatorCard({
  card,
  gameWeek,
  selected,
  compactTitle = false,
  onPrevious,
  onNext,
  onVote,
}: {
  card: GameWeekProposalRecord;
  gameWeek: ReturnType<typeof useCurrentGameWeek>["currentGameWeek"];
  selected: boolean;
  compactTitle?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onVote: () => void;
}) {
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    null,
  );
  const orderedBetLines = getOrderedBetLines(card);
  const cashoutStrategy = getCashoutStrategy(gameWeek, card);
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
        ? "Vote Neutral"
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
  const handleVote = () => {
    trackEvent("vote_proposal", {
      proposal_id: card.id,
      risk_level: card.riskLevel,
      proposal_title: card.title,
      surface: compactTitle ? "matchday_mobile" : "matchday_desktop",
    });
    onVote();
  };

  return (
    <article className={`hub-proposal-card${selected ? " is-selected" : ""}`}>
      <div className="hub-proposal-top">
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
                    AI Recommends
                  </span>
                ) : null}
              </div>
            </div>
            {compactTitle ? (
              <div
                className="hub-proposal-icon hub-proposal-icon-spacer"
                aria-hidden="true"
              />
            ) : null}
          </div>
        </div>

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
                £{getRecommendedStake(gameWeek, card)}
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
                className="hub-primary-button"
                type="button"
                onClick={handleVote}
              >
                <Vote size={16} />
                You voted
              </button>
            ) : (
              <button
                className="hub-secondary-button"
                type="button"
                onClick={handleVote}
              >
                <Vote size={16} />
                {voteLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="hub-bet-lines">
        {orderedBetLines.map((betLine) => {
          const isExpanded = expandedSectionId === betLine.label;
          const insight = getBetLineInsight(card, betLine);

          return (
            <MatchBetSummaryRow
              key={betLine.label}
              betLine={betLine}
              displayOdds={getBetLineDisplayOdds(betLine)}
              insight={insight}
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

      <div className="hub-cashout-panel">
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
    return "Neutral";
  }

  return "Aggressive";
}
