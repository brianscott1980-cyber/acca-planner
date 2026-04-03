import { users } from "../data/users";

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
