import { ParseError } from "@/shared/error/ParseError";
import { err, ok, Result } from "neverthrow";
import { User } from "../domain/User";
import { RegisterUserApiResponse } from "./AuthService.types";

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
          token: null,
          institution: response.institution,
          role: response.role,
        })
      );
    } catch (error) {
      return err(new ParseError(error.message));
    }
  }
}
