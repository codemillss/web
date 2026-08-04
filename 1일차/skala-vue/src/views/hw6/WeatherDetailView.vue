<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useHw6FavoriteStore } from '@/stores/hw6FavoriteStore'
import { useHw6WeatherStore } from '@/stores/hw6WeatherStore'
import WeatherForecastChart from '@/components/hw6/WeatherForecastChart.vue'
import CitySmartBriefing from '@/components/hw6/CitySmartBriefing.vue'
import { cleanWeatherDesc } from '@/utils/weatherUtils'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const favoriteStore = useHw6FavoriteStore()
const weatherStore = useHw6WeatherStore()

const cityInfo = ref(null)
const forecastData = ref(null)
const isChartLoading = ref(false)

onMounted(async () => {
  const paramId = route.params.cityId
  
  if (weatherStore.weatherList.length === 0) {
    await weatherStore.fetchWeather()
  }
  
  let found = weatherStore.weatherList.find(c => 
    c.id.toLowerCase() === paramId.toLowerCase() || 
    (c.queryName && c.queryName.toLowerCase() === paramId.toLowerCase()) ||
    c.name.includes(paramId)
  )

  // weatherList에 없더라도 직접 온디맨드로 단일 도시 정보 Fetch 시도
  if (!found) {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    if (apiKey) {
      try {
        found = await weatherStore.fetchSingleCityData(paramId, apiKey)
        if (found) {
          weatherStore.weatherList.push(found)
        }
      } catch (e) {
        console.warn('온디맨드 도시 데이터 로드 실패:', e)
      }
    }
  }
  
  if (found) {
    cityInfo.value = found
    
    // 차트용 데이터 호출
    isChartLoading.value = true
    try {
      forecastData.value = await weatherStore.fetchForecast(found.lat, found.lon, found.name)
    } catch (err) {
      console.error('Forecast fetch error:', err)
    } finally {
      isChartLoading.value = false
    }

    // 로컬 스토리지에 최근 본 지역 저장
    const historyData = localStorage.getItem('hw6_history')
    let historyList = historyData ? JSON.parse(historyData) : []
    
    // 중복 제거 후 맨 앞에 추가
    historyList = historyList.filter(item => item.id !== found.id)
    historyList.unshift({ id: found.id, name: found.name })
    
    // 최대 5개 유지
    if (historyList.length > 5) {
      historyList.pop()
    }
    
    localStorage.setItem('hw6_history', JSON.stringify(historyList))
  } else {
    alert('존재하지 않는 도시 정보입니다.')
    router.push('/hw6')
  }
})

// 단위 변환 연산 (Pinia Store)
const displayTemp = computed(() => {
  if (!cityInfo.value) return 0
  const rawTemp = cityInfo.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const toggleFav = () => {
  if (cityInfo.value) {
    favoriteStore.toggleFavorite(cityInfo.value)
  }
}
</script>

<template>
  <div class="detail-container">
    <div v-if="weatherStore.isLoading" class="skeleton-wrapper">
      <el-skeleton :rows="5" animated />
    </div>
    
    <div v-else-if="cityInfo" class="content-wrapper">
      <el-card class="detail-card premium-detail-card" shadow="always">
        <!-- 상단 헤더 -->
        <div class="title-header">
          <h3 class="detail-title">📍 {{ cityInfo.name }} 상세 기상 관측 정보</h3>
          <div class="header-right">
            <img v-if="cityInfo.icon" :src="cityInfo.icon" class="weather-icon" alt="날씨 아이콘" />
            <span 
              class="fav-icon" 
              :class="{ active: favoriteStore.isFavorite(cityInfo.id) }"
              @click="toggleFav"
              title="즐겨찾기 토글"
            >
              {{ favoriteStore.isFavorite(cityInfo.id) ? '⭐' : '☆' }}
            </span>
          </div>
        </div>
      
        <!-- 상단 2열: 맞춤형 AI 요약 + 실시간 상세 기상 수치 -->
        <div class="top-detail-row">
          <div class="briefing-col">
            <CitySmartBriefing :city="cityInfo" class="briefing-widget" />
          </div>
          
          <div class="info-col">
            <div class="info-content premium-info">
              <p class="highlight">🔹 실시간 기온: <span class="temp-val">{{ displayTemp }}{{ configStore.unitSymbol }}</span></p>
              <p><strong>기상 현황:</strong> {{ cleanWeatherDesc(cityInfo.status) }}</p>
              <p><strong>상세 설명:</strong> {{ cleanWeatherDesc(cityInfo.desc) }}</p>
              <p><strong>대기 습도:</strong> {{ cityInfo.humidity }}</p>
              <p><strong>현재 풍속:</strong> {{ cityInfo.wind }}</p>
            </div>
            
            <div class="actions">
              <el-button color="#34495e" style="color: white;" @click="router.push('/hw6')">
                ← 대시보드로 돌아가기
              </el-button>
              <el-button type="primary" plain @click="router.push('/hw6/forecast')">
                📅 주간 예보 보기
              </el-button>
              <el-button type="success" plain @click="router.push('/hw6/air-pollution')">
                😷 미세먼지 현황
              </el-button>
            </div>
          </div>
        </div>

        <!-- 하단: 100% full-width 시분초/주간 날씨 흐름 차트 (와이드 배치) -->
        <div class="bottom-chart-section">
          <div v-if="isChartLoading" class="chart-loading">
            <el-skeleton :rows="8" animated />
          </div>
          <WeatherForecastChart v-else-if="forecastData" :forecastData="forecastData" class="chart-widget-full" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}
.premium-detail-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
  border: none;
  overflow: visible;
  padding: 10px;
}
.title-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.weather-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}
.detail-title {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #1a1c29;
}
.fav-icon {
  cursor: pointer;
  font-size: 28px;
  color: #dcdfe6;
  transition: all 0.2s;
  user-select: none;
}
.fav-icon:hover { transform: scale(1.15); filter: brightness(0.9); }
.fav-icon.active { color: #f1c40f; text-shadow: 0 0 10px rgba(241,196,15,0.4); }

.top-detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}
@media (max-width: 900px) {
  .top-detail-row {
    grid-template-columns: 1fr;
  }
}

.briefing-col, .info-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.briefing-widget {
  margin-bottom: 0 !important;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.premium-info {
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
  padding: 24px;
  border-radius: 12px;
  line-height: 1.8;
  color: #4a4a4a;
  border: 1px solid #ebeef5;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.premium-info p {
  margin: 0 0 10px 0;
  font-size: 15px;
}
.premium-info p:last-child {
  margin-bottom: 0;
}
.highlight {
  color: #e74c3c;
  font-weight: 800;
  font-size: 18px !important;
  margin-bottom: 16px !important;
  display: flex;
  align-items: center;
  gap: 8px;
}
.temp-val {
  font-size: 24px;
  color: #2c3e50;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.actions .el-button {
  border-radius: 8px;
  font-weight: 600;
}

.bottom-chart-section {
  width: 100%;
  margin-top: 10px;
}

.chart-widget-full {
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #ebeef5;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.chart-loading {
  padding: 40px;
  background: #f8f9fa;
  border-radius: 12px;
}
.skeleton-wrapper {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
</style>
