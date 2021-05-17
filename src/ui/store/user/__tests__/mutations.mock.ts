import { MutationTree } from "vuex";
import { MutationTypes } from "../mutations";
import { UserState } from "../state";

export const mockMutations: MutationTree<UserState> = {
  [MutationTypes.SET_USER_DATA]: jest.fn(),
  [MutationTypes.SET_ERROR]: jest.fn(),
  [MutationTypes.SET_LOADING]: jest.fn(),
};
