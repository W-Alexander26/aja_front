<template>
  <section class="form-wrapper">
    <div class="header">
      <h2 class="heading">Agregar nuevo proyecto</h2>
      <p class="subtitle">
        Completa la información para crear un nuevo proyecto
      </p>
    </div>

    <!-- CARD -->
    <form @submit.prevent="enviarFormulario" class="card">
      <!-- === FILA 1 === -->
      <div class="row">
        <div class="field">
          <label>
            <span class="label-icon">📝</span>
            Nombre del Proyecto
          </label>
          <input
            v-model="proyecto.nombre"
            required
            type="text"
            placeholder="Ej: Mi Sitio Web Increíble"
          />
        </div>

        <div class="field field-wide">
          <label>
            <span class="label-icon">📄</span>
            Descripción
          </label>
          <textarea
            v-model="proyecto.descripcion"
            rows="3"
            required
            placeholder="Describe brevemente tu proyecto..."
          />
        </div>
      </div>

      <!-- === FILA 2 === -->
      <div class="row">
        <div class="field">
          <label>
            <span class="label-icon">👤</span>
            Responsable
          </label>
          <input
            v-model="proyecto.responsable"
            required
            type="text"
            placeholder="Nombre del responsable"
          />
        </div>

        <div class="field">
          <label>
            <span class="label-icon">🏷️</span>
            Categoría
          </label>
          <select v-model="proyecto.categoria" required>
            <option value="">Selecciona una categoría</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Aplicación Web">Aplicación Web</option>
            <option value="Landing Page">Landing Page</option>
            <option value="Blog">Blog</option>
            <option value="Dashboard">Dashboard</option>
          </select>
        </div>
      </div>

      <!-- === FILA 3 === -->
      <div class="row">
        <div class="field">
          <label>
            <span class="label-icon">🔗</span>
            Enlace del Proyecto
          </label>
          <input
            v-model="proyecto.link"
            type="url"
            placeholder="https://mi-proyecto.com"
          />
        </div>

        <div class="field">
          <label>
            <span class="label-icon">📍</span>
            Ubicación
          </label>
          <input
            v-model="proyecto.ubicacion"
            type="text"
            placeholder="Ciudad, País"
          />
        </div>
      </div>

      <!-- === FILA 4 === -->
      <div class="row">
        <div class="field">
          <label>
            <span class="label-icon">⚡</span>
            Estado del Proyecto
          </label>
          <div class="status-selector">
            <label
              class="status-option"
              :class="{ active: proyecto.estado === true }"
            >
              <input type="radio" :value="true" v-model="proyecto.estado" />
              <span class="status-badge active-badge">
                <span class="status-dot"></span>
                Activo
              </span>
            </label>
            <label
              class="status-option"
              :class="{ active: proyecto.estado === false }"
            >
              <input type="radio" :value="false" v-model="proyecto.estado" />
              <span class="status-badge inactive-badge">
                <span class="status-dot"></span>
                Inactivo
              </span>
            </label>
          </div>
        </div>

        <div class="field">
          <label>
            <span class="label-icon">📎</span>
            Archivos del Proyecto
          </label>
          <div class="file-upload-zone" @click="$refs.fileInput.click()">
            <input
              ref="fileInput"
              type="file"
              multiple
              @change="handleArchivos"
              style="display: none"
            />
            <div class="upload-content">
              <span class="upload-icon">📁</span>
              <span>Haz clic para subir archivos</span>
              <small>o arrastra y suelta aquí</small>
            </div>
          </div>

          <div v-if="proyecto.archivos.length" class="file-list">
            <div
              v-for="(archivo, idx) in proyecto.archivos"
              :key="idx"
              class="file-item"
            >
              <span class="file-icon">📄</span>
              <span class="file-name">{{ archivo.nombre }}</span>
              <button
                type="button"
                @click="removeFile(idx)"
                class="remove-file"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button type="button" class="btn-secondary" @click="resetForm">
          Limpiar Formulario
        </button>
        <button type="submit" class="btn-primary">
          <span class="btn-icon">✨</span>
          Crear Proyecto
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { crear, consultar } from "@/components/Services/service";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const proyecto = ref({
  nombre: "",
  descripcion: "",
  responsable: "",
  categoria: "",
  link: "",
  ubicacion: "",
  estado: true,
  archivos: [],
});

const token = Cookies.get("token");
const API_URL = import.meta.env.VITE_API_AUTH;

