import { inject } from "inversify-props";
import { ParseError } from "@/shared/error/ParseError";
import { HttpError, isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { Result } from "neverthrow";
import { IMatchData, IMatchRepository } from "../domain/Match.types";

export class GetMatches implements UseCaseInteractor {
  constructor(@inject() private matchService: IMatchRepository) {}
  async execute(
    params: { url?: string; watchlistId: number; targetId: number },
    callbacks: Callbacks
  ): Promise<void> {
    let result: Result<IMatchData[], ParseError | HttpError>;
    if (params.url) {
      result = await this.matchService.getMatchesFromUrl(params.url);
    } else {
      result = await this.matchService.getAllMatches(
        params.watchlistId,
        params.targetId
      );
    }
    result
      .map((matches) => {
        callbacks.respondWithSuccess(matches);
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
