import { containerBuilder } from "@/ui/app.container";
import { IUserRepository } from "@/app/user/domain/User.types";
import { MockAuthService } from "@/app/user/infrastructure/__tests__/AuthService.mock";
import { HttpError, TestActions } from "@/shared/http";
import { createLocalVue } from "@vue/test-utils";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import Vuex from "vuex";
import { Modules } from "../../RegisterModules";
import { IStoreCreator } from "../../StoreCreator";
import { actions, ActionTypes } from "../actions";
import { MutationTypes } from "../mutations";
import { MutationTypes as WatchlistMutationTypes } from "../../watchlist/mutations";
import { MutationTypes as TargetsMutationTypes } from "../../targets/mutations";
import { MutationTypes as MatchesMutationTypes } from "../../matches/mutations";
import { mockMutations } from "./mutations.mock";
import { mockMutations as mockWatchlistMutations } from "../../watchlist/__tests__/mutations.mock";
import { mockMutations as mockTargetsMutations } from "../../targets/__tests__/mutations.mock";
import { mockMutations as mockMatchesMutations } from "../../matches/__tests__/mutations.mock";
import { ParseError } from "@/shared/error/ParseError";

const localVue = createLocalVue();

localVue.use(Vuex);

const modules = {
  modules: {
    users: {
      namespaced: true,
      actions: actions,
      mutations: mockMutations,
      state: {},
      getters: {},
    },
    watchlists: {
      namespaced: true,
      actions: {},
      mutations: mockWatchlistMutations,
      state: {},
      getters: {},
    },
    targets: {
      namespaced: true,
      actions: {},
      mutations: mockTargetsMutations(),
      state: {},
      getters: {},
    },
    matches: {
      namespaced: true,
      actions: {},
      mutations: mockMatchesMutations(),
      state: {},
      getters: {},
    },
  },
};

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockSingleton<IUserRepository>(cid.AuthService, MockAuthService);
  container.unbind("Modules");
  mockMutations[MutationTypes.SET_USER_DATA] = jest.fn();
  mockMutations[MutationTypes.SET_ERROR] = jest.fn();
  mockMutations[MutationTypes.SET_LOADING] = jest.fn();
  mockWatchlistMutations[WatchlistMutationTypes.SET_DEFAULT_STATE] = jest.fn();
  modules.modules.targets.mutations = mockTargetsMutations();
  modules.modules.matches.mutations = mockMatchesMutations();
  container.bind<Modules>("Modules").toConstantValue(modules);
});

