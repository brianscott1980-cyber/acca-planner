import { getMatchdaySchedule } from "./matchday_schedule_service";
import type {
  GameWeekRecord,
  GameWeekProposalRecord,
} from "../types/matchday_type";
import type {
  BetLineInsight,
  CashoutStrategy,
  GameWeekViewState,
  ProposalBetLine,
} from "../types/game_week_type";
import { getMemberCount } from "../repositories/user_repository";
import { formatCurrency, getLedgerSummary } from "./ledger_service";
import { getLadbrokesSelectionDisplayOdds, getLadbrokesSelectionOdds } from "./ladbrokes_odds_service";
import {
  getCurrentSimulatedGameWeek,
  getCompletedSimulatedGameWeeks,
  getGameWeekSimulation,
  getGameWeekTimingLabel,
  getSimulatedNow,
  getSettledSimulatedTimelineRecords,
  getSortedGameWeeks,
  getVisibleSimulatedTimelineRecords,
} from "./league_simulation_service";

export function getCurrentGameWeek() {
  return getCurrentSimulatedGameWeek();
}

export function getGameWeekById(gameWeekId: string | null | undefined) {
  if (!gameWeekId) {
    return null;
  }

  return getSortedGameWeeks().find((gameWeek) => gameWeek.id === gameWeekId) ?? null;
}

export function getGameWeeks() {
  return getSortedGameWeeks();
}

export function getLatestAccessibleGameWeek() {
  const gameWeeks = getGameWeeks();
  const currentGameWeek = getCurrentGameWeek();

  if (getGameWeekViewState(currentGameWeek) === "voting") {
    return currentGameWeek;
  }

  return gameWeeks.at(-1) ?? currentGameWeek;
}

export function getAccessibleGameWeekById(gameWeekId: string | null | undefined) {
  const requestedGameWeek = getGameWeekById(gameWeekId);

  if (!requestedGameWeek) {
    return null;
  }

  const gameWeeks = getGameWeeks();
  const latestAccessibleGameWeek = getLatestAccessibleGameWeek();
  const requestedIndex = gameWeeks.findIndex(
    (gameWeek) => gameWeek.id === requestedGameWeek.id,
  );
  const latestAccessibleIndex = gameWeeks.findIndex(
    (gameWeek) => gameWeek.id === latestAccessibleGameWeek.id,
  );

  if (requestedIndex === -1 || latestAccessibleIndex === -1) {
    return requestedGameWeek;
  }

  return requestedIndex <= latestAccessibleIndex
    ? requestedGameWeek
    : latestAccessibleGameWeek;
}

export function canNavigateToGameWeek(gameWeekId: string) {
  return getAccessibleGameWeekById(gameWeekId)?.id === gameWeekId;
}

export function getCurrentMatchdayNumber() {
  const currentGameWeek = getCurrentGameWeek();
  return currentGameWeek ? getMatchdayNumberFromGameWeekId(currentGameWeek.id) : null;
}

export function getMatchdayNumberFromGameWeekId(gameWeekId: string) {
  const gameWeek =
    getMatchdaySchedule().find((entry) => entry.id === gameWeekId) ??
    getMatchdaySchedule().find((entry) => entry.slug === gameWeekId);
  const match =
    gameWeek?.id.match(/\d+/) ??
    gameWeek?.slug.match(/\d+/) ??
    gameWeekId.match(/\d+/);

  return match ? Number.parseInt(match[0], 10) : null;
}

export function getGameWeekIdFromMatchdayNumber(
  matchdayNumber: string | number | null | undefined,
) {
  if (matchdayNumber === null || matchdayNumber === undefined) {
    return null;
  }

  const normalizedNumber = String(matchdayNumber).trim().replace(/^md-?/i, "");

  if (!/^\d+$/.test(normalizedNumber)) {
    return null;
  }

  const gameWeek = getMatchdaySchedule().find(
    (entry) => getMatchdayNumberFromGameWeekId(entry.id) === Number.parseInt(normalizedNumber, 10),
  );

  return gameWeek?.id ?? null;
}

