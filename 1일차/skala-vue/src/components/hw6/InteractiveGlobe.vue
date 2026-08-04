<script setup>
import { ref, onMounted, watch, onUnmounted, defineExpose } from 'vue'
import Globe from 'globe.gl'
import { useRouter } from 'vue-router'
import customEarth from '@/assets/custom-earth.jpg'

const props = defineProps({
  weatherList: {
    type: Array,
    required: true
  }
})

const globeContainer = ref(null)
let globeInstance = null
const router = useRouter()

const getGlobeData = () => {
  const list = props.weatherList.filter(w => w.lat !== undefined && w.lon !== undefined).map(w => ({
    lat: w.lat,
    lng: w.lon,
    size: w.id === 'Dokdo' ? 1.5 : 1.0,
    color: w.id === 'Dokdo' ? '#f1c40f' : (w.temp >= 25 ? '#ff5252' : w.temp <= 0 ? '#409eff' : '#67c23a'),
    label: `📍 ${w.name} ${w.temp}°C`,
    status: w.status,
    id: w.id
  }))

  // 🇰🇷 독도 (우리땅) Fallback 핀
  if (!list.some(item => item.id === 'Dokdo' || item.label.includes('독도'))) {
    list.push({
      lat: 37.2425,
      lng: 131.8669,
      size: 1.5,
      color: '#f1c40f',
      label: '🇰🇷 독도 (우리땅)',
      status: '정보 불러오는 중',
      id: 'Dokdo'
    })
  }

  // 🏝️ 제주도 Fallback 핀
  if (!list.some(item => item.id === 'Jeju' || item.label.includes('제주'))) {
    list.push({
      lat: 33.4996,
      lng: 126.5312,
      size: 1.3,
      color: '#2ecc71',
      label: '🏝️ 제주도',
      status: '정보 불러오는 중',
      id: 'Jeju'
    })
  }

  // ⛰️ 울릉도 Fallback 핀
  if (!list.some(item => item.id === 'Ulleungdo' || item.label.includes('울릉'))) {
    list.push({
      lat: 37.4847,
      lng: 130.9010,
      size: 1.3,
      color: '#3498db',
      label: '⛰️ 울릉도',
      status: '정보 불러오는 중',
      id: 'Ulleungdo'
    })
  }

  return list
}

const resizeGlobe = () => {
  if (globeInstance && globeContainer.value) {
    globeInstance.width(globeContainer.value.clientWidth)
    globeInstance.height(400)
  }
}

defineExpose({
  focusOnLocation(lat, lng, altitude = 2.5) {
    if (globeInstance) {
      globeInstance.pointOfView({ lat, lng, altitude }, 1000)
    }
  }
})

