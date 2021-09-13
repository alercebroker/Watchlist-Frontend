import { containerBuilder } from "@/ui/app.container";
import { IUserRepository } from "@/app/user/domain/User.types";
import { MockAuthService } from "@/app/user/infrastructure/__tests__/AuthService.mock";
import { IRootState } from "@/ui/store/Store.types";
import { IStoreCreator } from "@/ui/store/StoreCreator";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { cid, container, mockSingleton, resetContainer } from "inversify-props";
import Vue from "vue";
import Vuetify from "vuetify";
import Vuex, { Store } from "vuex";
import Login from "@/ui/components/users/Login.vue";
import { IHttpService, MockUserApi, TestActions } from "@/shared/http";
import flushPromises from "flush-promises";
import VueRouter from "vue-router";
import { routes } from "@/ui/router";

describe("Login Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(VueRouter);
  Vue.use(Vuetify);
  let vuetify: Vuetify;
  containerBuilder();
  const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
  let store: Store<IRootState>;
  let router: VueRouter;
  const $route = {
    path: "/login",
  };
  describe("Without Error", () => {
    beforeEach(() => {
      resetContainer();
      containerBuilder();
      mockSingleton<IUserRepository>(cid.AuthService, MockAuthService);
      vuetify = new Vuetify();
      store = storeCreator.create();
      localStorage.clear();
      router = new VueRouter({ routes });
      router.push("/login");
    });

    it("should save user in store and save token on login click", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const wrapper = mount(Login, {
        localVue,
        store,
        vuetify,
        router,
      });
      await wrapper.setData({ username: "test", password: "test" });
      const button = wrapper.find("#login");
      button.trigger("click");
      await flushPromises();
      await wrapper.vm.$nextTick();
      // check store for user data
      expect(store.state.users.userData.username).toEqual("username");
      // check localStorage for token
      expect(localStorage.getItem("access_token")).toEqual("token");
    });
    it("should not create user if data is empty", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("ok");
      const wrapper = mount(Login, {
        localVue,
        store,
        vuetify,
        router,
      });
      await wrapper.setData({
        username: "",
      });
      const button = wrapper.find("#login");
      button.trigger("click");
      expect(store.state.users.userData).toStrictEqual({});
      expect(localStorage.getItem("token")).toBeNull();
    });
    it("should emit register event", () => {
      const wrapper = mount(Login, {
        localVue,
        store,
        vuetify,
        router,
      });
      const button = wrapper.find("#register");
      button.trigger("click");
      expect(wrapper.emitted().registerClick).toBeTruthy();
    });
  });

  describe("With Error", () => {
    beforeEach(() => {
      resetContainer();
      containerBuilder();
      mockSingleton<IHttpService>(cid.UsersApiService, MockUserApi);
      vuetify = new Vuetify();
      store = storeCreator.create();
      localStorage.clear();
    });

    it("should show error in form if error is in detail", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("clientError");
      const wrapper = mount(Login, {
        localVue,
        store,
        vuetify,
        router,
      });
      await wrapper.setData({ username: "test", password: "test" });
      const button = wrapper.find("#login");
      button.trigger("click");
      await flushPromises();
      const messages = wrapper.findAll(".v-messages__message");
      messages.wrappers.forEach((message: Wrapper<Vue>) => {
        expect(message.text()).toBe(store.getters["users/detailError"].detail);
      });
    });
    it("should show error in alert if error is not in detail", async () => {
      container.bind<TestActions>("ActionType").toConstantValue("serverError");
      const wrapper = mount(Login, {
        localVue,
        store,
        vuetify,
        router,
      });
      await wrapper.setData({ username: "test", password: "test" });
      const button = wrapper.find("#login");
      button.trigger("click");
      await flushPromises();
      const message = wrapper.find(".v-alert").text();
      const trimmed = message.replace(/\s+/g, "");
      expect(trimmed).toContain(
        (
          "We found an error: " +
          store.getters["users/genericError"] +
          ". Please contact the ALeRCE Team"
        ).replace(/\s+/g, "")
      );
    });
  });
});
