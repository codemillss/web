<script setup>
/*
  [기본 슬롯 (Default Slot)의 개념]
  1. 컴포넌트 내부 템플릿에 <slot></slot> 태그를 배치해 둡니다.
  2. 부모 컴포넌트가 <SlotDefaultChild> ... </SlotDefaultChild> 사이에 넣은 모든 HTML/텍스트가 
     이 <slot> 자리에 통째로 끼워넣어집니다(주입/Slot Injection).
  3. <slot> 안에 작성된 콘텐츠는 부모가 아무 내용도 주입하지 않았을 때 대신 보여지는 "기본 fallback 콘텐츠"가 됩니다.
*/
</script>

<template>
  <div class="base-card" style="border: 1px solid #ccc; border-radius: 8px; padding: 15px; margin-bottom: 15px; background-color: #fdfdfd; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
    <!-- 부모가 주입한 HTML이 들어오는 구멍(slot) -->
    <slot>
      <!-- 부모가 빈 슬롯(<SlotDefaultChild></SlotDefaultChild>)으로 호출했을 때 표시되는 기본 값 -->
      <p style="color: #7f8c8d; font-style: italic; margin: 0;">ℹ️ (부모가 주입한 내용이 없어 표시되는 기본 콘텐츠입니다)</p>
    </slot>
  </div>
</template>

<style scoped>
.base-card {
  transition: transform 0.2s;
}
.base-card:hover {
  transform: translateY(-2px);
}
</style>
