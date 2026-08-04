<script setup>
import { ref, watch } from 'vue'

/*
  [watch 다중 감시 배열]
  1. 감시해야 할 상태가 여러 개일 때, 첫 번째 인자에 배열 `[변수1, 변수2]` 형태로 넣습니다.
  2. 콜백 함수의 인자도 배열 구조 분해 할당을 통해 `([새값1, 새값2], [이전값1, 이전값2])` 형태로 받습니다.
  3. 실무에서는 검색 조건(검색어, 카테고리, 날짜 등) 여러 개 중 하나라도 변경되면 
     서버에 API를 재요청해야 하는 상황(통합 필터링)에 매우 자주 사용됩니다.
*/

const city = ref('서울')
const dateType = ref('오늘')
const apiStatus = ref('대기 중...')

// [추가 실습] 검색 버튼 클릭 없이 즉각 반영되는 로딩 스피너 시뮬레이션
const isLoading = ref(false)

// 두 개의 ref 변수를 배열[] 형태로 묶어 동시에 감시합니다.
watch([city, dateType], ([newCity, newDate], [oldCity, oldDate]) => {
  apiStatus.value = `[변경 감지] ${oldCity}(${oldDate}) ➡️ ${newCity}(${newDate})`
  
  // 실무 활용 시뮬레이션: 네트워크 로딩 처리
  isLoading.value = true
  console.log(`🤖 [API 호출 중] ${newCity}의 ${newDate} 날씨를 불러옵니다...`)
  
  // 1초 뒤에 로딩 완료 (가상의 API 응답)
  setTimeout(() => {
    isLoading.value = false
    console.log(`✅ [API 응답 완료] ${newCity} 날씨 데이터 수신 성공!`)
  }, 1000)
})
</script>

<template>
  <div class="practice-section">
    <h2>여러 개의 변수 동시 감시 (watch 배열)</h2>
    <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;">
      <h3>🛠️ 날씨 필터 조건 설정 (하나라도 바뀌면 즉시 서버에 요청)</h3>
      
      <div style="margin-bottom: 10px;">
        <label style="font-weight: bold; margin-right: 10px;">🏙️ 도시:</label>
        <select v-model="city" style="padding: 5px;">
          <option value="서울">서울</option>
          <option value="수원">수원</option>
          <option value="부산">부산</option>
          <option value="제주">제주</option>
        </select>
      </div>
      
      <div>
        <label style="font-weight: bold; margin-right: 10px;">📅 날짜:</label>
        <!-- 라디오 버튼을 v-model로 묶으면 하나만 선택되는 그룹이 됩니다. -->
        <label><input type="radio" value="오늘" v-model="dateType" /> 오늘</label> &nbsp;
        <label><input type="radio" value="내일" v-model="dateType" /> 내일</label> &nbsp;
        <label><input type="radio" value="주간예보" v-model="dateType" /> 주간예보</label>
      </div>
    </div>

    <div class="monitor" style="background-color: #34495e; color: white; padding: 15px; border-radius: 8px;">
      <h3 style="color: #f1c40f; margin-top: 0;">📡 통합 모니터링 & 네트워크 콘솔</h3>
      <p style="font-size: 15px;">감시 상태: <strong>{{ apiStatus }}</strong></p>
      
      <!-- 추가 실습: 로딩 스피너 UI 시뮬레이션 -->
      <div v-if="isLoading" style="color: #1abc9c; font-weight: bold; font-size: 14px; margin-top: 10px;">
        ⏳ 기상청 API 서버와 통신 중입니다... (1초 뒤 완료)
      </div>
      <div v-else style="color: #bdc3c7; font-size: 13px; margin-top: 10px;">
        ✔️ 통신 대기 중 (조건을 변경해 보세요)
      </div>
    </div>
  </div>
</template>
