import { IWatchlistData } from "./Watchlist.types";

export class Watchlist implements IWatchlistData {
    title: string
    owner: string
    constructor(watchlistData: IWatchlistData) {
        this.title = watchlistData.title
        this.owner = watchlistData.owner
    }

}
