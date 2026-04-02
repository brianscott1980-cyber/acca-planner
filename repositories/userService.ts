import { users, type UserRecord } from "../data/users";

export type HubUser = UserRecord;

export function getMembers() {
  return users;
}

export function getMemberById(userId: string | null | undefined) {
  if (!userId) {
    return null;
  }

  return users.find((user) => user.id === userId) ?? null;
}

export function getMemberByEmail(email: string | null | undefined) {
  if (!email) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  return (
    users.find((user) => user.email?.trim().toLowerCase() === normalizedEmail) ??
    null
  );
}

export function getMemberCount() {
  return users.length;
}

export function getUserInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
