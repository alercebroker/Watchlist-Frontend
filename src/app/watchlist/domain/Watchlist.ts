import { IWatchlistData } from "./Watchlist.types";

export class Watchlist implements IWatchlistData {
  title: string;
  owner: string;
  targets: string | null;
  constructor(watchlistData: IWatchlistData) {
    this.title = watchlistData.title;
    this.owner = watchlistData.owner;
    this.targets = watchlistData.targets;
  }
}
