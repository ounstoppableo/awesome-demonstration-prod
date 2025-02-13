<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { parseToComponent } from './utils/parseToComponent';
import { useViewInfoStoreStore } from './store/viewInfoStore';
const componentName = ref('');
const app: any = inject('app');
const randomKey = ref(Math.random());

const viewInfoStoreState = useViewInfoStoreStore();

onMounted(() => {
  window.addEventListener('message', async (e) => {
    if (e.data.type === 'updateViewer') {
      viewInfoStoreState.setViewInfo(e.data.viewInfo);
      try {
        await parseToComponent(
          viewInfoStoreState.getRootContent,
          'viewerRoot',
          app,
        );
        randomKey.value = Math.random();
        componentName.value = 'viewerRoot';
      } catch (err) {
        console.log(111);
      }
    }
  });
  window.parent.postMessage(
    { type: 'frameworkReady', data: '我准备好了~' },
    '*',
  );
});
</script>

<template>
  <Suspense>
    <div>
      <component :is="componentName" :key="randomKey"></component>
    </div>
  </Suspense>
</template>

<style scoped>
</style>
