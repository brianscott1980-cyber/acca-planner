import type { MatchdayProposalRecord } from "../types/matchday_type";

export const matchdayProposals: MatchdayProposalRecord[] = [
  {
    id: "md-1-proposal-safe",
    gameWeekId: "md-1",
    proposalId: "safe",
    riskLevel: "safe",
    title: "Defensive Accumulator",
    summary:
      "Three short-priced away and home favourites keep the opening weekend slip outcome-led and cashout-friendly.",
    legs: 3,
    statusLabel: "Lower variance",
    betLineIds: [
      "md-1-safe-line-1",
      "md-1-safe-line-2",
      "md-1-safe-line-3",
    ],
  },
  {
    id: "md-1-proposal-balanced",
    gameWeekId: "md-1",
    proposalId: "balanced",
    riskLevel: "balanced",
    title: "Neutral Accumulator",
    summary:
      "Adds Leverkusen to the safer core to lift the price without pushing into a pure goals-chasing profile.",
    legs: 4,
    statusLabel: "Best blend",
    aiRecommended: true,
    betLineIds: [
      "md-1-balanced-line-1",
      "md-1-balanced-line-2",
      "md-1-balanced-line-3",
      "md-1-balanced-line-4",
    ],
  },
  {
    id: "md-1-proposal-aggressive",
    gameWeekId: "md-1",
    proposalId: "aggressive",
    riskLevel: "aggressive",
    title: "Aggressive Accumulator",
    summary:
      "Keeps the German and Spanish winners intact, then pushes the upside with a price-boosting BTTS leg in Inter v Roma.",
    legs: 4,
    statusLabel: "Higher upside",
    betLineIds: [
      "md-1-aggressive-line-1",
      "md-1-aggressive-line-2",
      "md-1-aggressive-line-3",
      "md-1-aggressive-line-4",
    ],
  },
];
