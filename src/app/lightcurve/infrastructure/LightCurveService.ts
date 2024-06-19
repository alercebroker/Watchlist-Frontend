import { inject } from "inversify-props";
import { ParseError } from "@/shared/error/ParseError";
import { HttpError, IHttpService } from "@/shared/http";
import { Result } from "neverthrow";
import {
  ILightCurveData,
  ILightCurveRepository,
} from "../domain/LightCurve.types";
import { LightCurveApiResult } from "./LightCurveService.types";
import { LightCurveApiParser } from "./LightCurveParser";
import { UsersApiService } from "@/shared/http/UsersApiService";
import axios from "axios";

export class LightCurveService implements ILightCurveRepository {
  httpService: IHttpService;
  parser: LightCurveApiParser;

  constructor(@inject() usersApiService: UsersApiService) {
    this.parser = new LightCurveApiParser();
    this.httpService = usersApiService;
  }

  async getLightCurve(params?: {
    oid?: string;
  }): Promise<Result<ILightCurveData, ParseError | HttpError>> {
    const parseTo = (
      response: LightCurveApiResult
    ): Result<ILightCurveData, ParseError> => {
      const lightcurve = this.parser.toDomain(response);
      return lightcurve;
    };
    console.log(params);

    const response = await axios.get(
      `https://api.alerce.online/v2/lightcurve/htmx/lightcurve?oid=${params?.oid}`
    );
    return response.data;
  }
}
