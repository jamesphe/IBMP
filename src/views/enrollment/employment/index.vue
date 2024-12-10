<template>
  <div class="app-container">
    <h2>就业管理系统</h2>
    <el-card class="box-card">
      <div class="employment-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="就业意向管理" name="intention">
            <div class="tab-content">
              <p>就业意向调查与统计</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="访企拓岗管理" name="enterprise">
            <div class="tab-content">
              <p>企业走访与岗位开发记录</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Employment',
  data() {
    return {
      activeTab: 'intention'
    }
  }
}
</script>

<style scoped>
.employment-content {
  padding: 20px;
}
.tab-content {
  margin-top: 20px;
}
</style>
