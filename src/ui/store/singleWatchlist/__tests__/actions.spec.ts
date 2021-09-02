import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import { containerBuilder } from "@/ui/app.container";
import { actions, EditWatchlistPayload } from "../actions";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { mockMutations } from "./mutations.mock";
import { mockMutations as watchlistsMockMutations } from "../../watchlist/__tests__/mutations.mock";
import { IWatchlistRepository } from "@/app/watchlist/domain";
import { MockWatchlistService } from "@/app/watchlist/infrastructure/__tests__/WatchlistService.mock";
import { Modules } from "../../RegisterModules";
import { HttpError, TestActions } from "@/shared/http";
import { IStoreCreator } from "../../StoreCreator";
import { MutationTypes } from "../mutations";
import { MutationTypes as WatchlistMutationTypes } from "../../watchlist/mutations";
import { ParseError } from "@/shared/error/ParseError";

const localVue = createLocalVue();
localVue.use(Vuex);
const modules = {
  modules: {
    singleWatchlist: {
      namespaced: true,
      actions: actions,
      mutations: mockMutations(),
      state: {},
      getters: {},
    },
    watchlists: {
      namespaced: true,
      actions: {},
      mutations: watchlistsMockMutations,
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
  container.bind<Modules>("Modules").toConstantValue(modules);
});

describe("Watchlist actions", () => {
  describe("EditWatchlist", () => {
    it("should update specific watchlist if response is ok", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("singleWatchlist/editWatchlist", {
        params: { title: "watchlist 1", notification_rate: "hourly" },
        watchlist: 1,
      } as EditWatchlistPayload);
      expect(
        modules.modules.singleWatchlist.mutations[
          MutationTypes.SET_NOTIFICATION_RATE
        ]
      ).toHaveBeenCalled();
      expect(
        modules.modules.singleWatchlist.mutations[MutationTypes.SET_TITLE]
      ).toHaveBeenCalled();
      expect(
        modules.modules.watchlists.mutations[
          WatchlistMutationTypes.UPDATE_WATCHLIST
        ]
      ).toHaveBeenCalled();
    });

    it("should call client error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("singleWatchlist/editWatchlist", {
        params: { title: "watchlist 1", notification_rate: "hourly" },
        watchlist: 1,
      } as EditWatchlistPayload);
      expect(
        modules.modules.singleWatchlist.mutations[MutationTypes.SET_ERROR]
      ).toHaveBeenCalledWith({}, new HttpError(400, {}, "Client Error"));
      expect(
        modules.modules.singleWatchlist.mutations[MutationTypes.SET_LOADING]
      ).toHaveBeenNthCalledWith(1, {}, true);
      expect(
        modules.modules.singleWatchlist.mutations[MutationTypes.SET_LOADING]
      ).toHaveBeenLastCalledWith({}, false);
    });

    it("should call server error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("serverError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("singleWatchlist/editWatchlist", {
        params: { title: "watchlist 1", notification_rate: "hourly" },
        watchlist: 1,
      } as EditWatchlistPayload);
      expect(
        modules.modules.singleWatchlist.mutations[MutationTypes.SET_ERROR]
      ).toHaveBeenCalledWith({}, new HttpError(400, {}, "Server Error"));
      expect(
        modules.modules.singleWatchlist.mutations[MutationTypes.SET_LOADING]
      ).toHaveBeenNthCalledWith(1, {}, true);
      expect(
        modules.modules.singleWatchlist.mutations[MutationTypes.SET_LOADING]
      ).toHaveBeenLastCalledWith({}, false);
    });

    it("should call parse error callback", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("parseError");
      const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
      const store = storeCreator.create();
      await store.dispatch("singleWatchlist/editWatchlist", {
        params: { title: "watchlist 1", notification_rate: "hourly" },
        watchlist: 1,
      } as EditWatchlistPayload);
      expect(
        modules.modules.singleWatchlist.mutations[MutationTypes.SET_ERROR]
      ).toHaveBeenCalledWith({}, new ParseError("Parse Error"));
      expect(
        modules.modules.singleWatchlist.mutations[MutationTypes.SET_LOADING]
      ).toHaveBeenNthCalledWith(1, {}, true);
      expect(
        modules.modules.singleWatchlist.mutations[MutationTypes.SET_LOADING]
      ).toHaveBeenLastCalledWith({}, false);
    });
  });
});
