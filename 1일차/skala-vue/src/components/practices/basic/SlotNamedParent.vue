<script setup>
import SlotNamedChild from './SlotNamedChild.vue'

/*
  [Named Slot 부모 주입 문법 규칙]
  1. 정식 문법: `<template v-slot:header>`
  2. 단축(축약) 문법: `<template #header>` (실무에서 가장 많이 사용!)
  3. `<template>` 태그에 싸여있지 않은 일반 요소들은 자동으로 이름이 없는 기본(default) 슬롯에 들어갑니다.
*/
</script>

<template>
  <div class="practice-section">
    <h2>🏷️ Named Slot (이름 있는 슬롯) 주입 실습</h2>
    
    <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
      자식 컴포넌트 내부의 <code>header</code>, <code>main(default)</code>, <code>footer</code> 슬롯 위치를 조준하여 원하는 주입 요소를 배치합니다.
    </p>

    <!-- 1) 정식 문법 (v-slot:header) 실습 -->
    <div style="margin-bottom: 25px;">
      <h3>1) v-slot:header 정식 문법 사용 예시</h3>
      <SlotNamedChild>
        <!-- name="header" 구멍으로 조준하여 주입 -->
        <template v-slot:header>
          <h3 style="margin: 0; color: #f1c40f;">📌 Child 주입 제목 (v-slot:header)</h3>
        </template>
        
        <!-- template 밖의 본문 내용은 자동으로 default 슬롯으로 들어감 -->
        <p style="font-size: 15px; color: #333; line-height: 1.6;">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        </p>
      </SlotNamedChild>
    </div>

    <!-- 2) 단축 문법 (#header, #footer) 응용 실습 -->
    <div>
      <h3>2) 단축 문법 (#header, #footer) 응용 예시</h3>
      <SlotNamedChild>
        <!-- #header 는 v-slot:header 와 완전히 동일합니다 -->
        <template #header>
          <h3 style="margin: 0; color: #1abc9c;">⚡ 단축 문법 제목 (#header)</h3>
        </template>
        
        <p style="font-size: 15px; color: #2c3e50;">
          단축 축약어(#)를 사용하면 코드가 훨씬 간결해집니다.
        </p>
        
        <!-- #footer 영역도 주입해 봅니다 -->
        <template #footer>
          <button style="background-color: #3498db; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer;">
            확인 버튼 주입
          </button>
        </template>
      </SlotNamedChild>
    </div>
  </div>
</template>
