<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, MarkPointComponent, MarkLineComponent } from 'echarts/components'
import VChart from 'vue-echarts'

// ECharts 모듈 등록
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  MarkPointComponent,
  MarkLineComponent
])

const props = defineProps({
  forecastData: {
    type: Object,
    required: true
  }
})

// 차트에 필요한 옵션 데이터 구성
const chartOption = computed(() => {
  if (!props.forecastData || !props.forecastData.list) return {}

  const list = props.forecastData.list
  
  // X축: 시간 데이터 가공 (예: 8/4 15시)
  const times = list.map(item => {
    const date = new Date(item.dt * 1000)
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}시`
  })

  // Y축: 기온, 습도
  const temps = list.map(item => Math.round(item.main.temp * 10) / 10)
  const humidities = list.map(item => item.main.humidity)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['기온(°C)', '습도(%)']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    dataZoom: [
      {
        type: 'slider',
        start: 0,
        end: 50 // 기본적으로 절반만 보여줌 (드래그로 탐색)
      }
    ],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: times,
      axisLabel: {
        rotate: 45,
        fontSize: 11
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '기온',
        position: 'left',
        axisLabel: {
          formatter: '{value} °C'
        }
      },
      {
        type: 'value',
        name: '습도',
        position: 'right',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value} %'
        }
      }
    ],
    series: [
      {
        name: '기온(°C)',
        type: 'line',
        smooth: true,
        data: temps,
        itemStyle: { color: '#ff5252' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(255, 82, 82, 0.4)' }, { offset: 1, color: 'rgba(255, 82, 82, 0)' }]
          }
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        }
      },
      {
        name: '습도(%)',
        type: 'bar',
        yAxisIndex: 1,
        data: humidities,
        itemStyle: { color: 'rgba(64, 158, 255, 0.4)' },
        barWidth: '50%'
      }
    ]
  }
})
</script>

<template>
  <div class="chart-container">
    <h3 class="chart-title">📈 주간 시간대별 날씨 흐름</h3>
    <p class="chart-desc">드래그하여 향후 5일간의 날씨를 확인하세요.</p>
    <v-chart class="chart" :option="chartOption" autoresize />
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 480px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-top: 24px;
}
.chart-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #333;
}
.chart-desc {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #666;
}
.chart {
  width: 100%;
  height: 380px;
}
</style>
