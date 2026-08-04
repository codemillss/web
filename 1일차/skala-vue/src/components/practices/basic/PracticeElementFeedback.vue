<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 반응형 Data
const downloadProgress = ref(0)
const isDownloading = ref(false)

// 파일 삭제 Confirm
const confirmDelete = () => {
  ElMessageBox.confirm(
    '서버에서 해당 파일을 영구히 삭제하시겠습니까?',
    '💧 최종 경고',
    {
      confirmButtonText: '네, 삭제합니다',
      cancelButtonText: '취소',
      type: 'danger',
    }
  )
    .then(() => {
      ElMessage.success('🗑️ 파일이 안전하게 파쇄되었습니다.')
    })
    .catch(() => {
      ElMessage.info('❌ 삭제 작업이 취소되었습니다.')
    })
}

// 게이지 바 애니메이션
const startDownload = () => {
  if (isDownloading.value) return 
  isDownloading.value = true
  downloadProgress.value = 0
  
  const interval = setInterval(() => {
    downloadProgress.value += 20
    if (downloadProgress.value >= 100) {
      clearInterval(interval)
      isDownloading.value = false
      ElMessage.success('💾 대용량 데이터 로드가 완료되었습니다!')
    }
  }, 400)
}
</script>

<template>
  <div class="practice-section">
    <h2>🚀 Element Plus: 실습 3. 시스템 피드백</h2>
    
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>⚙️ 실습 3. 시스템 피드백 & 프로그레스 인터랙션</span>
        </div>
      </template>

      <div class="action-buttons">
        <el-button 
          type="danger" 
          plain 
          @click="confirmDelete"
        >
          🗑️ 서버 파일 삭제 테스트
        </el-button>
        
        <el-button 
          type="primary" 
          @click="startDownload" 
          :loading="isDownloading"
        >
          💾 데이터 동기화 시작
        </el-button>
      </div>

      <div class="progress-area" v-if="downloadProgress > 0">
        <el-progress 
          :percentage="downloadProgress" 
          status="success" 
          :stroke-width="12"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.practice-section {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.box-card {
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
}

.progress-area {
  margin-top: 20px;
}
</style>
