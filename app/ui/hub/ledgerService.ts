import {
  ledgerData,
  type LedgerTransactionRecord,
} from "../../../data/ledgerData";
import { getMemberCount } from "../../../repositories/userService";
import { getSimulatedNow } from "../../../repositories/leagueSimulationRepository";

export type LedgerActivity = {
  id: string;
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
  changeAmount: number;
  eventTitle: string | null;
  eventTransactionIds: string[];
};

export type LedgerRange = "1w" | "2w" | "1m" | "all";

export function getLedgerSummary() {
  const memberCount = getMemberCount();
  const totalDeposits = roundCurrency(
    ledgerData
      .filter((entry) => entry.kind === "deposit")
      .reduce((sum, entry) => sum + entry.amount, 0),
  );
  const totalProfitOverall = roundCurrency(
    ledgerData
      .filter((entry) => entry.kind !== "deposit")
      .reduce((sum, entry) => sum + entry.amount, 0),
  );
  const currentPot = roundCurrency(totalDeposits + totalProfitOverall);
  const sharePerMember =
    memberCount === 0 ? 0 : roundCurrency(currentPot / memberCount);
  const roiPercentage =
    totalDeposits === 0 ? 0 : (totalProfitOverall / totalDeposits) * 100;

  return {
    currentPot,
    sharePerMember,
    roiPercentage,
    memberCount,
    initialPotTotal: getInitialPotTotal(),
    totalDeposits,
    totalProfitOverall,
  };
}

export function getRecentLedgerActivity(limit?: number) {
  const normalizedActivity = [...ledgerData]
    .sort(
      (left, right) =>
        new Date(right.dateIso).getTime() - new Date(left.dateIso).getTime(),
    )
    .map(normalizeLedgerActivity);

  if (typeof limit === "number") {
    return normalizedActivity.slice(0, limit);
  }

  return normalizedActivity;
}

export function getPotTimelineForRange(
  range: LedgerRange,
  today: Date = getSimulatedNow(),
) {
  if (range === "all") {
    return getPotTimelineSinceFirstStake(today);
  }

  const rangeStart = getRangeStart(today, range);
  return getPotTimelineFromDate(rangeStart, today);
}

export function getPotTimelineSinceFirstStake(today: Date = getSimulatedNow()) {
  const firstStakeEntry = [...ledgerData]
    .filter((entry) => entry.kind === "stake")
    .sort(
      (left, right) =>
        new Date(left.dateIso).getTime() - new Date(right.dateIso).getTime(),
    )[0];

  if (!firstStakeEntry) {
    return getPotTimelineFromDate(getEarliestLedgerDate(today), today);
  }

  return getPotTimelineFromDate(new Date(firstStakeEntry.dateIso), today);
}

function getPotTimelineFromDate(rangeStart: Date, today: Date) {
  const rangeStartKey = formatDateKey(rangeStart);
  const todayKey = formatDateKey(today);

  const groupedByDate = new Map<
    string,
    { amount: number; titles: string[]; transactionIds: string[] }
  >();
  const sortedEntries = [...ledgerData].sort(
    (left, right) =>
      new Date(left.dateIso).getTime() - new Date(right.dateIso).getTime(),
  );

  let openingPot = 0;

  for (const entry of sortedEntries) {
    const dateKey = toDateKey(entry.dateIso);

    if (dateKey < rangeStartKey) {
      openingPot = roundCurrency(openingPot + entry.amount);
      continue;
    }

    if (dateKey > todayKey) {
      continue;
    }

    if (entry.kind === "deposit") {
      continue;
    }

    const currentValue = groupedByDate.get(dateKey) ?? {
      amount: 0,
      titles: [],
      transactionIds: [],
    };
    groupedByDate.set(dateKey, {
      amount: roundCurrency(currentValue.amount + entry.amount),
      titles: [...currentValue.titles, entry.title],
      transactionIds: [...currentValue.transactionIds, entry.id],
    });
  }

  const timeline: PotTimelinePoint[] = [];
  let runningPot = openingPot;
  let cursor = rangeStart;

  while (formatDateKey(cursor) <= todayKey) {
    const dateKey = formatDateKey(cursor);
    const dayEntry = groupedByDate.get(dateKey) ?? {
      amount: 0,
      titles: [],
      transactionIds: [],
    };
    const dayAmount = dayEntry.amount;
    runningPot = roundCurrency(runningPot + dayAmount);

    timeline.push({
      date: dateKey,
      label: formatChartDateLabel(dateKey),
      potValue: runningPot,
      changeAmount: dayAmount,
      eventTitle:
        dayEntry.titles.length === 0
          ? null
          : dayEntry.titles.length === 1
            ? dayEntry.titles[0]
            : `${dayEntry.titles.length} events`,
      eventTransactionIds: dayEntry.transactionIds,
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

function normalizeLedgerActivity(entry: LedgerTransactionRecord): LedgerActivity {
  return {
    id: entry.id,
    title: entry.title,
    date: formatLedgerActivityDate(entry.dateIso),
    amount: entry.amount,
    tone: entry.amount >= 0 ? "positive" : "negative",
    kind: entry.kind,
  };
}

function getInitialPotTotal() {
  const depositEntries = ledgerData.filter((entry) => entry.kind === "deposit");

  if (depositEntries.length === 0) {
    return 0;
  }

  const firstDepositDateKey = depositEntries
    .map((entry) => toDateKey(entry.dateIso))
    .sort()[0];

  return roundCurrency(
    depositEntries
      .filter((entry) => toDateKey(entry.dateIso) === firstDepositDateKey)
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

function getEarliestLedgerDate(fallbackDate: Date) {
  const sortedEntries = [...ledgerData].sort(
    (left, right) =>
      new Date(left.dateIso).getTime() - new Date(right.dateIso).getTime(),
  );

  return sortedEntries[0] ? new Date(sortedEntries[0].dateIso) : fallbackDate;
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

function formatLedgerActivityDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
