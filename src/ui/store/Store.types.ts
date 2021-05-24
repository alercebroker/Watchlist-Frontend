import { UserState } from "./user/state";
import { WatchlistState } from "./watchlist/state";
import {TargetsState} from "@/ui/store/targets/state";
import {SingleWatchlistState} from "@/ui/store/singleWatchlist/state";

export interface IRootState {
  watchlists: WatchlistState;
  users: UserState;
  targets: TargetsState;
  singleWatchlist: SingleWatchlistState;
}

export interface IStoreModule {
  namespaced: boolean;
  state: any;
  mutations: any;
  actions: any;
  getters: any;
}
