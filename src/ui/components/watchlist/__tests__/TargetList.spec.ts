import { containerBuilder } from "@/ui/plugins/inversify";
import { IStoreCreator, StoreCreator } from "@/ui/store/StoreCreator";
import { createLocalVue, mount } from "@vue/test-utils";
import { cid, container, resetContainer } from "inversify-props";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex, { Store } from "vuex";
import TargetList from "@/ui/components/watchlist/TargetList.vue";
import flushPromises from "flush-promises";
import { Modules } from "@/ui/store/RegisterModules";
import { IRootState } from "@/ui/store/Store.types";

const modules = {
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
            name: "test",
          },
        ],
      },
      getters: {},
    },
  },
};

describe("List Targets", () => {
  containerBuilder();
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  let store: Store<IRootState>;

  beforeEach(() => {
    resetContainer();
    containerBuilder();
    vuetify = new Vuetify();
    container.unbind("Modules");
    container.bind<Modules>("Modules").toConstantValue(modules);
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
  });

  it("should mount and not show anything if there aren't targets", async () => {
    const emptyModules = {
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
            targets: [],
          },
          getters: {},
        },
      },
    };

    container.unbind("Modules");
    container.bind<Modules>("Modules").toConstantValue(emptyModules);
    container.unbind(cid.StoreCreator);
    container.addSingleton<IStoreCreator>(StoreCreator);
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
    const wrapper = mount(TargetList, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const tbody = wrapper.find("tbody");
    const tr = tbody.find("tr");
    expect(tr.find("td").text()).toBe("No data available");
  });
  it("should mount and show targets if store is not empty", async () => {
    const wrapper = mount(TargetList, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const tbody = wrapper.find("tbody");
    const trs = tbody.findAll("tr");
    expect(trs.length).toBe(1);
    trs.wrappers.forEach((tr) => {
      expect(tr.find("td").text()).toBe("test");
    });
  });
});
