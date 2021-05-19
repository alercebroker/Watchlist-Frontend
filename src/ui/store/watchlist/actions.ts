import { cid, container } from "inversify-props";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { 
  CreateWatchlistRequestModel 
} from "@/app/watchlist/infrastructure/WatchlistService.types"
import { ActionTree } from "vuex";
import { IRootState } from "../Store.types";
import { WatchlistState } from "./state";
import { IWatchlistData } from "@/app/watchlist/domain";
import { MutationTypes } from "./mutations";
import { HttpError } from "@/shared/http";
import { ParseError } from "@/shared/error/ParseError";

export enum ActionTypes {
  getAllWatchlists = "getAllWatchlists",
  createWatchlist = "createWatchlist",
  selectWatchlist = "selectWatchlist",
}

function throwExpression(errorMessage: string) {
  throw new Error(errorMessage);
}

export interface WatchlistInput {
  title: string,
  targets: Array<any>,
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
  async [ActionTypes.createWatchlist]({ commit }, watchlistInput: WatchlistInput) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.CreateWatchlist);
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
    }
  },
  async [ActionTypes.selectWatchlist]({ commit, dispatch, state }, index: number) {
    commit(MutationTypes.SET_LOADING, true);
    const watchlist = state.watchlists[index];
    console.log(watchlist)
    //url
    //title
    //targets
    //n_matches
    //last_match
    const interactor = container.get<UseCaseInteractor>(cid.SelectWatchlist);
    const callbacks: Callbacks = {
      respondWithSuccess: (watchlist: IWatchlistData) => {
        //setear datos de watchlist (otro modulo) (COMMIT)
        //dispatch getTargets (url | watchlist_id)(otro modulo) -> 
        // MUTATIONTYPE DE WATCHLIST SINGULAR
        //commit(MutationTypes.SET_TITLE)
        commit(MutationTypes.SET_WATCHLISTS, [watchlist]);
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
    try {
      interactor.execute(watchlist.url, callbacks);
    } catch (error) {
      commit(MutationTypes.SET_WATCHLISTS, {} as IWatchlistData);
      commit(MutationTypes.SET_ERROR, error.message);
      commit(MutationTypes.SET_LOADING, false);
    }
  }
  
};
