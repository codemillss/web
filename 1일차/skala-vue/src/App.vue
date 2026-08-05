<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family:
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    sans-serif;
  background-color: #f0f2f5;
}

.main-content {
  flex: 1;
  padding: 30px 20px;
}
</style>
