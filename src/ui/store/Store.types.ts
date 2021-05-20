import { UserState } from "./user/state";
import { WatchlistState } from "./watchlist/state";
import {TargetsState} from "@/ui/store/targets/state";
export interface IRootState {
  watchlists: WatchlistState;
  users: UserState;
  targets: TargetsState;
}

export interface IStoreModule {
  namespaced: boolean;
  state: any;
  mutations: any;
  actions: any;
  getters: any;
}
