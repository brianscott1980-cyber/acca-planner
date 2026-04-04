"use client";

import { useState, type CSSProperties } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { trackEvent } from "../../../lib/analytics";
import {
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
  getPotTimelineForRange,
  getLedgerSummary,
} from "../../../services/ledger_service";
import type { LedgerRange } from "../../../types/ledger_type";
import { LedgerActivityPanel } from "./LedgerActivityPanel";

export function LedgerOverview() {
  const ledgerSummary = getLedgerSummary();
  const [highlightedTransactionIds, setHighlightedTransactionIds] = useState<string[]>(
    [],
  );

  return (
    <section className="hub-wide hub-ledger">
      <PerformanceChart
        totalProfitOverall={ledgerSummary.totalProfitOverall}
        highlightedTransactionIds={highlightedTransactionIds}
        onHighlightTransactions={setHighlightedTransactionIds}
      />

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

        <LedgerActivityPanel
          highlightedTransactionIds={highlightedTransactionIds}
          onHighlightTransactions={setHighlightedTransactionIds}
        />
      </div>
    </section>
  );
}

function PerformanceChart({
  totalProfitOverall,
  highlightedTransactionIds,
  onHighlightTransactions,
}: {
  totalProfitOverall: number;
  highlightedTransactionIds: string[];
  onHighlightTransactions: (transactionIds: string[]) => void;
}) {
  const [selectedRange, setSelectedRange] = useState<LedgerRange>("2w");
  const [activeMarkerKey, setActiveMarkerKey] = useState<string | null>(null);
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
  const headlineToneClass =
    totalProfitOverall < 0 ? "hub-danger-text" : "hub-success-text";

  return (
    <div className="hub-chart-panel">
      <div className="hub-chart-head">
        <div>
          <p className="hub-label">Syndicate Performance Over Time</p>
          <div className="hub-chart-value-row">
            <h1 className={headlineToneClass}>
              {formatSignedCurrency(totalProfitOverall)}
            </h1>
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
              selectedRange === "all" ? " is-active" : ""
            }`}
            type="button"
            onClick={() => {
              trackEvent("select_ledger_range", { range: "all" });
              setSelectedRange("all");
            }}
          >
            All
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
          <defs>
            {chartGeometry.areaSegments.map((segment) => (
              <linearGradient
                key={segment.gradientId}
                id={segment.gradientId}
                gradientUnits="userSpaceOnUse"
                x1={segment.gradientX}
                y1={segment.gradientStartY}
                x2={segment.gradientX}
                y2={segment.gradientEndY}
              >
                <stop
                  offset="0%"
                  stopColor={segment.fillColor}
                  stopOpacity="0.22"
                />
                <stop
                  offset="42%"
                  stopColor={segment.fillColor}
                  stopOpacity="0"
                />
              </linearGradient>
            ))}
          </defs>
          {chartGeometry.areaSegments.map((segment) => (
            <path
              key={segment.key}
              d={segment.areaPath}
              fill={`url(#${segment.gradientId})`}
            />
          ))}
          {chartGeometry.lineSegments.map((segment) => (
            <path
              key={segment.key}
              d={segment.linePath}
              fill="none"
              stroke={segment.stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
          ))}
        </svg>
        {chartGeometry.eventMarkers.map((marker) =>
          activeMarkerKey === marker.key ||
          marker.transactionIds.some((id) => highlightedTransactionIds.includes(id)) ? (
            <span
              key={`${marker.key}-guide`}
              className="hub-chart-event-guide"
              style={{
                left: `${(marker.x / 1000) * 100}%`,
                top: `calc(${(marker.y / 300) * 100}% + 0.55rem)`,
                "--hub-chart-event-color": marker.color,
              } as CSSProperties}
              aria-hidden="true"
            />
          ) : null,
        )}
        {chartGeometry.eventMarkers.map((marker) => (
          <button
            key={marker.key}
            className={`hub-chart-event-button${
              activeMarkerKey === marker.key ||
              marker.transactionIds.some((id) => highlightedTransactionIds.includes(id))
                ? " is-active"
                : ""
            }`}
            type="button"
            style={{
              left: `${(marker.x / 1000) * 100}%`,
              top: `${(marker.y / 300) * 100}%`,
              "--hub-chart-event-color": marker.color,
            } as CSSProperties}
            onMouseEnter={() => {
              setActiveMarkerKey(marker.key);
              onHighlightTransactions(marker.transactionIds);
            }}
            onMouseLeave={() => {
              setActiveMarkerKey((current) =>
                current === marker.key ? null : current,
              );
              onHighlightTransactions([]);
            }}
            onFocus={() => {
              setActiveMarkerKey(marker.key);
              onHighlightTransactions(marker.transactionIds);
            }}
            onBlur={() => {
              setActiveMarkerKey((current) =>
                current === marker.key ? null : current,
              );
              onHighlightTransactions([]);
            }}
            onClick={() =>
              {
                setActiveMarkerKey((current) => {
                  const nextKey = current === marker.key ? null : marker.key;
                  onHighlightTransactions(
                    nextKey ? marker.transactionIds : [],
                  );
                  return nextKey;
                });
              }
            }
            aria-label={`${marker.eventTitle}: ${formatSignedCurrency(marker.changeAmount)}`}
          >
            <span className="hub-chart-event-dot" aria-hidden="true" />
            {activeMarkerKey === marker.key ||
            marker.transactionIds.some((id) => highlightedTransactionIds.includes(id)) ? (
              <span className="hub-chart-event-tooltip" role="tooltip">
                <strong>{marker.eventTitle}</strong>
                <span>{formatSignedCurrency(marker.changeAmount)}</span>
              </span>
            ) : null}
          </button>
        ))}
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
      areaSegments: [] as Array<{
        key: string;
        areaPath: string;
        fillColor: string;
        gradientId: string;
        gradientX: number;
        gradientStartY: number;
        gradientEndY: number;
      }>,
      lineSegments: [] as Array<{ key: string; linePath: string; stroke: string }>,
      eventMarkers: [] as Array<{
        key: string;
        x: number;
        y: number;
        color: string;
        eventTitle: string;
        changeAmount: number;
        transactionIds: string[];
      }>,
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
  const segmentColors: Array<{ stroke: string; fill: string }> = [];

  linePoints.slice(1).forEach((_, index) => {
    segmentColors.push(
      getLedgerSegmentColor(
        getTimelineChangeForSegment(timeline, points.length, index),
        index === 0 ? null : segmentColors[index - 1],
      ),
    );
  });
  const areaSegments = linePoints.flatMap((point, index) => {
    if (index === 0) {
      return [];
    }

    const previousPoint = linePoints[index - 1];
    const segmentColor = segmentColors[index - 1];
    const horizontalWidth = Math.max(1, point.x - previousPoint.x);
    const sliceCount = Math.max(1, Math.ceil(horizontalWidth / 3));
    const fillDepth = 108;

    return Array.from({ length: sliceCount }, (_, sliceIndex) => {
      const startProgress = sliceIndex / sliceCount;
      const endProgress = (sliceIndex + 1) / sliceCount;
      const x1 = previousPoint.x + (point.x - previousPoint.x) * startProgress;
      const y1 = previousPoint.y + (point.y - previousPoint.y) * startProgress;
      const x2 = previousPoint.x + (point.x - previousPoint.x) * endProgress;
      const y2 = previousPoint.y + (point.y - previousPoint.y) * endProgress;
      const gradientStartY = Number(((y1 + y2) / 2).toFixed(2));

      return {
        key: `area-${index - 1}-${sliceIndex}`,
        areaPath: `M${x1.toFixed(2)},${y1.toFixed(2)} L${x2.toFixed(2)},${y2.toFixed(2)} L${x2.toFixed(2)},${Math.min(y2 + fillDepth, 300).toFixed(2)} L${x1.toFixed(2)},${Math.min(y1 + fillDepth, 300).toFixed(2)} Z`,
        fillColor: segmentColor.fill,
        gradientId: `ledger-fill-${index - 1}-${sliceIndex}`,
        gradientX: Number((((x1 + x2) / 2)).toFixed(2)),
        gradientStartY,
        gradientEndY: Number((Math.min(gradientStartY + fillDepth, 300)).toFixed(2)),
      };
    });
  });
  const lineSegments = linePoints.slice(1).map((point, index) => {
    const segmentColor = segmentColors[index];

    return {
      key: `line-${index}`,
      linePath: buildSmoothSegmentPath(linePoints, index),
      stroke: segmentColor.stroke,
    };
  });
  const eventMarkers = points
    .map((point, index) => {
      const changeAmount = timeline[index]?.changeAmount ?? 0;

      if (changeAmount === 0) {
        return null;
      }

      return {
        key: `event-${index}`,
        x: point.x,
        y: point.y,
        color:
          segmentColors[index]?.stroke ??
          segmentColors[index - 1]?.stroke ??
          "var(--hub-primary)",
        eventTitle: timeline[index]?.eventTitle ?? "Ledger event",
        changeAmount,
        transactionIds: timeline[index]?.eventTransactionIds ?? [],
      };
    })
    .filter((marker) => marker !== null);

  return {
    areaSegments,
    lineSegments,
    eventMarkers,
  };
}

