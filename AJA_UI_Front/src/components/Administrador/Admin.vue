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

    <main class="admin-main">
      <h1>Panel de Administración</h1>
      <p>
        Bienvenido al área administrativa. Desde aquí puedes gestionar el
        contenido del sistema.
      </p>

      <div class="admin-cards">
        <div class="card">
          <h3>Usuarios</h3>
          <p>Ver, editar o eliminar usuarios registrados.</p>
          <button>Gestionar</button>
        </div>

        <div class="card">
          <h3>Contenido</h3>
          <p>Modificar textos, imágenes y recursos del sitio.</p>
          <button>Gestionar</button>
        </div>

        <div class="card">
          <h3>Estadísticas</h3>
          <p>Revisa la actividad reciente y métricas clave.</p>
          <button>Ver métricas</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
const router = useRouter();

function logout() {
  Swal.fire(
    "Sesión cerrada",
    "Has salido del panel de administración",
    "success"
  );
  // Aquí puedes limpiar cookies/token y redirigir
  Cookies.remove("UTC");
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
  padding: 16px 40px;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 999;
}

.admin-logo .logo-img {
  height: 32px;
}

.logout-button {
  background-color: #ef4444;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #dc2626;
}

/* Main Content */
.admin-main {
  padding: 40px 20px;
  text-align: center;
}

.admin-main h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #1e40af;
}

.admin-main p {
  color: #4b5563;
  max-width: 600px;
  margin: 0 auto 40px;
}

/* Cards */
.admin-cards {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.card {
  background-color: white;
  padding: 30px 20px;
  width: 260px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.card h3 {
  margin-bottom: 10px;
  color: #111827;
}

.card p {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 20px;
}

.card button {
  background-color: #3b82f6;
  color: white;
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.card button:hover {
  background-color: #2563eb;
}
</style>
