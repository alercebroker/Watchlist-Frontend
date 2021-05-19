import { IWatchlistData } from "./Watchlist.types";

export class Watchlist implements IWatchlistData {
  title: string;
  //goodbye owner
  owner: string;
  targets: string | null;
  url: string;
  nTargets: string;
  lastMatch: string;
  //add n_targets
  //add last_match
  constructor(watchlistData: IWatchlistData) {
    this.title = watchlistData.title;
    this.owner = watchlistData.owner;
    this.targets = watchlistData.targets;
    this.url = watchlistData.url;
    this.nTargets = watchlistData.nTargets;
    this.lastMatch = watchlistData.lastMatch;
  }
}
