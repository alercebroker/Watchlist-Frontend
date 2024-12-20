import { UserState } from "./user/state";
import { WatchlistState } from "./watchlist/state";
import { TargetsState } from "@/ui/store/targets/state";
import { SingleTargetState } from "@/ui/store/singleTarget/state";
import { SingleWatchlistState } from "@/ui/store/singleWatchlist/state";
import { MatchesState } from "./matches/state";

export interface IRootState {
  watchlists: WatchlistState;
  users: UserState;
  targets: TargetsState;
  singleTarget: SingleTargetState;
  singleWatchlist: SingleWatchlistState;
  matches: MatchesState;
}

export interface IStoreModule {
  namespaced: boolean;
  state: any;
  mutations: any;
  actions: any;
  getters: any;
}
