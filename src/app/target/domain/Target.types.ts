import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { Result } from "neverthrow";

export interface ITargetData {
  id: number;
  url: string;
  name: string;
  radius: number;
  ra: number;
  dec: number;
  nMatches: number | null;
  lastMatch: string;
}

export interface ITargetList {
  targets: ITargetData[];
  next: string;
  prev: string;
  count: number;
}

export interface ITargetRepository {
  getAllTargets(
    params: { watchlistId?: number; url?: string },
    paginationParams?: { ordering?: string; page?: number; page_size?: number }
  ): Promise<Result<ITargetList, ParseError | HttpError>>;
  editTarget(params: {
    target: ITargetData;
    watchlist: number;
    url?: string;
  }): Promise<Result<ITargetData, ParseError | HttpError>>;
  bulkUpdateTargets(
    params: {
      targetsList: ITargetData[];
      watchlistId: number;
    },
    paginationParams?: { ordering?: string; page?: number; page_size?: number }
  ): Promise<Result<ITargetList, ParseError | HttpError>>;
}
