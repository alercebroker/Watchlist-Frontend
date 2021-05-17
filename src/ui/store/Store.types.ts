import { UserState } from "./user/state";
import { WatchlistState } from "./watchlist/state";
export interface IRootState {
  watchlists: WatchlistState;
  users: UserState;
}

export interface IStoreModule {
  namespaced: boolean;
  state: any;
  mutations: any;
  actions: any;
  getters: any;
}
