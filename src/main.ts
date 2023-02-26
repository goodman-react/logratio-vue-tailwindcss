import axios from "axios";

import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

const app = createApp(App);
const ax = axios.create();

app.provide("ax", ax);
app.mount("#app");
