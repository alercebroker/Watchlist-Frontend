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
  bulkUpdateTargets = "bulkUpdateTargets",
}

export type GetTargetsPayload = {
  params: { watchlistId?: number; url?: string; append?: boolean };
  paginationParams?: { ordering?: string; page?: number; page_size?: number };
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
  async [ActionTypes.getTargets](
    { commit, state },
    payload: GetTargetsPayload
  ) {
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
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_TARGETS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_PAGINATION_DATA, {
          count: 0,
          nextPage: null,
          prevPage: null,
        });
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_TARGETS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_PAGINATION_DATA, {
          count: 0,
          nextPage: null,
          prevPage: null,
        });
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_ERROR, error.message);
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
  async [ActionTypes.bulkUpdateTargets](
    { commit, state },
    payload: BulkUpdateTargetsPayload
  ) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.BulkUpdateTargets);
    const callbacks: Callbacks = {
      respondWithSuccess: (targets: ITargetList) => {
        commit(MutationTypes.SET_TARGETS, targets.targets);
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_PAGINATION_DATA, {
          count: targets.count,
          nextPage: targets.next,
          prevPage: targets.prev,
        });
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_TARGETS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_PAGINATION_DATA, {
          count: 0,
          nextPage: null,
          prevPage: null,
        });
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_TARGETS, []);
        commit(MutationTypes.SET_LOADING, false);
        commit(MutationTypes.SET_PAGINATION_DATA, {
          count: 0,
          nextPage: null,
          prevPage: null,
        });
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_ERROR, error.message);
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
};
