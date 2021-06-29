import { TargetRequestModel } from "@/app/target/infrastructure/TargetService.types";
import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { Result } from "neverthrow";
import { CreateWatchlistRequestModel } from "../infrastructure/WatchlistService.types";

export interface IWatchlistData {
  url: string;
  nTargets: string;
  lastMatch: string;
  title: string;
  owner: string;
  targets: string | null; // url to targets
}

export interface IWatchlistRepository {
  getAllWatchlists(): Promise<Result<IWatchlistData[], ParseError | HttpError>>;
  getOneWatchlist(
    url: string
  ): Promise<Result<IWatchlistData, ParseError | HttpError>>;
  createWatchlist(
    params: CreateWatchlistRequestModel
  ): Promise<Result<IWatchlistData[], ParseError | HttpError>>;
  deleteWatchlist(
    url: string
  ): Promise<Result<IWatchlistData[], ParseError | HttpError>>;
}
