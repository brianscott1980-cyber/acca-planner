import type { ReactNode } from "react";
import { HubAppShell } from "../ui/hub/HubAppShell";
import { getSimulationUpdatedAtIso } from "../../repositories/leagueSimulationRepository";

type HubLayoutProps = {
  children: ReactNode;
};

export default function HubLayout({ children }: HubLayoutProps) {
  return <HubAppShell key={getSimulationUpdatedAtIso()}>{children}</HubAppShell>;
}
