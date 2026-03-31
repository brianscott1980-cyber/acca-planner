export type RiskLevel = "safe" | "balanced" | "aggressive";

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
            marketId: "arsenal-bournemouth-arsenal-dnb",
          },
          {
            label: "Liverpool v Fulham: Over 1.5 Goals",
            scheduleNote: "Sat 11 Apr, 17:30 BST",
            aiReasoning:
              "Liverpool scored nine across recent wins over West Ham and Wolves, and Fulham's last four league and cup games still gave a two-goal floor enough to support a safer totals angle.",
            marketId: "liverpool-fulham-over-1-5",
          },
          {
            label: "Chelsea v Man City: Over 1.5 Goals",
            scheduleNote: "Sun 12 Apr, 16:30 BST",
            aiReasoning:
              "Chelsea's last five across league and Europe produced 20 total goals and City's recent run mixed 10 scored with 8 conceded, so a low goals line is the safer way into the fixture.",
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
            marketId: "arsenal-bournemouth-arsenal-win",
          },
          {
            label: "Liverpool v Fulham: Liverpool to Win",
            scheduleNote: "Sat 11 Apr, 17:30 BST",
            aiReasoning:
              "Liverpool won three of their last four league matches before the break and carried the clearer scoring edge into a meeting with a Fulham side that had one win in four league and cup games.",
            marketId: "liverpool-fulham-liverpool-win",
          },
          {
            label: "Chelsea v Man City: Both Teams To Score",
            scheduleNote: "Sun 12 Apr, 16:30 BST",
            aiReasoning:
              "Chelsea have both scored and conceded heavily in recent league and European matches, while City's recent 2-2 with Forest keeps a BTTS script live here.",
            marketId: "chelsea-man-city-btts",
          },
          {
            label: "Man Utd v Leeds United: Over 2.5 Goals",
            scheduleNote: "Mon 13 Apr, 20:00 BST",
            aiReasoning:
              "United's recent league games have rarely stayed quiet and Leeds still created scoring games against Chelsea and Villa, which keeps the goals angle preferable to a tighter result call.",
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
            marketId: "arsenal-bournemouth-arsenal-minus-1",
          },
          {
            label: "Liverpool v Fulham: Liverpool to Win & Over 2.5 Goals",
            scheduleNote: "Sat 11 Apr, 17:30 BST",
            aiReasoning:
              "Liverpool's recent scoring spikes, including five against West Ham and three in the cup at Wolves, support combining the home win with a higher goals line for more return.",
            marketId: "liverpool-fulham-liverpool-win-over-2-5",
          },
          {
            label: "Chelsea v Man City: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sun 12 Apr, 16:30 BST",
            aiReasoning:
              "Chelsea's last five across league and Europe were full of goals at both ends, and City's recent results still point to enough chance volume to justify the higher-event builder.",
            marketId: "chelsea-man-city-btts-over-2-5",
          },
          {
            label: "Man Utd v Leeds United: Man Utd to Win & Over 2.5 Goals",
            scheduleNote: "Mon 13 Apr, 20:00 BST",
            aiReasoning:
              "United still carry the stronger result profile, while Leeds' recent matches with Chelsea and Villa show they can help stretch the game enough for a win-plus-goals closer.",
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
