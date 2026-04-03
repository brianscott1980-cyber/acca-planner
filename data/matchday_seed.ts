import type { BetLineForm, GameWeekRecord } from "../types/matchday_type";

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

export const matchdaySeedGameWeeks: GameWeekRecord[] = [
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
    windowStartIso: "2026-04-18T11:30:00.000Z",
    windowEndIso: "2026-04-20T21:00:00.000Z",
    startsIn: "Sat 18 Apr - Mon 20 Apr",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        summary:
          "This build stays conservative with draw protection around the stronger home sides and low-risk goal lines in the clearer fixtures across the round.",
        legs: 3,
        betLines: [
          {
            label: "Brentford v Fulham: Over 1.5 Goals",
            scheduleNote: "Sat 18 Apr, 12:30 BST",
            aiReasoning:
              "A west London derby with two front-foot sides makes the safer two-goal line a steadier opener than picking a result.",
            odds: "1.28",
          },
          {
            label: "Aston Villa v Sunderland: Aston Villa Draw No Bet",
            scheduleNote: "Sun 19 Apr, 14:00 BST",
            aiReasoning:
              "Villa's home edge makes them the stronger side, while draw cover keeps the slip in the lower-volatility lane.",
            odds: "1.26",
          },
          {
            label: "Crystal Palace v West Ham United: Over 1.5 Goals",
            scheduleNote: "Mon 20 Apr, 20:00 BST",
            aiReasoning:
              "Both sides are usually open enough in transition for a low total-goals line to be the safer late anchor.",
            odds: "1.31",
          },
        ],
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral",
        summary:
          "The balanced route upgrades the result asks on the stronger favourites and leans into the more attack-minded fixtures without going all the way into builder territory.",
        legs: 4,
        betLines: [
          {
            label: "Newcastle United v Bournemouth: Newcastle United to Win",
            scheduleNote: "Sat 18 Apr, 15:00 BST",
            aiReasoning:
              "Newcastle's home advantage is enough to support the straight result once we step up from pure protection.",
            odds: "1.62",
          },
          {
            label: "Chelsea v Man Utd: Both Teams To Score",
            scheduleNote: "Sat 18 Apr, 20:00 BST",
            aiReasoning:
              "Both clubs carry enough attacking quality to make a goals-at-both-ends angle cleaner than choosing the winner.",
            odds: "1.68",
          },
          {
            label: "Everton v Liverpool: Over 2.5 Goals",
            scheduleNote: "Sun 19 Apr, 14:00 BST",
            aiReasoning:
              "Derbies can be volatile, and the goals line gives the slip upside without relying on one side to control the occasion.",
            odds: "1.74",
          },
          {
            label: "Man City v Arsenal: Both Teams To Score",
            scheduleNote: "Sun 19 Apr, 16:30 BST",
            aiReasoning:
              "This is the highest-quality matchup of the round, and a mutual scoring angle is the cleaner balanced play.",
            odds: "1.67",
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
          "This is the return-led build, turning the marquee ties into higher-event builders and asking the stronger home side to win with more authority.",
        legs: 4,
        betLines: [
          {
            label: "Newcastle United v Bournemouth: Newcastle United to Win & Over 2.5 Goals",
            scheduleNote: "Sat 18 Apr, 15:00 BST",
            aiReasoning:
              "Newcastle's home edge and Bournemouth's ability to keep games open make the builder attractive at the aggressive tier.",
            odds: "2.14",
          },
          {
            label: "Chelsea v Man Utd: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sat 18 Apr, 20:00 BST",
            aiReasoning:
              "The attacking talent on both sides makes the higher-event builder more appealing than a straight result call.",
            odds: "1.98",
          },
          {
            label: "Everton v Liverpool: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sun 19 Apr, 14:00 BST",
            aiReasoning:
              "A derby script with chances at both ends gives this leg a stronger ceiling in the high-return build.",
            odds: "2.06",
          },
          {
            label: "Man City v Arsenal: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sun 19 Apr, 16:30 BST",
            aiReasoning:
              "If the headline fixture opens up, this builder gives the slip its biggest upside jump.",
            odds: "2.01",
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
      "paul-devine": "defensive",
      "derek-mcmillan": "neutral",
    },
  },
  {
    id: "md-34",
    slug: "matchday-34",
    name: "Matchday 34 Voting Stage",
    description: "Premier League Matchday 34 analysis is complete.",
    windowStartIso: "2026-04-24T19:00:00.000Z",
    windowEndIso: "2026-04-27T21:00:00.000Z",
    startsIn: "Fri 24 Apr - Mon 27 Apr",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        summary:
          "A lower-volatility build that leans on safer result protection and low goal lines in the clearer fixtures across the amended round.",
        legs: 3,
        betLines: [
          {
            label: "Fulham v Aston Villa: Over 1.5 Goals",
            scheduleNote: "Sat 25 Apr, 12:30 BST",
            aiReasoning:
              "Both sides are usually positive enough to make the two-goal line a steadier way into the weekend.",
            odds: "1.29",
          },
          {
            label: "Arsenal v Newcastle United: Arsenal Draw No Bet",
            scheduleNote: "Sat 25 Apr, 17:30 BST",
            aiReasoning:
              "Arsenal's home edge is meaningful, but draw cover respects the difficulty of the matchup.",
            odds: "1.34",
          },
          {
            label: "Brighton v Chelsea: Over 1.5 Goals",
            scheduleNote: "Sun 26 Apr, 16:30 BST",
            aiReasoning:
              "Two sides comfortable in possession make a low goals line the safer closer than picking a winner.",
            odds: "1.30",
          },
        ],
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral",
        summary:
          "The balanced slip pushes the stronger home teams into cleaner result asks and keeps one goals-based angle in the more open televised closer.",
        legs: 4,
        betLines: [
          {
            label: "Sunderland v Nottingham Forest: Over 1.5 Goals",
            scheduleNote: "Fri 24 Apr, 20:00 BST",
            aiReasoning:
              "The Friday opener profiles better as a totals play than a result selection, but the balanced slip can still lean into goals.",
            odds: "1.56",
          },
          {
            label: "Liverpool v Crystal Palace: Liverpool to Win",
            scheduleNote: "Sat 25 Apr, 15:00 BST",
            aiReasoning:
              "Liverpool remain the stronger home side, making the straight result acceptable in the balanced build.",
            odds: "1.47",
          },
          {
            label: "Arsenal v Newcastle United: Arsenal to Win",
            scheduleNote: "Sat 25 Apr, 17:30 BST",
            aiReasoning:
              "Once the slip becomes more assertive, Arsenal's home advantage is enough to support the straight win.",
            odds: "1.78",
          },
          {
            label: "Man Utd v Brentford: Over 2.5 Goals",
            scheduleNote: "Mon 27 Apr, 20:00 BST",
            aiReasoning:
              "The Monday night game carries enough attacking variance to support the stronger goals line.",
            odds: "1.72",
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
          "This build combines the clearer favourites with higher-event builders to chase a bigger week-on-week jump.",
        legs: 4,
        betLines: [
          {
            label: "Liverpool v Crystal Palace: Liverpool to Win & Over 2.5 Goals",
            scheduleNote: "Sat 25 Apr, 15:00 BST",
            aiReasoning:
              "Liverpool's home attack gives enough upside to combine the result with a stronger goals line.",
            odds: "1.96",
          },
          {
            label: "Arsenal v Newcastle United: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sat 25 Apr, 17:30 BST",
            aiReasoning:
              "If the headline Saturday game opens up, this builder gives the aggressive slip the bigger payoff it wants.",
            odds: "2.24",
          },
          {
            label: "Brighton v Chelsea: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sun 26 Apr, 16:30 BST",
            aiReasoning:
              "Two technical sides with enough attack-minded players make the higher-event builder live here.",
            odds: "2.02",
          },
          {
            label: "Man Utd v Brentford: Man Utd to Win & Over 2.5 Goals",
            scheduleNote: "Mon 27 Apr, 20:00 BST",
            aiReasoning:
              "United's home edge paired with a livelier game state makes this the stronger Monday closer for the aggressive build.",
            odds: "2.10",
          },
        ],
        statusLabel: "Aggressive",
      },
    ],
    votesByUserId: {
      "brian-scott": "defensive",
      "tony-mclean": "neutral",
      "john-colreavey": "neutral",
      "paul-melville": "neutral",
      "alasdair-head": "defensive",
      "paul-devine": "neutral",
      "derek-mcmillan": "defensive",
    },
  },
  {
    id: "md-35",
    slug: "matchday-35",
    name: "Matchday 35 Voting Stage",
    description: "Premier League Matchday 35 analysis is complete.",
    windowStartIso: "2026-05-02T14:00:00.000Z",
    windowEndIso: "2026-05-02T17:00:00.000Z",
    startsIn: "Sat 2 May",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        summary:
          "A lower-volatility build centered on the stronger home sides and a pair of safer total-goals lines in the clearest fixtures of the round.",
        legs: 3,
        betLines: [
          {
            label: "Aston Villa v Tottenham Hotspur: Over 1.5 Goals",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "This matchup has enough attacking quality to make the safer two-goal line the right conservative opener.",
            odds: "1.30",
          },
          {
            label: "Arsenal v Fulham: Arsenal Draw No Bet",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "Arsenal's home edge makes them the stronger side, but draw cover keeps this version of the slip under control.",
            odds: "1.20",
          },
          {
            label: "Everton v Man City: Over 1.5 Goals",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "The final game of the round profiles better as a low-goals floor than a pure result call at the safest tier.",
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
          "The balanced route upgrades the stronger home teams into straight result calls and keeps one goals-based angle in the round's headline fixtures.",
        legs: 4,
        betLines: [
          {
            label: "Leeds United v Burnley: Over 2.5 Goals",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "This fixture projects well for chance volume, so the stronger goals line fits the balanced build.",
            odds: "1.79",
          },
          {
            label: "Arsenal v Fulham: Arsenal to Win",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "Arsenal's home control is enough to support the straight result once we step up from protection.",
            odds: "1.44",
          },
          {
            label: "Chelsea v Nottingham Forest: Chelsea to Win",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "Chelsea's home edge makes the straight result acceptable in the balanced version of the slip.",
            odds: "1.61",
          },
          {
            label: "Everton v Man City: Both Teams To Score",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "This is the cleaner route into the late game, avoiding a tighter result call while still leaning into the attacking quality.",
            odds: "1.76",
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
          "This version turns the strongest favourites into builders and leans hardest into the higher-event fixtures to chase the biggest upside.",
        legs: 4,
        betLines: [
          {
            label: "Leeds United v Burnley: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "This fixture has enough volatility to justify going after the higher-event builder.",
            odds: "2.08",
          },
          {
            label: "Aston Villa v Tottenham Hotspur: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "Both teams have enough attack to stretch the game, making the builder the stronger aggressive angle.",
            odds: "2.04",
          },
          {
            label: "Arsenal v Fulham: Arsenal to Win & Over 2.5 Goals",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "Arsenal's home edge gives enough confidence to merge the result with the stronger goals line.",
            odds: "1.97",
          },
          {
            label: "Everton v Man City: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sat 2 May, 15:00 BST",
            aiReasoning:
              "If the marquee closer opens up, this builder gives the slip its biggest return spike.",
            odds: "2.02",
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
  {
    id: "md-36",
    slug: "matchday-36",
    name: "Matchday 36 Voting Stage",
    description: "Premier League Matchday 36 analysis is complete.",
    windowStartIso: "2026-05-09T14:00:00.000Z",
    windowEndIso: "2026-05-09T17:00:00.000Z",
    startsIn: "Sat 9 May",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        summary:
          "This build keeps things measured with draw protection on the strongest home side and safer goals lines in the more open fixtures.",
        legs: 3,
        betLines: [
          {
            label: "Liverpool v Chelsea: Over 1.5 Goals",
            scheduleNote: "Sat 9 May, 15:00 BST",
            aiReasoning:
              "The early headline fixture has enough attacking quality on both sides to make the low goals line the safest route in.",
            odds: "1.27",
          },
          {
            label: "Man City v Brentford: Man City Draw No Bet",
            scheduleNote: "Sat 9 May, 15:00 BST",
            aiReasoning:
              "City are the stronger side at home, but draw cover keeps the defensive slip disciplined.",
            odds: "1.18",
          },
          {
            label: "Tottenham Hotspur v Leeds United: Over 1.5 Goals",
            scheduleNote: "Sat 9 May, 15:00 BST",
            aiReasoning:
              "This fixture profiles better as a two-goal floor than a result call at the lowest-risk tier.",
            odds: "1.26",
          },
        ],
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral",
        summary:
          "The balanced route upgrades the stronger home favourites into straight result picks and keeps one goals angle in the round's standout matchup.",
        legs: 4,
        betLines: [
          {
            label: "Liverpool v Chelsea: Both Teams To Score",
            scheduleNote: "Sat 9 May, 15:00 BST",
            aiReasoning:
              "Both clubs have enough attacking quality to make a mutual scoring angle cleaner than choosing the winner.",
            odds: "1.71",
          },
          {
            label: "Man City v Brentford: Man City to Win",
            scheduleNote: "Sat 9 May, 15:00 BST",
            aiReasoning:
              "City's home edge is strong enough to support the straight result once the slip steps up from pure protection.",
            odds: "1.37",
          },
          {
            label: "West Ham United v Arsenal: Arsenal to Win",
            scheduleNote: "Sat 9 May, 15:00 BST",
            aiReasoning:
              "Arsenal's overall quality gives the away win enough support to sit inside the balanced build.",
            odds: "1.71",
          },
          {
            label: "Tottenham Hotspur v Leeds United: Over 2.5 Goals",
            scheduleNote: "Sat 9 May, 15:00 BST",
            aiReasoning:
              "This matchup has enough transition potential to support the stronger goals line.",
            odds: "1.74",
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
          "This is the high-upside version, combining the clearest favourites with builders in the round's most attack-friendly fixtures.",
        legs: 4,
        betLines: [
          {
            label: "Liverpool v Chelsea: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sat 9 May, 15:00 BST",
            aiReasoning:
              "If the marquee matchup opens up, this builder creates immediate upside for the aggressive slip.",
            odds: "2.01",
          },
          {
            label: "Man City v Brentford: Man City to Win & Over 2.5 Goals",
            scheduleNote: "Sat 9 May, 15:00 BST",
            aiReasoning:
              "City's home attack makes the win-plus-goals builder the sharper high-return angle here.",
            odds: "1.86",
          },
          {
            label: "West Ham United v Arsenal: Arsenal to Win & Over 2.5 Goals",
            scheduleNote: "Sat 9 May, 15:00 BST",
            aiReasoning:
              "Arsenal's edge combined with a livelier game state gives this leg a stronger ceiling.",
            odds: "2.21",
          },
          {
            label: "Tottenham Hotspur v Leeds United: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sat 9 May, 15:00 BST",
            aiReasoning:
              "The final fixture has the right shape for a higher-event closer in the aggressive build.",
            odds: "2.08",
          },
        ],
        statusLabel: "Aggressive",
      },
    ],
    votesByUserId: {
      "brian-scott": "neutral",
      "tony-mclean": "neutral",
      "john-colreavey": "defensive",
      "paul-melville": "aggressive",
      "alasdair-head": "neutral",
      "paul-devine": "defensive",
      "derek-mcmillan": "neutral",
    },
  },
  {
    id: "md-37",
    slug: "matchday-37",
    name: "Matchday 37 Voting Stage",
    description: "Premier League Matchday 37 analysis is complete.",
    windowStartIso: "2026-05-17T14:00:00.000Z",
    windowEndIso: "2026-05-17T17:00:00.000Z",
    startsIn: "Sun 17 May",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        summary:
          "This build keeps the asks conservative with low goal lines and draw protection around the strongest teams on a packed Sunday slate.",
        legs: 3,
        betLines: [
          {
            label: "Arsenal v Burnley: Arsenal Draw No Bet",
            scheduleNote: "Sun 17 May, 15:00 BST",
            aiReasoning:
              "Arsenal are still the stronger side, and draw cover keeps the final-week pressure from pushing the slip too far.",
            odds: "1.15",
          },
          {
            label: "Chelsea v Tottenham Hotspur: Over 1.5 Goals",
            scheduleNote: "Sun 17 May, 15:00 BST",
            aiReasoning:
              "The derby carries enough attacking quality for the two-goal line to be the steadier conservative route.",
            odds: "1.29",
          },
          {
            label: "Man Utd v Nottingham Forest: Over 1.5 Goals",
            scheduleNote: "Sun 17 May, 15:00 BST",
            aiReasoning:
              "The home side's game states tend to create enough goal volume for a low floor to make sense.",
            odds: "1.28",
          },
        ],
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral",
        summary:
          "The balanced route moves the stronger favourites into straight wins and leans into one bigger attacking spot for added upside.",
        legs: 4,
        betLines: [
          {
            label: "Bournemouth v Man City: Man City to Win",
            scheduleNote: "Sun 17 May, 15:00 BST",
            aiReasoning:
              "City's overall quality still gives the away win enough support to sit inside the balanced build.",
            odds: "1.56",
          },
          {
            label: "Arsenal v Burnley: Arsenal to Win",
            scheduleNote: "Sun 17 May, 15:00 BST",
            aiReasoning:
              "Arsenal's home control is strong enough to support the straight result once we leave draw protection behind.",
            odds: "1.32",
          },
          {
            label: "Chelsea v Tottenham Hotspur: Both Teams To Score",
            scheduleNote: "Sun 17 May, 15:00 BST",
            aiReasoning:
              "The derby profiles better as a mutual scoring spot than a winner pick in the balanced slip.",
            odds: "1.72",
          },
          {
            label: "Man Utd v Nottingham Forest: Man Utd to Win",
            scheduleNote: "Sun 17 May, 15:00 BST",
            aiReasoning:
              "United's home edge gives the straight result enough support to complete the balanced build.",
            odds: "1.64",
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
          "This is the higher-return version, turning the strongest sides into builders and using derby volatility to chase the bigger payout.",
        legs: 4,
        betLines: [
          {
            label: "Bournemouth v Man City: Man City to Win & Over 2.5 Goals",
            scheduleNote: "Sun 17 May, 15:00 BST",
            aiReasoning:
              "City's attacking quality makes the win-plus-goals route the sharper aggressive angle.",
            odds: "1.91",
          },
          {
            label: "Arsenal v Burnley: Arsenal -1 Handicap",
            scheduleNote: "Sun 17 May, 15:00 BST",
            aiReasoning:
              "Arsenal's superiority at home supports the margin line when the build shifts fully toward return.",
            odds: "1.86",
          },
          {
            label: "Chelsea v Tottenham Hotspur: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sun 17 May, 15:00 BST",
            aiReasoning:
              "If the London derby opens up, this builder becomes the highest-ceiling leg on the slip.",
            odds: "2.03",
          },
          {
            label: "Man Utd v Nottingham Forest: Man Utd to Win & Over 2.5 Goals",
            scheduleNote: "Sun 17 May, 15:00 BST",
            aiReasoning:
              "United's home edge plus a livelier game script gives the aggressive build a stronger final kick.",
            odds: "2.15",
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
  {
    id: "md-38",
    slug: "matchday-38",
    name: "Matchday 38 Voting Stage",
    description: "Premier League Matchday 38 analysis is complete.",
    windowStartIso: "2026-05-24T14:00:00.000Z",
    windowEndIso: "2026-05-24T17:00:00.000Z",
    startsIn: "Sun 24 May",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        summary:
          "The final-day defensive build avoids the most chaotic result calls and leans on safer totals plus draw protection on the clearest favourite.",
        legs: 3,
        betLines: [
          {
            label: "Liverpool v Brentford: Over 1.5 Goals",
            scheduleNote: "Sun 24 May, 15:00 BST",
            aiReasoning:
              "Final-day volatility often helps low goals lines land, making this a steadier opener than a straight result call.",
            odds: "1.24",
          },
          {
            label: "Man City v Aston Villa: Man City Draw No Bet",
            scheduleNote: "Sun 24 May, 15:00 BST",
            aiReasoning:
              "City still carry the stronger profile, but draw cover respects the variance that can come with the last day.",
            odds: "1.22",
          },
          {
            label: "Tottenham Hotspur v Everton: Over 1.5 Goals",
            scheduleNote: "Sun 24 May, 15:00 BST",
            aiReasoning:
              "Both sides are capable of contributing to a two-goal script, which keeps the close conservative.",
            odds: "1.30",
          },
        ],
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral",
        summary:
          "The balanced final-day slip backs the stronger favourites and keeps one BTTS angle in the fixture most likely to stretch.",
        legs: 4,
        betLines: [
          {
            label: "Liverpool v Brentford: Liverpool to Win",
            scheduleNote: "Sun 24 May, 15:00 BST",
            aiReasoning:
              "Liverpool's home edge remains strong enough for the straight result in the balanced build.",
            odds: "1.40",
          },
          {
            label: "Man City v Aston Villa: Man City to Win",
            scheduleNote: "Sun 24 May, 15:00 BST",
            aiReasoning:
              "City are still the stronger side at home, making the win the cleaner balanced play.",
            odds: "1.52",
          },
          {
            label: "Sunderland v Chelsea: Both Teams To Score",
            scheduleNote: "Sun 24 May, 15:00 BST",
            aiReasoning:
              "This fixture has enough room for both attacks to contribute, which suits a BTTS angle more than a result call.",
            odds: "1.78",
          },
          {
            label: "Tottenham Hotspur v Everton: Tottenham Hotspur to Win",
            scheduleNote: "Sun 24 May, 15:00 BST",
            aiReasoning:
              "Spurs' home advantage gives the final leg enough support to round out the balanced slip.",
            odds: "1.73",
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
          "This is the higher-return final-day version, combining the strongest favourites with builders in the fixtures most likely to turn chaotic.",
        legs: 4,
        betLines: [
          {
            label: "Liverpool v Brentford: Liverpool to Win & Over 2.5 Goals",
            scheduleNote: "Sun 24 May, 15:00 BST",
            aiReasoning:
              "Liverpool's attacking ceiling makes the win-plus-goals route the stronger high-return option.",
            odds: "1.92",
          },
          {
            label: "Man City v Aston Villa: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sun 24 May, 15:00 BST",
            aiReasoning:
              "The headline fixture has enough quality to support the higher-event builder rather than a simple winner.",
            odds: "2.09",
          },
          {
            label: "Sunderland v Chelsea: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sun 24 May, 15:00 BST",
            aiReasoning:
              "If this final-day game opens up, the aggressive slip gets a much better ceiling from the builder.",
            odds: "2.18",
          },
          {
            label: "Tottenham Hotspur v Everton: Tottenham Hotspur to Win & Over 2.5 Goals",
            scheduleNote: "Sun 24 May, 15:00 BST",
            aiReasoning:
              "Spurs' home edge paired with a more open game state makes this the stronger aggressive closer.",
            odds: "2.16",
          },
        ],
        statusLabel: "Aggressive",
      },
    ],
    votesByUserId: {
      "brian-scott": "neutral",
      "tony-mclean": "neutral",
      "john-colreavey": "defensive",
      "paul-melville": "aggressive",
      "alasdair-head": "neutral",
      "paul-devine": "defensive",
      "derek-mcmillan": "neutral",
    },
  },
];
