import { createApp } from "vue";
import App from "./App.vue";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

// Import all of Bootstrap's JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.esm";

import router from "./routers";
import { createPinia } from "pinia";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
