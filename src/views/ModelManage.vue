<template>
  <div class="model-page">
    <el-card shadow="never">
      <div slot="header" class="card-header">
        <span class="title">模型管理</span>
      </div>
      <p class="hint">11模型管理功能开发中，敬请期待。</p>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ModelManage",
};
</script>

<style scoped>
.model-page {
  max-width: 100%;
  margin: 0 auto;
}

.card-header {
  display: flex;
  align-items: center;
}

.card-header .title {
  font-size: 16px;
  font-weight: 600;
}

.hint {
  margin: 0;
  color: #909399;
  font-size: 14px;
}
</style>
