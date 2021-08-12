import { IWatchlistData } from "@/app/watchlist/domain";
import { MutationTree } from "vuex";
import { WatchlistState } from "./state";

export enum MutationTypes {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_WATCHLISTS = "SET_WATCHLISTS",
  APPEND_WATCHLISTS = "APPEND_WATCHLISTS",
  SET_NEXT = "SET_NEXT",
  SET_PREV = "SET_PREV",
  SET_PAGE = "SET_PAGE",
  SET_DEFAULT_STATE = "SET_DEFAULT_STATE",
}

export const mutations: MutationTree<WatchlistState> = {
  [MutationTypes.SET_WATCHLISTS](state, watchlists: IWatchlistData[]) {
    state.watchlists = watchlists;
  },
  [MutationTypes.SET_ERROR](state, error: Error) {
    state.error = error;
  },
  [MutationTypes.SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },
  [MutationTypes.APPEND_WATCHLISTS](state, watchlists: IWatchlistData[]) {
    state.watchlists.concat(watchlists);
  },
  [MutationTypes.SET_NEXT](state, next: string) {
    state.nextPage = next;
  },
  [MutationTypes.SET_PREV](state, prev: string) {
    state.prevPage = prev;
  },
  [MutationTypes.SET_PAGE](state, page: number) {
    state.page = page;
  },
  [MutationTypes.SET_DEFAULT_STATE](state) {
    state.error = null;
    state.watchlists = [];
    state.loading = false;
    state.nextPage = null;
    state.prevPage = null;
    state.page = 1;
  },
};
