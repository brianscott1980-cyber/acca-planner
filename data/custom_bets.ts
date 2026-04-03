import type { CustomBetRecord } from "../types/custom_bet_type";

export const customBets: CustomBetRecord[] = [
  {
    id: "custom-bet-2026-04-11-grand-national-2026-each-way",
    slug: "2026-04-11-grand-national-2026-each-way",
    title: "Grand National 2026",
    state: "pending",
    sport: "horse_racing",
    bookmaker: "Ladbrokes",
    eventName: "Randox Grand National",
    competitionName: "Aintree Grand National Festival",
    bettingFormatRequested: "Each-way single",
    proposedBets: [
      {
        rank: 1,
        market: "Each-way",
        selection: "Grangeclare West",
        decimalOdds: 9,
        summary:
          "Best current balance of proven Aintree stamina, solid recent prep, and still-fair Ladbrokes win-and-place value.",
        horseRacing: {
          trainer: "W P Mullins",
          jockey: "Paul Townend",
          silksImagePath: "/assets/jockey_jerseys/grangeclare-west-cheveley-park.png",
          silksSourceUrl:
            "https://commons.wikimedia.org/wiki/File:Racing_silks_of_Cheveley_Park_Stud.png",
          age: 10,
          weight: "11st 10lb",
          officialRating: 166,
          recentForm: "1421",
          owner: "Cheveley Park Stud",
        },
      },
      {
        rank: 2,
        market: "Each-way",
        selection: "Iroko",
        decimalOdds: 13,
        summary:
          "Cleaner weight and profile than many principals, but the price is shorter than the top pick so the place-value cushion is less generous.",
        horseRacing: {
          silksImagePath: "/assets/jockey_jerseys/jp-mcmanus-silks.png",
          silksSourceUrl: "https://commons.wikimedia.org/wiki/File:Spot_Thedifference.png",
          age: 8,
          weight: "11st 1lb",
          recentForm: "2P22",
        },
      },
      {
        rank: 3,
        market: "Each-way",
        selection: "I Am Maximus",
        decimalOdds: 9,
        summary:
          "Elite course credentials keep him on the shortlist, but top-weight and a tighter price make him the least forgiving value angle of the three.",
        horseRacing: {
          silksImagePath: "/assets/jockey_jerseys/jp-mcmanus-silks.png",
          silksSourceUrl: "https://commons.wikimedia.org/wiki/File:Spot_Thedifference.png",
          age: 10,
          weight: "11st 12lb",
          recentForm: "1122",
        },
      },
    ],
    recommendedMarket: "Each-way",
    recommendedSelection: "Grangeclare West",
    decimalOdds: 9,
    summary:
      "AI custom bet for Saturday 11 April 2026: a ranked Grand National each-way shortlist led by Grangeclare West, with Iroko and I Am Maximus retained as stronger-market alternatives if prices or declarations shift.",
    analysisSummary:
      "The shortlist is built around each-way survivability rather than chasing a fragile win-only angle in a huge field. Grangeclare West stays top because his Aintree evidence, stamina profile, and recent trial strength still look underrepresented at 8/1 in Ladbrokes terms, especially when the place part of the bet matters. Iroko is the cleaner lower-weight alternative if you want a tidier profile, while I Am Maximus still has obvious class and National credentials but gives away more value because the burden of top-weight leaves less room for error at the same headline price as the top pick. With the current pot at GBP 70, the suggested stake is GBP 8 total on this one-off each-way idea so the exposure stays controlled relative to the main matchday betting bank.",
    mediaSummary:
      "Current Grand National coverage keeps the focus on the front end of the market, with Grangeclare West and I Am Maximus around 8/1 at Ladbrokes and Iroko around 12/1. The key external factors remain declarations, ground movement, and any late jockey or stable signals. That is why the recommendation is framed as a ranked three-bet shortlist rather than pretending there is only one viable path through a race this volatile.",
    timelineTitle: "Custom Bet Ready",
    timelineDescription:
      "Grand National 2026 each-way shortlist ready: Grangeclare West, Iroko, and I Am Maximus.",
    generatedAtIso: "2026-04-03T20:35:00.000Z",
    eventStartIso: "2026-04-11T15:00:00.000Z",
    eventEndIso: "2026-04-11T16:30:00.000Z",
    suggestedStakeAmount: 8,
    cashoutLowerTarget:
      "Protect near-stake value if Grangeclare West is travelling cleanly through the second circuit and the place side is already being priced strongly.",
    cashoutUpperTarget:
      "Take a strong profit if he is still on the bridle or closing smoothly into the leading group after the penultimate fence.",
    noCashoutValue:
      "Let it run if he meets the second-last in rhythm, is still travelling within striking distance, and the jumping remains composed.",
    cashoutAdvice: [
      "Treat this primarily as an each-way position, so the place equity matters more than an all-or-nothing win sweat in the middle stages.",
      "Do not overreact too early. The National can turn sharply once the field strings out, so the right read comes from rhythm, position, and how economically the horse is travelling.",
      "If the top pick is still moving strongly but the market has already priced in a major place chance, taking some protection can be the disciplined move instead of waiting for a full win-only scenario.",
    ],
    watchPoints: [
      "Check final declarations and rider confirmations before race day because late changes can materially affect both price and confidence.",
      "Monitor the official going and any late rain. A meaningful ground shift can change how strongly the race is run and which stamina profiles are favoured.",
      "Watch how Grangeclare West jumps through the middle section of the race. If he starts losing fluency or position before the final circuit, the cashout case strengthens quickly.",
    ],
    riskFactors: [
      "Grand National field size and traffic create much more randomness than a normal staying chase, even for well-fancied runners.",
      "Ante-post and early race-week prices can move sharply once declarations and ground updates settle.",
      "A horse can still travel well for a long way in this race and then lose ground quickly through one mistake, crowding, or a pace change.",
    ],
    horseRacing: {
      racecourse: "Aintree",
      raceTimeNote: "Sat 11 Apr 2026, 16:00 BST",
      horseName: "Grangeclare West",
      trainer: "W P Mullins",
      jockey: "Paul Townend",
      silksImagePath: "/assets/jockey_jerseys/grangeclare-west-cheveley-park.png",
      silksSourceUrl:
        "https://commons.wikimedia.org/wiki/File:Racing_silks_of_Cheveley_Park_Stud.png",
      age: 10,
      weight: "11st 10lb",
      officialRating: 166,
      recentForm: "1421",
      owner: "Cheveley Park Stud",
      going: "Watch for any declaration-week ground shift before locking the bet in.",
      distance: "4m 2 1/2f",
      fieldSize: 34,
      notableRivals: [],
    },
  },
];
