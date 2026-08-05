<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/hw6/BaseDashboardCard.vue'
import SearchBar from '@/components/hw6/SearchBar.vue'
import WeatherCard from '@/components/hw6/WeatherCard.vue'
import InteractiveGlobe from '@/components/hw6/InteractiveGlobe.vue'
import AISmartBriefing from '@/components/hw6/AISmartBriefing.vue'
import { matchKorean } from '@/utils/koreanSearch.js'
import { useHw6FavoriteStore } from '@/stores/hw6FavoriteStore'
import { useHw6WeatherStore } from '@/stores/hw6WeatherStore'

import { getKoreanCityName } from '@/utils/weatherUtils'

const route = useRoute()
const router = useRouter()
const favoriteStore = useHw6FavoriteStore()
const weatherStore = useHw6WeatherStore()

// ref to interact with globe component
const globeRef = ref(null)

// 대륙별 도시 분류 (국적/위치 기반) - 각 3~4개씩
const continentCityMap = {
  대한민국: [
    'Seoul',
    'Suwon',
    'Busan',
    'Jeju',
    'Ulleungdo',
    'Dokdo',
    'Incheon',
    'Daegu',
    'Daejeon',
  ],
  아시아: [
    'Tokyo',
    'Osaka',
    'Beijing',
    'Bangkok',
    'Shanghai',
    'Hanoi',
    'Almaty',
    'Delhi',
    'Mumbai',
    'Kuala Lumpur',
    'Chiang Mai',
    'Seoul',
    'Suwon',
    'Busan',
    'Jeju',
    'Ulleungdo',
    'Dokdo',
  ],
  유럽: [
    'London',
    'Paris',
    'Berlin',
    'Rome,IT',
    'Amsterdam',
    'Madrid',
    'Vienna',
    'Prague',
    'Sofia',
    'Budapest',
  ],
  북미: ['New York', 'Los Angeles', 'Chicago', 'Toronto', 'Vancouver', 'Houston', 'San Francisco'],
  남미: ['Sao Paulo', 'Buenos Aires', 'Lima', 'Bogota', 'Medellin', 'Santiago'],
  아프리카: ['Cairo', 'Lagos', 'Nairobi', 'Johannesburg', 'Cape Town', 'Kampala', 'Luanda'],
  오세아니아: ['Sydney', 'Melbourne,AU', 'Auckland', 'Brisbane'],
}

const activeContinent = ref(null)

// 대륙별 및 주요 지역 포커싱 좌표 사전
const presetLocations = [
  {
    name: '🇰🇷 대한민국',
    lat: 36.0,
    lng: 127.5,
    altitude: 0.15,
    type: 'primary',
    continent: '대한민국',
  },
  { name: '🌏 아시아', lat: 34.0, lng: 100.0, altitude: 1.5, type: 'warning', continent: '아시아' },
  { name: '🏰 유럽', lat: 54.0, lng: 15.0, altitude: 1.2, type: 'danger', continent: '유럽' },
  { name: '🗽 북미', lat: 40.0, lng: -100.0, altitude: 1.5, type: 'success', continent: '북미' },
  { name: '💃 남미', lat: -15.0, lng: -60.0, altitude: 1.5, type: 'warning', continent: '남미' },
  {
    name: '🦁 아프리카',
    lat: 0.0,
    lng: 20.0,
    altitude: 1.5,
    type: 'danger',
    continent: '아프리카',
  },
  {
    name: '🦘 오세아니아',
    lat: -25.0,
    lng: 135.0,
    altitude: 1.5,
    type: 'primary',
    continent: '오세아니아',
  },
]

const focusPreset = (location) => {
  if (globeRef.value && globeRef.value.focusOnLocation) {
    globeRef.value.focusOnLocation(location.lat, location.lng, location.altitude)
  }
  activeContinent.value = location.continent || null
}

