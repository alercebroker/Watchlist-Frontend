import { ParseError } from "@/shared/error/ParseError";
import { err, ok, Result } from "neverthrow";
import { IWatchlistData, Watchlist } from "../domain";
import { FilterParams } from "../../../shared/types/filter.types";
import {
  CreateWatchlistApiResponse,
  WatchlistApiResult,
  EditTargetsOneWatchlist,
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
        notificationRate: apiResponse.notification_rate,
        lastNotified: apiResponse.last_notified,
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
          notificationRate: "",
          lastNotified: "",
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

export class watchlistApiTargetParser {
  parseNewTargets(response: any){
    try {
      return response;
    } catch (error) {
      return err(new ParseError(error.message));
    }
  }
}
