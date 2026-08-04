<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useHw5FavoriteStore } from '@/stores/hw5FavoriteStore'
import { useHw5WeatherStore } from '@/stores/hw5WeatherStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const favoriteStore = useHw5FavoriteStore()
const weatherStore = useHw5WeatherStore()

const cityInfo = ref(null)

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
    
    // 로컬 스토리지에 최근 본 지역 저장
    const historyData = localStorage.getItem('hw5_history')
    let historyList = historyData ? JSON.parse(historyData) : []
    
    // 중복 제거 후 맨 앞에 추가
    historyList = historyList.filter(item => item.id !== found.id)
    historyList.unshift({ id: found.id, name: found.name })
    
    // 최대 5개 유지
    if (historyList.length > 5) {
      historyList.pop()
    }
    
    localStorage.setItem('hw5_history', JSON.stringify(historyList))
  } else {
    alert('존재하지 않는 도시 정보입니다.')
    router.push('/hw5')
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
    
    <el-card v-else-if="cityInfo" class="detail-card" shadow="always">
      <div class="title-header">
        <h3 class="detail-title">📍 지역별 상세 기상 관측 정보</h3>
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
      
      <div class="info-content">
        <p class="highlight">🔹 지정 지역: 대한민국 {{ cityInfo.name }}</p>
        <p>실시간 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
        <p>기상 현황: {{ cityInfo.status }}</p>
        <p>상세 설명: {{ cityInfo.desc }}</p>
        <p>대기 습도: {{ cityInfo.humidity }}</p>
        <p>현재 풍속: {{ cityInfo.wind }}</p>
      </div>
      
      <div class="actions">
        <el-button color="#34495e" style="color: white;" @click="router.push('/hw5')">
          ← 메인 대시보드로 돌아가기
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 520px;
  margin: 0 auto;
}
.detail-card {
  border-radius: 8px;
}
.title-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.weather-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.detail-title {
  margin: 0;
  color: #303133;
}
.fav-icon {
  cursor: pointer;
  font-size: 24px;
  color: #ccc;
  transition: transform 0.2s;
  user-select: none;
}
.fav-icon:hover { transform: scale(1.2); }
.fav-icon.active { color: #f1c40f; }

.info-content {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 20px;
}
.info-content p {
  margin: 0;
}
.highlight {
  color: #e74c3c;
  font-weight: bold;
  margin-bottom: 10px !important;
}
.actions {
  text-align: left;
}
.skeleton-wrapper {
  background: white;
  padding: 30px;
  border-radius: 8px;
}
</style>
