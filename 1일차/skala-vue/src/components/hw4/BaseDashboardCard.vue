<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <el-card class="dashboard-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">{{ title }}</h3>
      </div>
    </template>
    <div class="card-content">
      <slot>디폴트 콘텐츠</slot>
    </div>
  </el-card>
</template>

<style scoped>
.dashboard-card {
  margin-bottom: 20px;
  border-radius: 8px;
}
.card-header {
  display: flex;
  align-items: center;
}
.card-title {
  margin: 0;
  font-size: 16px;
  color: #333;
}
.card-content {
  padding: 10px 0;
}
</style>
