<script setup>
import { reactive, ref, watch } from 'vue'

/*
  [reactive 데이터 watch 감시 규칙]
  1. reactive()로 선언된 객체를 통째로 watch에 넣으면, 내부적으로 `deep: true`가 강제로 자동 작동합니다.
  2. 따라서 내부 속성(price 등)이 변경되면 무조건 감지합니다.
  3. 하지만 통째로 감시하면 이전 값(oldVal)과 새로운 값(newVal)이 똑같은 객체를 가리키므로 과거 데이터를 추적할 수 없습니다.
  4. 과거 데이터를 비교해서 뭔가(예: "가격이 올랐나 떨어졌나?")를 판별하려면 반드시 화살표 함수로 특정 속성을 콕 집어야 합니다.
*/

// reactive로 선언한 묶음 상품 데이터
const state = reactive({
  productName: '노트북',
  price: 1000,
})

const logAutoDeep = ref('대기 중...')
const logTarget = ref('대기 중...')

// [추가 실습] 타겟 감시 로그 누적
const targetLogs = ref([])

// 🟢 1) 변수명 그대로 감시 (자동 deep: true 작동)
watch(state, (newVal, oldVal) => {
  // newVal.price와 oldVal.price가 똑같이 2000으로 나옵니다!
  logAutoDeep.value = `[자동 deep] 가격 변동! 이전가격인척하는:${oldVal.price}원 ➡️ 현재가격:${newVal.price}원`
})

// 🟢 2) 화살표 함수로 특정 속성만 감시 (이전 값 추적 가능!)
watch(
  () => state.price,
  (newPrice, oldPrice) => {
    // 🔥 특정 알맹이 값만 추출했으므로 진짜 과거 가격이 정상 보존됩니다.
    const diff = newPrice - oldPrice
    const diffText = diff > 0 ? `📈 ${diff}원 상승` : `📉 ${Math.abs(diff)}원 하락`
    
    logTarget.value = `[타겟 조준] 옛날값:${oldPrice}원 ➡️ 바뀐값:${newPrice}원 (${diffText})`
    targetLogs.value.unshift(`[${new Date().toLocaleTimeString()}] ${oldPrice} ➡️ ${newPrice} (${diffText})`)
  }
)
</script>

<template>
  <div class="practice-section">
    <h2>reactive() 데이터 watch 감시 규칙</h2>
    
    <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;">
      <h3>🛒 상품 정보 관리 (reactive)</h3>
      <p style="font-size: 18px;">상품명: <strong>{{ state.productName }}</strong> / 가격: <strong>{{ state.price }}</strong>원</p>
      
      <div style="display: flex; gap: 5px;">
        <button @click="state.price += 500" style="background-color: #e74c3c; color: white;">가격 500원 인상</button>
        <button @click="state.price -= 500" style="background-color: #3498db; color: white;">가격 500원 인하</button>
      </div>
    </div>
    
    <div class="monitor auto" style="background-color: #dfe6e9; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
      <h3 style="margin-top: 0;">👁️🗨️ 1) state 통째로 감시 (deep 자동화)</h3>
      <p style="color: #d63031; font-weight: bold;">{{ logAutoDeep }}</p>
      <small>※ 주의: 이전 값과 현재 값이 똑같이 찍혀서 증감 여부를 알 수 없습니다.</small>
    </div>
    
    <div class="monitor target" style="background-color: #a29bfe; padding: 15px; border-radius: 8px;">
      <h3 style="margin-top: 0; color: white;">🎯 2) () => state.price 콕 집어 감시</h3>
      <p style="color: #2d3436; font-weight: bold;">{{ logTarget }}</p>
      
      <!-- 누적 로그 출력 -->
      <ul style="font-size: 13px; color: #fff; max-height: 80px; overflow-y: auto;">
        <li v-for="(log, idx) in targetLogs" :key="idx">{{ log }}</li>
      </ul>
      
      <small style="color: white;">※ 성공: 과거의 원본 가격이 완벽히 보존되어 상승/하락 폭 계산이 가능합니다.</small>
    </div>
  </div>
</template>
