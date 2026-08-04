<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// userForm Object
const userForm = ref({
  email: '',
  agree: false,
})

// userForm Validation
const handleRegister = () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.error('❌ 올바른 이메일 형식이 아닙니다.')
    return
  }
  
  if (!userForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }
  
  ElMessage.success('🎉 가입 신청이 정상적으로 완료되었습니다!')
}
</script>

<template>
  <div class="practice-section">
    <h2>🚀 Element Plus: 실습 1. 회원가입 Form</h2>
    
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>📝 실습 1. 회원가입 Form & 인풋 제어</span>
        </div>
      </template>

      <div class="form-group">
        <span class="label">이메일 주소: </span>
        <el-input 
          v-model="userForm.email" 
          placeholder="example@email.com" 
          clearable
          class="email-input"
        />
      </div>

      <div class="form-group switch-group">
        <el-switch v-model="userForm.agree" />
        <span class="switch-label">개인정보 수집 및 필수 이용약관에 동의합니다.</span>
      </div>

      <el-button 
        type="success" 
        class="submit-btn" 
        @click="handleRegister"
      >
        🚀 회원가입하기
      </el-button>
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

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.label {
  width: 100px;
  font-weight: bold;
  color: #555;
}

.email-input {
  flex: 1;
}

.switch-group {
  margin-top: 30px;
  margin-bottom: 30px;
}

.switch-label {
  margin-left: 10px;
  color: #666;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  font-size: 16px;
  padding: 20px 0;
}
</style>
