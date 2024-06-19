
import { MutationTree } from "vuex";
import { SingleTargetState } from "@/ui/store/singleTarget/state";

export enum MutationTypes {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
}

export const mutations: MutationTree<SingleTargetState> = {
  [MutationTypes.SET_ERROR](state, error: Error) {
    state.error = error;
  },
  [MutationTypes.SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },

};
