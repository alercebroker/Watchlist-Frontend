import { isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { inject } from "inversify-props";
import { IUserRepository } from "../domain/User.types";
import { LoginUserApiRequestModel } from "../infrastructure/AuthService.types";

export class Login implements UseCaseInteractor {
  @inject() authService!: IUserRepository;
  async execute(
    params: LoginUserApiRequestModel,
    callbacks: Callbacks
  ): Promise<void> {
    const result = await this.authService.login(params);
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
