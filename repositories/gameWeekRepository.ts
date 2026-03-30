import {
  gameWeeks,
  type GameWeekRecord,
  type GameWeekProposalRecord,
} from "../data/gameWeeks";

export function getCurrentGameWeek() {
  return gameWeeks[0];
}

export function getGameWeeks() {
  return gameWeeks;
}

export function getProposalVotes(
  gameWeek: GameWeekRecord,
  proposalId: string,
) {
  return Object.entries(gameWeek.votesByUserId)
    .filter(([, votedProposalId]) => votedProposalId === proposalId)
    .map(([userId]) => userId);
}

export function getUserVoteForGameWeek(
  gameWeek: GameWeekRecord,
  userId: string,
) {
  return gameWeek.votesByUserId[userId] ?? null;
}

export function getLeadingProposal(gameWeek: GameWeekRecord) {
  let leadingProposal: GameWeekProposalRecord | null = null;
  let highestVoteCount = -1;

  for (const proposal of gameWeek.proposals) {
    const voteCount = getProposalVotes(gameWeek, proposal.id).length;

    if (voteCount > highestVoteCount) {
      highestVoteCount = voteCount;
      leadingProposal = proposal;
    }
  }

  return leadingProposal;
}

export function updateUserVoteForGameWeek(
  gameWeek: GameWeekRecord,
  userId: string,
  proposalId: string,
) {
  return {
    ...gameWeek,
    votesByUserId: {
      ...gameWeek.votesByUserId,
      [userId]: proposalId,
    },
  };
}
