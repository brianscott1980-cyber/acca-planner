export type RiskLevel = "safe" | "balanced" | "aggressive";

export type GameWeekProposalRecord = {
  id: string;
  riskLevel: RiskLevel;
  title: string;
  odds: string;
  legs: number;
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
    id: "gw-24",
    slug: "gameweek-24",
    name: "Gameweek 24 Action Board",
    description:
      "AI analysis complete. Review legs and cast your syndicate vote.",
    startsIn: "Starts in 2d 14h",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive Accumulator",
        odds: "+200",
        legs: 3,
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral Accumulator",
        odds: "+450",
        legs: 5,
        statusLabel: "Balanced",
        aiRecommended: true,
      },
      {
        id: "aggressive",
        riskLevel: "aggressive",
        title: "Aggressive Accumulator",
        odds: "+900",
        legs: 7,
        statusLabel: "High Risk",
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
    id: "gw-23",
    slug: "gameweek-23",
    name: "Gameweek 23 Action Board",
    description:
      "Previous week archive of proposed slips and recorded member votes.",
    startsIn: "Closed",
    proposals: [
      {
        id: "defensive",
        riskLevel: "safe",
        title: "Defensive Accumulator",
        odds: "+180",
        legs: 3,
        statusLabel: "Safe",
      },
      {
        id: "neutral",
        riskLevel: "balanced",
        title: "Neutral Accumulator",
        odds: "+420",
        legs: 4,
        statusLabel: "Balanced",
        aiRecommended: true,
      },
      {
        id: "aggressive",
        riskLevel: "aggressive",
        title: "Aggressive Accumulator",
        odds: "+850",
        legs: 6,
        statusLabel: "High Risk",
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
