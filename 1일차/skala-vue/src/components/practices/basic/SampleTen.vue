<script setup>
import { ref } from 'vue'

/*
  [v-if 디렉티브의 특징]
  1. 조건이 true일 때만 DOM(화면)에 요소를 렌더링합니다.
  2. 조건이 false가 되면 DOM 요소 자체를 뜯어내서(파괴) 없애버립니다. (v-show와의 차이점)
  3. 토글 비용(그렸다 지웠다 하는 비용)이 높지만, 초기 렌더링 비용(조건이 false면 아예 안 그림)은 낮습니다.
*/

// 1. 조건부 온/오프 스위치 변수
const isLogged = ref(false)

// 2. 다중 조건 분기용 숫자 변수
const score = ref(85)

// [추가 실습] 실무형 탭 메뉴 UI용 변수
const currentTab = ref('A')
</script>

<template>
<div class="practice-section">
  <h2>v-if, v-else-if, v-else 디렉티브 학습</h2>
  
  <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;">
    <h3>1) 기본 로그인 상태 스위치 (v-if / v-else)</h3>
    <p v-if="isLogged" style="color: #27ae60; font-weight: bold;">🎉 환영합니다! 회원 전용 화면입니다.</p>
    <p v-else style="color: #e74c3c; font-weight: bold;">🔒 로그인이 필요합니다. 먼저 로그인해 주세요.</p>
    
    <button @click="isLogged = !isLogged" style="background-color: #34495e; color: white;">
      {{ isLogged ? '로그아웃 하기' : '로그인 하기' }}
    </button>
  </div>
  
  <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;">
    <h3>2) 성적별 학점 등급 측정 (v-if 다중 조건문)</h3>
    <label style="font-weight: bold;">현재 점수 입력: </label>
    <input type="number" v-model="score" min="0" max="100" step="5" style="padding: 5px; width: 60px;" /> 점
    <br /><br />
    
    <!-- v-if, v-else-if, v-else는 중간에 다른 태그가 끼어들면 에러가 납니다! 연달아 써야 합니다. -->
    <div v-if="score >= 90" style="color: green; font-weight: bold; font-size: 18px;">합격 등급: A 학점 (훌륭합니다!)</div>
    <div v-else-if="score >= 80" style="color: blue; font-size: 18px;">합격 등급: B 학점 (양호합니다.)</div>
    <div v-else-if="score >= 70" style="color: orange; font-size: 18px;">합격 등급: C 학점 (조금 더 분발하세요.)</div>
    <div v-else style="color: red; font-weight: bold; font-size: 18px;">불합격 등급: F 학점 (재시험 대상입니다.)</div>
  </div>

  <!-- 추가 실습: v-if를 이용한 탭 메뉴 구현 -->
  <div style="background-color: #f1f2f6; padding: 15px; border-radius: 8px;">
    <h3>3) [추가 실습] v-if를 활용한 탭(Tab) 메뉴 UI</h3>
    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
      <!-- 클릭 시 currentTab 값을 변경 -->
      <button @click="currentTab = 'A'" :class="{ 'active-tab': currentTab === 'A' }">상품 설명</button>
      <button @click="currentTab = 'B'" :class="{ 'active-tab': currentTab === 'B' }">상세 스펙</button>
      <button @click="currentTab = 'C'" :class="{ 'active-tab': currentTab === 'C' }">고객 리뷰</button>
    </div>
    
    <div style="padding: 20px; background: white; border: 1px solid #ccc; min-height: 80px;">
      <div v-if="currentTab === 'A'">
        <h4>상품 설명 탭입니다.</h4>
        <p>최신 기술이 적용된 스마트폰입니다. 화면에 보이는 요소만 렌더링됩니다.</p>
      </div>
      <div v-else-if="currentTab === 'B'">
        <h4>상세 스펙 탭입니다.</h4>
        <ul>
          <li>디스플레이: 6.7인치 OLED</li>
          <li>배터리: 5000mAh</li>
        </ul>
      </div>
      <div v-else-if="currentTab === 'C'">
        <h4>고객 리뷰 탭입니다.</h4>
        <p>⭐⭐⭐⭐⭐ - "정말 만족스럽습니다! 배송도 빠르네요."</p>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
/* 탭 메뉴를 위한 추가 스타일 */
button {
  padding: 8px 15px;
  background-color: #ecf0f1;
  border: 1px solid #bdc3c7;
  cursor: pointer;
  border-radius: 4px;
}
.active-tab {
  background-color: #3498db;
  color: white;
  border-color: #2980b9;
  font-weight: bold;
}
</style>
