<template>
  <div class="app-container">
    <el-tabs v-model="activeTab">
      <!-- 配置变更记录 -->
      <el-tab-pane label="配置变更记录" name="changes">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>变更记录</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleCreateChange"
            >
              提交变更
            </el-button>
          </div>
          <el-table :data="changeList" style="width: 100%">
            <el-table-column prop="id" label="变更编号" width="120" />
            <el-table-column prop="type" label="变更类型" width="120">
              <template slot-scope="{row}">
                <el-tag :type="row.type | typeFilter">{{ row.type | typeNameFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="变更内容" />
            <el-table-column prop="submitter" label="提交人" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.status | statusFilter">{{ row.status | statusNameFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="提交时间" width="180" />
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="{row}">
                <el-button type="text" @click="handleViewChange(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 硬件配置清单 -->
      <el-tab-pane label="硬件配置清单" name="hardware">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>硬件配置</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleAddHardware"
            >
              添加设备
            </el-button>
          </div>
          <el-table :data="hardwareList" style="width: 100%">
            <el-table-column prop="name" label="设备名称" />
            <el-table-column prop="type" label="设备类型" width="120" />
            <el-table-column prop="spec" label="配置规格" />
            <el-table-column prop="location" label="位置" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.status === 'online' ? 'success' : 'danger'">
                  {{ row.status === 'online' ? '在线' : '离线' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="{row}">
                <el-button type="text" @click="handleEditHardware(row)">编辑</el-button>
                <el-button type="text" style="color: #F56C6C" @click="handleDeleteHardware(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 网络拓扑管理 -->
      <el-tab-pane label="网络拓扑管理" name="topology">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>网络拓扑图</span>
            <el-button-group style="float: right">
              <el-button type="primary" size="small" icon="el-icon-refresh" @click="refreshTopology">
                刷新
              </el-button>
              <el-button type="success" size="small" icon="el-icon-download" @click="exportTopology">
                导出
              </el-button>
            </el-button-group>
          </div>
          <div ref="topologyChart" style="height: 600px" />
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 变更提交对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="changeForm" :model="changeForm" :rules="rules" label-width="100px">
        <el-form-item label="变更类型" prop="type">
          <el-select v-model="changeForm.type" placeholder="请选择变更类型">
            <el-option label="硬件配置" value="hardware" />
            <el-option label="网络配置" value="network" />
            <el-option label="系统配置" value="system" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更内容" prop="content">
          <el-input
            v-model="changeForm.content"
            type="textarea"
            :rows="4"
            placeholder="请详细描述变更内容"
          />
        </el-form-item>
        <el-form-item label="影响范围" prop="impact">
          <el-input
            v-model="changeForm.impact"
            type="textarea"
            :rows="2"
            placeholder="请说明变更影响范围"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitChange">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ConfigManagement',
  filters: {
    typeFilter(type) {
      const typeMap = {
        hardware: 'warning',
        network: 'danger',
        system: 'info'
      }
      return typeMap[type]
    },
    typeNameFilter(type) {
      const typeMap = {
        hardware: '硬件配置',
        network: '网络配置',
        system: '系统配置'
      }
      return typeMap[type]
    },
    statusFilter(status) {
      const statusMap = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        pending: '待审批',
        approved: '已通过',
        rejected: '已拒绝'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      activeTab: 'changes',
      changeList: [
        {
          id: 'CH2024001',
          type: 'network',
          content: '更新核心交换机配置',
          submitter: '张三',
          status: 'pending',
          createTime: '2024-01-10 10:30:00'
        }
      ],
      hardwareList: [
        {
          name: '核心交换机',
          type: '网络设备',
          spec: 'Cisco Catalyst 9300',
          location: '机房A区',
          status: 'online'
        }
      ],
      dialogVisible: false,
      dialogTitle: '',
      changeForm: {
        type: '',
        content: '',
        impact: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择变更类型', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入变更内容', trigger: 'blur' }
        ],
        impact: [
          { required: true, message: '请说明影响范围', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.activeTab === 'topology') {
        this.initTopologyChart()
      }
    })
  },
  methods: {
    initTopologyChart() {
      const chart = echarts.init(this.$refs.topologyChart)
      // 这里实现网络拓扑图的配置
      chart.setOption({
        title: {
          text: '网络拓扑图'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [{
          type: 'graph',
          layout: 'force',
          symbolSize: 50,
          roam: true,
          label: {
            show: true
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            fontSize: 20
          },
          data: [{
            name: '核心交换机',
            category: 0
          }, {
            name: '汇聚交换机A',
            category: 1
          }, {
            name: '汇聚交换机B',
            category: 1
          }],
          links: [{
            source: '核心交换机',
            target: '汇聚交换机A'
          }, {
            source: '核心交换机',
            target: '汇聚交换机B'
          }],
          categories: [{
            name: '核心'
          }, {
            name: '汇聚'
          }],
          force: {
            repulsion: 2500,
            edgeLength: [100, 200]
          }
        }]
      })
    },
    handleCreateChange() {
      this.dialogTitle = '提交变更申请'
      this.changeForm = {
        type: '',
        content: '',
        impact: ''
      }
      this.dialogVisible = true
    },
    submitChange() {
      this.$refs.changeForm.validate((valid) => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '变更申请提交成功!'
          })
          this.dialogVisible = false
        }
      })
    },
    handleViewChange(row) {
      // 实现查看变更详情
    },
    handleAddHardware() {
      // 实现添加硬件设备
    },
    handleEditHardware(row) {
      // 实现编辑硬件配置
    },
    handleDeleteHardware(row) {
      // 实现删除硬件设备
    },
    refreshTopology() {
      // 实现刷新拓扑图
      this.initTopologyChart()
    },
    exportTopology() {
      // 实现导出拓扑图
      this.$message('拓扑图导出功能待实现')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button-group {
  margin-top: -5px;
}
</style>
