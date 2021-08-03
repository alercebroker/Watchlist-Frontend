import { GetterTree } from "vuex";
import { IRootState } from "../Store.types";
import { WatchlistState } from "./state";

export type Getters = {
  genericError(state: WatchlistState): string;
  detailError(state: WatchlistState): Record<string, string>;
  errored(state: WatchlistState): boolean;
};

export const getters: GetterTree<WatchlistState, IRootState> & Getters = {
  genericError: (state) => {
    if (typeof state.error == "string" && state.error != null) {
      return state.error;
    } else {
      return "";
    }
  },
  detailError: (state) => {
    if (typeof state.error == "object" && state.error != null) {
      return state.error;
    } else {
      return {};
    }
  },
  errored: (state) => {
    return state.error !== null;
  },
};
