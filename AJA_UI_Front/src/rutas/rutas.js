import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/Login/Login.vue";
import Home from "@/components/Home/Home.vue";
import Admin from "@/components/Administrador/Admin.vue";
import Cookies from "js-cookie";

const routes = [
  { path: "/", redirect: { name: "home" } },

  { path: "/home", name: "home", component: Home },

  {
    path: "/ultrasecretitoescondiditosimeencuentrassosgay",
    name: "login",
    component: Login,
  },

  {
    path: "/admin",
    name: "admin",
    component: Admin,
    meta: { requiresAuth: true },
  },

  /* Catch‑all */
  { path: "/:pathMatch(.*)*", redirect: { name: "home" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* ---- Guard global ---- */
router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");
  if (to.meta.requiresAuth && !token) {
    next({ name: "home", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
