import { DashboardView } from "../../ui/hub/DashboardView";
import { GameWeekProvider } from "../../ui/hub/GameWeekProvider";

export default function DashboardPage() {
  return (
    <GameWeekProvider>
      <DashboardView />
    </GameWeekProvider>
  );
}
