import './assets/main.css';

import { createApp, provide } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import NotFound from '@/components/not-found/index.vue';
const pinia = createPinia();
const app = createApp(App);

app.provide('app', app);
app.use(pinia);

app.config.errorHandler = (err: any, instance, info) => {
  window.parent.postMessage(
    { type: 'handleCompileError', data: err.message },
    location.protocol + '//' + location.hostname + ':7777',
  );
};

app.component('NotFound', NotFound);

app.mount('#app');
