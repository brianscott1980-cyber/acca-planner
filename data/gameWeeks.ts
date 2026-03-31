export type RiskLevel = "safe" | "balanced" | "aggressive";

export type GameWeekProposalRecord = {
  id: string;
  riskLevel: RiskLevel;
  title: string;
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
    name: "Matchday 32 Action Board",
    description: "Premier League Matchday 32 analysis is complete.",
    startsIn: "Fri 10 Apr - Mon 13 Apr",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
        legs: 3,
        betLines: [
          {
            label: "Arsenal v Bournemouth: Arsenal Draw No Bet",
            scheduleNote: "Sat 11 Apr, 12:30 BST",
            aiReasoning:
              "Home control and downside protection make this a lower-volatility opener.",
            marketId: "arsenal-bournemouth-arsenal-dnb",
          },
          {
            label: "Liverpool v Fulham: Over 1.5 Goals",
            scheduleNote: "Sat 11 Apr, 17:30 BST",
            aiReasoning:
              "Goal volume supports a steadier total-goals angle without needing a winner.",
            marketId: "liverpool-fulham-over-1-5",
          },
          {
            label: "Chelsea v Man City: Over 1.5 Goals",
            scheduleNote: "Sun 12 Apr, 16:30 BST",
            aiReasoning:
              "Both attacks project enough chances to support a safer goals market.",
            marketId: "chelsea-man-city-over-1-5",
          },
        ],
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral",
        legs: 4,
        betLines: [
          {
            label: "Arsenal v Bournemouth: Arsenal to Win",
            scheduleNote: "Sat 11 Apr, 12:30 BST",
            aiReasoning:
              "The straight win adds upside while staying within a balanced risk profile.",
            marketId: "arsenal-bournemouth-arsenal-win",
          },
          {
            label: "Liverpool v Fulham: Liverpool to Win",
            scheduleNote: "Sat 11 Apr, 17:30 BST",
            aiReasoning:
              "Home edge and attacking output keep this win price usable for a neutral slip.",
            marketId: "liverpool-fulham-liverpool-win",
          },
          {
            label: "Chelsea v Man City: Both Teams To Score",
            scheduleNote: "Sun 12 Apr, 16:30 BST",
            aiReasoning:
              "BTTS adds reward by leaning into attacking quality on both sides.",
            marketId: "chelsea-man-city-btts",
          },
          {
            label: "Man Utd v Leeds United: Over 2.5 Goals",
            scheduleNote: "Mon 13 Apr, 20:00 BST",
            aiReasoning:
              "This keeps late-slip upside without being as fragile as a result builder.",
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
        legs: 4,
        betLines: [
          {
            label: "Arsenal v Bournemouth: Arsenal -1 Handicap",
            scheduleNote: "Sat 11 Apr, 12:30 BST",
            aiReasoning:
              "A margin play on the favourite lifts payout from a still-strong spot.",
            marketId: "arsenal-bournemouth-arsenal-minus-1",
          },
          {
            label: "Liverpool v Fulham: Liverpool to Win & Over 2.5 Goals",
            scheduleNote: "Sat 11 Apr, 17:30 BST",
            aiReasoning:
              "The builder boosts return by combining the result with expected scoring.",
            marketId: "liverpool-fulham-liverpool-win-over-2-5",
          },
          {
            label: "Chelsea v Man City: Both Teams To Score & Over 2.5 Goals",
            scheduleNote: "Sun 12 Apr, 16:30 BST",
            aiReasoning:
              "This targets a high-event match script for a sharper return multiple.",
            marketId: "chelsea-man-city-btts-over-2-5",
          },
          {
            label: "Man Utd v Leeds United: Man Utd to Win & Over 2.5 Goals",
            scheduleNote: "Mon 13 Apr, 20:00 BST",
            aiReasoning:
              "This acts as the highest-upside closer if the acca reaches the final leg.",
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
    name: "Matchday 31 Action Board",
    description:
      "Previous matchday archive of proposed slips and recorded member votes.",
    startsIn: "Closed",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive",
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
