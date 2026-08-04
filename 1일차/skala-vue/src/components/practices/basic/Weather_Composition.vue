<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

import { matchKorean } from '@/utils/koreanSearch.js'
import { getWeatherTags } from '@/utils/weatherUtils'

/* 
  [상태 변수(State) 선언]
  ref()를 사용하여 반응형 변수를 만듭니다.
  데이터가 변경되면 Vue가 이를 감지하고 자동으로 화면(Template)을 다시 그립니다.
*/

// 1. 서버에서 받아왔다고 가정하는 전체 날씨 데이터 배열
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// 2. 사용자가 입력하는 검색어 (양방향 바인딩 예정)
const searchQuery = ref('')

// 3. 사용자가 카드를 클릭했을 때 저장될 선택된 도시 이름
const selectedCityInfo = ref('')

// [추가 기능] 4. 날씨 정렬 기준 상태 (기본, 내림차순, 오름차순)
const sortOrder = ref('default') // 'default' | 'desc' | 'asc'

/*
  [파생 상태(Computed) 선언]
  computed()는 기존 반응형 변수(weatherList, searchQuery, sortOrder)를 기반으로 
  새로운 데이터를 계산해 내며, 의존하는 변수가 바뀔 때만 재계산(캐싱 효과)됩니다.
*/
const filteredWeatherList = computed(() => {
  // 1단계: 검색어 필터링 (초성 검색 지원)
  let result = weatherList.value

  if (searchQuery.value) {
    result = result.filter(city => matchKorean(city.name, searchQuery.value))
  }

  // 2단계: 추가 실습 - 온도 기준 정렬
  // 원본 배열이 훼손되지 않도록 스프레드 연산자([...])로 얕은 복사 후 정렬 수행
  if (sortOrder.value === 'desc') {
    result = [...result].sort((a, b) => b.temp - a.temp) // 온도 높은 순
  } else if (sortOrder.value === 'asc') {
    result = [...result].sort((a, b) => a.temp - b.temp) // 온도 낮은 순
  }

  return result
})

/*
  [감시자(Watch) 선언 - 특정 변수만 명시적으로 감시]
  watch는 감시할 대상을 지정해야 합니다. 이전 값과 새로운 값을 모두 가져올 수 있습니다.
*/
watch(selectedCityInfo, (newCity) => {
  if (newCity) {
    // 실무 활용 예: 상태바 문구가 업데이트되면 로깅 시스템으로 전송
    console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newCity}이(가) 선택되었습니다."`)
  }
})