function getTimelineChangeForSegment(
  timeline: ReturnType<typeof getPotTimelineForRange>,
  pointCount: number,
  segmentIndex: number,
) {
  if (pointCount <= 1) {
    return timeline[0]?.changeAmount ?? 0;
  }

  return timeline[segmentIndex + 1]?.changeAmount ?? 0;
}

function getLedgerSegmentColor(
  changeAmount: number,
  previousColor: { stroke: string; fill: string } | null,
) {
  const defaultPositiveColor = {
    stroke: "#10b981",
    fill: "rgba(16, 185, 129, 1)",
  };

  if (changeAmount < 0) {
    return {
      stroke: "#ef4444",
      fill: "rgba(239, 68, 68, 1)",
    };
  }

  if (changeAmount > 0) {
    return defaultPositiveColor;
  }

  return previousColor ?? defaultPositiveColor;
}

function buildSmoothSegmentPath(
  points: Array<{ x: number; y: number }>,
  segmentIndex: number,
) {
  const currentPoint = points[segmentIndex];
  const nextPoint = points[segmentIndex + 1];
  const previousPoint = points[segmentIndex - 1] ?? currentPoint;
  const followingPoint = points[segmentIndex + 2] ?? nextPoint;
  const smoothing = 0.85 / 6;
  const controlPointOne = {
    x: currentPoint.x + (nextPoint.x - previousPoint.x) * smoothing,
    y: clampControlPointY(
      currentPoint.y + (nextPoint.y - previousPoint.y) * smoothing,
      currentPoint.y,
      nextPoint.y,
    ),
  };
  const controlPointTwo = {
    x: nextPoint.x - (followingPoint.x - currentPoint.x) * smoothing,
    y: clampControlPointY(
      nextPoint.y - (followingPoint.y - currentPoint.y) * smoothing,
      currentPoint.y,
      nextPoint.y,
    ),
  };

  return `M${currentPoint.x},${currentPoint.y} C${controlPointOne.x.toFixed(2)},${controlPointOne.y.toFixed(2)} ${controlPointTwo.x.toFixed(2)},${controlPointTwo.y.toFixed(2)} ${nextPoint.x},${nextPoint.y}`;
}

function clampControlPointY(value: number, startY: number, endY: number) {
  const minY = Math.min(startY, endY);
  const maxY = Math.max(startY, endY);
  return Number(Math.min(maxY, Math.max(minY, value)).toFixed(2));
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
    range === "all"
      ? "all time"
      : range === "1w"
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
      <h2 className="hub-success-text">{value}</h2>
    </section>
  );
}
