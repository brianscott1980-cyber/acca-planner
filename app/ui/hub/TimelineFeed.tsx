import { ChevronRight } from "lucide-react";

type TimelineEntry = {
  title: string;
  dateRange: string;
  status: "win" | "loss";
  label: string;
  stake: string;
  odds?: string;
  returnValue: string;
  legs?: number;
  legTitle?: string;
  legSubtitle?: string;
  legOdds?: string;
};

const timelineEntries: TimelineEntry[] = [
  {
    title: "Gameweek 23",
    dateRange: "Feb 10 - Feb 12",
    status: "win",
    label: "Mid-Risk AI Pick",
    stake: "GBP 50.00",
    odds: "+450",
    returnValue: "GBP 275.00",
    legs: 4,
    legTitle: "Arsenal vs West Ham",
    legSubtitle: "Arsenal -1.5 Handicap",
    legOdds: "+110",
  },
  {
    title: "Gameweek 22",
    dateRange: "Jan 30 - Feb 1",
    status: "loss",
    label: "High-Risk AI Pick",
    stake: "GBP 50.00",
    returnValue: "GBP 0.00",
  },
];

export function TimelineFeed() {
  return (
    <section className="hub-wide">
      <div className="hub-page-copy">
        <h1 className="hub-title">Timeline</h1>
        <p className="hub-subtitle">
          Chronological record of all syndicate accumulator plays.
        </p>
      </div>

      <div className="hub-timeline">
        {timelineEntries.map((entry) => (
          <TimelineGameweek key={entry.title} entry={entry} />
        ))}
      </div>
    </section>
  );
}

function TimelineGameweek({ entry }: { entry: TimelineEntry }) {
  const isWin = entry.status === "win";

  return (
    <article className="hub-timeline-item">
      <div className={`hub-timeline-dot ${isWin ? "is-win" : "is-loss"}`} />
      <div className={`hub-timeline-card${isWin ? "" : " is-muted"}`}>
        <div className="hub-timeline-head">
          <div>
            <h2>{entry.title}</h2>
            <p>{entry.dateRange}</p>
          </div>
          <span className={`hub-outcome ${isWin ? "is-win" : "is-loss"}`}>
            {isWin ? "Won" : "Lost"}
          </span>
        </div>

        <div className="hub-badge-row">
          <span className={`hub-tag ${isWin ? "hub-tag-balanced" : "hub-tag-muted"}`}>
            {entry.label}
          </span>
          {entry.legs ? (
            <span className="hub-inline-meta">
              <ChevronRight size={14} />
              {entry.legs} legs
            </span>
          ) : null}
        </div>

        <div className={`hub-stat-grid${entry.odds ? "" : " is-compact"}`}>
          <div>
            <span className="hub-metric-label">Stake</span>
            <span className="hub-metric-value">{entry.stake}</span>
          </div>
          {entry.odds ? (
            <div>
              <span className="hub-metric-label">Odds</span>
              <span className="hub-metric-value hub-accent-text">{entry.odds}</span>
            </div>
          ) : null}
          <div>
            <span className="hub-metric-label">Return</span>
            <span
              className={`hub-metric-value ${
                isWin ? "hub-success-text" : ""
              }`}
            >
              {entry.returnValue}
            </span>
          </div>
        </div>

        {entry.legTitle ? (
          <div className="hub-leg-item">
            <div className="hub-leg-title">
              <span className={`hub-dot ${isWin ? "is-win" : "is-loss"}`} />
              <div>
                <p>{entry.legTitle}</p>
                <span>{entry.legSubtitle}</span>
              </div>
            </div>
            <span className="hub-inline-meta">{entry.legOdds}</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
