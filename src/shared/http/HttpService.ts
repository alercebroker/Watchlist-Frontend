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

export interface IHttpService {
  get<T, M>(
    request: IHttpRequest,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>>;
  post<T, M>(
    request: IHttpRequest,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>>;
  put<T, M>(
    request: IHttpRequest,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>>;
  delete(request: IHttpRequest): Promise<Result<number, HttpError>>;
}

export class HttpService implements IHttpService {
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
      return this._retryOrReturnError<T, M>(error, parser);
    }
  }

  public async post<T, M>(
    { url, data, config }: IHttpRequest,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>> {
    try {
      const response = await this.axiosService.post<T>(url, data, config);
      return this._parseFailable<T, M>(response.data, parser.parseTo);
    } catch (error) {
      return this._retryOrReturnError<T, M>(error, parser);
    }
  }

  public async delete<T>({
    url,
    config,
  }: IHttpRequest): Promise<Result<number, HttpError>> {
    try {
      const response = await this.axiosService.delete<T>(url, config);
      return ok(response.status);
    } catch (error) {
      if (error.response?.status === 401) {
        return this.delete<T>({
          url: error.response.config.url ? error.response.config.url : "",
          config: error.config,
        });
      }
      return err(error);
    }
  }

  public async put<T, M>(
    { url, data, config }: IHttpRequest,
    parser: Parser<T, M>
  ): Promise<Result<M, ParseError | HttpError>> {
    try {
      const response = await this.axiosService.put<T>(url, data, config);
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

  private _initializeRequestInterceptor() {
    this.axiosService.interceptors.request.use(
      (config: AxiosRequestConfig) => this._handleRequest(config, this),
      (error: AxiosError) => this._handleError(error, this)
    );
  }

  private _initializeResponseInterceptor() {
    this.axiosService.interceptors.response.use(
      this._handleResponse,
      (error: AxiosError) => {
        this._handleError(error, this);
      }
    );
  }

  private _handleResponse(response: AxiosResponse) {
    return response;
  }

  private _handleRequest(config: AxiosRequestConfig, context: HttpService) {
    context._addAuthHeadersToRequest(config);
    context._addHttps(config);
    return config;
  }

  private _addHttps(config: AxiosRequestConfig) {
    if (process.env.VUE_APP_FORCE_HTTPS === "true") {
      if (config.baseURL?.startsWith("http://")) {
        config.baseURL = config.baseURL?.replace("http://", "https://");
      }
      if (config.url?.startsWith("http://")) {
        config.url = config.url?.replace("http://", "https://");
      }
    }
  }

  private _addAuthHeadersToRequest(config: AxiosRequestConfig) {
    const token = localStorage.getItem("access_token");
    if (token != null) {
      config.headers = { Authorization: "Bearer " + token };
    }
  }

  private _handleError(error: AxiosError, context: HttpService): HttpError {
    if (error.response) {
      if (error.response.status === 401) {
        if (
          error.response.config.url === "/users/refresh/" ||
          error.response.config.url === "/users/login"
        ) {
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("access_token");
          throw HttpError.fromStatus(
            error.response.status,
            error.response.data
          );
        }
        context._refreshToken();
      } else {
        throw HttpError.fromStatus(
          error.response.status,
          error.response.data,
          error.response.statusText
        );
      }
    }
    throw error;
  }

  private async _refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      const data = { refresh: refreshToken };
      const response = await this.axiosService.post("/users/refresh/", data);
      localStorage.setItem("access_token", response.data.access);
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
      if (verb === "post") {
        if (error.config.url === "/users/login/") {
          return err(
            HttpError.fromStatus(
              error.response.status,
              error.response.data,
              error.response.statusText
            )
          );
        }
        return this.post<T, M>(
          {
            url: error.config.url ? error.config.url : "",
            data: error.config.data,
            config: error.config,
          },
          parser
        );
      }
    }
    return err(error);
  }
}
