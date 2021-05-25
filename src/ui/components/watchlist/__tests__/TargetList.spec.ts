import { containerBuilder } from "@/ui/plugins/inversify";
import { ITargetRepository } from "@/app/target/domain/Target.types";
import { MockTargetService } from "@/app/target/infrastructure/__tests__/TargetService.mock";
import { TestActions } from "@/shared/http";
import { IStoreCreator } from "@/ui/store/StoreCreator";
import { createLocalVue, mount } from "@vue/test-utils";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import TargetList from "@/ui/components/watchlist/TargetList.vue";
import flushPromises from "flush-promises";

describe("List Targets", () => {
  containerBuilder();
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
  const store = storeCreator.create();

  beforeEach(() => {
    resetContainer();
    containerBuilder();
    mockSingleton<ITargetRepository>(cid.TargetService, MockTargetService);
    vuetify = new Vuetify();
  });

  it("should mount and fetch target list", async () => {
    container.bind<TestActions>("ActionType").toConstantValue("ok");
    const wrapper = mount(TargetList, {
      localVue,
      store,
      vuetify,
    });
    await flushPromises();
    const expected = [
      {
        name: "target",
      },
    ];
    const wrappers = wrapper.findAll(".v-list-item__title").wrappers;
    wrappers.forEach((item, index) => {
      expect(item.text()).toEqual(expected[index].name);
    });
  });
});
