import { containerBuilder } from "@/ui/plugins/inversify";
import { IUserData } from "@/app/user/domain/User.types";
import { HttpError } from "@/shared/http";
import { createLocalVue } from "@vue/test-utils";
import { cid, container, resetContainer } from "inversify-props";
import Vuex from "vuex";
import { Modules } from "../../RegisterModules";
import { IStoreCreator } from "../../StoreCreator";
import { mutations, MutationTypes } from "../mutations";
import { state } from "../state";
const localVue = createLocalVue();
localVue.use(Vuex);

const modules = {
  modules: {
    users: {
      namespaced: true,
      actions: {},
      mutations: mutations,
      state: state,
      getters: {},
    },
  },
};

beforeEach(() => {
  resetContainer();
  containerBuilder();
  container.unbind("Modules");
  container.bind<Modules>("Modules").toConstantValue(modules);
});

describe("UserMutations", () => {
  it("should set state with watchlists", () => {
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    const data: IUserData[] = [
      {
        username: "username",
        name: "name",
        email: "email",
        lastName: "last name",
        password: "password",
        token: "token",
        institution: "inst",
        role: "role",
      },
    ];
    store.commit("users/" + MutationTypes.SET_USER_DATA, data);
    expect(store.state.users.userData).toStrictEqual(data);
  });
  it("should set state with error", () => {
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    const error = new HttpError(400, "Bad request");
    store.commit("users/" + MutationTypes.SET_ERROR, error.message);
    expect(store.state.users.error).toEqual(error.message);
  });
  it("should set state loading true", () => {
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    store.commit("users/" + MutationTypes.SET_LOADING, true);
    expect(store.state.users.loading).toBeTruthy();
  });
});
