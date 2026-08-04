import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getKoreanCityName } from '@/utils/weatherUtils'

export const useHw5WeatherStore = defineStore('hw5Weather', () => {
  const weatherList = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const isAdding = ref(false) // 개별 도시 추가 로딩 상태

  // 로컬스토리지에서 저장된 도시 목록 가져오기 (핵심 도시 + 대륙별 대표 도시 보장)
  const getSavedCities = () => {
    // hw6와 맞추기 위해 강제 초기화용 버전키 사용
    const CITIES_VERSION = 'hw5_saved_cities_v2'
    const saved = localStorage.getItem(CITIES_VERSION)
    const defaultCities = [
      // 한국
      'Seoul', 'Suwon', 'Busan', 'Jeju', 'Ulleungdo', 'Dokdo',
      // 아시아
      'Tokyo', 'Osaka', 'Beijing', 'Bangkok',
      'Almaty', 'Delhi', 'Kuala Lumpur', 'Chiang Mai',
      // 유럽
      'London', 'Paris', 'Berlin', 'Rome', 'Sofia',
      // 북미
      'New York', 'Los Angeles', 'Chicago', 'Toronto', 'San Francisco',
      // 남미
      'Sao Paulo', 'Buenos Aires', 'Lima', 'Bogota', 'Medellin',
      // 아프리카
      'Cairo', 'Lagos', 'Nairobi', 'Johannesburg', 'Kampala', 'Luanda',
      // 오세아니아
      'Sydney', 'Melbourne,AU', 'Auckland'
    ]
    localStorage.removeItem('hw5_saved_cities') // 구버전 삭제
    let list = saved ? JSON.parse(saved) : defaultCities
    const coreCities = [
      'Seoul', 'Suwon', 'Busan', 'Jeju', 'Ulleungdo', 'Dokdo',
      'Tokyo', 'Osaka', 'Beijing', 'Bangkok',
      'Almaty', 'Delhi', 'Kuala Lumpur', 'Chiang Mai',
      'London', 'Paris', 'Berlin', 'Rome', 'Sofia',
      'New York', 'Los Angeles', 'Chicago', 'Toronto', 'San Francisco',
      'Sao Paulo', 'Buenos Aires', 'Lima', 'Bogota', 'Medellin',
      'Cairo', 'Lagos', 'Nairobi', 'Johannesburg', 'Kampala', 'Luanda',
      'Sydney', 'Melbourne,AU', 'Auckland'
    ]
    coreCities.forEach(city => {
      const exists = list.some(c => c.toLowerCase() === city.toLowerCase() || c.toLowerCase() === (city + '-si').toLowerCase())
      if (!exists) list.push(city)
    })
    return list
  }

  const savedCities = ref(getSavedCities())

  // 로컬스토리지에 저장
  const saveToStorage = () => {
    localStorage.setItem('hw5_saved_cities_v2', JSON.stringify(savedCities.value))
  }

  // 단일 도시 날씨 정보 Fetch 헬퍼 함수
  const fetchSingleCityData = async (cityName, apiKey) => {
    // 0. 섬/특수 지형 좌표 커스텀 맵핑 (OpenWeatherMap 도시 이름 404 예방)
    const specialCoords = {
      'dokdo': { lat: 37.2425, lon: 131.8669, name: '독도 (우리땅)', id: 'Dokdo' },
      '독도': { lat: 37.2425, lon: 131.8669, name: '독도 (우리땅)', id: 'Dokdo' },
      'ulleungdo': { lat: 37.4847, lon: 130.9010, name: '울릉도', id: 'Ulleungdo' },
      '울릉도': { lat: 37.4847, lon: 130.9010, name: '울릉도', id: 'Ulleungdo' },
      'jeju': { lat: 33.4996, lon: 126.5312, name: '제주도', id: 'Jeju' },
      '제주도': { lat: 33.4996, lon: 126.5312, name: '제주도', id: 'Jeju' },
      '제주': { lat: 33.4996, lon: 126.5312, name: '제주도', id: 'Jeju' },
      'suwon': { lat: 37.2911, lon: 127.0089, name: '수원', id: 'Suwon' },
      '수원': { lat: 37.2911, lon: 127.0089, name: '수원', id: 'Suwon' },
      'suwon-si': { lat: 37.2911, lon: 127.0089, name: '수원', id: 'Suwon' }
    }

    const lowerQuery = cityName.toLowerCase().trim()
    let response
    let translatedName = ''
    let customId = ''

    if (specialCoords[lowerQuery]) {
      const target = specialCoords[lowerQuery]
      response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${target.lat}&lon=${target.lon}&appid=${apiKey}&units=metric&lang=kr`)
      translatedName = target.name
      customId = target.id
    } else {
      // 1. [자동 번역 로직] Geocoding API 연동
      let autoKoreanName = ''
      try {
        const geoRes = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
        if (geoRes.data && geoRes.data.length > 0) {
          const localNames = geoRes.data[0].local_names
          if (localNames && localNames.ko) {
            autoKoreanName = localNames.ko
          }
        }
      } catch (e) {
        console.warn('Geocoding API 연동 실패 (자동 한글 매핑 건너뜀)', e)
      }

      // 2. 본 날씨 데이터 Fetch
      response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=kr`)
      translatedName = autoKoreanName || getKoreanCityName(response.data.name) || getKoreanCityName(cityName)
      customId = response.data.name
    }

    return {
      id: customId,
      name: translatedName,
      temp: Math.round(response.data.main.temp * 10) / 10,
      status: response.data.weather[0].main === 'Clear' ? '맑음' : 
              response.data.weather[0].main === 'Clouds' ? '구름' : 
              response.data.weather[0].main === 'Rain' ? '비' : response.data.weather[0].description,
      humidity: response.data.main.humidity + '%',
      wind: response.data.wind.speed + 'm/s',
      desc: response.data.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`,
      lat: response.data.coord.lat,
      lon: response.data.coord.lon,
      queryName: cityName // 저장용 쿼리
    }
  }

  // 초기 전체 데이터 Fetch
  const fetchWeather = async () => {
    isLoading.value = true
    error.value = null
    
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('OpenWeatherMap API Key가 없어서 임시 MOCK 데이터를 사용합니다.')
      setTimeout(() => {
        weatherList.value = [
          { id: 'Seoul', name: '서울', temp: 28, status: '맑음', humidity: '55%', wind: '2.5m/s', desc: 'API 키 필요 (MOCK)' },
          { id: 'Suwon', name: '수원', temp: 24, status: '비', humidity: '70%', wind: '1.5m/s', desc: 'API 키 필요 (MOCK)' },
          { id: 'Busan', name: '부산', temp: 26, status: '구름', humidity: '60%', wind: '3.0m/s', desc: 'API 키 필요 (MOCK)' }
        ]
        isLoading.value = false
      }, 1500)
      return
    }

    try {
      // 즐겨찾기 스토리지 데이터 자동 동기화 (즐겨찾기에 등록된 항목은 무조건 메인 대시보드에도 로드)
      const storedFavs = localStorage.getItem('hw5_favorites')
      if (storedFavs) {
        const favList = JSON.parse(storedFavs)
        favList.forEach(fav => {
          const exists = savedCities.value.some(c => c.toLowerCase() === fav.id.toLowerCase() || c.toLowerCase() === (fav.id + '-si').toLowerCase())
          if (!exists) {
            savedCities.value.push(fav.id)
          }
        })
      }

      // Promise.allSettled를 통해 일부 도시가 실패해도 나머지는 로드되게 처리
      const promises = savedCities.value.map(city => fetchSingleCityData(city, apiKey))
      const results = await Promise.allSettled(promises)
      
      const successfulData = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        
      weatherList.value = successfulData
    } catch (err) {
      console.error(err)
      error.value = err.message || '데이터를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  // 동적으로 새로운 도시 추가
  const addCity = async (cityName) => {
    if (!cityName.trim()) return

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    if (!apiKey || apiKey === 'your_api_key_here') {
      ElMessage.warning('API Key가 없어서 도시를 추가할 수 없습니다.')
      return
    }

    // 중복 검사 (이미 저장된 쿼리인지)
    const isAlreadySaved = savedCities.value.some(c => c.toLowerCase() === cityName.toLowerCase())
    if (isAlreadySaved) {
      ElMessage.info('이미 대시보드에 추가된 도시입니다.')
      return
    }

    isAdding.value = true
    try {
      const data = await fetchSingleCityData(cityName, apiKey)
      
      // 혹시 결과의 id(이름)로 또 중복되는지 검사
      if (weatherList.value.some(c => c.id === data.id)) {
        ElMessage.info('이미 대시보드에 추가된 도시입니다.')
        return
      }

      // 성공 시 데이터에 추가
      weatherList.value.unshift(data)
      savedCities.value.unshift(cityName)
      saveToStorage()
      ElMessage.success(`${data.name}이(가) 대시보드에 추가되었습니다!`)
    } catch (err) {
      if (err.response && err.response.status === 404) {
        ElMessage.error(`'${cityName}'에 대한 날씨 정보를 찾을 수 없습니다. 영문명으로 다시 시도해 보세요.`)
      } else {
        ElMessage.error('도시 추가 중 오류가 발생했습니다.')
      }
    } finally {
      isAdding.value = false
    }
  }

  // 도시 삭제
  const removeCity = (cityId) => {
    // 1. weatherList에서 삭제
    const target = weatherList.value.find(c => c.id === cityId)
    if (!target) return
    
    weatherList.value = weatherList.value.filter(c => c.id !== cityId)
    
    // 2. savedCities에서 삭제
    savedCities.value = savedCities.value.filter(c => c !== target.queryName)
    saveToStorage()
    ElMessage.success(`${target.name} 카드가 삭제되었습니다.`)
  }

  return { 
    weatherList, isLoading, error, isAdding, 
    fetchWeather, fetchSingleCityData, addCity, removeCity 
  }
})
