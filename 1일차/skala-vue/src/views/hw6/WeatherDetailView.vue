<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useHw6FavoriteStore } from '@/stores/hw6FavoriteStore'
import { useHw6WeatherStore } from '@/stores/hw6WeatherStore'
import WeatherForecastChart from '@/components/hw6/WeatherForecastChart.vue'
import CitySmartBriefing from '@/components/hw6/CitySmartBriefing.vue'
import TravelRecommendation from '@/components/hw6/TravelRecommendation.vue'
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

  let found = weatherStore.weatherList.find(
    (c) =>
      c.id.toLowerCase() === paramId.toLowerCase() ||
      (c.queryName && c.queryName.toLowerCase() === paramId.toLowerCase()) ||
      c.name.includes(paramId),
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
    historyList = historyList.filter((item) => item.id !== found.id)
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
              <div class="temp-hero">
                <span class="temp-label">🔹 실시간 기온</span>
                <span class="temp-val"
                  >{{ displayTemp
                  }}<span class="temp-unit">{{ configStore.unitSymbol }}</span></span
                >
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-item-label">기상 현황</span>
                  <span class="info-item-value">{{ cleanWeatherDesc(cityInfo.status) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-item-label">상세 설명</span>
                  <span class="info-item-value">{{ cleanWeatherDesc(cityInfo.desc) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-item-label">💧 대기 습도</span>
                  <span class="info-item-value">{{ cityInfo.humidity }}</span>
                </div>
                <div class="info-item">
                  <span class="info-item-label">💨 현재 풍속</span>
                  <span class="info-item-value">{{ cityInfo.wind }}</span>
                </div>
              </div>
            </div>

            <div class="actions">
              <el-button color="#34495e" style="color: white" @click="router.push('/hw6')" round>
                ← 대시보드로 돌아가기
              </el-button>
              <el-button type="primary" plain @click="router.push('/hw6/forecast')" round>
                📅 주간 예보 보기
              </el-button>
              <el-button type="success" plain @click="router.push('/hw6/air-pollution')" round>
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
          <WeatherForecastChart
            v-else-if="forecastData"
            :forecastData="forecastData"
            class="chart-widget-full"
          />
        </div>

        <!-- 하단: 여행 추천 섹션 -->
        <TravelRecommendation :city="cityInfo" />
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.premium-detail-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08) !important;
  border: none;
  overflow: visible;
  padding: 24px;
}
.title-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 18px;
  border-bottom: 2px solid #f0f2f5;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.weather-icon {
  width: 52px;
  height: 52px;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.12));
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
.fav-icon:hover {
  transform: scale(1.15);
  filter: brightness(0.9);
}
.fav-icon.active {
  color: #f1c40f;
  text-shadow: 0 0 10px rgba(241, 196, 15, 0.4);
}

.top-detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-bottom: 32px;
}

.briefing-col,
.info-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.briefing-widget {
  margin-bottom: 0 !important;
  height: 100%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
}

/* 기온 히어로 섹션 */
.temp-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #e8f4fd, #f0f4ff);
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid rgba(52, 152, 219, 0.15);
}
.temp-label {
  font-size: 15px;
  font-weight: 700;
  color: #3498db;
}
.temp-val {
  font-size: 36px;
  font-weight: 800;
  color: #2c3e50;
  letter-spacing: -1px;
  line-height: 1;
}
.temp-unit {
  font-size: 20px;
  font-weight: 500;
  color: #7f8c8d;
}

.premium-info {
  background: linear-gradient(145deg, #ffffff, #f8f9fc);
  padding: 24px;
  border-radius: 14px;
  color: #4a4a4a;
  border: 1px solid #ebeef5;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  background: rgba(240, 242, 245, 0.6);
  border-radius: 10px;
  transition: background-color 0.2s;
}
.info-item:hover {
  background: rgba(52, 152, 219, 0.06);
}
.info-item-label {
  font-size: 12px;
  color: #909399;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.info-item-value {
  font-size: 15px;
  font-weight: 700;
  color: #2c3e50;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.actions .el-button {
  border-radius: 20px;
  font-weight: 600;
  padding: 10px 20px;
}

.bottom-chart-section {
  width: 100%;
  margin-top: 12px;
}

.chart-widget-full {
  width: 100%;
  background: white;
  border-radius: 14px;
  padding: 24px;
  border: 1px solid #ebeef5;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}
.chart-loading {
  padding: 40px;
  background: #f8f9fa;
  border-radius: 14px;
}
.skeleton-wrapper {
  background: white;
  padding: 40px;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

@media (max-width: 900px) {
  .top-detail-row {
    grid-template-columns: 1fr;
  }
  .detail-title {
    font-size: 20px;
  }
  .temp-val {
    font-size: 28px;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
