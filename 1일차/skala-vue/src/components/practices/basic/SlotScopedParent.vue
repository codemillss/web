<script setup>
import SlotScopedChild from './SlotScopedChild.vue'

/*
  [Scoped Slot 수신 문법]
  1. 객체 통째로 받기: `v-slot="slotBag"` -> `slotBag.text`, `slotBag.count`
  2. 구조 분해 할당(Destructuring): `v-slot="{ text, count }"` -> `text`, `count` 바로 사용 (실무에서 유용!)
  3. 자식이 데이터를 보유하고 있지만, **"어떻게 렌더링(디자인)할 것인가"의 주도권은 부모**가 갖게 됩니다.
*/
</script>

<template>
  <div class="practice-section">
    <h2>🎯 Scoped Slot (범위 지정 슬롯) 주입 실습</h2>
    
    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 2px solid #2c3e50; margin-bottom: 20px;">
      <h3 style="color: #2c3e50; margin-top: 0;">👨‍👩‍👧 상위 컴포넌트 (Parent)</h3>
      <p style="font-size: 14px; color: #666;">
        자식이 넘겨준 슬롯 데이터(text, count)를 수신하여 부모가 원하는 디자인 패널로 커스텀 렌더링합니다.
      </p>

      <!-- 1) slotBag 객체 통째로 수신 (v-slot="slotBag") -->
      <div style="margin-bottom: 20px;">
        <h4>1) v-slot="slotBag" 전체 객체 수신 형태</h4>
        <SlotScopedChild v-slot="slotBag">
          <div class="display-panel" style="background: #edf2f7; padding: 12px; border-radius: 6px; border-left: 4px solid #3182ce;">
            <p style="margin: 0 0 5px 0; font-weight: bold; color: #2b6cb0;">📢 알림 메시지: {{ slotBag.text }}</p>
            <p style="margin: 0; color: #4a5568;">👥 접속자 수: <strong style="color: #dd6b20;">{{ slotBag.count }}</strong>명</p>
          </div>
        </SlotScopedChild>
      </div>

      <!-- 2) 구조 분해 할당 수신 (v-slot="{ text, count }") -->
      <div style="margin-bottom: 20px;">
        <h4>2) v-slot="{ text, count }" 구조 분해 할당 수신 (실무 스타일)</h4>
        <SlotScopedChild v-slot="{ text, count }">
          <div class="display-panel" style="background: #feebc8; padding: 12px; border-radius: 6px; border-left: 4px solid #dd6b20;">
            <p style="margin: 0; font-size: 16px; color: #7b341e;">
              ✨ [커스텀 카드] {{ text }} (현재 <b>{{ count }}</b>명 온라인)
            </p>
          </div>
        </SlotScopedChild>
      </div>

      <!-- 3) 부모가 마크업을 주입하지 않은 빈 슬롯 -->
      <div>
        <h4>3) 부모가 슬롯을 비워둔 경우 (Fallback 확인)</h4>
        <SlotScopedChild> </SlotScopedChild>
      </div>
    </div>
  </div>
</template>
