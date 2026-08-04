<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/hw4/BaseDashboardCard.vue'
import SearchBar from '@/components/hw4/SearchBar.vue'
import WeatherCard from '@/components/hw4/WeatherCard.vue'
import { matchKorean } from '@/utils/koreanSearch.js'

const route = useRoute()
const router = useRouter()

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchQuery = ref(route.query.q || '')
const sortOrder = ref('default')
const isSearching = ref(false)
const recentCities = ref([])

onMounted(() => {
  const historyData = localStorage.getItem('weather_history')
  if (historyData) {
    recentCities.value = JSON.parse(historyData)
  }
})

watch(searchQuery, (newVal) => {
  router.replace({ query: { ...route.query, q: newVal || undefined } })
})

const filteredWeatherList = computed(() => {
  let result = weatherList.value
  if (searchQuery.value) {
    result = result.filter(city => matchKorean(city.name, searchQuery.value))
  }
  if (sortOrder.value === 'desc') {
    result = [...result].sort((a, b) => b.temp - a.temp)
  } else if (sortOrder.value === 'asc') {
    result = [...result].sort((a, b) => a.temp - b.temp)
  }
  return result
})

const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}
</script>

<template>
  <div class="weather-container">
    <div class="main-layout">
      <!-- 사이드바: 최근 본 지역 및 검색 -->
      <aside class="sidebar">
        <div v-if="recentCities.length > 0" class="recent-history">
          <span class="history-label">🕒 최근 본 지역</span>
          <div class="tag-list">
            <el-tag 
              v-for="city in recentCities" 
              :key="city.id" 
              class="history-tag" 
              size="small" 
              effect="plain" 
              round
              @click="router.push(`/hw4/weather/${city.id}`)"
            >
              {{ city.name }}
            </el-tag>
          </div>
        </div>

        <BaseDashboardCard title="🔍 도시 검색">
          <SearchBar
            :search-query="searchQuery"
            @update-query="handleUpdateQuery"
            @is-searching="isSearching = $event"
          />
          
          <div class="sort-group">
            <el-radio-group v-model="sortOrder" size="small">
              <el-radio-button value="default">기본</el-radio-button>
              <el-radio-button value="desc">온도 높은 순</el-radio-button>
              <el-radio-button value="asc">온도 낮은 순</el-radio-button>
            </el-radio-group>
          </div>
        </BaseDashboardCard>
      </aside>

      <!-- 메인 콘텐츠 영역 -->
      <main class="main-content">
        <BaseDashboardCard :title="`🗺️ 지역별 날씨 현황`">
          <el-alert 
            v-if="filteredWeatherList.length === 0" 
            :title="isSearching ? '🔍 날씨 데이터를 검색 중입니다...' : '검색 결과가 없습니다.'" 
            :type="isSearching ? 'info' : 'warning'" 
            :closable="false" 
            show-icon
            class="no-result-alert"
          />
          <template v-else>
            <WeatherCard
              v-for="city in filteredWeatherList"
              :key="city.id"
              :city="city"
            />
          </template>
        </BaseDashboardCard>
      </main>
    </div>
  </div>
</template>

<style scoped>
.weather-container {
  max-width: 900px;
  margin: 0 auto;
}
.main-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100% !important;
  }
}
.sidebar {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.main-content {
  flex-grow: 1;
  max-width: 560px;
}
.recent-history {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border-top: 4px solid #95a5a6;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.history-label {
  font-size: 14px;
  color: #303133;
  font-weight: bold;
}
.history-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}
.history-tag:hover {
  transform: translateY(-2px);
  background-color: #ecf5ff;
}
.sort-group {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
  display: flex;
  justify-content: center;
}
.no-result-alert {
  margin-bottom: 20px;
}
</style>
