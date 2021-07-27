import { isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { inject } from "inversify-props";
import { ITargetRepository } from "@/app/target/domain/Target.types";

export class GetTargets implements UseCaseInteractor {
  @inject() targetService!: ITargetRepository;
  async execute(params: any, callbacks: Callbacks): Promise<void> {
    const result = await this.targetService.getAllTargets(
      params.params,
      params.paginationParams
    );
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
