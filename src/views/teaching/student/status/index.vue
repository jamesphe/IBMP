<template>
  <div class="app-container">
    <h2>学籍管理</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="basic">
        <!-- 学生基本信息组件 -->
      </el-tab-pane>
      <el-tab-pane label="档案管理" name="archive">
        <!-- 档案管理组件 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Status',
  data() {
    return {
      activeTab: 'basic'
    }
  }
}
</script>
