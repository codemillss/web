<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

// 가상의 전체 도시 데이터베이스 (MOCK DB)
const MOCK_DB = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: '55%', wind: '2.5m/s', desc: '화창한 날씨입니다.' },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: '80%', wind: '4.1m/s', desc: '우산 챙기세요!' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: '65%', wind: '3.8m/s', desc: '흐리지만 선선합니다.' },
]

const cityInfo = ref(null)

onMounted(() => {
  const paramId = route.params.cityId
  const found = MOCK_DB.find(c => c.id === paramId)
  
  if (found) {
    cityInfo.value = found
    
    // 로컬 스토리지에 최근 본 지역 저장
    const historyData = localStorage.getItem('weather_history')
    let historyList = historyData ? JSON.parse(historyData) : []
    
    // 중복 제거 후 맨 앞에 추가
    historyList = historyList.filter(item => item.id !== found.id)
    historyList.unshift({ id: found.id, name: found.name })
    
    // 최대 5개 유지
    if (historyList.length > 5) {
      historyList.pop()
    }
    
    localStorage.setItem('weather_history', JSON.stringify(historyList))
  } else {
    // 가드에서 차단하므로 사실상 호출되지 않음
    alert('존재하지 않는 도시 정보입니다.')
    router.push('/hw4')
  }
})
</script>

<template>
  <div class="detail-container">
    <el-card v-if="cityInfo" class="detail-card" shadow="always">
      <h3 class="detail-title">📍 지역별 상세 기상 관측 정보</h3>
      
      <div class="info-content">
        <p class="highlight">🔹 지정 지역: 대한민국 {{ cityInfo.name }}특별시</p>
        <p>실시간 기온: {{ cityInfo.temp }}°C</p>
        <p>기상 현황: {{ cityInfo.status }}</p>
        <p>대기 습도: {{ cityInfo.humidity }}</p>
        <p>현재 풍속: {{ cityInfo.wind }}</p>
      </div>
      
      <div class="actions">
        <el-button color="#34495e" style="color: white;" @click="router.push('/hw4')">
          ← 메인 대시보드로 돌아가기
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 520px;
  margin: 0 auto;
}
.detail-card {
  border-radius: 8px;
}
.detail-title {
  margin-top: 0;
  margin-bottom: 20px;
  color: #303133;
}
.info-content {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 20px;
}
.info-content p {
  margin: 0;
}
.highlight {
  color: #e74c3c;
  font-weight: bold;
  margin-bottom: 10px !important;
}
.actions {
  text-align: left;
}
</style>
