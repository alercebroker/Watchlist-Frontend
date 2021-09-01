import { ActionTree } from "vuex";
import { IRootState } from "../../Store.types";
import { ActionTypes } from "../actions";
import { SingleWatchlistState } from "../state";

export const mockActions = (): ActionTree<IRootState, SingleWatchlistState> => ({
  [ActionTypes.editWatchlist]: jest.fn(),
});