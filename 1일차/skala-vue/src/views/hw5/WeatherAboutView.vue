<template>
  <div class="about-container">
    <el-card shadow="hover">
      <h2 class="about-title">ℹ️ 서비스 소개 (과제 5)</h2>
      
      <div class="about-content">
        <p>본 앱은 <strong>Vue 3, Vue Router, Pinia, 그리고 Axios</strong>를 총동원하여 실제 인터넷의 날씨 데이터를 연동한 기상 관측 대시보드입니다.</p>
        
        <h4 class="feature-title">🚀 주요 기능 및 학습 내용</h4>
        <ul class="feature-list">
          <li><strong>실시간 API 연동 (Axios):</strong> OpenWeatherMap API를 호출하여 실제 서울, 수원, 부산의 날씨 데이터를 받아옵니다.</li>
          <li><strong>스켈레톤 UI 적용:</strong> 네트워크 지연 시간 동안 빈 화면 대신 부드러운 애니메이션 스켈레톤 UI를 보여주어 사용자 경험을 향상시켰습니다.</li>
          <li><strong>초성 검색 & 실시간 동기화:</strong> 한글의 자모음 분리 로직 및 네이티브 Input 이벤트를 활용해 타이핑 즉시 결과를 필터링합니다.</li>
          <li><strong>클라이언트 라우팅:</strong> Vue Router를 이용해 새로고침 없는 화면 전환과 파라미터 기반 상세 페이지 이동을 구현했습니다.</li>
          <li><strong>전역 환경설정 (Pinia):</strong> 단위(섭씨/화씨) 변경 스토어를 구축하여 앱 전체의 온도가 한 번에 변경됩니다.</li>
          <li><strong>즐겨찾기 연동 (Pinia + 로컬스토리지):</strong> 어느 컴포넌트에서든 별모양(⭐)을 누르면 전역 스토어를 통해 실시간으로 상태가 동기화되며 데이터가 유지됩니다.</li>
        </ul>
      </div>
      
      <el-button type="primary" class="home-btn" @click="$router.push('/hw5')">
        대시보드 홈으로 이동
      </el-button>
    </el-card>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 580px;
  margin: 0 auto;
}
.about-title {
  color: #303133;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: left;
}
.about-content {
  text-align: left;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 30px;
}
.feature-title {
  color: #409eff;
  margin-top: 25px;
  margin-bottom: 15px;
}
.about-content p {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 15px;
}
.feature-list {
  padding-left: 20px;
  margin-bottom: 0;
}
.feature-list li {
  margin-bottom: 12px;
}
.feature-list strong {
  color: #2c3e50;
}
.home-btn {
  width: 100%;
}
</style>
