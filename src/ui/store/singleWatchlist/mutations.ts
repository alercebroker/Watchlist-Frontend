import { MutationTree } from "vuex";
import { SingleWatchlistState } from "./state";

export enum MutationTypes {
  SET_ID = "SET_ID",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_TITLE = "SET_TITLE",
  SET_URL = "SET_URL",
  SET_TARGETS = "SET_TARGETS",
  SET_N_TARGETS = "SET_N_TARGETS",
  SET_LAST_MATCH = "SET_LAST_MATCH",
}

export const mutations: MutationTree<SingleWatchlistState> = {
  [MutationTypes.SET_ID](state, id: number) {
    state.id = id;
  },
  [MutationTypes.SET_TITLE](state, title: string) {
    state.title = title;
  },
  [MutationTypes.SET_URL](state, url: string) {
    state.url = url;
  },
  [MutationTypes.SET_N_TARGETS](state, n_targets: string) {
    state.n_targets = n_targets;
  },
  [MutationTypes.SET_LAST_MATCH](state, last_match: string) {
    state.last_match = last_match;
  },
  [MutationTypes.SET_ERROR](state, error: string) {
    state.error = error;
  },
  [MutationTypes.SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },
  [MutationTypes.SET_TARGETS](state, targets: string) {
    state.targets = targets;
  },
};
