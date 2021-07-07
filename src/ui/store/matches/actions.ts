import { container, cid } from "inversify-props";
import { ActionTree } from "vuex";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { IMatchData } from "@/app/match/domain/Match.types";
import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { IRootState } from "../Store.types";
import { MutationTypes } from "./mutations";
import { MatchesState } from "./state";

export enum ActionTypes {
  getAllMatches = "getAllMatches",
}

export interface GetMatchesPayload {
  url?: string;
  watchlistId: number;
  targetId: number;
}

export const actions: ActionTree<MatchesState, IRootState> = {
  async [ActionTypes.getAllMatches]({ commit }, payload: GetMatchesPayload) {
    const interactor = container.get<UseCaseInteractor>(cid.GetMatches);
    commit(MutationTypes.SET_LOADING, true);
    const callbacks: Callbacks = {
      respondWithSuccess: (matches: IMatchData[]) => {
        commit(MutationTypes.SET_MATCHES, matches);
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_MATCHES, []);
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_MATCHES, []);
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_MATCHES, []);
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithAppError: (error: Error) => {
        commit(MutationTypes.SET_MATCHES, []);
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_LOADING, false);
      },
    };
    interactor.execute(payload, callbacks);
  },
};
