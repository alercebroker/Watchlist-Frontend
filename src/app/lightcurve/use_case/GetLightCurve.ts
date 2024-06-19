import { isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { inject } from "inversify-props";
import { ILightCurveRepository } from "../domain/LightCurve.types";

export class GetLightCurve implements UseCaseInteractor {
  @inject() LightCurveService!: ILightCurveRepository;
  async execute(
    params: { objectId: string },
    callbacks: Callbacks
  ): Promise<void> {
    const result = await this.LightCurveService.getLightCurve(params.objectId);

    result
      .map((lightcurve) => {
        callbacks.respondWithSuccess(lightcurve);
      })
      .mapErr((error) => {
        if (isHttpError(error)) {
          if (error.isClientError()) {
            callbacks.respondWithClientError(error);
          } else {
            callbacks.respondWithServerError(error);
          }
        } else {
          callbacks.respondWithParseError(error);
        }
      });
  }
}
