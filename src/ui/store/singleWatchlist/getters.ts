import { GetterTree } from "vuex";
import { IRootState } from "../Store.types";
import { SingleWatchlistState } from "./state";

export const getters: GetterTree<SingleWatchlistState, IRootState> = {
  getNumberTargets: (state) => {
    const targets = state.n_targets;
    return targets;
  },
};
