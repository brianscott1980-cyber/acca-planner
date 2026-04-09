import { getLeagueClubByName } from "../repositories/premier_league_club_repository";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const CLUB_ALIAS_MAP: Record<string, string> = {
  "as roma": "Roma",
  "atletico madrid": "Atletico Madrid",
  aberdeen: "Aberdeen",
  arsenal: "Arsenal",
  atalanta: "Atalanta",
  "aston villa": "Aston Villa",
  "bayer leverkusen": "Bayer Leverkusen",
  bayern: "Bayern Munich",
  "bayern munich": "Bayern Munich",
  barcelona: "Barcelona",
  bournemouth: "Bournemouth",
  braga: "Braga",
  brentford: "Brentford",
  brighton: "Brighton & Hove Albion",
  "brighton hove albion": "Brighton & Hove Albion",
  burnley: "Burnley",
  chelsea: "Chelsea",
  "crystal palace": "Crystal Palace",
  everton: "Everton",
  falkirk: "Falkirk",
  forest: "Nottingham Forest",
  freiburg: "Freiburg",
  fulham: "Fulham",
  hibernian: "Hibernian",
  hibs: "Hibernian",
  inter: "Inter Milan",
  "inter milan": "Inter Milan",
  juventus: "Juventus",
  leeds: "Leeds United",
  "leeds united": "Leeds United",
  leverkusen: "Bayer Leverkusen",
  liverpool: "Liverpool",
  mallorca: "Mallorca",
  "man city": "Manchester City",
  "man utd": "Manchester United",
  "man united": "Manchester United",
  "manchester city": "Manchester City",
  "manchester united": "Manchester United",
  napoli: "Napoli",
  newcastle: "Newcastle United",
  "newcastle united": "Newcastle United",
  "nottingham forest": "Nottingham Forest",
  parma: "Parma",
  "paris saint germain": "Paris SG",
  "paris sg": "Paris SG",
  psg: "Paris SG",
  rangers: "Rangers",
  "real betis": "Real Betis",
  "real madrid": "Real Madrid",
  "real mallorca": "Mallorca",
  roma: "Roma",
  "sc freiburg": "Freiburg",
  spurs: "Tottenham Hotspur",
  sunderland: "Sunderland",
  "tottenham hotspur": "Tottenham Hotspur",
  "vfl wolfsburg": "Wolfsburg",
  "west ham": "West Ham United",
  "west ham united": "West Ham United",
  wolfsburg: "Wolfsburg",
  wolves: "Wolverhampton Wanderers",
  "wolverhampton wanderers": "Wolverhampton Wanderers",
};

export function getClubBadgePath(teamName: string) {
  const canonicalName = CLUB_ALIAS_MAP[normalizeClubName(teamName)] ?? teamName;
  const badgePath = getLeagueClubByName(canonicalName)?.badgePath ?? null;

  return badgePath ? withBasePath(badgePath) : null;
}

export function getFixtureBadgePaths(label: string) {
  const fixtureLabel = label.split(":")[0]?.trim() ?? "";
  const fixtureTeams = fixtureLabel.split(/\s+v(?:s)?\s+/i).map((team) => team.trim());

  return fixtureTeams
    .map((teamName) => ({
      teamName,
      badgePath: getClubBadgePath(teamName),
    }))
    .filter((club) => club.badgePath);
}

export function getFixtureDisplayParts(label: string) {
  const [fixtureLabel, marketLabel] = label.split(":").map((part) => part.trim());

  if (!fixtureLabel) {
    return null;
  }

  const fixtureTeams = fixtureLabel
    .split(/\s+v(?:s)?\s+/i)
    .map((team) => team.trim())
    .filter(Boolean);

  if (fixtureTeams.length !== 2) {
    return null;
  }

  return {
    homeTeam: {
      name: fixtureTeams[0],
      badgePath: getClubBadgePath(fixtureTeams[0]),
    },
    awayTeam: {
      name: fixtureTeams[1],
      badgePath: getClubBadgePath(fixtureTeams[1]),
    },
    separator: fixtureLabel.includes(" vs ") ? "vs" : "v",
    marketLabel: marketLabel ?? "",
  };
}

function normalizeClubName(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function withBasePath(path: string) {
  if (!path.startsWith("/") || !BASE_PATH) {
    return path;
  }

  return `${BASE_PATH}${path}`;
}
