import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import Home from "./pages/Home.vue";
import Howto from "./components/watchlist/HowTo.vue";
import Activate from "./pages/Activate.vue";
import Login from "./pages/Login.vue";
import GoogleOAuth2 from "./pages/GoogleOAuth2.vue";
Vue.use(VueRouter);

export const routes = [
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
  {
    path: "/login",
    name: "login",
    component: Login,
    exact: true,
    meta: {
      title: process.env.VUE_APP_APP_TITLE + " - Login",
    },
  },
  {
    path: "/oauth",
    name: "oauth",
    component: GoogleOAuth2,
    exact: true,
    metea: {
      title: process.env.VUE_APP_APP_TITLE + " - OAuth",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

const isLogged = (): boolean => {
  return localStorage.getItem("access_token") != null;
};

router.beforeEach((to: Route, _from: Route, next) => {
  if (to.meta) {
    document.title = to.meta.title;
  }
  if (
    to.name !== "login" &&
    to.name !== "activate" &&
    to.name !== "oauth" &&
    !isLogged()
  )
    next("/login");
  else next();
});

export default router;
