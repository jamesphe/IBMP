<template>
  <div class="app-container">
    <h2>教学资源与学习行为</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="教学资源" name="resource">
        <!-- 教学资源管理组件 -->
      </el-tab-pane>
      <el-tab-pane label="学习记录" name="record">
        <!-- 学习记录管理组件 -->
      </el-tab-pane>
      <el-tab-pane label="课堂互动" name="interaction">
        <!-- 课堂互动管理组件 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Resource',
  data() {
    return {
      activeTab: 'resource'
    }
  }
}
</script>
