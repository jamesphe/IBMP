<template>
  <div class="app-container">
    <h2>实习基础管理</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="实习岗位" name="position">
        <!-- 实习岗位管理组件 -->
      </el-tab-pane>
      <el-tab-pane label="实习保险" name="insurance">
        <!-- 实习保险管理组件 -->
      </el-tab-pane>
      <el-tab-pane label="实习报告" name="report">
        <!-- 实习报告管理组件 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'PracticeBase',
  data() {
    return {
      activeTab: 'position'
    }
  }
}
</script>
