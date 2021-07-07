import { IStoreModule } from "../Store.types";
import { state } from "./state";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

export const MatchesModule: IStoreModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
