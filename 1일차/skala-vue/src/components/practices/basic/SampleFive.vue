<script setup>
/*
  [v-text 및 일반 보간법 {{}} vs v-html 차이점]
  1. {{ }} (일반 보간법) 및 v-text:
     - 입력된 문자열을 '순수 텍스트(Plain Text)'로만 취급합니다.
     - 태그와 스타일 속성이 있어도 문자열 그대로 출력하여 효과가 적용되지 않습니다.

  2. v-html:
     - 문자열 속 HTML 태그 및 inline style(색상, 배경색 등)을 브라우저가 실제로 해석하여 화면에 스타일링을 적용합니다.
*/

// 육안으로 명확히 구분할 수 있도록 형광펜 배경색과 글자색 스타일이 들어간 HTML 태그 정의
const content = '<mark style="background-color: #ffeaa7; color: #d63031; font-size: 20px; font-weight: bold; padding: 5px 10px; border-radius: 4px;">🔥 하이라이트(형광펜) 적용 텍스트 🔥</mark>'
</script>

<template>
<div class="practice-section">
  <h2>v-text vs v-html 디렉티브 극명한 시각적 비교</h2>
  
  <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;">
    <h3>1) 일반 보간법 {{}} 결과 (스타일 미적용 ❌):</h3>
    <p style="background: #f8f9fa; padding: 10px; word-break: break-all;">출력: {{ content }}</p>
    <small style="color: #e74c3c;">※ HTML 코드(스타일)가 적용되지 않고 외계어처럼 텍스트 코드가 그대로 보입니다.</small>
  </div>
  
  <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;">
    <h3>2) v-text 디렉티브 결과 (스타일 미적용 ❌):</h3>
    <p v-text="'출력: ' + content" style="background: #f8f9fa; padding: 10px; word-break: break-all;"></p>
    <small style="color: #e74c3c;">※ v-text 역시 태그나 스타일을 무시하고 그대로 텍스트로 찍어냅니다.</small>
  </div>

  <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
    <h3>3) v-html 디렉티브 결과 (스타일 완벽 적용 ⭕):</h3>
    <div style="background: #f8f9fa; padding: 15px; margin-top: 5px;">
      출력: <span v-html="content"></span>
    </div>
    <small style="color: #27ae60; font-weight: bold; display: block; margin-top: 8px;">
      ※ v-html을 사용해야만 노란 형광펜 배경과 빨간 글자 스타일 태그가 실제 디자인으로 적용됩니다!
    </small>
  </div>
</div>
</template>
