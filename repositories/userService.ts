import { users, type UserRecord } from "../data/users";

export type HubUser = UserRecord;

export function getMembers() {
  return users;
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
