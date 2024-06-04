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
  UPDATE_TARGET = "UPDATE_TARGET",
  DELETE_TARGET = "DELETE_TARGET",
  SELECT_TARGET = "SELECT_TARGET",
  UPDATE_COUNT = "UPDATE_COUNT",
}

export const mutations: MutationTree<TargetsState> = {
  [MutationTypes.SET_TARGETS](state, targets: ITargetData[]) {
    state.targets = targets;
  },
  [MutationTypes.SET_ERROR](state, error: Error) {
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
  [MutationTypes.UPDATE_TARGET](state, newTarget: ITargetData) {
    const target = state.targets.find((t) => t.id === newTarget.id);
    if (target) {
      target.name = newTarget.name;
      target.ra = newTarget.ra;
      target.dec = newTarget.dec;
      target.radius = newTarget.radius;
      target.filter = newTarget.filter;
    }
  },
  [MutationTypes.DELETE_TARGET](state, target: number) {
    state.targets = state.targets.filter((t) => t.id != target);
  },
  [MutationTypes.SELECT_TARGET](state, target: number) {
    state.targets = state.targets.filter((t) => t.id === target);
  },
  [MutationTypes.UPDATE_COUNT](state) {
    state.count = state.count + 1;
  },
};
