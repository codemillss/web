<script setup>
import { ref } from 'vue'

/*
  [범위 지정 슬롯 (Scoped Slot)의 개념]
  1. 보통 데이터는 부모가 가지고 있고 자식에게 전달(Props)하지만,
     Scoped Slot은 반대로 **"자식이 가지고 있는 데이터"를 부모 컴포넌트의 슬롯 템플릿으로 역전달**해 줍니다.
  2. <slot :text="message" :count="userCount"></slot>
     -> 자식의 반응형 데이터(message, userCount)를 부모가 슬롯 바인딩 형태로 꺼내 쓸 수 있도록 개방합니다.
*/

// 하위 컴포넌트 내부에서 관리하는 2개의 서로 다른 기본형 데이터
const message = ref('현재 서버 상태 정상')
const userCount = ref(150)

// [추가 실습] 자식 내부에서 데이터를 변경해보는 기능
const refreshData = () => {
  userCount.value += Math.floor(Math.random() * 10) + 1
  message.value = `서버 상태 양호 (업데이트: ${new Date().toLocaleTimeString()})`
}
</script>

<template>
  <div class="base-card" style="border: 2px solid #8e44ad; border-radius: 8px; padding: 20px; background-color: #faf0fc; margin-bottom: 20px;">
    <h3 style="color: #8e44ad; margin-top: 0;">👧 하위 컴포넌트 (Child)</h3>
    <p style="font-size: 13px; color: #555;">(자식 내부 데이터: message, userCount 보유 중)</p>
    
    <button @click="refreshData" style="background-color: #8e44ad; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; margin-bottom: 15px;">
      🔄 자식 내부 데이터 변경해보기
    </button>

    <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e1bee7;">
      <!-- 부모에게 text, count 슬롯 속성을 실어서 템플릿 주입을 받음 -->
      <slot :text="message" :count="userCount">
        <p style="color: #7f8c8d; font-style: italic;">(부모가 마크업을 주입하지 않았을 때의 디폴트 화면입니다)</p>
      </slot>
    </div>
  </div>
</template>
