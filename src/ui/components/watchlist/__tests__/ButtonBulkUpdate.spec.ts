import { containerBuilder } from "@/ui/app.container";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import { IStoreCreator } from "@/ui/store/StoreCreator";
import { IRootState } from "@/ui/store/Store.types";
import { ITargetRepository } from "@/app/target/domain/Target.types";
import { MockTargetService } from "@/app/target/infrastructure/__tests__/TargetService.mock";
import { TestActions } from "@/shared/http";

import ButtonBulkUpdate from "@/ui/components/watchlist/ButtonBulkUpdate.vue";
import flushPromises from "flush-promises";
import Vuex, { Store } from "vuex";
import Vue from "vue";
import Vuetify from "vuetify";

describe("ButtonBulkUpdate Component", () => {
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
      mockSingleton<ITargetRepository>(cid.TargetService, MockTargetService);
      vuetify = new Vuetify();
      store = storeCreator.create();
    });
    it("should dialog be close", async () => {
      const wrapper = mount(ButtonBulkUpdate, {
        localVue,
        store,
        vuetify,
      });
      await wrapper.setData({
        dialog: false,
      });
      const card = wrapper.find("#uploadCard");
      expect(card.exists()).toBeFalsy();
    });
    it("should dialog be open", async () => {
      const wrapper = mount(ButtonBulkUpdate, {
        localVue,
        store,
        vuetify,
      });
      await wrapper.setData({
        dialog: true,
      });
      const card = wrapper.find("#uploadCard");
      expect(card.exists()).toBeTruthy();
    });
    it("should dialog be open", async () => {
      const wrapper = mount(ButtonBulkUpdate, {
        localVue,
        store,
        vuetify,
      });
      await wrapper.setData({
        dialog: true,
      });
      const card = wrapper.find("#uploadCard");
      expect(card.exists()).toBeTruthy();
      const cancelButton = wrapper.find("#cancel");
      await cancelButton.trigger("click");
      expect(wrapper.attributes()["dialog"]).toBeFalsy();
    });
    it("update a target", async () => {
      const wrapper = shallowMount(ButtonBulkUpdate, {
        localVue,
        store,
        vuetify,
      });
      await wrapper.setData({
        selectedFile: new File(
          ["id,name,radius,ra,dec\n1,Target 0,1.0,1.0,1.0"],
          "test.csv",
          { type: "text/csv" }
        ),
        dialog: true,
      });
      const button = wrapper.find("#upload");
      await button.trigger("click");
      await flushPromises();
      await flushPromises();
      expect(wrapper.attributes()["dialog"]).toBeFalsy();
    });
  });
});
