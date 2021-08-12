import { MutationTree } from "vuex";
import { MutationTypes } from "../mutations";
import { MatchesState } from "../state";

export const mockMutations = (): MutationTree<MatchesState> => ({
  [MutationTypes.SET_MATCHES]: jest.fn(),
  [MutationTypes.SET_ERROR]: jest.fn(),
  [MutationTypes.SET_LOADING]: jest.fn(),
  [MutationTypes.SET_DEFAULT_STATE]: jest.fn(),
});
