import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Translate from "@components/Translate.vue";
import Search from "@components/Search.vue";
import Logs from "@components/Logs.vue";
import { createRouter, createWebHistory } from "vue-router";
import { GesturePlugin } from "@vueuse/gesture";

const isProduction = import.meta.env.MODE === "production";
const basePath = isProduction ? "/ai_translation/" : "/";

const router = createRouter({
  history: createWebHistory(basePath),
  routes: [
    { path: "/", component: Translate },
    { path: "/search", component: Search },
    { path: "/logs", component: Logs },
  ],
});

const app = createApp(App);
app.use(router);
app.use(GesturePlugin);
app.mount("#app");
