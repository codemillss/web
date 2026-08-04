<script setup>
import { ref } from 'vue'

/*
  [v-show vs v-if]
  v-show는 조건이 false라도 DOM 요소는 무조건 그려두고 CSS로(display: none) 숨기기만 합니다.
  따라서 모달창, 드롭다운 메뉴처럼 "자주 껐다 켰다" 하는 UI에 성능상 훨씬 유리합니다.
*/
const isVisible = ref(true)

/*
  [v-for 디렉티브의 특징]
  1. 배열이나 객체를 반복하여 화면에 그려줍니다. (문법: `item in items`)
  2. ⚠️ <template> 안에서 v-for를 쓸 때는 **반드시 :key 속성**을 부여해서 
     Vue가 어떤 항목이 지워지고 추가됐는지 식별할 수 있게 해야 합니다. (버그 방지용)
*/
const fruits = ref(['사과', '바나나', '딸기'])
const user = ref({
  name: '홍길동',
  age: 25,
  role: '개발자'
})
const items = ref([
  { id: 'prod_101', name: '아이폰' },
  { id: 'prod_102', name: '갤럭시' },
])

// [추가 실습] v-for 응용: 리스트 추가 및 삭제 기능
const newFruit = ref('')
const addFruit = () => {
  if (newFruit.value.trim() !== '') {
    fruits.value.push(newFruit.value)
    newFruit.value = '' // 입력창 비우기
  }
}
const removeFruit = (index) => {
  // splice(시작인덱스, 지울개수)
  fruits.value.splice(index, 1)
}
</script>

<template>
<div class="practice-section">
  <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;">
    <h2>v-show 디렉티브 학습</h2>
    <p>💡 개발자 도구를 열어 요소(Elements) 탭을 확인해 보세요. 안 보일 때도 코드는 남아있고 <code>display: none</code>만 붙습니다.</p>
    
    <button @click="isVisible = !isVisible" style="background-color: #2c3e50; color: white; padding: 8px 15px;">
      화면 토글하기 (v-show)
    </button>
    <br />
    
    <!-- v-show 영역 -->
    <div v-show="isVisible" class="box">
      <p style="font-size: 18px; margin: 0; font-weight: bold;">📦 v-show 상자</p>
      <p style="margin-top: 5px; font-size: 13px;">조건이 false가 되면 CSS display: none이 붙어 눈에서만 사라집니다.</p>
    </div>
  </div>
  
  <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
    <h2>v-for 디렉티브 학습</h2>
    
    <!-- [추가 실습] 배열에 값 추가/삭제 -->
    <div style="background-color: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 15px;">
      <h3>1) 배열 렌더링 (추가/삭제 응용)</h3>
      <input type="text" v-model="newFruit" @keyup.enter="addFruit" placeholder="과일 이름 입력" style="padding: 5px;" />
      <button @click="addFruit" style="margin-left: 5px;">추가</button>
      
      <ul>
        <li v-for="(fruit, index) in fruits" :key="index" style="margin-bottom: 5px;">
          {{ index + 1 }}번 과일: <strong>{{ fruit }}</strong>
          <button @click="removeFruit(index)" style="margin-left: 10px; background-color: #ff7675; color: white; padding: 2px 6px; border: none; border-radius: 3px;">삭제</button>
        </li>
      </ul>
      <p v-if="fruits.length === 0" style="color: gray;">과일 바구니가 비어있습니다.</p>
    </div>

    <h3>2) 객체 렌더링 (value, key, index)</h3>
    <ul style="background-color: #eef2f3; padding: 15px; border-radius: 6px; list-style-type: none;">
      <!-- 객체는 값, 키, 인덱스 순서로 순회할 수 있습니다. -->
      <li v-for="(value, key, index) in user" :key="key" style="margin-bottom: 5px;">
        <span style="color: gray">[{{ index }}]</span> 
        <strong style="color: #2980b9;">{{ key }}</strong> : {{ value }}
      </li>
    </ul>

    <h3>3) 실무형 배열 내 객체 렌더링</h3>
    <ul style="padding-left: 20px;">
      <!-- 실무에서는 DB에서 가져온 고유 ID를 :key로 사용하는 것이 가장 안전합니다. -->
      <li v-for="(item, index) in items" :key="item.id" style="font-size: 15px; margin-bottom: 8px;">
        <span style="display: inline-block; width: 30px; text-align: center; background: #ddd; border-radius: 4px;">{{ index }}</span>
        상품명: <strong>{{ item.name }}</strong> (ID: {{ item.id }})
      </li>
    </ul>
  </div>
</div>
</template>

<style scoped>
.box {
  padding: 15px;
  margin-top: 15px;
  color: white;
  border-radius: 8px;
  background-color: #3498db;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
