<script setup>
import { ref } from 'vue'

const activeTab = ref('style')
</script>

<template>
  <div class="practice-section">
    <h2>Vue Style 적용 방법 학습</h2>

    <h3>1) Scoped Style vs Global Style</h3>
    <p class="scoped-text">이 텍스트는 해당 컴포넌트에만 적용되는 Scoped 스타일입니다.</p>
    <p class="custom-card">커스텀 스타일이 적용된 카드로 시각적 효과를 부여할 수 있습니다.</p>

    <br />
    <h3>2) 탭 전환 스타일 실습</h3>
    <div>
      <button
        :class="['tab-btn', { active: activeTab === 'style' }]"
        @click="activeTab = 'style'"
      >
        Style 탭
      </button> &nbsp;
      <button
        :class="['tab-btn', { active: activeTab === 'script' }]"
        @click="activeTab = 'script'"
      >
        Script 탭
      </button>
    </div>

    <div class="tab-content">
      <p v-if="activeTab === 'style'">스타일 탭 내용: Scoped CSS와 템플릿의 조화</p>
      <p v-else>스크립트 탭 내용: Vue 3 Composition API &amp; Script Setup</p>
    </div>
  </div>
</template>

<style scoped>
.scoped-text {
  color: #2c3e50;
  font-style: italic;
}

.custom-card {
  background: linear-gradient(135deg, #42b883, #35495e);
  color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tab-btn {
  padding: 8px 16px;
  border: 1px solid #42b883;
  background-color: white;
  color: #42b883;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background-color: #42b883;
  color: white;
  font-weight: bold;
}

.tab-content {
  margin-top: 12px;
  padding: 12px;
  border: 1px dashed #42b883;
  border-radius: 4px;
}
</style>
