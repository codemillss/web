<script setup>
import { ref, computed } from 'vue'

/*
  [computed()의 특징]
  1. 내부에 사용된 반응형 변수(의존성)가 변경될 때만 로직을 재실행합니다. (캐싱 효과)
  2. 의존성이 바뀌지 않았다면, 화면이 리렌더링되어도 이전에 계산해둔 결과값을 재사용하여 성능을 높입니다.
  3. 값을 리턴해야 하며, 읽기 전용으로 사용하는 것이 원칙입니다.
*/

const count = ref(0)
const dummy = ref(0) // computed와 무관한 변수 (리렌더링 유발용)

// 1. 일반 함수: 화면이 조금이라도 리렌더링(dummy 변경 등)되면 무조건 재실행됨
const getMethodResult = () => {
  console.log('❌ [일반 함수] 화면 리렌더링 시 무조건 실행됨!')
  return count.value * 2
}

// 2. Computed: count가 바뀔 때만 재연산됨 (dummy가 바뀔 땐 콘솔이 안 찍히고 이전 값 재사용)
const doubleCount = computed(() => {
  console.log('✅ [Computed] count가 변경되어 연산 실행됨!')
  return count.value * 2
})

// [추가 실습] 쇼핑몰 장바구니 할인율 계산 (복잡한 연산 시뮬레이션)
const originPrice = ref(10000)
const discountRate = ref(20)

const finalPrice = computed(() => {
  console.log('💰 [Computed] 할인된 최종 가격 계산 중...')
  return originPrice.value - (originPrice.value * (discountRate.value / 100))
})
</script>

<template>
  <div class="practice-section">
    <h2>computed() 캐싱 동작 비교</h2>
    <p><strong>count:</strong> {{ count }} | <strong>dummy:</strong> {{ dummy }}</p>
    
    <div style="display: flex; gap: 5px; margin-bottom: 15px;">
      <button @click="count++">count 증가 (의존성 변경 ⭕)</button>
      <button @click="dummy++">dummy 증가 (무관한 변경 ❌)</button>
    </div>
    
    <!-- dummy 버튼을 누를 때 개발자 도구 콘솔 출력 차이를 확인해 보세요 -->
    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
      <p>일반 함수 결과: <strong>{{ getMethodResult() }}</strong> (콘솔 확인 요망)</p>
      <p>Computed 결과: <strong>{{ doubleCount }}</strong> (콘솔 확인 요망)</p>
    </div>

    <hr style="margin: 20px 0;" />
    
    <!-- 추가 실습 화면 -->
    <h3>🛒 추가 실습: 쇼핑몰 할인 계산기 (Computed 활용)</h3>
    <p>원가: <input type="number" v-model="originPrice" step="1000" /> 원</p>
    <p>할인율: <input type="number" v-model="discountRate" step="5" /> %</p>
    <p style="font-size: 18px; color: #e67e22; font-weight: bold;">
      최종 결제 금액: {{ finalPrice.toLocaleString() }} 원
    </p>
  </div>
</template>
