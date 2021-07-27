import { containerBuilder } from "@/ui/app.container";
import { ActionTypes } from "@/ui/store/matches/actions";
import { MutationTypes } from "@/ui/store/matches/mutations";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Vuetify from "vuetify";
import Vue from "vue";
import { IRootState } from "@/ui/store/Store.types";
import { cid, container, resetContainer } from "inversify-props";
import { Modules } from "@/ui/store/RegisterModules";
import { IStoreCreator, StoreCreator } from "@/ui/store/StoreCreator";
import Overview from "../Overview.vue";
import TargetScrollingList from "../TargetScrollingList.vue";
import "./intersectionObserverMock";
import flushPromises from "flush-promises";
import { ActionTypes as TargetActionTypes } from "@/ui/store/targets/actions";

const modules = (): Modules => ({
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
        loading: false,
        nextPage: null,
        prevPage: null,
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
  const defaultModules = modules();
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
    it("should get matches on target click", async () => {
      const wrapper = shallowMount(Overview, {
        localVue,
        store,
        vuetify,
      });
      const targetList = wrapper.findComponent(TargetScrollingList);
      targetList.vm.$emit(
        "targetSelected",
        defaultModules.modules.targets.state.targets[0]
      );
      await flushPromises();
      expect(
        defaultModules.modules.matches.actions[ActionTypes.getAllMatches]
      ).toHaveBeenCalledWith(expect.anything(), {
        url: "url",
        watchlistId: 1,
        targetId: 1,
      });
    });
    it("should get targets on scroll", async () => {
      const localModules = modules();
      localModules.modules.targets.state.nextPage = "next";
      localModules.modules.targets.actions[
        TargetActionTypes.getTargets
      ] = jest.fn();
      container.unbind("Modules");
      container.bind<Modules>("Modules").toConstantValue(localModules);
      container.unbind(cid.StoreCreator);
      container.addSingleton<IStoreCreator>(StoreCreator);
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      store = storeCreator.create();
      const wrapper = shallowMount(Overview, {
        localVue,
        store,
        vuetify,
      });
      const targetList = wrapper.findComponent(TargetScrollingList);
      targetList.vm.$emit("nextPage");
      await flushPromises();
      expect(
        localModules.modules.targets.actions[TargetActionTypes.getTargets]
      ).toHaveBeenCalledWith(expect.anything(), {
        params: { url: "next", append: true },
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
      flushPromises();
      expect(wrapper.find("#matchFoot").find("p").text()).toBe(
        "No matches for this target"
      );
    });
  });
});
