import { containerBuilder } from "@/ui/plugins/inversify";
import { cid, container, resetContainer } from "inversify-props";
import { IStoreCreator } from "../StoreCreator";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

beforeEach(() => {
  resetContainer();
  containerBuilder();
});
describe("Store", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  describe("Init", () => {
    it("should register modules", () => {
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      expect(store).toHaveProperty("_modulesNamespaceMap.watchlists/");
      expect(store).toHaveProperty("_modulesNamespaceMap.users/");
    });
  });
});
