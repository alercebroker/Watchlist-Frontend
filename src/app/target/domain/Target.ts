import { IWatchlistFilter } from "@/app/filter/domain/Filter.types";
import { ITargetData } from "./Target.types";

export class Target implements ITargetData {
  id: number;
  url: string;
  name: string;
  radius: number;
  ra: number;
  dec: number;
  nMatches: number | null;
  lastMatch: string;
  filter: IWatchlistFilter;

  constructor(data: ITargetData) {
    this.id = data.id;
    this.url = data.url;
    this.name = data.name;
    this.radius = data.radius;
    this.ra = data.ra;
    this.dec = data.dec;
    this.nMatches = data.nMatches;
    this.lastMatch = data.lastMatch;
    this.filter = data.filter;
  }
  validate(): boolean {
    return (
      this.id != undefined &&
      this.name != undefined &&
      this.radius != undefined &&
      this.ra != undefined &&
      this.dec != undefined &&
      this.filter != undefined
    );
  }
}
