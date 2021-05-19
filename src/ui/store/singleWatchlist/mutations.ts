import { ITargetData } from "@/app/target/domain/Target.types";


export enum MutationTypes {
    SET_LOADING = "SET_LOADING",
    SET_ERROR = "SET_ERROR",
    SET_TITLE = "SET_TITLE",
    SET_URL = "SET_URL",
    SET_TARGETS = "SET_TARGETS",
    SET_N_TARGETS = "SET_N_TARGETS",
    SET_LAST_MATCH = "SET_LAST_MATCH"
  }
  
export const mutations: MutationTree<SingleWatchlistState> = {
    [MutationTypes.SET_TITLE](state, title: string) {
        state.title = title;
    },
    [MutationTypes.SET_URL](state, url: string) {
        state.url = url;
    },
    [MutationTypes.SET_TARGETS](state, targets: ITargetData[]) {
        state.targets = targets;
    },
    [MutationTypes.SET_N_TARGETS](state, n_targets: string) {
        state.n_targets = n_targets;
    },
    [MutationTypes.SET_LAST_MATCH](state, last_match: string) {
        state.last_match = last_match;
    },
    [MutationTypes.SET_ERROR](state, error: string) {
        state.error = error;
    },
    [MutationTypes.SET_LOADING](state, loading: boolean) {
        state.loading = loading;
    },

};