describe("UserActions", () => {
  describe("RegisterUser", () => {
    const registerInput = {
      username: "username",
      email: "email",
      password: "password",
      name: "name",
      lastName: "last name",
      institution: "institution",
      role: "role",
    };
    it("should call success callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.registerUser, registerInput);
      expect(mockMutations[MutationTypes.SET_USER_DATA]).toHaveBeenCalledWith(
        {},
        {
          username: "username",
          name: "name",
          email: "email",
          password: null,
          lastName: "last name",
          accessToken: null,
          refreshToken: null,
          institution: "institution",
          role: "role",
        }
      );
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        null
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
    it("should call client error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.registerUser, registerInput);
      expect(mockMutations[MutationTypes.SET_USER_DATA]).toHaveBeenCalledWith(
        {},
        {}
      );
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new HttpError(400, {}, "Client Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
    it("should call server error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("serverError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.registerUser, registerInput);
      expect(mockMutations[MutationTypes.SET_USER_DATA]).toHaveBeenCalledWith(
        {},
        {}
      );
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new HttpError(500, {}, "Server Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
    it("should call parse error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("parseError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.registerUser, registerInput);
      expect(mockMutations[MutationTypes.SET_USER_DATA]).toHaveBeenCalledWith(
        {},
        {}
      );
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new ParseError("Parse Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
    it("should call SET_ERROR if user input is wrong", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.registerUser, {});
      expect(mockMutations[MutationTypes.SET_USER_DATA]).toHaveBeenCalledWith(
        {},
        {}
      );
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new ParseError("username required")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
  });
  describe("LoginUser", () => {
    it("should call success callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.login, {
        username: "test",
        password: "test",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).toHaveBeenCalledWith(
        {},
        {
          username: "username",
          name: "name",
          email: "email",
          password: null,
          lastName: "last name",
          refreshToken: "token",
          accessToken: "token",
          institution: "institution",
          role: "role",
        }
      );
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        null
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
    it("should call client error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.login, {
        username: "test",
        password: "test",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).toHaveBeenCalledWith(
        {},
        {}
      );
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new HttpError(400, {}, "Client Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
    it("should call server error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("serverError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.login, {
        username: "test",
        password: "test",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).toHaveBeenCalledWith(
        {},
        {}
      );
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new HttpError(500, {}, "Server Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
    it("should call parse error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("parseError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.login, {
        username: "test",
        password: "test",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).toHaveBeenCalledWith(
        {},
        {}
      );
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new ParseError("Parse Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
    it("should call SET_ERROR if user input is wrong", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.login, {
        username: "test",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).toHaveBeenCalledWith(
        {},
        {}
      );
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new ParseError("password required")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
  });
  describe("Activate", () => {
    it("should call success callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.activate, {
        uid: "uid",
        token: "token",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).not.toHaveBeenCalled();
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        null
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
    it("should call client error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.activate, {
        uid: "uid",
        token: "token",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).not.toHaveBeenCalled();
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        HttpError.fromStatus(403, {}, "Client Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
    it("should call server error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("serverError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.activate, {
        uid: "uid",
        token: "token",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).not.toHaveBeenCalled();
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        HttpError.fromStatus(500, {}, "Server Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
        1,
        {},
        true
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
        {},
        false
      );
    });
  });
  describe("Logout", () => {
    it("should set default state if logout is successful", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.logout);
      expect(
        mockWatchlistMutations[WatchlistMutationTypes.SET_DEFAULT_STATE]
      ).toHaveBeenCalled();
      expect(
        modules.modules.targets.mutations[
          TargetsMutationTypes.SET_DEFAULT_STATE
        ]
      ).toHaveBeenCalled();
      expect(
        modules.modules.matches.mutations[
          MatchesMutationTypes.SET_DEFAULT_STATE
        ]
      ).toHaveBeenCalled();
    });
  });
  describe("GetGoogleAuthUrl", () => {
    it("should call success callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      const url = "http://dummy.com";
      const mockWindow = Object.create(window);
      Object.defineProperty(mockWindow, "location", {
        value: {
          href: url,
        },
        writable: true,
      });
      await store.dispatch("users/" + ActionTypes.getGoogleAuthUrl, mockWindow);
      expect(mockWindow.location.href).toBe("test");
    });
    it("should call client error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      const mockWindow = Object.create(window);
      const url = "http://dummy.com";
      Object.defineProperty(mockWindow, "location", {
        value: {
          href: url,
        },
        writable: true,
      });
      await store.dispatch("users/" + ActionTypes.getGoogleAuthUrl, mockWindow);
      expect(mockWindow.location.href).toBe("http://dummy.com");
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new HttpError(400, {}, "Client Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenCalledWith(
        {},
        false
      );
    });
    it("should call server error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("serverError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      const mockWindow = Object.create(window);
      const url = "http://dummy.com";
      Object.defineProperty(mockWindow, "location", {
        value: {
          href: url,
        },
        writable: true,
      });
      await store.dispatch("users/" + ActionTypes.getGoogleAuthUrl, mockWindow);
      expect(mockWindow.location.href).toBe("http://dummy.com");
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new HttpError(500, {}, "Server Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenCalledWith(
        {},
        false
      );
    });
    it("should call parse error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("parseError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      const mockWindow = Object.create(window);
      const url = "http://dummy.com";
      Object.defineProperty(mockWindow, "location", {
        value: {
          href: url,
        },
        writable: true,
      });
      await store.dispatch("users/" + ActionTypes.getGoogleAuthUrl, mockWindow);
      expect(mockWindow.location.href).toBe("http://dummy.com");
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new ParseError("Parse Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenCalledWith(
        {},
        false
      );
    });
  });
  describe("LoginGoogle", () => {
    it("should call success callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.loginGoogle, {
        code: "test",
        state: "test",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).toHaveBeenCalledWith(
        {},
        {
          username: "username",
          name: "name",
          email: "email",
          password: null,
          lastName: "last name",
          refreshToken: "token",
          accessToken: "token",
          institution: "institution",
          role: "role",
        }
      );
    });
    it("should call client error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.loginGoogle, {
        code: "test",
        state: "test",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).not.toHaveBeenCalled();
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        HttpError.fromStatus(400, {}, "Client Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenCalledWith(
        {},
        false
      );
    });
    it("should call server error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("serverError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.loginGoogle, {
        code: "test",
        state: "test",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).not.toHaveBeenCalled();
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        HttpError.fromStatus(500, {}, "Server Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenCalledWith(
        {},
        false
      );
    });
    it("should call parse error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("parseError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("users/" + ActionTypes.loginGoogle, {
        code: "test",
        state: "test",
      });
      expect(mockMutations[MutationTypes.SET_USER_DATA]).not.toHaveBeenCalled();
      expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
        {},
        new ParseError("Parse Error")
      );
      expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenCalledWith(
        {},
        false
      );
    });
  });
});
