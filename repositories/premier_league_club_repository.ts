import { leagueClubs } from "../data/league_clubs";

export function getLeagueClubByName(name: string) {
  return leagueClubs.find((club) => club.name === name) ?? null;
}
