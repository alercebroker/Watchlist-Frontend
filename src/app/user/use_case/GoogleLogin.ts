import { isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { cid, inject } from "inversify-props";
import { IUserRepository } from "../domain/User.types";
import { LoginGoogleApiRequestModel } from "../infrastructure/AuthService.types";

export class GoogleLogin implements UseCaseInteractor {
  constructor(@inject(cid.AuthService) private authService: IUserRepository) {}

  async execute(
    params: LoginGoogleApiRequestModel,
    callbacks: Callbacks
  ): Promise<void> {
    const result = await this.authService.googleLogin(params);
    result
      .map((userData) => {
        callbacks.respondWithSuccess(userData);
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
