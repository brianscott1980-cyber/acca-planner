import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getLeagueSimulationVoteRows(simulationId: string) {
  return getCurrentAppDataSnapshot().leagueDataVotes.filter(
    (voteRow) => voteRow.simulationId === simulationId,
  );
}
