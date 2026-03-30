export type HubUser = {
  id: string;
  name: string;
};

const members: HubUser[] = [
  { id: "brian-scott", name: "Brian Scott" },
  { id: "tony-mclean", name: "Tony McLean" },
  { id: "john-colreavey", name: "John Colreavey" },
  { id: "paul-melville", name: "Paul Melville" },
  { id: "alasdair-head", name: "Alasdair Head" },
  { id: "paul-devine", name: "Paul Devine" },
  { id: "derek-mcmillan", name: "Derek McMillan" },
];

export function getMembers() {
  return members;
}

export function getMemberCount() {
  return members.length;
}

export function getCurrentUser() {
  return members[0];
}

export function getUserInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
