<script setup>
import { ref } from 'vue'

/*
  [v-model의 핵심 개념]
  1. 폼(Form) 요소(input, textarea, select 등)와 반응형 변수(ref)를 양방향으로 연결합니다.
  2. 사용자가 화면에서 값을 입력하면 -> 변수가 바뀜.
  3. 스크립트에서 변수 값을 바꾸면 -> 화면 입력창의 값도 바뀜.
  4. 실제로는 :value(값 바인딩)와 @input(이벤트 리스너)을 합쳐놓은 축약(Syntax Sugar) 문법입니다.
*/

// 기본 v-model
const text1 = ref('') // v-model용 변수
const text2 = ref('') // 원리 이해용 변수

// 폼 요소
const comment = ref('')
const isAgreed = ref(false)
const favoriteFruits = ref([])
const gender = ref('')
const selectedCar = ref('')

// 수식어
const lazyText = ref('')
const age = ref('')
const userEmail = ref('')
const price = ref('')
</script>

<template>
<div class="practice-section" style="max-width: 800px;">
  <h2>v-model 양방향 데이터 바인딩</h2>
  
  <div style="background-color: #f1f2f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3>1) v-model 축약 문법 (가장 많이 씀)</h3>
    <input type="text" v-model="text1" placeholder="여기에 입력하세요" style="padding: 8px; width: 100%; box-sizing: border-box;" />
    <p>입력된 값: <strong style="color: #2980b9;">{{ text1 }}</strong></p>
    
    <hr style="margin: 15px 0; border: 0; border-top: 1px dashed #ccc;" />

    <h3>2) v-model의 내부 작동 원리 (단방향 + 이벤트 조합)</h3>
    <p style="font-size: 13px; color: gray;">v-model은 사실 아래와 같이 <code>:value</code>와 <code>@input</code>을 합친 것입니다.</p>
    <input type="text" :value="text2" @input="(e) => (text2 = e.target.value)" placeholder="원리 파악용 입력창" style="padding: 8px; width: 100%; box-sizing: border-box;" />
    <p>입력된 값: <strong style="color: #e67e22;">{{ text2 }}</strong></p>
  </div>

  <h2>모든 HTML Form 요소와 v-model 매핑</h2>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
    <div style="border: 1px solid #ddd; padding: 10px; border-radius: 6px;">
      <h4>📝 Textarea (장문 텍스트)</h4>
      <textarea v-model="comment" placeholder="의견을 남겨주세요" style="width: 100%; height: 60px;"></textarea>
      <p style="font-size: 13px;">상태: <span style="color: blue">{{ comment }}</span></p>
    </div>
    
    <div style="border: 1px solid #ddd; padding: 10px; border-radius: 6px;">
      <h4>☑️ 단일 Checkbox (동의 여부)</h4>
      <!-- 체크박스는 기본적으로 true/false 불리언 값과 연결됩니다. -->
      <label> <input type="checkbox" v-model="isAgreed" /> 약관에 동의합니다. </label>
      <p style="font-size: 13px;">상태: <span style="color: blue">{{ isAgreed }}</span></p>
    </div>
    
    <div style="border: 1px solid #ddd; padding: 10px; border-radius: 6px;">
      <h4>☑️ 다중 Checkbox (복수 선택)</h4>
      <!-- 여러 체크박스에 같은 v-model을 걸어주면 선택된 value들이 배열에 들어갑니다. -->
      <label><input type="checkbox" value="사과" v-model="favoriteFruits" /> 사과</label> &nbsp;
      <label><input type="checkbox" value="바나나" v-model="favoriteFruits" /> 바나나</label> &nbsp;
      <label><input type="checkbox" value="딸기" v-model="favoriteFruits" /> 딸기</label>
      <p style="font-size: 13px;">상태(배열): <span style="color: blue">{{ favoriteFruits }}</span></p>
    </div>
    
    <div style="border: 1px solid #ddd; padding: 10px; border-radius: 6px;">
      <h4>🔘 Radio (단일 선택)</h4>
      <label><input type="radio" value="남성" v-model="gender" /> 남성</label> &nbsp;
      <label><input type="radio" value="여성" v-model="gender" /> 여성</label>
      <p style="font-size: 13px;">상태: <span style="color: blue">{{ gender }}</span></p>
    </div>
    
    <div style="border: 1px solid #ddd; padding: 10px; border-radius: 6px; grid-column: 1 / span 2;">
      <h4>🔽 Select (드롭다운 선택)</h4>
      <select v-model="selectedCar" style="padding: 5px;">
        <!-- v-model과 value가 일치하는 option이 자동 선택됩니다. -->
        <option value="">-- 브랜드를 선택하세요 --</option>
        <option value="tesla">테슬라</option>
        <option value="hyundai">현대자동차</option>
        <option value="bmw">BMW</option>
      </select>
      <p style="font-size: 13px;">상태: <span style="color: blue">{{ selectedCar }}</span></p>
    </div>
  </div>

  <h2 style="margin-top: 30px;">v-model 수식어 (Modifiers) 실무 활용</h2>
  <div style="background-color: #fffaf0; padding: 15px; border-radius: 8px; border: 1px solid #f39c12;">
    <!-- 1) .lazy 수식어 실습-->
    <section style="margin-bottom: 20px; border-bottom: 1px dashed #ccc; padding-bottom: 15px;">
      <h3 style="margin-top: 0; color: #d35400;">1) .lazy 수식어 (검색창 최적화)</h3>
      <p style="font-size: 13px;">입력할 때는 변하지 않다가, <b>Enter키를 치거나 입력창 밖을 클릭(blur)할 때</b> 값이 반영됩니다.</p>
      <input type="text" v-model.lazy="lazyText" placeholder="입력 후 Enter 또는 외부 클릭" style="padding: 5px; width: 250px;" />
      <p>확정된 값: <strong>{{ lazyText }}</strong></p>
    </section>
    
    <!-- 2) .number 수식어 실습-->
    <section style="margin-bottom: 20px; border-bottom: 1px dashed #ccc; padding-bottom: 15px;">
      <h3 style="margin-top: 0; color: #d35400;">2) .number 수식어 (자동 숫자 형변환)</h3>
      <p style="font-size: 13px;">HTML input은 기본적으로 문자열(String)을 반환합니다. 이를 숫자로 바꿔줍니다.</p>
      <input type="text" v-model.number="age" placeholder="나이를 입력하세요" style="padding: 5px;" />
      <p>입력된 값: <strong>{{ age }}</strong> / 타입: <strong style="color: blue;">{{ typeof age }}</strong></p>
    </section>
    
    <!-- 3) .trim 수식어 실습-->
    <section style="margin-bottom: 20px; border-bottom: 1px dashed #ccc; padding-bottom: 15px;">
      <h3 style="margin-top: 0; color: #d35400;">3) .trim 수식어 (양끝 공백 자동 제거)</h3>
      <p style="font-size: 13px;">회원가입 아이디/이메일 입력 시 실수로 들어간 스페이스바 공백을 없앱니다.</p>
      <input type="text" v-model.trim="userEmail" placeholder="앞뒤 공백을 포함해 쳐보세요" style="padding: 5px; width: 250px;" />
      <p>공백 제거된 값: <strong>"{{ userEmail }}"</strong> (길이: {{ userEmail.length }})</p>
    </section>
    
    <!-- 4) 수식어 체이닝 (Chaining) 실습-->
    <section>
      <h3 style="margin-top: 0; color: #d35400;">4) 수식어 체이닝 (.trim.number)</h3>
      <p style="font-size: 13px;">수식어는 연달아 쓸 수 있습니다! (공백 제거 후 숫자로 변환)</p>
      <input type="text" v-model.trim.number="price" placeholder="공백과 숫자를 섞어보세요" style="padding: 5px; width: 250px;" />
      <p>처리된 값: <strong>"{{ price }}"</strong> / 타입: <strong style="color: blue;">{{ typeof price }}</strong></p>
    </section>
  </div>
</div>
</template>
