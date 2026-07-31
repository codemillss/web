<script setup>
import { ref } from 'vue'

// 1. v-show vs v-if 비교용
const isVisible = ref(true)

// 2. v-for 배열 데이터
const fruits = ref(['사과', '바나나', '딸기', '포도'])

// 3. v-for 객체 데이터
const userProfile = ref({
  name: '홍길동',
  age: 25,
  job: 'Vue 개발자'
})
</script>

<template>
  <div class="practice-section">
    <h2>v-show 및 v-for 디렉티브 학습</h2>

    <h3>1) v-if vs v-show 비교</h3>
    <button @click="isVisible = !isVisible">보이기 / 숨기기 토글</button>
    <p v-if="isVisible">v-if: DOM에서 아예 생성/제거됩니다.</p>
    <p v-show="isVisible">v-show: display: none 속성으로 숨겨집니다.</p>

    <br />
    <h3>2) v-for 배열 리스트 렌더링</h3>
    <ul>
      <li v-for="(fruit, index) in fruits" :key="index">
        {{ index + 1 }}번 과일: {{ fruit }}
      </li>
    </ul>

    <br />
    <h3>3) v-for 객체 속성 렌더링</h3>
    <ul>
      <li v-for="(value, key, index) in userProfile" :key="key">
        [{{ index }}] {{ key }}: {{ value }}
      </li>
    </ul>

    <br />
    <h3>4) v-for 숫자 범위 렌더링</h3>
    <span v-for="n in 5" :key="n" style="margin-right: 8px;">
      [{{ n }}]
    </span>
  </div>
</template>
