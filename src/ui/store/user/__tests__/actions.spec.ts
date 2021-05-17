import { containerBuilder } from "@/ui/plugins/inversify";
import { IUserRepository } from "@/app/user/domain/User.types";
import { MockAuthService } from "@/app/user/infrastructure/__tests__/AuthService.mock";
import { TestActions } from "@/shared/http";
import { createLocalVue } from "@vue/test-utils";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import Vuex from "vuex";
import { Modules } from "../../RegisterModules";
import { IStoreCreator } from "../../StoreCreator";
import { actions, ActionTypes } from "../actions";
import { MutationTypes } from "../mutations";
import { mockMutations } from "./mutations.mock";

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
          token: null,
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
        "Client Error"
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
        "Server Error"
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
        "Parse Error"
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
        "username required"
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
          token: "token",
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
        "Client Error"
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
        "Server Error"
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
        "Parse Error"
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
        "password required"
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
});
