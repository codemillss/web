/**
 * 도시별 여행 추천 데이터
 * 각 도시별 관광지, 먹거리, 볼거리/체험 정보를 제공합니다.
 */

const travelDatabase = {
  Seoul: {
    image: '/travel/seoul.png',
    attractions: [
      {
        name: '경복궁',
        desc: '조선왕조의 정궁으로 한국 전통 건축의 정수를 감상할 수 있는 궁궐입니다. 수문장 교대식도 볼 수 있어요.',
        category: '역사',
      },
      {
        name: 'N서울타워',
        desc: '남산 꼭대기에 위치한 서울의 랜드마크. 야경이 환상적이며, 사랑의 자물쇠로도 유명합니다.',
        category: '뷰포인트',
      },
      {
        name: '북촌 한옥마을',
        desc: '600년 역사의 한옥이 밀집한 전통 마을. 한복 체험과 함께 산책하기 좋습니다.',
        category: '문화',
      },
    ],
    food: [
      {
        name: '떡볶이 & 순대',
        desc: '매콤달콤한 떡볶이와 쫄깃한 순대의 조합. 광장시장이나 종로 포장마차에서 즐겨보세요.',
      },
      {
        name: '삼겹살',
        desc: '숯불에 구운 두툼한 삼겹살을 상추쌈과 함께. 한국 대표 먹거리입니다.',
      },
      {
        name: '비빔밥',
        desc: '신선한 야채와 고추장이 어우러진 건강한 한 그릇. 전주식과 서울식 모두 추천합니다.',
      },
    ],
    activities: [
      { name: '한강 야경 크루즈', desc: '한강 위에서 서울의 화려한 야경을 감상하는 특별한 경험.' },
      {
        name: '명동 쇼핑',
        desc: 'K-뷰티, K-패션의 메카. 다양한 화장품과 패션 브랜드가 밀집해 있습니다.',
      },
      {
        name: '인사동 전통 체험',
        desc: '전통 찻집, 공예품 쇼핑, 서예 체험 등 한국 문화를 가까이 느낄 수 있습니다.',
      },
    ],
    weatherTip: {
      rain: '비 오는 날엔 코엑스 스타필드나 지하상가 쇼핑을 추천합니다.',
      hot: '무더운 날엔 한강 수영장이나 에어컨 빵빵한 카페를 추천합니다.',
      cold: '추운 날엔 따뜻한 찜질방에서 사우나 체험을 즐겨보세요.',
      clear: '맑은 날엔 북한산 등산이나 한강 자전거 라이딩을 추천합니다!',
    },
  },

  Busan: {
    image: '/travel/busan_jeju.png',
    attractions: [
      {
        name: '해운대 해수욕장',
        desc: '한국 최고의 해변. 여름에는 해수욕, 겨울에는 해변 산책로가 인기입니다.',
        category: '자연',
      },
      {
        name: '감천문화마을',
        desc: '알록달록한 집들이 계단식으로 늘어선 한국의 마추픽추. 벽화와 조형물이 인상적입니다.',
        category: '문화',
      },
      {
        name: '태종대',
        desc: '해안 절벽 위의 공원으로 탁 트인 바다 전망이 일품입니다.',
        category: '자연',
      },
    ],
    food: [
      {
        name: '돼지국밥',
        desc: '부산의 소울푸드. 진한 돼지뼈 육수에 쫄깃한 고기가 들어간 든든한 한 그릇.',
      },
      { name: '씨앗호떡', desc: 'BIFF 광장의 명물. 씨앗과 꿀이 가득한 바삭한 호떡입니다.' },
      {
        name: '회(사시미)',
        desc: '자갈치 시장에서 싱싱한 활어회를 즐겨보세요. 부산만의 신선함입니다.',
      },
    ],
    activities: [
      { name: '해동 용궁사', desc: '바다 위 절벽에 세워진 사원. 일출과 함께 방문하면 장관입니다.' },
      {
        name: '광안리 야경',
        desc: '광안대교의 야경을 바라보며 카페에서 여유로운 시간을 보내세요.',
      },
      {
        name: '자갈치 시장',
        desc: '한국 최대의 수산시장. 회를 직접 골라 즉석에서 맛볼 수 있습니다.',
      },
    ],
    weatherTip: {
      rain: '비 오는 날엔 부산 영화체험박물관이나 신세계 센텀시티에서 시간을 보내세요.',
      hot: '더운 날엔 해운대 해수욕장에서 시원하게 물놀이를 즐겨보세요.',
      cold: '쌀쌀한 날엔 해동 용궁사에서 따뜻한 차를 마시며 바다를 감상하세요.',
      clear: '맑은 날엔 이기대 해안 산책로를 따라 걸어보세요!',
    },
  },

  Jeju: {
    image: '/travel/busan_jeju.png',
    attractions: [
      {
        name: '한라산',
        desc: '해발 1,947m의 대한민국 최고봉. 사계절 아름다운 등산 코스가 있습니다.',
        category: '자연',
      },
      {
        name: '성산일출봉',
        desc: 'UNESCO 세계자연유산. 일출 명소로 화산 분화구의 장관을 만끽할 수 있습니다.',
        category: '자연',
      },
      {
        name: '만장굴',
        desc: '세계 최장급 용암 동굴. 천연기념물로 신비로운 지하 세계를 체험합니다.',
        category: '자연',
      },
    ],
    food: [
      {
        name: '흑돼지 구이',
        desc: '제주 흑돼지의 쫄깃하고 담백한 맛은 제주에서만 맛볼 수 있는 특별함입니다.',
      },
      {
        name: '전복죽',
        desc: '제주 바다에서 갓 잡은 전복으로 끓인 고소한 죽. 아침 식사로 최고입니다.',
      },
      {
        name: '해물뚝배기',
        desc: '싱싱한 해산물이 가득 담긴 뜨끈한 뚝배기. 제주 바다의 맛을 담았습니다.',
      },
    ],
    activities: [
      { name: '올레길 트레킹', desc: '제주의 해안선을 따라 걷는 26개 코스의 도보 여행길.' },
      { name: '감귤 따기 체험', desc: '제주의 대표 과일 감귤을 직접 따고 맛보는 체험.' },
      {
        name: '우도 자전거',
        desc: '제주 동쪽의 작은 섬 우도에서 자전거를 타며 에메랄드빛 바다를 감상하세요.',
      },
    ],
    weatherTip: {
      rain: '비 오는 날엔 제주 유리의 성이나 아쿠아플라넷을 방문해보세요.',
      hot: '더운 날엔 협재 해변에서 에메랄드빛 바다를 즐겨보세요.',
      cold: '추운 날엔 제주 감귤 카페에서 따뜻한 감귤차를 즐겨보세요.',
      clear: '맑은 날엔 한라산 등반이나 성산일출봉에서 일출을 감상하세요!',
    },
  },

  Tokyo: {
    image: '/travel/tokyo.png',
    attractions: [
      {
        name: '센소지 (浅草寺)',
        desc: '도쿄에서 가장 오래된 사원. 거대한 카미나리몬 등불이 상징적입니다.',
        category: '역사',
      },
      {
        name: '시부야 스크램블',
        desc: '세계에서 가장 바쁜 교차로. 네온사인이 빛나는 도쿄의 상징적 풍경입니다.',
        category: '도시',
      },
      {
        name: '메이지 신궁',
        desc: '도심 속 거대한 숲에 둘러싸인 신사. 평화로운 산책을 즐길 수 있습니다.',
        category: '문화',
      },
    ],
    food: [
      {
        name: '라멘',
        desc: '진한 돈코츠(돼지뼈) 육수의 라멘. 이치란, 후쿠 등 명점이 곳곳에 있습니다.',
      },
      {
        name: '스시 (초밥)',
        desc: '츠키지 어시장 주변의 스시야에서 신선한 회를 올린 에도마에 초밥을 맛보세요.',
      },
      {
        name: '타코야키 & 오코노미야키',
        desc: '길거리 간식의 대표주자. 바삭한 겉과 부드러운 속이 환상적입니다.',
      },
    ],
    activities: [
      {
        name: '아키하바라 전자상가',
        desc: '애니메이션, 게임, 전자기기의 성지. 오타쿠 문화를 체험해보세요.',
      },
      {
        name: '도쿄 디즈니랜드',
        desc: '아시아 최대의 디즈니 리조트. 온 가족이 즐길 수 있는 테마파크.',
      },
      {
        name: '하라주쿠 패션 거리',
        desc: '일본 스트릿 패션의 중심지. 독특한 카페와 숍이 가득합니다.',
      },
    ],
    weatherTip: {
      rain: '비 오는 날엔 도쿄 국립박물관이나 teamLab 디지털 아트를 추천합니다.',
      hot: '더운 날엔 오다이바 해변이나 아쿠아시티에서 시원하게 보내세요.',
      cold: '추운 날엔 온센(온천)에서 몸을 녹이고, 뜨끈한 라멘을 즐겨보세요.',
      clear: '맑은 날엔 도쿄 스카이트리 전망대에서 후지산 전경을 감상하세요!',
    },
  },

  London: {
    image: '/travel/london.png',
    attractions: [
      {
        name: '빅 벤 & 웨스트민스터',
        desc: '런던의 상징적 시계탑. 템즈강변의 웅장한 건축물과 함께 감상하세요.',
        category: '역사',
      },
      {
        name: '타워 브릿지',
        desc: '빅토리아 시대의 걸작. 야간 조명이 특히 아름답습니다.',
        category: '건축',
      },
      {
        name: '대영박물관',
        desc: '세계 3대 박물관 중 하나. 이집트 미라부터 그리스 조각까지 무료 관람 가능.',
        category: '문화',
      },
    ],
    food: [
      {
        name: '피시 앤 칩스',
        desc: '영국의 국민 음식. 바삭한 튀김옷의 생선과 굵은 감자튀김의 클래식 조합.',
      },
      { name: '애프터눈 티', desc: '스콘, 샌드위치, 케이크와 함께 즐기는 전통 영국식 티타임.' },
      {
        name: '선데이 로스트',
        desc: '일요일에 즐기는 영국 전통 가정식. 로스트 비프와 요크셔 푸딩이 핵심입니다.',
      },
    ],
    activities: [
      {
        name: '런던아이 관람차',
        desc: '템즈강 위 135m 높이에서 런던 시내를 360도로 조망할 수 있습니다.',
      },
      {
        name: '뮤지컬 웨스트엔드',
        desc: '브로드웨이와 쌍벽을 이루는 런던의 뮤지컬 극장가. 라이온킹, 위키드 등.',
      },
      {
        name: '버킹엄 궁전 근위병 교대식',
        desc: '매일 열리는 전통 교대식. 붉은 제복의 근위병들이 인상적입니다.',
      },
    ],
    weatherTip: {
      rain: '비 오는 날엔 대영박물관이나 내셔널 갤러리에서 무료 예술 감상을 추천합니다.',
      hot: '더운 날엔 하이드파크에서 피크닉을 즐겨보세요.',
      cold: '추운 날엔 따뜻한 영국식 펍에서 맥주 한 잔과 함께 쉬어가세요.',
      clear: '맑은 날엔 템즈강변 산책과 런던아이 탑승을 추천합니다!',
    },
  },

  'New York': {
    image: '/travel/newyork.png',
    attractions: [
      {
        name: '자유의 여신상',
        desc: '뉴욕의 상징이자 미국 자유의 상징. 페리를 타고 리버티 섬으로 방문하세요.',
        category: '역사',
      },
      {
        name: '타임스퀘어',
        desc: '세계의 교차로. 거대한 LED 스크린과 네온사인이 쉴 새 없이 빛나는 에너지 넘치는 광장.',
        category: '도시',
      },
      {
        name: '센트럴파크',
        desc: '맨해튼 한복판의 거대한 도시공원. 조깅, 보트, 산책 등 다양한 활동이 가능합니다.',
        category: '자연',
      },
    ],
    food: [
      {
        name: '뉴욕 피자',
        desc: '얇고 넓은 크러스트에 토마토소스와 모차렐라. 접어서 먹는 것이 뉴요커 스타일.',
      },
      {
        name: '베이글 & 크림치즈',
        desc: '뉴욕 아침의 상징. 쫄깃한 베이글에 두꺼운 크림치즈를 발라 드세요.',
      },
      {
        name: '핫도그',
        desc: '길거리 벤더의 대표 메뉴. 머스타드와 사우어크라우트를 곁들여 보세요.',
      },
    ],
    activities: [
      {
        name: '브로드웨이 뮤지컬',
        desc: '세계 최고의 뮤지컬 공연. 해밀턴, 오페라의 유령 등 전설적인 작품들.',
      },
      {
        name: '엠파이어 스테이트 빌딩',
        desc: '86층 전망대에서 바라보는 맨해튼 스카이라인은 잊을 수 없는 경험.',
      },
      {
        name: '브루클린 브릿지 워크',
        desc: '맨해튼과 브루클린을 잇는 역사적 다리 위를 걸어보세요.',
      },
    ],
    weatherTip: {
      rain: '비 오는 날엔 메트로폴리탄 미술관이나 자연사박물관을 방문하세요.',
      hot: '더운 날엔 센트럴파크 분수에서 더위를 식히세요.',
      cold: '추운 날엔 록펠러 센터 아이스링크에서 스케이트를 타보세요.',
      clear: '맑은 날엔 하이라인 공원 산책을 강력 추천합니다!',
    },
  },

  Cairo: {
    image: '/travel/cairo.png',
    attractions: [
      {
        name: '기자의 대피라미드',
        desc: '세계 7대 불가사의 중 유일하게 현존하는 건축물. 4,500년의 신비를 직접 체험하세요.',
        category: '역사',
      },
      {
        name: '스핑크스',
        desc: '사자의 몸에 인간의 머리를 가진 거대한 석상. 피라미드와 함께 이집트의 상징입니다.',
        category: '역사',
      },
      {
        name: '칸 엘 칼릴리 시장',
        desc: '14세기부터 이어진 전통 시장. 향신료, 수공예품, 이국적인 기념품을 만나보세요.',
        category: '문화',
      },
    ],
    food: [
      {
        name: '코샤리',
        desc: '이집트 국민 음식. 파스타, 밥, 렌틸콩에 매콤한 토마토소스를 올린 편안한 한 그릇.',
      },
      {
        name: '팔라펠',
        desc: '병아리콩으로 만든 바삭한 튀김. 피타 브레드에 싸서 먹으면 최고입니다.',
      },
      { name: '케밥', desc: '숯불에 구운 양고기와 닭고기 케밥. 타히니 소스를 곁들여 보세요.' },
    ],
    activities: [
      {
        name: '나일강 크루즈',
        desc: '저녁에 나일강을 유람하며 전통 벨리댄스와 이집트 음식을 즐기세요.',
      },
      {
        name: '이집트 박물관',
        desc: '투탕카멘의 황금 마스크를 포함한 방대한 고대 이집트 유물 컬렉션.',
      },
      { name: '사막 사파리', desc: '사하라 사막의 모래 언덕에서 낙타 타기와 일몰을 감상하세요.' },
    ],
    weatherTip: {
      rain: '비가 드문 카이로에서 비가 오면 실내 이집트 박물관에서 시간을 보내세요.',
      hot: '더운 날엔 오전 일찍 피라미드를 방문하고 오후엔 실내에서 쉬세요.',
      cold: '쌀쌀한 밤엔 따뜻한 이집트 차(카르카데)를 마시며 나일강변에서 여유를 즐기세요.',
      clear: '맑은 날엔 기자 피라미드 앞에서 낙타와 함께 사진을 찍어보세요!',
    },
  },

  Sydney: {
    image: '/travel/sydney.png',
    attractions: [
      {
        name: '시드니 오페라 하우스',
        desc: 'UNESCO 세계문화유산. 조개껍데기 형태의 독특한 건축물이 항구와 어우러져 장관입니다.',
        category: '건축',
      },
      {
        name: '본다이 비치',
        desc: '시드니를 대표하는 해변. 서핑, 수영, 해안 산책이 모두 가능합니다.',
        category: '자연',
      },
      {
        name: '블루마운틴스',
        desc: '유칼립투스 숲에서 뿜어져 나오는 푸른 안개가 신비로운 세계자연유산.',
        category: '자연',
      },
    ],
    food: [
      { name: '미트파이', desc: '호주의 국민 간식. 바삭한 파이 속에 진한 고기 필링이 가득합니다.' },
      {
        name: '플랫 화이트',
        desc: '호주가 원조인 커피. 부드러운 우유 거품과 진한 에스프레소의 완벽한 조화.',
      },
      { name: '피시 앤 칩스', desc: '항구 도시 시드니에서 즐기는 신선한 생선 튀김과 바삭한 감자.' },
    ],
    activities: [
      {
        name: '하버 브릿지 클라이밍',
        desc: '시드니 하버 브릿지 아치 위를 걸어 올라가는 스릴 만점 체험.',
      },
      {
        name: '타롱가 동물원',
        desc: '시드니 하버를 배경으로 코알라, 캥거루 등 호주 토착 동물을 만나보세요.',
      },
      {
        name: '본다이 투 쿠지 워크',
        desc: '절벽 위 해안 산책로. 시드니에서 가장 아름다운 산책 코스입니다.',
      },
    ],
    weatherTip: {
      rain: '비 오는 날엔 시드니 수족관이나 파워하우스 박물관을 방문하세요.',
      hot: '더운 날엔 본다이 비치에서 서핑을 배워보세요.',
      cold: '쌀쌀한 날엔 더 록스(The Rocks) 지구에서 따뜻한 카페 투어를 즐기세요.',
      clear: '맑은 날엔 페리를 타고 맨리 비치로 가보세요. 경치가 환상적입니다!',
    },
  },
}

