import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getBetLearningFeedbackRows() {
  return getCurrentAppDataSnapshot().betLearningFeedback;
}

export function getMatchdayBetLearningFeedback(matchdayId: string | null | undefined) {
  if (!matchdayId) {
    return null;
  }

  return (
    getBetLearningFeedbackRows().find(
      (feedback) => feedback.betType === "matchday" && feedback.betId === matchdayId,
    ) ?? null
  );
}

export function getCustomBetLearningFeedback(customBetId: string | null | undefined) {
  if (!customBetId) {
    return null;
  }

  return (
    getBetLearningFeedbackRows().find(
      (feedback) => feedback.betType === "custom" && feedback.betId === customBetId,
    ) ?? null
  );
}
