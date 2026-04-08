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
        suggestedStakeAmount: 4,
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
        suggestedStakeAmount: 2.5,
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
        suggestedStakeAmount: 1.5,
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
  {
    id: "custom-bet-2026-04-12-masters-tournament-top-10-shortlist",
    slug: "2026-04-12-masters-tournament-top-10-shortlist",
    title: "Masters Tournament 2026",
    state: "pending",
    sport: "golf",
    bookmaker: "Ladbrokes",
    eventName: "The Masters Tournament",
    competitionName: "PGA Tour Major Championship",
    bettingFormatRequested: "Top 10 Finish single",
    proposedBets: [
      {
        rank: 1,
        market: "Top 10 Finish",
        selection: "Xander Schauffele",
        decimalOdds: 2.8,
        suggestedStakeAmount: 5.5,
        summary:
          "Best risk-adjusted route this week: elite tee-to-green consistency and strong major temperament give the cleanest probability of payout without needing an outright win.",
      },
      {
        rank: 2,
        market: "Top 10 Finish",
        selection: "Tommy Fleetwood",
        decimalOdds: 4.8,
        suggestedStakeAmount: 2.75,
        summary:
          "Reliable top-finish profile when long-iron play is dialled in, with enough Augusta suitability to stay around the top-10 line across four rounds.",
      },
      {
        rank: 3,
        market: "Top 10 Finish",
        selection: "Scottie Scheffler",
        decimalOdds: 1.9,
        suggestedStakeAmount: 1.75,
        summary:
          "Highest baseline consistency in the field and still useful in a top-10 structure, though short odds reduce upside compared with the top-ranked option.",
      },
    ],
    recommendedMarket: "Top 10 Finish",
    recommendedSelection: "Xander Schauffele",
    decimalOdds: 2.8,
    summary:
      "AI custom bet for Masters week 2026: a ranked Top 10 shortlist led by Xander Schauffele for payout durability, with Fleetwood and Scheffler retained as same-format alternatives.",
    analysisSummary:
      "The refreshed shortlist now keeps one coherent format across all three options: Top 10 Finish singles. Schauffele Top 10 remains ranked first because recent major-level ball-striking consistency gives the most reliable probability of payout in a week where leaderboard compression is likely. Fleetwood Top 10 sits second as the stronger value alternative when his long-iron game is stable. Scheffler Top 10 is intentionally ranked third because the probability is high but short pricing compresses upside. With current pot form holding up, the suggested total outlay is increased to GBP 10 to apply slightly more aggression while still keeping this as a controlled one-off position.",
    mediaSummary:
      "Latest market context keeps Scheffler as clear favourite, with McIlroy and DeChambeau in the main chase group and Rahm close behind. This update reflects major-week Augusta volatility, so the recommendation uses one Top 10 structure across the shortlist instead of mixing formats, making stake sizing cleaner and easier to execute against the current bankroll.",
    timelineTitle: "Custom Bet Ready",
    timelineDescription:
      "Masters 2026 shortlist refreshed: Schauffele, Fleetwood, and Scheffler Top 10.",
    generatedAtIso: "2026-04-07T07:52:42.000Z",
    eventStartIso: "2026-04-09T11:00:00.000Z",
    eventEndIso: "2026-04-12T22:00:00.000Z",
    suggestedStakeAmount: 10,
    cashoutLowerTarget:
      "Protect near-stake value if Schauffele is tracking inside the top-10 line heading into the back nine on Sunday and live pricing offers a controlled exit.",
    cashoutUpperTarget:
      "Take a stronger profit if he remains safely inside the top-10 band with a multi-shot buffer late in the final round.",
    noCashoutValue:
      "Let it run if his ball-striking remains stable through Amen Corner and the live position still supports the original top-10 edge.",
    cashoutAdvice: [
      "Prioritise position versus the top-10 cut line rather than leaderboard emotion; this market is about margin control, not only winning the tournament.",
      "If weather or pin setups become punitive, reduce exposure earlier because Augusta can swing quickly over a short stretch.",
      "If Schauffele is gaining strokes tee-to-green while holding a cushion to the line, avoid unnecessary early exits.",
    ],
    watchPoints: [
      "Monitor wind and firmness changes through rounds three and four; Augusta volatility can compress players around the top-10 boundary quickly.",
      "Track short-game sharpness on fast greens, especially from 6-12 feet where momentum swings are often decided.",
      "Watch for late leaderboard bunching that can reduce top-10 safety even when scoring appears steady.",
    ],
    riskFactors: [
      "Major-championship pressure can create abrupt scoring variance even for elite players.",
      "Top-10 markets can tighten rapidly in-play around key leaderboard clusters.",
      "Single-event golf exposure remains sensitive to putting variance over a small sample of rounds.",
    ],
    golf: {
      tournament: "The Masters Tournament",
      course: "Augusta National Golf Club",
      marketType: "Top 10 Finish",
      playerName: "Xander Schauffele",
      keyStats: [
        "High-end tee-to-green stability under major pressure supports a lower-volatility top-finish route.",
        "Bogey-avoidance and long-iron control profile fit Augusta's scoring stress points.",
        "Risk-managed format preference aligns with recent model-learning feedback after a full-loss matchday result.",
      ],
      fieldAngles: [
        "A modest 2026 Augusta setup extension increases the premium on controlled long-game execution.",
        "Major-week leaderboard bunching can punish short outright exposure; top-finish structures absorb that variance better.",
        "This shortlist ranks payout durability first inside one consistent market format.",
      ],
    },
  },
];
