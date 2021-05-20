import { ParseError } from "@/shared/error/ParseError";
import { HttpError, IHttpService } from "@/shared/http";
import { inject } from "inversify-props";
import { combine, Result } from "neverthrow";
import { ITargetData, ITargetRepository } from "../domain/Target.types";
import { TargetParser } from "./TargetParser";
import { WatchlistTargetsApiResponse } from "./TargetService.types";

export class TargetService implements ITargetRepository {
  httpService: IHttpService;
  parser: TargetParser;
  constructor(@inject() httpService: IHttpService) {
    this.httpService = httpService;
    this.httpService.initService("");
    this.parser = new TargetParser();
  }
  getAllTargets(...args: [watchlistId: number] | [targetsUrl: string]): any {
    if (typeof args[0] === "number") {
      return this.getTargetsFromWatchlistId(args[0]);
    } else if (typeof args[0] === "string") {
      console.log('getAll', args[0])
      return this.getTargetsFromUrl(args[0]);
    }
  }
  private async getTargetsFromWatchlistId(
    id: number
  ): Promise<Result<ITargetData[], ParseError | HttpError>> {
    const parseTo = (response: WatchlistTargetsApiResponse) => {
      const targets = response.results.map((x) => {
        return this.parser.toDomain(x);
      });
      return combine(targets);
    };
    return await this.httpService.get(
      { url: "/watchlists/" + id + "/targets" },
      { parseTo }
    );
  }

  private async getTargetsFromUrl(
    url: string
  ): Promise<Result<ITargetData[], ParseError | HttpError>> {
    const parseTo = (response: WatchlistTargetsApiResponse) => {
      const targets = response.results.map((x) => {
        return this.parser.toDomain(x);
      });
      console.log("getTargetFromUrl Target Service", targets)
      return combine(targets);
    };
    return await this.httpService.get({ url }, { parseTo });
  }
}
