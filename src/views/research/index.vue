<template>
  <div class="app-container">
    <h2>教科研管理系统</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="科研项目" name="project">
        <!-- 科研项目组件 -->
      </el-tab-pane>
      <el-tab-pane label="科研成果" name="achievement">
        <!-- 科研成果组件 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Research',
  data() {
    return {
      activeTab: 'project'
    }
  }
}
</script>
