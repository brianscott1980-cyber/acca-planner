"use client";

import { useState } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { trackEvent } from "../../../lib/analytics";
import {
  formatCurrency,
  formatPercent,
  getPotTimelineForRange,
  getLedgerSummary,
  type LedgerRange,
} from "./ledgerService";
import { LedgerActivityPanel } from "./LedgerActivityPanel";

export function LedgerOverview() {
  const ledgerSummary = getLedgerSummary();

  return (
    <section className="hub-wide hub-ledger">
      <PerformanceChart roiPercentage={ledgerSummary.roiPercentage} />

      <div className="hub-ledger-grid">
        <div className="hub-summary-stack">
          <SummaryCard
            label="Current Bankroll"
            value={formatCurrency(ledgerSummary.currentPot)}
          />
          <SummaryCard
            label="Share Per Member"
            value={formatCurrency(ledgerSummary.sharePerMember, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          />
        </div>

        <LedgerActivityPanel />
      </div>
    </section>
  );
}

function PerformanceChart({
  roiPercentage,
}: {
  roiPercentage: number;
}) {
  const [selectedRange, setSelectedRange] = useState<LedgerRange>("1m");
  const potTimeline = getPotTimelineForRange(selectedRange);
  const chartGeometry = buildChartGeometry(potTimeline);
  const axisPoints = buildAxisPoints(potTimeline);
  const rangeChange = getRangeChangeSummary(potTimeline, selectedRange);
  const RangeChangeIcon =
    rangeChange.direction === "positive"
      ? TrendingUp
      : rangeChange.direction === "negative"
        ? TrendingDown
        : Minus;

  return (
    <div className="hub-chart-panel">
      <div className="hub-chart-head">
        <div>
          <p className="hub-label">Syndicate Performance Over Time</p>
          <div className="hub-chart-value-row">
            <h1>{formatPercent(roiPercentage)}</h1>
            <span
              className={
                rangeChange.direction === "positive"
                  ? "hub-success-text"
                  : rangeChange.direction === "negative"
                    ? "hub-danger-text"
                    : ""
              }
            >
              <RangeChangeIcon size={16} />
              {rangeChange.label}
            </span>
          </div>
        </div>

        <div className="hub-range-switcher">
          <button
            className={`hub-range-button${
              selectedRange === "1w" ? " is-active" : ""
            }`}
            type="button"
            onClick={() => {
              trackEvent("select_ledger_range", { range: "1w" });
              setSelectedRange("1w");
            }}
          >
            1W
          </button>
          <button
            className={`hub-range-button${
              selectedRange === "2w" ? " is-active" : ""
            }`}
            type="button"
            onClick={() => {
              trackEvent("select_ledger_range", { range: "2w" });
              setSelectedRange("2w");
            }}
          >
            2W
          </button>
          <button
            className={`hub-range-button${
              selectedRange === "1m" ? " is-active" : ""
            }`}
            type="button"
            onClick={() => {
              trackEvent("select_ledger_range", { range: "1m" });
              setSelectedRange("1m");
            }}
          >
            1M
          </button>
        </div>
      </div>

      <div className="hub-chart-wrap">
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
          <line
            x1="0"
            x2="1000"
            y1="250"
            y2="250"
            stroke="var(--hub-border)"
            strokeDasharray="4"
          />
          <line
            x1="0"
            x2="1000"
            y1="175"
            y2="175"
            stroke="var(--hub-border)"
            strokeDasharray="4"
          />
          <line
            x1="0"
            x2="1000"
            y1="100"
            y2="100"
            stroke="var(--hub-border)"
            strokeDasharray="4"
          />
          <path
            d={chartGeometry.areaPath}
            fill="url(#ledger-fill)"
            fillOpacity="0.18"
          />
          <path
            d={chartGeometry.linePath}
            fill="none"
            stroke="var(--hub-primary)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          {chartGeometry.lastPoint ? (
            <circle
              cx={chartGeometry.lastPoint.x}
              cy={chartGeometry.lastPoint.y}
              r="6"
              fill="var(--hub-primary)"
            />
          ) : null}
          <defs>
            <linearGradient id="ledger-fill" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="var(--hub-primary)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className={`hub-axis${axisPoints.length === 1 ? " is-single" : ""}`}>
        {axisPoints.map((point) => (
          <span key={point.date}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}

function buildChartGeometry(timeline: ReturnType<typeof getPotTimelineForRange>) {
  const chartBottom = 280;
  const chartTop = 20;

  if (timeline.length === 0) {
    return {
      linePath: `M0,${chartBottom} L1000,${chartBottom}`,
      areaPath: `M0,${chartBottom} L1000,${chartBottom} L1000,300 L0,300 Z`,
      lastPoint: null as null | { x: number; y: number },
    };
  }

  const values = timeline.map((point) => point.potValue);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 1);
  const valueRange = maxValue - minValue || 1;

  const points = timeline.map((point, index) => {
    const x =
      timeline.length === 1 ? 1000 : (index / (timeline.length - 1)) * 1000;
    const y =
      chartBottom -
      ((point.potValue - minValue) / valueRange) * (chartBottom - chartTop);

    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
    };
  });

  const linePoints =
    points.length === 1 ? [{ x: 0, y: points[0].y }, points[0]] : points;

  const linePath = linePoints
    .map((point, index) =>
      `${index === 0 ? "M" : "L"}${point.x},${point.y}`,
    )
    .join(" ");
  const areaPath = `${linePath} L${linePoints[linePoints.length - 1].x},300 L${
    linePoints[0].x
  },300 Z`;

  return {
    linePath,
    areaPath,
    lastPoint: points[points.length - 1],
  };
}

function buildAxisPoints(timeline: ReturnType<typeof getPotTimelineForRange>) {
  if (timeline.length <= 6) {
    return timeline;
  }

  const targetCount = 6;
  const lastIndex = timeline.length - 1;
  const step = lastIndex / (targetCount - 1);

  return Array.from({ length: targetCount }, (_, index) => {
    const pointIndex =
      index === targetCount - 1 ? lastIndex : Math.round(index * step);
    return timeline[pointIndex];
  });
}

function getRangeChangeSummary(
  timeline: ReturnType<typeof getPotTimelineForRange>,
  range: LedgerRange,
) {
  const firstPoint = timeline[0];
  const lastPoint = timeline[timeline.length - 1];
  const rangeLabel =
    range === "1w"
      ? "this week"
      : range === "2w"
        ? "past 2 weeks"
        : "past month";

  if (!firstPoint || !lastPoint || firstPoint.potValue === 0) {
    return {
      direction: "neutral" as const,
      label: `0.0% ${rangeLabel}`,
    };
  }

  const changePercent =
    ((lastPoint.potValue - firstPoint.potValue) / firstPoint.potValue) * 100;

  return {
    direction:
      changePercent > 0
        ? ("positive" as const)
        : changePercent < 0
          ? ("negative" as const)
          : ("neutral" as const),
    label: `${formatPercent(changePercent)} ${rangeLabel}`,
  };
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <section className="hub-panel hub-summary-card">
      <p className="hub-label">{label}</p>
      <h2>{value}</h2>
    </section>
  );
}
