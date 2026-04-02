import type { ReactNode } from "react";
import { HubAppShell } from "../ui/hub/HubAppShell";
import { getSimulationUpdatedAtIso } from "../../repositories/leagueSimulationRepository";
import { AuthGate } from "../ui/auth/AuthGate";
import { LedgerProvider } from "../ui/hub/LedgerProvider";

type HubLayoutProps = {
  children: ReactNode;
};

export default function HubLayout({ children }: HubLayoutProps) {
  return (
    <AuthGate>
      <LedgerProvider>
        <HubAppShell key={getSimulationUpdatedAtIso()}>{children}</HubAppShell>
      </LedgerProvider>
    </AuthGate>
  );
}
