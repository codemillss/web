<script setup>
import { ref } from 'vue'

/*
  [ref()의 특징]
  1. 원시 타입(String, Number, Boolean 등)과 참조 타입(Object, Array) 모두 반응형으로 만들 수 있습니다.
  2. 스크립트(JS) 영역에서 값을 읽거나 쓸 때는 반드시 `.value` 속성을 사용해야 합니다.
  3. 템플릿(HTML) 영역에서는 Vue가 자동으로 `.value`를 풀어주므로(Unwrapping) 그냥 변수명만 씁니다.
*/

const count = ref(0)
const name = ref('홍길동')
const isActive = ref(true)
const items = ref(['사과', '배'])
const user = ref({ name: '이순신', age: 30 })

const increaseRef = () => {
  count.value++ // 스크립트에서는 .value 필수!
}

const changeUserName = () => {
  user.value.name = '장보고'
}

// [추가 실습] 모든 상태를 초기 상태로 되돌리는 함수
const resetAll = () => {
  count.value = 0
  name.value = '홍길동'
  isActive.value = true
  items.value = ['사과', '배']
  user.value = { name: '이순신', age: 30 }
}
</script>

<template>
  <div class="practice-section">
    <h2>반응형 상태 ref() 기초</h2>
    <p>Ref 카운트: <strong>{{ count }}</strong></p>
    <p>이름: <input v-model="name" />{{ name }}</p>
    <p>활성 상태: <span :style="{ color: isActive ? 'green' : 'red' }">{{ isActive ? '활성' : '비활성' }}</span></p>
    <p>과일 목록: {{ items.join(', ') }}</p>
    <p>사용자 정보: 이름- {{ user.name }}, 나이- {{ user.age }}</p>
    
    <div style="margin-top: 15px; display: flex; gap: 5px; flex-wrap: wrap;">
      <button @click="increaseRef">Ref 변수 증가</button>
      <button @click="isActive = !isActive">토글</button>
      <button @click="items.push('귤')">과일 추가</button>
      <button @click="changeUserName">사용자 이름 변경</button>
      
      <!-- 추가 실습: 상태 초기화 버튼 -->
      <button @click="resetAll" style="background-color: #e74c3c; color: white;">초기화(Reset)</button>
    </div>
  </div>
</template>
