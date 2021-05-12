import { ParseError } from "@/shared/error/ParseError";
import { HttpError, TestActions } from "@/shared/http";
import { inject } from "inversify-props";
import { err, ok, Result } from "neverthrow";
import { IUserData, IUserRepository } from "../../domain/User.types";
import {
  RegisterUserApiResponse,
  RegisterUserRequestModel,
} from "../AuthService.types";

const userData: IUserData = {
  username: "username",
  email: "email",
  password: null,
  name: "name",
  lastName: "last name",
  token: "token",
  institution: "institution",
  role: "role",
};

export class MockAuthService implements IUserRepository {
  actionType: TestActions;
  constructor(@inject("ActionType") actionType: TestActions) {
    this.actionType = actionType;
  }
  login(): Promise<Result<IUserData, ParseError | HttpError>> {
    throw new Error("Method not implemented.");
  }
  register(
    params: RegisterUserRequestModel
  ): Promise<Result<IUserData, ParseError | HttpError>> {
    if (this.actionType === "ok") {
      return new Promise((resolve) => {
        resolve(ok(userData));
      });
    } else if (
      this.actionType === "error" ||
      this.actionType === "serverError"
    ) {
      return new Promise((resolve) => {
        resolve(err(new HttpError(500, "Server Error")));
      });
    } else if (this.actionType === "clientError") {
      return new Promise((resolve) => {
        resolve(err(new HttpError(400, "Client Error")));
      });
    } else if (this.actionType === "timeout") {
      return new Promise((resolve) => {
        resolve(err(new HttpError(502, "Gateway Timeout")));
      });
    }
    return new Promise((resolve) => {
      resolve(err(new ParseError("Parse Error")));
    });
  }
  logout(): void {
    throw new Error("Method not implemented.");
  }
}

export const mockRegisterApiResponse: RegisterUserApiResponse = {
  username: "username",
  email: "email",
  name: "name",
  last_name: "last name",
  institution: "institution",
  role: "role",
};

export const mockRegisterApiRequest: RegisterUserRequestModel = {
  username: "username",
  password: "password",
  email: "email",
  name: "name",
  last_name: "last name",
  institution: "institution",
  role: "role",
};
