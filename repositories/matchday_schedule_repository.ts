import { matchdayBetLines } from "../data/matchday_bet_lines";
import { matchdayFormMatches } from "../data/matchday_form_matches";
import { matchdayForms } from "../data/matchday_forms";
import { matchdayGameWeeks } from "../data/matchday_game_weeks";
import { matchdayProposals } from "../data/matchday_proposals";

export function getMatchdayGameWeekRows() {
  return matchdayGameWeeks;
}

export function getMatchdayProposalRowById(proposalId: string) {
  return matchdayProposals.find((proposal) => proposal.id === proposalId) ?? null;
}

export function getMatchdayBetLineRowsByProposalId(proposalEntityId: string) {
  return matchdayBetLines.filter((betLine) => betLine.proposalEntityId === proposalEntityId);
}

export function hasMatchdayForm(formId: string) {
  return matchdayForms.some((form) => form.id === formId);
}

export function getMatchdayFormMatchRowsByFormId(formId: string) {
  return matchdayFormMatches.filter((matchRecord) => matchRecord.formId === formId);
}
