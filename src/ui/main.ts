import { containerBuilder } from "./plugins/inversify";
import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import { cid, container, mockSingleton, mockTransient } from "inversify-props";
import { IStoreCreator } from "./store/StoreCreator";
import { IUserRepository } from "@/app/user/domain/User.types";
import { MockAuthService } from "@/app/user/infrastructure/__tests__/AuthService.mock";
import { IAxiosCreator, MockAxiosCreator, TestActions } from "@/shared/http";

Vue.config.productionTip = false;

Vue.use(Vuex);
containerBuilder();
mockTransient<IAxiosCreator>(cid.AxiosCreator, MockAxiosCreator);
mockSingleton<IUserRepository>(cid.AuthService, MockAuthService);
container.bind<TestActions>("ActionType").toConstantValue("ok");
const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
const store = storeCreator.create();

new Vue({
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
