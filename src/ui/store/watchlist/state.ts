import { IWatchlistData } from "@/app/watchlist/domain";

export type WatchlistState = {
  loading: boolean;
  watchlists: IWatchlistData[];
  error: string | null;
};

export const state = (): WatchlistState => ({
  loading: false,
  watchlists: [],
  error: null,
});
