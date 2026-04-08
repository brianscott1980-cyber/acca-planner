import type { MatchdayProposalRecord } from "../types/matchday_type";

export const matchdayProposals: MatchdayProposalRecord[] = [
  {
    id: "proposal-md-1-safe",
    gameWeekId: "md-1",
    proposalId: "safe",
    riskLevel: "safe",
    title: "Defensive Accumulator",
    summary:
      "Three straight result bets keep the weekend anchored to strong favourites and a home Inter side getting key attacking help back, protecting optionality while the pot is still flat at its opening level.",
    legs: 3,
    statusLabel: "Preserve",
    cashoutWatchList: [
      "Protect value if Bayern fail to control territory early at Freiburg or if their main front-line threat is withdrawn before the hour mark.",
      "Leverkusen are the shortest leg in the chain, so an early Wolfsburg lead or visible drop in home pressure is the clearest upset warning for this slip.",
      "If Inter lose Lautaro's attacking threat through a substitution or setback, the final leg becomes less secure and an available cashout is easier to justify.",
    ],
    betLineIds: [
      "betline-md-1-safe-bayern-win",
      "betline-md-1-safe-leverkusen-win",
      "betline-md-1-safe-inter-win",
    ],
  },
  {
    id: "proposal-md-1-balanced",
    gameWeekId: "md-1",
    proposalId: "balanced",
    riskLevel: "balanced",
    title: "Balanced Accumulator",
    summary:
      "The recommended middle route keeps two favourite outcomes but adds the stronger Milan goals angle, which suits a stable pot with no prior settled streak demanding a more defensive or more aggressive jump.",
    legs: 3,
    statusLabel: "Balance",
    cashoutWatchList: [
      "Reassess after Bayern and Madrid: if one favourite has won without much control, take that as a warning before letting the Sunday goals leg run.",
      "For Mallorca v Real Madrid, a Madrid defensive reshuffle or a key attacker being substituted can quickly change the BTTS path and make a mid-range cashout attractive.",
      "In Inter v Roma, stay alert for Roma growing into transitions or Inter losing their front-two intensity, because that shifts the BTTS leg from strong to fragile very quickly.",
    ],
    aiRecommended: true,
    betLineIds: [
      "betline-md-1-balanced-bayern-win",
      "betline-md-1-balanced-real-win",
      "betline-md-1-balanced-inter-roma-btts",
    ],
  },
  {
    id: "proposal-md-1-aggressive",
    gameWeekId: "md-1",
    proposalId: "aggressive",
    riskLevel: "aggressive",
    title: "Aggressive Accumulator",
    summary:
      "This chase version leans into two goals markets and still keeps Madrid and Leverkusen onside, holding the bigger swing for the later Sunday leg once the earlier anchors have had a chance to land.",
    legs: 4,
    statusLabel: "Upside",
    cashoutWatchList: [
      "This build is most exposed if Mallorca v Real Madrid starts cagey, so a slow game with few shots or an early attacking substitution is a serious warning for the BTTS leg.",
      "If Leverkusen do not pin Wolfsburg back early, do not ignore the upset signal just because it is the shortest-priced leg in the slip.",
      "The last swing sits with Inter v Roma BTTS, so any injury, substitution, or tactical change that removes one side's counter-attacking threat is a strong reason to consider cashing out.",
    ],
    betLineIds: [
      "betline-md-1-aggressive-leverkusen-win",
      "betline-md-1-aggressive-mallorca-real-btts",
      "betline-md-1-aggressive-real-win",
      "betline-md-1-aggressive-inter-roma-btts",
    ],
  },
  {
    id: "proposal-md-2-safe",
    gameWeekId: "md-2",
    proposalId: "safe",
    riskLevel: "safe",
    title: "Defensive Accumulator",
    summary:
      "A protection-first two-leg card built around home control first, then one measured away favourite, applying the post-matchday lesson to avoid stacking multiple short away risks.",
    legs: 2,
    statusLabel: "Preserve",
    cashoutWatchList: [
      "If Arsenal's territorial control is weaker than expected in the opening half, protect value early rather than forcing full exposure.",
      "Como v Inter is the closing risk point, so any Inter lineup disruption or loss of attacking cohesion should trigger a cashout review.",
      "This profile is designed to preserve bankroll first after the last losing matchday.",
    ],
    aiRecommended: true,
    betLineIds: [
      "betline-md-2-safe-arsenal-win",
      "betline-md-2-safe-inter-win",
    ],
  },
  {
    id: "proposal-md-2-balanced",
    gameWeekId: "md-2",
    proposalId: "balanced",
    riskLevel: "balanced",
    title: "Balanced Accumulator",
    summary:
      "A three-league middle profile with two control-led anchors before one away favourite, reflecting the lesson to avoid clustering medium-confidence away outcomes in one slip.",
    legs: 3,
    statusLabel: "Balance",
    cashoutWatchList: [
      "If Liverpool fail to generate early box pressure, treat that as a signal to protect rather than roll the full slip onward.",
      "Falkirk v Rangers is the structural midpoint; if Rangers lose midfield control, a mid-return exit is reasonable.",
      "Parma v Napoli is the final risk leg, so late Napoli team-news shocks should reduce hold confidence.",
    ],
    betLineIds: [
      "betline-md-2-balanced-liverpool-win",
      "betline-md-2-balanced-rangers-win",
      "betline-md-2-balanced-napoli-win",
    ],
  },
  {
    id: "proposal-md-2-aggressive",
    gameWeekId: "md-2",
    proposalId: "aggressive",
    riskLevel: "aggressive",
    title: "Aggressive Accumulator",
    summary:
      "A higher-variance four-leg chase that keeps upside in two goals legs and one stronger away price, but still sequences a stabiliser in the middle to avoid uncontrolled compounding risk.",
    legs: 4,
    statusLabel: "Upside",
    cashoutWatchList: [
      "Arsenal v Bournemouth BTTS needs open-game tempo; if Arsenal lock the game down after a lead, the upside path weakens fast.",
      "Aberdeen v Hibernian BTTS is the first volatility test, so a very slow chance profile is the earliest exit warning.",
      "Atalanta v Juventus and Parma v Napoli carry the late payout swing; if lineups lose key attackers, protect profit before kickoff.",
    ],
    betLineIds: [
      "betline-md-2-aggressive-arsenal-btts",
      "betline-md-2-aggressive-aberdeen-btts",
      "betline-md-2-aggressive-juventus-win",
      "betline-md-2-aggressive-parma-btts",
    ],
  },
];
