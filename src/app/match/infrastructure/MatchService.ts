import { ParseError } from "@/shared/error/ParseError";
import { HttpError, IHttpService } from "@/shared/http";
import { UsersApiService } from "@/shared/http/UsersApiService";
import { inject } from "inversify-props";
import { combine, Result } from "neverthrow";
import { IMatchData, IMatchRepository } from "../domain/Match.types";
import { MatchParser } from "./MatchParser";
import { TargetAPIResponse } from "./MatchService.types";

export class MatchService implements IMatchRepository {
  httpService: IHttpService;
  parser: MatchParser;
  constructor(@inject() usersApiService: UsersApiService) {
    this.httpService = usersApiService;
    this.parser = new MatchParser();
  }
  getAllMatches(
    watchlistId: number,
    targetId: number
  ): Promise<Result<IMatchData[], ParseError | HttpError>> {
    throw new Error("Method not implemented.");
  }
  async getMatchesFromUrl(
    url: string
  ): Promise<Result<IMatchData[], ParseError | HttpError>> {
    const parseTo = (response: TargetAPIResponse) => {
      const matches = response.matches.map((match) => {
        return this.parser.toDomain(match);
      });
      return combine(matches);
    };
    return await this.httpService.get({ url }, { parseTo });
  }
}
