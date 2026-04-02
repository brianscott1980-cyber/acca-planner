import {
  marketAnalysisSnapshots,
  type MarketAnalysisSelectionRecord,
} from "../data/market_analysis";

export function getLatestLadbrokesSnapshot(matchdayId: string) {
  return marketAnalysisSnapshots.find((snapshot) => snapshot.matchdayId === matchdayId) ?? null;
}

export function getLadbrokesSelection(selectionId: string) {
  for (const snapshot of marketAnalysisSnapshots) {
    const selection = snapshot.selections.find((entry) => entry.id === selectionId);

    if (selection) {
      return selection;
    }
  }

  return null;
}

export function getLadbrokesSelectionOdds(selectionId: string) {
  return getLadbrokesSelection(selectionId)?.decimalOdds ?? null;
}

export function getLadbrokesSelectionDisplayOdds(selectionId: string) {
  const odds = getLadbrokesSelectionOdds(selectionId);

  return odds ? odds.toFixed(2) : "N/A";
}

export function getLadbrokesSelectionsForMatchday(matchdayId: string) {
  return getLatestLadbrokesSnapshot(matchdayId)?.selections ?? [];
}

export function formatLadbrokesSourceLabel(matchdayId: string) {
  const snapshot = getLatestLadbrokesSnapshot(matchdayId);

  if (!snapshot) {
    return "Ladbrokes";
  }

  return `${snapshot.bookmaker} snapshot ${formatSnapshotDate(snapshot.snapshotDate)}`;
}

function formatSnapshotDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function hasLadbrokesSelection(selectionId: string) {
  return Boolean(getLadbrokesSelection(selectionId));
}

export type { MarketAnalysisSelectionRecord as LadbrokesSelectionRecord };
