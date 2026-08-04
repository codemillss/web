<script setup>
// 1. 정의한 카운터 스토어 플러그인 import
import { useCounterStore } from '@/stores/counter.js'

/*
  [Pinia 전역 상태 관리 (Store) 기초]
  1. Store는 여러 컴포넌트에서 공통으로 쓰는 데이터를 한 곳(Global)에 모아두는 저장소입니다.
  2. useCounterStore()를 호출하면, 그 저장소에 접근할 수 있는 포인터(인스턴스)를 얻게 됩니다.
  3. 이 인스턴스를 통해 state(데이터), getters(파생 데이터), actions(함수)에 자유롭게 접근할 수 있습니다.
*/

// 2. 인스턴스 가동 (전역 저장소 포인터 확보)
const counterStore = useCounterStore()
</script>

<template>
  <div class="practice-section">
    <h2>📦 Pinia Counter Store 활용 실습</h2>
    
    <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 2px solid #27ae60; margin-bottom: 20px;">
      <h3 style="color: #27ae60; margin-top: 0;">전역 스토어 접근 결과</h3>
      
      <!-- 1. State (상태 접근) -->
      <p style="font-size: 16px;">
        원본 카운트 데이터 (State): <strong style="color: #2980b9; font-size: 20px;">{{ counterStore.count }}</strong>
      </p>
      
      <!-- 2. Getters (계산된 상태 접근) -->
      <p style="font-size: 16px;">
        2배 연산 데이터 (Getters): <strong style="color: #8e44ad; font-size: 20px;">{{ counterStore.doubleCount }}</strong>
      </p>
      
      <!-- 3. Actions (상태 변경 함수 접근) -->
      <div style="margin-top: 15px;">
        <button 
          @click="counterStore.increment" 
          style="background-color: #27ae60; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;"
        >
          ➕ 숫자 1 증가 (Actions 실행)
        </button>
      </div>
    </div>
  </div>
</template>
