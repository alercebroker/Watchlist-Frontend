import { ParseError } from "@/shared/error/ParseError";
import { HttpError, TestActions } from "@/shared/http";
import { inject } from "inversify-props";
import { err, ok, Result } from "neverthrow";
import {
  CreateTargetParams,
  DeleteTargetParams,
  EditTargetParams,
  ITargetData,
  ITargetList,
  ITargetRepository,
} from "../../domain/Target.types";

import { IWatchlistFilter, IWatchlistSingleFilter } from "@/app/filter/domain/Filter.types";
import { FilterFields } from "@/app/filter/domain/Filter";

const targetArray: ITargetData[] = [
  {
    id: 1,
    url: "test",
    name: "target 1",
    radius: 1.0,
    ra: 1.0,
    dec: 1.0,
    filter: {
      fields: {},
      filters: [],
    },
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
    filter: {
      fields: {},
      filters: [],
    },
    nMatches: 0,
    lastMatch: new Date().toISOString(),
  },
];

export class MockTargetService implements ITargetRepository {
  actionType: TestActions;
  constructor(@inject("ActionType") actionType: TestActions) {
    this.actionType = actionType;
  }
  downloadTargetsCsv(params: {
    watchlistId: number;
  }): Promise<Result<boolean, ParseError | HttpError>> {
    throw new Error("Method not implemented.");
  }
  deleteTarget(
    params: DeleteTargetParams
  ): Promise<Result<number, ParseError | HttpError>> {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        resolve(ok(params.target));
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
  createTarget(
    params: CreateTargetParams
  ): Promise<Result<ITargetData, ParseError | HttpError>> {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        resolve(
          ok({
            id: 1,
            name: "name",
            ra: 10,
            dec: 20,
            radius: 30,
            filter: {
              fields:{} as FilterFields, 
              filters:[] as IWatchlistSingleFilter[]
            },
  
          } as ITargetData)
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

  editTarget(
    params: EditTargetParams
  ): Promise<Result<ITargetData, ParseError | HttpError>> {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        resolve(
          ok({
            id: 1,
            name: "name",
            ra: 10,
            dec: 20,
            radius: 30,
          } as ITargetData)
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
        resolve(
          err(new HttpError(400, { detail: "not found" }, "Client Error"))
        );
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
  bulkUpdateTargets(
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
