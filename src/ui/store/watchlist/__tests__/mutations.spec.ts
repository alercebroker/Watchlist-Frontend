import { IWatchlistData } from "@/app/watchlist/domain";
import { containerBuilder } from "@/ui/app.container";
import { createLocalVue } from "@vue/test-utils";
import { cid, container, resetContainer } from "inversify-props";
import { IStoreCreator } from "../../StoreCreator";
import { mutations } from "../mutations";
import Vuex from "vuex";
import { state } from "../state";
import { HttpError } from "@/shared/http";
import { Modules } from "../../RegisterModules";

const localVue = createLocalVue();
localVue.use(Vuex);

const modules = {
  modules: {
    watchlists: {
      namespaced: true,
      actions: {},
      mutations: mutations,
      state: state,
      getters: {},
    },
  },
};

beforeEach(() => {
  resetContainer();
  containerBuilder();
  container.unbind("Modules");
  container.bind<Modules>("Modules").toConstantValue(modules);
});

describe("SET_WATCHLISTS", () => {
  it("should set state with watchlists", () => {
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    const data: IWatchlistData[] = [
      {
        id: 1,
        title: "titulo",
        owner: "owner",
        notificationRate: "hourly",
        lastNotified: "date",
        targets: "test",
        nTargets: "test",
        lastMatch: "test",
        url: "test",
      },
    ];
    store.commit("watchlists/SET_WATCHLISTS", data);
    expect(store.state.watchlists.watchlists).toStrictEqual(data);
  });
  it("should set state with error", () => {
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    const error = new HttpError(400, {}, "Bad request");
    store.commit("watchlists/SET_ERROR", error.message);
    expect(store.state.watchlists.error).toEqual(error.message);
  });
  it("should set state loading true", () => {
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    store.commit("watchlists/SET_LOADING", true);
    expect(store.state.watchlists.loading).toBeTruthy();
  });
});
