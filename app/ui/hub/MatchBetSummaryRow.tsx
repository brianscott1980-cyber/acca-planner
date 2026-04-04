"use client";

import { ChevronRight } from "lucide-react";
import type {
  BetLineFormMatch,
  BetLineFormOutcome,
  SimulatedSlipLegStatus,
} from "../../../types/matchday_type";
import type {
  BetLineInsight,
  ProposalBetLine,
} from "../../../types/game_week_type";
import { trackEvent } from "../../../lib/analytics";
import { getFixtureDisplayParts } from "../../../services/premier_league_club_service";

type MatchBetSummaryRowProps = {
  betLine: ProposalBetLine;
  displayOdds: string;
  insight?: BetLineInsight | null;
  isExpanded: boolean;
  onToggle: () => void;
  settlementStatus?: SimulatedSlipLegStatus | "pending" | "in_play" | "ended";
  statusLabel?: string;
  showSettlementStatusInOddsSlot?: boolean;
};

export function MatchBetSummaryRow({
  betLine,
  displayOdds,
  insight,
  isExpanded,
  onToggle,
  settlementStatus,
  statusLabel,
  showSettlementStatusInOddsSlot = false,
}: MatchBetSummaryRowProps) {
  const fixtureDisplayParts = getFixtureDisplayParts(betLine.label);
  const formContent = getBetLineFormContent(betLine, fixtureDisplayParts);
  const hasExpandableContent = Boolean(
    insight?.aiReasoning || insight?.sequenceReasoning || formContent,
  );
  const handleToggle = () => {
    trackEvent("toggle_bet_details", {
      bet_label: betLine.label,
      expanded: !isExpanded,
    });
    onToggle();
  };
  const settlementPillClass = getSettlementPillClass(settlementStatus);
  const settlementDisplayLabel =
    statusLabel ?? getSettlementLabel(settlementStatus);

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
                    <span className="hub-bet-line-market">
                      {fixtureDisplayParts.marketLabel}
                    </span>
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
          {settlementStatus && !showSettlementStatusInOddsSlot ? (
            <span
              className={`hub-outcome ${settlementPillClass}`}
            >
              {settlementDisplayLabel}
            </span>
          ) : null}
          {showSettlementStatusInOddsSlot && settlementStatus ? (
            <span className={`hub-outcome ${settlementPillClass}`}>
              {settlementDisplayLabel}
            </span>
          ) : (
            <span className="hub-bet-line-pill">{displayOdds}</span>
          )}
        </span>
      </button>

      {hasExpandableContent && isExpanded ? (
        <div className="hub-bet-line-detail">
          {formContent ? (
            <div className="hub-bet-line-detail-row hub-bet-line-detail-row-form">
              <strong className="hub-bet-line-detail-label">Form:</strong>
              <div className="hub-bet-line-detail-value">{formContent}</div>
            </div>
          ) : null}
          {insight?.aiReasoning ? (
            <p className="hub-bet-line-detail-row">
              <strong className="hub-bet-line-detail-label">Reason:</strong>
              <span className="hub-bet-line-detail-value">
                {insight.aiReasoning}
              </span>
            </p>
          ) : null}
          {insight?.sequenceReasoning ? (
            <p className="hub-bet-line-detail-row">
              <strong className="hub-bet-line-detail-label">Ordering:</strong>
              <span className="hub-bet-line-detail-value">
                {insight.sequenceReasoning}
              </span>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function getSettlementPillClass(
  settlementStatus: MatchBetSummaryRowProps["settlementStatus"],
) {
  if (settlementStatus === "won") {
    return "is-win";
  }

  if (settlementStatus === "lost") {
    return "is-loss";
  }

  if (settlementStatus === "in_play") {
    return "is-in-play";
  }

  if (settlementStatus === "ended") {
    return "is-ended";
  }

  if (settlementStatus === "cashed_out") {
    return "is-cashed-out";
  }

  return "is-pending";
}

function getSettlementLabel(
  settlementStatus: MatchBetSummaryRowProps["settlementStatus"],
) {
  if (settlementStatus === "won") {
    return "Won";
  }

  if (settlementStatus === "lost") {
    return "Lost";
  }

  if (settlementStatus === "in_play") {
    return "In Play";
  }

  if (settlementStatus === "ended") {
    return "Ended";
  }

  if (settlementStatus === "cashed_out") {
    return "Cashout";
  }

  return "Pending";
}

function getBetLineFormContent(
  betLine: ProposalBetLine,
  fixtureDisplayParts: ReturnType<typeof getFixtureDisplayParts>,
) {
  if (betLine.form) {
    return (
      <div className="hub-form-visual">
        <FormTeamBlock
          alignment="end"
          matches={betLine.form.home.matches}
          teamName={fixtureDisplayParts?.homeTeam.name ?? "Home team"}
        />
        <span className="hub-form-versus">vs</span>
        <FormTeamBlock
          alignment="start"
          matches={betLine.form.away.matches}
          teamName={fixtureDisplayParts?.awayTeam.name ?? "Away team"}
        />
      </div>
    );
  }

  const formSummary = getBetLineFormSummary(betLine);

  return formSummary ? <span>{formSummary}</span> : null;
}

function FormTeamBlock({
  alignment,
  matches,
  teamName,
}: {
  alignment: "start" | "end";
  matches: BetLineFormMatch[];
  teamName: string;
}) {
  return (
    <div className={`hub-form-team hub-form-team-${alignment}`}>
      <div className="hub-form-outcomes" aria-label={`${teamName} recent form`}>
        {matches.map((match, index) => (
          <span
            key={`${teamName}-${match.goalsScored}-${match.outcome}-${index}`}
            className={`hub-form-outcome hub-form-outcome-${getOutcomeTone(
              match.outcome,
            )}`}
            title={getMatchTooltip(match, teamName)}
            aria-label={getMatchTooltip(match, teamName)}
          >
            {match.goalsScored}
          </span>
        ))}
      </div>
    </div>
  );
}

function getBetLineFormSummary(betLine: ProposalBetLine) {
  if (betLine.formNote) {
    return betLine.formNote;
  }

  const marketLabel = betLine.label.split(":")[1]?.trim().toLowerCase() ?? "";

  if (!marketLabel) {
    return null;
  }

  if (
    (marketLabel.includes("both teams to score") ||
      marketLabel.includes("over ") ||
      marketLabel.includes("under ")) &&
    (marketLabel.includes("&") || marketLabel.includes(" to win"))
  ) {
    return "Use the favourite's last five match outcomes together with both teams' recent goals scored and conceded before taking a result-and-goals builder.";
  }

  if (
    marketLabel.includes("both teams to score") ||
    marketLabel.includes("over ") ||
    marketLabel.includes("under ") ||
    marketLabel.includes("goals")
  ) {
    return "Use each team's recent scoring and concession trend over their last five matches for this goals-based angle.";
  }

  if (marketLabel.includes("win to nil")) {
    return "Use the favourite's last five results alongside recent clean sheets and the opponent's recent scoring record.";
  }

  if (marketLabel.includes("handicap")) {
    return "Use both teams' last five match outcomes, then check whether the favourite's recent wins have regularly cleared the margin.";
  }

  if (
    marketLabel.includes("draw no bet") ||
    marketLabel.includes("to win") ||
    marketLabel.includes("or draw")
  ) {
    return "Use each team's last five match outcomes to judge which side is bringing the stronger result profile into the fixture.";
  }

  return "Use recent five-match team form that matches the market, focusing on result trends first and goal data where the selection needs it.";
}

function getOutcomeTone(outcome: BetLineFormOutcome) {
  if (outcome === "W") {
    return "win";
  }

  if (outcome === "L") {
    return "loss";
  }

  return "draw";
}

function getOutcomeLabel(outcome: BetLineFormOutcome) {
  if (outcome === "W") {
    return "Win";
  }

  if (outcome === "L") {
    return "Loss";
  }

  return "Draw";
}

function getMatchTooltip(
  match: BetLineFormMatch,
  teamName: string,
) {
  const fixture =
    match.venue === "H"
      ? `${teamName} vs ${match.opponent}`
      : `${match.opponent} vs ${teamName}`;
  const detail = `${getOutcomeLabel(match.outcome)}, ${match.goalsScored} goals`;

  return `${fixture}: ${match.finalScore} (${detail})`;
}
