<template>
  <div class="app-container">
    <h2>排课与选课管理</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="排课管理" name="arrange">
        <!-- 排课管理组件 -->
      </el-tab-pane>
      <el-tab-pane label="选课管理" name="select">
        <!-- 选课管理组件 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Schedule',
  data() {
    return {
      activeTab: 'arrange'
    }
  }
}
</script>
