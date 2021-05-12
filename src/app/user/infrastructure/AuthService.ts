import { ParseError } from "@/shared/error/ParseError";
import { HttpError, IHttpService } from "@/shared/http";
import { inject } from "inversify-props";
import { Result } from "neverthrow";
import { User } from "../domain/User";
import { IUserData, IUserRepository } from "../domain/User.types";
import {
  RegisterUserApiResponse,
  RegisterUserRequestModel,
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

  login(): Promise<Result<IUserData, ParseError | HttpError>> {
    throw new Error("Method not implemented.");
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
        token: null,
        institution: user.institution,
        role: user.role,
      };
    });
  }
  logout(): void {
    throw new Error("Method not implemented.");
  }
}
