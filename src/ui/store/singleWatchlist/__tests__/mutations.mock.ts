import { MutationTree } from "vuex";
import { MutationTypes } from "../mutations";
import { SingleWatchlistState } from "../state";

export const mockMutations = (): MutationTree<SingleWatchlistState> => ({
    [MutationTypes.SET_ID]: jest.fn(),
    [MutationTypes.SET_ERROR]: jest.fn(),
    [MutationTypes.SET_LOADING]: jest.fn(),
    [MutationTypes.SET_TITLE]: jest.fn(),
    [MutationTypes.SET_NOTIFICATION_RATE]: jest.fn(),
    [MutationTypes.SET_LAST_MATCH]: jest.fn(),
    [MutationTypes.SET_LAST_MATCH]: jest.fn(),
    [MutationTypes.SET_N_TARGETS]: jest.fn(),
    [MutationTypes.SET_TARGETS]: jest.fn(),
    [MutationTypes.SET_URL]: jest.fn(),
});