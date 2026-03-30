"use client";

import { useState } from "react";
import {
  Clock3,
  Flame,
  Scale,
  Shield,
  Sparkles,
  Vote,
} from "lucide-react";

type ProposalCard = {
  id: string;
  title: string;
  tone: "safe" | "balanced" | "aggressive";
  odds: string;
  legs: number;
  statusLabel: string;
  aiRecommended?: boolean;
};

const proposalCards: ProposalCard[] = [
  {
    id: "defensive",
    title: "Defensive Accumulator",
    tone: "safe",
    odds: "+200",
    legs: 3,
    statusLabel: "Safe",
  },
  {
    id: "neutral",
    title: "Neutral Accumulator",
    tone: "balanced",
    odds: "+450",
    legs: 5,
    statusLabel: "Balanced",
    aiRecommended: true,
  },
  {
    id: "aggressive",
    title: "Aggressive Accumulator",
    tone: "aggressive",
    odds: "+900",
    legs: 7,
    statusLabel: "High Risk",
  },
];

export function GameweekBoard() {
  const [selectedCardId, setSelectedCardId] = useState("neutral");

  return (
    <>
      <div className="hub-section-head">
        <div>
          <h1 className="hub-title">Gameweek 24 Action Board</h1>
          <p className="hub-subtitle">
            AI analysis complete. Review legs and cast your syndicate vote.
          </p>
        </div>

        <div className="hub-timer">
          <Clock3 size={16} />
          <span>Starts in 2d 14h</span>
        </div>
      </div>

      <div className="hub-card-stack">
        {proposalCards.map((card) => (
          <AccumulatorCard
            key={card.id}
            card={card}
            selected={card.id === selectedCardId}
            onVote={() => setSelectedCardId(card.id)}
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
  card: ProposalCard;
  selected: boolean;
  onVote: () => void;
}) {
  const Icon =
    card.tone === "safe" ? Shield : card.tone === "balanced" ? Scale : Flame;
  const voteLabel =
    card.tone === "safe"
      ? "Vote Defensive"
      : card.tone === "balanced"
        ? "Vote Neutral"
        : "Vote Aggressive";

  return (
    <article className={`hub-proposal-card${selected ? " is-selected" : ""}`}>
      <div className="hub-proposal-top">
        <div className="hub-proposal-title-wrap">
          <div className={`hub-proposal-icon hub-proposal-icon-${card.tone}`}>
            <Icon size={20} />
          </div>
          <div>
            <div className="hub-proposal-heading-row">
              <h2 className="hub-proposal-title">{card.title}</h2>
              <span className={`hub-tag hub-tag-${card.tone}`}>{card.statusLabel}</span>
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
