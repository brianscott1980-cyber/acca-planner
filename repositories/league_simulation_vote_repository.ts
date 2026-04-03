import { leagueDataVotes } from "../data/league_data_votes";

export function getLeagueSimulationVoteRows(simulationId: string) {
  return leagueDataVotes.filter((voteRow) => voteRow.simulationId === simulationId);
}
