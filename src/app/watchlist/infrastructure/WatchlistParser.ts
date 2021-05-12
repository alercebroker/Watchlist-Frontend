import { ParseError } from "@/shared/error/ParseError";
import { err, ok, Result } from "neverthrow";
import { IWatchlistData, Watchlist } from "../domain";
import { WatchlistApiResult } from "./WatchlistService.types";

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
