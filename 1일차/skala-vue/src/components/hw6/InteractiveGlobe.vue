<script setup>
import { ref, onMounted, watch, onUnmounted, defineExpose } from 'vue'
import Globe from 'globe.gl'
import { useRouter } from 'vue-router'
import customEarth from '@/assets/custom-earth.jpg'
import { useHw6FavoriteStore } from '@/stores/hw6FavoriteStore'
import { hasTravelData } from '@/utils/travelData'

const props = defineProps({
  weatherList: {
    type: Array,
    required: true,
  },
})

const isLegendOpen = ref(true)
const toggleLegend = () => {
  isLegendOpen.value = !isLegendOpen.value
}

const globeContainer = ref(null)
const globeFailed = ref(false)
let globeInstance = null
const router = useRouter()
const favoriteStore = useHw6FavoriteStore()

const getGlobeData = () => {
  const list = props.weatherList
    .filter((w) => w.lat !== undefined && w.lon !== undefined)
    .map((w) => {
      const isTravel = hasTravelData(w.id) || hasTravelData(w.name)
      const isFav = favoriteStore.isFavorite(w.id)
      return {
        lat: w.lat,
        lng: w.lon,
        size: w.id === 'Dokdo' ? 1.5 : 1.0,
        color:
          w.id === 'Dokdo'
            ? '#f1c40f'
            : w.temp >= 25
              ? '#ff5252'
              : w.temp <= 0
                ? '#409eff'
                : '#67c23a',
        label: `📍 ${w.name} ${w.temp}°C`,
        status: w.status,
        id: w.id,
        isTravel,
        isFav,
      }
    })

  // 🇰🇷 독도 Fallback 핀
  if (!list.some((item) => item.id === 'Dokdo' || item.label.includes('독도'))) {
    list.push({
      lat: 37.2425,
      lng: 131.8669,
      size: 1.5,
      color: '#f1c40f',
      label: '🇰🇷 독도 (우리땅)',
      status: '정보 불러오는 중',
      id: 'Dokdo',
      isTravel: true,
      isFav: favoriteStore.isFavorite('Dokdo'),
    })
  }
  // 🏝️ 제주도 Fallback 핀
  if (!list.some((item) => item.id === 'Jeju' || item.label.includes('제주'))) {
    list.push({
      lat: 33.4996,
      lng: 126.5312,
      size: 1.3,
      color: '#2ecc71',
      label: '🏝️ 제주도',
      status: '정보 불러오는 중',
      id: 'Jeju',
      isTravel: true,
      isFav: favoriteStore.isFavorite('Jeju'),
    })
  }
  // ⛰️ 울릉도 Fallback 핀
  if (!list.some((item) => item.id === 'Ulleungdo' || item.label.includes('울릉'))) {
    list.push({
      lat: 37.4847,
      lng: 130.901,
      size: 1.3,
      color: '#3498db',
      label: '⛰️ 울릉도',
      status: '정보 불러오는 중',
      id: 'Ulleungdo',
      isTravel: false,
      isFav: favoriteStore.isFavorite('Ulleungdo'),
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
  },
})

onMounted(() => {
  try {
    globeInstance = Globe()(globeContainer.value)
      .globeImageUrl(customEarth)
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .showAtmosphere(true)
      .atmosphereColor('lightskyblue')
      .atmosphereAltitude(0.25)
      .backgroundColor('rgba(0,0,0,0)')
      .width(globeContainer.value.clientWidth)
      .height(400)
      .htmlElementsData(getGlobeData())
      .htmlElement((d) => {
        const el = document.createElement('div')
        const badges = `
          <div style="position: absolute; top: -16px; display: flex; gap: 2px; align-items: center;">
            ${d.isFav ? '<span style="font-size: 14px; text-shadow: 0 0 6px gold;">⭐</span>' : ''}
            ${d.isTravel ? '<span style="font-size: 14px; text-shadow: 0 0 6px skyblue;">✈️</span>' : ''}
          </div>
        `
        el.innerHTML = `
          <div class="marker-container" style="position: relative; pointer-events: auto; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
            ${badges}
            <div class="marker-tooltip" style="opacity: 0; pointer-events: none; position: absolute; bottom: 18px; background: rgba(20,20,20,0.9); color: white; padding: 8px 14px; border-radius: 8px; border: 1px solid ${d.color}; white-space: nowrap; font-size: 14px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: opacity 0.2s, transform 0.2s; transform: translateY(5px);">
              ${d.label} <span style="font-size: 12px; font-weight: normal; color: #ccc;">(${d.status})</span><br/>
              <span style="font-size: 12px; color: #4facfe; margin-top: 4px; display: inline-block;">👆 클릭하여 여행 정보 보기</span>
            </div>
            <div style="width: 14px; height: 14px; background: ${d.color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${d.color}; z-index: 2;"></div>
          </div>
        `
        const tooltip = el.querySelector('.marker-tooltip')
        el.onclick = () => router.push(`/hw6/weather/${d.id}`)
        el.onmouseenter = () => {
          tooltip.style.opacity = '1'
          tooltip.style.transform = 'translateY(0)'
          el.style.zIndex = 1000
        }
        el.onmouseleave = () => {
          tooltip.style.opacity = '0'
          tooltip.style.transform = 'translateY(5px)'
          el.style.zIndex = 1
        }
        return el
      })

    globeInstance.controls().autoRotate = true
    globeInstance.controls().autoRotateSpeed = 0.05
    globeInstance.controls().enableZoom = true
    globeInstance.controls().minDistance = 105
    globeInstance.controls().maxDistance = 800
    globeInstance.pointOfView({ lat: 37.5, lng: 127.0, altitude: 2.5 })

    // ResizeObserver (try 블록 안에서 안전하게 처리)
    const resizeObserver = new ResizeObserver(() => resizeGlobe())
    resizeObserver.observe(globeContainer.value)
    globeInstance._resizeObserver = resizeObserver

    // 국경선 GeoJSON 로드
    fetch(
      'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson',
    )
      .then((res) => res.json())
      .then((countries) => {
        if (!globeInstance) return
        const createCirclePolygon = (centerLat, centerLng, radiusLat, radiusLng) => {
          const coords = []
          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2
            coords.push([
              centerLng + Math.sin(angle) * radiusLng,
              centerLat + Math.cos(angle) * radiusLat,
            ])
          }
          coords.push(coords[0])
          return [[coords]]
        }
        const sk = countries.features.find((f) => f.properties.NAME === 'South Korea')
        if (sk) {
          if (sk.geometry.type === 'Polygon') {
            sk.geometry.type = 'MultiPolygon'
            sk.geometry.coordinates = [sk.geometry.coordinates]
          }
          sk.geometry.coordinates.push(
            createCirclePolygon(33.36, 126.52, 0.25, 0.4)[0],
            createCirclePolygon(37.48, 130.9, 0.08, 0.1)[0],
            createCirclePolygon(37.24, 131.86, 0.06, 0.08)[0],
          )
        }
        let hoverD = null
        globeInstance
          .polygonsData(countries.features)
          .polygonCapColor(() => 'rgba(255, 255, 255, 0.02)')
          .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
          .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.65)')
          .polygonAltitude(0.006)
          .onPolygonHover((polygon) => {
            hoverD = polygon
            globeInstance.polygonCapColor((d) =>
              d === hoverD ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.02)',
            )
          })

        const countryLabels = countries.features
          .filter((f) => f.properties && f.properties.NAME)
          .map((f) => {
            let lat = 0,
              lng = 0,
              count = 0
            const geom = f.geometry
            const coords = geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates[0][0]
            if (coords) {
              coords.forEach(([lo, la]) => {
                lng += lo
                lat += la
                count++
              })
              lat /= count
              lng /= count
            }
            return {
              lat,
              lng,
              text: f.properties.NAME_KO || f.properties.NAME,
              size: 0.5,
              color: 'rgba(255,255,255,0.75)',
            }
          })
          .filter((l) => l.lat !== 0 && l.lng !== 0)

        globeInstance
          .labelsData(countryLabels)
          .labelLat((d) => d.lat)
          .labelLng((d) => d.lng)
          .labelText((d) => d.text)
          .labelSize(0.5)
          .labelColor((d) => d.color)
          .labelResolution(3)
          .labelAltitude(0.01)
          .labelDotRadius(0)
      })
      .catch((err) => console.warn('국경선 데이터 로드 실패:', err))
  } catch (err) {
    console.error('지구본(Globe.gl) 초기화 실패 — WebGL 미지원 환경:', err)
    globeInstance = null
    globeFailed.value = true
  }
})

