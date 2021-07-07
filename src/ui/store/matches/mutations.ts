import { MutationTree } from "vuex";
import { MatchesState } from "./state";

export enum MutationTypes {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_MATCHES = "SET_MATCHES",
}

export const mutations: MutationTree<MatchesState> = {
  [MutationTypes.SET_LOADING](state, loading) {
    state.loading = loading;
  },
  [MutationTypes.SET_ERROR](state, error) {
    state.error = error;
  },
  [MutationTypes.SET_MATCHES](state, matches) {
    state.matches = matches;
  },
};
