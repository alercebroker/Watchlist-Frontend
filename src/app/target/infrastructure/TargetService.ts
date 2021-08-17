import { ParseError } from "@/shared/error/ParseError";
import { HttpError, IHttpService } from "@/shared/http";
import { UsersApiService } from "@/shared/http/UsersApiService";
import { inject } from "inversify-props";
import { combine, err, ok, Result } from "neverthrow";
import {
  ITargetData,
  ITargetList,
  ITargetRepository,
} from "../domain/Target.types";
import { TargetParser } from "./TargetParser";
import {
  TargetEditApiResponse,
  WatchlistTargetsApiResponse,
} from "./TargetService.types";

type PaginationParams = {
  ordering?: string;
  page?: number;
  page_size?: number;
};

export class TargetService implements ITargetRepository {
  httpService: IHttpService;
  parser: TargetParser;
  constructor(@inject() usersApiService: UsersApiService) {
    this.httpService = usersApiService;
    this.parser = new TargetParser();
  }

  editTarget(params: {
    target: ITargetData;
    watchlist: number;
    url?: string;
  }): Promise<Result<ITargetData, ParseError | HttpError>> {
    const parseTo = (response: TargetEditApiResponse) => {
      response;
      return this.parser.toDomain(response);
    };
    if (params.url)
      return this.httpService.put(
        { url: params.url, data: params.target },
        { parseTo }
      );
    else
      return this.httpService.put(
        {
          url:
            "/watchlists/" + params.watchlist + "/targets/" + params.target.id,
          data: params.target,
        },
        { parseTo }
      );
  }

  getAllTargets(
    params: { watchlistId?: number; url?: string },
    paginationParams?: PaginationParams
  ): Promise<Result<ITargetList, ParseError | HttpError>> {
    if (params.watchlistId) {
      return this.getTargetsFromWatchlistId(
        params.watchlistId,
        paginationParams
      );
    } else {
      return this.getTargetsFromUrl(params.url || "", paginationParams);
    }
  }

  async bulkUpdateTargets(
    params: {
      targetsList: ITargetData[];
      watchlistId: number;
    },
    paginationParams?: PaginationParams
  ): Promise<Result<ITargetList, ParseError | HttpError>> {
    const result = await this.httpService.put(
      {
        url: "/watchlists/" + params.watchlistId + "/batch_targets/",
        data: params.targetsList,
      },
      { parseTo: (): Result<ITargetList, ParseError> => ok({} as ITargetList) }
    );
    console.log(result);
    return this.getAllTargets(params, paginationParams);
  }

  private async getTargetsFromWatchlistId(
    id: number,
    params?: PaginationParams
  ): Promise<Result<ITargetList, ParseError | HttpError>> {
    let next: string | null;
    let prev: string | null;
    let count: number;
    const parseTo = (
      response: WatchlistTargetsApiResponse
    ): Result<ITargetList, ParseError> => {
      const targets = response.results.map((x) => {
        return this.parser.toDomain(x);
      });
      count = response.count;
      next = response.next;
      prev = response.previous;
      const combined = combine(targets);
      if (combined.isOk()) {
        return ok({
          targets: combined.value,
          next,
          prev,
          count,
        } as ITargetList);
      } else {
        return err(combined.error);
      }
    };
    return await this.httpService.get<WatchlistTargetsApiResponse, ITargetList>(
      { url: "/watchlists/" + id + "/targets/", params },
      { parseTo }
    );
  }

  private async getTargetsFromUrl(
    url: string,
    params?: PaginationParams
  ): Promise<Result<ITargetList, ParseError | HttpError>> {
    let next: string | null;
    let prev: string | null;
    let count: number;
    const parseTo = (
      response: WatchlistTargetsApiResponse
    ): Result<ITargetList, ParseError> => {
      const targets = response.results.map((x) => {
        return this.parser.toDomain(x);
      });
      count = response.count;
      next = response.next;
      prev = response.previous;
      const combined = combine(targets);
      if (combined.isOk()) {
        return ok({
          targets: combined.value,
          next,
          prev,
          count,
        } as ITargetList);
      } else {
        return err(combined.error);
      }
    };
    return await this.httpService.get({ url, config: { params } }, { parseTo });
  }
}
