import { containerBuilder } from "@/ui/app.container";
import { IStoreCreator, StoreCreator } from "@/ui/store/StoreCreator";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { cid, container, resetContainer } from "inversify-props";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex, { Store } from "vuex";
import flushPromises from "flush-promises";
import Overview from "../Overview.vue";
import MatchesList from "../MatchesList.vue";
import { IRootState } from "@/ui/store/Store.types";
import { Modules } from "@/ui/store/RegisterModules";
import { Getters as MatchesGetters } from "@/ui/store/matches/getters";

jest.mock("htmx.org", () => ({
  ajax: jest.fn(),
  process: jest.fn(),
}));

const modules = (): Modules => ({
  modules: {
    singleTarget: {
      namespaced: true,
      actions: {},
      mutations: {},
      state: {
        loading: false,
        target: {
          id: 2,
          name: "test2",
          ra: 1,
          dec: 2,
          radius: 3,
          filter: {
            fields: {},
            filters: [
              {
                params: {
                  constant: "11",
                  field: "mag",
                  op: "greater",
                },
                type: "constant",
              },
            ],
          },
        },
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
            name: "test1",
            ra: 1,
            dec: 2,
            radius: 3,
            filter: {
              fields: {},
              filters: [
                {
                  params: {
                    constant: "11",
                    field: "mag",
                    op: "greater",
                  },
                  type: "constant",
                },
              ],
            },
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
      actions: {},
      mutations: {},
      state: {
        matches: [
          {
            object_id: "oid1",
            date: "2020-01-01",
            candid: "candid1",
          },
        ],
        loading: false,
      },
      getters: {
        formattedMJDMatches: () => [
          { object_id: "oid1", date: "123", candid: "candid1" },
        ],
        formattedUTCMatches: () => [
          { object_id: "oid1", date: "some date", candid: "candid1" },
        ],
      } as MatchesGetters,
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

  it("should mount a warning card when singleTarget is empty", async () => {
    const emptyModules = {
      modules: {
        singleTarget: {
          namespaced: true,
          actions: {},
          mutations: {},
          state: {
            target: {},
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
        matches: {
          namespaced: true,
          actions: {},
          mutations: {},
          state: {
            matches: [],
            loading: false,
          },
          getters: {
            formattedMJDMatches: () => [],
            formattedUTCMatches: () => [],
          } as MatchesGetters,
        },
      },
    };
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

    await flushPromises();

    expect(wrapper.find("#cardOverview").exists()).toBe(false);
  });

  it("should show the overview card when singleTarget is not empty", async () => {
    const wrapper = shallowMount(Overview, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const card = wrapper.find("#cardOverview");

    expect(card.isVisible()).toBe(true);
  });

  it("should show the matches component", async () => {
    const wrapper = mount(Overview, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const card = wrapper.find("#cardOverview");
    expect(card.findComponent(MatchesList).exists()).toBe(true);
  });
});