export function getMatchdayHref({
  gameWeekId,
  stage,
}: {
  gameWeekId: string;
  stage?: "pending" | null;
}) {
  const matchdayNumber = getMatchdayNumberFromGameWeekId(gameWeekId);
  const basePathname = matchdayNumber ? `/matchday/${matchdayNumber}` : "/matchday";
  return stage === "pending" ? `${basePathname}/pending/` : basePathname;
}

export function getStaticMatchdayNumberParams() {
  return getMatchdaySchedule()
    .map((gameWeek) => getMatchdayNumberFromGameWeekId(gameWeek.id))
    .filter((matchdayNumber): matchdayNumber is number => matchdayNumber !== null)
    .map((matchdayNumber) => ({
      matchdayNumber: String(matchdayNumber),
    }));
}

export function getPendingProposalIdForGameWeek(gameWeekId: string) {
  const gameWeek = getGameWeekById(gameWeekId);
  const simulatedProposalId = getGameWeekSimulation(gameWeekId)?.selectedProposalId;

  if (simulatedProposalId) {
    return simulatedProposalId;
  }

  const fallbackProposal =
    gameWeek?.proposals.find((proposal) => proposal.aiRecommended) ??
    gameWeek?.proposals[0];

  return fallbackProposal?.id ?? null;
}

export function getCompletedGameWeekCount() {
  return getCompletedSimulatedGameWeeks().length;
}

export function getCurrentGameWeekTimingLabel() {
  return getGameWeekTimingLabel(getCurrentGameWeek());
}

export function getGameWeekTimingStatusLabel(gameWeek: GameWeekRecord) {
  return getGameWeekTimingLabel(gameWeek);
}

export function getGameWeekConsensusProposalId(gameWeek: GameWeekRecord) {
  const simulation = getGameWeekSimulation(gameWeek.id);

  if (!simulation) {
    return null;
  }

  return simulation.selectedProposalId;
}

export function getGameWeekSelectedProposal(gameWeek: GameWeekRecord) {
  const selectedProposalId = getGameWeekConsensusProposalId(gameWeek);

  return selectedProposalId
    ? gameWeek.proposals.find((proposal) => proposal.id === selectedProposalId) ?? null
    : null;
}

export function getGameWeekViewState(gameWeek: GameWeekRecord): GameWeekViewState {
  const simulation = getGameWeekSimulation(gameWeek.id);
  const now = getSimulatedNow().getTime();

  if (!simulation || !getGameWeekConsensusProposalId(gameWeek)) {
    return "voting";
  }

  if (new Date(simulation.voteResolvedAtIso).getTime() > now) {
    return "voting";
  }

  if (new Date(simulation.simulatedSlip.stakePlacedAt).getTime() > now) {
    return "locked";
  }

  if (new Date(simulation.simulatedSlip.settledAt).getTime() > now) {
    return "placed";
  }

  return "review";
}

export function getGameWeekTimelineRecords() {
  return getSettledSimulatedTimelineRecords()
    .map(({ gameWeek, simulation }) => {
      const proposal = gameWeek.proposals.find(
        (entry) => entry.id === simulation.simulatedSlip.proposalId,
      );

      if (!proposal) {
        return null;
      }

      return {
        gameWeek,
        proposal,
        simulation,
      };
    })
    .filter((entry) => entry !== null);
}

export function getVisibleGameWeekTimelineRecords() {
  return getVisibleSimulatedTimelineRecords()
    .map(({ gameWeek, simulation }) => {
      const proposal = gameWeek.proposals.find(
        (entry) => entry.id === simulation.simulatedSlip.proposalId,
      );

      if (!proposal) {
        return null;
      }

      return {
        gameWeek,
        proposal,
        simulation,
      };
    })
    .filter((entry) => entry !== null);
}

export function isGameWeekVoteLocked(gameWeek: GameWeekRecord) {
  const simulation = getGameWeekSimulation(gameWeek.id);

  if (!simulation) {
    return false;
  }

  return (
    new Date(simulation.voteResolvedAtIso).getTime() <= getSimulatedNow().getTime()
  );
}

export function getProposalVotes(
  gameWeek: GameWeekRecord,
  proposalId: string,
) {
  return Object.entries(gameWeek.votesByUserId)
    .filter(([, votedProposalId]) => votedProposalId === proposalId)
    .map(([userId]) => userId);
}

