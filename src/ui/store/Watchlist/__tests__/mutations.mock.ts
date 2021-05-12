import { MutationTree } from "vuex";
import { MutationTypes } from "../mutations";
import { WatchlistState } from "../state";

export const mockMutations: MutationTree<WatchlistState> = {
  [MutationTypes.SET_WATCHLISTS]: jest.fn(),
  [MutationTypes.SET_ERROR]: jest.fn(),
  [MutationTypes.SET_LOADING]: jest.fn(),
};
