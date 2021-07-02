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
    this.httpService.initService(process.env.VUE_APP_USER_API);
  }

  async login(
    params: LoginUserApiRequestModel
  ): Promise<Result<IUserData, ParseError | HttpError>> {
    const tokenResult = await this.httpService.post(
      {
        url: "/users/login/",
        data: params,
      },
      { parseTo: this.parser.parseToken }
    );
    
    if (tokenResult.isOk()) {
      const token = tokenResult.value;
      const parseUser = (response: UsersApiResponse) => {
        return this.parser.parseUsersApiResponse(response, token.access, token.refresh);
      };
      const userResult = await this.httpService.get(
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
    const result = await this.httpService.post(
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

  logout(): void {
    throw new Error("Method not implemented.");
  }
}
