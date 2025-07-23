import { createRouter, createWebHistory } from "vue-router";

// Import estático
import Login from "@/components/Login/Login.vue";
import Home from "@/components/Home/Home.vue";
import Admin from "@/components/Administrador/Admin.vue";

// const NotFound = () => import("@/views/NotFound.vue");

const routes = [
  //   { path: "/", name: "home", component: Home },
  { path: "/ultrasecretitoescondiditosimeencuentrassosgay", component: Login },
  { path: "/home", component: Home },
  { path: "/admin", component: Admin },
  //   { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
