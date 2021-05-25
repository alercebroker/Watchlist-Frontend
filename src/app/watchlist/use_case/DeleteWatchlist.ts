import { isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { inject } from "inversify-props";
import { IWatchlistRepository } from "../domain";

export class DeleteWatchlist implements UseCaseInteractor {
  @inject() watchlistService!: IWatchlistRepository;

  async execute(params: any, callbacks: Callbacks): Promise<void> {
    console.log('usecase DeleteWathlist params', params)
    const result = await this.watchlistService.deleteWatchlist(params);
    console.log('usecase DeleteWathlist result', result)
    result
      .map((watchlists) => {
        callbacks.respondWithSuccess(watchlists);
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
