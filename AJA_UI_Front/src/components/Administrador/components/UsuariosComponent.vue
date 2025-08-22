<template>
  <div class="container">
    <div class="controls">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" class="search-input" placeholder="Buscar usuarios..." v-model="searchTerm"
          @input="filterUsers" />
      </div>

      <select class="filter-select" v-model="statusFilter" @change="filterUsers">
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
        <option value="all">Todos</option>
      </select>

      <button class="btn btn-primary" @click="openCreateModal">
        <span class="btn-icon">+</span>
        <span>Crear Usuario</span>
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando usuarios...</p>
    </div>

    <div v-else-if="filteredUsers.length === 0" class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>No hay usuarios</h3>
      <p>Comienza creando tu primer usuario</p>
    </div>

    <div v-else class="users-grid">
      <!-- <div v-for="user in filteredUsers" :key="user.id" class="user-card" @click="openEditModal(user)">
        <div class="user-avatar">
          {{ getInitials(user.username || user.name || "U") }}
        </div>
        <div class="user-info">
          <div class="user-name">
            {{ user.username || user.name || "Sin nombre" }}
          </div>
          <div class="user-email">{{ user.email || "Sin email" }}</div>
        </div>
        <span class="user-status" :class="`status-${user.activos ? 'active' : 'inactive'}`">
          {{ user.activos ? "Activo" : "Inactivo" }}
        </span>
      </div> -->
      <draggable v-model="filteredUsers" item-key="id" class="users-grid" @end="onDragEnd">
        <template #item="{ element }">
          <div class="user-card" @click="openEditModal(element)">
            <div class="user-avatar">
              {{ getInitials(element.username || element.name || "U") }}
            </div>
            <div class="user-info">
              <div class="user-name">
                {{ element.username || element.name || "Sin nombre" }}
              </div>
              <div class="user-email">{{ element.email || "Sin email" }}</div>
            </div>
            <span class="user-status" :class="`status-${element.activos ? 'active' : 'inactive'}`">
              {{ element.activos ? "Activo" : "Inactivo" }}
            </span>
          </div>
        </template>
      </draggable>

    </div>

    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ editingUser ? "Editar Usuario" : "Crear Nuevo Usuario" }}
          </h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="editingUser ? updateUser() : createUser()">
          <div class="form-group">
            <label class="form-label" for="username">Nombre de Usuario</label>
            <input type="text" class="form-input" id="username" v-model="formData.username" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Correo Electrónico</label>
            <input type="email" class="form-input" id="email" v-model="formData.email" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Contraseña</label>
            <input type="password" class="form-input" id="password" v-model="formData.password"
              :required="!editingUser" />
          </div>

          <!-- dentro del <form> de tu modal -->
          <div class="form-group">
            <label class="form-label" for="displayOrder">Orden de Display</label>
            <input type="number" class="form-input" id="displayOrder" v-model.number="formData.displayOrder" />
          </div>

          <div class="form-group">
            <label class="form-label" for="skills">Skills (separadas por coma)</label>
            <input type="text" class="form-input" id="skills" v-model="formData.skillsInput"
              placeholder="Ej: aws,react,nest" />
          </div>

          <div class="form-group">
            <label class="form-label" for="mostrar">Mostrar en listado</label>
            <select class="form-input" id="mostrar" v-model="formData.mostrar">
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="siglas">Siglas</label>
            <input type="text" maxlength="4" class="form-input" id="siglas" v-model="formData.siglas" />
          </div>

          <div class="form-group">
            <label class="form-label" for="puestos">Puestos</label>
            <input type="text" maxlength="60" class="form-input" id="puestos" v-model="formData.puestos" />
          </div>

          <div class="form-group">
            <label class="form-label" for="img">Imagen (URL)</label>
            <input type="text" maxlength="200" class="form-input" id="img" v-model="formData.img"
              placeholder="https://example.com/foto.png" />
          </div>

          <div class="form-group" v-if="editingUser">
            <label class="form-label" for="estado">Estado</label>
            <select class="form-input" id="estado" v-model="formData.activos">
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              {{
                creating
                  ? editingUser
                    ? "Actualizando..."
                    : "Creando..."
                  : editingUser
                    ? "Actualizar Usuario"
                    : "Crear Usuario"
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
import { actualizar, crear, obtener } from "@/components/Services/service";
import draggable from "vuedraggable";

export default {
  name: "UsersMenu",
  components: { draggable },
  setup() {
    const onDragEnd = async (evt) => {
      // recalcula en memoria
      filteredUsers.value.forEach((u, index) => {
        u.displayOrder = index + 1; // orden 1-based
      });

      const movedUser = filteredUsers.value[evt.newIndex];

      try {
        
        await actualizar(
          API_BASE_URL,
          "api/users/update",
          { id: movedUser.id, displayOrder: movedUser.displayOrder },
          token
        );
      } catch (err) {
        console.error("Error reordenando:", err);
        await refreshUsers();
      }
    };


    const API_BASE_URL = import.meta.env.VITE_API_AUTH;
    const token = Cookies.get("token") || null;

    const allUsers = ref([]);
    const filteredUsers = ref([]);
    const loading = ref(false);
    const creating = ref(false);
    const showModal = ref(false);
    const searchTerm = ref("");
    const statusFilter = ref("active");

    const editingUser = ref(null);

    const formData = reactive({
      id: null,
      username: "",
      email: "",
      password: "",
      activos: "",
      displayOrder: "null",
      skills: [],
      skillsInput: "",
      mostrar: "",
      siglas: "",
      puestos: "",
      img: ""
    });

    const openCreateModal = () => {
      editingUser.value = null;
      formData.id = null;
      formData.username = "";
      formData.email = "";
      formData.password = "";
      formData.activos = true;
      formData.displayOrder = null;
      formData.skillsInput = "";
      formData.mostrar = true;
      formData.siglas = "";
      formData.puestos = "";
      formData.img = "";

      showModal.value = true;
    };

    const openEditModal = (user) => {
      editingUser.value = user;
      formData.id = user.id;
      formData.username = user.username;
      formData.email = user.email;
      formData.password = "";
      formData.activos = user.activos;
      formData.displayOrder = user.displayOrder || null;
      formData.skillsInput = user.skills
        ? user.skills.join(", ")
        : "";
      formData.mostrar = user.mostrar !== undefined ? user.mostrar : true;
      formData.siglas = user.siglas || "";
      formData.puestos = user.puestos || "";
      formData.img = user.img || "";
      showModal.value = true;
    };

    const closeModal = () => (showModal.value = false);

    const updateUser = async () => {
      try {
        creating.value = true;
        const payload = {
          id: formData.id,
          username: formData.username,
          email: formData.email,
          activos: formData.activos,
          displayOrder: formData.displayOrder,
          skills: formData.skillsInput
            ? formData.skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          mostrar: formData.mostrar,
          siglas: formData.siglas,
          puestos: formData.puestos,
          img: formData.img,
        };
        if (formData.skillsInput) {
          payload.skills = formData.skillsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        if (formData.password) payload.password = formData.password;


        const response = await actualizar(
          API_BASE_URL,
          `api/users/update`,
          payload,
          token
        );
        await refreshUsers();

        let updatedUser = response.user || response || payload;

        if (updatedUser.activos === undefined) {
          updatedUser.activos = formData.activos;
        }

        const idx = allUsers.value.findIndex((u) => u.id === formData.id);
        if (idx !== -1) {
          allUsers.value[idx] = {
            ...allUsers.value[idx],
            ...updatedUser,
          };
        }

        filterUsers();
        closeModal();
      } catch (err) {
        console.error("Error actualizando:", err);
      } finally {
        creating.value = false;
      }
    };

    const loadUsers = async () => {
      try {
        loading.value = true;
        if (!token) return console.error("Token no encontrado");

        const response = await obtener(API_BASE_URL, "api/users", "data", token);


        allUsers.value = Array.isArray(response)
          ? response
          : response.users || [];

        filterUsers();
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        loading.value = false;
      }
    };

    const refreshUsers = async () => {
      await loadUsers();
    };

    const filterUsers = () => {
      const search = searchTerm.value.toLowerCase().trim();
      let list = [...allUsers.value];
      if (statusFilter.value !== "all") {
        list = list.filter((u) => {
          const estado = u.activos === true ? "active" : "inactive";
          return estado === statusFilter.value;
        });
      }
      if (search) {
        list = list.filter(
          (u) =>
            (u.username || u.name || "").toLowerCase().includes(search) ||
            (u.email || "").toLowerCase().includes(search)
        );
      }

      filteredUsers.value = list;
    };

    const getInitials = (name) =>
      name
        .split(" ")
        .map((w) => w.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

    const getStatusText = (status) => {
      const map = {
        active: "Activo",
        inactive: "Inactivo",
        pending: "Pendiente",
      };
      return map[status] || "Activo";
    };

    const createUser = async () => {
      try {
        creating.value = true;

        if (!token) {
          return;
        }

        if (formData.skillsInput) {
          payload.skills = formData.skillsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        const newUserData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

        const createdUser = await crear(
          API_BASE_URL,
          "api/users",
          newUserData,
          token
        );
        await refreshUsers();

        const userToAdd = createdUser.user ? createdUser.user : createdUser;
        if (userToAdd.activos === undefined) {
          userToAdd.activos = true;
        }

        allUsers.value.unshift(userToAdd);
        filterUsers();

        closeModal();
      } catch (err) {
        console.error("Error creando usuario:", err);
      } finally {
        creating.value = false;
      }
    };

    onMounted(() => loadUsers());

    return {
      allUsers,
      filteredUsers,
      loading,
      creating,
      showModal,
      searchTerm,
      statusFilter,
      formData,
      editingUser,
      filterUsers,
      getInitials,
      getStatusText,
      openCreateModal,
      openEditModal,
      closeModal,
      createUser,
      updateUser,
      onDragEnd,
      draggable
    };
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 100rem;
  /* 1200px */
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
  max-width: 25rem;
  /* 400px */
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: none;
  border-radius: 0.5rem;
  /* 8px */
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
  transform: translateY(-0.0625rem);
  /* 1px */
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
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  /* 320px */
  gap: 1rem;
}

.user-card {
  background: #fafafa;
  border-radius: 0.75rem;
  /* 12px */
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.user-card:hover {
  background: #f5f5f5;
  transform: translateY(-0.125rem);
  /* 2px */
}

.user-avatar {
  width: 3rem;
  /* 48px */
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
  backdrop-filter: blur(0.25rem);
  /* 4px */
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  width: 100%;
  max-width: 30rem;
  /* 480px */
  background: white;
  border-radius: 1rem;
  /* 16px */
  padding: 2rem;
  box-shadow: 0 1.25rem 2.5rem rgba(0, 0, 0, 0.1);
  /* 20px 40px */
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
  width: 2rem;
  /* 32px */
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
  width: 2rem;
  /* 32px */
  height: 2rem;
  border: 0.125rem solid #f5f5f5;
  /* 2px */
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
