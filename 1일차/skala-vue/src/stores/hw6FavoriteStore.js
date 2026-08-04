import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getKoreanCityName } from '@/utils/weatherUtils'

export const useHw6FavoriteStore = defineStore('hw6Favorite', () => {
  const favorites = ref([])

  const cleanFavoriteObject = (fav) => {
    const cleanId = fav.id.toString().replace(/-si$/i, '')
    const cleanName = getKoreanCityName(cleanId) || getKoreanCityName(fav.name) || fav.name.replace(/(특별|광역|특례)?시$/, '')
    return { id: cleanId, name: cleanName }
  }

  const FAVORITES_VERSION = 'hw6_favorites_v3'
  const defaultFavorites = [
    { id: 'Seoul',       name: '서울' },          // 한국
    { id: 'Dokdo',       name: '독도 (우리땅)' }, // 한국 (특별)
    { id: 'Tokyo',       name: '도쿄' },          // 아시아
    { id: 'London',      name: '런던' },          // 유럽
    { id: 'New York',    name: '뉴욕' },          // 북미
    { id: 'Sao Paulo',   name: '상파울루' },      // 남미
    { id: 'Cairo',       name: '카이로' },        // 아프리카
    { id: 'Sydney',      name: '시드니' }         // 오세아니아
  ]

  // 버전 키를 사용 - 버전이 다르면 오염된 구 데이터 무시하고 기본값으로 재설정
  const stored = localStorage.getItem(FAVORITES_VERSION)
  if (stored) {
    try {
      const raw = JSON.parse(stored)
      if (Array.isArray(raw) && raw.length > 0) {
        // 한글 이름 기준으로 중복 제거
        const map = new Map()
        raw.forEach(item => {
          if (item && item.id && item.name) {
            const cleaned = cleanFavoriteObject(item)
            map.set(cleaned.name, cleaned)
          }
        })
        favorites.value = Array.from(map.values())
      } else {
        favorites.value = defaultFavorites
      }
    } catch (e) {
      favorites.value = defaultFavorites
    }
  } else {
    // 버전 키가 없으면 구 데이터 삭제하고 기본값으로 초기화
    localStorage.removeItem('hw5_favorites')
    localStorage.removeItem('hw5_favorites_v2')
    favorites.value = defaultFavorites
  }

  // 데이터 변경 시 로컬 스토리지에 자동 저장
  watch(favorites, (newVal) => {
    localStorage.setItem(FAVORITES_VERSION, JSON.stringify(newVal))
  }, { deep: true })

  // 특정 도시가 즐겨찾기에 있는지 확인 (한글 이름 및 ID 유연 검사)
  const isFavorite = (cityId) => {
    if (!cityId) return false
    const cleanTargetId = cityId.toString().replace(/-si$/i, '')
    const cleanTargetName = getKoreanCityName(cleanTargetId) || cityId.toString().replace(/(특별|광역|특례)?시$/, '')
    return favorites.value.some(city => {
      const cleanCityId = city.id.toString().toLowerCase().replace(/-si$/i, '')
      return cleanCityId === cleanTargetId || city.name === cleanTargetName || city.name === cityId
    })
  }

  // 즐겨찾기 토글 기능 (중복 추가 완전 차단)
  const toggleFavorite = (city) => {
    if (!city || !city.id) return
    const cleaned = cleanFavoriteObject(city)
    
    if (isFavorite(cleaned.id) || favorites.value.some(c => c.name === cleaned.name)) {
      favorites.value = favorites.value.filter(c => {
        const cClean = cleanFavoriteObject(c)
        return cClean.id.toLowerCase() !== cleaned.id.toLowerCase() && cClean.name !== cleaned.name
      })
    } else {
      favorites.value.push(cleaned)
    }
  }

  return { favorites, isFavorite, toggleFavorite }
})
