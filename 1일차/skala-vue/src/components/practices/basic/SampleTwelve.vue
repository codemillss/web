<script setup>
import { ref } from 'vue'

const count = ref(0)
const name = ref('홍길동')
const subCount = ref(0)
</script>

<template>
  <div class="practice-section">
    <h2>기타 디렉티브 (v-pre, v-once, v-memo)</h2>

    <h3>1) v-pre 디렉티브</h3>
    <p>일반 출력: {{ count }}</p>
    <p v-pre>v-pre 적용 (컴파일 건너뜀): {{ count }}</p>

    <br />
    <h3>2) v-once 디렉티브 (초기 렌더링 1회만 고정)</h3>
    <p>일반 업데이트: {{ count }}</p>
    <p v-once>v-once 적용 (최초 값 고정): {{ count }}</p>
    <button @click="count++">count 증가 ({{ count }})</button>

    <br />
    <br />
    <h3>3) v-memo 디렉티브 (의존성 값 변경 시에만 리렌더링)</h3>
    <p>subCount: {{ subCount }}</p>
    <!-- name이 바뀔 때만 아래 영역이 업데이트됨 -->
    <div v-memo="[name]">
      <p>v-memo[name] 영역 - name: {{ name }}, count: {{ count }}</p>
    </div>
    <button @click="name = name === '홍길동' ? '이순신' : '홍길동'">name 변경</button> &nbsp;
    <button @click="subCount++">subCount 증가</button>
  </div>
</template>
