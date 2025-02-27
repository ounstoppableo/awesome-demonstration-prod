import './assets/main.css';

import { createApp, provide } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
const pinia = createPinia();
const app = createApp(App);

app.provide('app', app);
app.use(pinia);

app.config.errorHandler = (err, instance, info) => {
  window.parent.postMessage(
    { type: 'handleCompileError', data: err },
    location.protocol + '//' + location.hostname + ':7777',
  );
};

app.mount('#app');
