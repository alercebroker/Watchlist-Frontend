import { ParseError } from "@/shared/error/ParseError";
import { err, ok, Result } from "neverthrow";
import { IWatchlistData, Watchlist } from "../domain";
import {
  CreateWatchlistApiResponse,
  WatchlistApiResult,
} from "./WatchlistService.types";

export class WatchlistApiParser {
  toDomain(
    apiResponse: WatchlistApiResult,
    owner: string
  ): Result<IWatchlistData, ParseError> {
    try {
      const watchlistData: IWatchlistData = {
        id: apiResponse.id,
        title: apiResponse.title,
        owner: owner,
        targets: apiResponse.targets,
        nTargets: apiResponse.n_targets,
        lastMatch: apiResponse.last_match,
        url: apiResponse.url,
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
    response: CreateWatchlistApiResponse
  ): Result<Watchlist, ParseError> {
    try {
      // this returned watchlist is not going to be used
      return ok(
        new Watchlist({
          id: -1,
          title: response.title,
          owner: "owner",
          targets: "",
          url: "",
          nTargets: "",
          lastMatch: "",
        })
      );
    } catch (error) {
      return err(new ParseError(error.message));
    }
  }
}
