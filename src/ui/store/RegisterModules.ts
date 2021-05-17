import { UserModule } from "./user";
import { WatchlistModule } from "./watchlist";

export type Modules = {
  modules: any;
};

export const modules: Modules = {
  modules: {
    watchlists: WatchlistModule,
    users: UserModule,
  },
};
