import { isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { cid, inject } from "inversify-props";
import { IUserRepository } from "../domain/User.types";
import { ActivateUserApiRequestModel } from "../infrastructure/AuthService.types";

export class Activate implements UseCaseInteractor {
  constructor(@inject(cid.AuthService) private authService: IUserRepository) {}

  async execute(
    params: ActivateUserApiRequestModel,
    callbacks: Callbacks
  ): Promise<void> {
    const result = await this.authService.activate(params);
    result
      .map(() => {
        callbacks.respondWithSuccess();
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
