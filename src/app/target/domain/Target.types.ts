import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { Result } from "neverthrow";

export interface ITargetData {
  id: number;
  url: string;
  name: string;
  radius: number;
  ra: number;
  dec: number;
  nMatches: number | null;
  lastMatch: string;
}

export interface ITargetRepository {
  getAllTargets(
    watchlistId: number
  ): Promise<Result<ITargetData[], ParseError | HttpError>>;
  getAllTargets(
    targetsUrl: string
  ): Promise<Result<ITargetData[], ParseError | HttpError>>;
}
