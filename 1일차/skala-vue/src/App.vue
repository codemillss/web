<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <!-- 라우터 뷰 렌더링 영역 (메인 콘텐츠) -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- 기존 실습 링크들 (과제 화면을 가리지 않도록 하단 아코디언으로 분리) -->
    <footer class="practice-footer">
      <details class="practice-details">
        <summary>이전 실습 및 챌린지 링크 모음 (클릭하여 펼치기)</summary>
        <nav class="secondary-nav">
          <RouterLink to="/practice-ref">연습: ref()</RouterLink>
          <RouterLink to="/practice-reactive">연습: reactive()</RouterLink>
          <RouterLink to="/practice-computed">연습: computed()</RouterLink>
          <RouterLink to="/practice-watch">연습: watch() 기초</RouterLink>
          <RouterLink to="/practice-watch-multiple">연습: watch 다중 감시</RouterLink>
          <RouterLink to="/practice-watch-ref-deep">연습: watch ref deep/target</RouterLink>
          <RouterLink to="/practice-watch-reactive">연습: watch reactive 규칙</RouterLink>
          <RouterLink to="/practice-watch-effect">연습: watchEffect()</RouterLink>
          <RouterLink to="/practice-lifecycle">연습: Lifecycle 훅</RouterLink>
          <RouterLink to="/practice-props-emits">연습: Props & Emits</RouterLink>
          <RouterLink to="/practice-slot-default">연습: Default Slot</RouterLink>
          <RouterLink to="/practice-slot-named">연습: Named Slot</RouterLink>
          <RouterLink to="/practice-slot-scoped">연습: Scoped Slot</RouterLink>
          <RouterLink to="/practice-store">연습: Pinia 스토어</RouterLink>
          <RouterLink to="/practice-axios-weather">연습: Axios 날씨 API</RouterLink>
          <RouterLink to="/practice-axios-crud">연습: Axios CRUD 기초</RouterLink>
          <RouterLink to="/practice-element-form">UI 실습 1 (Form)</RouterLink>
          <RouterLink to="/practice-element-commerce">UI 실습 2 (커머스)</RouterLink>
          <RouterLink to="/practice-element-feedback">UI 실습 3 (피드백)</RouterLink>
          <RouterLink to="/sampleone">챌린지 1 (반응성)</RouterLink>
          <RouterLink to="/sampletwo">챌린지 2 (보간법)</RouterLink>
          <RouterLink to="/samplethree">챌린지 3 (v-html)</RouterLink>
          <RouterLink to="/samplefour">챌린지 4 (XSS)</RouterLink>
          <RouterLink to="/samplefive">챌린지 5 (v-text)</RouterLink>
          <RouterLink to="/samplesix">챌린지 6 (v-bind)</RouterLink>
          <RouterLink to="/sampleseven">챌린지 7 (클래스)</RouterLink>
          <RouterLink to="/sampleeight">챌린지 8 (스타일)</RouterLink>
          <RouterLink to="/samplenine">챌린지 9 (단축문법)</RouterLink>
          <RouterLink to="/sampleten">챌린지 10 (v-if)</RouterLink>
          <RouterLink to="/sampleeleven">챌린지 11 (v-for/v-show)</RouterLink>
          <RouterLink to="/sampletwelve">챌린지 12 (특수디렉티브)</RouterLink>
          <RouterLink to="/samplethirteen">챌린지 13 (이벤트)</RouterLink>
          <RouterLink to="/samplefourteen">챌린지 14 (v-model)</RouterLink>
          <RouterLink to="/samplefifteen">챌린지 15 (스타일링)</RouterLink>
          <RouterLink to="/samplesixteen">챌린지 16 (ES6+ 문법 종합: 구조분해/방어/비동기)</RouterLink>
        </nav>
        
        <h4 style="text-align: center; color: #555; margin-top: 20px;">[ 종합 실습 과제 링크 ]</h4>
        <nav class="secondary-nav assignment-nav">
          <RouterLink to="/weather-mockup">🌤️ 과제 1: 날씨 (Mockup)</RouterLink>
          <RouterLink to="/weather-composition">🌤️ 과제 2: 날씨 (컴포지션)</RouterLink>
          <RouterLink to="/hw3">🌤️ 과제 3: 날씨 (컴포넌트)</RouterLink>
          <RouterLink to="/hw4">🌤️ 과제 4: 날씨 (Vue Router)</RouterLink>
          <RouterLink to="/hw5">🌟 과제 5: 날씨 (Pinia & API)</RouterLink>
          <RouterLink to="/hw6">🚀 과제 6: 날씨 (확장/예보)</RouterLink>
        </nav>
      </details>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  background-color: #f0f2f5;
}

.main-header {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.primary-nav {
  display: flex;
  flex: 1;
}

.toggler-wrapper {
  margin-left: 20px;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 16px 20px;
  text-decoration: none;
  color: #555;
  font-weight: 600;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: #3498db;
  background-color: #f8f9fa;
}

.nav-item.router-link-active {
  color: #3498db;
  border-bottom-color: #3498db;
  background-color: #f4f9fc;
}

.main-content {
  flex: 1;
  padding: 30px 20px;
}

.practice-footer {
  margin-top: 40px;
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #e1e8ed;
}

.practice-details summary {
  cursor: pointer;
  color: #6c757d;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
}

.secondary-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.secondary-nav a {
  text-decoration: none;
  color: #666;
  font-size: 13px;
  padding: 6px 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  transition: background-color 0.2s;
}

.secondary-nav a:hover,
.secondary-nav a.router-link-active {
  background-color: #e9ecef;
  color: #333;
}
</style>
