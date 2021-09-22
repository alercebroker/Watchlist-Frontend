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

export type EditTargetParams = {
  target: ITargetData;
  watchlist: number;
  url?: string;
};

export type CreateTargetParams = {
  target: ITargetData;
  watchlist: number;
};

export type DeleteTargetParams = {
  target: number;
  watchlist: number;
};

export interface ITargetRepository {
  getAllTargets(
    params: { watchlistId?: number; url?: string },
    paginationParams?: { ordering?: string; page?: number; page_size?: number }
  ): Promise<Result<ITargetList, ParseError | HttpError>>;
  editTarget(
    params: EditTargetParams
  ): Promise<Result<ITargetData, ParseError | HttpError>>;
  createTarget(
    params: CreateTargetParams
  ): Promise<Result<ITargetData, ParseError | HttpError>>;
  deleteTarget(
    params: DeleteTargetParams
  ): Promise<Result<number, ParseError | HttpError>>;
  downloadTargetsCsv(params: {
    watchlistId: number;
    watchlistName: string;
  }): Promise<Result<boolean, ParseError | HttpError>>;
}
