import { getCustomBetById, getCustomBetBySlug, getCustomBets } from "../repositories/custom_bet_repository";

export function getCustomBetHref(customBetId: string) {
  return `/custom-bet?bet=${encodeURIComponent(customBetId)}`;
}

export function getCustomBet(customBetIdOrSlug: string | null | undefined) {
  return (
    getCustomBetById(customBetIdOrSlug) ??
    getCustomBetBySlug(customBetIdOrSlug) ??
    null
  );
}

export function getSortedCustomBets() {
  return [...getCustomBets()].sort(
    (left, right) =>
      new Date(right.generatedAtIso).getTime() - new Date(left.generatedAtIso).getTime(),
  );
}
