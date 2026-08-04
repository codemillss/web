<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useHw5FavoriteStore } from '@/stores/hw5FavoriteStore'
import { useHw5WeatherStore } from '@/stores/hw5WeatherStore'
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
const favoriteStore = useHw5FavoriteStore()
const weatherStore = useHw5WeatherStore()

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
  router.push('/hw5/weather/' + props.city.id)
}

const toggleFav = () => {
  favoriteStore.toggleFavorite(props.city)
}
</script>

<template>
  <el-card class="weather-card" shadow="hover" @click="onClickCard">
    <div class="card-content">
      <div class="info-section">
        <h4 class="city-name">
          {{ city.name }} ({{ city.status }})
          <img v-if="city.icon" :src="city.icon" class="weather-icon" alt="날씨 아이콘" />
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
        </h4>
        <p class="temp-text">현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
        
        <div class="tags-container">
          <el-tag 
            v-for="(tag, index) in getWeatherTags(city)" 
            :key="index" 
            :type="tag.type" 
            effect="dark" 
            size="small"
            class="insight-tag"
          >
            {{ tag.text }}
          </el-tag>
        </div>
      </div>
      <div class="action-section">
        <el-button size="small" @click.stop="onClickDetail">
          상세보기
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.weather-card { margin-bottom: 12px; cursor: pointer; transition: all 0.2s ease; }
.weather-card:hover { transform: translateY(-2px); }
.card-content { display: flex; justify-content: space-between; align-items: center; }
.info-section { display: flex; flex-direction: column; gap: 6px; }
.city-name { 
  margin: 0; 
  font-size: 16px; 
  font-weight: bold; 
  color: #2c3e50; 
  display: flex;
  align-items: center;
  gap: 5px;
}
.weather-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.temp-text { margin: 0; font-size: 14px; color: #606266; }
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.insight-tag {
  font-weight: 500;
}
.card-icons {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.fav-icon, .delete-icon {
  cursor: pointer;
  font-size: 18px;
  color: #ccc;
  transition: transform 0.2s;
  user-select: none;
}
.fav-icon:hover, .delete-icon:hover { transform: scale(1.2); }
.fav-icon.active { color: #f1c40f; }
.delete-icon { font-size: 14px; }
</style>
