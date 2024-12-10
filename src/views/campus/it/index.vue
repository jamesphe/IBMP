<template>
  <div class="app-container">
    <h2>IT运维管理系统</h2>
    <el-card class="box-card">
      <div class="it-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="事件与工单" name="incident">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>事件管理</span>
                    </div>
                    <div class="data-item">
                      <p>事件登记与分类</p>
                      <p>事件处理记录</p>
                      <p>事件处理统计</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>工单管理</span>
                    </div>
                    <div class="data-item">
                      <p>工单创建与分配</p>
                      <p>工单处理跟踪</p>
                      <p>工单���计分析</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="服务管理" name="service">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>服务级别</span>
                    </div>
                    <div class="data-item">
                      <p>SLA指标管理</p>
                      <p>SLA监控分析</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>服务目录</span>
                    </div>
                    <div class="data-item">
                      <p>服务目录管理</p>
                      <p>服务使用统计</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="配置与备份" name="config">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>配置管理</span>
                    </div>
                    <div class="data-item">
                      <p>配置变更记录</p>
                      <p>配置审批管理</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>备份管理</span>
                    </div>
                    <div class="data-item">
                      <p>数据备份计划</p>
                      <p>系统恢复管理</p>
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
  name: 'IT',
  data() {
    return {
      activeTab: 'incident'
    }
  }
}
</script>

<style scoped>
.it-content {
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
