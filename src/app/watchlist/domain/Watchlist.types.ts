import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { Result } from "neverthrow";
import { CreateWatchlistRequestModel } from "../infrastructure/WatchlistService.types";

export interface IWatchlistData {
  id: number;
  url: string;
  nTargets: string;
  lastMatch: string;
  title: string;
  owner: string;
  notificationRate: string | null;
  lastNotified: string | null;
  targets: string | null; // url to targets
}

export interface IWatchlistList {
  watchlists: IWatchlistData[];
  next: string;
  prev: string;
}

export interface IWatchlistRepository {
  getAllWatchlists(
    params?: any
  ): Promise<Result<IWatchlistList, ParseError | HttpError>>;
  getWatchlistsFromUrl(
    url: string
  ): Promise<Result<IWatchlistList, ParseError | HttpError>>;
  getOneWatchlist(
    url: string
  ): Promise<Result<IWatchlistData, ParseError | HttpError>>;
  createWatchlist(
    params: CreateWatchlistRequestModel
  ): Promise<Result<IWatchlistList, ParseError | HttpError>>;
  deleteWatchlist(
    url: string
  ): Promise<Result<IWatchlistList, ParseError | HttpError>>;
  editWatchlist(
    params: any
  ): Promise<Result<IWatchlistData, ParseError | HttpError>>;
  editTargetsWatchlist(
    params: any
  ): Promise<Result<IWatchlistData, ParseError | HttpError>>;
}