// 지구 전체 한눈에 보기
const resetGlobe = () => {
  if (globeRef.value && globeRef.value.focusOnLocation) {
    globeRef.value.focusOnLocation(30.0, 125.0, 2.5)
  }
  activeContinent.value = null
}

// 브라우저 Geolocation API 기반 내 위치 초근접 보기
const focusMyLocation = () => {
  if (!globeRef.value || !globeRef.value.focusOnLocation) return
  if (!navigator.geolocation) {
    alert('현재 브라우저에서 위치 정보를 지원하지 않습니다.')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      globeRef.value.focusOnLocation(latitude, longitude, 0.15)
    },
    (err) => {
      console.error(err)
      alert('위치 정보를 가져올 수 없습니다. 브라우저 위치 권한을 확인해주세요.')
    },
  )
}

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

const myLocationWeather = ref(null)
const myLocationLoading = ref(false)

const debugState = ref({
  mountedStarted: false,
  fetchWeatherCalled: false,
  fetchWeatherFinished: false,
  errorThrown: null,
})

onMounted(async () => {
  debugState.value.mountedStarted = true
  const historyData = localStorage.getItem('hw6_history')
  if (historyData) {
    try {
      const rawList = JSON.parse(historyData)
      const map = new Map()
      rawList.forEach((item) => {
        if (item && (item.id || item.name)) {
          const cleanId = (item.id || item.name).toString().replace(/-si$/i, '')
          const cleanName =
            getKoreanCityName(cleanId) ||
            getKoreanCityName(item.name) ||
            item.name.replace(/(특별|광역|특례)?시$/, '')
          map.set(cleanName, { id: cleanId, name: cleanName })
        }
      })
      recentCities.value = Array.from(map.values())
      localStorage.setItem('hw6_history', JSON.stringify(recentCities.value))
    } catch (e) {
      recentCities.value = []
    }
  }

  // 접속 시 내 위치 자동 감지 후 날씨 로드
  if (navigator.geolocation) {
    myLocationLoading.value = true
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
          if (apiKey) {
            const axios = (await import('axios')).default
            const res = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=kr`,
            )
            const d = res.data
            // 2. 역지오코딩으로 정확한 한글 동네/도시 이름 가져오기
            let localKoreanName = ''
            try {
              const geoRes = await axios.get(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`,
              )
              if (geoRes.data && geoRes.data.length > 0) {
                const localNames = geoRes.data[0].local_names
                if (localNames && localNames.ko) {
                  localKoreanName = localNames.ko
                }
              }
            } catch (e) {
              console.warn('역지오코딩 실패', e)
            }

            myLocationWeather.value = {
              name: d.name,
              koreanName: localKoreanName || getKoreanCityName(d.name) || d.name,
              temp: Math.round(d.main.temp * 10) / 10,
              feels_like: Math.round(d.main.feels_like),
              humidity: d.main.humidity,
              wind: d.wind.speed,
              status: d.weather[0].description,
              icon: `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`,
              lat: latitude,
              lon: longitude,
            }
            // 지구본을 내 위치로 포커싱
            if (globeRef.value?.focusOnLocation) {
              globeRef.value.focusOnLocation(latitude, longitude, 0.8)
            }
          }
        } catch (e) {
          console.warn('내 위치 날씨 로드 실패:', e)
        } finally {
          myLocationLoading.value = false
        }
      },
      () => {
        myLocationLoading.value = false
      },
      { timeout: 5000 },
    )
  }

  try {
    debugState.value.fetchWeatherCalled = true
    await weatherStore.fetchWeather()
    debugState.value.fetchWeatherFinished = true
  } catch (err) {
    debugState.value.errorThrown = err.message
  }
})

watch(searchQuery, (newVal) => {
  router.replace({ query: { ...route.query, q: newVal || undefined } })
})

