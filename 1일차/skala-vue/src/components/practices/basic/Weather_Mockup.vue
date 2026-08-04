<script setup>
import { ref, computed } from 'vue'

import { matchKorean } from '@/utils/koreanSearch.js'
import { getWeatherTags } from '@/utils/weatherUtils'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('')

const filteredWeatherList = computed(() => {
  if (!searchQuery.value) return weatherList.value
  return weatherList.value.filter(city => matchKorean(city.name, searchQuery.value))
})

// [플러스 알파] 1. 새 도시 추가를 위한 양방향 바인딩 데이터
const newCityName = ref('')
const newCityTemp = ref(20)
const newCityStatus = ref('맑음')

const handleInput = (event) => {
  searchQuery.value = event.target.value
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const selectCity = (cityName) => {
  selectedCityInfo.value = `${cityName}이(가) 선택되었습니다.`
}

// [플러스 알파] 2. 배열(리스트)에 데이터 추가 및 삭제 메서드
const addCity = () => {
  if (!newCityName.value.trim()) {
    alert('도시 이름을 입력해주세요!')
    return
  }
  weatherList.value.push({
    id: `city_${Date.now()}`,
    name: newCityName.value,
    temp: newCityTemp.value,
    status: newCityStatus.value
  })
  newCityName.value = '' // 입력창 초기화
  newCityTemp.value = 20
}

const removeCity = (index, cityName) => {
  weatherList.value.splice(index, 1)
  if (selectedCityInfo.value.includes(cityName)) {
    selectedCityInfo.value = '' // 삭제된 도시가 선택되어 있었다면 상태 초기화
  }
}
</script>

<template>
  <div class="weather-container">
    <h2>⛅ 과제 1: 날씨 (Mockup + α)</h2>

    <!-- [플러스 알파] 새 도시 추가 폼 -->
    <div class="add-section">
      <h3>✨ 새로운 지역 추가하기</h3>
      <form class="add-form" @submit.prevent="addCity">
        <input type="text" v-model="newCityName" placeholder="도시명" required />
        <input type="number" v-model="newCityTemp" placeholder="온도" style="width: 70px;" />
        <select v-model="newCityStatus">
          <option value="맑음">맑음</option>
          <option value="비">비</option>
          <option value="구름">구름</option>
          <option value="눈">눈</option>
        </select>
        <button type="submit" class="add-btn">추가</button>
      </form>
    </div>

    <div class="search-section">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="handleInput"
        placeholder="검색할 도시 이름 입력"
        class="search-input"
      />
      <p class="search-result">검색 중인 도시: <strong>{{ searchQuery }}</strong></p>
    </div>

    <div class="weather-list-section">
      <h3>🗺️ 지역별 날씨 현황 (총 {{ weatherList.length }}건)</h3>

      <div v-if="filteredWeatherList.length === 0" class="empty-state">
        검색 결과가 없습니다.
      </div>

      <!-- [플러스 알파] 상태에 따른 동적 클래스 바인딩 (:class) -->
      <div
        v-for="(city, index) in filteredWeatherList"
        :key="city.id"
        class="weather-card"
        :class="{
          'card-sunny': city.status === '맑음',
          'card-rainy': city.status === '비',
          'card-cloudy': city.status === '구름',
          'card-snowy': city.status === '눈'
        }"
        @click="selectCity(city.name)"
      >
        <div class="card-header">
          <span class="city-name">{{ city.name }} ({{ city.status }})</span>
          <div class="card-actions">
            <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">
              상세보기
            </button>
            <!-- 삭제 버튼 이벤트 버블링 방지 (.stop) -->
            <button class="delete-btn" @click.stop="removeCity(index, city.name)">
              ✕
            </button>
          </div>
        </div>

        <div class="card-body">
          <p class="temp-text">현재 기온: {{ city.temp }}°C</p>

          <div class="tags-container">
            <span 
              v-for="(tag, i) in getWeatherTags(city)" 
              :key="i"
              :class="['badge', `badge-${tag.type}`]"
            >
              {{ tag.text }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="status-bar">
      <span v-if="selectedCityInfo" style="color: #2e7d32; font-weight: bold;">
        {{ selectedCityInfo }}
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
}

.search-section, .weather-list-section, .add-section {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eef2f5;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.add-form {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.add-form input, .add-form select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.search-result {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #888;
}

.weather-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.weather-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* [플러스 알파] 동적 테마 클래스 */
.card-sunny { background-color: #fffde7; border-color: #ffd54f; }
.card-rainy { background-color: #e3f2fd; border-color: #64b5f6; }
.card-cloudy { background-color: #f5f5f5; border-color: #e0e0e0; }
.card-snowy { background-color: #f3e5f5; border-color: #ba68c8; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.city-name {
  font-weight: bold;
}

.detail-btn {
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
}

.delete-btn {
  background-color: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
}

.delete-btn:hover {
  color: #c0392b;
}

.temp-text {
  margin: 4px 0 8px 0;
  font-size: 14px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 12px;
  color: white;
}

.badge-danger { background-color: #f56c6c; }
.badge-warning { background-color: #e6a23c; }
.badge-primary { background-color: #409eff; }
.badge-success { background-color: #67c23a; }
.badge-info { background-color: #909399; }

.status-bar {
  background-color: #e8f5e9;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.placeholder-text {
  color: #4caf50;
}
</style>
