<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="hw4-layout">
    <header class="main-header">
      <h2 class="app-title">⛅ 과제 4: 라우터적용</h2>
      <hr class="header-divider" />
      <nav class="primary-nav">
        <RouterLink to="/hw4" class="nav-item">⛅ 날씨 대시보드</RouterLink>
        <span class="nav-divider">|</span>
        <RouterLink to="/hw4/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
      </nav>
    </header>

    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.hw4-layout {
  min-height: 50vh;
  background-color: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
}

.main-header {
  background-color: white;
  padding: 20px 30px;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.app-title {
  margin: 0 0 15px 0;
  font-size: 22px;
  color: #303133;
}

.header-divider {
  border: none;
  border-top: 1px solid #ebeef5;
  margin: 0 0 15px 0;
}

.primary-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.nav-item {
  text-decoration: none;
  color: #909399;
  font-weight: bold;
}

.nav-item.router-link-exact-active {
  color: #409eff;
}

.nav-divider {
  color: #dcdfe6;
}

.main-content {
  padding: 30px 20px;
}

/* 라우터 트랜지션 애니메이션 설정 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
