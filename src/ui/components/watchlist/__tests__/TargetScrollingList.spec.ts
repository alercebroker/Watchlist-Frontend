import { containerBuilder } from "@/ui/plugins/inversify";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Vue from "vue";
import Vuetify from "vuetify";
import { IRootState } from "@/ui/store/Store.types";
import { ActionTypes } from "@/ui/store/matches/actions";
import { MutationTypes } from "@/ui/store/matches/mutations";
import { cid, container, resetContainer } from "inversify-props";
import { Modules } from "@/ui/store/RegisterModules";
import { IStoreCreator } from "@/ui/store/StoreCreator";
import TargetScrollingList from "../TargetScrollingList.vue";
import "./intersectionObserverMock";

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
        loading: false,
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

describe("TargetScrollingList", () => {
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
  it("should display targets if available", () => {
    const wrapper = mount(TargetScrollingList, {
      localVue,
      store,
      vuetify,
      propsData: {
        targets: modules().modules.targets.state.targets,
        loading: false,
      },
    });
    expect(wrapper.find("#t1").exists()).toBeTruthy();
  });
  it("should display nothing if no targets available", () => {
    const wrapper = mount(TargetScrollingList, {
      localVue,
      store,
      vuetify,
      propsData: {
        targets: [],
        loading: false,
      },
    });
    expect(wrapper.find("#targetFoot").find("p").text()).toBe(
      "No targets for this watchlist"
    );
  });
  it("should emit target selected event", async () => {
    const wrapper = mount(TargetScrollingList, {
      localVue,
      store,
      vuetify,
      propsData: {
        targets: modules().modules.targets.state.targets,
        loading: false,
      },
    });
    wrapper.find("#t1").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().targetSelected).toBeTruthy();
  });
});
