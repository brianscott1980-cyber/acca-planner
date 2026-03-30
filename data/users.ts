export type UserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  initials: string;
  joinedOn: string;
  role: "member";
};

export const users: UserRecord[] = [
  {
    id: "brian-scott",
    firstName: "Brian",
    lastName: "Scott",
    displayName: "Brian Scott",
    initials: "BS",
    joinedOn: "2026-03-23",
    role: "member",
  },
  {
    id: "tony-mclean",
    firstName: "Tony",
    lastName: "McLean",
    displayName: "Tony McLean",
    initials: "TM",
    joinedOn: "2026-03-23",
    role: "member",
  },
  {
    id: "john-colreavey",
    firstName: "John",
    lastName: "Colreavey",
    displayName: "John Colreavey",
    initials: "JC",
    joinedOn: "2026-03-23",
    role: "member",
  },
  {
    id: "paul-melville",
    firstName: "Paul",
    lastName: "Melville",
    displayName: "Paul Melville",
    initials: "PM",
    joinedOn: "2026-03-23",
    role: "member",
  },
  {
    id: "alasdair-head",
    firstName: "Alasdair",
    lastName: "Head",
    displayName: "Alasdair Head",
    initials: "AH",
    joinedOn: "2026-03-23",
    role: "member",
  },
  {
    id: "paul-devine",
    firstName: "Paul",
    lastName: "Devine",
    displayName: "Paul Devine",
    initials: "PD",
    joinedOn: "2026-03-23",
    role: "member",
  },
  {
    id: "derek-mcmillan",
    firstName: "Derek",
    lastName: "McMillan",
    displayName: "Derek McMillan",
    initials: "DM",
    joinedOn: "2026-03-23",
    role: "member",
  },
];
