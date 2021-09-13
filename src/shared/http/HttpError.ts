import { HttpStatusCode } from "./HttpStatusCode";

interface IHttpError {
  status: number;
  name: string;
  message: string;
  stack?: string;
}

export class HttpError extends Error implements IHttpError {
  public status: number;
  public detail: Record<string, unknown>;

  constructor(
    status: number,
    detail?: Record<string, unknown>,
    message?: string
  ) {
    super(message);

    Object.setPrototypeOf(this, HttpError.prototype);

    this.status = status;
    this.name = HttpStatusCode[status];
    this.message = message || HttpStatusCode[status];
    this.detail = detail || {};
  }

  public isClientError(): boolean {
    return this.status >= 400 && this.status <= 499;
  }

  public isServerError(): boolean {
    return this.status >= 500 && this.status <= 599;
  }

  public static fromStatus(
    status: number,
    detail: Record<string, unknown>,
    message?: string
  ): HttpError {
    return new this(status, detail, message);
  }
}

export const isHttpError = (e: Error): e is HttpError => {
  return Number.isInteger((e as HttpError).status);
};
