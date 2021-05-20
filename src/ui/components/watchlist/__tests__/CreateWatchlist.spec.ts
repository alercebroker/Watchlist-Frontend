import { containerBuilder } from "@/ui/plugins/inversify";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuex, { createNamespacedHelpers, Store } from "vuex";
import Vue from "vue";
import Vuetify from "vuetify";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import { IStoreCreator } from "@/ui/store/StoreCreator";
import { IRootState } from "@/ui/store/Store.types";
import { IWatchlistRepository } from "@/app/watchlist/domain";
import { MockWatchlistService } from "@/app/watchlist/infrastructure/__tests__/WatchlistService.mock";
import { TestActions } from "@/shared/http";
import CreateWatchlist from "@/ui/components/watchlist/CreateWatchlist.vue"
import flushPromises from "flush-promises";

describe("CreateWatchlist Component", () => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    Vue.use(Vuetify);
    let vuetify: Vuetify;
    containerBuilder();
    const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
    let store: Store<IRootState>;
  
    beforeEach(() => {
      resetContainer();
      containerBuilder();
      mockSingleton<IWatchlistRepository>(cid.WatchlistService, MockWatchlistService);
      vuetify = new Vuetify();
      store = storeCreator.create();
    });
  
    it("should create watchlist on click", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const wrapper = mount(CreateWatchlist, {
        localVue,
        store,
        vuetify,
      });
      await wrapper.setData({
        title: "title",
        csvData: "name,radius,ra,dec\nTarget 0,1.0,1.0,1.0\n",
      });
      const button = wrapper.find("#send");
      button.trigger("click");
      await flushPromises();
      expect(store.state.watchlists.watchlists[-1].title).toEqual("title");
    });
    
  });
  