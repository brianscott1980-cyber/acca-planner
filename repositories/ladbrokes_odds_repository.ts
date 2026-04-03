import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getLadbrokesSnapshotRow(matchdayId: string) {
  return (
    getCurrentAppDataSnapshot().marketAnalysisSnapshotRows.find(
      (entry) => entry.matchdayId === matchdayId,
    ) ?? null
  );
}

export function getLadbrokesSelectionRow(selectionId: string) {
  return (
    getCurrentAppDataSnapshot().marketAnalysisSelectionRows.find(
      (entry) => entry.id === selectionId,
    ) ?? null
  );
}

export function getLadbrokesSelectionsBySnapshotId(snapshotId: string) {
  return getCurrentAppDataSnapshot().marketAnalysisSelectionRows.filter(
    (entry) => entry.snapshotId === snapshotId,
  );
}
