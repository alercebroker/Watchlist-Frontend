import { mutations } from "./mutations";
import { actions } from "./actions";
import { getters } from "./getters";
import { state } from "./state";
import { IStoreModule } from "../Store.types";

export const SingleTargetModule: IStoreModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
