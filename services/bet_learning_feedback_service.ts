import {
  getCustomBetLearningFeedback,
  getMatchdayBetLearningFeedback,
} from "../repositories/bet_learning_feedback_repository";

export function getMatchdayFeedback(matchdayId: string | null | undefined) {
  return getMatchdayBetLearningFeedback(matchdayId);
}

export function getCustomBetFeedback(customBetId: string | null | undefined) {
  return getCustomBetLearningFeedback(customBetId);
}
