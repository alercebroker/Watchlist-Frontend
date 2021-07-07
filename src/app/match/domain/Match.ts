import { IMatchData } from "./Match.types";

export class Match implements IMatchData {
  object_id: string;
  candid: string;
  date: string;
  constructor(data: IMatchData) {
    this.object_id = data.object_id;
    this.candid = data.candid;
    this.date = data.date;
  }
}
