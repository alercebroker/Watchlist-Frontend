import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { Result } from "neverthrow";

export interface IMatchData {
  object_id: string;
  candid: string;
  date: string;
}

export interface IMatchRepository {
  getAllMatches(
    watchlistId: number,
    targetId: number
  ): Promise<Result<IMatchData[], ParseError | HttpError>>;
  getMatchesFromUrl(
    url: string
  ): Promise<Result<IMatchData[], ParseError | HttpError>>;
}
