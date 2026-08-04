<script setup>
import SlotDefaultChild from './SlotDefaultChild.vue'

/*
  [부모 컴포넌트의 슬롯 활용]
  - 하나의 동일한 자식 카드 컴포넌트(SlotDefaultChild)를 재사용하면서,
    내부에 들어갈 레이아웃(텍스트, 경고창, 버튼 등)을 부모 마음대로 다르게 주입할 수 있습니다.
*/
</script>

<template>
  <div class="practice-section">
    <h2>🎰 Default Slot 레이아웃 주입 실습</h2>
    
    <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
      동일한 카드 컴포넌트 안에 부모가 서로 다른 HTML 요소(텍스트, 버튼, 경고창 등)를 주입합니다.
    </p>

    <!-- 1) 단순 텍스트 주입 -->
    <div style="margin-bottom: 20px;">
      <h3>1) 단순 텍스트 주입 예시</h3>
      <SlotDefaultChild>
        <p style="color: #2c3e50; font-size: 16px; margin: 0;">
          📝 단순한 텍스트 문장을 자식 컴포넌트 슬롯에 주입합니다.
        </p>
      </SlotDefaultChild>
    </div>

    <!-- 2) 커스텀 HTML 및 버튼 주입 -->
    <div style="margin-bottom: 20px;">
      <h3>2) 커스텀 HTML 및 버튼 주입 예시</h3>
      <SlotDefaultChild>
        <h3 style="color: #e74c3c; margin-top: 0;">🔥 경고 상태 (Custom UI)</h3>
        <p style="font-size: 14px; color: #555;">시스템에 문제가 발생했습니다. 확인 버튼을 누르세요.</p>
        <button style="background-color: #e74c3c; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">
          확인
        </button>
      </SlotDefaultChild>
    </div>

    <!-- 3) 빈 슬롯 주입 (Fallback Default 테스트) -->
    <div>
      <h3>3) 슬롯 내용 없이 호출 (기본값 Fallback 테스트)</h3>
      <SlotDefaultChild>
        <!-- 부모가 내용을 비워두면 자식 내부의 <slot> 기본 텍스트가 나타납니다. -->
      </SlotDefaultChild>
    </div>
  </div>
</template>
