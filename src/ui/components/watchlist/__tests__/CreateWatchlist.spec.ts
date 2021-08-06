import { containerBuilder } from "@/ui/app.container";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Vue from "vue";
import Vuetify from "vuetify";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import { IStoreCreator } from "@/ui/store/StoreCreator";
import { IRootState } from "@/ui/store/Store.types";
import { IWatchlistRepository } from "@/app/watchlist/domain";
import { MockWatchlistService } from "@/app/watchlist/infrastructure/__tests__/WatchlistService.mock";
import { TestActions } from "@/shared/http";
import CreateWatchlist from "@/ui/components/watchlist/CreateWatchlist.vue";
import flushPromises from "flush-promises";

describe("CreateWatchlist Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  containerBuilder();
  const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
  let store: Store<IRootState>;

  describe("Without Errors", () => {
    beforeEach(() => {
      resetContainer();
      containerBuilder();
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      mockSingleton<IWatchlistRepository>(
        cid.WatchlistService,
        MockWatchlistService
      );
      vuetify = new Vuetify();
      store = storeCreator.create();
    });

    it("should create watchlist on click", async () => {
      const wrapper = mount(CreateWatchlist, {
        localVue,
        store,
        vuetify,
      });
      await wrapper.setData({
        title: "title",
        selectedFile: new File(
          ["name,radius,ra,dec\nTarget 0,1.0,1.0,1.0"],
          "test.csv",
          { type: "text/csv" }
        ),
      });
      const button = wrapper.find("#send");
      await button.trigger("click");
      await flushPromises();
      await flushPromises();
      expect(wrapper.emitted().created).toBeTruthy();
      const watchlist = store.state.watchlists.watchlists.pop();
      expect(watchlist).not.toBeUndefined();
      if (watchlist) {
        expect(watchlist.title).toEqual("title");
      }
    });

    it("should emit canceled on cancel click", async () => {
      const wrapper = mount(CreateWatchlist, {
        localVue,
        store,
        vuetify,
      });
      const cancel = wrapper.find("#cancel");
      await cancel.trigger("click");
      expect(wrapper.emitted().canceled).toBeTruthy();
    });
  });

  describe("With Errors", () => {
    beforeEach(() => {
      resetContainer();
      containerBuilder();
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      mockSingleton<IWatchlistRepository>(
        cid.WatchlistService,
        MockWatchlistService
      );
      vuetify = new Vuetify();
      store = storeCreator.create();
    });
    it("should show error if creation fails", async () => {
      const wrapper = mount(CreateWatchlist, {
        localVue,
        store,
        vuetify,
      });
      await wrapper.setData({
        title: "title",
        selectedFile: new File(["name,radius,ra,dec\na,b,c,d"], "test.csv", {
          type: "text/csv",
        }),
      });
      const send = wrapper.find("#send");
      await send.trigger("click");
      await flushPromises();
      await flushPromises();
      const alert = wrapper.find(".v-alert");
      expect(alert.text()).toContain("Line: 2");
    });
    it("should show error csv is wrongly created", async () => {
      const wrapper = mount(CreateWatchlist, {
        localVue,
        store,
        vuetify,
      });
      await wrapper.setData({
        title: "title",
        selectedFile: new File(["name,radius,ra,dec\n"], "test.csv", {
          type: "text/csv",
        }),
      });
      const send = wrapper.find("#send");
      await send.trigger("click");
      await flushPromises();
      await flushPromises();
      const alert = wrapper.find(".v-alert");
      expect(alert.text()).toContain("Line: 2");
    });
  });
});
