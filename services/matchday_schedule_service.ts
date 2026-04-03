import {
  getMatchdayBetLineRowsByProposalId,
  getMatchdayFormMatchRowsByFormId,
  getMatchdayGameWeekRows,
  getMatchdayProposalRowById,
  hasMatchdayForm,
} from "../repositories/matchday_schedule_repository";
import type {
  GameWeekProposalRecord,
  GameWeekRecord,
  MatchdayBetLineRecord,
  MatchdayFormMatchRecord,
  MatchdayGameWeekRecord,
  MatchdayProposalRecord,
} from "../types/matchday_type";

export const matchdaySchedule: GameWeekRecord[] = getMatchdayGameWeekRows().map((gameWeek) =>
  composeGameWeekRecord(gameWeek),
);

function composeGameWeekRecord(gameWeek: MatchdayGameWeekRecord): GameWeekRecord {
  return {
    id: gameWeek.id,
    slug: gameWeek.slug,
    name: gameWeek.name,
    description: gameWeek.description,
    windowStartIso: gameWeek.windowStartIso,
    windowEndIso: gameWeek.windowEndIso,
    startsIn: gameWeek.startsIn,
    votesByUserId: gameWeek.votesByUserId,
    simulatedSlip: gameWeek.simulatedSlip,
    proposals: gameWeek.proposalIds
      .map((proposalEntityId) => {
        const proposal = getMatchdayProposalRowById(proposalEntityId);

        return proposal ? composeProposalRecord(proposal) : null;
      })
      .filter((proposal): proposal is GameWeekProposalRecord => proposal !== null),
  };
}

function composeProposalRecord(
  proposal: MatchdayProposalRecord,
): GameWeekProposalRecord {
  const proposalBetLines = getMatchdayBetLineRowsByProposalId(proposal.id)
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder);

  return {
    id: proposal.proposalId,
    riskLevel: proposal.riskLevel,
    title: proposal.title,
    summary: proposal.summary,
    legs: proposal.legs,
    statusLabel: proposal.statusLabel,
    aiRecommended: proposal.aiRecommended,
    betLines: proposalBetLines.map((betLine) => composeBetLineRecord(betLine)),
  };
}

function composeBetLineRecord(
  betLine: MatchdayBetLineRecord,
): GameWeekProposalRecord["betLines"][number] {
  return {
    label: betLine.label,
    scheduleNote: betLine.scheduleNote,
    aiReasoning: betLine.aiReasoning,
    form: betLine.formId ? composeBetLineForm(betLine.formId) : undefined,
    formNote: betLine.formNote,
    odds: betLine.odds,
    marketId: betLine.marketId,
  };
}

function composeBetLineForm(formId: string) {
  if (!hasMatchdayForm(formId)) {
    return undefined;
  }

  const orderedMatches = getMatchdayFormMatchRowsByFormId(formId)
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder);

  return {
    home: {
      matches: orderedMatches
        .filter((matchRecord) => matchRecord.teamSide === "home")
        .map(mapFormMatchRecord),
    },
    away: {
      matches: orderedMatches
        .filter((matchRecord) => matchRecord.teamSide === "away")
        .map(mapFormMatchRecord),
    },
  };
}

function mapFormMatchRecord(matchRecord: MatchdayFormMatchRecord) {
  return {
    opponent: matchRecord.opponent,
    venue: matchRecord.venue,
    finalScore: matchRecord.finalScore,
    goalsScored: matchRecord.goalsScored,
    outcome: matchRecord.outcome,
  };
}
