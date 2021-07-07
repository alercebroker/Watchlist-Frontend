import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { inject } from "inversify-props";
import { IUserRepository } from "../domain/User.types";

export class Logout implements UseCaseInteractor {
  @inject() authService!: IUserRepository;
  execute(_: null, callbacks: Callbacks): void {
    const result = this.authService.logout();
    result
      .map((userData) => {
        callbacks.respondWithSuccess(userData);
      })
      .mapErr((error: Error) => {
        callbacks.respondWithAppError
          ? callbacks.respondWithAppError(error)
          : () => {
              throw error;
            };
      });
  }
}
