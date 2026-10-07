import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/scss/index.scss";
import "./assets/scss/FcGalleryBundle.scss";

createApp(App).use(router).mount("#app");