// 별칭 매핑 (도시 id나 한글 이름으로도 검색 가능하게)
const cityAliases = {
  서울: 'Seoul',
  부산: 'Busan',
  제주도: 'Jeju',
  제주: 'Jeju',
  도쿄: 'Tokyo',
  런던: 'London',
  뉴욕: 'New York',
  카이로: 'Cairo',
  시드니: 'Sydney',
  '독도 (우리땅)': 'Seoul',
  독도: 'Seoul',
  Dokdo: 'Seoul',
  울릉도: 'Busan',
  Ulleungdo: 'Busan',
  인천: 'Seoul',
  Incheon: 'Seoul',
  대구: 'Busan',
  Daegu: 'Busan',
  대전: 'Seoul',
  Daejeon: 'Seoul',
  수원: 'Seoul',
  Suwon: 'Seoul',
  방콕: 'Tokyo',
  Bangkok: 'Tokyo',
  알마티: 'Tokyo',
  Almaty: 'Tokyo',
  부다페스트: 'London',
  Budapest: 'London',
  로스앤젤레스: 'New York',
  'Los Angeles': 'New York',
  휴스턴: 'New York',
  Houston: 'New York',
  산티아고: 'New York',
  Santiago: 'New York',
  상파울루: 'New York',
  'Sao Paulo': 'New York',
  캄팔라: 'Cairo',
  Kampala: 'Cairo',
}

