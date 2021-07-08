import { IWatchlistData } from "@/app/watchlist/domain";

export type WatchlistState = {
  loading: boolean;
  watchlists: IWatchlistData[];
  error: string | null;
  page: number;
  nextPage: string | null;
  prevPage: string | null;
};

export const state = (): WatchlistState => ({
  loading: false,
  watchlists: [],
  error: null,
  page: 1,
  nextPage: null,
  prevPage: null,
});
