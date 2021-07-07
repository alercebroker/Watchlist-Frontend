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
import { ITargetData } from "@/app/target/domain/Target.types";
import { MutationTypes } from "@/ui/store/targets/mutations";

export enum ActionTypes {
  getTargets = "getTargets",
}

// function throwExpression(errorMessage: string) {
//   throw new Error(errorMessage);
// }
//
// export interface TargetsInput {
//   title: string,
//   targets: Array<any>,
// }

export const actions: ActionTree<TargetsState, IRootState> = {
  async [ActionTypes.getTargets]({ commit }, url: string) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.GetTargets);
    const callbacks: Callbacks = {
      respondWithSuccess: (targets: ITargetData[]) => {
        commit(MutationTypes.SET_TARGETS, targets);
        commit(MutationTypes.SET_ERROR, null);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithClientError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_TARGETS, []);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithServerError: (error: HttpError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_TARGETS, []);
        commit(MutationTypes.SET_LOADING, false);
      },
      respondWithParseError: (error: ParseError) => {
        commit(MutationTypes.SET_ERROR, error.message);
        commit(MutationTypes.SET_TARGETS, []);
        commit(MutationTypes.SET_LOADING, false);
      },
    };
    interactor.execute(url, callbacks);
  },
};
