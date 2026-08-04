<script setup>
/*
  [하위 컴포넌트 (Child)의 핵심 역할]
  1. defineProps: 상위 컴포넌트가 내려준 데이터(props)를 선언하고 검증(type, required 등)합니다.
     - ⚠️ 단방향 데이터 흐름: 하위 컴포넌트에서 전달받은 props를 직접 수정하면 안 됩니다! (Read-Only)
  2. defineEmits: 상위 컴포넌트로 이벤트를 보낼 식별자(이벤트 이름)를 등록합니다.
  3. emit('이벤트명', 전달할데이터): 상위 컴포넌트 방향으로 신호(이벤트)와 데이터(payload)를 보냅니다.
*/

// 1. 상위 컴포넌트로부터 주입받을 데이터의 자료형 및 필수 여부 정의
defineProps({
  parentData: {
    type: String,
    required: true,
  },
})

// 2. 상위 컴포넌트로 송신할 커스텀 이벤트 식별자 등록
const emit = defineEmits(['update-request'])

// 3. 내부 이벤트 발생 시 페이로드를 실어 상위로 이벤트를 디스패치하는 함수
const sendNotification = () => {
  const payload = `Child에서 가공한 새로운 데이터 (${new Date().toLocaleTimeString()})`
  emit('update-request', payload)
}
</script>

<template>
  <div class="child-container" style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; border: 2px dashed #3498db; margin-top: 15px;">
    <h3 style="color: #2980b9; margin-top: 0;">👧 하위 컴포넌트 (Child)</h3>
    
    <p style="font-size: 15px;">
      수신된 Props 데이터 (부모가 준 데이터): <strong style="color: #2c3e50; background: #fff; padding: 3px 8px; border-radius: 4px;">{{ parentData }}</strong>
    </p>
    
    <button @click="sendNotification" style="background-color: #3498db; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; font-weight: bold;">
      🚀 상위 컴포넌트로 갱신 요청 (Emit 발송)
    </button>
  </div>
</template>
