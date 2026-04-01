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

export type SimulatedSlipLegStatus = "won" | "lost" | "cashed_out";

export type SimulatedSlipLegRecord = {
  betLineLabel: string;
  kickoffAt: string;
  settledAt: string;
  finalScore: string;
  status: SimulatedSlipLegStatus;
  actualStatus: "won" | "lost";
};

export type SimulatedSlipRecord = {
  proposalId: string;
  timelineLabel: string;
  stake: number;
  stakePlacedAt: string;
  settledAt: string;
  settlementKind: "settled" | "cashout";
  returnAmount: number;
  status: "win" | "loss";
  legResults?: SimulatedSlipLegRecord[];
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
  windowStartIso: string;
  windowEndIso: string;
  startsIn: string;
  proposals: GameWeekProposalRecord[];
  votesByUserId: Record<string, string>;
  simulatedSlip?: SimulatedSlipRecord;
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
    name: "Matchday 32 Voting Stage",
    description: "Premier League Matchday 32 analysis is complete.",
    windowStartIso: "2026-04-10T11:30:00.000Z",
    windowEndIso: "2026-04-13T21:00:00.000Z",
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
    simulatedSlip: {
      proposalId: "neutral",
      timelineLabel: "AI Recommended Strategy",
      stake: 42,
      stakePlacedAt: "2026-04-10T10:15:00.000Z",
      settledAt: "2026-04-13T20:55:00.000Z",
      settlementKind: "cashout",
      returnAmount: 61,
      status: "win",
    },
  },
  {
    id: "md-33",
    slug: "matchday-33",
    name: "Matchday 33 Voting Stage",
    description: "Premier League Matchday 33 analysis is complete.",
    windowStartIso: "2026-04-17T18:30:00.000Z",
    windowEndIso: "2026-04-20T21:00:00.000Z",
    startsIn: "Fri 17 Apr - Mon 20 Apr",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        summary:
          "This build stays conservative with draw protection on stronger home sides and a low total-goals floor in the late game.",
        legs: 3,
        betLines: [
          {
            label: "Tottenham v Crystal Palace: Tottenham Draw No Bet",
            scheduleNote: "Fri 17 Apr, 19:30 BST",
            aiReasoning:
              "Spurs carry the stronger home profile, but the draw cover keeps the first leg aligned with a lower-risk approach.",
            odds: "1.32",
          },
          {
            label: "Newcastle Utd v Burnley: Newcastle to Win",
            scheduleNote: "Sat 18 Apr, 15:00 BST",
            aiReasoning:
              "Newcastle's recent home level gives the straight result enough support without stepping up to a bigger line.",
            odds: "1.48",
          },
          {
            label: "Aston Villa v Everton: Over 1.5 Goals",
            scheduleNote: "Sun 19 Apr, 16:30 BST",
            aiReasoning:
              "Both sides have been involved in enough two-goal games recently for the safer totals angle to make sense.",
            odds: "1.29",
          },
        ],
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral",
        summary:
          "This mix adds a little more upside with a Spurs win, a Newcastle goals angle, and a Villa-Everton builder that still stays in a manageable range.",
        legs: 4,
        betLines: [
          {
            label: "Tottenham v Crystal Palace: Tottenham to Win",
            scheduleNote: "Fri 17 Apr, 19:30 BST",
            aiReasoning:
              "Spurs look good enough at home to support the straight win once we move away from draw protection.",
            odds: "1.64",
          },
          {
            label: "Newcastle Utd v Burnley: Over 2.5 Goals",
            scheduleNote: "Sat 18 Apr, 15:00 BST",
            aiReasoning:
              "Newcastle's attacking floor and Burnley's open game scripts push this fixture toward the stronger totals line.",
            odds: "1.76",
          },
          {
            label: "Aston Villa v Everton: Both Teams To Score",
            scheduleNote: "Sun 19 Apr, 16:30 BST",
            aiReasoning:
              "Villa still create high-value chances at home, while Everton have shown enough away threat to contribute to the script.",
            odds: "1.72",
          },
          {
            label: "Chelsea v Brighton: Over 2.5 Goals",
            scheduleNote: "Mon 20 Apr, 20:00 BST",
            aiReasoning:
              "This matchup still profiles as one of the more open totals spots of the round.",
            odds: "1.81",
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
          "This is the higher-return version, turning the better home sides into result-and-goals plays and chasing a stronger close on Monday night.",
        legs: 4,
        betLines: [
          {
            label: "Tottenham v Crystal Palace: Tottenham to Win & Over 2.5 Goals",
            scheduleNote: "Fri 17 Apr, 19:30 BST",
            aiReasoning:
              "Tottenham's home edge and the chance of a stretched game make the builder live at the aggressive tier.",
            odds: "2.18",
          },
          {
            label: "Newcastle Utd v Burnley: Newcastle -1 Handicap",
            scheduleNote: "Sat 18 Apr, 15:00 BST",
            aiReasoning:
              "The home side's stronger recent results support the margin angle if we push for more upside.",
            odds: "2.02",
          },
          {
            label: "Aston Villa v Everton: Aston Villa to Win & Both Teams To Score",
            scheduleNote: "Sun 19 Apr, 16:30 BST",
            aiReasoning:
              "Villa retain the stronger result profile, but Everton are lively enough to keep the BTTS side of the builder live.",
            odds: "2.35",
          },
          {
            label: "Chelsea v Brighton: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Mon 20 Apr, 20:00 BST",
            aiReasoning:
              "Both sides can drag this into a higher-event finish, which suits the final aggressive leg.",
            odds: "1.94",
          },
        ],
        statusLabel: "Aggressive",
      },
    ],
    votesByUserId: {
      "brian-scott": "defensive",
      "tony-mclean": "neutral",
      "john-colreavey": "defensive",
      "paul-melville": "aggressive",
      "alasdair-head": "defensive",
      "paul-devine": "neutral",
      "derek-mcmillan": "defensive",
    },
    simulatedSlip: {
      proposalId: "defensive",
      timelineLabel: "Defensive Strategy Cashout",
      stake: 44,
      stakePlacedAt: "2026-04-17T17:45:00.000Z",
      settledAt: "2026-04-20T20:20:00.000Z",
      settlementKind: "cashout",
      returnAmount: 26,
      status: "loss",
    },
  },
  {
    id: "md-34",
    slug: "matchday-34",
    name: "Matchday 34 Voting Stage",
    description: "Premier League Matchday 34 analysis is complete.",
    windowStartIso: "2026-04-24T18:30:00.000Z",
    windowEndIso: "2026-04-27T21:00:00.000Z",
    startsIn: "Fri 24 Apr - Mon 27 Apr",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        summary:
          "A lower-volatility build that leans on established home edges and keeps the total-goals asks conservative.",
        legs: 3,
        betLines: [
          {
            label: "Liverpool v Brentford: Liverpool Draw No Bet",
            scheduleNote: "Fri 24 Apr, 19:30 BST",
            aiReasoning:
              "Liverpool still carry the stronger baseline, and draw cover keeps the opening leg stable.",
            odds: "1.24",
          },
          {
            label: "West Ham v Fulham: Over 1.5 Goals",
            scheduleNote: "Sat 25 Apr, 15:00 BST",
            aiReasoning:
              "Both teams still land in enough two-goal matches to support the safer line.",
            odds: "1.30",
          },
          {
            label: "Arsenal v Wolves: Arsenal to Win",
            scheduleNote: "Sun 26 Apr, 16:30 BST",
            aiReasoning:
              "Arsenal's home edge is strong enough to support the straight result in the conservative build.",
            odds: "1.46",
          },
        ],
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral",
        summary:
          "The balanced slip gives Liverpool and Arsenal clearer win conditions while using a goals angle in West Ham-Fulham to keep momentum.",
        legs: 4,
        betLines: [
          {
            label: "Liverpool v Brentford: Liverpool to Win",
            scheduleNote: "Fri 24 Apr, 19:30 BST",
            aiReasoning:
              "Liverpool's stronger attacking profile makes the straight home win acceptable at the balanced tier.",
            odds: "1.55",
          },
          {
            label: "West Ham v Fulham: Both Teams To Score",
            scheduleNote: "Sat 25 Apr, 15:00 BST",
            aiReasoning:
              "This fixture still carries enough chance creation at both ends to support BTTS.",
            odds: "1.74",
          },
          {
            label: "Arsenal v Wolves: Arsenal -1 Handicap",
            scheduleNote: "Sun 26 Apr, 16:30 BST",
            aiReasoning:
              "The stronger home profile supports stepping into a margin play once the build becomes more assertive.",
            odds: "1.98",
          },
          {
            label: "Man City v Leeds United: Over 2.5 Goals",
            scheduleNote: "Mon 27 Apr, 20:00 BST",
            aiReasoning:
              "City's scoring floor and Leeds' willingness to play in transition still support the higher total.",
            odds: "1.69",
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
          "This build combines the strongest favourites with goals-heavy builders to chase a bigger week-on-week jump.",
        legs: 4,
        betLines: [
          {
            label: "Liverpool v Brentford: Liverpool to Win & Over 2.5 Goals",
            scheduleNote: "Fri 24 Apr, 19:30 BST",
            aiReasoning:
              "Liverpool's home attack gives enough upside to merge result and goals here.",
            odds: "2.05",
          },
          {
            label: "West Ham v Fulham: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sat 25 Apr, 15:00 BST",
            aiReasoning:
              "Both sides can trade chances in a way that keeps the higher-event builder live.",
            odds: "2.10",
          },
          {
            label: "Arsenal v Wolves: Arsenal Win to Nil",
            scheduleNote: "Sun 26 Apr, 16:30 BST",
            aiReasoning:
              "Arsenal's control at home supports the cleaner aggressive route if Wolves don't offer enough threat.",
            odds: "2.16",
          },
          {
            label: "Man City v Leeds United: Man City -1 Handicap",
            scheduleNote: "Mon 27 Apr, 20:00 BST",
            aiReasoning:
              "City's superiority makes the margin play the stronger closer in the high-return build.",
            odds: "1.94",
          },
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
      "derek-mcmillan": "neutral",
    },
    simulatedSlip: {
      proposalId: "neutral",
      timelineLabel: "Neutral Strategy Settled",
      stake: 39,
      stakePlacedAt: "2026-04-24T17:50:00.000Z",
      settledAt: "2026-04-27T20:55:00.000Z",
      settlementKind: "settled",
      returnAmount: 0,
      status: "loss",
    },
  },
  {
    id: "md-35",
    slug: "matchday-35",
    name: "Matchday 35 Voting Stage",
    description: "Premier League Matchday 35 analysis is complete.",
    windowStartIso: "2026-05-01T18:30:00.000Z",
    windowEndIso: "2026-05-04T21:00:00.000Z",
    startsIn: "Fri 1 May - Mon 4 May",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        summary:
          "A lower-volatility build centered on stronger home teams and a pair of safer total-goals lines.",
        legs: 3,
        betLines: [
          {
            label: "Chelsea v Wolves: Chelsea Draw No Bet",
            scheduleNote: "Fri 1 May, 19:30 BST",
            aiReasoning:
              "Chelsea keep the stronger baseline in this spot, and draw cover keeps the build in the defensive lane.",
            odds: "1.31",
          },
          {
            label: "Tottenham v West Ham: Over 1.5 Goals",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "Both sides still land in enough open games for the safer totals angle to carry value.",
            odds: "1.34",
          },
          {
            label: "Newcastle Utd v Fulham: Newcastle to Win",
            scheduleNote: "Sun 3 May, 16:30 BST",
            aiReasoning:
              "Newcastle's home edge makes the straight result the conservative anchor leg.",
            odds: "1.52",
          },
        ],
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral",
        summary:
          "The balanced route upgrades the result asks on Chelsea and Newcastle while keeping a goals angle in Tottenham-West Ham.",
        legs: 4,
        betLines: [
          {
            label: "Chelsea v Wolves: Chelsea to Win",
            scheduleNote: "Fri 1 May, 19:30 BST",
            aiReasoning:
              "Chelsea's stronger chance-creation profile supports the home win once the build moves up a tier.",
            odds: "1.62",
          },
          {
            label: "Tottenham v West Ham: Both Teams To Score",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "This fixture still trends toward goals at both ends when the game opens up early.",
            odds: "1.73",
          },
          {
            label: "Newcastle Utd v Fulham: Newcastle -1 Handicap",
            scheduleNote: "Sun 3 May, 16:30 BST",
            aiReasoning:
              "The stronger home profile is enough to support the margin line in the balanced build.",
            odds: "1.94",
          },
          {
            label: "Brighton v Brentford: Over 2.5 Goals",
            scheduleNote: "Mon 4 May, 20:00 BST",
            aiReasoning:
              "Both sides still project enough transition play and chance volume for the higher total.",
            odds: "1.77",
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
          "This version turns the stronger favourites into builders and leans into the highest-event fixture to chase a bigger weekly jump.",
        legs: 4,
        betLines: [
          {
            label: "Chelsea v Wolves: Chelsea to Win & Over 2.5 Goals",
            scheduleNote: "Fri 1 May, 19:30 BST",
            aiReasoning:
              "Chelsea's home attacking edge gives enough upside to combine result and goals.",
            odds: "2.08",
          },
          {
            label: "Tottenham v West Ham: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "Both clubs can drag this into the kind of end-to-end game that suits the aggressive builder.",
            odds: "2.06",
          },
          {
            label: "Newcastle Utd v Fulham: Newcastle Win to Nil",
            scheduleNote: "Sun 3 May, 16:30 BST",
            aiReasoning:
              "Newcastle's home control supports the cleaner result route if Fulham's away threat stays limited.",
            odds: "2.12",
          },
          {
            label: "Brighton v Brentford: Brighton to Win & Over 2.5 Goals",
            scheduleNote: "Mon 4 May, 20:00 BST",
            aiReasoning:
              "Brighton's attacking edge gives the closer more upside if the game state opens early.",
            odds: "2.22",
          },
        ],
        statusLabel: "Aggressive",
      },
    ],
    votesByUserId: {
      "brian-scott": "neutral",
      "tony-mclean": "defensive",
      "john-colreavey": "neutral",
      "paul-melville": "aggressive",
      "alasdair-head": "neutral",
      "paul-devine": "neutral",
      "derek-mcmillan": "defensive",
    },
  },
];
