import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getMatchdayGameWeekRows() {
  return getCurrentAppDataSnapshot().matchdayGameWeeks;
}

export function getMatchdayProposalRowById(proposalId: string) {
  return getCurrentAppDataSnapshot().matchdayProposals.find(
    (proposal) => proposal.id === proposalId,
  ) ?? null;
}

export function getMatchdayBetLineRowsByProposalId(proposalEntityId: string) {
  return getCurrentAppDataSnapshot().matchdayBetLines.filter(
    (betLine) => betLine.proposalEntityId === proposalEntityId,
  );
}

export function hasMatchdayForm(formId: string) {
  return getCurrentAppDataSnapshot().matchdayForms.some((form) => form.id === formId);
}

export function getMatchdayFormMatchRowsByFormId(formId: string) {
  return getCurrentAppDataSnapshot().matchdayFormMatches.filter(
    (matchRecord) => matchRecord.formId === formId,
  );
}
