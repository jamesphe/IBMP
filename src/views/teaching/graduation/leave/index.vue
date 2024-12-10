<template>
  <div class="app-container">
    <h2>离校与毕业去向</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="离校手续" name="leave">
        <!-- 离校手续管理组件 -->
      </el-tab-pane>
      <el-tab-pane label="升学统计" name="further">
        <!-- 升学统计管理组件 -->
      </el-tab-pane>
      <el-tab-pane label="就业统计" name="employment">
        <!-- 就业统计管理组件 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Leave',
  data() {
    return {
      activeTab: 'leave'
    }
  }
}
</script>
