<template>
  <div class="about-container">
    <el-card shadow="hover" class="travel-card">
      <h2 class="about-title">🗺️ 글로벌 여행 가이드 이용 안내</h2>

      <div class="about-content">
        <p class="intro-text">
          본 앱은 단순한 기상 관측을 넘어,
          <strong>전 세계의 날씨와 완벽하게 어우러지는 여행 코스</strong>를 추천해 드리는
          <strong>스마트 글로벌 여행 가이드</strong>입니다.
        </p>

        <h4 class="feature-title">✨ 여행에 특화된 주요 기능</h4>
        <ul class="feature-list">
          <li>
            <strong>🌍 3D 인터랙티브 여행 지도 (Globe.gl):</strong>
            세계 지도에서 핀을 클릭해 보세요. 여행 데이터가 있는 곳엔
            <strong>✈️ 비행기 마커</strong>가, 즐겨찾기한 도시엔 <strong>⭐ 별 마커</strong>가
            떠다닙니다.
          </li>
          <li>
            <strong>📸 날씨 맞춤형 AI 추천 명소:</strong>
            비가 오는 런던에선 실내 박물관을, 화창한 도쿄에선 야외 공원을! 현재 날씨에 딱 맞는
            관광지, 먹거리, 볼거리를 고품질 AI 일러스트와 함께 제안합니다.
          </li>
          <li>
            <strong>📍 내 위치 기반 즉석 브리핑:</strong>
            앱을 켜자마자 내 현재 위치의 날씨를 확인하고, 인공지능(AI)이 오늘 하루 어떤 야외 활동이
            좋을지 스마트하게 브리핑해 줍니다.
          </li>
          <li>
            <strong>⭐ 나만의 여행 위시리스트:</strong>
            가고 싶은 도시의 날씨 카드에서 <strong>'☆'</strong> 아이콘을 누르면, 왼쪽 사이드바에
            저장되어 언제든 클릭 한 번으로 여행지의 현재 상황을 볼 수 있습니다.
          </li>
        </ul>

        <h4 class="feature-title">🎒 떠나기 전 체크리스트</h4>
        <ol class="feature-list step-list">
          <li>
            <strong>어디로 갈까요?</strong> 메인 대시보드 중앙의
            <strong>'➕' (새로운 도시 추가)</strong> 창에 영문 도시명(예:
            <i>Paris, London, Sydney</i>)을 입력해 보세요.
          </li>
          <li>
            <strong>날씨를 볼까요?</strong> 검색한 지역의 상세 페이지로 들어가면 기온뿐 아니라
            <strong>주간 예보 차트</strong>와 <strong>대기질 현황</strong>까지 완벽히 분석해
            드립니다.
          </li>
          <li>
            <strong>무엇을 할까요?</strong> 상세 페이지 하단
            <strong>'✈️ 추천 여행 정보'</strong> 탭에서 관광지, 먹거리 리스트를 확인하고 동선을
            짜보세요.
          </li>
        </ol>
      </div>

      <el-button type="primary" size="large" class="home-btn" @click="$router.push('/hw6')" round>
        ✈️ 지금 바로 세계 여행 시작하기
      </el-button>
    </el-card>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 650px;
  margin: 0 auto;
  padding-bottom: 30px;
}
.travel-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
.about-title {
  color: #1a1c29;
  margin-top: 10px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 800;
  font-size: 26px;
}
.intro-text {
  font-size: 16px;
  line-height: 1.7;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 36px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #edf2f7;
}
.about-content {
  text-align: left;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 30px;
}
.feature-title {
  color: #3498db;
  font-size: 18px;
  font-weight: 700;
  margin-top: 30px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #ebf5ff;
}
.feature-list {
  padding-left: 0;
  list-style: none;
  margin-bottom: 0;
}
.feature-list li {
  margin-bottom: 16px;
  position: relative;
  padding-left: 28px;
}
.feature-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  color: #3498db;
  font-weight: bold;
  font-size: 18px;
}
.step-list li::before {
  content: '👉';
  font-size: 16px;
}
.feature-list strong {
  color: #2c3e50;
}
.home-btn {
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.5px;
  margin-top: 10px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border: none;
}
.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.3);
}
</style>
