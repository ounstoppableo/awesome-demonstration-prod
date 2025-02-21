<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
const contain = ref(null);
const envelope = ref(null);
const envelopeWidth = ref(400);
const envelopeInnerWidth = computed(() => {
  return envelopeWidth.value - 20;
});
const envelopeHeight = computed(() => {
  return envelopeWidth.value / 1.67;
});
const relativeMove = computed(() => {
  return (envelopeHeight.value * 4) / 7;
});
const expandenvelope = (e, flag) => {
  if (flag) {
    const containHeight = contain.value.offsetHeight;
    contain.value.style.top = 0;
    envelope.value.style.height =
      envelopeHeight.value + containHeight - relativeMove.value + "px";
  } else {
    contain.value.style.top = relativeMove.value + 20 + "px";
    envelope.value.style.height =
      envelopeHeight.value + relativeMove.value + "px";
  }
};
const envelopeExcludeClickCb = (e) => {
  if (!e.target.closest(".envelope")) {
    expandenvelope(null, false);
  }
};

onMounted(() => {
  window.addEventListener("click", envelopeExcludeClickCb);
});

onUnmounted(() => {
  window.removeEventListener("click", envelopeExcludeClickCb);
});
</script>

<template>
  <div class="envelope">
    <div
      ref="envelope"
      :style="{
        'border-radius': '10px 10px 10px 10px',
        'font-size': '14px',
        color: '#555555',
        width: envelopeWidth + 'px',
        height: envelopeHeight + relativeMove + 'px',
        margin: '20px auto 0',
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        position: 'relative',
        overflow: 'hidden',
        cursor:
          'url(https://cdn.jsdelivr.net/gh/ounstoppableo/cdn@vlatest/assets/cola.ico),pointer',
        transition: 'all 2s ease',
      }"
      @click="(e) => expandenvelope(e, true)"
    >
      <img
        class="beforeimg"
        noLazyLoad="true"
        :style="{
          width: envelopeWidth + 'px',
          height: envelopeHeight + 'px',
          'z-index': '0',
          'pointer-events': 'none',
          position: 'absolute',
          bottom: relativeMove + 'px',
          transition: 'all 2s ease',
        }"
        src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/before.png"
      />
      <div
        ref="contain"
        :style="{
          position: 'absolute',
          top: relativeMove + 20 + 'px',
          transition: 'all 2s ease',
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
        }"
      >
        <img
          noLazyLoad="true"
          src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/violet.jpg"
          style="
            overflow: hidden;
            pointer-events: none;
            border-radius: 10px 10px 0 0;
            transition: all 2s ease;
          "
          :style="{ width: envelopeInnerWidth + 'px' }"
        />
        <div
          :style="{
            width: envelopeInnerWidth + 'px',
            color: '#9d2850',
            'background-image':
              '-moz-linear-gradient(0deg,rgb(67, 198, 184),rgb(255, 209, 244))',
            height: ' 66px',
            background:
              'url(https://npm.elemecdn.com/sarakale-assets@v1/Article/email/line034_666x66.png) left top no-repeat',
            overflow: 'hidden',
          }"
        >
          <p
            :style="{
              'font-size': '16px',
              'font-weight': 'bold',
              'text-align': 'center',
              'word-break': 'break-all',
              padding: '23px 32px',
              display: 'flex',
              'flex-direction': 'column',
              'justify-content': 'center',
              'align-items': 'center',
              margin: 0,
            }"
          >
            有朋自远方来~
          </p>
        </div>
        <div
          class="formmain"
          :style="{
            background: '#fff',
            width: envelopeInnerWidth + 'px',
            margin: 'auto auto',
            'border-radius': '0 0 10px 10px',
            border: '1px solid #ccc)',
            overflow: 'hidden',
            ' pointer-events': 'none',
          }"
        >
          <div
            style="margin: 20px auto 40px"
            :style="{ width: envelopeInnerWidth + 'px' }"
          >
            <form
              style="
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding: 12px;
                padding-bottom: 20px;
              "
            >
              <div class="formItem">
                <div>昵称：</div>
                <input style="flex: 1" type="text" placeholder="请输入昵称" />
              </div>
              <div class="formItem">
                <div>简介：</div>
                <input style="flex: 1" type="text" placeholder="请输入简介" />
              </div>
              <div class="formItem">
                <div>封面：</div>
                <input style="flex: 1" type="text" placeholder="请输入封面" />
              </div>
              <div class="formItem">
                <div>网站：</div>
                <input style="flex: 1" type="text" placeholder="请输入网址" />
              </div>
            </form>
            <img
              src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/line.png"
              noLazyLoad="true"
              style="
                width: 100%;
                margin: 25px auto 5px auto;
                display: block;
                pointer-events: none;
              "
            />
            <p
              class="bottomhr"
              style="font-size: 12px; text-align: center; color: #999"
            >
              欢迎交换友链~~
            </p>
          </div>
        </div>
      </div>
      <img
        class="afterimg"
        noLazyLoad="true"
        :style="{
          width: envelopeWidth + 'px',
          height: envelopeHeight + 'px',
          position: 'absolute',
          bottom: '-2px',
          'z-index': 100,
          transition: 'all 2s ease',
        }"
        src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/after.png"
      />
    </div>
  </div>
</template>

<style scoped>
.envelope {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 2s ease;
}
.formItem {
  display: flex;
  gap: 8px;
}
</style>
