import { getLadbrokesSelectionRow, getLadbrokesSelectionsBySnapshotId, getLadbrokesSnapshotRow } from "../repositories/ladbrokes_odds_repository";
import type { LadbrokesSnapshotRecord } from "../types/ladbrokes_odds_type";

export function getLatestLadbrokesSnapshot(matchdayId: string): LadbrokesSnapshotRecord | null {
  const snapshot = getLadbrokesSnapshotRow(matchdayId);

  if (!snapshot) {
    return null;
  }

  return {
    ...snapshot,
    selections: getLadbrokesSelectionsBySnapshotId(snapshot.id),
  };
}

export function getLadbrokesSelection(selectionId: string) {
  return getLadbrokesSelectionRow(selectionId);
}

export function hasLadbrokesSelection(selectionId: string) {
  return Boolean(getLadbrokesSelection(selectionId));
}

export function getLadbrokesSelectionsForMatchday(matchdayId: string) {
  const snapshot = getLadbrokesSnapshotRow(matchdayId);

  return snapshot ? getLadbrokesSelectionsBySnapshotId(snapshot.id) : [];
}

export function getLadbrokesSelectionOdds(selectionId: string) {
  return getLadbrokesSelection(selectionId)?.decimalOdds ?? null;
}

export function getLadbrokesSelectionDisplayOdds(selectionId: string) {
  const odds = getLadbrokesSelectionOdds(selectionId);

  return odds ? odds.toFixed(2) : "N/A";
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
