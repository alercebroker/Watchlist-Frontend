import { containerBuilder } from "@/ui/app.container";
import { ITargetRepository } from "@/app/target/domain/Target.types";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import {
  actions,
  CreateTargetPayload,
  DeleteTargetPayload,
  EditTargetPayload,
} from "../actions";
import { mockMutations } from "./mutations.mock";
import { MockTargetService } from "@/app/target/infrastructure/__tests__/TargetService.mock";
import { Modules } from "../../RegisterModules";
import { TestActions } from "@/shared/http";
import { IStoreCreator } from "../../StoreCreator";
import { MutationTypes } from "../mutations";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
const modules = {
  modules: {
    targets: {
      namespaced: true,
      actions: actions,
      mutations: mockMutations(),
      state: {},
      getters: {},
    },
  },
};

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockSingleton<ITargetRepository>(cid.TargetService, MockTargetService);
  container.unbind("Modules");
  container.bind<Modules>("Modules").toConstantValue(modules);
});

describe("TargetActions", () => {
  describe("EditTarget", () => {
    it("should update specific target if response is ok", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("targets/editTarget", {
        target: { id: 1, name: "name", ra: 1, dec: 2, radius: 3 },
        watchlist: 1,
        url: "url",
      } as EditTargetPayload);
      expect(
        modules.modules.targets.mutations[MutationTypes.UPDATE_TARGET]
      ).toHaveBeenCalled();
    });
  });
  describe("CreateTarget", () => {
    it("should add created target if response is ok", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("targets/createTarget", {
        target: { id: 1, name: "name", ra: 1, dec: 2, radius: 3 },
        watchlist: 1,
      } as CreateTargetPayload);
      expect(
        modules.modules.targets.mutations[MutationTypes.APPEND_TARGETS]
      ).toHaveBeenCalled();
    });
  });
  describe("DeleteTarget", () => {
    it("should remove target if response is ok", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("targets/deleteTarget", {
        target: 1,
        watchlist: 1,
      } as DeleteTargetPayload);
      expect(
        modules.modules.targets.mutations[MutationTypes.DELETE_TARGET]
      ).toHaveBeenCalledWith(expect.anything(), 1);
    });
  });
});
