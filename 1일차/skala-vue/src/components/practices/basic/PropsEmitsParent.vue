<script setup>
import { ref } from 'vue'
import PropsEmitsChild from './PropsEmitsChild.vue'

/*
  [Props & Emits 흐름 개념 정리]
  1. Props (부모 ➔ 자식 Down):
     - 부모가 가지고 있는 상태(message)를 자식의 속성에 바인딩(`:parent-data="message"`)하여 전달합니다.
  2. Emits (자식 ➔ 부모 Up):
     - 자식에서 이벤트가 발생하면(`emit('update-request', payload)`), 부모는 `@update-request="handleUpdateRequest"`로 감지하여 자신의 상태(message)를 변경합니다.
*/

// 1. 상위 컴포넌트의 로컬 반응형 상태 정의
const message = ref('Parent 초기 메시지')

// 2. 하위 컴포넌트의 커스텀 이벤트를 수신했을 때 실행될 핸들러 함수
// 인자(newValue)로 하위 컴포넌트가 보낸 페이로드가 자동 주입됩니다.
const handleUpdateRequest = (newValue) => {
  message.value = newValue
}

// [추가 실습] 부모 상태 초기화 함수
const resetMessage = () => {
  message.value = 'Parent 초기 메시지'
}
</script>

<template>
  <div class="practice-section">
    <h2>컴포넌트간 데이터 전달: Props & Emits</h2>
    
    <div class="parent-container" style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 2px solid #2c3e50;">
      <h3 style="color: #2c3e50; margin-top: 0;">👨‍👩‍👧 상위 컴포넌트 (Parent)</h3>
      
      <p style="font-size: 16px;">
        현재 로컬 데이터(State): <strong style="color: #e74c3c; font-size: 18px;">{{ message }}</strong>
      </p>
      
      <button @click="resetMessage" style="background-color: #95a5a6; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;">
        부모 데이터 초기화
      </button>

      <br /><br />
      
      <!-- 자식 컴포넌트에 props 전달(:parent-data) 및 emit 이벤트 수신(@update-request) -->
      <PropsEmitsChild 
        :parent-data="message" 
        @update-request="handleUpdateRequest" 
      />
    </div>
  </div>
</template>
