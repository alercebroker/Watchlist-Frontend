import { isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { cid, inject } from "inversify-props";
import { IUserRepository } from "../domain/User.types";

export class GetGoogleUrl implements UseCaseInteractor {
  constructor(@inject(cid.AuthService) private authService: IUserRepository) {}

  async execute(params: null, callbacks: Callbacks): Promise<void> {
    const result = await this.authService.getGoogleUrl();
    result
      .map((googleUrl) => {
        callbacks.respondWithSuccess(googleUrl);
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
