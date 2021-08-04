import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import Vue from "vue";
import Vuetify from "vuetify";
import ActivateCard from "@/ui/components/users/ActivateCard.vue";

describe("Activate Card Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;

  describe("When props spinner == true and show it", () => {
    it("show spinner", () => {
      const propsData = {
        spinner: true,
        messagge: "",
      };
      const wrapper = mount(ActivateCard, {
        vuetify,
        propsData: propsData,
      });
      expect(wrapper.vm.$props.spinner).toBeTruthy();
      const spinner = wrapper.find("#spinner");
      expect(spinner.exists()).toBeTruthy();
    });
  });
});
