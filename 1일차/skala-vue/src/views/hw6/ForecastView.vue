<script setup>
import { ref, onMounted, watch } from 'vue'
import { useHw6WeatherStore } from '@/stores/hw6WeatherStore'
import BaseDashboardCard from '@/components/hw6/BaseDashboardCard.vue'
import { ElMessage } from 'element-plus'
import { getKoreanCityName } from '@/utils/weatherUtils'

const weatherStore = useHw6WeatherStore()

const selectedCityId = ref('')
const forecastData = ref(null)
const isLoading = ref(false)

// 스토어에 도시 목록이 없으면 먼저 불러오기 시도
onMounted(async () => {
  if (weatherStore.weatherList.length === 0) {
    await weatherStore.fetchWeather()
  }

  // 기본 선택: 최근 본 도시(hw6_history)가 있으면 그것으로, 없으면 첫 번째 도시
  if (weatherStore.weatherList.length > 0) {
    let defaultId = weatherStore.weatherList[0].id
    try {
      const historyData = localStorage.getItem('hw6_history')
      if (historyData) {
        const historyList = JSON.parse(historyData)
        if (historyList.length > 0) {
          const recentId = historyList[0].id
          const found = weatherStore.weatherList.find((c) => c.id === recentId)
          if (found) defaultId = found.id
        }
      }
    } catch (e) {}
    selectedCityId.value = defaultId
  }
})

// 도시가 선택되면 5-Day API 호출
watch(selectedCityId, async (newId) => {
  if (!newId) return

  const targetCity = weatherStore.weatherList.find((c) => c.id === newId)
  if (!targetCity || !targetCity.lat || !targetCity.lon) {
    ElMessage.warning('해당 도시의 좌표 정보를 찾을 수 없습니다.')
    return
  }

  isLoading.value = true
  forecastData.value = null
  try {
    const data = await weatherStore.fetchForecast(targetCity.lat, targetCity.lon, targetCity.name)
    // 3시간 간격 데이터(40개)를 날짜별로 그룹화
    const grouped = {}
    data.list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0]
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(item)
    })

    forecastData.value = {
      city: data.city,
      cityName: targetCity.name || getKoreanCityName(data.city.name) || data.city.name,
      daily: grouped,
    }
  } catch (err) {
    ElMessage.error('주간 예보 데이터를 불러오는 데 실패했습니다.')
    console.error(err)
  } finally {
    isLoading.value = false
  }
})

// 요일 변환기
const getDayName = (dateStr) => {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return days[new Date(dateStr).getDay()]
}
</script>

<template>
  <div class="forecast-container">
    <BaseDashboardCard title="📅 5일 주간 날씨 예보">
      <div class="controls">
        <span class="control-label">도시 선택: </span>
        <el-select v-model="selectedCityId" placeholder="도시를 선택하세요" style="width: 200px">
          <el-option
            v-for="city in weatherStore.weatherList"
            :key="city.id"
            :label="city.name"
            :value="city.id"
          />
        </el-select>
      </div>

      <div v-if="isLoading" class="loading-area">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="forecastData" class="forecast-content">
        <div class="city-header">
          <h3>
            {{
              forecastData.cityName ||
              getKoreanCityName(forecastData.city.name) ||
              forecastData.city.name
            }}의 주간 예보
          </h3>
          <p class="subtitle">3시간 간격의 기온 및 날씨 변화</p>
        </div>

        <div class="days-wrapper">
          <div v-for="(times, date) in forecastData.daily" :key="date" class="day-card">
            <div class="day-header">
              <span class="date">{{ date.substring(5) }}</span>
              <span class="day">({{ getDayName(date) }})</span>
            </div>
            <div class="times-scroller">
              <div v-for="time in times" :key="time.dt" class="time-slot">
                <div class="time-label">{{ time.dt_txt.split(' ')[1].substring(0, 5) }}</div>
                <img
                  :src="`http://openweathermap.org/img/wn/${time.weather[0].icon}.png`"
                  :alt="time.weather[0].description"
                  class="weather-icon"
                />
                <div class="temp">{{ Math.round(time.main.temp) }}°</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-alert
        v-else-if="!isLoading && !selectedCityName"
        title="상단에서 도시를 선택해 주세요."
        type="info"
        :closable="false"
      />
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.forecast-container {
  max-width: 900px;
  margin: 0 auto;
}
.controls {
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.control-label {
  font-weight: bold;
  color: #555;
}
.loading-area {
  padding: 20px 0;
}
.city-header {
  text-align: center;
  margin-bottom: 25px;
}
.city-header h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1.4rem;
}
.subtitle {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}
.days-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.day-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}
.day-header {
  font-weight: bold;
  color: #34495e;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
  display: inline-block;
}
.date {
  font-size: 1.1rem;
}
.day {
  margin-left: 5px;
  color: #3498db;
}
.times-scroller {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding: 10px 0;
}
.times-scroller::-webkit-scrollbar {
  height: 6px;
}
.times-scroller::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}
.time-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}
.time-label {
  font-size: 0.85rem;
  color: #7f8c8d;
}
.weather-icon {
  width: 50px;
  height: 50px;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
}
.temp {
  font-weight: bold;
  font-size: 1.1rem;
  color: #e67e22;
}
</style>
