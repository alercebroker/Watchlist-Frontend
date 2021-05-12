import { WatchlistState } from "./Watchlist/state";
export interface IRootState {
  watchlists: WatchlistState;
}

export interface IStoreModule {
  namespaced: boolean;
  state: any;
  mutations: any;
  actions: any;
  getters: any;
}
