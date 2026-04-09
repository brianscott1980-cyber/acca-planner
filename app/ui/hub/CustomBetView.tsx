"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Flag, Flame, Trophy, X } from "lucide-react";
import { withBasePath } from "../../../lib/site";
import { getCustomBet } from "../../../services/custom_bet_service";
import {
  markCustomBetAsStaked,
  setCustomBetOutcome,
} from "../../../services/custom_bet_admin_service";
import { getCustomBetFeedback } from "../../../services/bet_learning_feedback_service";
import type { CustomBetRecord } from "../../../types/custom_bet_type";
import { useAuth } from "../auth/AuthProvider";
import { formatCurrency } from "../../../services/ledger_service";
import { GolfBallIcon, HorseHeadIcon, SoccerBallIcon } from "./SportIcons";

export function CustomBetViewWithSearchParams() {
  const searchParams = useSearchParams();
  const customBetId = searchParams.get("bet") ?? searchParams.get("id");
  const customBet = getCustomBet(customBetId);

  if (!customBet) {
    return (
      <section className="hub-wide">
        <div className="hub-panel hub-empty-state">
          <h1 className="hub-title">Custom Bet Not Found</h1>
          <p className="hub-subtitle">
            The requested custom bet could not be found in the current local or remote data snapshot.
          </p>
        </div>
      </section>
    );
  }

  return <CustomBetView customBet={customBet} />;
}

