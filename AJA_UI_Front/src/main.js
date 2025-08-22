import './token-init.js'; // Import token initialization script
import { createApp } from "vue";
import App from "./App.vue";
import router from "./rutas/rutas";
// import "./assets/main.css";

createApp(App).use(router).mount("#app");
//