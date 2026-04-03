import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getCustomBets() {
  return getCurrentAppDataSnapshot().customBets;
}

export function getCustomBetById(customBetId: string | null | undefined) {
  if (!customBetId) {
    return null;
  }

  return getCustomBets().find((customBet) => customBet.id === customBetId) ?? null;
}

export function getCustomBetBySlug(customBetSlug: string | null | undefined) {
  if (!customBetSlug) {
    return null;
  }

  return getCustomBets().find((customBet) => customBet.slug === customBetSlug) ?? null;
}
