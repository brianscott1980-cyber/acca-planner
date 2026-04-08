import type { BetLearningFeedbackRecord } from "../types/bet_learning_feedback_type";

export const betLearningFeedback: BetLearningFeedbackRecord[] = [
  {
    id: "feedback-matchday-md-1",
    betType: "matchday",
    betId: "md-1",
    betTitle: "Matchday 1 Balanced Accumulator",
    reviewedAtIso: "2026-04-05T20:10:00.000Z",
    completedAtIso: "2026-04-05T19:50:00.000Z",
    outcome: "lost",
    stakeAmount: 19,
    returnAmount: 0,
    roiPercent: -100,
    summary:
      "AI retrospective completed after settlement: the balanced slip failed because the second leg (Mallorca v Real Madrid: Real Madrid to win) lost 2-1, which killed the accumulator before the final Inter v Roma BTTS leg.",
    whyUnsuccessful:
      "The model accepted Real Madrid win at short odds in a spot with rotation and motivation asymmetry risk. Bayern won their leg, but the Mallorca upset removed all payout paths immediately.",
    newsSummary:
      "Verified match reports showed Bayern came from 2-0 down to beat Freiburg 3-2, while Real Madrid lost 2-1 at Mallorca after conceding in stoppage time. Coverage around Mallorca-Real highlighted title-race pressure and selection/cohesion issues for Madrid.",
    fanFeedbackSummary:
      "Post-match Madrid fan reaction was strongly negative and focused on frustration with game management and defensive lapses late in the match. Bayern fan tone was relief-focused after a chaotic comeback rather than confidence in control.",
    legFeedback: [
      {
        legLabel: "SC Freiburg v Bayern Munich: Bayern Munich to win",
        legOutcome: "won",
        whatHappened:
          "Bayern recovered from 2-0 down and won 3-2 with late goals, so the anchor leg landed but with higher-than-expected variance.",
        whyItMattered:
          "A winning leg that still showed fragility should have reduced confidence in carrying full exposure through later legs.",
        newsSignals: [
          "Bayern were without Harry Kane and still controlled possession but needed stoppage-time goals to escape.",
          "Match dynamics suggested volatility despite pre-match favorite pricing.",
        ],
        fanSignals: [
          "Bayern community reaction emphasized relief and resilience, not a dominant performance profile.",
        ],
        lesson:
          "Treat comeback-dependent wins as warning signals for live risk management, even when the pick settles as a win.",
      },
      {
        legLabel: "Mallorca v Real Madrid: Real Madrid to win",
        legOutcome: "lost",
        whatHappened:
          "Real Madrid lost 2-1, conceding a stoppage-time winner after equalizing late.",
        whyItMattered:
          "This was the decisive failure point and ended the accumulator before the final leg.",
        newsSignals: [
          "Coverage flagged rotation and rhythm risk around Madrid.",
          "Match reports highlighted poor control in key defensive moments and inconsistent execution under pressure.",
        ],
        fanSignals: [
          "Madrid fan reaction was heavily critical of late game management and lack of cohesion.",
        ],
        lesson:
          "Reduce reliance on short away-favorite singles when pre-match signals include rotation uncertainty plus motivated relegation-threat opposition.",
      },
      {
        legLabel: "Inter Milan v Roma: Both teams to score",
        legOutcome: "won",
        whatHappened:
          "The leg itself landed (Inter 2-1 Roma, BTTS won), but the accumulator had already failed on the Mallorca v Real Madrid leg.",
        whyItMattered:
          "No direct impact on payout because the previous leg had already voided winning paths.",
        newsSignals: [
          "Pre-match previews framed Inter as favorites but acknowledged injuries and lineup uncertainty on the Roma side.",
        ],
        fanSignals: [
          "Pre-match sentiment was mixed: confidence in Inter edge but uncertainty around Roma attacking availability.",
        ],
        lesson:
          "When earlier legs fail, capture this leg as informational only and avoid overfitting later assumptions to non-impacting outcomes.",
      },
    ],
    nextBetAdjustments: [
      "Apply a stricter penalty to short-priced away favorites facing high-motivation underdogs.",
      "Increase explicit rotation-risk weighting for title-chasing clubs near European fixtures.",
      "Use conditional stake protection logic after volatile early-leg wins instead of letting full risk roll automatically.",
    ],
    modelPromptNotes: [
      "If a favored away team has material rotation uncertainty, require either stronger price edge or avoid straight-win inclusion.",
      "Distinguish between 'win by control' and 'win by rescue'; the latter should reduce confidence for subsequent legs.",
      "In balanced slips, avoid stacking medium-confidence legs that can fail on a single game-state swing.",
    ],
    confidenceCalibration:
      "For similar away-favorite spots with rotation noise, downgrade confidence by one tier unless team-news confirmation improves before kickoff.",
    reviewer: "AI Analyst",
  },
];
