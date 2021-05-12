import { WatchlistModule } from "./Watchlist";

export type Modules = {
  modules: any;
};

export const modules: Modules = {
  modules: {
    watchlists: WatchlistModule,
  },
};
