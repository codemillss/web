<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useHw6FavoriteStore } from '@/stores/hw6FavoriteStore'
import { useHw6WeatherStore } from '@/stores/hw6WeatherStore'
import { getWeatherTags } from '@/utils/weatherUtils'

const props = defineProps({
  city: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select-card'])
const router = useRouter()
const configStore = useConfigStore()
const favoriteStore = useHw6FavoriteStore()
const weatherStore = useHw6WeatherStore()

const displayTemp = computed(() => {
  const rawTemp = props.city.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const onClickCard = () => {
  emit('select-card', props.city.name)
}

const onClickDetail = () => {
  router.push('/hw6/weather/' + props.city.id)
}

const toggleFav = () => {
  favoriteStore.toggleFavorite(props.city)
}
</script>

<template>
  <div class="premium-weather-card" @click="onClickCard">
    <!-- 글래스 배경 (마이크로 애니메이션용) -->
    <div class="card-glow"></div>
    <div class="card-content">
      <div class="card-header">
        <div class="title-group">
          <h4 class="city-name">{{ city.name }}</h4>
          <span class="city-status">{{ city.status }}</span>
        </div>
        <div class="card-icons">
          <span 
            class="fav-icon" 
            :class="{ active: favoriteStore.isFavorite(city.id) }"
            @click.stop="toggleFav"
            title="즐겨찾기 토글"
          >
            {{ favoriteStore.isFavorite(city.id) ? '⭐' : '☆' }}
          </span>
          <span 
            class="delete-icon" 
            @click.stop="weatherStore.removeCity(city.id)"
            title="도시 삭제"
          >
            ❌
          </span>
        </div>
      </div>
      
      <div class="card-body">
        <div class="temp-display">
          <img v-if="city.icon" :src="city.icon" class="weather-icon-large" alt="날씨 아이콘" />
          <div class="temp-text">
            {{ displayTemp }}<span class="unit">{{ configStore.unitSymbol }}</span>
          </div>
        </div>
        
        <div class="tags-container">
          <el-tag 
            v-for="(tag, index) in getWeatherTags(city)" 
            :key="index" 
            :type="tag.type" 
            effect="dark" 
            size="small"
            class="insight-tag"
            round
          >
            {{ tag.text }}
          </el-tag>
        </div>
      </div>

      <div class="card-footer">
        <el-button type="primary" size="small" round plain @click.stop="onClickDetail" class="detail-btn">
          상세보기
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.premium-weather-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  height: 100%;
}
.premium-weather-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
}
.card-glow {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}
.premium-weather-card:hover .card-glow {
  opacity: 1;
}
.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}
.title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.city-name {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1a1c29;
  letter-spacing: -0.5px;
}
.city-status {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}
.card-icons {
  display: flex;
  gap: 8px;
  align-items: center;
}
.fav-icon, .delete-icon {
  cursor: pointer;
  font-size: 16px;
  color: #c0c4cc;
  transition: transform 0.2s, filter 0.2s;
}
.fav-icon:hover, .delete-icon:hover { transform: scale(1.15); filter: brightness(0.9); }
.fav-icon.active { color: #f1c40f; text-shadow: 0 0 5px rgba(241, 196, 15, 0.5); }
.delete-icon { font-size: 13px; }

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.temp-display {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.weather-icon-large {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}
.temp-text {
  font-size: 32px;
  font-weight: 900;
  color: #2c3e50;
  line-height: 1;
  letter-spacing: -1px;
}
.unit {
  font-size: 18px;
  font-weight: 500;
  color: #909399;
  margin-left: 2px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  margin-bottom: 16px;
}
.insight-tag {
  font-weight: 600;
  letter-spacing: -0.3px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}
.detail-btn {
  font-weight: 600;
  width: 100%;
}
</style>
