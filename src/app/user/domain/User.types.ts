import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { Result } from "neverthrow";
import {
  ActivateUserApiRequestModel,
  LoginUserApiRequestModel,
  RegisterUserRequestModel,
} from "../infrastructure/AuthService.types";

export interface IUserData {
  username: string;
  email: string;
  password: string | null;
  name: string;
  lastName: string;
  accessToken: string | null;
  refreshToken: string | null;
  institution: string | null;
  role: string | null;
}

export interface IUser extends IUserData {
  storeToken(): void;
  deleteToken(): void;
}

export interface IUserRepository {
  login(
    params: LoginUserApiRequestModel
  ): Promise<Result<IUserData, ParseError | HttpError>>;
  register(
    params: RegisterUserRequestModel
  ): Promise<Result<IUserData, ParseError | HttpError>>;
  logout(): Result<IUserData, Error>;
  activate(
    params: ActivateUserApiRequestModel
  ): Promise<Result<IUserData, ParseError | HttpError>>;
  getGoogleUrl(): Promise<Result<string, ParseError | HttpError>>;
  googleLogin(): Promise<Result<IUserData, ParseError | HttpError>>;
}
