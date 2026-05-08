import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import router from "./router";
import AuthService from "./services/auth.service.js";

const app = createApp(App);

// Initialize Auth state listener before mounting
AuthService.onAuthStateChange((user) => {
  // This will trigger route guards when auth state changes
  console.log("Auth state changed:", user ? "logged in" : "logged out");
});

app.use(router).mount("#app");
