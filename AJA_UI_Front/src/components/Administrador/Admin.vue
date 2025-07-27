<template>
  <div class="admin-container">
    <header class="admin-navbar">
      <div class="admin-logo">
        <img
          src="../../assets/Captura de pantalla 2025-07-20 194316.png"
          alt="Logo AJA"
          class="logo-img"
        />
      </div>
      <button class="logout-button" @click="logout">Cerrar sesión</button>
    </header>

    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <nav class="sidebar-nav">
          <button
            class="sidebar-item"
            :class="{ active: activeComponent === 'dashboard' }"
            @click="setActiveComponent('dashboard')"
          >
            <span class="sidebar-icon">🏠</span>
            Dashboard
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeComponent === 'proyectos' }"
            @click="setActiveComponent('proyectos')"
          >
            <span class="sidebar-icon">📁</span>
            Proyectos
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeComponent === 'usuarios' }"
            @click="setActiveComponent('usuarios')"
          >
            <span class="sidebar-icon">👥</span>
            Usuarios
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeComponent === 'otros' }"
            @click="setActiveComponent('otros')"
          >
            <span class="sidebar-icon">⚙️</span>
            Otros
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <component :is="currentComponent" @navigate="setActiveComponent" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import DashboardComponent from "./components/DashboardComponent.vue";
import ProyectosComponent from "./components/ProyectosComponent.vue";
import UsuariosComponent from "./components/UsuariosComponent.vue";
import OtrosComponent from "./components/OtrosComponent.vue";

const router = useRouter();
const activeComponent = ref("dashboard");

const components = {
  dashboard: DashboardComponent,
  proyectos: ProyectosComponent,
  usuarios: UsuariosComponent,
  otros: OtrosComponent,
};

const currentComponent = computed(() => {
  return components[activeComponent.value];
});

function setActiveComponent(component) {
  activeComponent.value = component;
}

function logout() {
  Swal.fire(
    "Sesión cerrada",
    "Has salido del panel de administración",
    "success"
  );
  Cookies.remove("token");
  router.push("/home");
}
</script>

<style scoped>
.admin-container {
  background-color: #f6f9fc;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

/* Navbar */
.admin-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 999;
}

.admin-logo .logo-img {
  height: 2rem;
}

.logout-button {
  background-color: #ef4444;
  color: white;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #dc2626;
}

/* Layout */
.admin-layout {
  display: flex;
  min-height: calc(100vh - 4rem);
}

/* Sidebar */
.sidebar {
  width: 15.625rem;
  background-color: #f6f9fc;
  padding: 1.25rem 0;
  box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.1);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  color: #141313;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
}

.sidebar-item:hover {
  background-color: #3b82f6;
  color: black;
}

.sidebar-item.active {
  background-color: #3b82f6;
  color: white;
}

.sidebar-icon {
  font-size: 1.125rem;
}

/* Main Content */
.admin-main {
  flex: 1;
  padding: 2.5rem;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 48rem) {
  .admin-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 1.25rem;
  }

  .sidebar-item {
    white-space: nowrap;
  }

  .admin-main {
    padding: 1.25rem;
  }

  .admin-navbar {
    padding: 1rem 1.25rem;
  }
}
</style>
