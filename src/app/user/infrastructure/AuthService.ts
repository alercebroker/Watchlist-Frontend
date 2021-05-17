import { ParseError } from "@/shared/error/ParseError";
import { HttpError, IHttpService } from "@/shared/http";
import { inject } from "inversify-props";
import { err, Result } from "neverthrow";
import { User } from "../domain/User";
import { IUserData, IUserRepository } from "../domain/User.types";
import {
  LoginApiResponse,
  LoginUserApiRequestModel,
  RegisterUserApiResponse,
  RegisterUserRequestModel,
  UsersApiResponse,
} from "./AuthService.types";
import { UserParser } from "./UserParser";

export class AuthService implements IUserRepository {
  httpService: IHttpService;
  parser: UserParser;
  constructor(@inject() httpService: IHttpService) {
    this.httpService = httpService;
    this.parser = new UserParser();
    this.httpService.initService("");
  }

  async login(
    params: LoginUserApiRequestModel
  ): Promise<Result<IUserData, ParseError | HttpError>> {
    const parseToken = (response: LoginApiResponse) => {
      return this.parser.parseToken(response);
    };
    const tokenResult = await this.httpService.post(
      {
        url: "/users/login",
        data: params,
      },
      { parseTo: parseToken }
    );
    if (tokenResult.isOk()) {
      const token = tokenResult.value;
      const parseUser = (response: UsersApiResponse) => {
        return this.parser.parseUsersApiResponse(response, token);
      };
      const userResult = await this.httpService.get(
        {
          url: "/users",
          config: { headers: { Bearer: token } },
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
          token: user.token,
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
    const parseTo = (response: RegisterUserApiResponse) => {
      return this.parser.parseRegisterApiResponse(response);
    };
    // result with User entity
    const result = await this.httpService.post(
      { url: "/users", data: params },
      { parseTo }
    );
    return result.map((user: User) => {
      return {
        username: user.username,
        email: user.email,
        password: user.password,
        name: user.name,
        lastName: user.lastName,
        token: user.token,
        institution: user.institution,
        role: user.role,
      };
    });
  }
  logout(): void {
    throw new Error("Method not implemented.");
  }
}
