import Vue from "vue";
import VueRouter from "vue-router";
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
  },
  {
    path: "/how-to",
    name: "howto",
    component: Howto,
    exact: true,
  },
  {
    path: "/activate/:id/:token",
    name: "activate",
    component: Activate,
    props: true,
    // props: (route: any) => ({
    //   id: route.query.id ? route.query.id : null,
    //   token: route.query.token ? route.query.token : null,
    // }),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
