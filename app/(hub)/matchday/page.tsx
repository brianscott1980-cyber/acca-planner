import { Suspense } from "react";
import {
  DashboardView,
  DashboardViewWithSearchParams,
} from "../../ui/hub/DashboardView";
import { GameWeekProvider } from "../../ui/hub/GameWeekProvider";

export default function MatchdayPage() {
  return (
    <Suspense
      fallback={
        <GameWeekProvider>
          <DashboardView />
        </GameWeekProvider>
      }
    >
        <DashboardViewWithSearchParams />
    </Suspense>
  );
}
