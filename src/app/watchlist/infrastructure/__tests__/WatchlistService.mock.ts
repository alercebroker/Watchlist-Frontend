import { ParseError } from "@/shared/error/ParseError";
import { HttpError, TestActions } from "@/shared/http";
import { inject } from "inversify-props";
import { err, ok, Result } from "neverthrow";
import {
  IWatchlistData,
  IWatchlistList,
  IWatchlistRepository,
} from "../../domain";
import { CreateWatchlistRequestModel } from "../WatchlistService.types";

const watchlistArray: IWatchlistData[] = [
  {
    id: 1,
    title: "watchlist 1",
    owner: "owner 1",
    targets: "test",
    url: "test",
    nTargets: "test",
    lastMatch: "test",
  },
  {
    id: 2,
    title: "watchlist 2",
    owner: "owner 1",
    targets: "test",
    url: "test",
    nTargets: "test",
    lastMatch: "test",
  },
];

const watchlist: IWatchlistData = {
  id: 3,
  title: "watchlist 3",
  owner: "owner 1",
  targets: "test",
  url: "test",
  nTargets: "test",
  lastMatch: "test",
};

export class MockWatchlistService implements IWatchlistRepository {
  actionType: TestActions;
  constructor(@inject("ActionType") actionType: TestActions) {
    this.actionType = actionType;
  }
  getWatchlistsFromUrl(
    url: string
  ): Promise<Result<IWatchlistList, ParseError | HttpError>> {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        resolve(ok({ watchlists: watchlistArray, next: "test", prev: "test" }));
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
  getAllWatchlists(): Promise<Result<IWatchlistList, ParseError | HttpError>> {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        resolve(ok({ watchlists: watchlistArray, next: "test", prev: "test" }));
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
    url: string
  ): Promise<Result<IWatchlistData, ParseError | HttpError>> {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        resolve(ok(watchlist));
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
  createWatchlist(
    params: CreateWatchlistRequestModel
    //targets: TargetRequestModel[] | null
  ): Promise<Result<IWatchlistList, ParseError | HttpError>> {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        const copy = [...watchlistArray];
        copy.push({
          id: 3,
          title: params.title,
          owner: "owner 1",
          targets: "test",
          url: "test",
          nTargets: "test",
          lastMatch: "test",
        });
        resolve(ok({ watchlists: copy, next: "test", prev: "test" }));
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

  deleteWatchlist(
    url: string
  ): Promise<Result<IWatchlistList, ParseError | HttpError>> {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        resolve(
          ok({ watchlists: [watchlistArray[0]], next: "test", prev: "test" })
        );
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
}
