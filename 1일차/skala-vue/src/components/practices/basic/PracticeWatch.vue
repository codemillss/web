<script setup>
import { ref, watch } from 'vue'

/*
  [watch()의 특징과 원리]
  1. 특정 반응형 상태(ref, reactive 등) 하나를 콕 집어서 감시합니다.
  2. 첫 번째 인자: 감시할 대상 / 두 번째 인자: 실행할 콜백 함수 (새로운 값, 이전 값).
  3. 초기에 화면이 렌더링될 때는 실행되지 않고, 값이 실제로 '변경'될 때만 발동합니다.
  4. 주로 데이터 변경에 따른 '비동기 통신(API 호출)', '타이머', '수동 DOM 조작' 등 부수 효과(Side Effect) 처리에 씁니다.
*/

const currentCity = ref('서울')
const logMessage = ref('아직 감시 시스템이 작동하지 않았습니다.')

// [추가 실습] 로그 기록을 화면에 누적하기 위한 배열
const logHistory = ref([])

// currentCity 변수를 유심히 감시하는 watch 시스템 가동
watch(currentCity, (newValue, oldValue) => {
  // 값이 바뀌는 순간, 바뀐 알맹이(값) 두 개가 자동으로 주입됩니다.
  logMessage.value = `📍 감시자 발동! [${oldValue}] ➡️ [${newValue}]`
  
  // 변경 이력을 배열의 맨 앞에 추가 (최신순)
  logHistory.value.unshift(`[${new Date().toLocaleTimeString()}] ${oldValue}에서 ${newValue}로 변경됨`)
  
  // 실무 활용처 시뮬레이션
  console.log(`🤖 [서버 요청 완료] 기상청 서버에서 ${newValue}의 날씨 API를 다시 조회합니다...`)
})
</script>

<template>
  <div class="practice-section">
    <h2>감시자 watch()의 원리와 실무 활용</h2>
    <h3>🏙️ 지역 선택 제어판</h3>
    <p>현재 선택된 도시: <strong>{{ currentCity }}</strong></p>
    
    <div style="margin-bottom: 15px; display: flex; gap: 5px;">
      <!-- 버튼 클릭 시 currentCity 상태가 변경되며, 이 순간 watch가 이를 감지하여 실행됩니다. -->
      <button @click="currentCity = '서울'">서울 선택</button>
      <button @click="currentCity = '수원'">수원 선택</button>
      <button @click="currentCity = '부산'">부산 선택</button>
    </div>
    
    <div class="monitor" style="background-color: #f1f2f6; padding: 15px; border-radius: 8px;">
      <h3>👁️🗨️ 파수꾼(watch) 모니터링 시스템</h3>
      <p style="color: #e17055; font-weight: bold;">{{ logMessage }}</p>
      
      <!-- 추가 실습: 누적 로그 히스토리 출력 -->
      <ul style="font-size: 13px; color: #555; max-height: 100px; overflow-y: auto; padding-left: 20px;">
        <li v-for="(log, idx) in logHistory" :key="idx">{{ log }}</li>
      </ul>
      
      <small style="color: gray; display: block; margin-top: 10px;">(개발자 도구 콘솔창(F12)에서도 API 호출 시뮬레이션 로그를 확인해 보세요)</small>
    </div>
  </div>
</template>
