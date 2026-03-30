import { ConsensusPanel } from "../../ui/hub/ConsensusPanel";
import { GameweekBoard } from "../../ui/hub/GameweekBoard";

export default function DashboardPage() {
  return (
    <div className="hub-grid">
      <section className="hub-column-main">
        <GameweekBoard />
      </section>

      <aside className="hub-column-side">
        <ConsensusPanel />
      </aside>
    </div>
  );
}
