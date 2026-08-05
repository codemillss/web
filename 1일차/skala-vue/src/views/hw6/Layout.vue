<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import UnitToggler from '@/components/hw6/UnitToggler.vue'

const route = useRoute()

const currentPageName = computed(() => {
  const nameMap = {
    'hw6-home': '글로벌 여행 홈',
    'hw6-forecast': '주간 날씨와 여행 일정',
    'hw6-air-pollution': '여행지 대기질 확인',
    'hw6-about': '이용 가이드',
    'hw6-detail': '상세 여행/날씨 정보',
  }
  return nameMap[route.name] || ''
})

const showSettings = ref(false)
const userApiKey = ref('')

const openSettings = () => {
  userApiKey.value = localStorage.getItem('hw6_user_api_key') || ''
  showSettings.value = true
}

const saveSettings = () => {
  if (userApiKey.value.trim()) {
    localStorage.setItem('hw6_user_api_key', userApiKey.value.trim())
  } else {
    localStorage.removeItem('hw6_user_api_key')
  }
  showSettings.value = false
  window.location.reload()
}
</script>

<template>
  <div class="hw6-layout">
    <header class="main-header">
      <div class="header-top">
        <h2 class="app-title">
          <span class="title-icon">✈️</span>
          <span class="title-text">Global Weather & Travel Guide</span>
        </h2>
        <div class="breadcrumb" v-if="currentPageName">
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-current">{{ currentPageName }}</span>
        </div>
      </div>
      <hr class="header-divider" />
      <div class="nav-bar">
        <nav class="primary-nav">
          <RouterLink to="/hw6" class="nav-item" exact-active-class="active">
            <span class="nav-icon">🏠</span>
            <span>글로벌 여행 홈</span>
          </RouterLink>
          <RouterLink to="/hw6/forecast" class="nav-item" active-class="active">
            <span class="nav-icon">📅</span>
            <span>주간 날씨와 여행</span>
          </RouterLink>
          <RouterLink to="/hw6/air-pollution" class="nav-item" active-class="active">
            <span class="nav-icon">😷</span>
            <span>여행지 대기질</span>
          </RouterLink>
          <RouterLink to="/hw6/about" class="nav-item" active-class="active">
            <span class="nav-icon">🗺️</span>
            <span>이용 가이드</span>
          </RouterLink>
        </nav>
        <div class="toggler-wrapper" style="display: flex; align-items: center;">
          <el-button size="small" plain round @click="openSettings" style="margin-right: 12px;">⚙️ API 설정</el-button>
          <UnitToggler />
        </div>
      </div>
    </header>

    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <span class="footer-brand">✈️ Global Weather & Travel Guide</span>
        <span class="footer-divider">|</span>
        <span class="footer-tech">Vue 3 · Pinia · Globe.gl · OpenWeatherMap API</span>
      </div>
    </footer>

    <!-- API 설정 모달 -->
    <el-dialog v-model="showSettings" title="⚙️ 시스템 설정" width="400px" center>
      <div style="margin-bottom: 10px; font-size: 13px; color: #606266;">
        채점자용 API Key 입력란입니다.<br />
        입력 시 환경 변수(.env)보다 우선적으로 적용됩니다.
      </div>
      <el-input
        v-model="userApiKey"
        placeholder="OpenWeatherMap API Key 입력..."
        clearable
        @keyup.enter="saveSettings"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSettings = false">취소</el-button>
          <el-button type="primary" @click="saveSettings">저장 및 새로고침</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.hw6-layout {
  min-height: 50vh;
  background-color: #f0f2f5;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main-header {
  background-color: white;
  padding: 20px 30px 0;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 15px;
}

.app-title {
  margin: 0;
  font-size: 22px;
  color: #1a1c29;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 26px;
}

.title-text {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #909399;
}

.breadcrumb-separator {
  font-size: 18px;
  color: #c0c4cc;
}

.breadcrumb-current {
  color: #409eff;
  font-weight: 600;
}

.header-divider {
  border: none;
  border-top: 1px solid #ebeef5;
  margin: 0;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.primary-nav {
  display: flex;
  align-items: center;
  gap: 0;
}

.nav-item {
  text-decoration: none;
  color: #909399;
  font-weight: 600;
  font-size: 14px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 3px solid transparent;
  transition: all 0.25s ease;
  position: relative;
}

.nav-item:hover {
  color: #3498db;
  background-color: #f4f9fc;
}

.nav-item.active {
  color: #3498db;
  border-bottom-color: #3498db;
  background-color: rgba(52, 152, 219, 0.04);
}

.nav-icon {
  font-size: 16px;
}

.toggler-wrapper {
  margin-left: 20px;
  padding: 10px 0;
}

.main-content {
  padding: 30px 20px;
  flex: 1;
}

.app-footer {
  background-color: white;
  border-top: 1px solid #ebeef5;
  padding: 16px 30px;
  text-align: center;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 13px;
  color: #909399;
}

.footer-brand {
  font-weight: 700;
  color: #606266;
}

.footer-divider {
  color: #dcdfe6;
}

.footer-tech {
  font-size: 12px;
  letter-spacing: 0.3px;
}

/* 라우터 트랜지션 애니메이션 설정 */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .main-header {
    padding: 15px 16px 0;
  }
  .primary-nav {
    flex-wrap: wrap;
  }
  .nav-item {
    padding: 10px 14px;
    font-size: 13px;
  }
  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .footer-content {
    flex-direction: column;
    gap: 6px;
  }
  .footer-divider {
    display: none;
  }
}
</style>
