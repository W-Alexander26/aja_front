<template>
  <div class="admin-container">
    <header class="admin-navbar">
      <div class="admin-logo">
        <img src="../../assets/aja_logo.png" alt="Logo AJA" class="logo-img" />
      </div>
      <button class="logout-button" @click="logout">Cerrar sesión</button>
    </header>

    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <nav class="sidebar-nav">
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
const activeComponent = ref("proyectos");

const components = {
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

<!-- Admin.vue (mismo archivo, reemplaza tu <style scoped> completo) -->
<style scoped>
/* 1. CONTEXTO GENERAL */
.admin-container {
  background-color: var(--bg-secondary); /* ⬅️ usa la var global */
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  color: var(--text-primary);
}

/* 2. NAVBAR */
.admin-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  background: rgba(255, 255, 255, 0.85); /* coherente con Home */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 999;
}

.admin-logo .logo-img {
  height: 2rem;
  animation: pulse 3s ease-in-out infinite; /* misma animación del Home */
}

/* Botón de Logout con la paleta brand */
.logout-button {
  background: var(--gradient-primary);
  color: #fff;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
.logout-button:hover {
  background: var(--brand-600);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* 3. LAYOUT */
.admin-layout {
  display: flex;
  min-height: calc(100vh - 4rem); /* altura resto, 4rem ≈ navbar */
}

/* 4. SIDEBAR */
.sidebar {
  width: 15.625rem;
  background: var(--bg-primary);
  padding: 1.25rem 0;
  box-shadow: var(--shadow-md);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Item base */
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-primary);
  border-radius: 0.5rem;
}
.sidebar-icon {
  font-size: 1.125rem;
}

/* Hover / Focus */
.sidebar-item:hover,
.sidebar-item:focus-visible {
  background: var(--brand-50);
  color: var(--brand-600);
}

/* Activo */
.sidebar-item.active {
  background: var(--brand-500);
  color: #fff;
  box-shadow: var(--shadow-sm);
}

/* 5. MAIN CONTENT */
.admin-main {
  flex: 1;
  padding: 2.5rem;
  overflow-y: auto;
}

/* 6. RESPONSIVE */
@media (max-width: 48rem) {
  .admin-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    box-shadow: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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

/* 7. ACCESIBILIDAD / ANIMACIONES */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* High‑contrast focus ring */
.sidebar-item:focus-visible,
.logout-button:focus-visible {
  outline: 2px solid var(--brand-500);
  outline-offset: 2px;
}
</style>
