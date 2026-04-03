export type UserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  initials: string;
  email?: string;
  joinedOn: string;
  role: "member" | "admin";
};

export type HubUser = UserRecord;
