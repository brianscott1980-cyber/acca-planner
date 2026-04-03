import { marketAnalysisSelectionRows } from "../data/market_analysis_selections";
import { marketAnalysisSnapshotRows } from "../data/market_analysis_snapshots";

export function getLadbrokesSnapshotRow(matchdayId: string) {
  return marketAnalysisSnapshotRows.find((entry) => entry.matchdayId === matchdayId) ?? null;
}

export function getLadbrokesSelectionRow(selectionId: string) {
  return marketAnalysisSelectionRows.find((entry) => entry.id === selectionId) ?? null;
}

export function getLadbrokesSelectionsBySnapshotId(snapshotId: string) {
  return marketAnalysisSelectionRows.filter((entry) => entry.snapshotId === snapshotId);
}
