<script setup>
import { reactive } from 'vue'

/*
  [reactive()의 특징]
  1. 오직 객체(Object, Array, Map, Set 등) 타입만 반응형으로 만들 수 있습니다. (숫자, 문자열 불가)
  2. 스크립트(JS) 영역에서 값을 읽거나 쓸 때 `.value`가 필요 없습니다! 객체의 속성에 바로 접근합니다.
  3. ⚠️주의: 반응형 객체 자체를 통째로 덮어쓰거나 파괴(Destructuring)하면 반응성을 잃어버립니다.
*/

const userReactive = reactive({ name: '이순신', age: 30 })

const celebrateReactive = () => {
  userReactive.age++ // .value 없이 바로 속성에 접근!
}

const items = reactive(['사과', '바나나'])

const addItem = () => {
  items.push(`과일 ${items.length + 1}`)
}

const removeItem = (index) => {
  items.splice(index, 1)
}

// [추가 실습] reactive 상태 초기화 시 주의점
const resetReactive = () => {
  // ❌ userReactive = { name: '이순신', age: 30 } // 이렇게 통째로 재할당하면 에러 발생 또는 반응성 상실
  
  // ✅ 속성을 하나씩 덮어쓰거나, Object.assign을 사용해야 합니다.
  Object.assign(userReactive, { name: '이순신', age: 30 })
  
  // 배열 초기화 시에도 .length = 0으로 비우고 다시 push 하거나 splice를 씁니다.
  items.splice(0, items.length, '사과', '바나나')
}
</script>

<template>
  <div class="practice-section">
    <h2>반응형 상태 reactive() 특징 및 주의점</h2>
    <h3>1) 객체(Object) reactive</h3>
    <p>이름: {{ userReactive.name }} / 나이: {{ userReactive.age }}세</p>
    <button @click="celebrateReactive">reactive 나이 한 살 추가</button>
    
    <h3>2) 배열(Array) reactive</h3>
    <ul>
      <!-- :key 속성은 Vue가 리스트 항목을 효율적으로 식별/업데이트하기 위해 꼭 필요합니다. -->
      <li v-for="(item, index) in items" :key="index">
        {{ item }}
        <button @click="removeItem(index)" style="margin-left: 8px; padding: 2px 6px">삭제</button>
      </li>
    </ul>
    
    <div style="display: flex; gap: 5px; margin-top: 10px;">
      <button @click="addItem">과일 항목 추가</button>
      <!-- 추가 실습: 상태 초기화 버튼 -->
      <button @click="resetReactive" style="background-color: #e74c3c; color: white;">초기화(Object.assign)</button>
    </div>
  </div>
</template>
