import { containerBuilder } from "./app.container";
import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { cid, container } from "inversify-props";
import { IStoreCreator } from "./store/StoreCreator";

if (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "staging") {
  Vue.config.devtools = false;
  Vue.config.productionTip = false;
} else {
  Vue.config.devtools = true;
  Vue.config.productionTip = true;
}

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
