import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import {
  DashboardView,
  DashboardViewWithRouteGameWeekId,
} from "../../../ui/hub/DashboardView";
import { GameWeekProvider } from "../../../ui/hub/GameWeekProvider";
import {
  getAccessibleGameWeekById,
  getGameWeekIdFromMatchdayNumber,
  getMatchdayHref,
  getStaticMatchdayNumberParams,
} from "../../../../repositories/gameWeekRepository";

export function generateStaticParams() {
  return getStaticMatchdayNumberParams();
}

export default async function MatchdayNumberPage({
  params,
}: {
  params: Promise<{ matchdayNumber: string }>;
}) {
  const { matchdayNumber } = await params;
  const gameWeekId = getGameWeekIdFromMatchdayNumber(matchdayNumber);

  if (!gameWeekId) {
    notFound();
  }

  const accessibleGameWeek = getAccessibleGameWeekById(gameWeekId);

  if (accessibleGameWeek && accessibleGameWeek.id !== gameWeekId) {
    redirect(
      getMatchdayHref({
        gameWeekId: accessibleGameWeek.id,
      }),
    );
  }

  return (
    <Suspense
      fallback={
        <GameWeekProvider gameWeekId={gameWeekId}>
          <DashboardView />
        </GameWeekProvider>
      }
    >
      <DashboardViewWithRouteGameWeekId routeGameWeekId={gameWeekId} />
    </Suspense>
  );
}
