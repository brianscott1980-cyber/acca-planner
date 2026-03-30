"use client";

import {
  Clock3,
  Flame,
  Scale,
  Shield,
  Sparkles,
  Vote,
} from "lucide-react";
import type { GameWeekProposalRecord } from "../../../data/gameWeeks";
import { getUserVoteForGameWeek } from "../../../repositories/gameWeekRepository";
import { useCurrentGameWeek } from "./GameWeekProvider";

export function GameweekBoard() {
  const { currentGameWeek, loggedInUserId, castVote } = useCurrentGameWeek();
  const selectedCardId =
    (loggedInUserId
      ? getUserVoteForGameWeek(currentGameWeek, loggedInUserId)
      : null) ??
    currentGameWeek.proposals.find((proposal) => proposal.aiRecommended)?.id ??
    currentGameWeek.proposals[0]?.id ??
    "";

  return (
    <>
      <div className="hub-section-head">
        <div>
          <h1 className="hub-title">{currentGameWeek.name}</h1>
          <p className="hub-subtitle">{currentGameWeek.description}</p>
        </div>

        <div className="hub-timer">
          <Clock3 size={16} />
          <span>{currentGameWeek.startsIn}</span>
        </div>
      </div>

      <div className="hub-card-stack">
        {currentGameWeek.proposals.map((card) => (
          <AccumulatorCard
            key={card.id}
            card={card}
            selected={card.id === selectedCardId}
            onVote={() => castVote(card.id)}
          />
        ))}
      </div>
    </>
  );
}

function AccumulatorCard({
  card,
  selected,
  onVote,
}: {
  card: GameWeekProposalRecord;
  selected: boolean;
  onVote: () => void;
}) {
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

  return (
    <article className={`hub-proposal-card${selected ? " is-selected" : ""}`}>
      <div className="hub-proposal-top">
        <div className="hub-proposal-title-wrap">
          <div
            className={`hub-proposal-icon hub-proposal-icon-${card.riskLevel}`}
          >
            <Icon size={20} />
          </div>
          <div>
            <div className="hub-proposal-heading-row">
              <h2 className="hub-proposal-title">{card.title}</h2>
              <span className={`hub-tag hub-tag-${card.riskLevel}`}>
                {card.statusLabel}
              </span>
              {card.aiRecommended ? (
                <span className="hub-ai-tag">
                  <Sparkles size={12} />
                  AI Recommends
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="hub-proposal-metrics">
          <div>
            <span className="hub-metric-label">Odds</span>
            <span className="hub-metric-pill">{card.odds}</span>
          </div>
          <div className="hub-metric-divider" />
          <div>
            <span className="hub-metric-label">Legs</span>
            <span className="hub-metric-value">{card.legs}</span>
          </div>
        </div>
      </div>

      <div className="hub-proposal-actions">
        {selected ? (
          <button
            className="hub-primary-button"
            type="button"
            onClick={onVote}
          >
            <Vote size={16} />
            You voted
          </button>
        ) : (
          <button
            className="hub-secondary-button"
            type="button"
            onClick={onVote}
          >
            <Vote size={16} />
            {voteLabel}
          </button>
        )}
      </div>
    </article>
  );
}