/**
 * 도시 ID 또는 이름으로 여행 데이터 조회
 * @param {string} cityIdOrName - 도시 ID 또는 한글/영문 이름
 * @returns {Object|null} 여행 데이터 또는 null
 */
export const getTravelData = (cityIdOrName) => {
  if (!cityIdOrName) return null

  // 1. 직접 매칭
  if (travelDatabase[cityIdOrName]) {
    return { cityKey: cityIdOrName, ...travelDatabase[cityIdOrName] }
  }

  // 2. 별칭 매칭
  const aliasKey = cityAliases[cityIdOrName]
  if (aliasKey && travelDatabase[aliasKey]) {
    return { cityKey: aliasKey, ...travelDatabase[aliasKey] }
  }

  // 3. 부분 매칭 (포함 검사)
  for (const [alias, key] of Object.entries(cityAliases)) {
    if (cityIdOrName.includes(alias) || alias.includes(cityIdOrName)) {
      if (travelDatabase[key]) {
        return { cityKey: key, ...travelDatabase[key] }
      }
    }
  }

  return null
}

/**
 * 날씨 상태에 맞는 여행 팁 조회
 * @param {Object} travelData - getTravelData의 결과
 * @param {string} weatherStatus - 현재 날씨 상태
 * @returns {string} 여행 팁
 */
export const getWeatherTravelTip = (travelData, weatherStatus) => {
  if (!travelData || !travelData.weatherTip) return ''
  const status = (weatherStatus || '').toLowerCase()

  if (status.includes('비') || status.includes('rain')) return travelData.weatherTip.rain
  if (status.includes('맑음') || status.includes('clear')) return travelData.weatherTip.clear
  if (status.includes('눈') || status.includes('snow') || status.includes('cold'))
    return travelData.weatherTip.cold

  // 기온 기반 판단 (fallback)
  return travelData.weatherTip.clear
}

/**
 * 도시에 여행 데이터가 있는지 확인
 * @param {string} cityIdOrName
 * @returns {boolean}
 */
export const hasTravelData = (cityIdOrName) => {
  return getTravelData(cityIdOrName) !== null
}
