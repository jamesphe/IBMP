<template>
  <div class="app-container">
    <!-- SLA指标定义 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>SLA指标定义</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="handleCreateSLA"
        >
          新增SLA
        </el-button>
      </div>
      <el-table :data="slaList" style="width: 100%">
        <el-table-column prop="name" label="SLA名称" />
        <el-table-column prop="level" label="服务级别" width="120">
          <template slot-scope="{row}">
            <el-tag :type="row.level | levelFilter">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="responseTime" label="响应时间" width="120" />
        <el-table-column prop="resolveTime" label="解决时间" width="120" />
        <el-table-column prop="availability" label="可用性" width="120" />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" size="small" style="color: #F56C6C" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- SLA监控 -->
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>SLA实时监控</span>
        <el-date-picker
          v-model="dateRange"
          style="float: right; margin-right: 20px"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="handleDateChange"
        />
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-title">响应时间达成率</div>
            <div class="stat-value">{{ stats.responseRate }}%</div>
            <div ref="responseChart" class="stat-chart" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-title">解决时间达成率</div>
            <div class="stat-value">{{ stats.resolveRate }}%</div>
            <div ref="resolveChart" class="stat-chart" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-title">服务可用性</div>
            <div class="stat-value">{{ stats.availability }}%</div>
            <div ref="availabilityChart" class="stat-chart" />
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- SLA达成统计 -->
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>SLA达成统计</span>
      </div>
      <el-table :data="slaStats" style="width: 100%">
        <el-table-column prop="name" label="SLA名称" />
        <el-table-column prop="total" label="总事件数" width="120" />
        <el-table-column prop="achieved" label="达成数" width="120" />
        <el-table-column prop="rate" label="达成率" width="120">
          <template slot-scope="{row}">
            <el-progress :percentage="row.rate" :status="row.rate >= 90 ? 'success' : 'warning'" />
          </template>
        </el-table-column>
        <el-table-column label="未达成原因分析" min-width="200">
          <template slot-scope="{row}">
            <el-button type="text" @click="showAnalysis(row)">查看分析</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- SLA编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="slaForm" :model="slaForm" :rules="rules" label-width="100px">
        <el-form-item label="SLA名称" prop="name">
          <el-input v-model="slaForm.name" />
        </el-form-item>
        <el-form-item label="服务级别" prop="level">
          <el-select v-model="slaForm.level" placeholder="请选择服务级别">
            <el-option label="一级" value="一级" />
            <el-option label="二级" value="二级" />
            <el-option label="三级" value="三级" />
          </el-select>
        </el-form-item>
        <el-form-item label="响应时间" prop="responseTime">
          <el-input v-model="slaForm.responseTime">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="解决时间" prop="resolveTime">
          <el-input v-model="slaForm.resolveTime">
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
        <el-form-item label="可用性" prop="availability">
          <el-input v-model="slaForm.availability">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSLA">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'SLAManagement',
  filters: {
    levelFilter(level) {
      const levelMap = {
        '一级': 'danger',
        '二级': 'warning',
        '三级': 'info'
      }
      return levelMap[level]
    }
  },
  data() {
    return {
      dateRange: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      slaList: [
        {
          name: '关键业务SLA',
          level: '一级',
          responseTime: '15分钟',
          resolveTime: '2小时',
          availability: '99.9%'
        },
        {
          name: '重要业务SLA',
          level: '二级',
          responseTime: '30分钟',
          resolveTime: '4小时',
          availability: '99.5%'
        }
      ],
      stats: {
        responseRate: 98.5,
        resolveRate: 97.2,
        availability: 99.9
      },
      slaStats: [
        {
          name: '关键业务SLA',
          total: 100,
          achieved: 95,
          rate: 95
        },
        {
          name: '重要业务SLA',
          total: 200,
          achieved: 186,
          rate: 93
        }
      ],
      dialogVisible: false,
      dialogTitle: '',
      slaForm: {
        name: '',
        level: '',
        responseTime: '',
        resolveTime: '',
        availability: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入SLA名称', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择服务级别', trigger: 'change' }
        ],
        responseTime: [
          { required: true, message: '请输入响应时间', trigger: 'blur' }
        ],
        resolveTime: [
          { required: true, message: '请输入解决时间', trigger: 'blur' }
        ],
        availability: [
          { required: true, message: '请输入可用性', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  methods: {
    initCharts() {
      // 初始化图表
      ['response', 'resolve', 'availability'].forEach(type => {
        const chart = echarts.init(this.$refs[type + 'Chart'])
        chart.setOption({
          grid: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            show: false
          },
          yAxis: {
            type: 'value',
            show: false
          },
          series: [{
            data: [98, 95, 97, 99, 96, 98, 97],
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {}
          }]
        })
      })
    },
    handleCreateSLA() {
      this.dialogTitle = '新增SLA'
      this.slaForm = {
        name: '',
        level: '',
        responseTime: '',
        resolveTime: '',
        availability: ''
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑SLA'
      this.slaForm = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确认删除该SLA?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    submitSLA() {
      this.$refs.slaForm.validate((valid) => {
        if (valid) {
          this.$message({
            type: 'success',
            message: this.dialogTitle === '新增SLA' ? '创建成功!' : '更新成功!'
          })
          this.dialogVisible = false
        }
      })
    },
    handleDateChange() {
      // 处理日期变更，重新获取数据
    },
    showAnalysis(row) {
      this.$alert('未达成原因分析内容', '分析详情', {
        confirmButtonText: '确定'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.stat-card {
  padding: 20px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 4px;

  .stat-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 10px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 10px;
  }

  .stat-chart {
    height: 100px;
  }
}
</style>