watch(
  () => props.weatherList,
  () => {
    if (globeInstance) {
      globeInstance.htmlElementsData(getGlobeData())
    }
  },
  { deep: true },
)

onUnmounted(() => {
  if (globeInstance) {
    try {
      // THREE.js WebGL 컨텍스트 완전 해제 (컨텍스트 한도 초과 방지)
      const renderer = globeInstance.renderer()
      if (renderer) {
        renderer.dispose()
        renderer.forceContextLoss()
      }
      const scene = globeInstance.scene()
      if (scene) {
        scene.clear()
      }
    } catch (e) {
      console.warn('Globe dispose error:', e)
    }
    if (globeInstance._resizeObserver) {
      globeInstance._resizeObserver.disconnect()
    }
  }
  if (globeContainer.value) {
    globeContainer.value.innerHTML = ''
  }
  globeInstance = null
})
</script>

<template>
  <div class="globe-container-wrapper">
    <div class="globe-wrapper" ref="globeContainer">
      <!-- WebGL 불가 환경 폴백 안내 -->
      <div v-if="globeFailed" class="globe-fallback">
        <div class="fallback-icon">🌍</div>
        <p class="fallback-title">3D 지구본을 사용할 수 없습니다</p>
        <p class="fallback-desc">
          Chrome 설정 → 시스템 → "하드웨어 가속 사용" 활성화 후 재시작하면 3D 지구본이 표시됩니다.
        </p>
        <a href="chrome://settings/system" class="fallback-link">⚙️ Chrome 설정 열기</a>
      </div>
    </div>
    <div class="globe-legend" :class="{ 'is-collapsed': !isLegendOpen }">
      <div class="legend-header" @click="toggleLegend">
        <span>🗺️ 범례</span>
        <span class="legend-toggle-icon">{{ isLegendOpen ? '▼' : '▲' }}</span>
      </div>
      <div class="legend-content" v-show="isLegendOpen">
        <div class="legend-item">
          <span class="legend-color" style="background: #ff5252"></span> 25°C 이상 (더움)
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #67c23a"></span> 1°C ~ 24°C (보통)
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #409eff"></span> 0°C 이하 (추움)
        </div>
        <div class="legend-item">
          <span style="margin-right: 8px; font-size: 14px">✈️</span> 여행 코스 정보 제공
        </div>
        <div class="legend-item">
          <span style="margin-right: 8px; font-size: 14px">⭐</span> 내 즐겨찾기 도시
        </div>
      </div>
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  background-color: #e6f2ff;
  background-image: radial-gradient(circle, #ffffff, #e6f2ff);
}
.globe-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a5f, #2c5282);
  color: white;
  text-align: center;
  padding: 30px;
  box-sizing: border-box;
}
.fallback-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.fallback-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px;
}
.fallback-desc {
  font-size: 13px;
  opacity: 0.8;
  line-height: 1.6;
  margin: 0 0 16px;
  max-width: 380px;
}
.fallback-link {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: background 0.2s;
}
.fallback-link:hover {
  background: rgba(255, 255, 255, 0.25);
}
.globe-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  overflow: hidden;
  transition: all 0.3s ease;
  user-select: none;
}
.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.05);
  transition: background 0.2s;
}
.legend-header:hover {
  background: rgba(0, 0, 0, 0.1);
}
.legend-content {
  padding: 10px 15px 10px 15px;
}
.legend-toggle-icon {
  margin-left: 10px;
  font-size: 10px;
  color: #909399;
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
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}
</style>
