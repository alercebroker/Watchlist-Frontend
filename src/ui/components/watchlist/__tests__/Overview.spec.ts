import { containerBuilder } from "@/ui/plugins/inversify";
import { ActionTypes } from "@/ui/store/matches/actions";
import { MutationTypes } from "@/ui/store/matches/mutations";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Vuetify from "vuetify";
import Vue from "vue";
import { IRootState } from "@/ui/store/Store.types";
import { cid, container, resetContainer } from "inversify-props";
import { Modules } from "@/ui/store/RegisterModules";
import { IStoreCreator, StoreCreator } from "@/ui/store/StoreCreator";
import Overview from "../Overview.vue";

const modules = () => ({
  modules: {
    singleWatchlist: {
      namespaced: true,
      actions: {},
      mutations: {},
      state: {
        id: 1,
      },
      getters: {},
    },
    targets: {
      namespaced: true,
      actions: {},
      mutations: {},
      state: {
        targets: [
          {
            id: 1,
            name: "test",
            url: "url",
          },
        ],
      },
      getters: {},
    },
    matches: {
      namespaced: true,
      actions: {
        [ActionTypes.getAllMatches]: jest.fn(),
      },
      mutations: {
        [MutationTypes.SET_MATCHES]: jest.fn(),
      },
      state: {
        matches: [
          {
            object_id: "oid1",
            candid: "candid1",
          },
        ],
        loading: false,
      },
    },
  },
});

describe("Overview", () => {
  containerBuilder();
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  let store: Store<IRootState>;
  let defaultModules = modules();
  beforeEach(() => {
    resetContainer();
    containerBuilder();
    vuetify = new Vuetify();
    container.unbind("Modules");
    container.bind<Modules>("Modules").toConstantValue(defaultModules);
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
  });
  describe("Targets", () => {
    it("should display targets if available", () => {
      const wrapper = mount(Overview, {
        localVue,
        store,
        vuetify,
      });
      expect(wrapper.find("#t1").exists()).toBeTruthy();
    });
    it("should display nothing if no targets available", () => {
      const emptyModules = modules();
      emptyModules.modules.targets.state.targets = [];
      container.unbind("Modules");
      container.bind<Modules>("Modules").toConstantValue(emptyModules);
      container.unbind(cid.StoreCreator);
      container.addSingleton<IStoreCreator>(StoreCreator);
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      store = storeCreator.create();
      const wrapper = mount(Overview, {
        localVue,
        store,
        vuetify,
      });
      expect(wrapper.find("#targetFoot").find("p").text()).toBe(
        "No targets for this watchlist"
      );
    });
    it("should dispatch get matches action and select target", () => {
      const overview = mount(Overview, {
        localVue,
        store,
        vuetify,
      });
      overview.find("#t1").trigger("click");
      expect(
        defaultModules.modules.matches.actions[ActionTypes.getAllMatches]
      ).toHaveBeenCalledWith(expect.anything(), {
        url: "url",
        watchlistId: 1,
        targetId: 1,
      });
    });
  });
  describe("Matches", () => {
    it("should display matches if available", () => {
      const wrapper = mount(Overview, {
        localVue,
        store,
        vuetify,
      });
      expect(wrapper.find("#mcandid1").exists()).toBeTruthy();
    });
    it("should display nothing if no targets available", async () => {
      const emptyModules = modules();
      emptyModules.modules.matches.state.matches = [];
      container.unbind("Modules");
      container.bind<Modules>("Modules").toConstantValue(emptyModules);
      container.unbind(cid.StoreCreator);
      container.addSingleton<IStoreCreator>(StoreCreator);
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      store = storeCreator.create();
      const wrapper = mount(Overview, {
        localVue,
        store,
        vuetify,
      });
      await wrapper.setData({ selectedTarget: "test" });
      expect(wrapper.find("#matchFoot").find("p").text()).toBe(
        "No matches for this target"
      );
    });
  });
});