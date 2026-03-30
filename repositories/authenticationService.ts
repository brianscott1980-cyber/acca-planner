import { getMembers } from "./userService";

export function getLoggedInUser() {
  const members = getMembers();

  return (
    members.find((member) => member.id === "brian-scott") ??
    members[0] ??
    null
  );
}
