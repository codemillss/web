<script setup>
import { computed, ref } from 'vue'
import { getTravelData, getWeatherTravelTip } from '@/utils/travelData'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const activeTab = ref('attractions')

const travelData = computed(() => {
  if (!props.city) return null
  return getTravelData(props.city.id) || getTravelData(props.city.name)
})

const weatherTip = computed(() => {
  if (!travelData.value || !props.city) return ''
  return getWeatherTravelTip(travelData.value, props.city.status)
})

const tabs = [
  { key: 'attractions', label: '🏛️ 관광지', icon: '🏛️' },
  { key: 'food', label: '🍜 먹거리', icon: '🍜' },
  { key: 'activities', label: '🎭 볼거리·체험', icon: '🎭' },
]

const currentItems = computed(() => {
  if (!travelData.value) return []
  return travelData.value[activeTab.value] || []
})
</script>

<template>
  <div v-if="travelData" class="travel-section">
    <!-- 섹션 헤더 -->
    <div class="section-header">
      <div class="header-title">
        <span class="header-icon">✈️</span>
        <h3>추천 여행 정보</h3>
        <span class="city-badge">{{ city.name }}</span>
      </div>
      <p class="header-desc">날씨와 함께 여행 계획을 세워보세요!</p>
    </div>

    <!-- 메인 여행 이미지 -->
    <div class="travel-hero">
      <img :src="travelData.image" :alt="`${city.name} 여행`" class="hero-image" />
      <div class="hero-overlay">
        <span class="hero-label">📸 {{ city.name }} 하이라이트</span>
      </div>
    </div>

    <!-- 날씨 기반 여행 팁 -->
    <div v-if="weatherTip" class="weather-tip">
      <span class="tip-icon">💡</span>
      <div class="tip-content">
        <span class="tip-label">오늘의 날씨 여행 팁</span>
        <p class="tip-text">{{ weatherTip }}</p>
      </div>
    </div>

    <!-- 탭 네비게이션 -->
    <div class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-btn', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 추천 카드 그리드 -->
    <div class="cards-grid">
      <div v-for="(item, index) in currentItems" :key="index" class="recommend-card">
        <div class="card-number">{{ String(index + 1).padStart(2, '0') }}</div>
        <div class="card-body">
          <div class="card-top">
            <h4 class="card-name">{{ item.name }}</h4>
            <span v-if="item.category" class="card-category">{{ item.category }}</span>
          </div>
          <p class="card-desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.travel-section {
  margin-top: 32px;
  background: linear-gradient(145deg, #fefefe, #f8f9fc);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid #ebeef5;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.section-header {
  margin-bottom: 24px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.header-icon {
  font-size: 28px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.header-title h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #1a1c29;
}

.city-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

.header-desc {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

/* 히어로 이미지 */
.travel-hero {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  max-height: 280px;
}

.hero-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.travel-hero:hover .hero-image {
  transform: scale(1.03);
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}

.hero-label {
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 날씨 여행 팁 */
.weather-tip {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  background: linear-gradient(135deg, #fff9e6, #fff3cd);
  border-radius: 14px;
  border: 1px solid rgba(243, 156, 18, 0.2);
  margin-bottom: 24px;
}

.tip-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.tip-content {
  flex: 1;
}

.tip-label {
  font-size: 12px;
  font-weight: 700;
  color: #e67e22;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 4px;
}

.tip-text {
  margin: 0;
  font-size: 14px;
  color: #6b5b2e;
  line-height: 1.6;
  font-weight: 500;
}

/* 탭 네비게이션 */
.tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;
  padding-bottom: 0;
}

.tab-btn {
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #909399;
  border-bottom: 3px solid transparent;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.04);
}

.tab-btn.active {
  color: #3498db;
  border-bottom-color: #3498db;
}

/* 추천 카드 그리드 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.recommend-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  gap: 16px;
  border: 1px solid #ebeef5;
  transition: all 0.3s ease;
  cursor: default;
}

.recommend-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(52, 152, 219, 0.3);
}

.card-number {
  font-size: 28px;
  font-weight: 900;
  color: rgba(52, 152, 219, 0.15);
  line-height: 1;
  flex-shrink: 0;
  min-width: 36px;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.card-name {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
}

.card-category {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  background: #ecf5ff;
  color: #409eff;
  white-space: nowrap;
}

.card-desc {
  margin: 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  word-break: keep-all;
}

@media (max-width: 768px) {
  .travel-section {
    padding: 20px;
  }
  .cards-grid {
    grid-template-columns: 1fr;
  }
  .tab-nav {
    overflow-x: auto;
  }
  .hero-image {
    height: 180px;
  }
  .travel-hero {
    max-height: 180px;
  }
}
</style>
