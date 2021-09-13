import { isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { inject } from "inversify-props";
import { EditTargetParams, ITargetRepository } from "../domain/Target.types";

export class EditTarget implements UseCaseInteractor {
  @inject() targetService!: ITargetRepository;
  async execute(params: EditTargetParams, callbacks: Callbacks): Promise<void> {
    const result = await this.targetService.editTarget(params);
    result
      .map((targets) => {
        callbacks.respondWithSuccess(targets);
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
