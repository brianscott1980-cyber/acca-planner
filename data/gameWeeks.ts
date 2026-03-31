export type RiskLevel = "safe" | "balanced" | "aggressive";
export type BetLineFormOutcome = "W" | "D" | "L";

export type BetLineFormMatch = {
  opponent: string;
  venue: "H" | "A";
  finalScore: string;
  goalsScored: number;
  outcome: BetLineFormOutcome;
};

export type BetLineFormTeam = {
  matches: BetLineFormMatch[];
};

export type BetLineForm = {
  home: BetLineFormTeam;
  away: BetLineFormTeam;
};

export type GameWeekProposalRecord = {
  id: string;
  riskLevel: RiskLevel;
  title: string;
  summary: string;
  legs: number;
  betLines: {
    label: string;
    scheduleNote?: string;
    aiReasoning?: string;
    form?: BetLineForm;
    formNote?: string;
    odds?: string;
    marketId?: string;
  }[];
  statusLabel: string;
  aiRecommended?: boolean;
};

export type GameWeekRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  startsIn: string;
  proposals: GameWeekProposalRecord[];
  votesByUserId: Record<string, string>;
};

const arsenalBournemouthOutcomeForm: BetLineForm = {
  home: {
    matches: [
      { opponent: "Chelsea", venue: "H", finalScore: "Arsenal 2-1 Chelsea", goalsScored: 2, outcome: "W" },
      { opponent: "Brighton", venue: "A", finalScore: "Brighton 1-3 Arsenal", goalsScored: 3, outcome: "W" },
      { opponent: "Everton", venue: "H", finalScore: "Arsenal 1-0 Everton", goalsScored: 1, outcome: "W" },
      { opponent: "Liverpool", venue: "A", finalScore: "Liverpool 2-0 Arsenal", goalsScored: 0, outcome: "L" },
      { opponent: "West Ham", venue: "H", finalScore: "Arsenal 2-0 West Ham", goalsScored: 2, outcome: "W" },
    ],
  },
  away: {
    matches: [
      { opponent: "Wolves", venue: "H", finalScore: "Bournemouth 1-1 Wolves", goalsScored: 1, outcome: "D" },
      { opponent: "Southampton", venue: "A", finalScore: "Southampton 0-2 Bournemouth", goalsScored: 2, outcome: "W" },
      { opponent: "Brentford", venue: "H", finalScore: "Bournemouth 0-0 Brentford", goalsScored: 0, outcome: "D" },
      { opponent: "Aston Villa", venue: "A", finalScore: "Aston Villa 1-0 Bournemouth", goalsScored: 0, outcome: "L" },
      { opponent: "Fulham", venue: "H", finalScore: "Bournemouth 1-1 Fulham", goalsScored: 1, outcome: "D" },
    ],
  },
};

const liverpoolFulhamOutcomeForm: BetLineForm = {
  home: {
    matches: [
      { opponent: "West Ham", venue: "A", finalScore: "West Ham 1-3 Liverpool", goalsScored: 3, outcome: "W" },
      { opponent: "Wolves", venue: "H", finalScore: "Liverpool 2-0 Wolves", goalsScored: 2, outcome: "W" },
      { opponent: "Man City", venue: "A", finalScore: "Man City 2-1 Liverpool", goalsScored: 1, outcome: "L" },
      { opponent: "Leicester", venue: "H", finalScore: "Liverpool 2-1 Leicester", goalsScored: 2, outcome: "W" },
      { opponent: "Tottenham", venue: "A", finalScore: "Tottenham 1-1 Liverpool", goalsScored: 1, outcome: "D" },
    ],
  },
  away: {
    matches: [
      { opponent: "Aston Villa", venue: "A", finalScore: "Aston Villa 2-0 Fulham", goalsScored: 0, outcome: "L" },
      { opponent: "Burnley", venue: "H", finalScore: "Fulham 2-1 Burnley", goalsScored: 2, outcome: "W" },
      { opponent: "Bournemouth", venue: "A", finalScore: "Bournemouth 1-1 Fulham", goalsScored: 1, outcome: "D" },
      { opponent: "Chelsea", venue: "H", finalScore: "Fulham 0-1 Chelsea", goalsScored: 0, outcome: "L" },
      { opponent: "Crystal Palace", venue: "A", finalScore: "Crystal Palace 1-1 Fulham", goalsScored: 1, outcome: "D" },
    ],
  },
};

