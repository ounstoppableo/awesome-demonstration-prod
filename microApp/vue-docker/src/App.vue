<script setup lang="ts">
// @ts-ignore
import { inject, onMounted, ref, nextTick } from 'vue';
import ParseStringToComponent from './utils/parseStringToComponent/parseStringToComponent';
import { useViewInfoStoreStore } from './store/viewInfoStore';

const componentName = ref('');
const app: any = inject('app');
const randomKey = ref(Math.random());

const viewInfoStoreState = useViewInfoStoreStore();

onMounted(() => {
  window.addEventListener('message', async (e) => {
    if (e.origin !== location.protocol + '//' + location.hostname + ':7777') {
      console.warn('拒绝来自不安全域的消息:', e.origin);
      return;
    }
    if (e.data.type === 'updateViewer') {
      viewInfoStoreState.setViewInfo(e.data.viewInfo);
      const parseStringToComponent = new ParseStringToComponent(app);
      await parseStringToComponent.parseToComponent(
        viewInfoStoreState.getRootContent,
        'viewerRoot',
      );
      randomKey.value = Math.random();
      componentName.value = 'viewerRoot';
      nextTick(() => {
        window.parent.postMessage(
          { type: 'componentLoadCompleted', data: '组件加载完成~' },
          location.protocol + '//' + location.hostname + ':7777',
        );
      });
    }
    if (e.data.type === 'setStyle') {
      Object.keys(e.data.style).map((selector) => {
        Object.keys(e.data.style[selector]).forEach((attr) => {
          (document.querySelector(selector) as any).style[attr] =
            e.data.style[selector][attr];
        });
      });
    }
  });
  window.parent.postMessage(
    { type: 'frameworkReady', data: '我准备好了~' },
    location.protocol + '//' + location.hostname + ':7777',
  );
});
</script>

<template>
  <Suspense>
    <div
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "
    >
      <component :is="componentName" :key="randomKey"></component>
    </div>
  </Suspense>
</template>

<style scoped>
</style>
