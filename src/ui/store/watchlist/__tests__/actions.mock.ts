import { ActionTree } from "vuex";
import { IRootState } from "../../Store.types";
import { ActionTypes } from "../actions";
import { WatchlistState } from "../state";

export function mockActions(): ActionTree<IRootState, WatchlistState> {
  return {
    [ActionTypes.selectWatchlist]: jest.fn(),
    [ActionTypes.getAllWatchlists]: jest.fn(),
  };
}
