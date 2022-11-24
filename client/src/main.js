import { createApp } from "vue";
import App from "./App.vue";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

// Import all of Bootstrap's JS
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { createPinia } from "pinia";
import router from "./routers";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
