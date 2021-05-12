import { cid, container } from "inversify-props";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { ActionTree } from "vuex";
import { IRootState } from "../Store.types";
import { WatchlistState } from "./state";
import { IWatchlistData } from "@/app/watchlist/domain";
import { MutationTypes } from "./mutations";
import { HttpError } from "@/shared/http";
import { ParseError } from "@/shared/error/ParseError";

export enum ActionTypes {
  getAllWatchlists = "getAllWatchlists",
}

export const actions: ActionTree<WatchlistState, IRootState> = {
  async [ActionTypes.getAllWatchlists]({ commit }) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.GetAllWatchlists);
    const callbacks: Callbacks = {
      respondWithSuccess: (watchlists: IWatchlistData[]) => {
        commit(MutationTypes.SET_WATCHLISTS, watchlists);
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
      },
    };
    interactor.execute(null, callbacks);
  },
};
