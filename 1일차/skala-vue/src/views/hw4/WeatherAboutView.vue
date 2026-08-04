<template>
  <div class="about-container">
    <el-card shadow="hover">
      <h2 class="about-title">ℹ️ 서비스 소개</h2>
      
      <div class="about-content">
        <p>본 앱은 Vue 3 및 Vue Router 4 기반 제작된 실습용 기상 관측 대시보드 시스템입니다.</p>
        <ul class="feature-list">
          <li><code>components/exercise/</code> 폴더 내부의 독립 부품 연동</li>
          <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
          <li>URL 쿼리 스트링 매핑을 활용한 실시간 검색 상태 동기화</li>
        </ul>
      </div>
      
      <el-button type="primary" class="home-btn" @click="$router.push('/hw4')">
        대시보드 홈으로 이동
      </el-button>
    </el-card>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 520px;
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
.about-content p {
  margin-top: 0;
  margin-bottom: 15px;
}
.feature-list {
  padding-left: 20px;
  margin-bottom: 0;
}
.feature-list li {
  margin-bottom: 8px;
}
.home-btn {
  width: 100%;
}
</style>
