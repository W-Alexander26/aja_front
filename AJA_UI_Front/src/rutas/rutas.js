import { createRouter, createWebHistory } from "vue-router";

// Import estático
import Login from "@/components/Login/Login.vue";
import Home from "@/components/Home/Home.vue";
import Admin from "@/components/Administrador/Admin.vue";
import Cookies from "js-cookie";

// const NotFound = () => import("@/views/NotFound.vue");

const routes = [
  //   { path: "/", name: "home", component: Home },
  {
    path: "/ultrasecretitoescondiditosimeencuentrassosgay",
    name: "login",
    component: Login,
  },
  { path: "/home", component: Home, name: "home" },
  {
    path: "/admin",
    name: "admin",
    component: Admin,
    meta: { requiresAuth: true },
  },
  //   { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
// ---- Guard global ----
router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");

  if (to.meta.requiresAuth && !token) {
    next({
      name: "home",
      query: { redirect: to.fullPath }, // para volver después de loguearse
    });
  } else {
    next();
  }
});

export default router;
