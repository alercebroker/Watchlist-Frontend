import { ParseError } from "@/shared/error/ParseError";
import { HttpError, IHttpService } from "@/shared/http";
import { combine, err, Result } from "neverthrow";
import { IWatchlistData, IWatchlistRepository, Watchlist } from "../domain";
import { inject } from "inversify-props";
import {
  WatchlistApiResponse,
  CreateWatchlistRequestModel,
  CreateWatchlistApiResponse,
} from "./WatchlistService.types";
import { WatchlistApiParser, WatchlistCreateApiParser } from "./WatchlistParser";

export class WatchlistService implements IWatchlistRepository {
  httpService: IHttpService;
  parser: WatchlistApiParser;
  parserCreate: WatchlistCreateApiParser;
  constructor(@inject() httpService: IHttpService) {
    this.parser = new WatchlistApiParser();
    this.parserCreate = new WatchlistCreateApiParser();
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
  async createWatchlist(
    params: CreateWatchlistRequestModel,
    //targets: any[] | null,
  ): Promise<Result<IWatchlistData[], ParseError | HttpError>> {
    console.log("WATCHLIST SERVICE", params)
    const parseTo = (response: CreateWatchlistApiResponse) => {
      return this.parserCreate.parseCreateWatchlistApiResponse(response);
    }
    const result = await this.httpService.post(
      { url: "/watchlists", data: params },
      { parseTo }
    );
    if(result.isOk()){
      return this.getAllWatchlists();
    } else {
      return err(result.error);
    }
  }
}
