import { ParseError } from "@/shared/error/ParseError";
import { err, ok, Result } from "neverthrow";
import { IWatchlistData, Watchlist } from "../domain";
import { CreateWatchlistApiResponse, WatchlistApiResult } from "./WatchlistService.types";

export class WatchlistApiParser {
    toDomain(
        apiResponse: WatchlistApiResult,
        owner: string
    ): Result<IWatchlistData, ParseError> {
        try {
            const watchlistData = {
                title: apiResponse.title,
                owner: owner,
            };
            const watchlist = new Watchlist(watchlistData);
            return ok(watchlist);
        } catch (error) {
            return err(new ParseError(error.message));
        }
    }
}

export class WatchlistCreateApiParser {
    parseCreateWatchlistApiResponse(
        response: CreateWatchlistApiResponse,
    ): Result<Watchlist, ParseError> {
        try {
            // CREAR TARGETS
            return ok(
                new Watchlist({
                    title: response.title,
                    owner: "owner"
                })
            );
        } catch (error) {
            return err(new ParseError(error.message));
        } 
    }
}

