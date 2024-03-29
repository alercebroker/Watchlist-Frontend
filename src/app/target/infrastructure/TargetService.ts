import { ParseError } from "@/shared/error/ParseError";
import { HttpError, IHttpService, isHttpError } from "@/shared/http";
import { UsersApiService } from "@/shared/http/UsersApiService";
import { inject } from "inversify-props";
import { combine, err, ok, Result } from "neverthrow";
import {
  CreateTargetParams,
  DeleteTargetParams,
  ITargetData,
  ITargetList,
  ITargetRepository,
} from "../domain/Target.types";
import { TargetParser } from "./TargetParser";
import {
  TargetCreateApiResponse,
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

  async downloadTargetsCsv(params: {
    watchlistId: number;
    watchlistName: string;
  }): Promise<Result<boolean, ParseError | HttpError>> {
    const result = await this.httpService.get(
      { url: "/watchlists/" + params.watchlistId + "/csv_targets/" },
      { parseTo: this.parser.parseCsvToBlob }
    );

    if (result.isOk()) {
      const url = window.URL.createObjectURL(result.value);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        "watchlist_" + params.watchlistName + "_targets.csv"
      );
      document.body.appendChild(link);
      link.click();
      return ok(true);
    } else {
      return err(result.error);
    }
  }

  async deleteTarget(
    params: DeleteTargetParams
  ): Promise<Result<number, ParseError | HttpError>> {
    const result = await this.httpService.delete({
      url:
        "/watchlists/" + params.watchlist + "/targets/" + params.target + "/",
    });
    if (result.isOk()) {
      return ok(params.target);
    } else {
      return result;
    }
  }

  createTarget(
    params: CreateTargetParams
  ): Promise<Result<ITargetData, ParseError | HttpError>> {
    const parseTo = (response: TargetCreateApiResponse) => {
      return this.parser.toDomain(response);
    };
    return this.httpService.post(
      {
        url: "/watchlists/" + params.watchlist + "/targets/",
        data: params.target,
      },
      { parseTo }
    );
  }

  editTarget(params: {
    target: ITargetData;
    watchlist: number;
    url?: string;
  }): Promise<Result<ITargetData, ParseError | HttpError>> {
    const parseTo = (response: TargetEditApiResponse) => {
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
            "/watchlists/" +
            params.watchlist +
            "/targets/" +
            params.target.id +
            "/",
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
    if (result.isErr()) {
      return result;
    }
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
