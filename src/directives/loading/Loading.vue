<template>
  <div class="loading">
    <div class="loading-content">
      <img :width="size" :height="size" src="../../assets/images/loading.gif" />
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'Loading'
}
</script>
<script setup lang="ts">
import { ref } from 'vue'
const size = ref(24)
const title = ref('加载中，请稍后...')

function setTitle(userTitle: string): void {
  title.value = userTitle
}

function changeSize() {
  size.value = size.value * 2
}

defineExpose({
  setTitle,
  changeSize
})
</script>

<style lang="scss">
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  .loading-content {
    text-align: center;
    .desc {
      line-height: 20px;
      font-size: 14px;
    }
  }
}
.position-relative {
  position: relative;
}
</style>
