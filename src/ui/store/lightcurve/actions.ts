import { cid, container } from "inversify-props";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { MutationTypes } from "@/ui/store/lightcurve/mutations";
import { ActionTree } from "vuex";
import { IRootState } from "../Store.types";
import { LightCurveState } from "./state";
import { ILightCurveData } from "@/app/lightcurve/domain/LightCurve.types";
import { HttpError } from "@/shared/http";
import { ParseError } from "@/shared/error/ParseError";

export enum ActionTypes {
  getLightCurveData = "getLightCurveData",
}

export type SelectTargetPayload = {
  target: number;
};

export const actions: ActionTree<LightCurveState, IRootState> = {
  [ActionTypes.getLightCurveData]({ commit }, payload) {
    commit(MutationTypes.SET_LOADING, true);
    const interactor = container.get<UseCaseInteractor>(cid.GetLightCurve);
    const callbacks: Callbacks = {
      respondWithSuccess: (lightcurve: ILightCurveData) => {
        commit(MutationTypes.SET_DATA, lightcurve);
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
};
