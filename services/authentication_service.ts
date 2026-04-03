import type { User } from "@supabase/supabase-js";
import { getMemberByEmail, getMemberById } from "../repositories/user_repository";

function getMemberIdFromMetadata(user: User | null | undefined) {
  const memberId =
    user?.user_metadata?.member_id ??
    user?.user_metadata?.memberId ??
    user?.app_metadata?.member_id ??
    user?.app_metadata?.memberId;

  return typeof memberId === "string" ? memberId : null;
}

export function getMemberForSupabaseUser(user: User | null | undefined) {
  const memberId = getMemberIdFromMetadata(user);

  return getMemberById(memberId) ?? getMemberByEmail(user?.email ?? null);
}
