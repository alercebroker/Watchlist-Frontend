import { ActionTree } from "vuex";
import { IRootState } from "../../Store.types";
import { ActionTypes } from "../actions";
import { WatchlistState } from "../state";

export const mockActions: ActionTree<IRootState, WatchlistState> = {
    [ActionTypes.selectWatchlist]: jest.fn(),
}