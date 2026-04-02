import { leagueDataVotes } from "../data/league_data_votes";

export function getSimulationVotesByUserId(simulationId: string) {
  return leagueDataVotes
    .filter((voteRow) => voteRow.simulationId === simulationId)
    .reduce<Record<string, string>>((accumulator, voteRow) => {
      accumulator[voteRow.userId] = voteRow.proposalId;
      return accumulator;
    }, {});
}
