
import { MutationTree } from "vuex";
import { LightCurveState } from "./state";

export enum MutationTypes {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_DATA = "SET_DATA",
}

export const mutations: MutationTree<LightCurveState> = {
  [MutationTypes.SET_ERROR](state, error: Error) {
    state.error = error;
  },
  [MutationTypes.SET_DATA](state, payload) {
    state.detections = payload.detections;
    state.nonDetections = payload.nonDetections;
  },
  [MutationTypes.SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },

};
