import { ParseError } from "@/shared/error/ParseError";
import { err, ok, Result } from "neverthrow";
import { Target } from "../domain/Target";
import { ITargetData } from "../domain/Target.types";
import {
  TargetEditApiResponse,
  TargetListApiResponse,
} from "./TargetService.types";

export class TargetParser {
  toDomain(
    response: TargetListApiResponse | TargetEditApiResponse
  ): Result<ITargetData, ParseError> {
    try {
      const target = new Target({
        id: response.id,
        url: "url" in response ? response.url : "",
        name: response.name,
        radius: response.radius,
        dec: response.dec,
        ra: response.ra,
        filter: response.filter ? response.filter : { "fields": {}, "filters": [] },
        nMatches: "n_matches" in response ? response.n_matches : 0,
        lastMatch: "last_match" in response ? response.last_match : "",
      });

      if (target.validate()) return ok(target);
      else return err(new Error("Target not valid"));
    } catch (e) {
      return err(new ParseError((e as Error).message));
    }
  }

  parseCsvToBlob(response: string): Result<Blob, ParseError> {
    try {
      const csvFile = new Blob([response], { type: "text/csv" });
      return ok(csvFile);
    } catch (e) {
      return err(new ParseError((e as Error).message));
    }
  }
}
