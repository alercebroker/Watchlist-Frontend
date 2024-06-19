import { UserModule } from "./user";
import { WatchlistModule } from "./watchlist";
import { TargetsModule } from "@/ui/store/targets";
import { SingleTargetModule } from "./singleTarget";
import { SingleWatchlistModule } from "@/ui/store/singleWatchlist";
import { MatchesModule } from "./matches";
import { LightCurveModule } from "./lightcurve"

export type Modules = {
  modules: any;
};

export const modules: Modules = {
  modules: {
    watchlists: WatchlistModule,
    users: UserModule,
    targets: TargetsModule,
    singleTarget: SingleTargetModule,
    singleWatchlist: SingleWatchlistModule,
    matches: MatchesModule,
    lightcurve: LightCurveModule,
  },
};
