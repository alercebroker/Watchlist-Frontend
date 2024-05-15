import { ITargetData } from "@/app/target/domain/Target.types";
import { MutationTree } from "vuex";
import { SingleTargetState } from "@/ui/store/singleTarget/state";

export enum MutationTypes {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_TARGET = "SET_TARGET",
  SET_DEFAULT_STATE = "SET_DEFAULT_STATE",
}

export const mutations: MutationTree<SingleTargetState> = {
  [MutationTypes.SET_TARGET](state, target: ITargetData) {
    state.target = target;
  },
  [MutationTypes.SET_ERROR](state, error: Error) {
    state.error = error;
  },
  [MutationTypes.SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },
  [MutationTypes.SET_DEFAULT_STATE](state) {
    state.target = {} as ITargetData;
    state.error = null;
    state.loading = false;
  },
};
