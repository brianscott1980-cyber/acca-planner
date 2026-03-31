import { getMemberCount, getMembers } from "../../../repositories/userService";

export type LedgerActivity = {
  title: string;
  date: string;
  amount: number;
  tone: "positive" | "negative";
  kind: "deposit" | "stake" | "settlement";
};

export type PotTimelinePoint = {
  date: string;
  label: string;
  potValue: number;
};

export type LedgerRange = "1w" | "2w" | "1m";

type LedgerSnapshot = {
  totalProfitOverall: number;
  recentActivity: LedgerActivity[];
};

const memberDepositEntries: LedgerActivity[] = getMembers().map((member) => ({
  title: member.displayName,
  date: "Mar 23, 2026",
  amount: 10,
  tone: "positive",
  kind: "deposit",
}));

const ledgerSnapshot: LedgerSnapshot = {
  totalProfitOverall: 0,
  recentActivity: memberDepositEntries,
};

export function getLedgerSummary() {
  const memberCount = getMemberCount();
  const initialPotTotal = getInitialPotTotal();
  const totalDeposits = roundCurrency(
    ledgerSnapshot.recentActivity
      .filter((entry) => entry.kind === "deposit")
      .reduce((sum, entry) => sum + entry.amount, 0),
  );
  const currentPot = roundCurrency(
    totalDeposits + ledgerSnapshot.totalProfitOverall,
  );
  const sharePerMember =
    memberCount === 0 ? 0 : roundCurrency(currentPot / memberCount);
  const roiPercentage =
    totalDeposits === 0
      ? 0
      : (ledgerSnapshot.totalProfitOverall / totalDeposits) * 100;

  return {
    currentPot,
    sharePerMember,
    roiPercentage,
    memberCount,
    initialPotTotal,
    totalDeposits,
    totalProfitOverall: ledgerSnapshot.totalProfitOverall,
  };
}

export function getRecentLedgerActivity(limit?: number) {
  const normalizedActivity = ledgerSnapshot.recentActivity.map(normalizeLedgerActivity);

  if (typeof limit === "number") {
    return normalizedActivity.slice(0, limit);
  }

  return normalizedActivity;
}

export function getPotTimelineForRange(
  range: LedgerRange,
  today: Date = new Date(),
) {
  const rangeStart = getRangeStart(today, range);
  const rangeStartKey = formatDateKey(rangeStart);
  const todayKey = formatDateKey(today);

  const groupedByDate = new Map<string, number>();
  const sortedEntries = [...ledgerSnapshot.recentActivity].sort(
    (left, right) =>
      new Date(left.date).getTime() - new Date(right.date).getTime(),
  );

  let openingPot = 0;

  for (const entry of sortedEntries) {
    const dateKey = toDateKey(entry.date);

    if (dateKey < rangeStartKey) {
      openingPot = roundCurrency(openingPot + entry.amount);
      continue;
    }

    if (dateKey > todayKey) {
      continue;
    }

    const currentValue = groupedByDate.get(dateKey) ?? 0;
    groupedByDate.set(dateKey, roundCurrency(currentValue + entry.amount));
  }

  const timeline: PotTimelinePoint[] = [];
  let runningPot = openingPot;
  let cursor = rangeStart;

  while (formatDateKey(cursor) <= todayKey) {
    const dateKey = formatDateKey(cursor);
    const dayAmount = groupedByDate.get(dateKey) ?? 0;
    runningPot = roundCurrency(runningPot + dayAmount);

    timeline.push({
      date: dateKey,
      label: formatChartDateLabel(dateKey),
      potValue: runningPot,
    });

    cursor = addDays(cursor, 1);
  }

  return timeline;
}

export function formatCurrency(
  value: number,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatSignedCurrency(value: number) {
  const amount = formatCurrency(Math.abs(value), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${value >= 0 ? "+" : "-"}${amount}`;
}

export function formatPercent(value: number) {
  const amount = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(value));

  return `${value >= 0 ? "+" : "-"}${amount}%`;
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function normalizeLedgerActivity(entry: LedgerActivity) {
  return {
    ...entry,
    tone: entry.amount >= 0 ? "positive" : "negative",
  } as LedgerActivity;
}

function getInitialPotTotal() {
  const depositEntries = ledgerSnapshot.recentActivity.filter(
    (entry) => entry.kind === "deposit",
  );

  if (depositEntries.length === 0) {
    return 0;
  }

  const firstDepositDateKey = depositEntries
    .map((entry) => toDateKey(entry.date))
    .sort()[0];

  return roundCurrency(
    depositEntries
      .filter((entry) => toDateKey(entry.date) === firstDepositDateKey)
      .reduce((sum, entry) => sum + entry.amount, 0),
  );
}

function toDateKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function formatDateKey(value: Date) {
  return new Date(
    Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()),
  )
    .toISOString()
    .slice(0, 10);
}

function addDays(value: Date, days: number) {
  const next = new Date(
    Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()),
  );
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function getRangeStart(today: Date, range: LedgerRange) {
  const normalizedToday = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  if (range === "1w") {
    return addDays(normalizedToday, -6);
  }

  if (range === "2w") {
    return addDays(normalizedToday, -13);
  }

  return addDays(normalizedToday, -29);
}

function formatChartDateLabel(dateKey: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  })
    .format(new Date(dateKey))
    .toUpperCase();
}
