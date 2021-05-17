import { IWatchlistData } from "@/app/watchlist/domain";

export const state = () => ({
  loading: false,
  watchlists: [] as IWatchlistData[],
  error: null as string | null,
});

export type WatchlistState = ReturnType<typeof state>;
