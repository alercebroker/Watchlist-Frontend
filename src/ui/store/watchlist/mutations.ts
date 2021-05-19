import { IWatchlistData } from "@/app/watchlist/domain";
import { MutationTree } from "vuex";
import { WatchlistState } from "./state";


export enum MutationTypes {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_WATCHLISTS = "SET_WATCHLISTS",
}

export const mutations: MutationTree<WatchlistState> = {
  [MutationTypes.SET_WATCHLISTS](state, watchlists: IWatchlistData[]) {
    state.watchlists = watchlists;
  },
  [MutationTypes.SET_ERROR](state, error: string) {
    state.error = error;
  },
  [MutationTypes.SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },
};
