import type { MatchdayBetLineRecord } from "../types/matchday_type";

export const matchdayBetLines: MatchdayBetLineRecord[] = [
  {
    id: "md-1-safe-line-1",
    gameWeekId: "md-1",
    proposalEntityId: "md-1-proposal-safe",
    sortOrder: 1,
    label: "Bayern Munich to beat SC Freiburg",
    scheduleNote: "Sat 4 Apr, 13:30 BST",
    aiReasoning:
      "Ladbrokes still prices Bayern as the shortest Bundesliga away favourite in the slate, which suits the low-volatility opening leg.",
    formId: "md-1-form-bayern-freiburg",
    formNote:
      "Recent scoring check: Bayern have 11 goals across the latest four visible Bundesliga rows surfaced by StatMuse, while Freiburg's visible recent Bundesliga rows returned 5 goals. The away win is cleaner than forcing a goals total.",
    odds: "1.40",
    marketId: "ladbrokes-md-1-bayern-win",
  },
  {
    id: "md-1-safe-line-2",
    gameWeekId: "md-1",
    proposalEntityId: "md-1-proposal-safe",
    sortOrder: 2,
    label: "Real Madrid to beat Mallorca",
    scheduleNote: "Sat 4 Apr, 14:15 BST",
    aiReasoning:
      "Real Madrid's price stays short enough for the defensive slip while their recent scoring profile remains comfortably ahead of Mallorca's.",
    formId: "md-1-form-mallorca-real-madrid",
    formNote:
      "Last 5 La Liga scoring check: Real Madrid scored 12 across Getafe, Atletico Madrid, Villarreal, Alaves, and Real Sociedad, while Mallorca scored 5 across Girona, Athletic Bilbao, Real Valladolid, Osasuna, and Sevilla.",
    odds: "1.57",
    marketId: "ladbrokes-md-1-real-madrid-win",
  },
  {
    id: "md-1-safe-line-3",
    gameWeekId: "md-1",
    proposalEntityId: "md-1-proposal-safe",
    sortOrder: 3,
    label: "Inter Milan to beat Roma",
    scheduleNote: "Sun 5 Apr, 18:45 BST",
    aiReasoning:
      "Inter's home win keeps the safer slip outcome-led instead of leaning on a higher-variance goals read in the final leg.",
    formId: "md-1-form-inter-roma",
    formNote:
      "Roma have scored 11 in their last 5 Serie A matches. Inter's accessible recent Serie A rows show 6 goals across the latest four visible league matches, so the safer route is the Inter result rather than a pure goals angle.",
    odds: "1.62",
    marketId: "ladbrokes-md-1-inter-win",
  },
  {
    id: "md-1-balanced-line-1",
    gameWeekId: "md-1",
    proposalEntityId: "md-1-proposal-balanced",
    sortOrder: 1,
    label: "Bayern Munich to beat SC Freiburg",
    scheduleNote: "Sat 4 Apr, 13:30 BST",
    aiReasoning:
      "The shortest German price remains a solid stabiliser for a balanced slip that still wants early control of cashout equity.",
    formId: "md-1-form-bayern-freiburg",
    formNote:
      "Recent scoring check: Bayern have 11 goals across the latest four visible Bundesliga rows surfaced by StatMuse, while Freiburg's visible recent Bundesliga rows returned 5 goals.",
    odds: "1.40",
    marketId: "ladbrokes-md-1-bayern-win",
  },
  {
    id: "md-1-balanced-line-2",
    gameWeekId: "md-1",
    proposalEntityId: "md-1-proposal-balanced",
    sortOrder: 2,
    label: "Bayer Leverkusen to beat Wolfsburg",
    scheduleNote: "Sat 4 Apr, 13:30 BST",
    aiReasoning:
      "Leverkusen's home price is still playable in the mid-risk build because Wolfsburg arrive on the weaker trend line and the leg lifts the total without distorting sequencing.",
    formId: "md-1-form-leverkusen-wolfsburg",
    formNote:
      "Leverkusen's last 5 Bundesliga rows show 9 goals scored against Mainz, Hamburg, Freiburg, Bayern, and Heidenheim. Wolfsburg's accessible recent market and form pages show a D-L-L-L-D slide, so the home win stays the cleaner choice.",
    odds: "1.40",
    marketId: "ladbrokes-md-1-leverkusen-win",
  },
  {
    id: "md-1-balanced-line-3",
    gameWeekId: "md-1",
    proposalEntityId: "md-1-proposal-balanced",
    sortOrder: 3,
    label: "Real Madrid to beat Mallorca",
    scheduleNote: "Sat 4 Apr, 14:15 BST",
    aiReasoning:
      "Madrid remain the strongest Spanish anchor in the weekend window, and their scoring output supports keeping the result market rather than stretching to a combo.",
    formId: "md-1-form-mallorca-real-madrid",
    formNote:
      "Last 5 La Liga scoring check: Real Madrid scored 12 across Getafe, Atletico Madrid, Villarreal, Alaves, and Real Sociedad, while Mallorca scored 5 across Girona, Athletic Bilbao, Real Valladolid, Osasuna, and Sevilla.",
    odds: "1.57",
    marketId: "ladbrokes-md-1-real-madrid-win",
  },
  {
    id: "md-1-balanced-line-4",
    gameWeekId: "md-1",
    proposalEntityId: "md-1-proposal-balanced",
    sortOrder: 4,
    label: "Inter Milan to beat Roma",
    scheduleNote: "Sun 5 Apr, 18:45 BST",
    aiReasoning:
      "Keeping Inter on the win line rather than BTTS stops the balanced slip from pushing too much variance into the Sunday closer.",
    formId: "md-1-form-inter-roma",
    formNote:
      "Roma have scored 11 in their last 5 Serie A matches. Inter's accessible recent Serie A rows show 6 goals across the latest four visible league matches, which still supports the home side more than the goals market in the balanced build.",
    odds: "1.62",
    marketId: "ladbrokes-md-1-inter-win",
  },
  {
    id: "md-1-aggressive-line-1",
    gameWeekId: "md-1",
    proposalEntityId: "md-1-proposal-aggressive",
    sortOrder: 1,
    label: "Bayern Munich to beat SC Freiburg",
    scheduleNote: "Sat 4 Apr, 13:30 BST",
    aiReasoning:
      "The aggressive slip still starts with a strong favourite so the later higher-variance leg has something to leverage.",
    formId: "md-1-form-bayern-freiburg",
    formNote:
      "Recent scoring check: Bayern have 11 goals across the latest four visible Bundesliga rows surfaced by StatMuse, while Freiburg's visible recent Bundesliga rows returned 5 goals.",
    odds: "1.40",
    marketId: "ladbrokes-md-1-bayern-win",
  },
  {
    id: "md-1-aggressive-line-2",
    gameWeekId: "md-1",
    proposalEntityId: "md-1-proposal-aggressive",
    sortOrder: 2,
    label: "Bayer Leverkusen to beat Wolfsburg",
    scheduleNote: "Sat 4 Apr, 13:30 BST",
    aiReasoning:
      "Leverkusen still fit the aggressive slip because the market remains short enough to preserve room for a bigger Sunday price move.",
    formId: "md-1-form-leverkusen-wolfsburg",
    formNote:
      "Leverkusen's last 5 Bundesliga rows show 9 goals scored against Mainz, Hamburg, Freiburg, Bayern, and Heidenheim. Wolfsburg's accessible recent market and form pages show a D-L-L-L-D slide.",
    odds: "1.40",
    marketId: "ladbrokes-md-1-leverkusen-win",
  },
  {
    id: "md-1-aggressive-line-3",
    gameWeekId: "md-1",
    proposalEntityId: "md-1-proposal-aggressive",
    sortOrder: 3,
    label: "Real Madrid to beat Mallorca",
    scheduleNote: "Sat 4 Apr, 14:15 BST",
    aiReasoning:
      "Madrid stay in every build because the away win price is still efficient and helps the aggressive slip reach Sunday with live upside.",
    formId: "md-1-form-mallorca-real-madrid",
    formNote:
      "Last 5 La Liga scoring check: Real Madrid scored 12 across Getafe, Atletico Madrid, Villarreal, Alaves, and Real Sociedad, while Mallorca scored 5 across Girona, Athletic Bilbao, Real Valladolid, Osasuna, and Sevilla.",
    odds: "1.57",
    marketId: "ladbrokes-md-1-real-madrid-win",
  },
  {
    id: "md-1-aggressive-line-4",
    gameWeekId: "md-1",
    proposalEntityId: "md-1-proposal-aggressive",
    sortOrder: 4,
    label: "Inter Milan v Roma both teams to score",
    scheduleNote: "Sun 5 Apr, 18:45 BST",
    aiReasoning:
      "This is the deliberate upside leg: Roma's recent scoring run and Inter's pair of 1-1 league draws make the BTTS price a cleaner way to chase lift than forcing an exact result.",
    formId: "md-1-form-inter-roma",
    formNote:
      "Roma have scored 11 in their last 5 Serie A matches. Inter's accessible recent Serie A rows show 6 goals across the latest four visible league matches, including 1-1 draws with Milan and Fiorentina, which keeps the BTTS case alive.",
    odds: "1.91",
    marketId: "ladbrokes-md-1-inter-btts-yes",
  },
];