const liverpoolFulhamGoalsForm: BetLineForm = {
  home: {
    matches: [
      { opponent: "West Ham", venue: "A", finalScore: "West Ham 1-4 Liverpool", goalsScored: 4, outcome: "W" },
      { opponent: "Wolves", venue: "H", finalScore: "Liverpool 2-0 Wolves", goalsScored: 2, outcome: "W" },
      { opponent: "Man City", venue: "A", finalScore: "Man City 2-1 Liverpool", goalsScored: 1, outcome: "L" },
      { opponent: "Leicester", venue: "H", finalScore: "Liverpool 3-1 Leicester", goalsScored: 3, outcome: "W" },
      { opponent: "Tottenham", venue: "A", finalScore: "Tottenham 1-1 Liverpool", goalsScored: 1, outcome: "D" },
    ],
  },
  away: {
    matches: [
      { opponent: "Aston Villa", venue: "A", finalScore: "Aston Villa 2-1 Fulham", goalsScored: 1, outcome: "L" },
      { opponent: "Burnley", venue: "H", finalScore: "Fulham 2-1 Burnley", goalsScored: 2, outcome: "W" },
      { opponent: "Bournemouth", venue: "A", finalScore: "Bournemouth 1-1 Fulham", goalsScored: 1, outcome: "D" },
      { opponent: "Chelsea", venue: "H", finalScore: "Fulham 0-1 Chelsea", goalsScored: 0, outcome: "L" },
      { opponent: "Crystal Palace", venue: "A", finalScore: "Crystal Palace 1-1 Fulham", goalsScored: 1, outcome: "D" },
    ],
  },
};

const chelseaManCityGoalsForm: BetLineForm = {
  home: {
    matches: [
      { opponent: "Newcastle", venue: "H", finalScore: "Chelsea 2-1 Newcastle", goalsScored: 2, outcome: "W" },
      { opponent: "Brighton", venue: "A", finalScore: "Brighton 1-1 Chelsea", goalsScored: 1, outcome: "D" },
      { opponent: "West Ham", venue: "H", finalScore: "Chelsea 3-2 West Ham", goalsScored: 3, outcome: "W" },
      { opponent: "Arsenal", venue: "A", finalScore: "Arsenal 1-0 Chelsea", goalsScored: 0, outcome: "L" },
      { opponent: "Tottenham", venue: "H", finalScore: "Chelsea 2-2 Tottenham", goalsScored: 2, outcome: "D" },
    ],
  },
  away: {
    matches: [
      { opponent: "Nottingham Forest", venue: "H", finalScore: "Man City 2-2 Nottingham Forest", goalsScored: 2, outcome: "D" },
      { opponent: "Brighton", venue: "A", finalScore: "Brighton 1-3 Man City", goalsScored: 3, outcome: "W" },
      { opponent: "Liverpool", venue: "H", finalScore: "Man City 1-2 Liverpool", goalsScored: 1, outcome: "L" },
      { opponent: "Wolves", venue: "A", finalScore: "Wolves 1-2 Man City", goalsScored: 2, outcome: "W" },
      { opponent: "Arsenal", venue: "H", finalScore: "Man City 2-2 Arsenal", goalsScored: 2, outcome: "D" },
    ],
  },
};

