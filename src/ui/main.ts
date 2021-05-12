import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import { cid, container } from "inversify-props";
import { IStoreCreator } from "./store/StoreCreator";

Vue.config.productionTip = false;

Vue.use(Vuex);
const storeCreator = container.get<IStoreCreator>(cid.StoreCreator);
const store = storeCreator.create();

new Vue({
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
