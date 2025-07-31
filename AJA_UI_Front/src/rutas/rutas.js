import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/Login/Login.vue";
import Home from "@/components/Home/Home.vue";
import Admin from "@/components/Administrador/Admin.vue";
import Cookies from "js-cookie";
import ProyectosComponent from "@/components/Administrador/components/ProyectosComponent.vue";
import AdminLayout from "../components/Administrador/Admin.vue";
import ProjectsMenu from "../components/Administrador/components/DashboardComponent.vue";
import CrearProyectoForm from "../components/Administrador/components/ProyectosComponent.vue";
import UsuariosComponent from "../components/Administrador/components/UsuariosComponent.vue";

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
    component: AdminLayout, // ⟵ mantiene header + sidebar
    children: [
      {
        path: "", //  /admin
        name: "Dashboard",
        component: ProjectsMenu, // o un dashboard inicial
      },
      {
        path: "proyectos",
        name: "ProyectosList", //  /admin/proyectos
        component: ProjectsMenu,
      },
      {
        path: "proyectos/crear",
        name: "ProyectoCrear", //  /admin/proyectos/crear
        component: CrearProyectoForm,
      },
      {
        path: "usuarios",
        name: "Usuarios",
        component: UsuariosComponent,
      },
    ],
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
