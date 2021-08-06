import { isHttpError } from "@/shared/http";
import { GetterTree } from "vuex";
import { IRootState } from "../Store.types";
import { WatchlistState } from "./state";

export type Getters = {
  genericError(state: WatchlistState): string;
  detailError(state: WatchlistState): Record<string, unknown>;
  errored(state: WatchlistState): boolean;
  csvError(state: WatchlistState): Error | null;
};

export const getters: GetterTree<WatchlistState, IRootState> & Getters = {
  genericError: (state) => {
    if (
      state.error != null &&
      !isHttpError(state.error) &&
      !Object.keys(state.error).find((key) => key === "row")
    ) {
      return state.error.message;
    } else {
      return "";
    }
  },
  csvError: (state) => {
    if (state.error != null && !isHttpError(state.error)) {
      if (Object.keys(state.error).find((key) => key === "row")) {
        return state.error;
      }
    }
    return null;
  },
  detailError: (state) => {
    if (state.error != null && isHttpError(state.error)) {
      return state.error.detail;
    } else {
      return {};
    }
  },
  errored: (state) => {
    return state.error !== null;
  },
};
