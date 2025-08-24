import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "virtual:uno.css";
import ui from "@nuxt/ui/vue-plugin";

const app = createApp(App);

app.use(router);
app.use(ui);

app.mount("#app");