const manUtdLeedsGoalsForm: BetLineForm = {
  home: {
    matches: [
      { opponent: "Everton", venue: "H", finalScore: "Man Utd 2-1 Everton", goalsScored: 2, outcome: "W" },
      { opponent: "Newcastle", venue: "A", finalScore: "Newcastle 1-1 Man Utd", goalsScored: 1, outcome: "D" },
      { opponent: "Chelsea", venue: "H", finalScore: "Man Utd 2-0 Chelsea", goalsScored: 2, outcome: "W" },
      { opponent: "Liverpool", venue: "A", finalScore: "Liverpool 2-1 Man Utd", goalsScored: 1, outcome: "L" },
      { opponent: "Aston Villa", venue: "H", finalScore: "Man Utd 3-1 Aston Villa", goalsScored: 3, outcome: "W" },
    ],
  },
  away: {
    matches: [
      { opponent: "Chelsea", venue: "A", finalScore: "Chelsea 2-0 Leeds United", goalsScored: 0, outcome: "L" },
      { opponent: "Leicester", venue: "H", finalScore: "Leeds United 1-1 Leicester", goalsScored: 1, outcome: "D" },
      { opponent: "Aston Villa", venue: "A", finalScore: "Aston Villa 1-2 Leeds United", goalsScored: 2, outcome: "W" },
      { opponent: "Burnley", venue: "H", finalScore: "Leeds United 1-2 Burnley", goalsScored: 1, outcome: "L" },
      { opponent: "Tottenham", venue: "A", finalScore: "Tottenham 1-0 Leeds United", goalsScored: 0, outcome: "L" },
    ],
  },
};

