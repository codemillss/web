<script setup>
import { ref, watch } from 'vue'

/*
  [ref 객체/배열 감시의 함정]
  1. ref로 감싼 객체의 "내부 속성(name, age 등)"이 변경되는 것은 기본 watch로 감지하지 못합니다.
  2. 왜냐하면 ref 자체의 주소값(.value)은 그대로이기 때문입니다.
  3. 해결책 1: { deep: true } 옵션을 켜서 객체 안쪽 끝까지 싹 다 뒤져서 감시하게 합니다. (단점: 무거움, 이전 값 추적 불가)
  4. 해결책 2: 감시할 특정 속성만 "화살표 함수"로 콕 집어 감시합니다. (장점: 가벼움, 이전 값 정상 추적)
*/

const user = ref({
  name: '홍길동',
  age: 20,
})

const logDeep = ref('아직 반응 없음')
const logTarget = ref('아직 반응 없음')

// [추가 실습] 누적 로그
const targetLogs = ref([])

// 해결책 1: deep 옵션을 켜서 객체 하위 속성 전체 감시하기
watch(
  user,
  (newVal) => {
    // deep 옵션은 객체 참조가 같으므로 newVal과 oldVal이 완전히 똑같습니다. (그래서 옛날 값을 못 씀)
    logDeep.value = `[deep 감지] 누군가 변경됨! 현재 이름: ${newVal.name}, 나이: ${newVal.age}`
  },
  { deep: true }
)

// 해결책 2: 화살표 함수로 특정 속성(age)만 콕 집어 감시하기 (★이전 값 추적 가능!)
watch(
  () => user.value.age,
  (newAge, oldAge) => {
    logTarget.value = `[타겟 감지] 나이가 ${oldAge}세 ➡️ ${newAge}세로 변경됨!`
    targetLogs.value.unshift(`[${new Date().toLocaleTimeString()}] ${oldAge} ➡️ ${newAge}`)
  }
)
</script>

<template>
  <div class="practice-section">
    <h2>ref 객체/배열 감시 (deep vs 화살표 함수)</h2>
    
    <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;">
      <h3>👨‍💻 회원 데이터 조작 panel</h3>
      <p style="font-size: 18px;">이름: <strong>{{ user.name }}</strong> / 나이: <strong>{{ user.age }}</strong>세</p>
      
      <div style="display: flex; gap: 5px;">
        <!-- 이름만 변경 시, 타겟 감시는 발동하지 않고 deep 감지만 발동합니다. -->
        <button @click="user.name = user.name === '홍길동' ? '이순신' : '홍길동'">이름만 토글</button>
        <!-- 나이 변경 시 둘 다 발동합니다. -->
        <button @click="user.age++">나이만 변경 (age++)</button>
      </div>
    </div>
    
    <div class="monitor" style="background-color: #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
      <h3 style="margin-top: 0;">👁️🗨️ 1) deep: true 모니터 (전체 감시)</h3>
      <p style="color: #d35400; font-weight: bold;">{{ logDeep }}</p>
      <small>※ 장점: 속성 100개 중 아무거나 하나만 바뀌어도 알아챔 / 단점: 무겁고 옛날 값(oldVal) 확인 불가</small>
    </div>
    
    <div class="monitor target" style="background-color: #74b9ff; padding: 15px; border-radius: 8px;">
      <h3 style="margin-top: 0; color: white;">🎯 2) 화살표 함수 모니터 (나이만 타겟 감시)</h3>
      <p style="color: #0984e3; font-weight: bold;">{{ logTarget }}</p>
      
      <!-- 누적 로그 출력 -->
      <ul style="font-size: 13px; color: #fff; max-height: 80px; overflow-y: auto;">
        <li v-for="(log, idx) in targetLogs" :key="idx">{{ log }}</li>
      </ul>
      
      <small style="color: white;">※ 장점: 빠르고 정확하며 옛날 값(oldVal) 완벽 보존 / 단점: 콕 집은 속성(age) 외에는 둔감함</small>
    </div>
  </div>
</template>
