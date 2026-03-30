import { getPotTimelineForRange } from "./ledgerService";

export function MiniSparkline() {
  const timeline = getPotTimelineForRange("1m", new Date());
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
  timeline: ReturnType<typeof getPotTimelineForRange>,
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

    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  const linePath =
    points.length === 1
      ? `M0 ${points[0].split(" ")[1]} L${points[0]}`
      : `M${points.join(" L")}`;
  const areaPath = `${linePath} L100 24 L0 24 Z`;

  return {
    linePath,
    areaPath,
  };
}
