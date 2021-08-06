import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import Home from "./pages/Home.vue";
import Howto from "./components/watchlist/HowTo.vue";
import Activate from "./pages/Activate.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    exact: true,
    meta: {
      title: process.env.VUE_APP_APP_TITLE,
    },
  },
  {
    path: "/how-to",
    name: "howto",
    component: Howto,
    exact: true,
    meta: {
      title: process.env.VUE_APP_APP_TITLE + " - How-To",
    },
  },
  {
    path: "/activate/:uid/:token",
    name: "activate",
    component: Activate,
    props: true,
    meta: {
      title: process.env.VUE_APP_APP_TITLE + " - Activate Account",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to: Route, _from: Route, next) => {
  if (to.meta) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
