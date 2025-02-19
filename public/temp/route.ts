import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const scope = searchParams.get('scope') as string;
    const fileName = searchParams.get('fileName') as string;
    if (!scope || !fileName) throw new Error('参数不完整！');
    if (fileName === 'ccc.vue')
      return Response.json({
        code: 200,
        data: `
<script setup>
import { onMounted, ref } from "vue";

const list = ref([1, 2, 3, 4, 5, 6, 7]);
const btnCb = () => {
  list.value = list.value.filter((_, index) => index !== 0);
};
</script>

<template>
  <div v-for="item in list" :key="item" class="container">
    {{ item }}
  </div>
  <button @click="btnCb">点我移除第一位</button>
  <bbb></bbb>
</template>

<style scoped>
.container {
    hight:100vh;
    width:100vw;
    display:flex;
    justify-content:center;
    align-items:center;
}
</style>
`,
      });
    else
      return Response.json({
        code: 200,
        data: `
<script setup>
import { onMounted, ref } from "vue";
</script>

<template>
 <div>111</div>
</template>

<style scoped>
.container {
    hight:100vh;
    width:100vw;
    display:flex;
    justify-content:center;
    align-items:center;
}
</style>
`,
      });
  } catch {}
}
