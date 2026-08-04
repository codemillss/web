<script setup>
import { ref } from 'vue'
// v-pre, v-cloak
const message = ref('안녕하세요! (네트워크 지연 시 숨겨집니다)')
// v-once
const count = ref(1)
// v-memo
const name = ref('홍길동')
const age = ref(20)
</script>

<template>
<div v-cloak class="practice-section">
  <h2>특수 디렉티브 학습</h2>
  
  <h3>1) v-pre 디렉티브</h3>
  <p>일반 출력: {{ message }}</p>
  <p v-pre>v-pre 출력: {{ message }}</p>
  
  <hr />
  
  <h3>2) v-cloak 디렉티브</h3>
  <p>{{ message }}</p>

  <hr />
  
  <h3>3) v-once 디렉티브</h3>
  <p>일반 변수 (실시간): {{ count }}</p>
  <p v-once>v-once 변수 (최초 고정): {{ count }}</p>
  <button @click="count++">숫자 증가 버튼</button>

  <hr />

  <h3>4) v-memo 디렉티브</h3>
  <div v-memo="[name]" style="padding: 20px; border: 1px solid #42b883; margin-bottom: 10px">
    <p>📦 v-memo 적용 영역 (기준: name)</p>
    <p>이름: {{ name }}</p>
    <p>나이: {{ age }} (name이 바뀌어야 얘도 갱신됨)</p>
  </div>
  <button @click="name = '이순신'">1. 이름 변경 (이순신)</button> &nbsp;
  <button @click="age++">2. 나이 한 살 추가 (age++)</button>
</div>
</template>

<style scoped>
/* ⚠️ 필수: Vue가 로딩되기 전까지 해당 구역을 물리적으로 숨기는 CSS 규칙 */
[v-cloak] {
  display: none !important;
}
hr {
  margin: 20px 0;
}
</style>
