export type BetLearningFeedbackBetType = "matchday" | "custom";

export type BetLearningFeedbackOutcome = "won" | "lost" | "cashed_out";

export type BetLearningLegOutcome = "won" | "lost" | "cashed_out" | "void" | "unknown";

export type BetLearningLegFeedbackRecord = {
  legLabel: string;
  legOutcome: BetLearningLegOutcome;
  whatHappened: string;
  whyItMattered: string;
  newsSignals: string[];
  fanSignals: string[];
  lesson: string;
};

export type BetLearningFeedbackRecord = {
  id: string;
  betType: BetLearningFeedbackBetType;
  betId: string;
  betTitle: string;
  reviewedAtIso: string;
  completedAtIso: string;
  outcome: BetLearningFeedbackOutcome;
  stakeAmount?: number;
  returnAmount?: number;
  roiPercent?: number;
  summary: string;
  whySuccessful?: string;
  whyUnsuccessful?: string;
  newsSummary: string;
  fanFeedbackSummary: string;
  legFeedback: BetLearningLegFeedbackRecord[];
  nextBetAdjustments: string[];
  modelPromptNotes: string[];
  confidenceCalibration: string;
  reviewer: string;
};
