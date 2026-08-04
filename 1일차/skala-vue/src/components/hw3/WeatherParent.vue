<script setup>
import { ref, computed } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

import { matchKorean } from '@/utils/koreanSearch.js'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('')
const isSearching = ref(false)

const filteredWeatherList = computed(() => {
  let result = weatherList.value
  if (searchQuery.value) {
    result = result.filter(city => matchKorean(city.name, searchQuery.value))
  }
  return result
})

const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

const handleSelectCard = (cityName) => {
  selectedCityInfo.value = cityName
}

const handleDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="weather-container">
    <h2>⛅ 과제 3: 날씨 (컴포넌트 분리 완성)</h2>

    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar
        :search-query="searchQuery"
        @update-query="handleUpdateQuery"
        @is-searching="isSearching = $event"
      />
    </BaseDashboardCard>

    <BaseDashboardCard :title="`🗺️ 지역별 날씨 현황`">
      <el-alert 
        v-if="filteredWeatherList.length === 0" 
        :title="isSearching ? '🔍 날씨 데이터를 검색 중입니다...' : '검색 결과가 일치하는 도시가 없습니다.'" 
        :type="isSearching ? 'info' : 'warning'" 
        :closable="false" 
        show-icon
        class="no-result-alert"
      />

      <!-- 3. 검색 결과 렌더링 -->
      <template v-else>
        <WeatherCard
          v-for="city in filteredWeatherList"
          :key="city.id"
          :city="city"
          @select-card="handleSelectCard"
          @click-detail="handleDetail"
        />
      </template>
    </BaseDashboardCard>

    <div class="status-bar">
      <el-alert
        v-if="selectedCityInfo"
        :title="`${selectedCityInfo}이(가) 선택되었습니다.`"
        type="success"
        :closable="false"
        show-icon
      />
      <el-alert
        v-else
        title="카드를 클릭하거나 검색해 보세요."
        type="info"
        :closable="false"
        show-icon
      />
    </div>
  </div>
</template>

<style scoped>
.weather-container {
  max-width: 520px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9fbfd;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  font-family: 'Pretendard', sans-serif;
}
.no-result-alert {
  margin-bottom: 20px;
}
.status-bar {
  margin-top: 20px;
}
</style>
