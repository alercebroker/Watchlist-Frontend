import { ActionTree } from "vuex";
import { IRootState } from "../Store.types";
import { TargetsState } from "./state";
import { cid, container } from "inversify-props";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { HttpError } from "@/shared/http";
import { ParseError } from "@/shared/error/ParseError";
import { ITargetData, ITargetList } from "@/app/target/domain/Target.types";
import { MutationTypes } from "@/ui/store/targets/mutations";

export enum ActionTypes {
  getTargets = "getTargets",
  editTarget = "editTarget",
  createTarget = "createTarget",
  deleteTarget = "deleteTarget",
  downloadTargets = "downloadTargets",
  bulkUpdateTargets = "bulkUpdateTargets",
}

export type GetTargetsPayload = {
  params: { watchlistId?: number; url?: string; append?: boolean };
  paginationParams?: { ordering?: string; page?: number; page_size?: number };
};

export type EditTargetPayload = {
  target: { id: number; name: string; ra: number; dec: number; radius: number };
  watchlist: number;
  url?: string;
};

export type CreateTargetPayload = {
  target: { name: string; ra: number; dec: number; radius: number };
  watchlist: number;
};

export type DeleteTargetPayload = {
  target: number;
  watchlist: number;
};

export type DownloadTargetsPayload = {
  watchlistId: number;
};

export type BulkUpdateTargetsPayload = {
  params: { watchlistId?: number; targetList: ITargetData[] };
  paginationParams?: { ordering?: string; page?: number; page_size?: number };
};

export interface BulkUpdateTargetsInput {
  watchlistId: number;
  targetsList: Array<ITargetData>;
}

export const actions: ActionTree<TargetsState, IRootState> = {
  async [ActionTypes.getTargets]({ commit }, payload: GetTargetsPayload) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.GetTargets);
    const callbacks: Callbacks = {
      respondWithSuccess: (targets: ITargetList) => {
        payload.params.append
          ? commit(MutationTypes.APPEND_TARGETS, targets.targets)
          : commit(MutationTypes.SET_TARGETS, targets.targets);
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_PAGINATION_DATA, {
          count: targets.count,
          nextPage: targets.next,
          prevPage: targets.prev,
        });
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_TARGETS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_PAGINATION_DATA, {
          count: 0,
          nextPage: null,
          prevPage: null,
        });
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_TARGETS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_PAGINATION_DATA, {
          count: 0,
          nextPage: null,
          prevPage: null,
        });
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_ERROR, error);
        commit(MutationTypes.SET_TARGETS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_PAGINATION_DATA, {
          count: 0,
          nextPage: null,
          prevPage: null,
        });
      },
    };
    interactor.execute(payload, callbacks);
  },
  async [ActionTypes.editTarget]({ commit }, payload: EditTargetPayload) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.EditTarget);
    const callbacks: Callbacks = {
      respondWithSuccess: (target: ITargetData) => {
        commit(MutationTypes.UPDATE_TARGET, target);
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
  [ActionTypes.createTarget]({ commit }, payload: CreateTargetPayload) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.CreateTarget);
    const callbacks: Callbacks = {
      respondWithSuccess: (target: ITargetData) => {
        commit(MutationTypes.APPEND_TARGETS, [target]);
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
    interactor.execute(payload, callbacks);
  },
  [ActionTypes.deleteTarget]({ commit }, payload: DeleteTargetPayload) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.DeleteTarget);
    const callbacks: Callbacks = {
      respondWithSuccess: (target: number) => {
        commit(MutationTypes.DELETE_TARGET, target);
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
    interactor.execute(payload, callbacks);
  },
  [ActionTypes.downloadTargets](
    { commit, rootState },
    payload: DownloadTargetsPayload
  ) {
    const interactor = container.get<UseCaseInteractor>(cid.DownloadTargetsCsv);
    commit(MutationTypes.SET_LOADING, true);
    interactor.execute(
      {
        watchlistId: payload.watchlistId,
        watchlistName: rootState.singleWatchlist.title,
      },
      {
        respondWithSuccess: () => {
          commit(MutationTypes.SET_ERROR, null);
          commit(MutationTypes.SET_LOADING, false);
        },
        respondWithClientError: (error: HttpError) => {
          commit(MutationTypes.SET_ERROR, error);
          commit(MutationTypes.SET_LOADING, false);
          alert("Error downloading targets: " + error);
        },
        respondWithServerError: (error: HttpError) => {
          commit(MutationTypes.SET_ERROR, error);
          commit(MutationTypes.SET_LOADING, false);
          alert("Error downloading targets: " + error);
        },
        respondWithParseError: (error: ParseError) => {
          commit(MutationTypes.SET_ERROR, error);
          commit(MutationTypes.SET_LOADING, false);
          alert("Error downloading targets: " + error);
        },
        respondWithAppError: (error: Error) => {
          commit(MutationTypes.SET_ERROR, error);
          commit(MutationTypes.SET_LOADING, false);
          alert("Error downloading targets: " + error);
        },
      } as Callbacks
    );
  },
  async [ActionTypes.bulkUpdateTargets](
    { commit },
    payload: BulkUpdateTargetsPayload
  ) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.BulkUpdateTargets);
    const callbacks: Callbacks = {
      respondWithSuccess: (targets: ITargetList) => {
        commit(MutationTypes.SET_TARGETS, targets.targets);
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
    try {
      await interactor.execute(payload, callbacks);
    } catch (error) {
      commit(MutationTypes.SET_ERROR, error);
      commit(MutationTypes.SET_LOADING, false);
    }
  },
};
