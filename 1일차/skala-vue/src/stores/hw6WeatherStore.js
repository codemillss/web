import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getKoreanCityName, cleanWeatherDesc } from '@/utils/weatherUtils'

export const useHw6WeatherStore = defineStore('hw6Weather', () => {
  const weatherList = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const isAdding = ref(false) // 개별 도시 추가 로딩 상태

  const getApiKey = () => {
    return localStorage.getItem('hw6_user_api_key') || import.meta.env.VITE_OPENWEATHER_API_KEY
  }

  // 로컬스토리지에서 저장된 도시 목록 가져오기
  const CITIES_VERSION = 'hw6_saved_cities_v8'
  const getSavedCities = () => {
    // 즐겨찾기 기본 도시와 완전 동기화된 초기 목록
    const defaultCities = [
      // 대한민국 (최소 5개 + 특수 지역)
      'Seoul',
      'Busan',
      'Incheon',
      'Daegu',
      'Daejeon',
      'Dokdo',
      'Ulleungdo',
      'Jeju',
      // 아시아
      'Tokyo',
      'Bangkok',
      'Almaty',
      // 유럽
      'London',
      'Budapest',
      // 북미 (미국)
      'New York',
      'Los Angeles',
      'Houston',
      // 남미
      'Santiago',
      'Sao Paulo',
      // 아프리카
      'Cairo',
      'Kampala',
      // 오세아니아
      'Sydney',
    ]

    // 구 키 데이터 삭제
    localStorage.removeItem('hw6_saved_cities')
    localStorage.removeItem('hw6_saved_cities_v3')
    localStorage.removeItem('hw6_saved_cities_v4')
    localStorage.removeItem('hw6_saved_cities_v5')
    localStorage.removeItem('hw6_saved_cities_v6')
    localStorage.removeItem('hw6_saved_cities_v7')

    const saved2 = localStorage.getItem(CITIES_VERSION)
    let list = saved2 ? JSON.parse(saved2) : defaultCities

    // 핵심 도시 목록 (언제나 노출되어야 하는 도시들)
    const coreCities = [...defaultCities]

    coreCities.forEach((city) => {
      const exists = list.some(
        (c) =>
          c.toLowerCase() === city.toLowerCase() ||
          c.toLowerCase() === (city + '-si').toLowerCase(),
      )
      if (!exists) list.push(city)
    })
    return list
  }

  const savedCities = ref(getSavedCities())

  // 로컬스토리지에 저장
  const saveToStorage = () => {
    localStorage.setItem(CITIES_VERSION, JSON.stringify(savedCities.value))
  }

  // 단일 도시 날씨 정보 Fetch 헬퍼 함수
  const fetchSingleCityData = async (cityName, apiKey) => {
    // 0. 섬/특수 지형 좌표 커스텀 맵핑 (OpenWeatherMap 도시 이름 404 예방)
    const specialCoords = {
      dokdo: { lat: 37.2425, lon: 131.8669, name: '독도 (우리땅)', id: 'Dokdo' },
      독도: { lat: 37.2425, lon: 131.8669, name: '독도 (우리땅)', id: 'Dokdo' },
      ulleungdo: { lat: 37.4847, lon: 130.901, name: '울릉도', id: 'Ulleungdo' },
      울릉도: { lat: 37.4847, lon: 130.901, name: '울릉도', id: 'Ulleungdo' },
      jeju: { lat: 33.4996, lon: 126.5312, name: '제주도', id: 'Jeju' },
      제주도: { lat: 33.4996, lon: 126.5312, name: '제주도', id: 'Jeju' },
      제주: { lat: 33.4996, lon: 126.5312, name: '제주도', id: 'Jeju' },
      suwon: { lat: 37.2911, lon: 127.0089, name: '수원', id: 'Suwon' },
      수원: { lat: 37.2911, lon: 127.0089, name: '수원', id: 'Suwon' },
      'suwon-si': { lat: 37.2911, lon: 127.0089, name: '수원', id: 'Suwon' },
    }

    const lowerQuery = cityName.toLowerCase().trim()
    let response
    let translatedName = ''
    let customId = ''

    if (specialCoords[lowerQuery]) {
      const target = specialCoords[lowerQuery]
      response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${target.lat}&lon=${target.lon}&appid=${apiKey}&units=metric&lang=kr`,
      )
      translatedName = target.name
      customId = target.id
    } else {
      // 1. [로컬 번역 로직] 지오코딩 우회
      response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=kr`,
      )
      translatedName =
        getKoreanCityName(response.data.name) || getKoreanCityName(cityName) || response.data.name
      translatedName = translatedName.replace(/(특별|광역|특례)?시$/, '')
      customId = response.data.name.replace(/-si$/i, '')
    }

    return {
      id: customId,
      name: translatedName,
      temp: Math.round(response.data.main.temp * 10) / 10,
      status:
        response.data.weather[0].main === 'Clear'
          ? '맑음'
          : response.data.weather[0].main === 'Clouds'
            ? '구름'
            : response.data.weather[0].main === 'Rain'
              ? '비'
              : cleanWeatherDesc(response.data.weather[0].description),
      humidity: response.data.main.humidity + '%',
      wind: response.data.wind.speed + 'm/s',
      desc: cleanWeatherDesc(response.data.weather[0].description),
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`,
      lat: response.data.coord.lat,
      lon: response.data.coord.lon,
      queryName: cityName, // 저장용 쿼리
    }
  }

  // 초기 전체 데이터 Fetch
  const fetchWeather = async () => {
    isLoading.value = true
    error.value = null

    const apiKey = getApiKey()
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('OpenWeatherMap API Key가 없어서 임시 MOCK 데이터를 사용합니다.')
      setTimeout(() => {
        weatherList.value = [
          // 한국 지역
          {
            id: 'Seoul',
            name: '서울',
            temp: 28,
            status: '맑음',
            humidity: '55%',
            wind: '2.5m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: 37.5665,
            lon: 126.978,
          },
          {
            id: 'Suwon',
            name: '수원',
            temp: 24,
            status: '비',
            humidity: '70%',
            wind: '1.5m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: 37.2636,
            lon: 127.0286,
          },
          {
            id: 'Busan',
            name: '부산',
            temp: 26,
            status: '구름',
            humidity: '60%',
            wind: '3.0m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: 35.1796,
            lon: 129.0756,
          },
          {
            id: 'Jeju',
            name: '제주도',
            temp: 27,
            status: '맑음',
            humidity: '65%',
            wind: '4.0m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: 33.4996,
            lon: 126.5312,
          },
          {
            id: 'Ulleungdo',
            name: '울릉도',
            temp: 23,
            status: '맑음',
            humidity: '58%',
            wind: '3.5m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: 37.4847,
            lon: 130.901,
          },
          {
            id: 'Dokdo',
            name: '독도 (우리땅)',
            temp: 22,
            status: '맑음',
            humidity: '60%',
            wind: '5.0m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: 37.2425,
            lon: 131.8669,
          },

          // 해외 여행 지역 (즐겨찾기 초기값과 동기화)
          {
            id: 'Tokyo',
            name: '도쿄',
            temp: 29,
            status: '맑음',
            humidity: '65%',
            wind: '3.2m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: 35.6762,
            lon: 139.6503,
          },
          {
            id: 'London',
            name: '런던',
            temp: 18,
            status: '비',
            humidity: '80%',
            wind: '5.5m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: 51.5074,
            lon: -0.1278,
          },
          {
            id: 'New York',
            name: '뉴욕',
            temp: 25,
            status: '구름',
            humidity: '55%',
            wind: '4.1m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: 40.7128,
            lon: -74.006,
          },
          {
            id: 'Sao Paulo',
            name: '상파울루',
            temp: 22,
            status: '맑음',
            humidity: '50%',
            wind: '2.8m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: -23.5505,
            lon: -46.6333,
          },
          {
            id: 'Cairo',
            name: '카이로',
            temp: 35,
            status: '맑음',
            humidity: '20%',
            wind: '1.2m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: 30.0444,
            lon: 31.2357,
          },
          {
            id: 'Sydney',
            name: '시드니',
            temp: 15,
            status: '구름',
            humidity: '60%',
            wind: '4.8m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: -33.8688,
            lon: 151.2093,
          },
          {
            id: 'Budapest',
            name: '부다페스트',
            temp: 21,
            status: '비',
            humidity: '65%',
            wind: '2.5m/s',
            desc: 'API 키 필요 (MOCK)',
            lat: 47.4979,
            lon: 19.0402,
          },
        ]
        isLoading.value = false
      }, 1500)
      return
    }

    try {
      // 즐겨찾기 스토리지 데이터 자동 동기화 (즐겨찾기에 등록된 항목은 무조건 메인 대시보드에도 로드)
      const storedFavs = localStorage.getItem('hw6_favorites_v3')
      if (storedFavs) {
        const favList = JSON.parse(storedFavs)
        favList.forEach((fav) => {
          const exists = savedCities.value.some(
            (c) =>
              c.toLowerCase() === fav.id.toLowerCase() ||
              c.toLowerCase() === (fav.id + '-si').toLowerCase(),
          )
          if (!exists) {
            savedCities.value.push(fav.id)
          }
        })
      }

      // Promise.allSettled를 통해 일부 도시가 실패해도 나머지는 로드되게 처리
      const promises = savedCities.value.map((city) => fetchSingleCityData(city, apiKey))
      const results = await Promise.allSettled(promises)

      const successfulData = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)

      if (successfulData.length === 0) {
        throw new Error('API 한도초과(429) 또는 네트워크 에러')
      }
      weatherList.value = successfulData
    } catch (err) {
      console.error(err)
      error.value = null // 화면 차단 방지 (MOCK 데이터를 보여주기 위함)
      ElMessage.warning('API 호출 에러(429 등)로 인해 임시 데이터로 전환되었습니다.')
      console.warn('Fallback: API 차단으로 인해 MOCK 데이터를 대신 표시합니다.')
      weatherList.value = [
        {
          id: 'Seoul',
          name: '서울',
          temp: 28,
          status: '맑음',
          humidity: '55%',
          wind: '2.5m/s',
          desc: 'API 제한 (MOCK)',
          lat: 37.5665,
          lon: 126.978,
        },
        {
          id: 'Dokdo',
          name: '독도 (우리땅)',
          temp: 22,
          status: '맑음',
          humidity: '60%',
          wind: '5.0m/s',
          desc: 'API 제한 (MOCK)',
          lat: 37.2425,
          lon: 131.8669,
        },
        {
          id: 'Tokyo',
          name: '도쿄',
          temp: 30,
          status: '구름',
          humidity: '60%',
          wind: '3.0m/s',
          desc: 'API 제한 (MOCK)',
          lat: 35.6895,
          lon: 139.6917,
        },
        {
          id: 'London',
          name: '런던',
          temp: 19,
          status: '구름',
          humidity: '55%',
          wind: '3.0m/s',
          desc: 'API 제한 (MOCK)',
          lat: 51.5074,
          lon: -0.1278,
        },
        {
          id: 'New York',
          name: '뉴욕',
          temp: 25,
          status: '비',
          humidity: '70%',
          wind: '1.5m/s',
          desc: 'API 제한 (MOCK)',
          lat: 40.7128,
          lon: -74.006,
        },
        {
          id: 'Sao Paulo',
          name: '상파울루',
          temp: 22,
          status: '구름',
          humidity: '65%',
          wind: '2.0m/s',
          desc: 'API 제한 (MOCK)',
          lat: -23.5505,
          lon: -46.6333,
        },
        {
          id: 'Cairo',
          name: '카이로',
          temp: 35,
          status: '맑음',
          humidity: '25%',
          wind: '3.5m/s',
          desc: 'API 제한 (MOCK)',
          lat: 30.0444,
          lon: 31.2357,
        },
        {
          id: 'Sydney',
          name: '시드니',
          temp: 18,
          status: '맑음',
          humidity: '45%',
          wind: '4.5m/s',
          desc: 'API 제한 (MOCK)',
          lat: -33.8688,
          lon: 151.2093,
        },
        {
          id: 'Budapest',
          name: '부다페스트',
          temp: 20,
          status: '맑음',
          humidity: '55%',
          wind: '3.0m/s',
          desc: 'API 제한 (MOCK)',
          lat: 47.4979,
          lon: 19.0402,
        },
      ]
    } finally {
      isLoading.value = false
    }
  }

  // 동적으로 새로운 도시 추가
  const addCity = async (cityName) => {
    if (!cityName.trim()) return

    const apiKey = getApiKey()
    if (!apiKey || apiKey === 'your_api_key_here') {
      ElMessage.warning('API Key가 없어서 도시를 추가할 수 없습니다.')
      return
    }

    // 중복 검사 (이미 저장된 쿼리인지)
    const isAlreadySaved = savedCities.value.some((c) => c.toLowerCase() === cityName.toLowerCase())
    if (isAlreadySaved) {
      ElMessage.info('이미 대시보드에 추가된 도시입니다.')
      return
    }

    isAdding.value = true
    try {
      const data = await fetchSingleCityData(cityName, apiKey)

      // 혹시 결과의 id(이름)로 또 중복되는지 검사
      if (weatherList.value.some((c) => c.id === data.id)) {
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
        ElMessage.error(
          `'${cityName}'에 대한 날씨 정보를 찾을 수 없습니다. 영문명으로 다시 시도해 보세요.`,
        )
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
    const target = weatherList.value.find((c) => c.id === cityId)
    if (!target) return

    weatherList.value = weatherList.value.filter((c) => c.id !== cityId)

    // 2. savedCities에서 삭제
    savedCities.value = savedCities.value.filter((c) => c !== target.queryName)
    saveToStorage()
    ElMessage.success(`${target.name} 카드가 삭제되었습니다.`)
  }

  // ----------------------------------------------------
  // 과제 6: 신규 API (주간 예보, 미세먼지)
  // ----------------------------------------------------

  // MOCK 주간 예보 데이터 생성 헬퍼
  const generateMockForecast = (lat, lon, cityName) => {
    const now = new Date()
    const list = []
    const weatherTypes = [
      { main: 'Clear', description: '맑음', icon: '01d' },
      { main: 'Clouds', description: '구름 많음', icon: '03d' },
      { main: 'Rain', description: '가벼운 비', icon: '10d' },
      { main: 'Clouds', description: '흐림', icon: '04d' },
      { main: 'Clear', description: '맑음', icon: '01n' },
    ]
    const baseTemp = lat > 30 ? 28 : lat > 0 ? 22 : 16

    for (let i = 0; i < 40; i++) {
      const dt = new Date(now.getTime() + i * 3 * 60 * 60 * 1000)
      const hour = dt.getHours()
      const tempVariation = Math.sin(((hour - 6) * Math.PI) / 12) * 5
      const dayVariation = Math.sin((i / 8) * Math.PI) * 3
      const temp = Math.round((baseTemp + tempVariation + dayVariation) * 10) / 10

      list.push({
        dt: Math.floor(dt.getTime() / 1000),
        main: {
          temp,
          feels_like: temp - 1,
          temp_min: temp - 2,
          temp_max: temp + 2,
          humidity: Math.round(50 + Math.random() * 30),
        },
        weather: [{ id: 800, ...weatherTypes[i % weatherTypes.length] }],
        dt_txt: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')} ${String(dt.getHours()).padStart(2, '0')}:00:00`,
      })
    }

    return {
      city: { name: cityName || 'Unknown', coord: { lat, lon } },
      list,
    }
  }

  // MOCK 대기질 데이터 생성 헬퍼
  const generateMockAirPollution = () => {
    return {
      list: [
        {
          main: { aqi: Math.ceil(Math.random() * 3) },
          components: {
            co: Math.round(200 + Math.random() * 100),
            no: Math.round(Math.random() * 5 * 10) / 10,
            no2: Math.round(10 + Math.random() * 30),
            o3: Math.round(30 + Math.random() * 50),
            so2: Math.round(5 + Math.random() * 15),
            pm2_5: Math.round(5 + Math.random() * 25),
            pm10: Math.round(10 + Math.random() * 40),
            nh3: Math.round(Math.random() * 10 * 10) / 10,
          },
        },
      ],
    }
  }

  // 5일 주간 예보 가져오기 (특수 지역 독도/울릉도 및 커스텀 이름 매핑 지원)
  const fetchForecast = async (lat, lon, cityNameOverride = '') => {
    const apiKey = getApiKey()
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('API Key 없음: MOCK 주간 예보 데이터를 사용합니다.')
      return generateMockForecast(lat, lon, cityNameOverride)
    }

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`,
      )

      if (res.data && res.data.city) {
        const isDokdo =
          (Math.abs(lat - 37.2425) < 0.1 && Math.abs(lon - 131.8669) < 0.1) ||
          (cityNameOverride &&
            (cityNameOverride.includes('Dokdo') || cityNameOverride.includes('독도')))
        const isUlleungdo =
          (Math.abs(lat - 37.4847) < 0.1 && Math.abs(lon - 130.901) < 0.1) ||
          (cityNameOverride &&
            (cityNameOverride.includes('Ulleungdo') || cityNameOverride.includes('울릉도')))

        if (isDokdo) {
          res.data.city.name = '독도 (우리땅)'
        } else if (isUlleungdo) {
          res.data.city.name = '울릉도'
        } else if (cityNameOverride) {
          res.data.city.name = cityNameOverride
        }
      }

      return res.data
    } catch (err) {
      console.warn('Forecast API 실패, MOCK 데이터로 대체:', err.message)
      return generateMockForecast(lat, lon, cityNameOverride)
    }
  }

  // 대기질(미세먼지) 가져오기 (lat, lon 필요)
  const fetchAirPollution = async (lat, lon) => {
    const apiKey = getApiKey()
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('API Key 없음: MOCK 대기질 데이터를 사용합니다.')
      return generateMockAirPollution()
    }

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`,
      )
      return res.data
    } catch (err) {
      console.warn('Air Pollution API 실패, MOCK 데이터로 대체:', err.message)
      return generateMockAirPollution()
    }
  }

  return {
    weatherList,
    isLoading,
    error,
    isAdding,
    fetchWeather,
    fetchSingleCityData,
    addCity,
    removeCity,
    fetchForecast,
    fetchAirPollution,
  }
})
