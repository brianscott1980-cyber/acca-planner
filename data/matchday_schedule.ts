import { matchdayBetLines } from "./matchday_bet_lines";
import type {
  MatchdayBetLineRecord,
  MatchdayFormRecord,
  MatchdayGameWeekRecord,
  MatchdayProposalRecord,
} from "./matchday_entities";
import { matchdayForms } from "./matchday_forms";
import { matchdayGameWeeks } from "./matchday_game_weeks";
import { matchdayProposals } from "./matchday_proposals";
import type {
  GameWeekProposalRecord,
  GameWeekRecord,
} from "./matchday_seed";

export type {
  BetLineForm,
  BetLineFormMatch,
  BetLineFormOutcome,
  BetLineFormTeam,
  GameWeekProposalRecord,
  GameWeekRecord,
  RiskLevel,
  SimulatedSlipLegRecord,
  SimulatedSlipLegStatus,
  SimulatedSlipRecord,
} from "./matchday_seed";

export type {
  MatchdayBetLineRecord,
  MatchdayFormRecord,
  MatchdayGameWeekRecord,
  MatchdayProposalRecord,
} from "./matchday_entities";

const matchdayFormsById = new Map<string, MatchdayFormRecord>(
  matchdayForms.map((form) => [form.id, form]),
);
const matchdayBetLinesByProposalId = groupBy(
  matchdayBetLines,
  (betLine) => betLine.proposalEntityId,
);
const matchdayProposalsById = new Map<string, MatchdayProposalRecord>(
  matchdayProposals.map((proposal) => [proposal.id, proposal]),
);

export const matchdaySchedule: GameWeekRecord[] = matchdayGameWeeks.map((gameWeek) =>
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
        const proposal = matchdayProposalsById.get(proposalEntityId);

        return proposal ? composeProposalRecord(proposal) : null;
      })
      .filter((proposal): proposal is GameWeekProposalRecord => proposal !== null),
  };
}

function composeProposalRecord(
  proposal: MatchdayProposalRecord,
): GameWeekProposalRecord {
  const proposalBetLines = (matchdayBetLinesByProposalId[proposal.id] ?? [])
    .slice()
    .sort((left, right) => left.order - right.order);

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
    form: betLine.formId ? matchdayFormsById.get(betLine.formId)?.form : undefined,
    formNote: betLine.formNote,
    odds: betLine.odds,
    marketId: betLine.marketId,
  };
}

function groupBy<TItem>(
  items: TItem[],
  getKey: (item: TItem) => string,
) {
  return items.reduce<Record<string, TItem[]>>((accumulator, item) => {
    const key = getKey(item);
    accumulator[key] = [...(accumulator[key] ?? []), item];
    return accumulator;
  }, {});
}
