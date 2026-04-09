"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import type { HubUser } from "../../../types/user_type";
import { supabase } from "../../../lib/supabase/client";
import { shouldUseRemoteAppData } from "../../../services/app_data_service";
import { getMemberForSupabaseUser } from "../../../services/authentication_service";
import { getMemberById } from "../../../repositories/user_repository";

type AuthContextValue = {
  authUser: User | null;
  member: HubUser | null;
  isLoading: boolean;
  isConfigured: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const requiresSupabaseAuth = shouldUseRemoteAppData();
  const supabaseClient = supabase;
  const [authUserState, setAuthUserState] = useState<User | null>(null);
  const [isLoadingState, setIsLoadingState] = useState(
    requiresSupabaseAuth && Boolean(supabaseClient),
  );

  useEffect(() => {
    if (!requiresSupabaseAuth || !supabaseClient) {
      return;
    }

    let isMounted = true;
    setIsLoadingState(true);

    void supabaseClient.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          console.error("Failed to read Supabase session", error);
        }

        setAuthUserState(data.session?.user ?? null);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        console.error("Failed to read Supabase session", error);
        setAuthUserState(null);
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setIsLoadingState(false);
      });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      setAuthUserState(session?.user ?? null);
      setIsLoadingState(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [requiresSupabaseAuth, supabaseClient]);

  const authUser = requiresSupabaseAuth ? authUserState : null;
  const isLoading = requiresSupabaseAuth ? isLoadingState : false;
  const localMemberId = process.env.NEXT_PUBLIC_LOCAL_MEMBER_ID?.trim() || "brian-scott";
  const localMember = requiresSupabaseAuth ? null : getMemberById(localMemberId);

  const value = useMemo<AuthContextValue>(
    () => ({
      authUser,
      member: requiresSupabaseAuth
        ? getMemberForSupabaseUser(authUser)
        : localMember,
      isLoading,
      isConfigured: !requiresSupabaseAuth || Boolean(supabaseClient),
      async signOut() {
        if (!supabaseClient) {
          return;
        }

        await supabaseClient.auth.signOut();
      },
    }),
    [authUser, isLoading, localMember, requiresSupabaseAuth, supabaseClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