const filteredWeatherList = computed(() => {
  let result = weatherStore.weatherList

  // 대륙 필터링 (대륙 버튼 클릭 시)
  if (activeContinent.value && continentCityMap[activeContinent.value]) {
    const continentCities = continentCityMap[activeContinent.value].map((c) =>
      c.toLowerCase().replace(/-si$/i, ''),
    )
    result = result.filter((city) => {
      const cityId = (city.id || '')
        .toString()
        .toLowerCase()
        .replace(/-si$/i, '')
        .replace(/\s/g, '-')
      const cityIdSpace = (city.id || '').toString().toLowerCase().replace(/-si$/i, '')
      const cityQueryName = (city.queryName || '').toString().toLowerCase().replace(/-si$/i, '')
      return continentCities.some((cc) => {
        const ccNorm = cc.replace(/\s/g, '-')
        return (
          cityId === ccNorm ||
          cityIdSpace === cc ||
          cityQueryName === cc ||
          cityQueryName === ccNorm
        )
      })
    })
  }

  if (searchQuery.value) {
    result = result.filter((city) => matchKorean(city.name, searchQuery.value))
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
    <div class="globe-layout">
      <div class="globe-section">
        <InteractiveGlobe :weatherList="weatherStore.weatherList" ref="globeRef" />
        <div class="globe-action-buttons">
          <el-button
            v-for="loc in presetLocations"
            :key="loc.name"
            :type="activeContinent === loc.continent ? loc.type : 'default'"
            size="small"
            round
            :class="{ 'active-continent-btn': activeContinent === loc.continent }"
            @click="focusPreset(loc)"
          >
            {{ loc.name }}
          </el-button>
          <el-button type="info" size="small" round @click="resetGlobe"> 🌍 전체 </el-button>
        </div>
      </div>
      <div class="globe-side-briefing">
        <AISmartBriefing
          :weatherList="weatherStore.weatherList"
          style="height: 100%; margin-bottom: 0"
        />
      </div>
    </div>

    <div class="main-layout">
      <!-- 사이드바: 모든 컨트롤(내 위치, 즐겨찾기, 추가, 검색) -->
      <aside class="sidebar">
        <!-- 📍 내 위치 날씨 (컴팩트 세로형) -->
        <div v-if="myLocationLoading" class="widget-box location-loading-box">
          <el-skeleton :rows="3" animated />
        </div>
        <div v-else-if="myLocationWeather" class="widget-box my-location-box">
          <div class="loc-top">
            <span class="loc-pin">📍</span>
            <span class="loc-label">내 현재 위치</span>
            <img :src="myLocationWeather.icon" class="loc-icon" alt="날씨" />
          </div>
          <div class="loc-city">{{ myLocationWeather.koreanName || myLocationWeather.name }}</div>
          <div class="loc-temp">{{ myLocationWeather.temp }}<span class="loc-unit">°C</span></div>
          <div class="loc-status">{{ myLocationWeather.status }}</div>
          <div class="loc-details">
            <div class="loc-detail-item"><span>💧</span>{{ myLocationWeather.humidity }}%</div>
            <div class="loc-detail-item"><span>💨</span>{{ myLocationWeather.wind }}m/s</div>
          </div>
        </div>
        <div class="status-widgets">
          <!-- ⭐ 즐겨찾기 -->
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
                @click="router.push(`/hw6/weather/${city.id}`)"
              >
                {{ city.name }}
              </el-tag>
            </div>
          </div>

          <!-- 🕒 최근 본 지역 (검색 기록) -->
          <div class="widget-box recent-box">
            <span class="widget-label">🕒 검색 기록 (최근 본 지역)</span>
            <div v-if="recentCities.length > 0" class="tag-list">
              <el-tag
                v-for="city in recentCities"
                :key="city.id"
                class="widget-tag"
                size="small"
                effect="plain"
                round
                @click="router.push(`/hw6/weather/${city.id}`)"
              >
                {{ city.name }}
              </el-tag>
            </div>
            <div v-else style="font-size: 13px; color: #888; margin-top: 10px">
              검색 기록이 없습니다.
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
      </aside>

      <!-- 메인 콘텐츠 영역 (결과만 표시) -->
      <main class="main-content">
        <!-- 지역별 날씨 현황 & 대시보드 내 검색 (세트 구성) -->
        <BaseDashboardCard title="🗺️ 지역별 날씨 현황" class="mb-card main-weather-card">
          <!-- 검색 및 정렬 영역 -->
          <div class="search-sort-section">
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
          </div>

          <div class="divider"></div>

          <!-- 리스트 상태 표시 -->
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

          <!-- 내부 스크롤 컨테이너 -->
          <div v-else class="weather-scroll-container">
            <WeatherCard v-for="city in filteredWeatherList" :key="city.id" :city="city" />
          </div>
        </BaseDashboardCard>
      </main>
    </div>
  </div>
</template>

<style scoped>
.weather-container {
  max-width: 1400px;
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
  min-width: 0;
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
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.03);
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
  display: flex;
  justify-content: center;
}
.search-sort-section {
  padding-bottom: 5px;
}
.divider {
  height: 1px;
  background-color: #ebeef5;
  margin: 15px 0;
}
.no-result-alert {
  margin-bottom: 20px;
}
.globe-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: stretch;
  margin-bottom: 20px;
}
.globe-section {
  position: relative;
  min-width: 0;
}
.globe-side-briefing {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
@media (max-width: 900px) {
  .globe-layout {
    flex-direction: column;
  }
}
.globe-action-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: -8px;
  margin-bottom: 20px;
}
.skeleton-wrapper {
  padding: 10px;
}

/* 검색 + 정렬 인라인 바 */
.search-sort-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  background: white;
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.search-bar-inline {
  flex: 1;
  min-width: 0;
}
.sort-radio {
  flex-shrink: 0;
}

.region-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}
.continent-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.continent-badge .el-button {
  color: rgba(255, 255, 255, 0.85) !important;
  font-size: 11px;
  padding: 0;
  height: auto;
}
.continent-badge .el-button:hover {
  color: white !important;
}

