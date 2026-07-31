<script setup>
import { ref } from 'vue'

// 1. 폼 요소 매핑 변수들
const textInput = ref('')
const memoText = ref('')
const isAgreed = ref(false)
const checkedHobbies = ref([])
const gender = ref('male')
const selectedCity = ref('seoul')

// 2. v-model 수식어 변수들
const lazyText = ref('')
const ageNumber = ref(0)
const trimmedText = ref('')
</script>

<template>
  <div class="practice-section">
    <h2>Vue Form Handling (v-model) 학습</h2>

    <h3>1) HTML 폼 요소와 v-model 바인딩</h3>
    <label>이름: </label>
    <input v-model="textInput" placeholder="이름 입력" />
    <p>입력값: {{ textInput }}</p>

    <label>자기소개: </label><br />
    <textarea v-model="memoText" placeholder="자기소개 입력"></textarea>
    <p>소개 내용: {{ memoText }}</p>

    <label>
      <input type="checkbox" v-model="isAgreed" />
      약관 동의 여부: {{ isAgreed }}
    </label>

    <br /><br />
    <label>취미 (다중 선택 체크박스):</label><br />
    <label><input type="checkbox" value="운동" v-model="checkedHobbies" /> 운동</label>
    <label><input type="checkbox" value="독서" v-model="checkedHobbies" /> 독서</label>
    <label><input type="checkbox" value="코딩" v-model="checkedHobbies" /> 코딩</label>
    <p>선택된 취미: {{ checkedHobbies }}</p>

    <label>성별 (라디오 버튼):</label><br />
    <label><input type="radio" value="male" v-model="gender" /> 남성</label>
    <label><input type="radio" value="female" v-model="gender" /> 여성</label>
    <p>선택된 성별: {{ gender }}</p>

    <label>도시 선택 (셀렉트 박스):</label>
    <select v-model="selectedCity">
      <option value="seoul">서울</option>
      <option value="busan">부산</option>
      <option value="incheon">인천</option>
    </select>
    <p>선택된 도시: {{ selectedCity }}</p>

    <br />
    <h3>2) v-model 수식어 (Modifiers)</h3>
    <label>.lazy (change 이벤트 시 업데이트): </label>
    <input v-model.lazy="lazyText" placeholder="입력 후 포커스 해제" />
    <p>결과: {{ lazyText }}</p>

    <label>.number (자동 숫자 형변환): </label>
    <input v-model.number="ageNumber" type="number" />
    <p>결과 타입: {{ typeof ageNumber }} (값: {{ ageNumber }})</p>

    <label>.trim (앞뒤 공백 제거): </label>
    <input v-model.trim="trimmedText" placeholder="공백 포함 입력" />
    <p>결과: "{{ trimmedText }}"</p>
  </div>
</template>
