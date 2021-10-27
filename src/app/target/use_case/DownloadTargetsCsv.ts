import { isParseError } from "@/shared/error/ParseError";
import { isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { inject } from "inversify-props";
import { ITargetRepository } from "../domain/Target.types";

export class DownloadTargetsCsv implements UseCaseInteractor {
  @inject() targetService!: ITargetRepository;
  async execute(
    params: { watchlistId: number; watchlistName: string },
    callbacks: Callbacks
  ): Promise<void> {
    const result = await this.targetService.downloadTargetsCsv(params);
    result
      .map((val) => {
        callbacks.respondWithSuccess(val);
      })
      .mapErr((error) => {
        if (isHttpError(error)) {
          if (error.isClientError()) {
            callbacks.respondWithClientError(error);
          } else {
            callbacks.respondWithServerError(error);
          }
        } else if (isParseError(error)) {
          callbacks.respondWithParseError;
        } else if (callbacks.respondWithAppError) {
          callbacks.respondWithAppError(error);
        }
      });
  }
}
