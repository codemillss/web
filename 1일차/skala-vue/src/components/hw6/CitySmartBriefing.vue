<script setup>
import { computed } from 'vue'

const props = defineProps({
  city: {
    type: Object,
    required: true
  }
})

const summaryText = computed(() => {
  if (!props.city) return '해당 도시의 날씨 데이터를 분석할 수 없습니다.'
  
  const c = props.city
  let briefing = `${c.name} 지역의 실시간 날씨 데이터 분석 결과입니다. `
  
  const temp = Math.round(c.temp)
  if (temp >= 30) {
    briefing += `기온이 ${temp}°C로 무더운 날씨를 보이고 있습니다. 야외 활동 시 온열 질환에 유의하시기 바랍니다. `
  } else if (temp <= 5) {
    briefing += `기온이 ${temp}°C로 매우 춥습니다. 외출 시 옷차림을 따뜻하게 하셔야 합니다. `
  } else if (temp > 5 && temp < 20) {
    briefing += `기온은 ${temp}°C로 다소 서늘한 편입니다. 외투를 챙기시는 것을 권장합니다. `
  } else {
    briefing += `기온은 ${temp}°C로 야외 활동하기에 아주 적합하고 쾌적한 상태입니다. `
  }

  const status = (c.status || '').toLowerCase()
  if (status.includes('비') || status.includes('rain')) {
    briefing += `현재 비가 내리고 있으므로 잊지 말고 우산을 챙기시길 바랍니다.`
  } else if (status.includes('눈') || status.includes('snow')) {
    briefing += `현재 눈이 내리고 있으니 빙판길 안전사고에 각별히 유의하세요.`
  } else if (status.includes('맑음') || status.includes('clear')) {
    briefing += `하늘이 맑아 바깥 나들이를 가기 좋은 훌륭한 날씨를 보이고 있습니다.`
  } else if (status.includes('구름') || status.includes('cloud')) {
    briefing += `현재 구름이 낀 다소 흐린 날씨를 띄고 있습니다.`
  } else {
    briefing += `기상 상태는 '${c.status}' 입니다.`
  }

  return briefing
})
</script>

<template>
  <div class="ai-briefing-wrapper local-briefing">
    <div class="ai-briefing-header">
      <span class="ai-icon">📍</span>
      <span class="ai-title">{{ city?.name }} 맞춤형 AI 날씨 분석</span>
      <span class="ai-badge">LOCAL</span>
    </div>
    <div class="ai-briefing-content">
      {{ summaryText }}
    </div>
  </div>
</template>

<style scoped>
.ai-briefing-wrapper {
  background: linear-gradient(135deg, #2b5876, #4e4376);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 10px 30px rgba(43, 88, 118, 0.25);
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
  top: 0; right: 0; bottom: 0; left: 0;
  background: url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.05)"/></svg>');
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
  font-size: 24px;
}

.ai-title {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #ffffff, #a8c0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ai-badge {
  background-color: #f39c12;
  color: white;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(243, 156, 18, 0.5);
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
</style>
