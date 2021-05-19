import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { Result } from "neverthrow";

export interface ITargetData {
  name: string;
  radius: number;
  ra: number;
  dec: number;
  nMatches: number | null;
}

export interface ITargetRepository {
  getAllTargets(
    watchlistId: number
  ): Promise<Result<ITargetData[], ParseError | HttpError>>;
  getAllTargets(
    targetsUrl: string
  ): Promise<Result<ITargetData[], ParseError | HttpError>>;
}
