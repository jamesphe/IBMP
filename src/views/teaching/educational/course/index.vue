<template>
  <div class="app-container">
    <h2>课程与专业管理</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="课程信息" name="course">
        <!-- 课程信息管理组件 -->
      </el-tab-pane>
      <el-tab-pane label="专业设置" name="major">
        <!-- 专业设置管理组件 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Course',
  data() {
    return {
      activeTab: 'course'
    }
  }
}
</script>
