<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Iniciar Sesión</h2>

      <label for="user">Usuario</label>
      <input
        type="text"
        id="user"
        placeholder="Ingrese usuario"
        v-model="usuario"
      />

      <label for="contrasena">Contraseña</label>
      <input
        type="password"
        id="contrasena"
        placeholder="Ingrese contraseña"
        v-model="contrasena"
      />

      <button @click="log">Ingresar</button>
    </div>
  </div>
</template>

<script setup>
import { crear } from "../Services/service";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";

const usuario = ref("");
const contrasena = ref("");
const router = useRouter();

async function log() {
  if (usuario.value.trim() === "" || contrasena.value.trim() === "") {
    Swal.fire("Precaución", "Necesitas llenar todos los campos", "warning");
    return;
  }

  try {
    const payload = {
      username: usuario.value,
      password: contrasena.value,
    };
    console.log(payload);

    const response = await crear(
      import.meta.env.VITE_API_AUTH,
      "api/users/auth",
      payload,
      "token"
    );

    Swal.fire("Éxito", "Sesión iniciada correctamente", "success");
    // console.log(response);
    Cookies.set("token", response.accessToken);
    router.push("/admin");
  } catch (error) {
    Swal.fire("Error", "Error al iniciar sesión", "error");
    console.error("Error al iniciar sesión:", error);
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background-color: #f6f9fc;
}

.login-box {
  background-color: white;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 12px;
  font-size: 1.8rem;
  color: #3b82f6;
}

label {
  font-weight: 500;
  color: #1f2937;
}

input {
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #3b82f6;
}

button {
  padding: 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2563eb;
}
</style>
