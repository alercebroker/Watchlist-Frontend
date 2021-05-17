import { MutationTree } from "vuex";
import { UserState } from "./state";

export enum MutationTypes {
  SET_USER_DATA = "SET_USER_DATA",
  SET_ERROR = "SET_ERROR",
  SET_LOADING = "SET_LOADING",
}

export const mutations: MutationTree<UserState> = {
  [MutationTypes.SET_USER_DATA](state, data) {
    state.userData = data;
  },
  [MutationTypes.SET_LOADING](state, loading) {
    state.loading = loading;
  },
  [MutationTypes.SET_ERROR](state, error) {
    state.error = error;
  },
};
