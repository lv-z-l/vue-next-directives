<template>
  <!-- <div v-loading.doublesize="ddd">ssssss</div> -->
  <div>
    <div class="aaa">
      <img v-lazy="img1" src="" alt="" />
    </div>
    <div class="aaa">
      <img v-lazy="img2" src="" alt="" />
    </div>
    <div class="aaa">
      <img v-lazy="img3" src="" alt="" />
    </div>
    <div class="aaa">
      <img v-lazy="img4" src="" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const img1 = ref('https://img0.baidu.com/it/u=1674332027,2650649314&fm=253&fmt=auto&app=138&f=JPEG?w=550&h=377')
const img2 = ref('https://img0.baidu.com/it/u=1674332027,2650649314&fm=253&fmt=auto&app=138&f=JPEG?w=550&h=377')
const img3 = ref('https://img0.baidu.com/it/u=1674332027,2650649314&fm=253&fmt=auto&app=138&f=JPEG?w=550&h=377')
const img4 = ref('https://img0.baidu.com/it/u=1674332027,2650649314&fm=253&fmt=auto&app=138&f=JPEG?w=550&h=377')

const ddd = ref(true)
</script>

<style lang="scss">
.aaa {
  height: 500px;
  width: 100%;
  margin: 300px 0;
}
</style>
