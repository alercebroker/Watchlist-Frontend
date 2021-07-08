import { isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { inject } from "inversify-props";
import { IWatchlistRepository } from "../domain";

export class GetAllWatchlists implements UseCaseInteractor {
  @inject() watchlistService!: IWatchlistRepository;
  async execute(
    params: { url?: string; page?: number; page_size?: number },
    callbacks: Callbacks
  ): Promise<void> {
    const result = params.url
      ? await this.watchlistService.getWatchlistsFromUrl(params.url)
      : await this.watchlistService.getAllWatchlists(params);
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
