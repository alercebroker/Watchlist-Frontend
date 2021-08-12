import { MutationTree } from "vuex";
import { MutationTypes } from "../mutations";
import { TargetsState } from "../state";

export const mockMutations = (): MutationTree<TargetsState> => ({
  [MutationTypes.APPEND_TARGETS]: jest.fn(),
  [MutationTypes.SET_TARGETS]: jest.fn(),
  [MutationTypes.SET_ERROR]: jest.fn(),
  [MutationTypes.SET_LOADING]: jest.fn(),
  [MutationTypes.SET_DEFAULT_STATE]: jest.fn(),
});
