import type { ReactNode } from "react";
import { HubAppShell } from "../ui/hub/HubAppShell";

type HubLayoutProps = {
  children: ReactNode;
};

export default function HubLayout({ children }: HubLayoutProps) {
  return <HubAppShell>{children}</HubAppShell>;
}
