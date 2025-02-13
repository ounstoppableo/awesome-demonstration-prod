import './assets/main.css';

import { createApp, provide } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
const pinia = createPinia();
const app = createApp(App);

app.provide('app', app);
app.use(pinia);

app.config.errorHandler = (err, instance, info) => {};

app.mount('#app');