function CustomBetView({ customBet }: { customBet: CustomBetRecord }) {
  const { member: currentUser } = useAuth();
  const isAdminUser = currentUser?.role === "admin";
  const [currentCustomBet, setCurrentCustomBet] = useState(customBet);
  const isFreeBetOffer = Boolean(
    currentCustomBet.isFreeStake || currentCustomBet.customBetType === "free_bet_offer",
  );
  const [stakeAmount, setStakeAmount] = useState(
    currentCustomBet.stakeAmount ? currentCustomBet.stakeAmount.toFixed(2) : "",
  );
  const [placedDecimalOdds, setPlacedDecimalOdds] = useState(
    currentCustomBet.placedDecimalOdds
      ? currentCustomBet.placedDecimalOdds.toFixed(2)
      : currentCustomBet.decimalOdds.toFixed(2),
  );
  const [placedAt, setPlacedAt] = useState(() =>
    toDateTimeLocalValue(currentCustomBet.placedAtIso ?? new Date().toISOString()),
  );
  const [isFreeStake, setIsFreeStake] = useState(isFreeBetOffer);
  const [placedProposalRank, setPlacedProposalRank] = useState<string>(
    String(currentCustomBet.placedProposalRank ?? 1),
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlacementDialogOpen, setIsPlacementDialogOpen] = useState(false);
  const [isOutcomeDialogOpen, setIsOutcomeDialogOpen] = useState(false);
  const [outcomeStatus, setOutcomeStatus] = useState<"won" | "lost" | "cashed_out">("won");
  const [outcomeValueAmount, setOutcomeValueAmount] = useState("0.00");
  const [outcomeAt, setOutcomeAt] = useState(() =>
    toDateTimeLocalValue(new Date().toISOString()),
  );
  const [outcomeSummary, setOutcomeSummary] = useState("");
  const [outcomeStatusMessage, setOutcomeStatusMessage] = useState<string | null>(null);
  const [outcomeErrorMessage, setOutcomeErrorMessage] = useState<string | null>(null);
  const [isSubmittingOutcome, setIsSubmittingOutcome] = useState(false);
  const [expandedBetRank, setExpandedBetRank] = useState<number | null>(null);
  const eventWindowLabel = useMemo(
    () => formatEventWindow(currentCustomBet.eventStartIso, currentCustomBet.eventEndIso),
    [currentCustomBet.eventEndIso, currentCustomBet.eventStartIso],
  );
  const retrospectiveFeedback = getCustomBetFeedback(currentCustomBet.id);
  const proposedBets =
    (currentCustomBet.proposedBets ?? []).length > 0
      ? currentCustomBet.proposedBets
      : [
          {
            rank: 1 as const,
            market: currentCustomBet.recommendedMarket,
            selection: currentCustomBet.recommendedSelection,
            decimalOdds: currentCustomBet.decimalOdds,
            suggestedStakeAmount: currentCustomBet.suggestedStakeAmount,
            summary: currentCustomBet.summary,
            horseRacing:
              currentCustomBet.sport === "horse_racing" && currentCustomBet.horseRacing
                ? {
                    trainer: currentCustomBet.horseRacing.trainer,
                    jockey: currentCustomBet.horseRacing.jockey,
                    silksImagePath: currentCustomBet.horseRacing.silksImagePath,
                    silksSourceUrl: currentCustomBet.horseRacing.silksSourceUrl,
                    age: currentCustomBet.horseRacing.age,
                    weight: currentCustomBet.horseRacing.weight,
                    officialRating: currentCustomBet.horseRacing.officialRating,
                    recentForm: currentCustomBet.horseRacing.recentForm,
                    owner: currentCustomBet.horseRacing.owner,
                  }
                : undefined,
          },
        ];
  const displayedProposedBets =
    currentCustomBet.state === "staked" && currentCustomBet.placedProposalRank
      ? proposedBets.filter(
          (proposedBet) => proposedBet.rank === currentCustomBet.placedProposalRank,
        )
      : proposedBets;

  const handleMarkPlaced = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextStakeAmount = Number.parseFloat(stakeAmount);
    const nextPlacedDecimalOdds = Number.parseFloat(placedDecimalOdds);
    const nextPlacedAtIso = fromDateTimeLocalValue(placedAt);
    const nextPlacedProposalRank = Number.parseInt(placedProposalRank, 10);
    const hasPlacedProposal = proposedBets.some(
      (proposedBet) => proposedBet.rank === nextPlacedProposalRank,
    );

    if (
      !Number.isFinite(nextStakeAmount) ||
      nextStakeAmount <= 0 ||
      !Number.isFinite(nextPlacedDecimalOdds) ||
      nextPlacedDecimalOdds <= 1 ||
      !nextPlacedAtIso ||
      !hasPlacedProposal
    ) {
      setErrorMessage("Enter valid stake, odds, placement date/time, and chosen option.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const nextCustomBet = await markCustomBetAsStaked({
        customBetId: currentCustomBet.id,
        stakeAmount: nextStakeAmount,
        placedDecimalOdds: nextPlacedDecimalOdds,
        placedAtIso: nextPlacedAtIso,
        placedProposalRank: nextPlacedProposalRank as 1 | 2 | 3,
        isFreeStake,
      });

      setCurrentCustomBet(nextCustomBet);
      setStatusMessage("Custom bet marked as staked.");
      setIsPlacementDialogOpen(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update the custom bet.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetOutcome = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextOutcomeAtIso = fromDateTimeLocalValue(outcomeAt);

    if (!nextOutcomeAtIso) {
      setOutcomeErrorMessage("Enter a valid outcome date/time.");
      return;
    }

    const needsValue = outcomeStatus === "won" || outcomeStatus === "cashed_out";
    const nextOutcomeValue = Number.parseFloat(outcomeValueAmount);

    if (needsValue && (!Number.isFinite(nextOutcomeValue) || nextOutcomeValue < 0)) {
      setOutcomeErrorMessage("Enter a valid return value for won or cashed out outcomes.");
      return;
    }

    setIsSubmittingOutcome(true);
    setOutcomeStatusMessage(null);
    setOutcomeErrorMessage(null);

    try {
      const nextCustomBet = await setCustomBetOutcome({
        customBetId: currentCustomBet.id,
        outcomeStatus,
        outcomeValueAmount: needsValue ? nextOutcomeValue : undefined,
        outcomeAtIso: nextOutcomeAtIso,
        outcomeSummary,
        submittedByDisplayName: currentUser?.displayName,
      });

      setCurrentCustomBet(nextCustomBet);
      setOutcomeStatusMessage("Custom bet outcome saved.");
      setIsOutcomeDialogOpen(false);
    } catch (error) {
      setOutcomeErrorMessage(
        error instanceof Error ? error.message : "Failed to set custom bet outcome.",
      );
    } finally {
      setIsSubmittingOutcome(false);
    }
  };

  return (
    <section className="hub-wide">
      <article className="hub-proposal-card hub-custom-bet-card">
        <div className="hub-proposal-top">
          <div className="hub-proposal-overview">
            <div className="hub-proposal-title-wrap">
              <div className={`hub-proposal-icon ${getCustomBetSportIconClassName(currentCustomBet)}`}>
                {renderCustomBetSportIcon(currentCustomBet.sport)}
              </div>
              <div>
                <div className="hub-proposal-heading-row">
                  <h1 className="hub-proposal-title">{currentCustomBet.title}</h1>
                </div>
                <p className="hub-proposal-summary">{currentCustomBet.summary}</p>
                <div className="hub-proposal-meta-row">
                  <span className={`hub-tag ${getCustomBetSportTagClassName(currentCustomBet.sport)}`}>
                    {formatCustomBetSport(currentCustomBet.sport)}
                  </span>
                  <span className="hub-ai-tag">AI Custom Bet</span>
                  {isFreeBetOffer ? (
                    <span className="hub-tag hub-tag-primary">Free Bet Offer</span>
                  ) : null}
                  <span className="hub-tag hub-tag-muted">
                    {formatCustomBetState(currentCustomBet.state)}
                  </span>
                  {currentCustomBet.suggestedStakeAmount !== undefined ? (
                    <span className="hub-tag hub-tag-primary">
                      Suggested Stake{" "}
                      {formatCurrency(currentCustomBet.suggestedStakeAmount, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hub-proposal-detail-layout">
          <div className="hub-proposal-detail-main">
            <div className="hub-custom-bet-selection-card">
              <div className="hub-panel-title-row">
                <Trophy size={18} />
                <h2 className="hub-panel-title">Proposed Bets</h2>
              </div>
              {displayedProposedBets.map((proposedBet) => {
                const horseProfile = proposedBet.horseRacing;
                const suggestedStakeAmountForBet =
                  proposedBet.suggestedStakeAmount ??
                  getSuggestedStakeForProposedBet({
                    proposedBet,
                    totalSuggestedStakeAmount: currentCustomBet.suggestedStakeAmount,
                    proposedBets,
                  });
                const isBestOption =
                  proposedBet.selection === currentCustomBet.recommendedSelection &&
                  proposedBet.market === currentCustomBet.recommendedMarket;
                const hasExpandableHorseProfile = Boolean(
                  horseProfile &&
                    (horseProfile.officialRating ||
                      horseProfile.weight ||
                      horseProfile.age ||
                      horseProfile.recentForm),
                );
                const isExpanded = expandedBetRank === proposedBet.rank;
                const proposedBetOddsLabel = Number.isFinite(proposedBet.decimalOdds)
                  ? proposedBet.decimalOdds.toFixed(2)
                  : "N/A";

                return (
                  <div
                    key={`${currentCustomBet.id}-bet-${proposedBet.rank}`}
                    className={`hub-bet-line${isExpanded ? " is-expanded" : ""}`}
                  >
                    <button
                      className="hub-bet-line-toggle"
                      type="button"
                      onClick={() => {
                        if (!hasExpandableHorseProfile) {
                          return;
                        }

                        setExpandedBetRank((currentValue) =>
                          currentValue === proposedBet.rank ? null : proposedBet.rank,
                        );
                      }}
                      aria-expanded={hasExpandableHorseProfile ? isExpanded : undefined}
                    >
                      <div className="hub-bet-line-copy">
                        <span className="hub-bet-line-title">
                          <ChevronRight
                            size={15}
                            className={`hub-bet-line-chevron${
                              isExpanded ? " is-expanded" : ""
                            }${hasExpandableHorseProfile ? "" : " is-hidden"}`}
                          />
                          <span className="hub-custom-bet-selection-title-row">
                            {horseProfile?.silksImagePath ? (
                              <span className="hub-custom-bet-selection-silks">
                                <Image
                                  src={withBasePath(horseProfile.silksImagePath)}
                                  alt={`${proposedBet.selection} silks`}
                                  width={28}
                                  height={28}
                                />
                              </span>
                            ) : null}
                            <span className="hub-custom-bet-selection-title">
                              {proposedBet.rank}. {proposedBet.selection}
                            </span>
                            {isBestOption ? (
                              <span className="hub-tag hub-tag-primary">Best Option</span>
                            ) : null}
                            {currentCustomBet.state === "staked" &&
                            currentCustomBet.placedProposalRank === proposedBet.rank ? (
                              <span className="hub-tag hub-tag-balanced">Placed</span>
                            ) : null}
                          </span>
                        </span>
                        <span className="hub-bet-line-note">
                          {proposedBet.market} · {currentCustomBet.bettingFormatRequested}
                        </span>
                        <span className="hub-bet-line-note">{proposedBet.summary}</span>
                      </div>
                      <span className="hub-bet-line-pill-wrap">
                        {suggestedStakeAmountForBet !== undefined ? (
                          <span className="hub-metric-pill hub-custom-bet-stake-pill">
                            Stake{" "}
                            {formatCurrency(suggestedStakeAmountForBet, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        ) : null}
                        <span className="hub-metric-pill">{proposedBetOddsLabel}</span>
                      </span>
                    </button>

                    {hasExpandableHorseProfile && isExpanded ? (
                      <div className="hub-bet-line-detail hub-custom-bet-line-detail">
                        {horseProfile?.officialRating ? (
                          <p className="hub-bet-line-detail-row">
                            <strong className="hub-bet-line-detail-label">OR:</strong>
                            <span className="hub-bet-line-detail-value">
                              {horseProfile.officialRating}
                            </span>
                          </p>
                        ) : null}
                        {horseProfile?.weight ? (
                          <p className="hub-bet-line-detail-row">
                            <strong className="hub-bet-line-detail-label">Weight:</strong>
                            <span className="hub-bet-line-detail-value">{horseProfile.weight}</span>
                          </p>
                        ) : null}
                        {horseProfile?.age ? (
                          <p className="hub-bet-line-detail-row">
                            <strong className="hub-bet-line-detail-label">Age:</strong>
                            <span className="hub-bet-line-detail-value">{horseProfile.age}</span>
                          </p>
                        ) : null}
                        {horseProfile?.recentForm ? (
                          <p className="hub-bet-line-detail-row">
                            <strong className="hub-bet-line-detail-label">Form:</strong>
                            <span className="hub-bet-line-detail-value">
                              {horseProfile.recentForm}
                            </span>
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="hub-custom-bet-panel hub-custom-bet-analysis-panel">
              <div className="hub-panel-title-row">
                <Flame size={18} />
                <h2 className="hub-panel-title">AI Analysis</h2>
              </div>
              <p className="hub-subtitle">{currentCustomBet.analysisSummary}</p>
              <p className="hub-subtitle">{currentCustomBet.mediaSummary}</p>
            </div>
            {currentCustomBet.state === "staked" &&
            currentCustomBet.outcomeStatus &&
            retrospectiveFeedback ? (
              <div className="hub-custom-bet-panel hub-retrospective-panel">
                <div className="hub-retrospective-header">
                  <Flame size={18} />
                  <h2 className="hub-panel-title hub-retrospective-title">AI Retrospective</h2>
                </div>
                <p className="hub-subtitle">{retrospectiveFeedback.summary}</p>
                {retrospectiveFeedback.whySuccessful ? (
                  <p className="hub-subtitle">{retrospectiveFeedback.whySuccessful}</p>
                ) : null}
                {retrospectiveFeedback.whyUnsuccessful ? (
                  <p className="hub-subtitle">{retrospectiveFeedback.whyUnsuccessful}</p>
                ) : null}
                {retrospectiveFeedback.nextBetAdjustments.length > 0 ? (
                  <div className="hub-retrospective-section">
                    <h3 className="hub-retrospective-subtitle">Next Time</h3>
                    <ul className="hub-detail-list">
                      {retrospectiveFeedback.nextBetAdjustments.map((item) => (
                        <li key={item} className="hub-subtitle">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {retrospectiveFeedback.legFeedback.length > 0 ? (
                  <div className="hub-retrospective-section">
                    <h3 className="hub-retrospective-subtitle">Leg Lessons</h3>
                    <ul className="hub-detail-list">
                      {retrospectiveFeedback.legFeedback.map((leg) => (
                        <li key={leg.legLabel} className="hub-subtitle">
                          {leg.legLabel}: {formatFeedbackLegOutcome(leg.legOutcome)}. {leg.lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside className="hub-proposal-detail-side">
            {isAdminUser && currentCustomBet.state === "pending" ? (
              <button
                className="hub-primary-button hub-admin-placement-button"
                type="button"
                onClick={() => setIsPlacementDialogOpen(true)}
              >
                <Flag size={16} />
                Mark Bet Placed
              </button>
            ) : null}
            {isAdminUser &&
            currentCustomBet.state === "staked" &&
            !currentCustomBet.outcomeStatus ? (
              <button
                className="hub-primary-button hub-admin-placement-button"
                type="button"
                onClick={() => setIsOutcomeDialogOpen(true)}
              >
                <Flag size={16} />
                Set Outcome
              </button>
            ) : null}

            <div className="hub-custom-bet-panel">
              <h2 className="hub-panel-title">Event Information</h2>
              <div className="hub-proposal-metrics hub-proposal-metrics-stacked">
                <div>
                  <span className="hub-metric-label">Event</span>
                  <span className="hub-metric-value">{currentCustomBet.eventName}</span>
                </div>
                <div>
                  <span className="hub-metric-label">Window</span>
                  <span className="hub-metric-value">{eventWindowLabel}</span>
                </div>
                <div>
                  <span className="hub-metric-label">Competition</span>
                  <span className="hub-metric-value">{currentCustomBet.competitionName}</span>
                </div>
                <div>
                  <span className="hub-metric-label">Bookmaker</span>
                  <span className="hub-metric-value">{currentCustomBet.bookmaker}</span>
                </div>
                {currentCustomBet.sport === "horse_racing" && currentCustomBet.horseRacing?.distance ? (
                  <div>
                    <span className="hub-metric-label">Distance</span>
                    <span className="hub-metric-value">{currentCustomBet.horseRacing.distance}</span>
                  </div>
                ) : null}
                {currentCustomBet.sport === "horse_racing" && currentCustomBet.horseRacing?.fieldSize ? (
                  <div>
                    <span className="hub-metric-label">Field Size</span>
                    <span className="hub-metric-value">{currentCustomBet.horseRacing.fieldSize}</span>
                  </div>
                ) : null}
              </div>
              {currentCustomBet.sport === "football" && currentCustomBet.football ? (
                <FootballDetail customBet={currentCustomBet} />
              ) : null}
              {currentCustomBet.sport === "golf" && currentCustomBet.golf ? (
                <GolfDetail customBet={currentCustomBet} />
              ) : null}
            </div>

            <div className="hub-custom-bet-panel">
              <h2 className="hub-panel-title">Bet Details</h2>
              <div className="hub-proposal-metrics hub-proposal-metrics-stacked">
                <div className="hub-approach-metric hub-approach-metric-locked">
                  <span className="hub-metric-label">Format</span>
                  <span className={`hub-tag ${getCustomBetSportTagClassName(currentCustomBet.sport)}`}>
                    {currentCustomBet.bettingFormatRequested}
                  </span>
                </div>
                <div>
                  <span className="hub-metric-label">Top Market</span>
                  <span className="hub-metric-value">{currentCustomBet.recommendedMarket}</span>
                </div>
                <div>
                  <span className="hub-metric-label">Top Selection</span>
                  <span className="hub-metric-value">{currentCustomBet.recommendedSelection}</span>
                </div>
                {currentCustomBet.state === "staked" ? (
                  <div>
                    <span className="hub-metric-label">Chosen Bet</span>
                    <span className="hub-metric-value">
                      {currentCustomBet.placedSelection ?? "N/A"}
                    </span>
                  </div>
                ) : null}
                {currentCustomBet.suggestedStakeAmount !== undefined ? (
                  <div>
                    <span className="hub-metric-label">Suggested Stake</span>
                    <span className="hub-metric-value">
                      {formatCurrency(currentCustomBet.suggestedStakeAmount, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ) : null}
                <div>
                  <span className="hub-metric-label">Options</span>
                  <span className="hub-metric-value">{proposedBets.length}</span>
                </div>
                <div>
                  <span className="hub-metric-label">Sport</span>
                  <span className="hub-metric-value">{formatCustomBetSport(currentCustomBet.sport)}</span>
                </div>
                <div>
                  <span className="hub-metric-label">Type</span>
                  <span className="hub-metric-value">
                    {formatCustomBetType(currentCustomBet.customBetType)}
                  </span>
                </div>
              </div>
            </div>

            {currentCustomBet.state === "staked" && !currentCustomBet.outcomeStatus ? (
              <div className="hub-custom-bet-panel">
                <div className="hub-panel-title-row">
                  <Flag size={18} />
                  <h2 className="hub-panel-title">Staked Detail</h2>
                </div>
                <div className="hub-proposal-metrics hub-proposal-metrics-stacked">
                  <div>
                    <span className="hub-metric-label">
                      {isFreeBetOffer ? "Free Stake" : "Stake"}
                    </span>
                    <span className="hub-metric-value">
                      {currentCustomBet.stakeAmount !== undefined
                        ? formatCurrency(currentCustomBet.stakeAmount, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="hub-metric-label">Placed Odds</span>
                    <span className="hub-metric-value">
                      {currentCustomBet.placedDecimalOdds?.toFixed(2) ?? "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="hub-metric-label">Chosen Selection</span>
                    <span className="hub-metric-value">
                      {currentCustomBet.placedSelection ?? "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="hub-metric-label">Chosen Market</span>
                    <span className="hub-metric-value">
                      {currentCustomBet.placedMarket ?? "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="hub-metric-label">Placed At</span>
                    <span className="hub-metric-value">
                      {currentCustomBet.placedAtIso
                        ? formatPlacedAt(currentCustomBet.placedAtIso)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
            {currentCustomBet.state === "staked" && currentCustomBet.outcomeStatus ? (
              <div className="hub-custom-bet-panel">
                <div className="hub-panel-title-row">
                  <Flag size={18} />
                  <h2 className="hub-panel-title">Outcome</h2>
                </div>
                <p className="hub-subtitle">
                  {currentCustomBet.outcomeStatus === "won"
                    ? `Won and returned ${formatCurrency(currentCustomBet.outcomeValueAmount ?? 0, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}.`
                    : currentCustomBet.outcomeStatus === "cashed_out"
                      ? `Cashed out for ${formatCurrency(currentCustomBet.outcomeValueAmount ?? 0, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}.`
                      : isFreeBetOffer
                        ? "Lost with no return. This free stake did not debit the pot."
                        : "Lost with no return."}
                </p>
                {currentCustomBet.outcomeAtIso ? (
                  <p className="hub-subtitle">
                    Outcome Time: {formatPlacedAt(currentCustomBet.outcomeAtIso)}
                  </p>
                ) : null}
                {currentCustomBet.outcomeSummary ? (
                  <p className="hub-subtitle">{currentCustomBet.outcomeSummary}</p>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </article>

      {isAdminUser && currentCustomBet.state === "pending" && isPlacementDialogOpen ? (
        <div
          className="hub-modal-backdrop"
          role="presentation"
          onClick={() => setIsPlacementDialogOpen(false)}
        >
          <div
            className="hub-modal hub-admin-placement-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`custom-bet-placement-title-${currentCustomBet.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="hub-modal-header hub-transactions-modal-header">
              <div>
                <h2
                  id={`custom-bet-placement-title-${currentCustomBet.id}`}
                  className="hub-panel-title"
                >
                  Mark Bet Placed
                </h2>
                <p className="hub-subtitle">
                  Record the stake, placed odds, and placement time to move this
                  recommendation into the staked state.
                </p>
                <p className="hub-subtitle">
                  Enable free offer when this stake is promotional and should not debit the
                  ledger.
                </p>
              </div>

              <button
                className="hub-icon-button hub-transactions-modal-close"
                type="button"
                aria-label="Close Mark Bet Placed dialog"
                onClick={() => setIsPlacementDialogOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form className="auth-form" onSubmit={handleMarkPlaced}>
              <label className="auth-field">
                <span className="hub-label">
                  {isFreeStake ? "Free Stake Amount" : "Actual Stake"}
                </span>
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
                <span className="hub-label">Chosen Option</span>
                <select
                  className="auth-input"
                  value={placedProposalRank}
                  onChange={(event) => setPlacedProposalRank(event.target.value)}
                  required
                >
                  {proposedBets.map((proposedBet) => (
                    <option key={proposedBet.rank} value={String(proposedBet.rank)}>
                      {proposedBet.rank}. {proposedBet.selection} ({proposedBet.market})
                    </option>
                  ))}
                </select>
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
              <label className="auth-field">
                <span className="hub-label">Stake Type</span>
                <div className="auth-input" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={isFreeStake}
                    onChange={(event) => setIsFreeStake(event.target.checked)}
                  />
                  <span>Free offer (no ledger debit)</span>
                </div>
              </label>
              <button
                className="hub-primary-button hub-admin-placement-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Mark Bet Placed"}
              </button>
            </form>
            {statusMessage ? (
              <p className="auth-status auth-status-success">{statusMessage}</p>
            ) : null}
            {errorMessage ? (
              <p className="auth-status auth-status-error">{errorMessage}</p>
            ) : null}
          </div>
        </div>
      ) : null}
      {isAdminUser &&
      currentCustomBet.state === "staked" &&
      !currentCustomBet.outcomeStatus &&
      isOutcomeDialogOpen ? (
        <div
          className="hub-modal-backdrop"
          role="presentation"
          onClick={() => setIsOutcomeDialogOpen(false)}
        >
          <div
            className="hub-modal hub-admin-placement-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`custom-bet-outcome-title-${currentCustomBet.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="hub-modal-header hub-transactions-modal-header">
              <div>
                <h2
                  id={`custom-bet-outcome-title-${currentCustomBet.id}`}
                  className="hub-panel-title"
                >
                  Set Outcome
                </h2>
                <p className="hub-subtitle">
                  Record the final outcome for this custom bet.
                </p>
              </div>

              <button
                className="hub-icon-button hub-transactions-modal-close"
                type="button"
                aria-label="Close Set Outcome dialog"
                onClick={() => setIsOutcomeDialogOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSetOutcome}>
              <label className="auth-field">
                <span className="hub-label">Result</span>
                <select
                  className="auth-input"
                  value={outcomeStatus}
                  onChange={(event) =>
                    setOutcomeStatus(event.target.value as "won" | "lost" | "cashed_out")
                  }
                  required
                >
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="cashed_out">Cashed Out</option>
                </select>
              </label>
              {outcomeStatus === "won" || outcomeStatus === "cashed_out" ? (
                <label className="auth-field">
                  <span className="hub-label">Return Value</span>
                  <input
                    className="auth-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={outcomeValueAmount}
                    onChange={(event) => setOutcomeValueAmount(event.target.value)}
                    required
                  />
                </label>
              ) : null}
              <label className="auth-field">
                <span className="hub-label">Outcome Time</span>
                <input
                  className="auth-input"
                  type="datetime-local"
                  value={outcomeAt}
                  onChange={(event) => setOutcomeAt(event.target.value)}
                  required
                />
              </label>
              <label className="auth-field">
                <span className="hub-label">Summary</span>
                <textarea
                  className="auth-input"
                  value={outcomeSummary}
                  onChange={(event) => setOutcomeSummary(event.target.value)}
                  placeholder="Optional notes"
                  rows={3}
                />
              </label>
              <button
                className="hub-primary-button hub-admin-placement-button"
                type="submit"
                disabled={isSubmittingOutcome}
              >
                {isSubmittingOutcome ? "Saving..." : "Set Outcome"}
              </button>
            </form>
            {outcomeStatusMessage ? (
              <p className="auth-status auth-status-success">{outcomeStatusMessage}</p>
            ) : null}
            {outcomeErrorMessage ? (
              <p className="auth-status auth-status-error">{outcomeErrorMessage}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function FootballDetail({ customBet }: { customBet: CustomBetRecord }) {
  const details = customBet.football;

  if (!details) {
    return null;
  }

  return (
    <>
      <p className="hub-subtitle">
        {details.fixture} · {details.kickoffNote}
      </p>
      <p className="hub-subtitle">{details.competition}</p>
      <h3 className="hub-panel-title">Team News</h3>
      <ul className="hub-detail-list">
        {details.teamNews.map((item) => (
          <li key={item} className="hub-subtitle">
            {item}
          </li>
        ))}
      </ul>
      <h3 className="hub-panel-title">Tactical Angles</h3>
      <ul className="hub-detail-list">
        {details.tacticalAngles.map((item) => (
          <li key={item} className="hub-subtitle">
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

function GolfDetail({ customBet }: { customBet: CustomBetRecord }) {
  const details = customBet.golf;

  if (!details) {
    return null;
  }

  return (
    <>
      <p className="hub-subtitle">
        {details.tournament} · {details.course}
      </p>
      <p className="hub-subtitle">Player focus: {details.playerName}</p>
      {details.eachWayTerms ? (
        <p className="hub-subtitle">Each-way terms: {details.eachWayTerms}</p>
      ) : null}
      <h3 className="hub-panel-title">Key Stats</h3>
      <ul className="hub-detail-list">
        {details.keyStats.map((item) => (
          <li key={item} className="hub-subtitle">
            {item}
          </li>
        ))}
      </ul>
      <h3 className="hub-panel-title">Field Angles</h3>
      <ul className="hub-detail-list">
        {details.fieldAngles.map((item) => (
          <li key={item} className="hub-subtitle">
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

function formatCustomBetSport(sport: CustomBetRecord["sport"]) {
  if (sport === "horse_racing") {
    return "Horse Racing";
  }

  if (sport === "football") {
    return "Football";
  }

  return "Golf";
}

function formatCustomBetType(customBetType: CustomBetRecord["customBetType"]) {
  return customBetType === "free_bet_offer" ? "Free Bet Offer" : "Standard";
}

function renderCustomBetSportIcon(sport: CustomBetRecord["sport"]): ReactNode {
  if (sport === "horse_racing") {
    return <HorseHeadIcon size={20} />;
  }

  if (sport === "football") {
    return <SoccerBallIcon size={20} />;
  }

  return <GolfBallIcon size={20} />;
}

function getCustomBetSportIconClassName(customBet: CustomBetRecord) {
  if (customBet.sport === "horse_racing") {
    return "hub-proposal-icon-aggressive";
  }

  if (customBet.sport === "football") {
    return "hub-proposal-icon-balanced";
  }

  return "hub-proposal-icon-safe";
}

function getCustomBetSportTagClassName(sport: CustomBetRecord["sport"]) {
  if (sport === "horse_racing") {
    return "hub-tag-aggressive";
  }

  if (sport === "football") {
    return "hub-tag-balanced";
  }

  return "hub-tag-safe";
}

function formatFeedbackLegOutcome(outcome: "won" | "lost" | "cashed_out" | "void" | "unknown") {
  if (outcome === "won") {
    return "Won";
  }

  if (outcome === "lost") {
    return "Lost";
  }

  if (outcome === "cashed_out") {
    return "Cashed Out";
  }

  if (outcome === "void") {
    return "Void";
  }

  return "Unknown";
}

function formatCustomBetState(state: CustomBetRecord["state"]) {
  return state === "staked" ? "Staked" : "Pending";
}

function formatEventWindow(eventStartIso: string, eventEndIso?: string) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
    hour12: false,
  });
  const startLabel = formatter.format(new Date(eventStartIso));

  if (!eventEndIso) {
    return startLabel;
  }

  const endLabel = formatter.format(new Date(eventEndIso));
  return `${startLabel} - ${endLabel}`;
}

function formatPlacedAt(placedAtIso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
    hour12: false,
  }).format(new Date(placedAtIso));
}

function toDateTimeLocalValue(isoString: string) {
  const date = new Date(isoString);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function fromDateTimeLocalValue(value: string) {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
}

function getSuggestedStakeForProposedBet({
  proposedBet,
  totalSuggestedStakeAmount,
  proposedBets,
}: {
  proposedBet: CustomBetRecord["proposedBets"][number];
  totalSuggestedStakeAmount: number | undefined;
  proposedBets: CustomBetRecord["proposedBets"];
}) {
  if (
    totalSuggestedStakeAmount === undefined ||
    !Number.isFinite(totalSuggestedStakeAmount) ||
    totalSuggestedStakeAmount <= 0
  ) {
    return undefined;
  }

  if (proposedBets.length <= 1) {
    return roundCurrency(totalSuggestedStakeAmount);
  }

  const rankedProposedBets = [...proposedBets].sort((a, b) => a.rank - b.rank);
  const weightByRank = getWeightByRank(rankedProposedBets.length);
  const weightedCost = rankedProposedBets.reduce((total, bet, index) => {
    const weight = weightByRank[index] ?? 0;
    const multiplier = getBetCostMultiplier(bet.market);
    return total + weight * multiplier;
  }, 0);

  if (weightedCost <= 0) {
    return undefined;
  }

  const targetIndex = rankedProposedBets.findIndex((bet) => bet.rank === proposedBet.rank);
  if (targetIndex < 0) {
    return undefined;
  }

  const targetWeight = weightByRank[targetIndex] ?? 0;
  const baseUnitStake = totalSuggestedStakeAmount / weightedCost;
  return roundCurrency(baseUnitStake * targetWeight);
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function getWeightByRank(proposedBetCount: number) {
  if (proposedBetCount >= 3) {
    return [0.55, 0.3, 0.15];
  }

  if (proposedBetCount === 2) {
    return [0.65, 0.35];
  }

  return [1];
}

function getBetCostMultiplier(market: string) {
  return /each[\s-]?way/i.test(market) ? 2 : 1;
}
