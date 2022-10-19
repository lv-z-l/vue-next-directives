<template>
  <div>防抖</div>
  <input v-model="val" v-debounceInput="debounceInput" />
  <div>普通</div>
  <input v-model="count" type="text" @input="onInput" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const val = ref('')
const count = ref('')
function debounceInput(e: Event): void {
  console.log('debounceInput')
}
function onInput(e: Event): void {
  console.log('onInput')
}
</script>

<style></style>
