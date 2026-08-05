<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-text">
      날씨 단위:
      <strong>{{ configStore.unitSymbol }}</strong>
    </span>
    <el-button size="small" type="primary" plain @click="configStore.toggleUnit">
      단위변경
    </el-button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
.unit-text {
  color: #555;
}
</style>
