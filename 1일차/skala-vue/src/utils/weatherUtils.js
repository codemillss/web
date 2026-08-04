/**
 * 날씨 데이터(city)를 분석하여 직관적인 인사이트 태그 배열을 반환하는 유틸리티 함수
 */
export function getWeatherTags(city) {
  const tags = []
  
  if (!city) return tags

  const temp = city.temp

  // 1. 온도 기준 태그 (실제 기온을 포함한 세분화 레이블링)
  const roundTemp = Math.round(temp)
  if (temp >= 38) {
    tags.push({ text: `🔥 극심한 초폭염 (${roundTemp}°C)`, type: 'danger' })
  } else if (temp >= 35) {
    tags.push({ text: `🚨 폭염경보 (${roundTemp}°C)`, type: 'danger' })
  } else if (temp >= 33) {
    tags.push({ text: `⚠️ 폭염주의보 (${roundTemp}°C)`, type: 'warning' })
  } else if (temp >= 30) {
    tags.push({ text: `🥵 찜통 더위 (${roundTemp}°C)`, type: 'danger' })
  } else if (temp >= 28) {
    tags.push({ text: `☀️ 상당한 무더위 (${roundTemp}°C)`, type: 'warning' })
  } else if (temp >= 25) {
    tags.push({ text: `💧 여름철 더움 (${roundTemp}°C)`, type: 'warning' })
  } else if (temp <= -10) {
    tags.push({ text: `🥶 극심한 한파 (${roundTemp}°C)`, type: 'primary' })
  } else if (temp <= 0) {
    tags.push({ text: `❄️ 영하 한파 (${roundTemp}°C)`, type: 'info' })
  } else if (temp < 10) {
    tags.push({ text: `🧥 쌀쌀한 날씨 (${roundTemp}°C)`, type: 'info' })
  } else if (temp < 20) {
    tags.push({ text: `🧥 선선한 날씨 (${roundTemp}°C)`, type: 'info' })
  } else {
    tags.push({ text: `🍃 포근함/쾌적 (${roundTemp}°C)`, type: 'success' })
  }

  // 2. 야간 / 열대야 로직
  const hour = new Date().getHours()
  if (temp >= 25 && (hour >= 18 || hour <= 6)) {
    tags.push({ text: '🌃 열대야', type: 'warning' })
  }

  // 3. 습도 및 불쾌지수(THI) 기준 태그
  if (city.humidity !== undefined) {
    // 문자열(예: '55%')인 경우 파싱
    const hum = typeof city.humidity === 'string' 
      ? parseInt(city.humidity.replace('%', '')) 
      : city.humidity
      
    // 불쾌지수(THI) 공식 적용: 온도가 낮으면 불쾌지수에 큰 영향이 없음을 반영
    const thi = (1.8 * temp) - 0.55 * (1 - hum / 100) * (1.8 * temp - 26) + 32

    if (thi >= 80) {
      tags.push({ text: '🥵 불쾌지수 극심 (매우 후텁지근함)', type: 'danger' })
    } else if (thi >= 75) {
      tags.push({ text: '💦 불쾌지수 높음 (후텁지근함)', type: 'warning' })
    } else if (hum >= 80) {
      // 온도는 낮지만 습도만 높은 경우 (겨울비 등)
      tags.push({ text: '🌧️ 습도 매우 높음', type: 'primary' })
    } else if (hum <= 30) {
      tags.push({ text: '🌵 대기 건조', type: 'warning' })
    }
  }

  // 4. 날씨 상태 기준 태그
  if (city.status === '구름' || (city.desc && city.desc.includes('구름'))) {
    tags.push({ text: '☁️ 구름 잔뜩 낌', type: 'info' })
  } else if (city.status === '비' || (city.desc && city.desc.includes('비'))) {
    tags.push({ text: '☔ 외출 시 우산 필수', type: 'primary' })
  } else if (city.status === '맑음' || (city.desc && city.desc.includes('맑음'))) {
    tags.push({ text: '☀️ 자외선 주의', type: 'warning' })
  }

  return tags
}

/**
 * 자주 사용되는 영문 도시명을 한글로 변환하는 유틸리티
 */
export function getKoreanCityName(englishName) {
  if (!englishName) return ''
  
  const cityMap = {
    // 한국
    'seoul': '서울',
    'suwon': '수원',
    'busan': '부산',
    'incheon': '인천',
    'daegu': '대구',
    'daejeon': '대전',
    'gwangju': '광주',
    'jeju': '제주도',
    'dokdo': '독도 (우리땅)',
    'ulleungdo': '울릉도',
    'uljin': '울진',
    'chuncheon': '춘천',
    'jeonju': '전주',
    'ulsan': '울산',
    'changwon': '창원',
    'cheongju': '청주',
    'gangneung': '강릉',
    // 아시아
    'tokyo': '도쿄',
    'osaka': '오사카',
    'beijing': '베이징',
    'shanghai': '상하이',
    'bangkok': '방콕',
    'hanoi': '하노이',
    'almaty': '알마티',
    'delhi': '뉴델리',
    'mumbai': '뭄바이',
    'chiang mai': '치앙마이',
    'kuala lumpur': '쿠알라룸푸르',
    // 유럽
    'london': '런던',
    'paris': '파리',
    'berlin': '베를린',
    'rome': '로마',
    'rome,it': '로마',        // 이탈리아 국가코드 보장
    'amsterdam': '암스테르담',
    'madrid': '마드리드',
    'vienna': '빈',
    'prague': '프라하',
    'sofia': '소피아',
    // 북미
    'new york': '뉴욕',
    'los angeles': '로스앤젤레스',
    'chicago': '시카고',
    'toronto': '토론토',
    'vancouver': '밴쿠버',
    'houston': '휴스턴',
    'san francisco': '샌프란시스코',
    // 남미
    'sao paulo': '상파울루',
    'buenos aires': '부에노스아이레스',
    'lima': '리마',
    'bogota': '보고타',
    'medellin': '메데진',
    'santiago': '산티아고',
    // 아프리카
    'cairo': '카이로',
    'lagos': '라고스',
    'nairobi': '나이로비',
    'johannesburg': '요하네스버그',
    'cape town': '케이프타운',
    'kampala': '캄팔라',
    'luanda': '루안다',
    // 오세아니아
    'sydney': '시드니',
    'melbourne': '멜버른',
    'melbourne,au': '멜버른', // 호주 국가코드 보장
    'auckland': '오클랜드',
    'brisbane': '브리즈번'
  }

  // API에서 'Suwon-si', 'Seoul-si' 형태로 내려올 수 있으므로 '-si'를 제거
  const lowerName = englishName.toLowerCase().replace('-si', '').replace(',it', '').replace(',us', '').replace(',kr', '').replace(',au', '')
  
  // 드록한 원본을 반환하거나, 사전에 있으면 사전 값을 반환
  return cityMap[lowerName] || englishName.replace('-si', '').replace(/,[a-z]{2}$/i, '')
}
