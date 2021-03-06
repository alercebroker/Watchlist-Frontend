import { ParseError } from "@/shared/error/ParseError";
import { err, ok, Result } from "neverthrow";
import { User } from "../domain/User";
import {
  LoginApiResponse,
  RegisterUserApiResponse,
  UsersApiResponse,
} from "./AuthService.types";

export class UserParser {
  parseRegisterApiResponse(
    response: RegisterUserApiResponse
  ): Result<User, ParseError> {
    try {
      return ok(
        new User({
          username: response.username,
          email: response.email,
          password: null,
          name: response.name,
          lastName: response.last_name,
          accessToken: null,
          refreshToken: null,
          institution: response.institution,
          role: response.role,
        })
      );
    } catch (error) {
      return err(new ParseError(error.message));
    }
  }

  parseToken(response: LoginApiResponse): Result<LoginApiResponse, ParseError> {
    return response
      ? ok(response)
      : err(new ParseError("Failed to parse token"));
  }

  parseUsersApiResponse(
    response: UsersApiResponse,
    accessToken: string,
    refreshToken: string
  ): Result<User, ParseError> {
    try {
      return ok(
        new User({
          username: response.username,
          email: response.email,
          password: null,
          name: response.name,
          lastName: response.last_name,
          accessToken: accessToken,
          refreshToken: refreshToken,
          institution: response.institution,
          role: response.role,
        })
      );
    } catch (error) {
      return err(new ParseError(error.message));
    }
  }

  parseAuthorizationUrl(
    response: Record<string, string>
  ): Result<string, ParseError> {
    if (response.authorization_url) {
      return ok(response.authorization_url);
    } else {
      return err(new ParseError("No authorization url"));
    }
  }
}
