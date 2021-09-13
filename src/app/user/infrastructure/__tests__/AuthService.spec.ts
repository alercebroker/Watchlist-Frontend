import { containerBuilder } from "@/ui/app.container";
import { HttpError, MockUserApi, TestActions } from "@/shared/http";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import { IUserRepository } from "../../domain/User.types";
import {
  ActivateUserApiRequestModel,
  RegisterUserRequestModel,
} from "../AuthService.types";

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockSingleton(cid.UsersApiService, MockUserApi);
  localStorage.clear();
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
          accessToken: null,
          refreshToken: null,
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
  describe("Login", () => {
    it("should get user and save token if response success", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const service = container.get<IUserRepository>(cid.AuthService);
      const request = {
        username: "test",
        password: "test",
      };
      const result = await service.login(request);
      expect(result.isOk()).toBeTruthy();
      expect(localStorage.getItem("access_token")).toBe("token");
      expect(localStorage.getItem("refresh_token")).toBe("token");
    });
    it("should return error if http has error", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const service = container.get<IUserRepository>(cid.AuthService);
      const request = {
        username: "test",
        password: "test",
      };
      const result = await service.login(request);
      expect(result.isErr()).toBeTruthy();
      expect(localStorage.getItem("token")).toBeNull();
    });
    it("should return error if timeout", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("timeout");
      const service = container.get<IUserRepository>(cid.AuthService);
      const request = {
        username: "test",
        password: "test",
      };
      const result = await service.login(request);
      expect(result.isErr()).toBeTruthy();
      expect(localStorage.getItem("token")).toBeNull();
    });
  });
  describe("Activate", () => {
    it("should return nothing if response is success (204)", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const service = container.get<IUserRepository>(cid.AuthService);
      const request: ActivateUserApiRequestModel = {
        uid: "uid",
        token: "token",
      };
      const result = await service.activate(request);
      expect(result.isOk()).toBeTruthy();
    });
    it("should return nothing, but account already activated (403)", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("error");
      const service = container.get<IUserRepository>(cid.AuthService);
      const request: ActivateUserApiRequestModel = {
        uid: "uid",
        token: "token",
      };
      const result = await service.activate(request);
      expect(result.isErr()).toBeTruthy();
      result.mapErr((error) => {
        if (error instanceof HttpError) expect(error.status).toEqual(403);
      });
    });
    it("should return nothing, but server error (500)", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("serverError");
      const service = container.get<IUserRepository>(cid.AuthService);
      const request: ActivateUserApiRequestModel = {
        uid: "uid",
        token: "token",
      };
      const result = await service.activate(request);
      expect(result.isErr()).toBeTruthy();
      result.mapErr((error) => {
        if (error instanceof HttpError) expect(error.status).toEqual(500);
      });
    });
  });
});
