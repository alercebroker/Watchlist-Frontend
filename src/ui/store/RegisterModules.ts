import { UserModule } from "./user";
import { WatchlistModule } from "./watchlist";
import { TargetsModule } from "@/ui/store/targets";
import { SingleWatchlistModule } from "@/ui/store/singleWatchlist";
import { MatchesModule } from "./matches";

export type Modules = {
  modules: any;
};

export const modules: Modules = {
  modules: {
    watchlists: WatchlistModule,
    users: UserModule,
    targets: TargetsModule,
    singleWatchlist: SingleWatchlistModule,
    matches: MatchesModule,
  },
};
