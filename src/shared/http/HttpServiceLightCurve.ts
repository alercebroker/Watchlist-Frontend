import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { unmanaged } from "inversify";
import { err, ok, Result } from "neverthrow";
import { ParseError } from "../error/ParseError";
import { HttpError } from "./HttpError";

type IHttpRequest = {
  url: string;
  config?: AxiosRequestConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
};

// A FailableParser is just a Parser wrapped in a Result
type FailableParser<T, M> = (_: T) => Result<M, ParseError>;

type Parser<T, M> = {
  parseTo: FailableParser<T, M>;
};

export interface IHttpServiceLightCurve {
  get<T, M>(
    request: IHttpRequest,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>>;
}

export class HttpServiceLightCurve implements IHttpServiceLightCurve {
  protected axiosService!: AxiosInstance;

  constructor(
    @unmanaged() baseUrl: string,
    @unmanaged() axiosInstance?: AxiosInstance
  ) {
    if (axiosInstance) {
      this.axiosService = axiosInstance;
    } else {
      this.axiosService = axios.create({
        baseURL: baseUrl,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: process.env.NODE_ENV !== "development",
      });
    }
  }

  public async get<T, M>(
    { url, config }: IHttpRequest,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>> {
    try {
      const response = await this.axiosService.get<T>(url, config);
      return this._parseFailable<T, M>(response.data, parser.parseTo);
    } catch (error) {
      return this._retryOrReturnError<T, M>(error, parser);
    }
  }


  private _parseFailable<T, M>(
    data: T,
    parser: FailableParser<T, M>
  ): Result<M, ParseError> {
    try {
      return parser(data);
    } catch (error) {
      const parseError = new ParseError(error.message);
      return err(parseError);
    }
  }

  private async _retryOrReturnError<T, M>(
    error: AxiosError,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>> {
    if (error.response?.status === 401) {
      const verb = error.config.method;
      if (verb === "get")
        return this.get<T, M>(
          { url: error.config.url ? error.config.url : "" },
          parser
        );
    }
    return err(error);
  }

}
