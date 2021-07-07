import { ParseError } from "@/shared/error/ParseError";
import { err, ok, Result } from "neverthrow";
import { Match } from "../domain/Match";
import { IMatchData } from "../domain/Match.types";

export class MatchParser {
  toDomain(match: IMatchData): Result<Match, ParseError> {
    try {
      return ok(new Match(match));
    } catch (error) {
      return err(new ParseError(error));
    }
  }
}
