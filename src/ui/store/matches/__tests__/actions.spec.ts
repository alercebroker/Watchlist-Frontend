import { containerBuilder } from "@/ui/plugins/inversify";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { MutationTypes } from "../mutations";
import { actions, ActionTypes, GetMatchesPayload } from "../actions";
import { IMatchRepository } from "@/app/match/domain/Match.types";
import { MatchServiceMock } from "@/app/match/infrastructure/__tests__/MatchService.mock";
import { Modules } from "../../RegisterModules";
import { TestActions } from "@/shared/http";
import { IStoreCreator } from "../../StoreCreator";
import { mockMatches } from "@/app/match/domain/Match.mock";

const localVue = createLocalVue();

localVue.use(Vuex);

const modules = {
  modules: {
    matches: {
      namespaced: true,
      actions: actions,
      mutations: {
        [MutationTypes.SET_ERROR]: jest.fn(),
        [MutationTypes.SET_LOADING]: jest.fn(),
        [MutationTypes.SET_MATCHES]: jest.fn(),
      },
      state: {},
      getters: {},
    },
  },
};

beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockSingleton<IMatchRepository>(cid.MatchService, MatchServiceMock);
  container.unbind("Modules");
  modules.modules.matches.mutations[MutationTypes.SET_ERROR] = jest.fn();
  modules.modules.matches.mutations[MutationTypes.SET_LOADING] = jest.fn();
  modules.modules.matches.mutations[MutationTypes.SET_MATCHES] = jest.fn();
  container.bind<Modules>("Modules").toConstantValue(modules);
});

describe("getAllMatches", () => {
  it("should call success callback on successful response", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("ok");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("matches/" + ActionTypes.getAllMatches, {
      url: "test",
      watchlistId: 1,
      targetId: 1,
    } as GetMatchesPayload);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_MATCHES]
    ).toHaveBeenCalledWith({}, mockMatches);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_ERROR]
    ).toHaveBeenCalledWith({}, null);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_LOADING]
    ).toHaveBeenNthCalledWith(1, {}, true);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_LOADING]
    ).toHaveBeenLastCalledWith({}, false);
  });
  it("should call client error callback on client error response", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("clientError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("matches/" + ActionTypes.getAllMatches, {
      url: "test",
      watchlistId: 1,
      targetId: 1,
    } as GetMatchesPayload);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_MATCHES]
    ).toHaveBeenCalledWith({}, []);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_ERROR]
    ).toHaveBeenCalledWith({}, "Client Error");
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_LOADING]
    ).toHaveBeenNthCalledWith(1, {}, true);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_LOADING]
    ).toHaveBeenLastCalledWith({}, false);
  });
  it("should call server error callback on timeout response", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("timeout");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("matches/" + ActionTypes.getAllMatches, {
      url: "test",
      watchlistId: 1,
      targetId: 1,
    } as GetMatchesPayload);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_MATCHES]
    ).toHaveBeenCalledWith({}, []);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_ERROR]
    ).toHaveBeenCalledWith({}, "Gateway Timeout");
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_LOADING]
    ).toHaveBeenNthCalledWith(1, {}, true);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_LOADING]
    ).toHaveBeenLastCalledWith({}, false);
  });
  it("should call server error callback on server error response", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("serverError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("matches/" + ActionTypes.getAllMatches, {
      url: "test",
      watchlistId: 1,
      targetId: 1,
    } as GetMatchesPayload);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_MATCHES]
    ).toHaveBeenCalledWith({}, []);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_ERROR]
    ).toHaveBeenCalledWith({}, "Server Error");
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_LOADING]
    ).toHaveBeenNthCalledWith(1, {}, true);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_LOADING]
    ).toHaveBeenLastCalledWith({}, false);
  });
  it("should call parse error callback on parse error response", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("parseError");
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    const store = storeCreator.create();
    await store.dispatch("matches/" + ActionTypes.getAllMatches, {
      url: "test",
      watchlistId: 1,
      targetId: 1,
    } as GetMatchesPayload);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_MATCHES]
    ).toHaveBeenCalledWith({}, []);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_ERROR]
    ).toHaveBeenCalledWith({}, "Parse Error");
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_LOADING]
    ).toHaveBeenNthCalledWith(1, {}, true);
    expect(
      modules.modules.matches.mutations[MutationTypes.SET_LOADING]
    ).toHaveBeenLastCalledWith({}, false);
  });
});
