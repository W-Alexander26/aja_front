<template>
  <div class="container">
    <!-- CONTROLES -->
    <div class="controls">
      <!-- Buscador -->
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          class="search-input"
          placeholder="Buscar proyectos…"
          v-model="searchTerm"
          @input="filterProjects"
        />
      </div>

      <!-- Filtro de estado -->
      <select
        class="filter-select"
        v-model="statusFilter"
        @change="filterProjects"
      >
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
        <option value="all">Todos</option>
      </select>

      <!-- Crear -->
      <button class="btn btn-primary" @click="goToCreate">
        <span class="btn-icon">+</span>
        <span>Crear Proyecto</span>
      </button>
    </div>

    <!-- ESTADOS -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando proyectos…</p>
    </div>

    <div v-else-if="filteredProjects.length === 0" class="empty-state">
      <div class="empty-icon">📁</div>
      <h3>No hay proyectos</h3>
      <p>Comienza creando tu primer proyecto</p>
    </div>

    <!-- GRID -->
    <div v-else class="users-grid">
      <div
        v-for="proj in filteredProjects"
        :key="proj.id"
        class="user-card"
        @click="openEditModal(proj)"
      >
        <div class="user-avatar">{{ getInitials(proj.nombre || "P") }}</div>

        <div class="user-info">
          <div class="user-name">{{ proj.nombre || "Sin nombre" }}</div>
          <div class="user-email">
            <!-- Muestra responsable o categoría para aportar contexto -->
            {{ proj.responsable || proj.categoria || "—" }}
          </div>
        </div>

        <span
          class="user-status"
          :class="`status-${proj.estado ? 'active' : 'inactive'}`"
        >
          {{ proj.estado ? "Activo" : "Inactivo" }}
        </span>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ editingProject ? "Editar Proyecto" : "Crear Nuevo Proyecto" }}
          </h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="editingProject ? updateProject() : goToCreate()">
          <!-- Nombre -->
          <div class="form-group">
            <label class="form-label">Nombre del Proyecto</label>
            <input
              type="text"
              class="form-input"
              v-model="formData.nombre"
              required
              placeholder="Ej.: Mi Sitio Web"
            />
          </div>

          <!-- Descripción -->
          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea
              class="form-input"
              rows="3"
              v-model="formData.descripcion"
              required
              placeholder="Describe brevemente tu proyecto…"
            ></textarea>
          </div>

          <!-- Responsable & Categoría -->
          <div class="form-group">
            <label class="form-label">Responsable</label>
            <input
              type="text"
              class="form-input"
              v-model="formData.responsable"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Categoría</label>
            <select class="form-input" v-model="formData.categoria" required>
              <option value="">Selecciona una categoría</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Portfolio">Portfolio</option>
              <option value="Aplicación Web">Aplicación Web</option>
              <option value="Landing Page">Landing Page</option>
              <option value="Blog">Blog</option>
              <option value="Dashboard">Dashboard</option>
            </select>
          </div>

          <!-- Link & Ubicación -->
          <div class="form-group">
            <label class="form-label">Enlace</label>
            <input
              type="url"
              class="form-input"
              v-model="formData.link"
              placeholder="https://…"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Ubicación</label>
            <input
              type="text"
              class="form-input"
              v-model="formData.ubicacion"
            />
          </div>

          <!-- Estado (solo al editar) -->
          <div v-if="editingProject" class="form-group">
            <label class="form-label">Estado</label>
            <select class="form-input" v-model="formData.estado">
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </div>

          <!-- Acciones -->
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              {{
                creating
                  ? editingProject
                    ? "Actualizando…"
                    : "Creando…"
                  : editingProject
                  ? "Actualizar Proyecto"
                  : "Crear Proyecto"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import Cookies from "js-cookie";
import { obtener, crear, actualizar } from "@/components/Services/service";
import { useRouter } from "vue-router";

export default {
  name: "ProjectsMenu",
  setup() {
    const API = import.meta.env.VITE_API_AUTH;
    const token = Cookies.get("token") || null;

    // state
    const allProjects = ref([]);
    const filteredProjects = ref([]);
    const loading = ref(false);
    const creating = ref(false);
    const showModal = ref(false);
    const router = useRouter();
    const searchTerm = ref("");
    const statusFilter = ref("active");
    const editingProject = ref(null);

    const formData = reactive({
      id: null,
      nombre: "",
      descripcion: "",
      responsable: "",
      categoria: "",
      link: "",
      ubicacion: "",
      estado: true,
    });

    /* ---------- helpers ---------- */
    const getInitials = (str) =>
      str
        .split(" ")
        .map((w) => w.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

    /* ---------- modal ---------- */
    const openCreateModal = () => {
      Object.assign(formData, {
        id: null,
        nombre: "",
        descripcion: "",
        responsable: "",
        categoria: "",
        link: "",
        ubicacion: "",
        estado: true,
      });
      editingProject.value = null;
      showModal.value = true;
    };

    const openEditModal = (proj) => {
      Object.assign(formData, { ...proj });
      editingProject.value = proj;
      showModal.value = true;
    };

    const closeModal = () => (showModal.value = false);

    /* ---------- CRUD ---------- */
    const loadProjects = async () => {
      try {
        loading.value = true;
        const res = await obtener(API, "api/proyectos", "data", token);
        allProjects.value = Array.isArray(res) ? res : res.proyectos || [];
        filterProjects();
      } catch (e) {
        console.error("Error loading projects:", e);
      } finally {
        loading.value = false;
      }
    };

    function goToCreate() {
      router.push({ name: "ProyectoCrear" });
    }

    const updateProject = async () => {
      creating.value = true;
      try {
        const payload = { ...formData };
        const res = await actualizar(
          API,
          "api/proyectos/update",
          payload,
          token
        );
        const updated = res.proyecto || res || payload;

        const idx = allProjects.value.findIndex((p) => p.id === payload.id);
        if (idx !== -1)
          allProjects.value[idx] = { ...allProjects.value[idx], ...updated };

        filterProjects();
        closeModal();
      } catch (e) {
        console.error("Error actualizando proyecto:", e);
      } finally {
        creating.value = false;
      }
    };

    /* ---------- filter ---------- */
    const filterProjects = () => {
      const s = searchTerm.value.toLowerCase().trim();
      let list = [...allProjects.value];

      if (statusFilter.value !== "all") {
        list = list.filter(
          (p) => (p.estado ? "active" : "inactive") === statusFilter.value
        );
      }
      if (s) {
        list = list.filter(
          (p) =>
            (p.nombre || "").toLowerCase().includes(s) ||
            (p.responsable || "").toLowerCase().includes(s) ||
            (p.categoria || "").toLowerCase().includes(s)
        );
      }
      filteredProjects.value = list;
    };

    onMounted(loadProjects);

    return {
      /* state */
      filteredProjects,
      loading,
      creating,
      showModal,
      searchTerm,
      statusFilter,
      editingProject,
      formData,
      /* methods */
      getInitials,
      openCreateModal,
      openEditModal,
      closeModal,
      goToCreate,
      updateProject,
      filterProjects,
    };
  },
};
</script>

<!--
  Reutilizamos por completo el CSS del UsersMenu.
  Si ambos componentes conviven, simplemente importa el mismo
  archivo de estilos globales o copia la sección *.container*…*media*
  para evitar duplicidad. 
-->
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 100rem; /* 1200px */
  margin: 0 auto;
  min-height: 100%;
  padding: 2rem;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 25rem; /* 400px */
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: none;
  border-radius: 0.5rem; /* 8px */
  font-size: 0.875rem;
  background: #f5f5f5;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  background: #ebebeb;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  opacity: 0.5;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
}

.btn-icon {
  font-size: 1.25rem;
  font-weight: 300;
  line-height: 1;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #333;
  transform: translateY(-0.0625rem); /* 1px */
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #ebebeb;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr)); /* 320px */
  gap: 1rem;
}

.user-card {
  background: #fafafa;
  border-radius: 0.75rem; /* 12px */
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.user-card:hover {
  background: #f5f5f5;
  transform: translateY(-0.125rem); /* 2px */
}

.user-avatar {
  width: 3rem; /* 48px */
  height: 3rem;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 1rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 500;
  color: #000;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.875rem;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  white-space: nowrap;
}

.status-active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-inactive {
  background: #fafafa;
  color: #999;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(0.25rem); /* 4px */
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  width: 100%;
  max-width: 30rem; /* 480px */
  background: white;
  border-radius: 1rem; /* 16px */
  padding: 2rem;
  box-shadow: 0 1.25rem 2.5rem rgba(0, 0, 0, 0.1); /* 20px 40px */
  animation: modalFadeIn 0.2s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
}

.close-btn {
  width: 2rem; /* 32px */
  height: 2rem;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #ebebeb;
  color: #666;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: #f5f5f5;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  background: #ebebeb;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.loading {
  text-align: center;
  padding: 4rem;
  color: #999;
}

.spinner {
  width: 2rem; /* 32px */
  height: 2rem;
  border: 0.125rem solid #f5f5f5; /* 2px */
  border-top: 0.125rem solid #333;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.empty-state p {
  font-size: 0.875rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: #f5f5f5;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:hover {
  background: #ebebeb;
}

@media (max-width: 48rem) {
  /* 768px */
  .container {
    padding: 1rem;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .search-box {
    max-width: none;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }

  .modal {
    padding: 1rem;
  }

  .modal-content {
    padding: 1.5rem;
  }
}
</style>
