import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
} from "axios";
import { err, ok, okAsync, Result } from "neverthrow";
import { ParseError } from "../error/ParseError";
import { HttpError } from "./HttpError";
import { inject } from "inversify-props";

type IHttpRequest = {
  url: string;
  config?: AxiosRequestConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};

// A FailableParser is just a Parser wrapped in a Result
type FailableParser<T, M> = (_: T) => Result<M, ParseError>;

type Parser<T, M> = {
  parseTo: FailableParser<T, M>;
};

export interface IHttpService {
  get<T, M>(
    request: IHttpRequest,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>>;
  initService(baseUrl: string): void;
  post<T, M>(
    request: IHttpRequest,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>>;
  delete<T, M>(
    request: IHttpRequest
  ): Promise<Result<AxiosResponse<T>, ParseError | HttpError>>;
}

export interface IAxiosCreator {
  createAxiosInstance(baseUrl: string): AxiosInstance;
}

export class AxiosCreator implements IAxiosCreator {
  createAxiosInstance(baseUrl: string): AxiosInstance {
    return axios.create({
      baseURL: baseUrl,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export class HttpService implements IHttpService {
  private axiosService: AxiosInstance;
  private axiosCreator: AxiosCreator;

  constructor(@inject() axiosCreator: AxiosCreator) {
    this.axiosCreator = axiosCreator;
    this.axiosService = axios.create();
  }

  initService(baseUrl: string) {
    this.axiosService = this.axiosCreator.createAxiosInstance(baseUrl);
    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  public async get<T, M>(
    { url, config }: IHttpRequest,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>> {
    try {
      const response = await this.axiosService.get<T>(url, config);
      return this._parseFailable<T, M>(response.data, parser.parseTo);
    } catch (error) {
      return err(error);
    }
  }

  public async post<T, M>(
    { url, data, config }: IHttpRequest,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>> {
    try {
      const response = await this.axiosService.post<T>(url, data, config);
      console.log("Response", response);
      return this._parseFailable<T, M>(response.data, parser.parseTo);
    } catch (error) {
      return err(error);
    }
  }

  public async delete<T, M>({
    url,
    config,
  }: IHttpRequest): // hardcoding form M to AxiosResponse<T>. problem of usage of return okAsync(response);
  Promise<Result<AxiosResponse<T>, HttpError>> {
    try {
      const response = await this.axiosService.delete<T>(url, config);
      return okAsync(response);
    } catch (error) {
      return err(error);
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

  private _initializeRequestInterceptor() {
    this.axiosService.interceptors.request.use(
      this._handleRequest,
      this._handleError
    );
  }

  private _initializeResponseInterceptor() {
    this.axiosService.interceptors.response.use(
      (response: AxiosResponse) => response,
      this._handleError
    );
  }

  private _handleRequest(config: AxiosRequestConfig) {
    // TODO Add authentication token to request headers
    // Read token from local storage

    const token = localStorage.getItem("access_token");
    // USE verify endpoint
    // if response is {} is ok 
    // else USE refresh endpoint
    // save in  localStorage
    if (token != null) {
      config.headers = { Authorization: "Bearer " + token };
    }
    //console.log(config);
    return config;
  }

  private _handleError(error: AxiosError): HttpError {
    if (error.response) {
      return HttpError.fromStatus(error.response.status, error.message);
    }
    throw error;
  }
}
