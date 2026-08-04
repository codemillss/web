import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useWeatherStore = defineStore('weather', () => {
  const weatherList = ref([])
  const isLoading = ref(false)
  const isFetched = ref(false)

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'your_api_key_here'

  // OpenWeatherMap API에서 여러 도시의 날씨를 병렬로 가져오는 함수
  const fetchWeatherList = async () => {
    // 이미 데이터를 가져왔다면 중복 호출 방지
    if (isFetched.value) return

    isLoading.value = true
    
    // 조회할 도시 목록 (한국 주요 도시 영문명)
    const cities = [
      { id: 'city_01', q: 'Seoul', nameK: '서울' },
      { id: 'city_02', q: 'Suwon', nameK: '수원' },
      { id: 'city_03', q: 'Busan', nameK: '부산' }
    ]

    try {
      // Promise.all을 사용하여 병렬 비동기 호출 수행
      const requests = cities.map(city => 
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.q}&appid=${API_KEY}&units=metric&lang=kr`)
      )
      
      const responses = await Promise.all(requests)

      // 응답 데이터를 UI에 맞게 정제 (Mapping)
      weatherList.value = responses.map((res, index) => {
        const data = res.data
        return {
          id: cities[index].id,
          name: cities[index].nameK, // UI 표출용 한글 이름
          temp: Math.round(data.main.temp), // 기온 반올림 처리
          status: data.weather[0].description, // 예: '튼구름', '맑음'
          humidity: data.main.humidity,
          wind: data.wind.speed
        }
      })
      
      isFetched.value = true
    } catch (error) {
      console.error('날씨 데이터를 가져오는 중 오류가 발생했습니다:', error)
      alert('데이터 통신 실패! API 키나 네트워크 상태를 확인하세요.')
    } finally {
      isLoading.value = false
    }
  }

  return { weatherList, isLoading, isFetched, fetchWeatherList }
})
