import { isHttpError } from "@/shared/http";
import { GetterTree } from "vuex";
import { IRootState } from "../Store.types";
import { TargetsState } from "./state";

export type Getters = {
  genericError(state: TargetsState): string;
  detailError(state: TargetsState): Record<string, unknown>;
  errored(state: TargetsState): boolean;
};

export const getters: GetterTree<TargetsState, IRootState> & Getters = {
  genericError: (state) => {
    if (
      (state.error != null && !isHttpError(state.error)) ||
      (state.error != null &&
        isHttpError(state.error) &&
        state.error.isServerError())
    ) {
      return state.error.message;
    } else {
      return "";
    }
  },
  detailError: (state) => {
    if (state.error != null && isHttpError(state.error)) {
      return state.error.detail;
    }
    return {};
  },
  errored: (state) => {
    return state.error !== null;
  },
};
