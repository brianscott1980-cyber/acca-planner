import type { MatchdayBetLineRecord } from "../types/matchday_type";

export const matchdayBetLines: MatchdayBetLineRecord[] = [
  {
    id: "betline-md-1-safe-bayern-win",
    gameWeekId: "md-1",
    proposalEntityId: "proposal-md-1-safe",
    sortOrder: 1,
    label: "SC Freiburg v Bayern Munich: Bayern Munich to win",
    scheduleNote: "Sat 4 Apr, 13:30 BST",
    aiReasoning:
      "Bayern arrive on a five-game Bundesliga winning run with 18 goals scored, while Freiburg have taken only two wins from their last five league outings. Even with European fixtures nearby, the away-win line is still the cleanest low-volatility read.",
    formId: "form-md-1-freiburg-bayern",
    formNote:
      "Last five league goals: Freiburg 6, Bayern Munich 18.",
    odds: "1.40",
    marketId: "market-md-1-bayern-win",
  },
  {
    id: "betline-md-1-safe-leverkusen-win",
    gameWeekId: "md-1",
    proposalEntityId: "proposal-md-1-safe",
    sortOrder: 2,
    label: "Bayer Leverkusen v Wolfsburg: Bayer Leverkusen to win",
    scheduleNote: "Sat 4 Apr, 13:30 BST",
    aiReasoning:
      "Leverkusen still need a strong run for the European places and have lost only once in their last five league matches. Wolfsburg are winless in five league games and have shipped 13 goals across that spell.",
    formId: "form-md-1-leverkusen-wolfsburg",
    formNote:
      "Last five league goals: Bayer Leverkusen 9, Wolfsburg 6.",
    odds: "1.40",
    marketId: "market-md-1-leverkusen-win",
  },
  {
    id: "betline-md-1-safe-inter-win",
    gameWeekId: "md-1",
    proposalEntityId: "proposal-md-1-safe",
    sortOrder: 3,
    label: "Inter Milan v Roma: Inter Milan to win",
    scheduleNote: "Sun 5 Apr, 18:45 BST",
    aiReasoning:
      "Inter get Lautaro Martinez back for Sunday and remain top of Serie A. Roma have scored well recently, but their selection noise makes the straight home win safer than pushing immediately into a higher-variance goals play.",
    formId: "form-md-1-inter-roma",
    formNote:
      "Last five league goals: Inter Milan 6, Roma 11.",
    odds: "1.67",
    marketId: "market-md-1-inter-win",
  },
  {
    id: "betline-md-1-balanced-bayern-win",
    gameWeekId: "md-1",
    proposalEntityId: "proposal-md-1-balanced",
    sortOrder: 1,
    label: "SC Freiburg v Bayern Munich: Bayern Munich to win",
    scheduleNote: "Sat 4 Apr, 13:30 BST",
    aiReasoning:
      "Bayern's last five league matches have produced five wins and 18 goals, and Freiburg have still been vulnerable against top-six attacking quality. The price is short, but it gives the balanced slip an early anchor without overcomplicating the first leg.",
    formId: "form-md-1-freiburg-bayern",
    formNote:
      "Last five league goals: Freiburg 6, Bayern Munich 18.",
    odds: "1.40",
    marketId: "market-md-1-bayern-win",
  },
  {
    id: "betline-md-1-balanced-real-win",
    gameWeekId: "md-1",
    proposalEntityId: "proposal-md-1-balanced",
    sortOrder: 2,
    label: "Mallorca v Real Madrid: Real Madrid to win",
    scheduleNote: "Sat 4 Apr, 15:15 BST",
    aiReasoning:
      "Mallorca have taken only two points from their last five league games and scored just three times in that run. Madrid do carry rotation risk with a European tie ahead, but their shot volume and recent away output still make the straight win the calmer angle here.",
    formId: "form-md-1-mallorca-real",
    formNote:
      "Last five league goals: Mallorca 3, Real Madrid 11.",
    odds: "1.65",
    marketId: "market-md-1-real-win",
  },
  {
    id: "betline-md-1-balanced-inter-roma-btts",
    gameWeekId: "md-1",
    proposalEntityId: "proposal-md-1-balanced",
    sortOrder: 3,
    label: "Inter Milan v Roma: Both teams to score",
    scheduleNote: "Sun 5 Apr, 18:45 BST",
    aiReasoning:
      "Inter have kept only one clean sheet across their last five Serie A matches, while Roma have scored 11 goals over their last five league games. Lautaro's return strengthens the home attack enough to back both sides finding one.",
    formId: "form-md-1-inter-roma",
    formNote:
      "Inter have scored 6 and Roma 11 across their last five Serie A matches.",
    odds: "1.91",
    marketId: "market-md-1-inter-roma-btts-yes",
  },
  {
    id: "betline-md-1-aggressive-leverkusen-win",
    gameWeekId: "md-1",
    proposalEntityId: "proposal-md-1-aggressive",
    sortOrder: 1,
    label: "Bayer Leverkusen v Wolfsburg: Bayer Leverkusen to win",
    scheduleNote: "Sat 4 Apr, 13:30 BST",
    aiReasoning:
      "Leverkusen still profile as the stronger side on form and urgency, and Wolfsburg's defensive run makes them hard to trust away from home. This stays in as the first aggressive anchor before the higher-variance legs kick in.",
    formId: "form-md-1-leverkusen-wolfsburg",
    formNote:
      "Last five league goals: Bayer Leverkusen 9, Wolfsburg 6.",
    odds: "1.40",
    marketId: "market-md-1-leverkusen-win",
  },
  {
    id: "betline-md-1-aggressive-mallorca-real-btts",
    gameWeekId: "md-1",
    proposalEntityId: "proposal-md-1-aggressive",
    sortOrder: 2,
    label: "Mallorca v Real Madrid: Both teams to score",
    scheduleNote: "Sat 4 Apr, 15:15 BST",
    aiReasoning:
      "Madrid have scored in every one of their last five league games but have also conceded in four of those five. Mallorca are light on wins, yet their home setup still forces them to trade chances, which keeps the BTTS price live enough for the higher-risk slip.",
    formId: "form-md-1-mallorca-real",
    formNote:
      "Mallorca have scored 3 and Real Madrid 11 across their last five La Liga matches.",
    odds: "1.67",
    marketId: "market-md-1-mallorca-real-btts-yes",
  },
  {
    id: "betline-md-1-aggressive-real-win",
    gameWeekId: "md-1",
    proposalEntityId: "proposal-md-1-aggressive",
    sortOrder: 3,
    label: "Mallorca v Real Madrid: Real Madrid to win",
    scheduleNote: "Sat 4 Apr, 15:15 BST",
    aiReasoning:
      "Keeping Madrid on the slip lets the aggressive build still lean on the stronger team even while pairing it with a goals angle. Mallorca's recent downturn and Madrid's top-end attacking floor keep the away result in play.",
    formId: "form-md-1-mallorca-real",
    formNote:
      "Last five league goals: Mallorca 3, Real Madrid 11.",
    odds: "1.65",
    marketId: "market-md-1-real-win",
  },
  {
    id: "betline-md-1-aggressive-inter-roma-btts",
    gameWeekId: "md-1",
    proposalEntityId: "proposal-md-1-aggressive",
    sortOrder: 4,
    label: "Inter Milan v Roma: Both teams to score",
    scheduleNote: "Sun 5 Apr, 18:45 BST",
    aiReasoning:
      "Roma have scored in four of their last five league matches and Inter's defensive line has looked less secure recently. With Lautaro expected back and Roma still carrying enough attacking quality, the BTTS leg gives the Sunday finish a stronger upside swing.",
    formId: "form-md-1-inter-roma",
    formNote:
      "Inter have scored 6 and Roma 11 across their last five Serie A matches.",
    odds: "1.91",
    marketId: "market-md-1-inter-roma-btts-yes",
  },
  {
    id: "betline-md-2-safe-arsenal-win",
    gameWeekId: "md-2",
    proposalEntityId: "proposal-md-2-safe",
    sortOrder: 1,
    label: "Arsenal v Bournemouth: Arsenal to win",
    scheduleNote: "Sat 11 Apr, 15:00 BST",
    aiReasoning:
      "Arsenal are first by design: their recent home control profile and stronger chance creation give a cleaner opening anchor than forcing an early away-favourite leg.",
    formId: "form-md-2-arsenal-bournemouth",
    formNote:
      "Last five league goals: Arsenal 9, Bournemouth 7.",
    odds: "1.36",
    marketId: "market-md-2-arsenal-win",
  },
  {
    id: "betline-md-2-safe-inter-win",
    gameWeekId: "md-2",
    proposalEntityId: "proposal-md-2-safe",
    sortOrder: 2,
    label: "Como v Inter Milan: Inter Milan to win",
    scheduleNote: "Sun 12 Apr, 19:45 BST",
    aiReasoning:
      "Inter is used as a single away-favourite closer, not stacked with other away risks, which directly reflects the prior-loss lesson around short away volatility.",
    formId: "form-md-2-como-inter",
    formNote:
      "Last five league goals: Como 4, Inter Milan 10.",
    odds: "1.62",
    marketId: "market-md-2-inter-win",
  },
  {
    id: "betline-md-2-balanced-liverpool-win",
    gameWeekId: "md-2",
    proposalEntityId: "proposal-md-2-balanced",
    sortOrder: 1,
    label: "Liverpool v Fulham: Liverpool to win",
    scheduleNote: "Sat 11 Apr, 15:00 BST",
    aiReasoning:
      "Liverpool starts the balanced card because the home baseline is stronger and avoids repeating the previous pattern of over-trusting early away favourites.",
    formId: "form-md-2-liverpool-fulham",
    formNote:
      "Last five league goals: Liverpool 12, Fulham 6.",
    odds: "1.44",
    marketId: "market-md-2-liverpool-win",
  },
  {
    id: "betline-md-2-balanced-rangers-win",
    gameWeekId: "md-2",
    proposalEntityId: "proposal-md-2-balanced",
    sortOrder: 2,
    label: "Falkirk v Rangers: Rangers to win",
    scheduleNote: "Sun 12 Apr, 12:00 BST",
    aiReasoning:
      "Rangers sits in the middle slot as a cross-league stabiliser so the balanced profile does not depend on one-league dynamics.",
    formId: "form-md-2-falkirk-rangers",
    formNote:
      "Last five league goals: Falkirk 7, Rangers 12.",
    odds: "1.47",
    marketId: "market-md-2-rangers-win",
  },
  {
    id: "betline-md-2-balanced-napoli-win",
    gameWeekId: "md-2",
    proposalEntityId: "proposal-md-2-balanced",
    sortOrder: 3,
    label: "Parma v Napoli: Napoli to win",
    scheduleNote: "Sun 12 Apr, 14:00 BST",
    aiReasoning:
      "Napoli closes the balanced build as the only away-favourite lift, keeping the risk structure disciplined instead of stacking multiple similar away spots.",
    formId: "form-md-2-parma-napoli",
    formNote:
      "Last five league goals: Parma 7, Napoli 10.",
    odds: "1.70",
    marketId: "market-md-2-napoli-win",
  },
  {
    id: "betline-md-2-aggressive-arsenal-btts",
    gameWeekId: "md-2",
    proposalEntityId: "proposal-md-2-aggressive",
    sortOrder: 1,
    label: "Arsenal v Bournemouth: Both teams to score",
    scheduleNote: "Sat 11 Apr, 15:00 BST",
    aiReasoning:
      "The aggressive route opens with BTTS variance instead of a short result line, targeting upside while avoiding duplicated away-favourite exposure.",
    formId: "form-md-2-arsenal-bournemouth",
    formNote:
      "Last five league goals: Arsenal 9, Bournemouth 7; both attacks have recent scoring volume.",
    odds: "1.95",
    marketId: "market-md-2-arsenal-bournemouth-btts-yes",
  },
  {
    id: "betline-md-2-aggressive-aberdeen-btts",
    gameWeekId: "md-2",
    proposalEntityId: "proposal-md-2-aggressive",
    sortOrder: 2,
    label: "Aberdeen v Hibernian: Both teams to score",
    scheduleNote: "Sat 11 Apr, 15:00 BST",
    aiReasoning:
      "Aberdeen-Hibs BTTS adds a second volatility leg with strong recent scoring on both sides, supporting the intended aggressive profile.",
    formId: "form-md-2-aberdeen-hibernian",
    formNote:
      "Last five league goals: Aberdeen 9, Hibernian 8.",
    odds: "1.67",
    marketId: "market-md-2-aberdeen-hibernian-btts-yes",
  },
  {
    id: "betline-md-2-aggressive-juventus-win",
    gameWeekId: "md-2",
    proposalEntityId: "proposal-md-2-aggressive",
    sortOrder: 3,
    label: "Atalanta v Juventus: Juventus to win",
    scheduleNote: "Sun 12 Apr, 14:00 BST",
    aiReasoning:
      "Juventus away is the primary aggressive price swing, intentionally placed after two earlier variance legs to maximise upside while preserving ordering logic.",
    formId: "form-md-2-atalanta-juventus",
    formNote:
      "Last five league goals: Atalanta 8, Juventus 7.",
    odds: "2.30",
    marketId: "market-md-2-juventus-win",
  },
  {
    id: "betline-md-2-aggressive-parma-btts",
    gameWeekId: "md-2",
    proposalEntityId: "proposal-md-2-aggressive",
    sortOrder: 4,
    label: "Parma v Napoli: Both teams to score",
    scheduleNote: "Sun 12 Apr, 14:00 BST",
    aiReasoning:
      "Parma-Napoli BTTS closes the slip as the final volatility amplifier, matching the aggressive sequencing rule that later legs should carry larger swing.",
    formId: "form-md-2-parma-napoli",
    formNote:
      "Last five league goals: Parma 7, Napoli 10; both sides have enough recent scoring signal for a late BTTS swing.",
    odds: "1.80",
    marketId: "market-md-2-parma-napoli-btts-yes",
  },
];
