"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { shouldUseRemoteAppData } from "../../../services/app_data_service";
import { useAuth } from "./AuthProvider";

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const requiresSupabaseAuth = shouldUseRemoteAppData();
  const { authUser, member, isLoading, isConfigured, signOut } = useAuth();

  useEffect(() => {
    if (!requiresSupabaseAuth || isLoading || !isConfigured || authUser) {
      return;
    }

    const nextPath = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
    router.replace(`/login/${nextPath}`);
  }, [authUser, isConfigured, isLoading, pathname, requiresSupabaseAuth, router]);

  if (!requiresSupabaseAuth) {
    return <>{children}</>;
  }

  if (!isConfigured) {
    return (
      <section className="auth-shell">
        <div className="auth-card hub-panel">
          <h1 className="hub-title">Supabase Not Configured</h1>
          <p className="hub-subtitle">
            Add your Supabase environment variables before using authentication.
          </p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="auth-shell">
        <div className="auth-card hub-panel">
          <h1 className="hub-title">Checking Access</h1>
          <p className="hub-subtitle">
            Verifying your magic-link session for the syndicate hub.
          </p>
        </div>
      </section>
    );
  }

  if (authUser && !member) {
    return (
      <section className="auth-shell">
        <div className="auth-card hub-panel">
          <h1 className="hub-title">Account Not Linked</h1>
          <p className="hub-subtitle">
            This Supabase account is signed in, but it is not mapped to a syndicate
            member yet. Add a matching `member_id` in Supabase user metadata or a
            matching email in `data/users.ts`.
          </p>
          <button className="hub-secondary-button" type="button" onClick={() => void signOut()}>
            Sign Out
          </button>
        </div>
      </section>
    );
  }

  if (!authUser) {
    return null;
  }

  return <>{children}</>;
}
