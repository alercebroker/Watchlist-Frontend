import { IMatchData } from "./Match.types";

export const mockMatches: IMatchData[] = [
  {
    object_id: "oid1",
    candid: "123",
    date: new Date().toDateString(),
  },
  {
    object_id: "oid2",
    candid: "456",
    date: new Date().toDateString(),
  },
];
