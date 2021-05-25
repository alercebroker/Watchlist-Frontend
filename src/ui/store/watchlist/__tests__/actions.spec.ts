import { containerBuilder } from "@/ui/plugins/inversify";
import { IWatchlistRepository } from "@/app/watchlist/domain";
import { MockWatchlistService } from "@/app/watchlist/infrastructure/__tests__/WatchlistService.mock";
import { TestActions } from "@/shared/http";
import { createLocalVue } from "@vue/test-utils";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import Vuex from "vuex";
import { IStoreCreator } from "../../StoreCreator";
import { actions } from "../actions";
import { mockMutations } from "./mutations.mock";
import { MutationTypes } from "../mutations";
import { Modules } from "../../RegisterModules";
const localVue = createLocalVue();

localVue.use(Vuex);

const modules = {
  modules: {
    watchlists: {
      namespaced: true,
      actions: actions,
      mutations: mockMutations,
      state: {},
      getters: {},
    },
  },
};

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockSingleton<IWatchlistRepository>(
    cid.WatchlistService,
    MockWatchlistService
  );
  container.unbind("Modules");
  mockMutations[MutationTypes.SET_WATCHLISTS] = jest.fn();
  mockMutations[MutationTypes.SET_ERROR] = jest.fn();
  mockMutations[MutationTypes.SET_LOADING] = jest.fn();
  container.bind<Modules>("Modules").toConstantValue(modules);
});

describe("getAllWatchlists", () => {
  it("should call success callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("ok");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("watchlists/getAllWatchlists");
    const expected = [
      {
        title: "watchlist 1",
        owner: "owner 1",
        targets: "test",
        nTargets: "test",
        lastMatch: "test",
        url: "test",
      },
      {
        title: "watchlist 2",
        owner: "owner 1",
        targets: "test",
        nTargets: "test",
        lastMatch: "test",
        url: "test",
      },
    ];
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      expected
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      null
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );
  });
  it("should call client error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("clientError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("watchlists/getAllWatchlists");
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      []
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      "Client Error"
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );
  });
  it("should call server error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("serverError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("watchlists/getAllWatchlists");
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      []
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      "Server Error"
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );
  });
  it("should call parse error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("parseError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("watchlists/getAllWatchlists");
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      []
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      "Parse Error"
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );
  });
});

describe("createWatchlist", () => {
  it("should call success callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("ok");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    const watchlistInput = {
      title: "title",
      targets: [
        {
          name: "target",
          radius: 1.0,
          ra: 1.0,
          dec: 1.0,
        },
      ]
    }
    await store.dispatch("watchlists/createWatchlist", watchlistInput);
    const expected = [
      {
        title: "watchlist 1",
        owner: "owner 1",
        targets: "test",
        nTargets: "test",
        lastMatch: "test",
        url: "test",
      },
      {
        title: "watchlist 2",
        owner: "owner 1",
        targets: "test",
        nTargets: "test",
        lastMatch: "test",
        url: "test",
      },
      {
        title: "watchlist 3",
        owner: "owner 1",
        targets: "test",
        nTargets: "test",
        lastMatch: "test",
        url: "test",
      },

    ];
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      expected
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      null
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );

  });

  it("should call client error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("clientError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    const watchlistInput = {
      title: "title",
      targets: [
        {
          name: "target",
          radius: 1.0,
          ra: 1.0,
          dec: 1.0,
        },
      ]
    }
    await store.dispatch("watchlists/createWatchlist", watchlistInput);
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      []
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      "Client Error"
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );
  });
  it("should call server error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("serverError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    const watchlistInput = {
      title: "title",
      targets: [
        {
          name: "target",
          radius: 1.0,
          ra: 1.0,
          dec: 1.0,
        },
      ]
    }
    await store.dispatch("watchlists/createWatchlist", watchlistInput);
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      []
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      "Server Error"
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );
  });
  it("should call parse error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("parseError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    const watchlistInput = {
      title: "title",
      targets: [
        {
          name: "target",
          radius: 1.0,
          ra: 1.0,
          dec: 1.0,
        },
      ]
    }
    await store.dispatch("watchlists/createWatchlist", watchlistInput);
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      []
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      "Parse Error"
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );
  });
});

describe("deleteWatchlist", () => {
  it("should call success callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("ok");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("watchlists/deleteWatchlist");
    const expected = [
      {
        title: "watchlist 1",
        owner: "owner 1",
        targets: "test",
        nTargets: "test",
        lastMatch: "test",
        url: "test",
      },
      {
        title: "watchlist 2",
        owner: "owner 1",
        targets: "test",
        nTargets: "test",
        lastMatch: "test",
        url: "test",
      },
    ];
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      expected
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      null
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );

  });

  it("should call client error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("clientError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("watchlists/deleteWatchlist");
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      []
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      "Client Error"
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );
  });
  it("should call server error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("serverError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("watchlists/deleteWatchlist");
    //console.log(store);
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      []
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      "Server Error"
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );
  });
  it("should call parse error callback", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("parseError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("watchlists/deleteWatchlist");
    expect(mockMutations[MutationTypes.SET_WATCHLISTS]).toHaveBeenCalledWith(
      {},
      []
    );
    expect(mockMutations[MutationTypes.SET_ERROR]).toHaveBeenCalledWith(
      {},
      "Parse Error"
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenNthCalledWith(
      1,
      {},
      true
    );
    expect(mockMutations[MutationTypes.SET_LOADING]).toHaveBeenLastCalledWith(
      {},
      false
    );
  });
});

describe("selectWatchlist", () => {

});


