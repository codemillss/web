<script setup>
import { ref, watchEffect } from 'vue'

/*
  [watchEffect()의 특징과 원리]
  1. watch와 달리 감시할 대상을 명시하지 않습니다.
  2. 콜백 함수 내부에 사용된 반응형 변수(여기서는 username, age)를 '자동으로' 감시 리스트에 등록합니다.
  3. 가장 큰 특징: 컴포넌트가 마운트될 때(처음 렌더링될 때) **즉시 1번 실행(Immediate)** 됩니다!
     (따라서 초기 데이터 패칭 API 호출 등에 매우 유용합니다.)
*/

const username = ref('홍길동')
const age = ref(20)
const logMessage = ref('대기 중...')

// [추가 실습] 자동 실행 횟수 카운터
const effectCount = ref(0)

// watchEffect 가동: 감시 대상을 지정하는 파라미터가 없습니다!
watchEffect(() => {
  // Vue가 이 내부 코드를 읽고 'username'과 'age'를 자동으로 추적합니다.
  effectCount.value++
  logMessage.value = `[자동 감지 ${effectCount.value}회차] 이름: ${username.value} / 나이: ${age.value}세`
  
  // 화면이 처음 켜질 때 1등으로 즉시 실행되는 증거를 콘솔에서 확인합니다.
  console.log(`🤖 [watchEffect 실행] 내부 변수 변경 감지! (총 ${effectCount.value}번 실행됨)`)
})
</script>

<template>
  <div class="practice-section">
    <h2>자동 감시자 watchEffect()</h2>
    <p>이름: <strong>{{ username }}</strong> / 나이: <strong>{{ age }}</strong>세</p>
    
    <div style="display: flex; gap: 5px; margin-bottom: 15px;">
      <button @click="username = username === '홍길동' ? '이순신' : '홍길동'">이름 토글(홍길동/이순신)</button>
      <button @click="age++">나이 한 살 추가 (age++)</button>
    </div>
    
    <div class="monitor" style="background-color: #e8f4f8; padding: 15px; border-radius: 8px;">
      <h3>👁️🗨️ watchEffect 자동 모니터링 시스템</h3>
      <p style="color: #0984e3; font-weight: bold; font-size: 16px;">{{ logMessage }}</p>
      
      <!-- 추가 주석 포인트: 왜 버튼을 안 눌렀는데 1회차일까? -->
      <div style="margin-top: 10px; padding: 10px; background-color: #ffeaa7; border-radius: 4px; font-size: 13px;">
        💡 <strong>핵심 개념:</strong> 새로고침하자마자 버튼을 안 눌러도 로그가 이미 1회차로 찍혀있는 것을 확인하셨나요? 
        이것이 watchEffect의 <b>"즉시 실행(Immediate Execution)"</b> 특징입니다!
      </div>
    </div>
  </div>
</template>
