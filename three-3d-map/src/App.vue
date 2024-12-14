<template>
  <div class="App"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThree } from './hooks/useThree'

onMounted(() => {
  useThree()
})
</script>

<style scoped lang="less">
.App {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
