import { MutationTypes } from "@/ui/store/singleTarget/mutations";
import { ActionTree } from "vuex";
import { IRootState } from "../Store.types";
import { SingleTargetState } from "./state";

export enum ActionTypes {
  selectTarget = "selectTarget",
  setDefault = "setDefault",
}

export type SelectTargetPayload = {
  target: number;
};


export const actions: ActionTree<SingleTargetState, IRootState> = {
  [ActionTypes.selectTarget]({ commit }, payload: SelectTargetPayload) {
    commit(MutationTypes.SET_LOADING, true);
    commit(MutationTypes.SET_TARGET, payload);
    commit(MutationTypes.SET_LOADING, false);
  },
  [ActionTypes.setDefault]({ commit }) {
    commit(MutationTypes.SET_DEFAULT_STATE);
  },
};
