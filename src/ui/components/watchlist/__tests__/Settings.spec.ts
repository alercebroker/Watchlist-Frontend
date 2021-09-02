import { containerBuilder } from "@/ui/app.container";
import { Modules } from "@/ui/store/RegisterModules";
import { mockActions } from "@/ui/store/singleWatchlist/__tests__/actions.mock";
import { IRootState } from "@/ui/store/Store.types";
import { IStoreCreator } from "@/ui/store/StoreCreator";
import { createLocalVue, mount } from "@vue/test-utils";
import { cid, container, resetContainer } from "inversify-props";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex, { Store } from "vuex";
import Settings from "@/ui/components/watchlist/Settings.vue";
import flushPromises from "flush-promises";

const modules = (): Modules => ({
  modules: {
    singleWatchlist: {
      namespaced: true,
      actions: mockActions(),
      mutations: {},
      state: {
        id: 1,
        title: "watchlist 1",
        notification_rate: "hourly",
      },
      getters: {},
    },
  },
});

describe("Edit Watchlist", () => {
  containerBuilder();
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  let store: Store<IRootState>;
  let localModules: Modules;

  beforeEach(() => {
    resetContainer();
    containerBuilder();
    vuetify = new Vuetify();
    container.unbind("Modules");
    localModules = modules();
    container.bind<Modules>("Modules").toConstantValue(localModules);
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    store = storeCreator.create();
  });
  it("should call editTarget action when update button is clicked", async () => {
    const wrapper = mount(Settings, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    wrapper.setData({
      select: "hourly",
    });
    const editBtn = wrapper.find("#updateButton");
    await editBtn.trigger("click");
    expect(
      localModules.modules.singleWatchlist.actions.editWatchlist
    ).toHaveBeenCalledTimes(1);
  });
});