export function getUserVoteForGameWeek(
  gameWeek: GameWeekRecord,
  userId: string,
) {
  return gameWeek.votesByUserId[userId] ?? null;
}

export function getLeadingProposal(gameWeek: GameWeekRecord) {
  let leadingProposal: GameWeekProposalRecord | null = null;
  let highestVoteCount = -1;

  for (const proposal of gameWeek.proposals) {
    const voteCount = getProposalVotes(gameWeek, proposal.id).length;

    if (voteCount > highestVoteCount) {
      highestVoteCount = voteCount;
      leadingProposal = proposal;
    }
  }

  return leadingProposal;
}

export function updateUserVoteForGameWeek(
  gameWeek: GameWeekRecord,
  userId: string,
  proposalId: string,
) {
  return {
    ...gameWeek,
    votesByUserId: {
      ...gameWeek.votesByUserId,
      [userId]: proposalId,
    },
  };
}

export function getProposalDisplayOdds(proposal: GameWeekProposalRecord) {
  return getProposalDecimalOdds(proposal).toFixed(2);
}

export function getBetLineDisplayOdds(
  betLine: ProposalBetLine,
) {
  if (betLine.marketId) {
    return getLadbrokesSelectionDisplayOdds(betLine.marketId);
  }

  return betLine.odds ?? "N/A";
}

export function getRecommendedStake(
  gameWeek: GameWeekRecord,
  proposal: GameWeekProposalRecord,
) {
  const { currentPot, initialPotTotal } = getLedgerSummary();
  const completedGameWeeks = getCompletedGameWeekCount();
  const aggressiveProposal =
    gameWeek.proposals.find((entry) => entry.riskLevel === "aggressive") ??
    getHighestOddsProposal(gameWeek);
  const aggressiveOdds = getProposalDecimalOdds(aggressiveProposal);
  const proposalOdds = getProposalDecimalOdds(proposal);
  const aggressiveStake = calculateAggressiveStake({
    currentPot,
    initialPotTotal,
    completedGameWeeks,
  });

  if (proposal.id === aggressiveProposal.id) {
    return aggressiveStake;
  }

  const relativeStake = aggressiveStake * (proposalOdds / aggressiveOdds);

  return Math.max(1, Math.round(relativeStake));
}

export function getOrderedBetLines(proposal: GameWeekProposalRecord) {
  return [...proposal.betLines].sort(
    (left, right) => getBetLineSortKey(left) - getBetLineSortKey(right),
  );
}

export function getBetLineInsight(
  proposal: GameWeekProposalRecord,
  betLine: ProposalBetLine,
): BetLineInsight {
  const orderedBetLines = getOrderedBetLines(proposal);
  const currentIndex = orderedBetLines.findIndex(
    (currentBetLine) => currentBetLine.label === betLine.label,
  );
  const lastIndex = orderedBetLines.length - 1;

  return {
    aiReasoning:
      betLine.aiReasoning ??
      "The AI included this market because its price and risk profile fit the overall acca build.",
    sequenceReasoning: getSequenceReasoning(currentIndex, lastIndex),
  };
}

