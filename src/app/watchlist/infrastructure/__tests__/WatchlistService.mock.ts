import { TargetRequestModel } from "@/app/target/infrastructure/TargetService.types";
import { ParseError } from "@/shared/error/ParseError";
import { HttpError, TestActions } from "@/shared/http";
import { inject } from "inversify-props";
import { err, ok, Result } from "neverthrow";
import { IWatchlistData, IWatchlistRepository } from "../../domain";
import { WatchlistRequestModel } from "../WatchlistService.types";

const watchlistArray: IWatchlistData[] = [
  {
    title: "watchlist 1",
    owner: "owner 1",
  },
  {
    title: "watchlist 2",
    owner: "owner 1",
  },
];

export class MockWatchlistService implements IWatchlistRepository {
  actionType: TestActions;
  constructor(@inject("ActionType") actionType: TestActions) {
    this.actionType = actionType;
  }
  getAllWatchlists(): Promise<
    Result<IWatchlistData[], ParseError | HttpError>
  > {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        resolve(ok(watchlistArray));
      });
    } else if (
      this.actionType === "error" ||
      this.actionType === "serverError"
    ) {
      return new Promise((resolve) => {
        resolve(err(new HttpError(500, "Server Error")));
      });
    } else if (this.actionType === "clientError") {
      return new Promise((resolve) => {
        resolve(err(new HttpError(400, "Client Error")));
      });
    } else if (this.actionType === "timeout") {
      return new Promise((resolve) => {
        resolve(err(new HttpError(502, "Gateway Timeout")));
      });
    }
    return new Promise((resolve) => {
      resolve(err(new ParseError("Parse Error")));
    });
  }
  getOneWatchlist(
    id: Number
  ): Promise<Result<IWatchlistData, ParseError | HttpError>> {
    throw new Error("Method not implemented.");
  }
  createWatchlist(
    params: WatchlistRequestModel,
    targets: TargetRequestModel[] | null
  ): Promise<Result<IWatchlistData, ParseError | HttpError>> {
    throw new Error("Method not implemented.");
  }
}
