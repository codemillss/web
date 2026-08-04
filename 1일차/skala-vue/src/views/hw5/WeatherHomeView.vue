<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/hw5/BaseDashboardCard.vue'
import SearchBar from '@/components/hw5/SearchBar.vue'
import WeatherCard from '@/components/hw5/WeatherCard.vue'
import { matchKorean } from '@/utils/koreanSearch.js'
import { useHw5FavoriteStore } from '@/stores/hw5FavoriteStore'
import { useHw5WeatherStore } from '@/stores/hw5WeatherStore'

import { getKoreanCityName } from '@/utils/weatherUtils'

const route = useRoute()
const router = useRouter()
const favoriteStore = useHw5FavoriteStore()
const weatherStore = useHw5WeatherStore()

const searchQuery = ref(route.query.q || '')
const sortOrder = ref('default')
const isSearching = ref(false)
const recentCities = ref([])
const newCityName = ref('')

const handleAddCity = async () => {
  if (!newCityName.value.trim()) return
  await weatherStore.addCity(newCityName.value)
  newCityName.value = ''
}

onMounted(async () => {
  const historyData = localStorage.getItem('hw5_history')
  if (historyData) {
    try {
      const rawList = JSON.parse(historyData)
      const map = new Map()
      rawList.forEach(item => {
        if (item && (item.id || item.name)) {
          const cleanId = (item.id || item.name).toString().replace(/-si$/i, '')
          const cleanName = getKoreanCityName(cleanId) || getKoreanCityName(item.name) || item.name.replace(/시$/, '')
          map.set(cleanName, { id: cleanId, name: cleanName })
        }
      })
      recentCities.value = Array.from(map.values())
      localStorage.setItem('hw5_history', JSON.stringify(recentCities.value))
    } catch (e) {
      recentCities.value = []
    }
  }
  
  // API Fetch
  await weatherStore.fetchWeather()
})

watch(searchQuery, (newVal) => {
  router.replace({ query: { ...route.query, q: newVal || undefined } })
})

const filteredWeatherList = computed(() => {
  let result = weatherStore.weatherList
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
      <!-- 사이드바: 모든 컨트롤(추가, 검색, 즐겨찾기, 최근 본 지역) -->
      <aside class="sidebar">
        
        <div class="status-widgets">
          <!-- 즐겨찾기 스토어 전역 관리 목록 -->
          <div v-if="favoriteStore.favorites.length > 0" class="widget-box favorite-box">
            <span class="widget-label">⭐ 내 즐겨찾기</span>
            <div class="tag-list">
              <el-tag 
                v-for="city in favoriteStore.favorites" 
                :key="city.id" 
                class="widget-tag" 
                type="warning"
                effect="light"
                round
                @click="router.push(`/hw5/weather/${city.id}`)"
              >
                {{ city.name }}
              </el-tag>
            </div>
          </div>

          <!-- 로컬스토리지 기반 최근 본 지역 -->
          <div v-if="recentCities.length > 0" class="widget-box recent-box">
            <span class="widget-label">🕒 최근 본 지역</span>
            <div class="tag-list">
              <el-tag 
                v-for="city in recentCities" 
                :key="city.id" 
                class="widget-tag" 
                size="small" 
                effect="plain" 
                round
                @click="router.push(`/hw5/weather/${city.id}`)"
              >
                {{ city.name }}
              </el-tag>
            </div>
          </div>
        </div>

        <BaseDashboardCard title="➕ 새로운 도시 추가 (API 연동)" class="mb-card">
          <div class="add-city-group">
            <el-input
              v-model="newCityName"
              placeholder="도시 영문명 (예: osaka, beijing)"
              @keyup.enter="handleAddCity"
              clearable
            >
              <template #append>
                <el-button @click="handleAddCity" :loading="weatherStore.isAdding">
                  추가
                </el-button>
              </template>
            </el-input>
          </div>
        </BaseDashboardCard>

        <BaseDashboardCard title="🔍 대시보드 내 도시 검색" class="mb-card">
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

      <!-- 메인 콘텐츠 영역 (결과만 표시) -->
      <main class="main-content">
        <BaseDashboardCard :title="`🗺️ 지역별 날씨 현황`">
          <div v-if="weatherStore.isLoading" class="skeleton-wrapper">
            <el-skeleton :rows="3" animated />
            <br />
            <el-skeleton :rows="3" animated />
          </div>
          
          <el-alert 
            v-else-if="weatherStore.error" 
            :title="weatherStore.error" 
            type="error" 
            show-icon
            class="no-result-alert"
          />

          <el-alert 
            v-else-if="filteredWeatherList.length === 0" 
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
.mb-card {
  margin-bottom: 15px;
}
.status-widgets {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.widget-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.favorite-box {
  border-top: 4px solid #f39c12;
}
.recent-box {
  border-top: 4px solid #95a5a6;
}
.widget-label {
  font-size: 14px;
  color: #303133;
  font-weight: bold;
}
.widget-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}
.widget-tag:hover {
  transform: translateY(-2px);
  filter: brightness(0.95);
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
.skeleton-wrapper {
  padding: 10px;
}
</style>
