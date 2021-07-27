import { containerBuilder } from "@/ui/app.container";
import { IWatchlistRepository } from "@/app/watchlist/domain";
import { MockWatchlistService } from "@/app/watchlist/infrastructure/__tests__/WatchlistService.mock";
import { TestActions } from "@/shared/http";
import { createLocalVue, mount } from "@vue/test-utils";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex, { Store } from "vuex";
import MyWatchlists from "@/ui/components/watchlist/MyWatchlists.vue";
import flushPromises from "flush-promises";
import { IStoreCreator, StoreCreator } from "@/ui/store/StoreCreator";
import { mockActions } from "@/ui/store/watchlist/__tests__/actions.mock";
import { mockActions as mockTargetActions } from "@/ui/store/targets/__tests__/actions.mock";
import { Modules } from "@/ui/store/RegisterModules";
import { ActionTypes } from "@/ui/store/watchlist/actions";
import "./intersectionObserverMock";
import { IRootState } from "@/ui/store/Store.types";

const modules = {
  modules: {
    watchlists: {
      namespaced: true,
      actions: mockActions(),
      mutations: {},
      state: {
        watchlists: [],
      },
      getters: {},
    },
    targets: {
      namespaced: true,
      actions: mockTargetActions,
      mutations: {},
      state: {},
      getters: {},
    },
    singleWatchlist: {
      namespaced: true,
      actions: {},
      mutations: {},
      state: {
        url: "test",
      },
      getters: {},
    },
  },
};

describe("List Watchlist", () => {
  containerBuilder();
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  let store: Store<IRootState>;

  beforeEach(() => {
    vuetify = new Vuetify();
    resetContainer();
    containerBuilder();
    container.unbind("Modules");
    container.bind<Modules>("Modules").toConstantValue(modules);
    mockSingleton<IWatchlistRepository>(
      cid.WatchlistService,
      MockWatchlistService
    );
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
  });

  it("should mount and fetch watchlists", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("ok");
    const wrapper = mount(MyWatchlists, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const expected = [
      {
        title: "watchlist 1",
        owner: "owner 1",
      },
      {
        title: "watchlist 2",
        owner: "owner 1",
      },
    ];
    const wrappers = wrapper.findAll(".v-list-item__title").wrappers;
    wrappers.forEach((item, index) => {
      expect(item.text()).toEqual(expected[index].title);
    });
  });
  it("should call actions when selectedItem changes", async () => {
    const localModules = {
      modules: {
        watchlists: {
          namespaced: true,
          actions: mockActions(),
          mutations: {},
          state: {
            watchlists: [],
          },
          getters: {},
        },
        targets: {
          namespaced: true,
          actions: mockTargetActions,
          mutations: {},
          state: {},
          getters: {},
        },
        singleWatchlist: {
          namespaced: true,
          actions: {},
          mutations: {},
          state: {
            url: "test",
          },
          getters: {},
        },
      },
    };
    container.unbind("Modules");
    container.bind<Modules>("Modules").toConstantValue(localModules);
    container.unbind(cid.StoreCreator);
    container.addSingleton<IStoreCreator>(StoreCreator);
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
    container.bind<TestActions>("ActionType").toConstantValue("ok");
    const wrapper = mount(MyWatchlists, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    wrapper.setData({
      selectedItem: 2,
    });
    await flushPromises();
    const mock = localModules.modules.watchlists.actions[
      ActionTypes.selectWatchlist
    ] as jest.Mock;
    expect(mock.mock.calls[0][1]).toBe(2);
  });
  it("should fetch new page when scrolling and next page is available", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("ok");
    const localModules = {
      modules: {
        watchlists: {
          namespaced: true,
          actions: mockActions(),
          mutations: {},
          state: {
            watchlists: [
              {
                id: 1,
                title: "watchlist 1",
                owner: "owner 1",
                targets: "test",
                url: "test",
                nTargets: "test",
                lastMatch: "test",
              },
            ],
            nextPage: "nextPage",
          },
          getters: {},
        },
        targets: {
          namespaced: true,
          actions: mockTargetActions,
          mutations: {},
          state: {},
          getters: {},
        },
        singleWatchlist: {
          namespaced: true,
          actions: {},
          mutations: {},
          state: {
            url: "test",
          },
          getters: {},
        },
      },
    };
    container.unbind("Modules");
    container.bind<Modules>("Modules").toConstantValue(localModules);
    container.unbind(cid.StoreCreator);
    container.addSingleton<IStoreCreator>(StoreCreator);
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
    const wrapper = mount(MyWatchlists, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    expect(
      localModules.modules.watchlists.actions[ActionTypes.getAllWatchlists]
    ).toHaveBeenCalledWith(expect.anything(), {
      url: "nextPage",
      append: true,
    });
  });
});
