import { ITargetData } from "@/app/target/domain/Target.types";
import { MutationTree } from "vuex";
import { TargetsState } from "@/ui/store/targets/state";

export enum MutationTypes {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_TARGETS = "SET_TARGETS",
  SET_PAGINATION_DATA = "SET_PAGINATION_DATA",
  APPEND_TARGETS = "APPEND_TARGETS",
  SET_DEFAULT_STATE = "SET_DEFAULT_STATE",
}

export const mutations: MutationTree<TargetsState> = {
  [MutationTypes.SET_TARGETS](state, targets: ITargetData[]) {
    state.targets = targets;
  },
  [MutationTypes.SET_ERROR](state, error: string) {
    state.error = error;
  },
  [MutationTypes.SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },
  [MutationTypes.SET_PAGINATION_DATA](state, data) {
    state.count = data.count;
    state.nextPage = data.nextPage;
    state.prevPage = data.prevPage;
  },
  [MutationTypes.APPEND_TARGETS](state, targets: ITargetData[]) {
    state.targets = state.targets.concat(targets);
  },
  [MutationTypes.SET_DEFAULT_STATE](state) {
    state.targets = [];
    state.error = null;
    state.loading = false;
    state.nextPage = null;
    state.prevPage = null;
  },
};
