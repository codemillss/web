<script setup>
/*
  [이름이 있는 슬롯 (Named Slot)의 개념]
  1. 하나의 자식 컴포넌트 안에 여러 개의 슬롯 구멍이 있을 때 구분하기 위해 `name="슬롯이름"` 속성을 붙입니다.
  2. <slot name="header"></slot> -> 헤더 슬롯
  3. <slot></slot> (name이 없는 슬롯) -> 기본(default) 슬롯
  4. 부모 컴포넌트에서는 `<template v-slot:header>` 또는 약어인 `<template #header>` 구문으로 
     원하는 위치를 명확히 지목하여 HTML을 주입할 수 있습니다.
*/
</script>

<template>
  <div class="base-card" style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px;">
    <!-- Named Slot: header 영역 -->
    <header style="background-color: #34495e; color: white; padding: 12px 20px;">
      <slot name="header">
        <h4 style="margin: 0; color: #bdc3c7;">기본 헤더 제목</h4>
      </slot>
    </header>

    <!-- Default Slot: main 영역 (이름 없는 슬롯) -->
    <main style="padding: 20px;">
      <slot>
        <p style="color: #95a5a6;">기본 본문 영역입니다.</p>
      </slot>
    </main>

    <!-- Named Slot: footer 영역 (추가 실습) -->
    <footer style="background-color: #f8f9fa; padding: 10px 20px; border-top: 1px solid #eee; text-align: right;">
      <slot name="footer">
        <small style="color: #7f8c8d;">기본 푸터 저작권 표시</small>
      </slot>
    </footer>
  </div>
</template>
