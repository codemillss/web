<script setup>
import { ref, onMounted, watch } from 'vue'
import { useHw6WeatherStore } from '@/stores/hw6WeatherStore'
import BaseDashboardCard from '@/components/hw6/BaseDashboardCard.vue'
import { ElMessage } from 'element-plus'

const weatherStore = useHw6WeatherStore()

const selectedCityId = ref('')
const pollutionData = ref(null)
const isLoading = ref(false)

// AQI(대기질 지수) 매핑 데이터
const aqiMap = {
  1: { label: '최고 좋음 (Good)', color: '#27ae60', bg: '#e8f8f5', icon: '😄' },
  2: { label: '보통 (Fair)', color: '#f39c12', bg: '#fef5e7', icon: '🙂' },
  3: { label: '관심 (Moderate)', color: '#d35400', bg: '#fdf2e9', icon: '😐' },
  4: { label: '나쁨 (Poor)', color: '#e74c3c', bg: '#fdedec', icon: '😷' },
  5: { label: '매우 나쁨 (Very Poor)', color: '#c0392b', bg: '#f9ebea', icon: '🤢' }
}

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
          const found = weatherStore.weatherList.find(c => c.id === recentId)
          if (found) defaultId = found.id
        }
      }
    } catch (e) {}
    selectedCityId.value = defaultId
  }
})

watch(selectedCityId, async (newId) => {
  if (!newId) return
  
  const targetCity = weatherStore.weatherList.find(c => c.id === newId)
  if (!targetCity || !targetCity.lat || !targetCity.lon) {
    ElMessage.warning('해당 도시의 좌표 정보를 찾을 수 없습니다.')
    return
  }
  
  isLoading.value = true
  pollutionData.value = null
  
  try {
    const data = await weatherStore.fetchAirPollution(targetCity.lat, targetCity.lon)
    pollutionData.value = {
      cityInfo: targetCity,
      aqi: data.list[0].main.aqi,
      components: data.list[0].components
    }
  } catch (err) {
    ElMessage.error('대기질 데이터를 불러오는 데 실패했습니다.')
    console.error(err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="pollution-container">
    <BaseDashboardCard title="😷 실시간 대기질 및 미세먼지 현황">
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
      
      <div v-else-if="pollutionData" class="pollution-content">
        <div class="aqi-banner" :style="{ backgroundColor: aqiMap[pollutionData.aqi].bg, borderColor: aqiMap[pollutionData.aqi].color }">
          <div class="aqi-icon">{{ aqiMap[pollutionData.aqi].icon }}</div>
          <div class="aqi-info">
            <h3>{{ pollutionData.cityInfo.name }} 대기질 상태</h3>
            <div class="aqi-status" :style="{ color: aqiMap[pollutionData.aqi].color }">
              {{ aqiMap[pollutionData.aqi].label }} (AQI: {{ pollutionData.aqi }})
            </div>
          </div>
        </div>

        <h4 class="components-title">상세 대기 오염 물질 농도 (μg/m3)</h4>
        <div class="components-grid">
          <div class="component-card">
            <span class="comp-name">초미세먼지 (PM2.5)</span>
            <span class="comp-value">{{ pollutionData.components.pm2_5 }}</span>
          </div>
          <div class="component-card">
            <span class="comp-name">미세먼지 (PM10)</span>
            <span class="comp-value">{{ pollutionData.components.pm10 }}</span>
          </div>
          <div class="component-card">
            <span class="comp-name">일산화탄소 (CO)</span>
            <span class="comp-value">{{ pollutionData.components.co }}</span>
          </div>
          <div class="component-card">
            <span class="comp-name">오존 (O3)</span>
            <span class="comp-value">{{ pollutionData.components.o3 }}</span>
          </div>
          <div class="component-card">
            <span class="comp-name">이산화질소 (NO2)</span>
            <span class="comp-value">{{ pollutionData.components.no2 }}</span>
          </div>
          <div class="component-card">
            <span class="comp-name">이산화황 (SO2)</span>
            <span class="comp-value">{{ pollutionData.components.so2 }}</span>
          </div>
        </div>
      </div>
      
      <el-alert v-else-if="!isLoading && !selectedCityId" title="상단에서 도시를 선택해 주세요." type="info" :closable="false" />
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.pollution-container {
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
.aqi-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  border-radius: 12px;
  border-left: 8px solid;
  margin-bottom: 30px;
}
.aqi-icon {
  font-size: 4rem;
}
.aqi-info h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.3rem;
}
.aqi-status {
  font-size: 1.5rem;
  font-weight: 800;
}
.components-title {
  margin-bottom: 15px;
  color: #34495e;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 10px;
}
.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 15px;
}
.component-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: transform 0.2s;
}
.component-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}
.comp-name {
  font-size: 0.85rem;
  color: #7f8c8d;
  text-align: center;
}
.comp-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: #2c3e50;
}
</style>
