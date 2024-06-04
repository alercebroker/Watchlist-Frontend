import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Vuetify from "vuetify";
import Vue from "vue";
import { IRootState } from "@/ui/store/Store.types";
import { cid, container, resetContainer } from "inversify-props";
import { IStoreCreator, StoreCreator } from "@/ui/store/StoreCreator";
import Overview from "../Overview.vue";
import "./intersectionObserverMock";
import { Modules } from "@/ui/store/RegisterModules";
import { mockActions } from "@/ui/store/targets/__tests__/actions.mock";
import { getters } from "@/ui/store/targets/getters";
import { Getters as MatchesGetters } from "@/ui/store/matches/getters";
import { ActionTypes } from "@/ui/store/matches/actions";
import { ActionTypes as ActionsTargets } from "@/ui/store/targets/actions";
import { MutationTypes } from "@/ui/store/matches/mutations";
import { containerBuilder } from "@/ui/app.container";
import flushPromises from "flush-promises";

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

  /**
  it("when singleItem is empty show the respective card", () => {
    expect(wrapper.find("h3").text()).toBe("No target selected");
  });*/

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
});
