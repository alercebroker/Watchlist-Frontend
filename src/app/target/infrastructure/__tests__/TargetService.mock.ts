import { ParseError } from "@/shared/error/ParseError";
import { HttpError, TestActions } from "@/shared/http";
import { inject } from "inversify-props";
import { err, ok, Result } from "neverthrow";
import {
  ITargetData,
  ITargetList,
  ITargetRepository,
} from "../../domain/Target.types";

const targetArray: ITargetData[] = [
  {
    id: 1,
    url: "test",
    name: "target 1",
    radius: 1.0,
    ra: 1.0,
    dec: 1.0,
    nMatches: 0,
    lastMatch: new Date().toISOString(),
  },
  {
    id: 2,
    url: "test",
    name: "target 2",
    radius: 1.0,
    ra: 1.0,
    dec: 1.0,
    nMatches: 0,
    lastMatch: new Date().toISOString(),
  },
];

export class MockTargetService implements ITargetRepository {
  actionType: TestActions;
  constructor(@inject("ActionType") actionType: TestActions) {
    this.actionType = actionType;
  }
  getAllTargets(
    params: any,
    paginationParams: any
  ): Promise<Result<ITargetList, ParseError | HttpError>> {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        resolve(
          ok({ targets: targetArray, next: "test", prev: "test", count: 2 })
        );
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
    }
    return new Promise((resolve) => {
      resolve(err(new ParseError("Parse Error")));
    });
  }
}
