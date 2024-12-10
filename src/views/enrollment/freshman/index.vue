<template>
  <div class="app-container">
    <h2>迎新系统</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="信息采集" name="info">
        <!-- 新生信息采集组件 -->
      </el-tab-pane>
      <el-tab-pane label="报到登记" name="register">
        <!-- 报到登记组件 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Freshman',
  data() {
    return {
      activeTab: 'info'
    }
  }
}
</script>
