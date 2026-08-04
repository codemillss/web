<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 💡 1. 백엔드 공용 주소
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

// 💡 2. 반응형 상태 데이터
const items = ref([]) // 서버에서 받아온 데이터 배열 박스
const textInput = ref('') // 입력창과 연결된 글자 데이터 박스

// ----------------------------------------------------
// [READ] GET : 데이터 가져오기
// ----------------------------------------------------
const handleRead = async () => {
  try {
    // 공부용으로 딱 3개만 들고 옵니다.
    const response = await axios.get(BASE_URL, { params: { _limit: 3 } })
    items.value = response.data
    console.log('GET 성공:', response.data)
  } catch (error) {
    console.error('GET 실패:', error)
  }
}

// ----------------------------------------------------
// (보너스 실습) [CREATE] POST : 데이터 전송하기
// ----------------------------------------------------
const handleCreate = async () => {
  if (!textInput.value) return alert('내용을 입력하세요!')
  
  try {
    const payload = {
      title: textInput.value,
      body: 'Vue.js Axios POST 테스트',
      userId: 1,
    }
    
    // axios.post(주소, 전송할데이터)
    const response = await axios.post(BASE_URL, payload)
    
    // 가짜 API이므로 실제 서버에 저장되진 않지만, 성공 응답과 생성된 ID를 반환받음
    items.value.push(response.data) // 화면 목록에 추가
    textInput.value = '' // 입력창 초기화
    
    console.log('POST 성공:', response.data)
  } catch (error) {
    console.error('POST 실패:', error)
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>📡 Axios CRUD 통신 기초</h2>
    
    <!-- 데이터 읽기 (GET) -->
    <div class="action-box">
      <h3>1. 데이터 불러오기 (GET)</h3>
      <button @click="handleRead" class="btn get-btn">데이터 3개 불러오기</button>
    </div>
    
    <!-- 데이터 쓰기 (POST) -->
    <div class="action-box">
      <h3>2. 데이터 추가하기 (POST)</h3>
      <input 
        v-model="textInput" 
        type="text" 
        placeholder="추가할 포스트 제목 입력" 
        class="input-field"
        @keyup.enter="handleCreate"
      />
      <button @click="handleCreate" class="btn post-btn">데이터 전송</button>
    </div>
    
    <!-- 데이터 목록 렌더링 영역 -->
    <div class="list-area">
      <h3>📜 불러온 데이터 목록 (총 {{ items.length }}개)</h3>
      <ul v-if="items.length > 0" class="item-list">
        <li v-for="item in items" :key="item.id" class="item">
          <strong>[{{ item.id }}]</strong> {{ item.title }}
        </li>
      </ul>
      <p v-else class="empty-state">아직 불러온 데이터가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.practice-section {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.action-box {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.action-box h3 {
  margin-top: 0;
  color: #333;
  font-size: 16px;
}

.btn {
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  color: white;
}

.get-btn {
  background-color: #3498db;
}

.post-btn {
  background-color: #e67e22;
}

.input-field {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 250px;
}

.list-area {
  margin-top: 30px;
  border-top: 2px dashed #eee;
  padding-top: 20px;
}

.item-list {
  list-style: none;
  padding: 0;
}

.item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.empty-state {
  color: #888;
  font-style: italic;
}
</style>
