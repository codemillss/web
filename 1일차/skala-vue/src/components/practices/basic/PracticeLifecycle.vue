<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

// 카운터 상태
const count = ref(0)
let timerId = null // 실시간 타이머 메모리 주소를 담을 변수

// 라이프사이클 로그를 화면에도 시각적으로 보여주기 위한 배열
const logs = ref([])
const addLog = (msg) => {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift(`[${time}] ${msg}`)
}

// 1. 생성 (Creation) 단계 = <script setup> 본문 그 자체
console.log('1. [setup] 컴포넌트가 메모리에 생성되었습니다. (DOM 접근 불가능)')
addLog('1. [setup] 컴포넌트 생성됨 (메모리 로드)')

// 2. 부착 (Mounting) 단계
onMounted(() => {
  console.log('2. [onMounted] 화면에 완벽히 부착되었습니다! (API 호출/DOM 조작 적기)')
  addLog('2. [onMounted] 화면 부착 완료! (타이머 3초 시작)')
  
  // 🔥 실무 활용 시뮬레이션: 3초마다 숫자가 자동으로 올라가는 타이머 가동
  timerId = setInterval(() => {
    count.value++
  }, 3000)
})

// 3. 갱신 (Updating) 단계 - count 변수가 바뀌어서 화면이 리렌더링될 때마다 매번 실행된다.
onUpdated(() => {
  console.log(`3. [onUpdated] 데이터가 변경되어 화면을 새로 그렸습니다. (현재 count: ${count.value})`)
  addLog(`3. [onUpdated] 화면 리렌더링 완료! (count: ${count.value})`)
})

// 4. 소멸 (Unmounting) 단계 - v-if="false"나 다른 라우터 이동 등으로 컴포넌트가 사라질 때 실행된다.
onUnmounted(() => {
  // ❌ 주의: 여기서 타이머를 안 꺼주면 컴포넌트가 사라져도 백그라운드에서 영원히 타이머가 돕니다! (메모리 누수)
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
  console.log('4. [onUnmounted] 컴포넌트가 소멸했습니다. 타이머 청소 완료!')
})
</script>

<template>
  <div class="practice-section">
    <h2>🔄 Component Lifecycle Hook (생명주기) 학습</h2>
    
    <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;">
      <h3>⏱️ 실시간 자동 카운터</h3>
      <p style="font-size: 18px;">
        현재 카운트: <strong style="color: #2980b9; font-size: 24px;">{{ count }}</strong>
      </p>
      <small style="color: gray;">(onMounted에서 가동한 타이머로 인해 3초마다 1씩 증가합니다)</small>
      
      <div style="margin-top: 10px; display: flex; gap: 5px;">
        <button @click="count++" style="background-color: #27ae60; color: white;">수동으로 Count 증가 (onUpdated 유발)</button>
      </div>
    </div>

    <!-- 라이프사이클 4단계 안내 설명 -->
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef; margin-bottom: 15px;">
      <h4>📘 컴포넌트 생명주기 4단계 요약</h4>
      <ul style="font-size: 14px; line-height: 1.6; padding-left: 20px;">
        <li><b>1. Setup (생성):</b> <code>&lt;script setup&gt;</code> 실행 시점. 데이터 초기화 단계.</li>
        <li><b>2. onMounted (부착):</b> HTML DOM에 컴포넌트가 실제로 그려진 직후. <i>(서버 API 요청, 타이머 시작 적기)</i></li>
        <li><b>3. onUpdated (갱신):</b> 반응형 데이터(count)가 바뀌어 화면이 다시 그려진 직후.</li>
        <li><b>4. onUnmounted (소멸):</b> 다른 페이지로 이동하거나 컴포넌트가 파괴될 때. <i>(타이머 clearInterval 필수!)</i></li>
      </ul>
    </div>

    <!-- 라이프사이클 이력 모니터링 로그 -->
    <div class="monitor" style="background-color: #2c3e50; color: white; padding: 15px; border-radius: 8px;">
      <h3 style="color: #f1c40f; margin-top: 0;">📜 라이프사이클 훅 실행 실시간 로그</h3>
      <p style="font-size: 13px; color: #bdc3c7;">(다른 메뉴/페이지로 이동하면 콘솔창에서 4. [onUnmounted] 로그를 확인하실 수 있습니다)</p>
      
      <ul style="font-size: 13px; max-height: 150px; overflow-y: auto; padding-left: 20px; color: #1abc9c;">
        <li v-for="(log, idx) in logs" :key="idx">{{ log }}</li>
      </ul>
    </div>
  </div>
</template>
