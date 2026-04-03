import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getMembers() {
  return getCurrentAppDataSnapshot().users;
}

export function getMemberById(userId: string | null | undefined) {
  if (!userId) {
    return null;
  }

  return getMembers().find((user) => user.id === userId) ?? null;
}

export function getMemberByEmail(email: string | null | undefined) {
  if (!email) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  return (
    getMembers().find((user) => user.email?.trim().toLowerCase() === normalizedEmail) ??
    null
  );
}

export function getMemberCount() {
  return getMembers().length;
}
