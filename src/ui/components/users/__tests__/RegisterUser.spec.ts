import { containerBuilder } from "@/ui/app.container";
import { IUserRepository } from "@/app/user/domain/User.types";
import { MockAuthService } from "@/app/user/infrastructure/__tests__/AuthService.mock";
import { IStoreCreator } from "@/ui/store/StoreCreator";
import { createLocalVue, mount } from "@vue/test-utils";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex, { Store } from "vuex";
import { IHttpService, MockUserApi, TestActions } from "@/shared/http";
import RegisterUser from "@/ui/components/users/RegisterUser.vue";
import flushPromises from "flush-promises";
import { IRootState } from "@/ui/store/Store.types";

describe("RegisterUser Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  containerBuilder();
  const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
  let store: Store<IRootState>;

  describe("Without Network Errors", () => {
    beforeEach(() => {
      resetContainer();
      containerBuilder();
      mockSingleton<IUserRepository>(cid.AuthService, MockAuthService);
      vuetify = new Vuetify();
      store = storeCreator.create();
    });

    it("should create user on click", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const wrapper = mount(RegisterUser, {
        localVue,
        store,
        vuetify,
      });
      await wrapper.setData({
        username: "test",
        name: "test",
        email: "test",
        lastName: "test",
        password: "test",
        institution: "test",
        role: "test",
        roles: ["test"],
      });
      const button = wrapper.find("#send");
      button.trigger("click");
      await flushPromises();
      expect(store.state.users.userData).toStrictEqual({
        username: "username",
        name: "name",
        email: "email",
        lastName: "last name",
        password: null,
        accessToken: null,
        refreshToken: null,
        institution: "institution",
        role: "role",
      });
    });
  });
  describe("With Network Errors", () => {
    beforeEach(() => {
      resetContainer();
      containerBuilder();
      mockSingleton<IHttpService>(cid.UsersApiService, MockUserApi);
      vuetify = new Vuetify();
      store = storeCreator.create();
    });

    it("should show error for each field if detail provided", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      const wrapper = mount(RegisterUser, {
        localVue,
        store,
        vuetify,
      });
      const button = wrapper.find("#send");
      button.trigger("click");
      await flushPromises();
      const messages = wrapper.findAll(".v-messages__message");
      messages.wrappers.forEach((message) => {
        expect(message.text()).toBe("This field may not be blank.");
      });
    });
    it("should show alert if error is not in detail", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("serverError");
      const wrapper = mount(RegisterUser, {
        localVue,
        store,
        vuetify,
      });
      const button = wrapper.find("#send");
      button.trigger("click");
      await flushPromises();
      expect(
        wrapper.find(".v-alert").text().toString().replace(/\s+/g, "")
      ).toBe(
        (
          "We found an error: " +
          store.getters["users/genericError"] +
          ". Please contact the ALeRCE Team"
        ).replace(/\s+/g, "")
      );
    });
  });
});
