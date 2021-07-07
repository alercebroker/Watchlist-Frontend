import { IWatchlistData } from "./Watchlist.types";

export class Watchlist implements IWatchlistData {
  id: number;
  title: string;
  owner: string;
  targets: string | null;
  url: string;
  nTargets: string;
  lastMatch: string;
  constructor(watchlistData: IWatchlistData) {
    this.id = watchlistData.id;
    this.title = watchlistData.title;
    this.owner = watchlistData.owner;
    this.targets = watchlistData.targets;
    this.url = watchlistData.url;
    this.nTargets = watchlistData.nTargets;
    this.lastMatch = watchlistData.lastMatch;
  }
}
