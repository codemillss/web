<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getWeatherTags } from '@/utils/weatherUtils'

const props = defineProps({
  city: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select-card'])
const router = useRouter()

const displayTemp = computed(() => `${props.city.temp}°C`)

const onClickCard = () => {
  emit('select-card', props.city.name)
}

const onClickDetail = () => {
  // HW4 핵심: 프로그래매틱 네비게이션 적용
  router.push('/hw4/weather/' + props.city.id)
}
</script>

<template>
  <el-card class="weather-card" shadow="hover" @click="onClickCard">
    <div class="card-content">
      <div class="info-section">
        <h4 class="city-name">{{ city.name }} ({{ city.status }})</h4>
        <p class="temp-text">현재 기온: {{ displayTemp }}</p>
        
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
.weather-card {
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.weather-card:hover {
  transform: translateY(-2px);
}
.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.city-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
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
</style>
