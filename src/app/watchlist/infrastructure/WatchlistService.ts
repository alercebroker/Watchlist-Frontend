import { ParseError } from "@/shared/error/ParseError";
import { HttpError, IHttpService } from "@/shared/http";
import { combine, err, ok, Result } from "neverthrow";
import {
  IWatchlistData,
  IWatchlistList,
  IWatchlistRepository,
} from "../domain";
import { inject } from "inversify-props";
import {
  WatchlistApiResponse,
  CreateWatchlistRequestModel,
  EditWatchlistRequestModel,
  CreateWatchlistApiResponse,
  OneWatchlistApiResponse,
} from "./WatchlistService.types";
import {
  WatchlistApiParser,
  WatchlistCreateApiParser,
} from "./WatchlistParser";
import { UsersApiService } from "@/shared/http/UsersApiService";

export class WatchlistService implements IWatchlistRepository {
  httpService: IHttpService;
  parser: WatchlistApiParser;
  parserCreate: WatchlistCreateApiParser;

  constructor(@inject() usersApiService: UsersApiService) {
    this.parser = new WatchlistApiParser();
    this.parserCreate = new WatchlistCreateApiParser();
    this.httpService = usersApiService;
  }

  async getAllWatchlists(params?: {
    page?: number;
    page_size?: number;
  }): Promise<Result<IWatchlistList, ParseError | HttpError>> {
    let next: string;
    let prev: string;
    const parseTo = (
      response: WatchlistApiResponse
    ): Result<IWatchlistList, ParseError> => {
      const owner = "owner";
      const watchlists = response.results.map((x) =>
        this.parser.toDomain(x, owner)
      );
      next = response.next;
      prev = response.previous;
      const combined = combine(watchlists);
      if (combined.isOk()) {
        return ok({
          watchlists: combined.value,
          next,
          prev,
        });
      } else {
        return err(combined.error);
      }
    };
    return await this.httpService.get({ url: "/watchlists/" }, { parseTo });
  }

  async getWatchlistsFromUrl(
    url: string
  ): Promise<Result<IWatchlistList, ParseError | HttpError>> {
    let next: string;
    let prev: string;
    const parseTo = (
      response: WatchlistApiResponse
    ): Result<IWatchlistList, ParseError> => {
      const owner = "owner";
      const watchlists = response.results.map((x) =>
        this.parser.toDomain(x, owner)
      );
      next = response.next;
      prev = response.previous;
      const combined = combine(watchlists);
      if (combined.isOk()) {
        return ok({
          watchlists: combined.value,
          next,
          prev,
        });
      } else {
        return err(combined.error);
      }
    };
    return await this.httpService.get({ url }, { parseTo });
  }

  async getOneWatchlist(
    url: string
  ): Promise<Result<IWatchlistData, ParseError | HttpError>> {
    const parseTo = (response: OneWatchlistApiResponse) => {
      const owner = "owner";
      return this.parser.toDomain(response, owner);
    };
    return await this.httpService.get({ url }, { parseTo });
  }

  async createWatchlist(
    params: CreateWatchlistRequestModel
  ): Promise<Result<IWatchlistList, ParseError | HttpError>> {
    const parseTo = (response: CreateWatchlistApiResponse) => {
      return this.parserCreate.parseCreateWatchlistApiResponse(response);
    };
    const result = await this.httpService.post(
      { url: "/watchlists/", data: params },
      { parseTo }
    );
    if (result.isOk()) {
      return this.getAllWatchlists();
    } else {
      return err(result.error);
    }
  }

  async deleteWatchlist(
    url: string
  ): Promise<Result<IWatchlistList, ParseError | HttpError>> {
    const result = await this.httpService.delete({ url: url });

    if (result.isOk()) {
      return this.getAllWatchlists();
    } else {
      return err(result.error);
    }
  }

  async editWatchlist(params: {
    params: EditWatchlistRequestModel;
    watchlist: number;
    url?: string;
  }): Promise<Result<IWatchlistData, ParseError | HttpError>> {
    const parseTo = (response: OneWatchlistApiResponse) => {
      const owner = "owner";
      return this.parser.toDomain(response, owner);
    };
    if (params.url)
      return this.httpService.put(
        { url: params.url, data: params.params },
        { parseTo }
      );
    else
      return this.httpService.put(
        {
          url: "/watchlists/" + params.watchlist + "/",
          data: params.params,
        },
        { parseTo }
      );
  }
}