onMounted(() => {
  globeInstance = Globe()(globeContainer.value)
    .globeImageUrl(customEarth)
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .showAtmosphere(true)
    .atmosphereColor('lightskyblue')
    .atmosphereAltitude(0.25)
    .backgroundColor('rgba(0,0,0,0)') // 투명하게 해서 앱 배경과 어우러지게
    .width(globeContainer.value.clientWidth)
    .height(400)
    .htmlElementsData(getGlobeData())
    .htmlElement(d => {
      const el = document.createElement('div')
      
      // 마커 컨테이너 (작은 점 + 숨겨진 툴팁)
      el.innerHTML = `
        <div class="marker-container" style="position: relative; pointer-events: auto; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
          <!-- 툴팁 (기본은 투명/숨김 처리하여 클릭 방해 방지) -->
          <div class="marker-tooltip" style="opacity: 0; pointer-events: none; position: absolute; bottom: 18px; background: rgba(20,20,20,0.9); color: white; padding: 6px 12px; border-radius: 8px; border: 1px solid ${d.color}; white-space: nowrap; font-size: 14px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: opacity 0.2s, transform 0.2s; transform: translateY(5px);">
            ${d.label} <span style="font-size: 12px; font-weight: normal; color: #ccc;">(${d.status})</span>
          </div>
          
          <!-- 핀(점) 디자인 -->
          <div style="width: 14px; height: 14px; background: ${d.color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${d.color};"></div>
        </div>
      `
      
      const container = el.querySelector('.marker-container')
      const tooltip = el.querySelector('.marker-tooltip')
      
      el.onclick = () => router.push(`/hw6/weather/${d.id}`)
      
      el.onmouseenter = () => {
        tooltip.style.opacity = '1'
        tooltip.style.transform = 'translateY(0)'
        el.style.zIndex = 1000 // 다른 마커 위로 올리기
      }
      
      el.onmouseleave = () => {
        tooltip.style.opacity = '0'
        tooltip.style.transform = 'translateY(5px)'
        el.style.zIndex = 1
      }
      
      return el
    })
    
  // 자동 회전 (거의 안 움직이게 매우 느리게 설정)
  globeInstance.controls().autoRotate = true
  globeInstance.controls().autoRotateSpeed = 0.05
  // 마우스 스크롤을 통한 줌인/줌아웃 활성화
  globeInstance.controls().enableZoom = true 
  // 최소/최대 줌 거리 제한 (더 가까이 줌인 가능하게 변경)
  globeInstance.controls().minDistance = 105
  globeInstance.controls().maxDistance = 800
  
  // 기본 카메라 위치 (지구 전체가 시야에 들어오도록 altitude 2.5 설정)
  globeInstance.pointOfView({ lat: 37.5, lng: 127.0, altitude: 2.5 })

  // 전 세계 3D 국경선 (GeoJSON Polygon) 레이어 추가
  fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
    .then(res => res.json())
    .then(countries => {
      if (globeInstance) {
        // 제주도, 울릉도, 독도 폴리곤 생성 헬퍼
        const createCirclePolygon = (centerLat, centerLng, radiusLat, radiusLng) => {
          const coords = []
          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2
            coords.push([centerLng + Math.sin(angle) * radiusLng, centerLat + Math.cos(angle) * radiusLat])
          }
          coords.push(coords[0])
          return [[coords]]
        }

        // 한국 영토(섬) 폴리곤을 South Korea MultiPolygon에 통합
        const sk = countries.features.find(f => f.properties.NAME === 'South Korea')
        if (sk) {
          if (sk.geometry.type === 'Polygon') {
            sk.geometry.type = 'MultiPolygon'
            sk.geometry.coordinates = [sk.geometry.coordinates]
          }
          sk.geometry.coordinates.push(
            createCirclePolygon(33.36, 126.52, 0.25, 0.4)[0], // 제주도
            createCirclePolygon(37.48, 130.90, 0.08, 0.1)[0], // 울릉도
            createCirclePolygon(37.24, 131.86, 0.06, 0.08)[0]  // 독도
          )
        }

        let hoverD = null
        globeInstance
          .polygonsData(countries.features)
          .polygonCapColor(() => 'rgba(255, 255, 255, 0.02)')
          .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
          .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.65)')
          .polygonAltitude(0.006)
          .onPolygonHover(polygon => {
            hoverD = polygon
            // 렉 원인인 고도 재계산(polygonAltitude) 제거, 색상만 변경
            globeInstance.polygonCapColor(d => d === hoverD ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.02)')
          })

        // 나라 이름 레이블 - GeoJSON centroid 기반
        const countryLabels = countries.features
          .filter(f => f.properties && f.properties.NAME)
          .map(f => {
            // 폴리곤 중심 좌표 계산 (첫 번째 폴리곤 링의 평균)
            let lat = 0, lng = 0, count = 0
            const geom = f.geometry
            const coords = geom.type === 'Polygon'
              ? geom.coordinates[0]
              : geom.coordinates[0][0]
            if (coords) {
              coords.forEach(([lo, la]) => { lng += lo; lat += la; count++ })
              lat /= count; lng /= count
            }
            const name = f.properties.NAME_KO || f.properties.NAME
            return { lat, lng, text: name, size: 0.5, color: 'rgba(255,255,255,0.75)' }
          })
          .filter(l => l.lat !== 0 && l.lng !== 0)

        globeInstance
          .labelsData(countryLabels)
          .labelLat(d => d.lat)
          .labelLng(d => d.lng)
          .labelText(d => d.text)
          .labelSize(0.5)
          .labelColor(d => d.color)
          .labelResolution(3)
          .labelAltitude(0.01)
          .labelDotRadius(0)
      }
    })
    .catch(err => console.error('국경선 데이터 로드 실패:', err))

  window.addEventListener('resize', resizeGlobe)
})

watch(() => props.weatherList, () => {
  if (globeInstance) {
    globeInstance.htmlElementsData(getGlobeData())
  }
}, { deep: true })

onUnmounted(() => {
  window.removeEventListener('resize', resizeGlobe)
  if (globeInstance && globeContainer.value) {
    globeContainer.value.innerHTML = ''
  }
})
</script>

<template>
  <div class="globe-container-wrapper">
    <div class="globe-wrapper" ref="globeContainer"></div>
    <div class="globe-legend">
      <div class="legend-item"><span class="legend-color" style="background: #ff5252"></span> 25°C 이상 (더움)</div>
      <div class="legend-item"><span class="legend-color" style="background: #67c23a"></span> 1°C ~ 24°C (보통)</div>
      <div class="legend-item"><span class="legend-color" style="background: #409eff"></span> 0°C 이하 (추움)</div>
      <div class="legend-item"><span class="legend-color" style="background: #f1c40f"></span> 🇰🇷 독도</div>
    </div>
  </div>
</template>

<style scoped>
.globe-container-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 24px;
}
.globe-wrapper {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  background-color: #e6f2ff; /* 밝은 하늘색 배경 */
  background-image: radial-gradient(circle, #ffffff, #e6f2ff); /* 햇빛이 비추는 듯한 그라데이션 */
}
.globe-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.85);
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  pointer-events: none;
  backdrop-filter: blur(4px);
}
.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  color: #303133;
  font-weight: 500;
}
.legend-item:last-child {
  margin-bottom: 0;
}
.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 10px;
  display: inline-block;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
}
</style>
