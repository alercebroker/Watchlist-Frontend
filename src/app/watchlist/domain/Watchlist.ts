import { IWatchlistData } from "./Watchlist.types";

export class Watchlist implements IWatchlistData {
  id: number;
  title: string;
  owner: string;
  notificationRate: string | null;
  lastNotified: string | null;
  targets: string | null;
  url: string;
  nTargets: string;
  lastMatch: string;
  constructor(watchlistData: IWatchlistData) {
    this.id = watchlistData.id;
    this.title = watchlistData.title;
    this.owner = watchlistData.owner;
    this.notificationRate = watchlistData.notificationRate;
    this.lastNotified = watchlistData.lastNotified;
    this.targets = watchlistData.targets;
    this.url = watchlistData.url;
    this.nTargets = watchlistData.nTargets;
    this.lastMatch = watchlistData.lastMatch;
  }
}
