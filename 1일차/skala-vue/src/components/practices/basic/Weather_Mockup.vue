<script setup>
import { ref, computed } from 'vue'

// 1. 임의의 날씨 데이터 배열
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// 검색 입력 및 선택된 도시 변수
const searchCity = ref('')
const selectedCity = ref('')

// 2. 검색어에 따라 날씨 카드 목록 필터링 (computed)
const filteredWeatherList = computed(() => {
  if (!searchCity.value) return weatherList.value
  return weatherList.value.filter(city => city.name.includes(searchCity.value))
})

// 3. 한글 처리를 위한 input 핸들러
const handleInput = (event) => {
  searchCity.value = event.target.value
}

// 4. 상세보기 alert 함수
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 카드를 누를 때 도시 선택 함수
const selectCity = (cityName) => {
  selectedCity.value = cityName
}
</script>

<template>
  <div class="weather-container">
    <h2>⛅ 과제 1: 날씨 (Mockup)</h2>

    <!-- 3. 양방향 바인딩 및 한글 처리 (:value, @input) -->
    <div class="search-section">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="searchCity"
        @input="handleInput"
        placeholder="검색할 도시 이름 입력"
        class="search-input"
      />
      <p class="search-result">검색 중인 도시: <strong>{{ searchCity }}</strong></p>
    </div>

    <!-- 1. 배열 렌더링 (v-for) -->
    <div class="weather-list-section">
      <h3>🗺️ 지역별 날씨 현황</h3>

      <div
        v-for="city in filteredWeatherList"
        :key="city.id"
        class="weather-card"
        @click="selectCity(city.name)"
      >
        <div class="card-header">
          <span class="city-name">{{ city.name }} ({{ city.status }})</span>
          <!-- 4. 이벤트 버블링 방지 (@click.stop) -->
          <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">
            상세보기
          </button>
        </div>

        <div class="card-body">
          <p class="temp-text">현재 기온: {{ city.temp }}°C</p>

          <!-- 2. 조건부 렌더링 (v-if) -->
          <span v-if="city.temp >= 25" class="badge badge-hot">
            ♨️ 더움 (25도 이상)
          </span>
          <span v-else class="badge badge-cool">
            ❄️ 선선함 (25도 미만)
          </span>
        </div>
      </div>
    </div>

    <!-- 4. 카드 선택 상태바 -->
    <div class="status-bar">
      <span v-if="selectedCity">
        <strong>{{ selectedCity }}</strong>이(가) 선택되었습니다.
      </span>
      <span v-else class="placeholder-text">
        카드를 클릭하거나 검색해 보세요.
      </span>
    </div>
  </div>
</template>

<style scoped>
.weather-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9fbfd;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  font-family: sans-serif;
}

.search-section {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eef2f5;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.search-result {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.weather-list-section {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eef2f5;
  margin-bottom: 20px;
}

.weather-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #ffffff;
}

.weather-card:hover {
  border-color: #42b883;
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.city-name {
  font-weight: bold;
  font-size: 16px;
}

.detail-btn {
  padding: 4px 10px;
  font-size: 12px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.detail-btn:hover {
  background-color: #f0f0f0;
}

.temp-text {
  margin: 4px 0 8px 0;
  font-size: 14px;
  color: #444;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 12px;
  color: white;
}

.badge-hot {
  background-color: #ff5252;
}

.badge-cool {
  background-color: #2196f3;
}

.status-bar {
  background-color: #e8f5e9;
  color: #2e7d32;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.placeholder-text {
  color: #4caf50;
}
</style>