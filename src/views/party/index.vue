<template>
  <div class="app-container">
    <h2>党建管理系统</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="党组织管理" name="organization">
        <!-- 党组织管理组件 -->
      </el-tab-pane>
      <el-tab-pane label="党建活动" name="activity">
        <!-- 党建活动组件 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Party',
  data() {
    return {
      activeTab: 'organization'
    }
  }
}
</script>
