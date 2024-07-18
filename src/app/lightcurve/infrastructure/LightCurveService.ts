import { inject } from "inversify-props";
import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { IHttpServiceLightCurve } from "@/shared/http/HttpServiceLightCurve";
import { Result } from "neverthrow";
import {
  ILightCurveData,
  ILightCurveRepository,
} from "../domain/LightCurve.types";
import { LightCurveApiResult } from "./LightCurveService.types";
import { LightCurveApiParser } from "./LightCurveParser";
import { LightCurveApiService } from "@/shared/http/LightCurveApiService";
import axios from "axios";

export class LightCurveService implements ILightCurveRepository {
  httpService: IHttpServiceLightCurve;
  parser: LightCurveApiParser;

  constructor(@inject() LightCurveApiService: LightCurveApiService) {
    this.parser = new LightCurveApiParser();
    this.httpService = LightCurveApiService;
  }

  async getLightCurve(url: string): Promise<Result<ILightCurveData, ParseError | HttpError>> {
    const parseTo = (response: LightCurveApiResult) => {
      return this.parser.toDomain(response);
    };

    const response = await this.httpService.get(
      { url: `/lightcurve/lightcurve/${url}`},
      { parseTo }
    );

    return response;
  }
}