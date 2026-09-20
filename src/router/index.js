import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import MapPage from "../pages/MapPage.vue";
import FcComponentGallery from "../component/FcComponentGallery.vue";

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", name: "home", component: HomePage },
        { path: "/map", name: "map", component: MapPage },
        {
            path: "/component",
            name: "component",
            component: FcComponentGallery,
        },
    ],
});
