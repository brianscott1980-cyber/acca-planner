"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";
import { getSiteUrl } from "../../lib/site";
import { useAuth } from "../ui/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { authUser, isConfigured, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextPath] = useState(() => {
    if (typeof window === "undefined") {
      return "/matchday";
    }

    return new URLSearchParams(window.location.search).get("next") || "/matchday";
  });

  useEffect(() => {
    if (isLoading || !authUser) {
      return;
    }

    router.replace(nextPath);
  }, [authUser, isLoading, nextPath, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setErrorMessage("Supabase is not configured yet.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${getSiteUrl()}/auth/callback/`,
      },
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setStatusMessage("Magic link sent. Check your email to continue.");
  };

  return (
    <section className="auth-shell">
      <div className="auth-card hub-panel">
        <p className="hub-label">Caddyshack</p>
        <h1 className="hub-title">Sign In</h1>
        <p className="hub-subtitle">
          Enter your invite-only email address and we&apos;ll send you a magic link.
        </p>

        {!isConfigured ? (
          <p className="auth-status auth-status-error">
            Supabase is not configured. Add your public URL and publishable key to
            the environment first.
          </p>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="hub-label">Email</span>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <button
            className="hub-primary-button"
            type="submit"
            disabled={!isConfigured || isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        {statusMessage ? (
          <p className="auth-status auth-status-success">{statusMessage}</p>
        ) : null}

        {errorMessage ? (
          <p className="auth-status auth-status-error">{errorMessage}</p>
        ) : null}

        <p className="auth-copy">
          Accounts are invite-only. Unknown emails will not be registered.
        </p>

        <button
          className="auth-link-button"
          type="button"
          onClick={() => router.replace("/matchday")}
        >
          Back to app
        </button>
      </div>
    </section>
  );
}
