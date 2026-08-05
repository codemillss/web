<script setup>
import { computed } from 'vue'

const props = defineProps({
  weatherList: {
    type: Array,
    required: true,
  },
})

const summaryText = computed(() => {
  const list = props.weatherList
  if (!list || list.length === 0) return '현재 로드된 날씨 데이터가 없습니다.'

  const total = list.length

  // 온도 분석
  const sortedByTemp = [...list].sort((a, b) => b.temp - a.temp)
  const hottest = sortedByTemp[0]
  const coldest = sortedByTemp[sortedByTemp.length - 1]

  // 날씨 상태 분석 (비/눈/흐림 등)
  const rainyCities = list
    .filter((c) => c.status.includes('비') || c.status.includes('Rain'))
    .map((c) => c.name)
  const clearCities = list
    .filter((c) => c.status.includes('맑음') || c.status.includes('Clear'))
    .map((c) => c.name)

  let briefing = `현재 전 세계 ${total}개 지역의 날씨와 여행 정보를 분석 중입니다. `

  if (hottest && coldest && hottest.id !== coldest.id) {
    briefing += `가장 더운 곳은 ${hottest.name}(${hottest.temp}°C), 가장 시원한 곳은 ${coldest.name}(${coldest.temp}°C)입니다. `
  }

  if (rainyCities.length > 0) {
    briefing += `현재 비가 오는 ${rainyCities.slice(0, 2).join(', ')}${rainyCities.length > 2 ? ' 등' : ''}의 지역은 실내 관광을 추천합니다. `
  }

  if (clearCities.length > 0) {
    const recommendedCity = clearCities[Math.floor(Math.random() * clearCities.length)]
    briefing += `지금 가장 떠나기 좋은 곳은 날씨가 화창한 🌟${recommendedCity}🌟입니다! 짐을 싸고 훌쩍 떠나보는 건 어떨까요?`
  } else {
    briefing += `어느 곳이든 날씨에 맞는 완벽한 여행 코스를 찾아보세요!`
  }

  return briefing
})
</script>

<template>
  <div class="ai-briefing-wrapper">
    <div class="ai-briefing-header">
      <span class="ai-icon">✈️</span>
      <span class="ai-title">AI 스마트 여행 브리핑</span>
      <span class="ai-badge">LIVE</span>
    </div>
    <div class="ai-briefing-content">
      {{ summaryText }}
    </div>
  </div>
</template>

<style scoped>
.ai-briefing-wrapper {
  background: linear-gradient(135deg, #1e293b, #3b82f6);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.ai-briefing-wrapper:hover {
  transform: translateY(-2px);
}

.ai-briefing-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
  z-index: 1;
}

.ai-briefing-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  position: relative;
  z-index: 2;
}

.ai-icon {
  font-size: 26px;
}

.ai-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #ffffff, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ai-badge {
  background-color: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  animation: pulse 2s infinite;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.ai-briefing-content {
  font-size: 16.5px;
  line-height: 1.7;
  opacity: 0.95;
  position: relative;
  z-index: 2;
  word-break: keep-all;
  font-weight: 400;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    transform: scale(1.05);
    opacity: 0.8;
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}
</style>
