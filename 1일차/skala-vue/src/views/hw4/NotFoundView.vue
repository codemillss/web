<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found-container">
    <el-card shadow="hover" class="not-found-card">
      <div class="error-content">
        <h1 class="error-emoji">🌞❓</h1>
        <h2 class="error-title">페이지를 찾을 수 없습니다.</h2>
        <p class="error-desc">요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다.</p>
        <el-button type="primary" size="large" @click="router.push('/hw4')">
          날씨 메인으로 이동
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.not-found-container {
  max-width: 520px;
  margin: 40px auto;
}
.not-found-card {
  text-align: center;
  padding: 40px 20px;
  border-radius: 12px;
}
.error-emoji {
  font-size: 60px;
  margin: 0 0 20px 0;
}
.error-title {
  color: #2c3e50;
  margin-bottom: 10px;
}
.error-desc {
  color: #7f8c8d;
  margin-bottom: 30px;
}
</style>