/*
  [자동 감시자(WatchEffect) 선언 - 내부 변수 자동 추적]
  watchEffect는 감시 대상을 명시하지 않아도 내부에 사용된 모든 반응형 변수를 자동으로 추적합니다.
*/
watchEffect(() => {
  if (searchQuery.value) {
    // 검색어가 타이핑 될 때마다 실시간으로 이 로그가 호출됨 (디바운싱 기법 등과 결합 가능)
    console.log(`[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
  } else {
    console.log(`[watchEffect 자동 호출] 검색어가 비어 전체 데이터를 표시합니다.`)
  }
})

/* 
  [이벤트 핸들러 함수 선언] 
*/

// 한글 입력 시 v-model의 글자 씹힘(지연) 현상을 방지하기 위해 
// :value와 @input 이벤트를 결합하여 직접 제어
const handleInput = (event) => {
  searchQuery.value = event.target.value
}

// [추가 실습] 검색어 초기화 함수
const clearSearch = () => {
  searchQuery.value = ''
  sortOrder.value = 'default' // 정렬 상태도 같이 초기화
}

// 카드 내 상세보기 버튼 클릭 시 브라우저 내장 alert 호출
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 카드 전체 클릭 시 하단 상태바 변경
const selectCity = (cityName) => {
  selectedCityInfo.value = cityName
}
</script>

<template>
  <div class="weather-container">
    <h2>⛅ 과제 2: 날씨 (컴포지션 고도화)</h2>

    <!-- [검색 영역] -->
    <div class="search-section">
      <h3>🔍 도시 검색</h3>
      <div class="input-group">
        <input
          type="text"
          :value="searchQuery"
          @input="handleInput"
          placeholder="검색할 도시 이름 입력 (예: 서울)"
          class="search-input"
        />
        <!-- 추가 실습: 입력한 내용을 한 번에 지우는 버튼 -->
        <button class="clear-btn" @click="clearSearch" v-show="searchQuery">지우기</button>
      </div>
      <p class="search-result">검색 중인 도시: <strong class="highlight-text">{{ searchQuery }}</strong></p>
      
      <!-- 추가 실습: 정렬 기준 라디오 버튼 (v-model 활용) -->
      <div class="sort-group">
        <label><input type="radio" value="default" v-model="sortOrder" /> 기본</label>
        <label><input type="radio" value="desc" v-model="sortOrder" /> 온도 높은 순</label>
        <label><input type="radio" value="asc" v-model="sortOrder" /> 온도 낮은 순</label>
      </div>
    </div>

    <!-- [지역별 날씨 현황 영역] -->
    <div class="weather-list-section">
      <h3>🗺️ 지역별 날씨 현황 (총 {{ filteredWeatherList.length }}건)</h3>

      <!-- 
        검색 결과가 없을 때의 예외 처리 (v-if) 
        filteredWeatherList 배열의 길이를 측정하여 화면을 전환함
      -->
      <div v-if="filteredWeatherList.length === 0" class="no-result">
        검색 결과가 일치하는 도시가 없습니다. 😭
      </div>

      <!-- 
        검색 결과가 있을 때 (v-else) 
        v-for를 사용하여 배열의 길이만큼 카드를 반복 렌더링. 
        Vue의 효율적인 렌더링을 위해 :key를 고유 식별자(id)로 반드시 지정해야 함.
      -->
      <template v-else>
        <div
          v-for="city in filteredWeatherList"
          :key="city.id"
          class="weather-card"
          @click="selectCity(city.name)"
        >
          <div class="card-header">
            <span class="city-name">{{ city.name }} ({{ city.status }})</span>
            
            <!-- 
              이벤트 수식어(.stop) 적용
              버튼을 눌렀을 때, 부모인 카드의 @click="selectCity"가 
              같이 실행되는 버블링(Bubbling) 현상을 차단함 
            -->
            <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">
              상세보기
            </button>
          </div>

          <div class="card-body">
            <p class="temp-text">현재 기온: <strong>{{ city.temp }}°C</strong></p>

            <div class="tags-container">
              <span 
                v-for="(tag, i) in getWeatherTags(city)" 
                :key="i"
                :class="['badge', `badge-${tag.type}`]"
              >
                {{ tag.text }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- [카드 선택 상태바] -->
    <div class="status-bar">
      <!-- selectedCityInfo 변수에 문자열이 있으면 (truthy) 활성화 메시지 출력 -->
      <span v-if="selectedCityInfo">
        <strong style="color: #2e7d32;">{{ selectedCityInfo }}</strong>이(가) 선택되었습니다.
      </span>
      <!-- 비어 있으면 (falsy) 기본 안내 문구 출력 -->
      <span v-else class="placeholder-text">
        날씨 카드를 클릭해 보세요!
      </span>
    </div>
  </div>
</template>

<style scoped>
/* 전체 컨테이너 및 폰트 세팅 */
.weather-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9fbfd;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  font-family: 'Pretendard', sans-serif; /* 모던한 폰트로 업그레이드 시도 */
}

/* 검색 구역 스타일 */
.search-section {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eef2f5;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* 입체감 추가 */
}

.input-group {
  display: flex;
  gap: 8px;
}

.search-input {
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}
.search-input:focus {
  outline: none;
  border-color: #42b883; /* Vue 메인 컬러로 포커스 효과 */
}

.clear-btn {
  padding: 8px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.clear-btn:hover { background-color: #c0392b; }

.search-result {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}
.highlight-text {
  color: #e67e22; /* 검색어 강조 색상 */
}

/* 라디오 버튼 구역 */
.sort-group {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #555;
}

/* 날씨 목록 구역 */
.weather-list-section {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eef2f5;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.weather-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #ffffff;
}

/* 카드에 마우스를 올렸을 때 애니메이션 (transition과 결합) */
.weather-card:hover {
  border-color: #42b883;
  transform: translateY(-2px); /* 살짝 위로 떠오르는 효과 */
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.city-name {
  font-weight: bold;
  font-size: 16px;
}

.detail-btn {
  padding: 4px 10px;
  font-size: 12px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.detail-btn:hover {
  background-color: #e2e6ea;
}

.temp-text {
  margin: 4px 0 8px 0;
  font-size: 14px;
  color: #444;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* 뱃지 공통 스타일 */
.badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 12px;
  color: white;
  text-shadow: 0 1px 1px rgba(0,0,0,0.2);
}

.badge-danger { background-color: #f56c6c; }
.badge-warning { background-color: #e6a23c; }
.badge-primary { background-color: #409eff; }
.badge-success { background-color: #67c23a; }
.badge-info { background-color: #909399; }

/* 결과 없음 스타일 */
.no-result {
  text-align: center;
  padding: 20px;
  color: #888;
  font-size: 14px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

/* 하단 상태바 */
.status-bar {
  background-color: #e8f5e9;
  color: #2e7d32;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
}

.placeholder-text {
  color: #4caf50;
}
</style>