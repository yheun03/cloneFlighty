import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/scss/index.scss";
import { t } from "./common/preferences.js";

const app = createApp(App);
app.config.globalProperties.$t = t;
app.use(router).mount("#app");
