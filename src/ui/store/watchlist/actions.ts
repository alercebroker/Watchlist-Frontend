import { cid, container } from "inversify-props";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { CreateWatchlistRequestModel } from "@/app/watchlist/infrastructure/WatchlistService.types";
import { ActionTree } from "vuex";
import { IRootState } from "../Store.types";
import { WatchlistState } from "./state";
import { IWatchlistData, IWatchlistList } from "@/app/watchlist/domain";
import { MutationTypes } from "./mutations";
import { MutationTypes as SingleWatchlistMutationType } from "../singleWatchlist/mutations";
import { HttpError } from "@/shared/http";
import { ParseError } from "@/shared/error/ParseError";
import { ITargetData } from "@/app/target/domain/Target.types";
import { ActionTypes as TargetActionTypes } from "@/ui/store/targets/actions";

export enum ActionTypes {
  getAllWatchlists = "getAllWatchlists",
  createWatchlist = "createWatchlist",
  deleteWatchlist = "deleteWatchlist",
  selectWatchlist = "selectWatchlist",
}

function throwExpression(errorMessage: string) {
  throw new Error(errorMessage);
}

export interface GetAllWatchlistsPayload {
  append?: boolean;
  url?: string;
  page?: number;
  page_size?: number;
}

export interface WatchlistInput {
  title: string;
  targets: Array<ITargetData>;
}
export const actions: ActionTree<WatchlistState, IRootState> = {
  async [ActionTypes.getAllWatchlists](
    { commit },
    payload?: GetAllWatchlistsPayload
  ) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.GetAllWatchlists);
    const callbacks: Callbacks = {
      respondWithSuccess: (watchlists: IWatchlistList) => {
        payload?.append
          ? commit(MutationTypes.APPEND_WATCHLISTS, watchlists.watchlists)
          : commit(MutationTypes.SET_WATCHLISTS, watchlists.watchlists);
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, watchlists.next);
        commit(MutationTypes.SET_PREV, watchlists.prev);
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, null);
        commit(MutationTypes.SET_PREV, null);
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, null);
        commit(MutationTypes.SET_PREV, null);
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, null);
        commit(MutationTypes.SET_PREV, null);
      },
    };
    interactor.execute(payload, callbacks);
  },
  async [ActionTypes.createWatchlist](
    { commit },
    watchlistInput: WatchlistInput
  ) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.CreateWatchlist);
    const callbacks: Callbacks = {
      respondWithSuccess: (watchlists: IWatchlistList) => {
        commit(MutationTypes.SET_WATCHLISTS, watchlists.watchlists);
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, watchlists.next);
        commit(MutationTypes.SET_PREV, watchlists.prev);
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, null);
        commit(MutationTypes.SET_PREV, null);
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, null);
        commit(MutationTypes.SET_PREV, null);
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, null);
        commit(MutationTypes.SET_PREV, null);
      },
    };
    try {
      const requestModel: CreateWatchlistRequestModel = {
        title: watchlistInput.title ?? throwExpression("title required"),
        targets: watchlistInput.targets,
      };
      interactor.execute(requestModel, callbacks);
    } catch (error) {
      commit(MutationTypes.SET_WATCHLISTS, {} as IWatchlistData);
      commit(MutationTypes.SET_ERROR, error.message);
      commit(MutationTypes.SET_LOADING, false);
      commit(MutationTypes.SET_NEXT, null);
      commit(MutationTypes.SET_PREV, null);
    }
  },
  async [ActionTypes.deleteWatchlist]({ commit }, watchlist: string) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.DeleteWatchlist);
    const callbacks: Callbacks = {
      respondWithSuccess: (watchlists: IWatchlistList) => {
        commit(MutationTypes.SET_WATCHLISTS, watchlists.watchlists);
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, watchlists.next);
        commit(MutationTypes.SET_PREV, watchlists.prev);
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, null);
        commit(MutationTypes.SET_PREV, null);
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, null);
        commit(MutationTypes.SET_PREV, null);
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_WATCHLISTS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_NEXT, null);
        commit(MutationTypes.SET_PREV, null);
      },
    };
    try {
      interactor.execute(watchlist, callbacks);
    } catch (error) {
      commit(MutationTypes.SET_WATCHLISTS, {} as IWatchlistData);
      commit(MutationTypes.SET_ERROR, error.message);
      commit(MutationTypes.SET_LOADING, false);
      commit(MutationTypes.SET_NEXT, null);
      commit(MutationTypes.SET_PREV, null);
    }
  },
  async [ActionTypes.selectWatchlist](
    { commit, dispatch, state },
    index: number
  ) {
    commit(MutationTypes.SET_LOADING, true);
    const watchlist = state.watchlists[index];
    const interactor = container.get<UseCaseInteractor>(cid.SelectWatchlist);
    const callbacks: Callbacks = {
      respondWithSuccess: (watchlist: IWatchlistData) => {
        dispatch(
          "targets/" + TargetActionTypes.getTargets,
          {
            params: { url: watchlist.targets },
            paginationParams: { page_size: 10 },
          },
          {
            root: true,
          }
        );
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithClientError: (error: HttpError) => {
        commit(SingleWatchlistMutationType.SET_TITLE, "");
        commit(SingleWatchlistMutationType.SET_LAST_MATCH, "");
        commit(SingleWatchlistMutationType.SET_N_TARGETS, "");
        commit(SingleWatchlistMutationType.SET_URL, "");
        commit(SingleWatchlistMutationType.SET_ERROR, error.message);
        commit(SingleWatchlistMutationType.SET_LOADING, false);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithServerError: (error: HttpError) => {
        commit(SingleWatchlistMutationType.SET_TITLE, "");
        commit(SingleWatchlistMutationType.SET_LAST_MATCH, "");
        commit(SingleWatchlistMutationType.SET_N_TARGETS, "");
        commit(SingleWatchlistMutationType.SET_URL, "");
        commit(SingleWatchlistMutationType.SET_ERROR, error.message);
        commit(SingleWatchlistMutationType.SET_LOADING, false);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithParseError: (error: ParseError) => {
        commit(SingleWatchlistMutationType.SET_TITLE, "");
        commit(SingleWatchlistMutationType.SET_LAST_MATCH, "");
        commit(SingleWatchlistMutationType.SET_N_TARGETS, "");
        commit(SingleWatchlistMutationType.SET_URL, "");
        commit(SingleWatchlistMutationType.SET_ERROR, error.message);
        commit(SingleWatchlistMutationType.SET_LOADING, false);
        commit(MutationTypes.SET_LOADING, false);
      },
    };
    try {
      commit(
        "singleWatchlist/" + SingleWatchlistMutationType.SET_ID,
        watchlist.id,
        { root: true }
      );
      commit(
        "singleWatchlist/" + SingleWatchlistMutationType.SET_TITLE,
        watchlist.title,
        { root: true }
      );
      commit(
        "singleWatchlist/" + SingleWatchlistMutationType.SET_LAST_MATCH,
        watchlist.lastMatch,
        { root: true }
      );
      commit(
        "singleWatchlist/" + SingleWatchlistMutationType.SET_N_TARGETS,
        watchlist.nTargets,
        { root: true }
      );
      commit(
        "singleWatchlist/" + SingleWatchlistMutationType.SET_URL,
        watchlist.url,
        { root: true }
      );
      commit(
        "singleWatchlist/" + SingleWatchlistMutationType.SET_TARGETS,
        watchlist.targets,
        { root: true }
      );
      commit("singleWatchlist/" + SingleWatchlistMutationType.SET_ERROR, null, {
        root: true,
      });
      commit(
        "singleWatchlist/" + SingleWatchlistMutationType.SET_LOADING,
        false,
        { root: true }
      );
      interactor.execute(watchlist.url, callbacks);
    } catch (error) {
      commit(SingleWatchlistMutationType.SET_TITLE, "");
      commit(SingleWatchlistMutationType.SET_LAST_MATCH, "");
      commit(SingleWatchlistMutationType.SET_N_TARGETS, "");
      commit(SingleWatchlistMutationType.SET_URL, "");
      commit(SingleWatchlistMutationType.SET_ERROR, error.message);
      commit(SingleWatchlistMutationType.SET_LOADING, false);
      commit(MutationTypes.SET_LOADING, false);
    }
  },
};
