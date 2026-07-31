<script setup>
import { ref } from 'vue'

const counter = ref(0)
const eventMessage = ref('')
const keyInput = ref('')

// 1. 이벤트 인자 전달
function addCount(amount) {
  counter.value += amount
}

// 2. 이벤트 객체($event) 접근
function handleNativeEvent(event, msg) {
  eventMessage.value = `${msg} (클릭 좌표: X=${event.clientX}, Y=${event.clientY})`
}

// 3. submit.prevent 실습
function handleSubmit() {
  alert('폼이 제출되었습니다! (페이지 리로드 방지됨)')
}

// 4. Enter 키 수식어
function handleEnter() {
  alert(`Enter 키 입력 완료: ${keyInput.value}`)
}
</script>

<template>
  <div class="practice-section">
    <h2>Vue Event Handling (v-on / @) 학습</h2>

    <h3>1) 기본 이벤트 및 인자 전달</h3>
    <p>현재 카운트: {{ counter }}</p>
    <button @click="addCount(1)">1 증가</button> &nbsp;
    <button @click="addCount(5)">5 증가</button>

    <br /><br />
    <h3>2) 네이티브 Event 객체 ($event) 사용</h3>
    <button @click="handleNativeEvent($event, '버튼이 클릭됨')">클릭 위치 정보 가져오기</button>
    <p>{{ eventMessage }}</p>

    <br />
    <h3>3) 이벤트 수식어 (.prevent, .stop)</h3>
    <form @submit.prevent="handleSubmit">
      <input placeholder="입력 후 제출" />
      <button type="submit">제출 (prevent 적용)</button>
    </form>

    <br />
    <h3>4) 키 수식어 (.enter)</h3>
    <input
      v-model="keyInput"
      @keyup.enter="handleEnter"
      placeholder="텍스트 입력 후 Enter 누르세요"
    />
  </div>
</template>
