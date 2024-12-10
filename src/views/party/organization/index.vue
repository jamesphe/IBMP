<template>
  <div class="app-container">
    <h2>党组织管理</h2>
    <el-card class="box-card">
      <div class="organization-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="组织基础管理" name="basic">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>党组织信息</span>
                    </div>
                    <div class="data-item">
                      <p>组织架构管理</p>
                      <p>基本信息维护</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>党员发展</span>
                    </div>
                    <div class="data-item">
                      <p>入党申请管理</p>
                      <p>发展对象管理</p>
                      <p>预备党员管理</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="组织关系管理" name="relation">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>组织关系转移</span>
                    </div>
                    <div class="data-item">
                      <p>转入申请管理</p>
                      <p>转出审批管理</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>干部学习</span>
                    </div>
                    <div class="data-item">
                      <p>学习计划管理</p>
                      <p>学习记录统计</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PartyOrganization',
  data() {
    return {
      activeTab: 'basic'
    }
  }
}
</script>

<style scoped>
.organization-content {
  padding: 20px;
}
.tab-content {
  margin-top: 20px;
}
.data-item {
  line-height: 2;
}
.el-card {
  margin-bottom: 20px;
}
</style>
