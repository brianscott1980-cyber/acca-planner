import { getPotTimelineSinceFirstStake } from "./ledgerService";

export function MiniSparkline() {
  const timeline = getPotTimelineSinceFirstStake();
  const { areaPath, linePath } = buildMiniSparklineGeometry(timeline);

  return (
    <svg
      className="hub-sparkline"
      viewBox="0 0 100 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={linePath}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d={areaPath}
        fill="url(#spark-gradient)"
        opacity="0.2"
      />
      <defs>
        <linearGradient id="spark-gradient" x1="50" x2="50" y1="4" y2="24">
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function buildMiniSparklineGeometry(
  timeline: ReturnType<typeof getPotTimelineSinceFirstStake>,
) {
  const chartBottom = 20;
  const chartTop = 4;

  if (timeline.length === 0) {
    return {
      linePath: `M0 ${chartBottom} L100 ${chartBottom}`,
      areaPath: `M0 ${chartBottom} L100 ${chartBottom} L100 24 L0 24 Z`,
    };
  }

  const values = timeline.map((point) => point.potValue);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 1);
  const valueRange = maxValue - minValue || 1;

  const points = timeline.map((point, index) => {
    const x = timeline.length === 1 ? 100 : (index / (timeline.length - 1)) * 100;
    const y =
      chartBottom -
      ((point.potValue - minValue) / valueRange) * (chartBottom - chartTop);

    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
    };
  });

  const linePath =
    points.length === 1
      ? `M0 ${points[0].y} L${points[0].x} ${points[0].y}`
      : buildSmoothLinePath(points);
  const areaPath = `${linePath} L100 24 L0 24 Z`;

  return {
    linePath,
    areaPath,
  };
}

function buildSmoothSegmentPath(
  points: Array<{ x: number; y: number }>,
  segmentIndex: number,
  includeMoveCommand: boolean,
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

  return `${includeMoveCommand ? `M${currentPoint.x},${currentPoint.y} ` : ""}C${controlPointOne.x.toFixed(2)},${controlPointOne.y.toFixed(2)} ${controlPointTwo.x.toFixed(2)},${controlPointTwo.y.toFixed(2)} ${nextPoint.x},${nextPoint.y}`;
}

function clampControlPointY(value: number, startY: number, endY: number) {
  const minY = Math.min(startY, endY);
  const maxY = Math.max(startY, endY);
  return Number(Math.min(maxY, Math.max(minY, value)).toFixed(2));
}

function buildSmoothLinePath(points: Array<{ x: number; y: number }>) {
  return points
    .slice(1)
    .map((_, index) => buildSmoothSegmentPath(points, index, index === 0))
    .join(" ");
}
