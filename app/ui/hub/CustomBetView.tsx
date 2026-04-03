"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Flame, Flag, Trophy } from "lucide-react";
import { getCustomBet } from "../../../services/custom_bet_service";
import { markCustomBetAsStaked } from "../../../services/custom_bet_admin_service";
import type { CustomBetRecord } from "../../../types/custom_bet_type";
import { useAuth } from "../auth/AuthProvider";
import { formatCurrency } from "../../../services/ledger_service";

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
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const eventWindowLabel = useMemo(
    () => formatEventWindow(currentCustomBet.eventStartIso, currentCustomBet.eventEndIso),
    [currentCustomBet.eventEndIso, currentCustomBet.eventStartIso],
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
      setErrorMessage("Enter a valid stake, odds, and placement date/time.");
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
      });

      setCurrentCustomBet(nextCustomBet);
      setStatusMessage("Custom bet marked as staked.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update the custom bet.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="hub-wide">
      <div className="hub-page-copy">
        <h1 className="hub-title">{currentCustomBet.title}</h1>
        <p className="hub-subtitle">{currentCustomBet.summary}</p>
      </div>

      <div className="hub-panel">
        <div className="hub-panel-title-row">
          <Trophy size={18} />
          <h2 className="hub-panel-title">Recommended Bet</h2>
        </div>
        <p className="hub-subtitle">
          {currentCustomBet.competitionName} · {formatCustomBetSport(currentCustomBet.sport)} · {currentCustomBet.bookmaker}
        </p>
        <div className="hub-metrics-grid">
          <div className="hub-metric-card">
            <span className="hub-metric-label">Requested Format</span>
            <span className="hub-metric-value">{currentCustomBet.bettingFormatRequested}</span>
          </div>
          <div className="hub-metric-card">
            <span className="hub-metric-label">Market</span>
            <span className="hub-metric-value">{currentCustomBet.recommendedMarket}</span>
          </div>
          <div className="hub-metric-card">
            <span className="hub-metric-label">Selection</span>
            <span className="hub-metric-value">{currentCustomBet.recommendedSelection}</span>
          </div>
          <div className="hub-metric-card">
            <span className="hub-metric-label">Odds</span>
            <span className="hub-metric-value">{currentCustomBet.decimalOdds.toFixed(2)}</span>
          </div>
          <div className="hub-metric-card">
            <span className="hub-metric-label">State</span>
            <span className="hub-metric-value">{formatCustomBetState(currentCustomBet.state)}</span>
          </div>
          <div className="hub-metric-card">
            <span className="hub-metric-label">Event Window</span>
            <span className="hub-metric-value">{eventWindowLabel}</span>
          </div>
        </div>
      </div>

      {currentCustomBet.state === "staked" ? (
        <div className="hub-panel">
          <div className="hub-panel-title-row">
            <Flag size={18} />
            <h2 className="hub-panel-title">Staked Detail</h2>
          </div>
          <div className="hub-metrics-grid">
            <div className="hub-metric-card">
              <span className="hub-metric-label">Stake</span>
              <span className="hub-metric-value">
                {currentCustomBet.stakeAmount !== undefined
                  ? formatCurrency(currentCustomBet.stakeAmount, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "N/A"}
              </span>
            </div>
            <div className="hub-metric-card">
              <span className="hub-metric-label">Placed Odds</span>
              <span className="hub-metric-value">
                {currentCustomBet.placedDecimalOdds?.toFixed(2) ?? "N/A"}
              </span>
            </div>
            <div className="hub-metric-card">
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

      {isAdminUser && currentCustomBet.state === "pending" ? (
        <div className="hub-panel">
          <div className="hub-panel-title-row">
            <Flag size={18} />
            <h2 className="hub-panel-title">Admin Placement</h2>
          </div>
          <p className="hub-subtitle">
            This custom bet is pending. Record the actual stake, placed odds, and placement time to move it into the staked state.
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
            <button className="hub-primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Mark Bet Placed"}
            </button>
          </form>
          {statusMessage ? <p className="auth-status auth-status-success">{statusMessage}</p> : null}
          {errorMessage ? <p className="auth-status auth-status-error">{errorMessage}</p> : null}
        </div>
      ) : null}

      <div className="hub-panel">
        <div className="hub-panel-title-row">
          <Flame size={18} />
          <h2 className="hub-panel-title">AI Analysis</h2>
        </div>
        <p className="hub-subtitle">{currentCustomBet.analysisSummary}</p>
        <p className="hub-subtitle">{currentCustomBet.mediaSummary}</p>
      </div>

      <div className="hub-panel">
        <div className="hub-panel-title-row">
          <Flag size={18} />
          <h2 className="hub-panel-title">Cashout Strategy</h2>
        </div>
        <div className="hub-metrics-grid">
          <div className="hub-metric-card">
            <span className="hub-metric-label">Lower</span>
            <span className="hub-metric-value">{currentCustomBet.cashoutLowerTarget}</span>
          </div>
          <div className="hub-metric-card">
            <span className="hub-metric-label">Upper</span>
            <span className="hub-metric-value">{currentCustomBet.cashoutUpperTarget}</span>
          </div>
          <div className="hub-metric-card">
            <span className="hub-metric-label">No Cashout</span>
            <span className="hub-metric-value">{currentCustomBet.noCashoutValue}</span>
          </div>
        </div>
        <ul className="hub-detail-list">
          {currentCustomBet.cashoutAdvice.map((advice) => (
            <li key={advice} className="hub-subtitle">
              {advice}
            </li>
          ))}
        </ul>
        <h3 className="hub-panel-title">What To Watch</h3>
        <ul className="hub-detail-list">
          {currentCustomBet.watchPoints.map((watchPoint) => (
            <li key={watchPoint} className="hub-subtitle">
              {watchPoint}
            </li>
          ))}
        </ul>
        <h3 className="hub-panel-title">Main Risks</h3>
        <ul className="hub-detail-list">
          {currentCustomBet.riskFactors.map((riskFactor) => (
            <li key={riskFactor} className="hub-subtitle">
              {riskFactor}
            </li>
          ))}
        </ul>
      </div>

      <div className="hub-panel">
        <h2 className="hub-panel-title">Event Detail</h2>
        {currentCustomBet.sport === "horse_racing" && currentCustomBet.horseRacing ? (
          <HorseRacingDetail customBet={currentCustomBet} />
        ) : null}
        {currentCustomBet.sport === "football" && currentCustomBet.football ? (
          <FootballDetail customBet={currentCustomBet} />
        ) : null}
        {currentCustomBet.sport === "golf" && currentCustomBet.golf ? (
          <GolfDetail customBet={currentCustomBet} />
        ) : null}
      </div>
    </section>
  );
}

function HorseRacingDetail({ customBet }: { customBet: CustomBetRecord }) {
  const details = customBet.horseRacing;

  if (!details) {
    return null;
  }

  return (
    <>
      <p className="hub-subtitle">
        {details.racecourse} · {details.raceTimeNote}
      </p>
      <ul className="hub-detail-list">
        <li className="hub-subtitle">Horse: {details.horseName}</li>
        <li className="hub-subtitle">Trainer: {details.trainer}</li>
        <li className="hub-subtitle">Jockey: {details.jockey}</li>
        {details.going ? <li className="hub-subtitle">Going: {details.going}</li> : null}
        {details.distance ? <li className="hub-subtitle">Distance: {details.distance}</li> : null}
        {details.fieldSize ? <li className="hub-subtitle">Field size: {details.fieldSize}</li> : null}
      </ul>
      {details.notableRivals.length > 0 ? (
        <>
          <h3 className="hub-panel-title">Main Rivals</h3>
          <ul className="hub-detail-list">
            {details.notableRivals.map((rival) => (
              <li key={rival} className="hub-subtitle">
                {rival}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
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
