import { ParseError } from "@/shared/error/ParseError";
import { HttpError, IHttpService } from "@/shared/http";
import { combine, Result } from "neverthrow";
import { IWatchlistData, IWatchlistRepository } from "../domain";
import { inject } from "inversify-props";
import {
  WatchlistApiResponse,
  WatchlistRequestModel,
} from "./WatchlistService.types";
import { WatchlistApiParser } from "./WatchlistParser";

export class WatchlistService implements IWatchlistRepository {
  httpService: IHttpService;
  parser: WatchlistApiParser;
  constructor(@inject() httpService: IHttpService) {
    this.parser = new WatchlistApiParser();
    this.httpService = httpService;
    this.httpService.initService("");
  }
  async getAllWatchlists(): Promise<
    Result<IWatchlistData[], ParseError | HttpError>
  > {
    const parseTo = (response: WatchlistApiResponse) => {
      const owner = "owner";
      const watchlists = response.results.map((x) =>
        this.parser.toDomain(x, owner)
      );
      return combine(watchlists);
    };
    return await this.httpService.get({ url: "/watchlist" }, { parseTo });
  }
  getOneWatchlist(
    id: number
  ): Promise<Result<IWatchlistData, ParseError | HttpError>> {
    throw new Error("Method not implemented.");
  }
  createWatchlist(
    params: WatchlistRequestModel,
    targets: any[] | null,
  ): Promise<Result<IWatchlistData, ParseError | HttpError>> {
    // SE RECIBEN TARGETS PARSEADOS
    throw new Error("Method not implemented.");
  }
}
