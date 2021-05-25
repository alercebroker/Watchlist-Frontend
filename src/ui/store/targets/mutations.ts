import { ITargetData } from "@/app/target/domain/Target.types";
import { MutationTree } from "vuex";
import { TargetsState } from "@/ui/store/targets/state";

export enum MutationTypes {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_TARGETS = "SET_TARGETS",
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
};
