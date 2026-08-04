import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // state: 단위를 저장하는 변수 (초기값: celsius)
  const unit = ref('celsius')

  // getters: 현재 단위 상태에 맞는 기호 (℃ / ℉)
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // actions: 'celsius'와 'fahrenheit'를 토글(스위칭)하는 함수
  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return { unit, unitSymbol, toggleUnit }
})
