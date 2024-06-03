import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import Vuetify from "vuetify";
import Vue from "vue";
import { IRootState } from "@/ui/store/Store.types";
import { cid, container, resetContainer } from "inversify-props";
import { IStoreCreator, StoreCreator } from "@/ui/store/StoreCreator";
import Overview from "../Overview.vue";
import TargetCard from "../TargetCard.vue";
import "./intersectionObserverMock";
import { Target } from "@/app/target/domain/Target";

jest.mock("htmx.org", () => ({
  ajax: jest.fn(),
  process: jest.fn(),
}));

describe("Overview", () => {
  let wrapper: any;
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(Overview, {
      computed: {
        singleItem: () => ({}),
        singleItemLoading: () => false,
        Objects: () => [],
        currentOid: () => "",
        targets: () => [],
        formattedUTCMatches: () => [],
      },
    });
  });

  it("when singleItem is empty show the respective card", () => {
    expect(wrapper.find("h3").text()).toBe("No target selected");
  });
/** 
  it("when singleItem is not empty show the overview card", async () => {
    await wrapper.setComputed({
      singleItem: () => ({
        target: {
          id: 1,
          url: "",
          name: "test",
          radius: 0,
          rad: 0,
          dec: 0,
          lastMatch: "",
          filter: {},
        },
      }),
    });

    expect(wrapper.find("v-btn").isVisible()).toBe(true);
  });*/
});
