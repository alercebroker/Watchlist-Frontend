import { ParseError } from "@/shared/error/ParseError";
import { err, ok, Result } from "neverthrow";
import { ILightCurveData } from "../domain/LightCurve.types";
import { LightCurve } from "../domain/LightCurve";
import { LightCurveApiResult } from "./LightCurveService.types";

export class LightCurveApiParser {
  toDomain(
    apiResponse: LightCurveApiResult
  ): Result<ILightCurveData, ParseError> {
    try {
      const lightcurveData: ILightCurveData = {
        detections: apiResponse.detections,
        nonDetections: apiResponse.non_detections,
      };
      const lightcurve = new LightCurve(lightcurveData);
      return ok(lightcurve);
    } catch (error) {
      return err(new ParseError(error.message));
    }
  }
}
