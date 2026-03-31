# Scripts

Utility scripts in this folder are intended to:

- generate and refresh mocked data files in this repo
- scrape or fetch external assets into repo-owned static folders

## Premier League club data

The first utility is a Premier League club data generator. It:

- downloads a small badge image for each current Premier League club
- writes the images into `public/assets/clubs/premier-league`
- generates `data/premierLeagueClubs.ts`

Run it with:

```bash
npm run generate:pl-clubs
```

Notes:

- the script uses live network requests when run
- it is safe to rerun; it overwrites the generated data file and badge assets
- it currently uses TheSportsDB badge URLs as small club badge sources
