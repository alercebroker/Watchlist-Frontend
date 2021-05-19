import { ITargetData } from "./Target.types";

export class Target implements ITargetData {
  name: string;
  radius: number;
  ra: number;
  dec: number;
  nMatches: number | null;
  constructor(data: ITargetData) {
    this.name = data.name;
    this.radius = data.radius;
    this.ra = data.ra;
    this.dec = data.dec;
    this.nMatches = data.nMatches;
  }
}