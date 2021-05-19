import { TargetRequestModel } from "@/app/target/infrastructure/TargetService.types";
import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { Result } from "neverthrow";
import { CreateWatchlistRequestModel } from "../infrastructure/WatchlistService.types";

export interface IWatchlistData {
  title: string;
  owner: string | null;
}

export interface IWatchlistRepository {
  getAllWatchlists(): Promise<Result<IWatchlistData[], ParseError | HttpError>>;
  getOneWatchlist(
    id: number
  ): Promise<Result<IWatchlistData, ParseError | HttpError>>;
  createWatchlist(
    params: CreateWatchlistRequestModel,
    //targets: TargetRequestModel[] | null
  ): Promise<Result<IWatchlistData[], ParseError | HttpError>>;
}
