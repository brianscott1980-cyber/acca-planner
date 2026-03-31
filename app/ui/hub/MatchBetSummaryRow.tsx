"use client";

import { ChevronRight } from "lucide-react";
import type {
  BetLineInsight,
  ProposalBetLine,
} from "../../../repositories/gameWeekRepository";
import { trackEvent } from "../../../lib/analytics";
import { getFixtureDisplayParts } from "../../../repositories/premierLeagueClubRepository";

type MatchBetSummaryRowProps = {
  betLine: ProposalBetLine;
  displayOdds: string;
  insight?: BetLineInsight | null;
  isExpanded: boolean;
  onToggle: () => void;
  settlementStatus?: "won" | "lost";
};

export function MatchBetSummaryRow({
  betLine,
  displayOdds,
  insight,
  isExpanded,
  onToggle,
  settlementStatus,
}: MatchBetSummaryRowProps) {
  const hasExpandableContent = Boolean(
    insight?.aiReasoning || insight?.sequenceReasoning,
  );
  const fixtureDisplayParts = getFixtureDisplayParts(betLine.label);
  const handleToggle = () => {
    trackEvent("toggle_bet_details", {
      bet_label: betLine.label,
      expanded: !isExpanded,
    });
    onToggle();
  };

  return (
    <div className={`hub-bet-line${isExpanded ? " is-expanded" : ""}`}>
      <button
        className="hub-bet-line-toggle"
        type="button"
        onClick={handleToggle}
        aria-expanded={hasExpandableContent ? isExpanded : undefined}
      >
        <div className="hub-bet-line-copy">
          <span className="hub-bet-line-title">
            <ChevronRight
              size={15}
              className={`hub-bet-line-chevron${
                isExpanded ? " is-expanded" : ""
              }${hasExpandableContent ? "" : " is-hidden"}`}
            />
            {fixtureDisplayParts ? (
              <span className="hub-bet-line-fixture">
                <span className="hub-bet-line-team">
                  {fixtureDisplayParts.homeTeam.badgePath ? (
                    <img
                      className="hub-club-badge"
                      src={fixtureDisplayParts.homeTeam.badgePath}
                      alt=""
                    />
                  ) : null}
                  <span>{fixtureDisplayParts.homeTeam.name}</span>
                </span>
                <span className="hub-bet-line-fixture-separator">
                  {fixtureDisplayParts.separator}
                </span>
                <span className="hub-bet-line-team">
                  {fixtureDisplayParts.awayTeam.badgePath ? (
                    <img
                      className="hub-club-badge"
                      src={fixtureDisplayParts.awayTeam.badgePath}
                      alt=""
                    />
                  ) : null}
                  <span>{fixtureDisplayParts.awayTeam.name}</span>
                </span>
                {fixtureDisplayParts.marketLabel ? (
                  <>
                    <span className="hub-bet-line-colon">:</span>
                    <span>{fixtureDisplayParts.marketLabel}</span>
                  </>
                ) : null}
              </span>
            ) : null}
            {!fixtureDisplayParts ? <span>{betLine.label}</span> : null}
          </span>
          {betLine.scheduleNote ? (
            <span className="hub-bet-line-note">{betLine.scheduleNote}</span>
          ) : null}
        </div>
        <span className="hub-bet-line-pill-wrap">
          <span className="hub-bet-line-pill">{displayOdds}</span>
          {settlementStatus ? (
            <span
              className={`hub-outcome ${
                settlementStatus === "won" ? "is-win" : "is-loss"
              }`}
            >
              {settlementStatus === "won" ? "Won" : "Lost"}
            </span>
          ) : null}
        </span>
      </button>

      {hasExpandableContent && isExpanded ? (
        <div className="hub-bet-line-detail">
          <p>
            <strong className="hub-bet-line-detail-label">Reason:</strong>{" "}
            {insight?.aiReasoning}
          </p>
          {insight?.sequenceReasoning ? (
            <p>
              <strong className="hub-bet-line-detail-label">Ordering:</strong>{" "}
              {insight.sequenceReasoning}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