export function getCashoutStrategy(
  gameWeek: GameWeekRecord,
  proposal: GameWeekProposalRecord,
): CashoutStrategy {
  const stake = getRecommendedStake(gameWeek, proposal);
  const projectedReturn = stake * getProposalDecimalOdds(proposal);

  if (proposal.riskLevel === "safe") {
    return {
      lowerTarget: formatWholeCurrency(projectedReturn * 0.42),
      upperTarget: formatWholeCurrency(projectedReturn * 0.68),
      noCashoutValue: formatWholeCurrency(projectedReturn),
      watchList: [
        "Protect the slip if the first two shorter-price legs land and late team news weakens the final leg.",
        "Watch for heavy rotation, especially around televised kick-offs and squads coming off midweek matches.",
        "An early red card in any favourite-heavy leg is the main reason to take a sensible cashout sooner.",
      ],
    };
  }

  if (proposal.riskLevel === "balanced") {
    return {
      lowerTarget: formatWholeCurrency(projectedReturn * 0.3),
      upperTarget: formatWholeCurrency(projectedReturn * 0.54),
      noCashoutValue: formatWholeCurrency(projectedReturn),
      watchList: [
        "Reassess after the first two legs; this profile is strongest when you bank value before the bigger leg swings begin.",
        "Keep an eye on in-play xG and dominance rather than just scorelines when deciding whether the cashout is fair.",
        "If the highest-priced leg drifts badly before kick-off, the safer move is often to lock in a mid-range return.",
      ],
    };
  }

  return {
    lowerTarget: formatWholeCurrency(projectedReturn * 0.18),
    upperTarget: formatWholeCurrency(projectedReturn * 0.4),
    noCashoutValue: formatWholeCurrency(projectedReturn),
    watchList: [
      "This slip is return-led, so avoid cashing too early unless one of the high-price legs becomes materially weaker in-play.",
      "Look out for favourites losing control of territory or shots volume; that is usually the best signal to trim risk.",
      "If the cashout jumps sharply after an early aggressive leg lands, only take it when the remaining upside no longer justifies the swing.",
    ],
  };
}

type AggressiveStakeInput = {
  currentPot: number;
  initialPotTotal: number;
  completedGameWeeks: number;
};

function calculateAggressiveStake({
  currentPot,
  initialPotTotal,
  completedGameWeeks,
}: AggressiveStakeInput) {
  if (currentPot <= 0) {
    return 0;
  }

  const progressRatio = clamp(completedGameWeeks / 12, 0, 1);
  const growthRatio =
    initialPotTotal <= 0 ? 0 : (currentPot - initialPotTotal) / initialPotTotal;
  const profitRatio = Math.max(growthRatio, 0);
  const drawdownRatio = Math.max(-growthRatio, 0);

  const aggressiveRate = clamp(
    0.44 +
      progressRatio * 0.04 +
      profitRatio * 0.05 -
      drawdownRatio * 0.04,
    0.4,
    0.55,
  );

  return Math.max(1, Math.round(currentPot * aggressiveRate));
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getProposalDecimalOdds(proposal: GameWeekProposalRecord) {
  return proposal.betLines.reduce(
    (total, betLine) => total * getBetLineDecimalOdds(betLine),
    1,
  );
}

function getBetLineDecimalOdds(
  betLine: ProposalBetLine,
) {
  if (betLine.marketId) {
    return getLadbrokesSelectionOdds(betLine.marketId) ?? 1;
  }

  return Number.parseFloat(betLine.odds ?? "1");
}

function getBetLineSortKey(betLine: ProposalBetLine) {
  if (!betLine.scheduleNote) {
    return Number.MAX_SAFE_INTEGER;
  }

  const match = betLine.scheduleNote.match(
    /^[A-Za-z]{3}\s+(\d{1,2})\s+([A-Za-z]{3}),\s+(\d{2}):(\d{2})\s+BST$/,
  );

  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  const [, day, monthLabel, hour, minute] = match;
  const month = getMonthIndex(monthLabel);

  if (month === null) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Date.UTC(
    2026,
    month,
    Number.parseInt(day, 10),
    Number.parseInt(hour, 10),
    Number.parseInt(minute, 10),
  );
}

function getMonthIndex(monthLabel: string) {
  const monthIndexes: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  return monthIndexes[monthLabel] ?? null;
}

function getHighestOddsProposal(gameWeek: GameWeekRecord) {
  return gameWeek.proposals.reduce((highest, proposal) =>
    getProposalDecimalOdds(proposal) > getProposalDecimalOdds(highest)
      ? proposal
      : highest,
  );
}

function getSequenceReasoning(currentIndex: number, lastIndex: number) {
  if (currentIndex < 0 || lastIndex <= 0) {
    return null;
  }

  if (currentIndex === 0) {
    return "This is the earliest kickoff, so it sets the first live read on the acca.";
  }

  if (currentIndex === lastIndex) {
    return "This is the final kickoff, so it acts as the closing swing on the acca.";
  }

  return "This sits mid-sequence, bridging the early legs and later cashout decision.";
}

function formatWholeCurrency(value: number) {
  return formatCurrency(Math.round(value), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