const subirArchivo = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  try {
    const res = await consultar(API_URL, "api/proyectos/archivo", fd, token);
    // console.log(fd);
    return res?.url || null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const handleArchivos = async (e) => {
  const files = Array.from(e.target.files);
  const nuevosArchivos = [];

  for (const file of files) {
    const url = await subirArchivo(file); // <— 1) obtengo la url única
    if (url) {
      // lo guardo como objeto para que siga apareciendo bonito en la UI
      nuevosArchivos.push({ nombre: file.name, url });
    } else {
      Swal.fire("Error", `No se pudo subir ${file.name}`, "error");
    }
  }

  // lista que usa la vista (muestra nombre + botón borrar)
  proyecto.value.archivos.push(...nuevosArchivos);
};

const removeFile = (index) => {
  proyecto.value.archivos.splice(index, 1);
};

const resetForm = () => {
  Object.assign(proyecto.value, {
    nombre: "",
    descripcion: "",
    responsable: "",
    categoria: "",
    link: "",
    ubicacion: "",
    estado: true,
    archivos: [],
  });
};

const enviarFormulario = async () => {
  try {
    const payload = {
      ...proyecto.value,
      archivos: proyecto.value.archivos.map((a) => a.url),
    };

    await crear(API_URL, "api/proyectos", payload, token);

    Swal.fire("¡Éxito!", "Proyecto creado exitosamente", "success");
    resetForm();
  } catch (e) {
    console.error(e);
    Swal.fire("Error", "No se pudo crear el proyecto", "error");
  }
};
</script>

<style scoped>
/* ====== Variables mejoradas ====== */
:global(:root) {
  --primary-50: #f0f7ff;
  --primary-100: #e0f0ff;
  --primary-200: #b8dcff;
  --primary-500: #4f8fff;
  --primary-600: #2462ff;
  --primary-700: #1854e6;

  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;

  --warning-50: #fffbeb;
  --warning-500: #f59e0b;

  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;

  --text-dark: var(--gray-900);
  --text-muted: var(--gray-600);
  --radius: 16px;
  --radius-sm: 8px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* ====== Layout principal ====== */
.form-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 0.5rem;
  background: linear-gradient(
    135deg,
    var(--primary-50) 0%,
    var(--gray-50) 100%
  );
  min-height: 100vh;
}

/* ====== Header ====== */
.header {
  text-align: center;
  margin-bottom: 3rem;
}

.heading {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0;
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  font-weight: 400;
}

/* ====== Card principal ====== */
.card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
}

/* ====== Filas y campos ====== */
.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-wide {
  grid-column: 1 / -1;
}

.field label {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.1rem;
}

/* ====== Inputs base ====== */
.field input,
.field textarea,
.field select {
  font-family: inherit;
  font-size: 1rem;
  padding: 0.875rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-sm);
  background: white;
  transition: all 0.2s ease;
  color: var(--text-dark);
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--gray-400);
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(79, 143, 255, 0.1);
  transform: translateY(-1px);
}

.field input:hover,
.field textarea:hover,
.field select:hover {
  border-color: var(--gray-300);
}

/* ====== Selector de estado ====== */
.status-selector {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.status-option {
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-option input[type="radio"] {
  display: none;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.9rem;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.active-badge {
  background: var(--success-50);
  color: var(--success-600);
  border-color: var(--success-200);
}

.active-badge .status-dot {
  background: var(--success-500);
}

.inactive-badge {
  background: var(--gray-100);
  color: var(--gray-600);
  border-color: var(--gray-200);
}

.inactive-badge .status-dot {
  background: var(--gray-400);
}

.status-option.active .status-badge {
  transform: scale(1.05);
  box-shadow: var(--shadow);
}

/* ====== Zona de carga de archivos ====== */
.file-upload-zone {
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-sm);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--gray-50);
}

.file-upload-zone:hover {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.upload-content small {
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* ====== Lista de archivos ====== */
.file-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--gray-50);
  border-radius: var(--radius-sm);
  border: 1px solid var(--gray-200);
}

.file-icon {
  font-size: 1.1rem;
}

.file-name {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-dark);
}

.remove-file {
  background: var(--gray-200);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-600);
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.remove-file:hover {
  background: #ef4444;
  color: white;
}

/* ====== Botones de acción ====== */
.actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--gray-200);
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 2rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  color: white;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: white;
  color: var(--gray-600);
  border-color: var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

.btn-icon {
  font-size: 1.1rem;
}

/* ====== Responsive ====== */
@media (max-width: 768px) {
  .form-wrapper {
    padding: 1rem;
    padding-top: 2rem;
  }

  .heading {
    font-size: 2rem;
  }

  .card {
    padding: 1.5rem;
  }

  .row {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .status-selector {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .heading {
    font-size: 1.75rem;
  }

  .card {
    padding: 1rem;
  }

  .file-upload-zone {
    padding: 1.5rem;
  }
}
</style>
