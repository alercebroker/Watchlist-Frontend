import { isHttpError } from "@/shared/http";
import { Callbacks, UseCaseInteractor } from "@/shared/usecase/UseCaseInteractor.types";
import { inject } from "inversify-props";
import { IWatchlistRepository } from "../domain";

export class SelectWatchlist implements UseCaseInteractor {
    @inject() watchlistService!: IWatchlistRepository;
    async execute(params: any, callbacks: Callbacks): Promise<void> {
        console.log('usaecase execute', params)
        const result = await this.watchlistService.getOneWatchlist(params);
        result
            .map((watchlist) => {
                callbacks.respondWithSuccess(watchlist)
            }).mapErr((error) => {
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