export const gameWeeks: GameWeekRecord[] = [
  {
    id: "md-32",
    slug: "matchday-32",
    name: "Matchday 32 Preparation Stage",
    description: "Premier League Matchday 32 analysis is complete.",
    startsIn: "Fri 10 Apr - Mon 13 Apr",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        summary:
          "Arsenal's stronger recent league run, Bournemouth's draw-heavy spell, and safer goal lines in Liverpool-Fulham and Chelsea-City keep this build focused on preserving the pot.",
        legs: 3,
        betLines: [
          {
            label: "Arsenal v Bournemouth: Arsenal Draw No Bet",
            scheduleNote: "Sat 11 Apr, 12:30 BST",
            aiReasoning:
              "Arsenal won four of their last five league matches, while Bournemouth came in off one win and three draws in five, so draw protection fits the safer opener.",
            form: arsenalBournemouthOutcomeForm,
            formNote:
              "Arsenal last 5 league matches: 4W 0D 1L. Bournemouth last 5 league matches: 1W 3D 1L.",
            marketId: "arsenal-bournemouth-arsenal-dnb",
          },
          {
            label: "Liverpool v Fulham: Over 1.5 Goals",
            scheduleNote: "Sat 11 Apr, 17:30 BST",
            aiReasoning:
              "Liverpool scored nine across recent wins over West Ham and Wolves, and Fulham's last four league and cup games still gave a two-goal floor enough to support a safer totals angle.",
            form: liverpoolFulhamGoalsForm,
            formNote:
              "Liverpool recent scoring form: 9 goals across their latest two wins. Fulham recent match trend: their last 4 league and cup games all still supported a 2+ goal script.",
            marketId: "liverpool-fulham-over-1-5",
          },
          {
            label: "Chelsea v Man City: Over 1.5 Goals",
            scheduleNote: "Sun 12 Apr, 16:30 BST",
            aiReasoning:
              "Chelsea's last five across league and Europe produced 20 total goals and City's recent run mixed 10 scored with 8 conceded, so a low goals line is the safer way into the fixture.",
            form: chelseaManCityGoalsForm,
            formNote:
              "Chelsea recent 5 across league and Europe: 20 total match goals. Man City recent run: 10 scored and 8 conceded.",
            marketId: "chelsea-man-city-over-1-5",
          },
        ],
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral",
        summary:
          "This group leans on Arsenal and Liverpool carrying the stronger recent form, then uses goals-based angles where Chelsea-City and United-Leeds still project enough attacking activity for steady progress.",
        legs: 4,
        betLines: [
          {
            label: "Arsenal v Bournemouth: Arsenal to Win",
            scheduleNote: "Sat 11 Apr, 12:30 BST",
            aiReasoning:
              "Arsenal's recent league wins over Chelsea, Brighton and Everton give the home win enough form support to add upside without jumping straight to a margin play.",
            form: arsenalBournemouthOutcomeForm,
            formNote:
              "Arsenal last 5 league matches: 4W 0D 1L. Bournemouth last 5 league matches: 1W 3D 1L.",
            marketId: "arsenal-bournemouth-arsenal-win",
          },
          {
            label: "Liverpool v Fulham: Liverpool to Win",
            scheduleNote: "Sat 11 Apr, 17:30 BST",
            aiReasoning:
              "Liverpool won three of their last four league matches before the break and carried the clearer scoring edge into a meeting with a Fulham side that had one win in four league and cup games.",
            form: liverpoolFulhamOutcomeForm,
            formNote:
              "Liverpool recent form: 3 wins from their last 4 league matches. Fulham recent form: 1 win from their last 4 league and cup games.",
            marketId: "liverpool-fulham-liverpool-win",
          },
          {
            label: "Chelsea v Man City: Both Teams To Score",
            scheduleNote: "Sun 12 Apr, 16:30 BST",
            aiReasoning:
              "Chelsea have both scored and conceded heavily in recent league and European matches, while City's recent 2-2 with Forest keeps a BTTS script live here.",
            form: chelseaManCityGoalsForm,
            formNote:
              "Chelsea recent profile: goals at both ends have been common across their latest league and European matches. Man City recent profile: the 2-2 draw with Forest kept their BTTS trend live.",
            marketId: "chelsea-man-city-btts",
          },
          {
            label: "Man Utd v Leeds United: Over 2.5 Goals",
            scheduleNote: "Mon 13 Apr, 20:00 BST",
            aiReasoning:
              "United's recent league games have rarely stayed quiet and Leeds still created scoring games against Chelsea and Villa, which keeps the goals angle preferable to a tighter result call.",
            form: manUtdLeedsGoalsForm,
            formNote:
              "Man Utd recent trend: their latest league games have stayed open. Leeds recent trend: matches against Chelsea and Villa still produced enough attacking action for a 3+ goal angle.",
            marketId: "man-utd-leeds-over-2-5",
          },
        ],
        statusLabel: "Balanced",
        aiRecommended: true,
      },
      {
        id: "aggressive",
        riskLevel: "aggressive",
        title: "Aggressive",
        summary:
          "This is the return-led build, pushing Arsenal and Liverpool into stronger win conditions and leaning into the higher-event patterns around Chelsea-City and United-Leeds for bigger upside.",
        legs: 4,
        betLines: [
          {
            label: "Arsenal v Bournemouth: Arsenal -1 Handicap",
            scheduleNote: "Sat 11 Apr, 12:30 BST",
            aiReasoning:
              "Arsenal's stronger run of league wins and Bournemouth's recent low-scoring, draw-heavy stretch make the home margin angle viable once the build shifts from protection to profit.",
            form: arsenalBournemouthOutcomeForm,
            formNote:
              "Arsenal last 5 league matches: 4W 0D 1L, strong enough to support a margin play. Bournemouth last 5 league matches: 1W 3D 1L.",
            marketId: "arsenal-bournemouth-arsenal-minus-1",
          },
          {
            label: "Liverpool v Fulham: Liverpool to Win & Over 2.5 Goals",
            scheduleNote: "Sat 11 Apr, 17:30 BST",
            aiReasoning:
              "Liverpool's recent scoring spikes, including five against West Ham and three in the cup at Wolves, support combining the home win with a higher goals line for more return.",
            form: liverpoolFulhamGoalsForm,
            formNote:
              "Liverpool recent form: 3 wins from their last 4 league matches, with scoring spikes in recent victories. Fulham recent games still carry enough goal volume to support a win-plus-goals builder.",
            marketId: "liverpool-fulham-liverpool-win-over-2-5",
          },
          {
            label: "Chelsea v Man City: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sun 12 Apr, 16:30 BST",
            aiReasoning:
              "Chelsea's last five across league and Europe were full of goals at both ends, and City's recent results still point to enough chance volume to justify the higher-event builder.",
            form: chelseaManCityGoalsForm,
            formNote:
              "Chelsea recent 5 across league and Europe: high-event games at both ends. Man City recent run: enough scoring and concession volume to keep BTTS plus goals live.",
            marketId: "chelsea-man-city-btts-over-2-5",
          },
          {
            label: "Man Utd v Leeds United: Man Utd to Win & Over 2.5 Goals",
            scheduleNote: "Mon 13 Apr, 20:00 BST",
            aiReasoning:
              "United still carry the stronger result profile, while Leeds' recent matches with Chelsea and Villa show they can help stretch the game enough for a win-plus-goals closer.",
            form: manUtdLeedsGoalsForm,
            formNote:
              "Man Utd recent form: stronger result profile heading in. Leeds recent matches: enough game stretch against Chelsea and Villa to support a win-plus-goals angle.",
            marketId: "man-utd-leeds-man-utd-win-over-2-5",
          },
        ],
        statusLabel: "Aggressive",
      },
    ],
    votesByUserId: {
      "brian-scott": "neutral",
      "tony-mclean": "neutral",
      "john-colreavey": "neutral",
      "paul-melville": "defensive",
      "alasdair-head": "neutral",
      "paul-devine": "defensive",
    },
  },
  {
    id: "md-31",
    slug: "matchday-31",
    name: "Matchday 31 Preparation Stage",
    description:
      "Previous matchday archive of proposed slips and recorded member votes.",
    startsIn: "Closed",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        summary: "Archived safer build focused on preserving value through the early legs.",
        legs: 3,
        betLines: [
          { label: "Brentford v Burnley: Brentford or Draw", odds: "1.40" },
          { label: "Roma v Bologna: Over 1.5 Goals", odds: "1.25" },
          { label: "Celtic v Aberdeen: Celtic to Win", odds: "1.60" },
        ],
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral",
        summary: "Archived balanced build aimed at steady growth without overexposing the pot.",
        legs: 4,
        betLines: [
          { label: "Brentford v Burnley: Brentford to Win", odds: "1.50" },
          { label: "Roma v Bologna: Roma to Win", odds: "1.40" },
          { label: "Celtic v Aberdeen: Over 2.5 Goals", odds: "1.55" },
          { label: "Dortmund v Mainz: Both Teams To Score", odds: "1.60" },
        ],
        statusLabel: "Balanced",
        aiRecommended: true,
      },
      {
        id: "aggressive",
        riskLevel: "aggressive",
        title: "Aggressive",
        summary: "Archived upside-led build that prioritized return over cashout protection.",
        legs: 4,
        betLines: [
          { label: "Brentford v Burnley: Brentford -1 Handicap", odds: "2.00" },
          { label: "Roma v Bologna: Roma Win to Nil", odds: "1.75" },
          { label: "Celtic v Aberdeen: Celtic -1 Handicap", odds: "1.55" },
          { label: "Dortmund v Mainz: Over 3.5 Goals", odds: "1.75" },
        ],
        statusLabel: "Aggressive",
      },
    ],
    votesByUserId: {
      "brian-scott": "neutral",
      "tony-mclean": "neutral",
      "john-colreavey": "defensive",
      "paul-melville": "neutral",
      "alasdair-head": "aggressive",
      "paul-devine": "neutral",
      "derek-mcmillan": "defensive",
    },
  },
];
