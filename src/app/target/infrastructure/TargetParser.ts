import { ParseError } from "@/shared/error/ParseError";
import { err, ok, Result } from "neverthrow";
import { Target } from "../domain/Target";
import { ITargetData } from "../domain/Target.types";
import { TargetListApiResponse } from "./TargetService.types";

export class TargetParser {
  toDomain(response: TargetListApiResponse): Result<ITargetData, ParseError> {
    try {
      const target = new Target({
        name: response.name,
        radius: response.radius,
        dec: response.dec,
        ra: response.ra,
        nMatches: response.n_matches,
      });
      return ok(target);
    } catch (error) {
      return err(new ParseError(error.message));
    }
  }
}
