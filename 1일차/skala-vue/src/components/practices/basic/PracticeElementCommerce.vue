<script setup>
import { ref } from 'vue'

// 반응형 Data
const productQuantity = ref(1) // 수량 카운터 기본값
const productRate = ref(4) // 별점 기본값 (별 4개)
</script>

<template>
  <div class="practice-section">
    <h2>🚀 Element Plus: 실습 2. 커머스 상품 수량</h2>
    
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>🛒 실습 2. 커머스 상품 수량 및 평점 시스템</span>
        </div>
      </template>

      <div class="control-group">
        <span class="label">구매 수량 선택: </span>
        <el-input-number 
          v-model="productQuantity" 
          :min="1" 
          :max="10" 
          class="qty-input"
        />
        <span class="limit-text">(최대 10개 구매 가능)</span>
      </div>

      <div class="control-group">
        <span class="label">상품 만족도 별점: </span>
        <el-rate 
          v-model="productRate" 
          show-score 
          text-color="#ff9900" 
          score-template="{value} 점"
        />
      </div>

      <div class="summary-box">
        <el-icon class="icon-dot" color="#67c23a"><i class="el-icon-success"></i></el-icon>
        <span class="dot-placeholder">🟢</span>
        실시간 장바구니 요약: 선택 수량 <strong>{{ productQuantity }}개</strong> / 내가 준 점수 <strong>{{ productRate }}점</strong>
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

.control-group {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.label {
  width: 130px;
  color: #555;
  font-weight: 500;
}

.qty-input {
  margin-right: 15px;
}

.limit-text {
  font-size: 13px;
  color: #999;
}

.summary-box {
  background-color: #f4f4f5;
  padding: 15px 20px;
  border-radius: 6px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot-placeholder {
  font-size: 12px;
}
</style>