/* 날씨 카드 내부 스크롤 (레이아웃 점프 방지 및 프리미엄 그리드) */
.weather-scroll-container {
  min-height: 520px;
  max-height: 650px;
  overflow-y: auto;
  padding-right: 8px;
  padding-bottom: 20px;
  scrollbar-width: thin;
  scrollbar-color: #dcdfe6 transparent;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  align-content: start;
  align-items: stretch;
}
.weather-scroll-container::-webkit-scrollbar {
  width: 6px;
}
.weather-scroll-container::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 4px;
}

/* 내 위치 날씨 (컴팩트 세로형) */
.my-location-box {
  background: linear-gradient(135deg, #1e1e2f 0%, #2a2a40 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  gap: 8px;
  padding: 18px;
  position: relative;
  overflow: hidden;
}
.my-location-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #f39c12, #e74c3c);
}
.location-loading-box {
  padding: 14px;
}
.loc-top {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}
.loc-pin {
  font-size: 14px;
}
.loc-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5px;
  flex: 1;
}
.loc-icon {
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.35));
}
.loc-city {
  font-size: 16px;
  font-weight: 700;
  color: white;
}
.loc-temp {
  font-size: 40px;
  font-weight: 800;
  color: white;
  letter-spacing: -2px;
  line-height: 1.1;
}
.loc-unit {
  font-size: 20px;
  font-weight: 400;
  opacity: 0.8;
}
.loc-status {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}
.loc-details {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}
.loc-detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}

/* 도시 추가 인라인 바 */
.add-city-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.add-city-label {
  font-size: 14px;
  flex-shrink: 0;
}
.add-city-input {
  flex: 1;
}

/* 도시 수 뱃지 */
.city-count-badge {
  font-size: 12px;
  color: #909399;
  background: #f4f4f5;
  padding: 2px 8px;
  border-radius: 12px;
}

/* 활성 대륙 버튼 강조 */
.active-continent-btn {
  box-shadow: 0 0 0 2px currentColor;
  font-weight: bold;
}
</style>
