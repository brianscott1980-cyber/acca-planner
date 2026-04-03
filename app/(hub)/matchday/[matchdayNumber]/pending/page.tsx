import { Suspense } from "react";
import {
  DashboardView,
  DashboardViewWithRouteGameWeekId,
} from "../../../../ui/hub/DashboardView";
import { GameWeekProvider } from "../../../../ui/hub/GameWeekProvider";
import {
  getStaticMatchdayNumberParams,
} from "../../../../../services/game_week_service";

export function generateStaticParams() {
  return getStaticMatchdayNumberParams();
}

export default async function MatchdayPendingPage({
  params,
}: {
  params: Promise<{ matchdayNumber: string }>;
}) {
  const { matchdayNumber } = await params;

  return (
    <Suspense
      fallback={
        <GameWeekProvider gameWeekId={matchdayNumber}>
          <DashboardView forcedViewState="locked" />
        </GameWeekProvider>
      }
    >
      <DashboardViewWithRouteGameWeekId
        routeGameWeekId={matchdayNumber}
        routeViewState="locked"
      />
    </Suspense>
  );
}
