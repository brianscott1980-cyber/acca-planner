import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getLeagueClubByName(name: string) {
  return getCurrentAppDataSnapshot().leagueClubs.find((club) => club.name === name) ?? null;
}
