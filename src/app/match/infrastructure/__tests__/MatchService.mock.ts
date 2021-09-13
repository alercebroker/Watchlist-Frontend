import { ParseError } from "@/shared/error/ParseError";
import { HttpError, TestActions } from "@/shared/http";
import { inject } from "inversify-props";
import { err, ok, Result } from "neverthrow";
import { mockMatches } from "../../domain/Match.mock";
import { IMatchData, IMatchRepository } from "../../domain/Match.types";

export class MatchServiceMock implements IMatchRepository {
  constructor(@inject("ActionType") private actionType: TestActions) {}

  getAllMatches(
    watchlistId: number,
    targetId: number
  ): Promise<Result<IMatchData[], ParseError | HttpError>> {
    throw new Error("Method not implemented.");
  }
  getMatchesFromUrl(
    url: string
  ): Promise<Result<IMatchData[], ParseError | HttpError>> {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        resolve(ok(mockMatches));
      });
    } else if (
      this.actionType === "error" ||
      this.actionType === "serverError"
    ) {
      return new Promise((resolve) => {
        resolve(err(new HttpError(500, {}, "Server Error")));
      });
    } else if (this.actionType === "clientError") {
      return new Promise((resolve) => {
        resolve(err(new HttpError(400, {}, "Client Error")));
      });
    } else if (this.actionType === "timeout") {
      return new Promise((resolve) => {
        resolve(err(new HttpError(502, {}, "Gateway Timeout")));
      });
    } else if (this.actionType === "parseError") {
      return new Promise((resolve) => {
        resolve(err(new ParseError("Parse Error")));
      });
    } else {
      return new Promise((resolve) => {
        resolve(err(new Error("Application Error")));
      });
    }
  }
}
