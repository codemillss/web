<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ searchQuery: { type: String, default: '' } })
const emit = defineEmits(['update-query', 'is-searching'])

const localQuery = ref(props.searchQuery)
let debounceTimeout = null

const onNativeInput = (event) => {
  const val = event.target.value
  localQuery.value = val
  emit('update-query', val)
  emit('is-searching', true)

  if (debounceTimeout) clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {
    emit('is-searching', false)
  }, 400)
}

watch(
  () => props.searchQuery,
  (newVal) => {
    if (newVal !== localQuery.value) {
      localQuery.value = newVal
    }
  },
)

const clearInput = () => {
  localQuery.value = ''
  emit('update-query', '')
  if (debounceTimeout) clearTimeout(debounceTimeout)
  emit('is-searching', false)
}
</script>

<template>
  <div class="search-bar-container">
    <div class="input-group">
      <span class="prefix-icon">🔍</span>
      <input
        type="text"
        :value="localQuery"
        @input="onNativeInput"
        placeholder="검색할 도시 이름 입력 (초성 검색 지원, 예: ㅅㅇ)"
        class="search-input"
      />
      <button class="clear-btn" @click="clearInput" v-show="localQuery">✕</button>
    </div>
    <p class="search-result">
      검색 중인 도시: <strong class="highlight-text">{{ localQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-bar-container {
  width: 100%;
}
.input-group {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.prefix-icon {
  position: absolute;
  left: 10px;
  font-size: 14px;
}
.search-input {
  width: 100%;
  padding: 8px 30px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  height: 32px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.search-input:focus {
  outline: none;
  border-color: #409eff;
}
.clear-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #c0c4cc;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.clear-btn:hover {
  color: #909399;
}
.search-result {
  margin-top: 5px;
  font-size: 13px;
  color: #606266;
}
.highlight-text {
  color: #409eff;
  font-weight: bold;
}
</style>
