import { ParseError } from "@/shared/error/ParseError";
import { HttpError } from "@/shared/http";
import { UsersApiService } from "@/shared/http/UsersApiService";
import { inject } from "inversify-props";
import { err, ok, Result } from "neverthrow";
import { User } from "../domain/User";
import { IUserData, IUserRepository } from "../domain/User.types";
import {
  ActivateUserApiRequestModel,
  LoginApiResponse,
  LoginGoogleApiRequestModel,
  LoginUserApiRequestModel,
  RegisterUserRequestModel,
  UsersApiResponse,
} from "./AuthService.types";
import { UserParser } from "./UserParser";

export class AuthService implements IUserRepository {
  parser: UserParser;

  constructor(@inject() private usersApiService: UsersApiService) {
    this.parser = new UserParser();
  }

  getGoogleUrl(): Promise<Result<string, ParseError | HttpError>> {
    return this.usersApiService.get(
      {
        url:
          "/users/social/o/google-oauth2/?redirect_uri=" +
          process.env.VUE_APP_GOOGLE_REDIRECT_URI,
      },
      { parseTo: this.parser.parseAuthorizationUrl }
    );
  }

  async googleLogin(
    params: LoginGoogleApiRequestModel
  ): Promise<Result<IUserData, HttpError | ParseError>> {
    const data = new URLSearchParams();
    data.append("code", params.code);
    data.append("state", params.state);
    const tokenResult = await this.usersApiService.post(
      {
        url: "/users/social/o/google-oauth2/",
        data: data,
        config: {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      },
      { parseTo: this.parser.parseToken }
    );

    return this._getCurrentUser(tokenResult);
  }

  async login(
    params: LoginUserApiRequestModel
  ): Promise<Result<IUserData, ParseError | HttpError>> {
    const tokenResult = await this.usersApiService.post(
      {
        url: "/users/login/",
        data: params,
      },
      { parseTo: this.parser.parseToken }
    );
    return this._getCurrentUser(tokenResult);
  }

  async _getCurrentUser(
    tokenResult: Result<LoginApiResponse, ParseError | HttpError>
  ): Promise<Result<IUserData, ParseError | HttpError>> {
    if (tokenResult.isOk()) {
      const token = tokenResult.value;
      const parseUser = (response: UsersApiResponse) => {
        return this.parser.parseUsersApiResponse(
          response,
          token.access,
          token.refresh
        );
      };
      const userResult = await this.usersApiService.get(
        {
          url: "/users/current/",
          config: { headers: { Authorization: `Bearer ${token.access}` } },
        },
        { parseTo: parseUser }
      );

      return userResult.map((user: User) => {
        user.storeToken();
        return {
          username: user.username,
          email: user.email,
          password: user.password,
          name: user.name,
          lastName: user.lastName,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          institution: user.institution,
          role: user.role,
        };
      });
    } else {
      return err(tokenResult.error);
    }
  }

  async register(
    params: RegisterUserRequestModel
  ): Promise<Result<IUserData, ParseError | HttpError>> {
    // result with User entity
    const result = await this.usersApiService.post(
      { url: "/users/", data: params },
      { parseTo: this.parser.parseRegisterApiResponse }
    );

    return result.map((user: User) => {
      return {
        username: user.username,
        email: user.email,
        password: user.password,
        name: user.name,
        lastName: user.lastName,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        institution: user.institution,
        role: user.role,
      };
    });
  }

  logout(): Result<IUserData, Error> {
    try {
      localStorage.clear();
      return ok({} as IUserData);
    } catch (error) {
      return err(error);
    }
  }

  async activate(
    params: ActivateUserApiRequestModel
  ): Promise<Result<IUserData, ParseError | HttpError>> {
    const result = await this.usersApiService.post(
      { url: "/users/activation/", data: params },
      { parseTo: (): Result<IUserData, ParseError> => ok({} as IUserData) }
    );
    return result;
  }
}
