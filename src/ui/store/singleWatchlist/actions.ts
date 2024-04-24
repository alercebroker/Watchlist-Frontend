import { cid, container } from "inversify-props";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { ActionTree } from "vuex";
import { IRootState } from "../Store.types";
import { SingleWatchlistState } from "./state";
import { MutationTypes } from "./mutations";
import { MutationTypes as WatchlistMutationType } from "../watchlist/mutations";
import { IWatchlistData } from "@/app/watchlist/domain";
import { HttpError } from "@/shared/http";
import { ParseError } from "@/shared/error/ParseError";

export enum ActionTypes {
  editWatchlist = "editWatchlist",
  editTargetsWatchlist = "editTargetsWatchlist",
}

export type EditWatchlistPayload = {
  params: {
    title: string;
    notification_rate: string | null;
  };
  watchlist: number;
};

export const actions: ActionTree<SingleWatchlistState, IRootState> = {
  async [ActionTypes.editWatchlist]({ commit }, payload: EditWatchlistPayload) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.EditWatchlist);
    const callbacks: Callbacks = {
      respondWithSuccess: (watchlist: IWatchlistData) => {
        commit(MutationTypes.SET_TITLE, watchlist.title);
        commit(MutationTypes.SET_NOTIFICATION_RATE, watchlist.notificationRate);
        commit(
          "watchlists/" + WatchlistMutationType.UPDATE_WATCHLIST,
          watchlist,
          { root: true }
        );
        commit("watchlists/" + WatchlistMutationType.SET_LOADING, false, {
          root: true,
        });
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_LOADING, false);
      },
    };
    await interactor.execute(payload, callbacks);
  },

  async [ActionTypes.editTargetsWatchlist]({ commit }, payload) {
    console.log(payload);
    
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(
      cid.EditTargetsWatchlist
    );
    const callbacks: Callbacks = {
      respondWithSuccess: (watchlist: IWatchlistData) => {
        commit(
          "watchlists/" + WatchlistMutationType.UPDATE_WATCHLIST,
          watchlist,
          { root: true }
        );
        commit("watchlists/" + WatchlistMutationType.SET_LOADING, false, {
          root: true,
        });
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_LOADING, false);
      },
    };

    await interactor.execute(payload, callbacks);
  },
};
