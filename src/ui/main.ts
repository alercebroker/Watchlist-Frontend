import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import router from "./router"
import vuetify from "./plugins/vuetify";
import { cid, container } from "inversify-props";
import { IStoreCreator } from "./store/StoreCreator";
import { containerBuilder } from "./app.container";

Vue.config.productionTip = false;

Vue.use(Vuex);
containerBuilder();
const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
const store = storeCreator.create();

new Vue({
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
