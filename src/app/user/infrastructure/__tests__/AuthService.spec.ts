import { containerBuilder } from "@/ui/plugins/inversify";
import { IAxiosCreator, MockAxiosCreator, TestActions } from "@/shared/http";
import { cid, container, mockTransient, resetContainer } from "inversify-props";
import { IUserRepository } from "../../domain/User.types";
import { RegisterUserRequestModel } from "../AuthService.types";

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockTransient<IAxiosCreator>(cid.AxiosCreator, MockAxiosCreator);
});

describe("AuthService", () => {
  describe("Register", () => {
    it("should return user if registered", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const service = container.get<IUserRepository>(cid.AuthService);
      const request: RegisterUserRequestModel = {
        username: "username",
        name: "name",
        password: "password",
        last_name: "last name",
        institution: "institution",
        role: "role",
        email: "email",
      };
      const result = await service.register(request);
      expect(result.isOk()).toBeTruthy();
      result.map((user) => {
        expect(user).toStrictEqual({
          username: "username",
          email: "email",
          password: null,
          name: "name",
          lastName: "last name",
          token: null,
          institution: "institution",
          role: "role",
        });
      });
    });

    it("should return server error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const service = container.get<IUserRepository>(cid.AuthService);
      const request: RegisterUserRequestModel = {
        username: "username",
        name: "name",
        password: "password",
        last_name: "last name",
        institution: "institution",
        role: "role",
        email: "email",
      };
      const result = await service.register(request);
      expect(result.isErr()).toBeTruthy();
      result.mapErr((error) => {
        expect(error.message).toEqual("Network Error");
      });
    });
    it("should return server error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const service = container.get<IUserRepository>(cid.AuthService);
      const request: RegisterUserRequestModel = {
        username: "username",
        name: "name",
        password: "password",
        last_name: "last name",
        institution: "institution",
        role: "role",
        email: "email",
      };
      const result = await service.register(request);
      expect(result.isErr()).toBeTruthy();
      result.mapErr((error) => {
        expect(error.message).toContain("timeout");
      });
    });
  });
});
