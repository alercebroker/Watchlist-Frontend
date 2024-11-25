import { ITargetData } from "@/app/target/domain/Target.types";
import { containerBuilder } from "@/ui/app.container";
import { createLocalVue } from "@vue/test-utils";
import { cid, container, resetContainer } from "inversify-props";
import Vuex from "vuex";
import { Modules } from "../../RegisterModules";
import { IStoreCreator } from "../../StoreCreator";
import { mutations } from "../mutations";

const localVue = createLocalVue();
localVue.use(Vuex);

const modules = {
  modules: {
    targets: {
      namespaced: true,
      actions: {},
      mutations: mutations,
      state: {
        targets: [
          {
            id: 1,
            name: "name",
            ra: 0,
            dec: 0,
            radius: 0,
          },
        ],
      },
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

describe("UPDATE_TARGET", () => {
  it("should set specified target with new data", () => {
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    const target: ITargetData = {
      id: 1,
      name: "name_edited",
      ra: 1,
      dec: 2,
      radius: 3,
    } as ITargetData;
    store.commit("targets/UPDATE_TARGET", target);
    expect(store.state.targets.targets[0]).toStrictEqual(target);
  });
});

describe("DELETE_TARGET", () => {
  it("should remove target from target list", () => {
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    const target = 1;
    store.commit("targets/DELETE_TARGET", target);
    expect(store.state.targets.targets.length).toBe(0);
  });
});
