"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  History,
  LayoutDashboard,
  Sparkles,
  Wallet,
} from "lucide-react";
import {
  formatCurrency,
  formatPercent,
  getLedgerSummary,
} from "./ledgerService";
import { MiniSparkline } from "./MiniSparkline";
import { getSimulatedNow } from "../../../repositories/leagueSimulationRepository";
import {
  getMemberCount,
  getUserInitials,
} from "../../../repositories/userService";
import { getLoggedInUser } from "../../../repositories/authenticationService";
import { getCurrentMatchdayNumber } from "../../../repositories/gameWeekRepository";
import { trackEvent } from "../../../lib/analytics";

type HubAppShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/matchday", label: "Matchday", icon: LayoutDashboard },
  { href: "/timeline", label: "Timeline", icon: History },
  { href: "/ledger", label: "Ledger", icon: Wallet },
];

export function HubAppShell({ children }: HubAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const ledgerSummary = getLedgerSummary();
  const currentUser = getLoggedInUser();
  const equityShare = 100 / getMemberCount();
  const equityShareValue =
    ledgerSummary.memberCount === 0
      ? 0
      : ledgerSummary.currentPot / ledgerSummary.memberCount;
  const simulatedNow = getSimulatedNow();
  const currentMatchdayNumber = getCurrentMatchdayNumber();
  const navigateToLedgerFromHeader = (source: string) => {
    trackEvent("navigate_ledger_from_header", { source });
    router.push("/ledger");
  };

  return (
    <div className="hub-shell">
      <aside className="hub-sidebar">
        <div className="hub-brand">
          <div className="hub-brand-mark">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="hub-brand-title">Caddyshack</p>
            <p className="hub-brand-subtitle">AI betting hub</p>
          </div>
          {currentUser ? (
            <div
              className="hub-mobile-user-avatar"
              aria-label={`Logged in as ${currentUser.displayName}`}
              title={currentUser.displayName}
            >
              {getUserInitials(currentUser.displayName)}
            </div>
          ) : null}
        </div>

        <nav className="hub-nav" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveNavItem(pathname, item.href);

            return (
              <Link
                key={item.href}
                className={`hub-nav-item${active ? " is-active" : ""}`}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() =>
                  trackEvent("navigate_section", {
                    section: item.label.toLowerCase(),
                    destination_path: item.href,
                  })
                }
              >
                <span className="hub-nav-icon">
                  <Icon size={18} />
                </span>
                <span>{item.label}</span>
                {item.href === "/matchday" && currentMatchdayNumber ? (
                  <span className="hub-nav-pill">{currentMatchdayNumber}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {currentUser ? (
          <div className="hub-profile">
            <div className="hub-avatar">
              {getUserInitials(currentUser.displayName)}
            </div>
            <div>
              <p className="hub-profile-name">{currentUser.displayName}</p>
              <p className="hub-profile-meta">Eq: {equityShare.toFixed(1)}%</p>
            </div>
          </div>
        ) : null}
      </aside>

      <div className="hub-main">
        <header className="hub-header">
          <div className="hub-header-group">
            <button
              className="hub-header-stat"
              type="button"
              onClick={() => navigateToLedgerFromHeader("current_pot")}
            >
              <p className="hub-label">Current Pot</p>
              <p className="hub-pot-value">
                {formatCurrency(ledgerSummary.currentPot)}
              </p>
            </button>
            <div className="hub-divider" />
            <button
              className="hub-header-stat hub-roi"
              type="button"
              onClick={() => navigateToLedgerFromHeader("season_roi")}
            >
              <p className="hub-label">Season ROI</p>
              <div className="hub-roi-row">
                <span className="hub-roi-value">
                  {formatPercent(ledgerSummary.roiPercentage)}
                </span>
                <MiniSparkline />
              </div>
            </button>
            {currentUser ? (
              <>
                <div className="hub-divider" />
                <button
                  className="hub-header-stat"
                  type="button"
                  onClick={() => navigateToLedgerFromHeader("your_share")}
                >
                  <p className="hub-label">Your Share</p>
                  <p className="hub-pot-value">
                    {formatCurrency(equityShareValue, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </button>
              </>
            ) : null}
          </div>

          <div className="hub-header-datetime" aria-label="Current simulated date and time">
            <p className="hub-label">Current Time</p>
            <p className="hub-header-datetime-value">
              {formatHeaderDateTime(simulatedNow)}
            </p>
          </div>
        </header>

        <main className="hub-content">{children}</main>
      </div>
    </div>
  );
}

function isActiveNavItem(pathname: string, href: string) {
  const normalizedPathname = normalizePath(pathname);
  const normalizedHref = normalizePath(href);

  if (normalizedHref === "/matchday" && normalizedPathname === "/") {
    return true;
  }

  if (normalizedHref === "/matchday" && normalizedPathname === "/dashboard") {
    return true;
  }

  return (
    normalizedPathname === normalizedHref ||
    normalizedPathname.startsWith(`${normalizedHref}/`)
  );
}

function normalizePath(value: string) {
  if (!value || value === "/") {
    return "/";
  }

  return value.replace(/\/+$/, "");
}

function formatHeaderDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
    timeZoneName: "short",
  }).format(value);
}
