import { ConsensusPanel } from "../../ui/hub/ConsensusPanel";
import { GameweekBoard } from "../../ui/hub/GameweekBoard";
import { GameWeekProvider } from "../../ui/hub/GameWeekProvider";

export default function DashboardPage() {
  return (
    <GameWeekProvider>
      <div className="hub-grid">
        <section className="hub-column-main">
          <GameweekBoard />
        </section>

        <aside className="hub-column-side">
          <ConsensusPanel />
        </aside>
      </div>
    </GameWeekProvider>
  );
}
