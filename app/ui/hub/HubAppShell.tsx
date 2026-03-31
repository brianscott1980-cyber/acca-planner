"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import {
  getMemberCount,
  getUserInitials,
} from "../../../repositories/userService";
import { getLoggedInUser } from "../../../repositories/authenticationService";
import { getCurrentMatchdayNumber } from "../../../repositories/gameWeekRepository";

type HubAppShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Matchday", icon: LayoutDashboard },
  { href: "/timeline", label: "Timeline", icon: History },
  { href: "/ledger", label: "Ledger", icon: Wallet },
];

export function HubAppShell({ children }: HubAppShellProps) {
  const pathname = usePathname();
  const ledgerSummary = getLedgerSummary();
  const currentUser = getLoggedInUser();
  const equityShare = 100 / getMemberCount();
  const equityShareValue =
    ledgerSummary.memberCount === 0
      ? 0
      : ledgerSummary.currentPot / ledgerSummary.memberCount;
  const currentMatchdayNumber = getCurrentMatchdayNumber();

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
              >
                <span className="hub-nav-icon">
                  <Icon size={18} />
                </span>
                <span>{item.label}</span>
                {item.href === "/dashboard" && currentMatchdayNumber ? (
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
            <div>
              <p className="hub-label">Current Pot</p>
              <p className="hub-pot-value">
                {formatCurrency(ledgerSummary.currentPot)}
              </p>
            </div>
            <div className="hub-divider" />
            <div className="hub-roi">
              <p className="hub-label">Season ROI</p>
              <div className="hub-roi-row">
                <span className="hub-roi-value">
                  {formatPercent(ledgerSummary.roiPercentage)}
                </span>
                <MiniSparkline />
              </div>
            </div>
            {currentUser ? (
              <>
                <div className="hub-divider" />
                <div>
                  <p className="hub-label">Your Share</p>
                  <p className="hub-pot-value">
                    {formatCurrency(equityShareValue, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </>
            ) : null}
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

  if (normalizedHref === "/dashboard" && normalizedPathname === "/") {
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
