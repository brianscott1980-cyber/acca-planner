"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(
    supabase ? null : "Supabase is not configured.",
  );
  const [nextPath] = useState(() => {
    if (typeof window === "undefined") {
      return "/matchday";
    }

    return new URLSearchParams(window.location.search).get("next") || "/matchday";
  });

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;
    let timeoutId: number | null = null;

    const completeSignIn = async () => {
      const { data, error } = await client.auth.getSession();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.session?.user) {
        router.replace(nextPath);
        return;
      }

      timeoutId = window.setTimeout(() => {
        setErrorMessage(
          "No session was detected from the magic link. Try opening the latest login email again.",
        );
      }, 2500);
    };

    void completeSignIn();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (
        (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
        session?.user
      ) {
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
        }

        router.replace(nextPath);
      }
    });

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      subscription.unsubscribe();
    };
  }, [nextPath, router]);

  return (
    <section className="auth-shell">
      <div className="auth-card hub-panel">
        <p className="hub-label">Caddyshack</p>
        <h1 className="hub-title">Completing Sign In</h1>
        <p className="hub-subtitle">
          We&apos;re finishing your Supabase session and sending you into the hub.
        </p>
        {errorMessage ? (
          <p className="auth-status auth-status-error">{errorMessage}</p>
        ) : (
          <p className="auth-status auth-status-success">
            Magic link verified. Redirecting now...
          </p>
        )}
      </div>
    </section>
  );
}
