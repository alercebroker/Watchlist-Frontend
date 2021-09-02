import { isHttpError } from "@/shared/http";
import {
  Callbacks,
  UseCaseInteractor,
} from "@/shared/usecase/UseCaseInteractor.types";
import { inject } from "inversify-props";
import { IWatchlistRepository } from "../domain";

export class EditWatchlist implements UseCaseInteractor {
  @inject() watchlistService!: IWatchlistRepository;
  async execute(params: any, callbacks: Callbacks): Promise<void> {
    const result = await this.watchlistService.editWatchlist(params);
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
