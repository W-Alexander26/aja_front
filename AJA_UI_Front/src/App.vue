<script setup>
// Aquí podrías importar un layout global, estado, etc.
</script>

<template>
  <!-- El router inyecta aquí el componente de la ruta activa -->
  <router-view />
</template>

<style scoped>
/* Opcional: fondo claro para que veas algo */
:host,
:global(body) {
  background: #f5f5f5;
  color: #222;
  font-family: system-ui, sans-serif;
}
</style>
