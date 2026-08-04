<template>
  <div class="about-container">
    <el-card shadow="hover">
      <h2 class="about-title">ℹ️ 서비스 소개 (과제 6)</h2>
      
      <div class="about-content">
        <p>본 앱은 <strong>Vue 3, Vue Router, Pinia, Axios</strong> 그리고 <strong>Globe.gl</strong>을 활용하여 구현된 글로벌 3D 기상 관측 대시보드입니다.</p>
        
        <h4 class="feature-title">🚀 주요 기능 및 학습 내용</h4>
        <ul class="feature-list">
          <li><strong>3D 인터랙티브 지구본 (Globe.gl):</strong> 전 세계 국가의 경계선(GeoJSON)을 렌더링하고, 한국의 제주도, 독도, 울릉도까지 직접 매핑했습니다. 마우스 호버 시 입체적인 상호작용을 지원합니다.</li>
          <li><strong>위치 기반 자동 날씨 (Geolocation API):</strong> 사용자의 현재 위치를 자동으로 감지해 즉시 날씨를 브리핑합니다.</li>
          <li><strong>글로벌 도시 날씨 연동:</strong> 대륙별 대표 도시들을 초기화하여 한 눈에 보여주며, 새로운 영문 도시를 검색해 자유롭게 추가할 수 있습니다.</li>
          <li><strong>스마트 캐싱 & 스토리지:</strong> 추가된 도시는 브라우저 로컬 스토리지에 자동 저장되며 버전 키로 관리됩니다.</li>
          <li><strong>고급 UI/UX 최적화:</strong> 스켈레톤 로딩, 스크롤 가능한 날씨 카드, 가로/세로 최적화 배치를 통해 직관적인 대시보드 경험을 제공합니다.</li>
          <li><strong>즐겨찾기 및 단위 변경 (Pinia):</strong> 스토어를 통해 관심 지역을 전역으로 관리하고, 섭씨/화씨 변환이 실시간으로 모든 컴포넌트에 반영됩니다.</li>
        </ul>

        <h4 class="feature-title">📖 구체적인 사용 방법</h4>
        <ol class="feature-list">
          <li><strong>🌍 3D 지구본 조작:</strong> 마우스 드래그를 통해 지구본을 회전시킬 수 있으며, 스크롤을 통해 확대/축소가 가능합니다. 핀을 클릭하거나 국가에 마우스를 올리면 하얗게 빛나며 시각적 효과를 확인할 수 있습니다.</li>
          <li><strong>🔍 도시 날씨 검색 및 추가:</strong> 메인 대시보드 중앙의 <strong>'➕' (새로운 도시 추가)</strong> 입력창에 영문 도시명(예: <i>Paris, Tokyo, New York</i>)을 입력하고 엔터를 누르면 나만의 기상 관측 리스트에 영구적으로 추가됩니다.</li>
          <li><strong>🗺️ 대륙별 필터링:</strong> 상단의 지역별 날씨 현황 제목 옆에 위치한 대륙 버튼(아시아, 유럽 등)을 클릭하면, 지구본 시점이 해당 대륙으로 자동 이동하며 하단 목록이 필터링됩니다.</li>
          <li><strong>⭐ 즐겨찾기 설정:</strong> 날씨 카드 우측 상단이나 상세 페이지의 <strong>'☆'</strong> 아이콘을 클릭하면 즐겨찾기에 등록되어 왼쪽 사이드바에서 언제든 빠르게 접근할 수 있습니다.</li>
        </ol>
      </div>
      
      <el-button type="primary" class="home-btn" @click="$router.push('/hw6')">
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
