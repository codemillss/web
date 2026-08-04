<script setup>
import { ref } from 'vue'
import axios from 'axios'

const weatherData = ref(null)
const isLoading = ref(false)

const handleFetchWeather = async () => {
  isLoading.value = true
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'your_api_key_here'
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=35.158582&lon=126.804975&appid=${API_KEY}&units=metric&lang=kr`
  
  try {
    // 비동기 통신: 서버에서 데이터를 다 가져올 때까지 await로 기다린다.
    const response = await axios.get(URL)
    
    // fetch()는 응답 String을 Json으로 변환해야 하지만(.json()) Axios에서는 응답 String(response.data)가 자동으로 JSON 파싱 됨.
    console.log('Axios 통신 응답 전체 객체:', response)
    console.log('백엔드가 준 핵심 날씨 데이터(JSON):', response.data)
    
    weatherData.value = response.data
  } catch (error) {
    // 4xx, 5xx 에러나 네트워크 오프라인 시 자동으로 reject되어 catch 영역에서 처리 한다.
    console.error('통신 중 에러가 발생했습니다:', error)
    alert('데이터를 가져오지 못했습니다. API 키 활성화 여부나 주소를 확인하세요.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>⚡ Axios 통신 검증 (Weather API)</h2>
    
    <button @click="handleFetchWeather" :disabled="isLoading" class="fetch-btn">
      {{ isLoading ? '데이터 로딩 중...' : '실시간 날씨 데이터 당겨오기' }}
    </button>
    
    <div v-if="weatherData" class="result-card">
      <p>📍 위치: <strong>{{ weatherData.name }}</strong></p>
      <p>🌡️ 현재 기온: <strong>{{ weatherData.main.temp }}°C</strong> (정상 섭씨 변환 완료)</p>
      <p>☁️ 날씨 상태: <strong>{{ weatherData.weather[0].description }}</strong></p>
      <p>💧 습도: <strong>{{ weatherData.main.humidity }}%</strong></p>
    </div>
    
    <div v-else class="empty-state">
      데이터를 당겨오려면 버튼을 클릭하세요.
    </div>
  </div>
</template>

<style scoped>
.practice-section {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.fetch-btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 15px;
}

.fetch-btn:disabled {
  background-color: #a0d8c1;
  cursor: not-allowed;
}

.result-card {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #3498db;
  line-height: 1.8;
}

.empty-state {
  color: #888;
  font-style: italic;
  padding: 15px;
}
</style>
