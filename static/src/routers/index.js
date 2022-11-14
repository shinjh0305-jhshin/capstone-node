import { createRouter, createWebHistory } from "vue-router";
import landingPage from "../components/landingPage.vue";
import login from "../components/loginPrompt.vue";
import product from "../components/product.vue";
import join from "../components/join.vue";
import room from "../components/room.vue";
import { useUserInfoStore } from "/@stores/userInfo";

const routes = [
  {
    path: "/",
    name: "landingPage",
    component: landingPage,
    meta: { authRequired: true },
  },
  {
    path: "/login",
    name: "login",
    component: login,
    meta: { authRequired: false },
  },
  {
    path: "/join",
    name: "join",
    component: join,
    meta: { authRequired: false },
  },
  {
    path: "/product",
    name: "product",
    component: product,
    meta: { authRequired: true },
  },
  {
    path: "/room",
    name: "room",
    component: room,
    meta: { authRequired: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // console.log("to =>", to);
  // console.log("from =>", from);
  const store = useUserInfoStore();
  const isLoggedIn = store.loggedIn;

  if (isLoggedIn && to.meta.authRequired === false) {
    console.log("❗️ NOT allowed");
    next({ name: "home" });
  } else if (isLoggedIn === false && to.meta.authRequired) {
    console.log("❗️ NOT allowed");
    next("login");
  } else {
    next();
  }
});

export default router;
