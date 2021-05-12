import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { Result } from "neverthrow";
import { RegisterUserRequestModel } from "../infrastructure/AuthService.types";

export interface IUserData {
  username: string;
  email: string;
  password: string | null;
  name: string;
  lastName: string;
  token: string | null;
  institution: string | null;
  role: string | null;
}

export interface IUser extends IUserData {
  storeToken(): void;
  deleteToken(): void;
}

export interface IUserRepository {
  login(): Promise<Result<IUserData, ParseError | HttpError>>;
  register(
    params: RegisterUserRequestModel
  ): Promise<Result<IUserData, ParseError | HttpError>>;
  logout(): void;
}
