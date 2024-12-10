<template>
  <div class="dashboard-container">
    <!-- 顶部数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-card">
            <div class="card-title">在校学生总数</div>
            <count-to :start-val="0" :end-val="studentCount" :duration="2000" class="card-number" />
            <div class="card-footer">
              <span>较上月 </span>
              <span :class="{'up': growthRate > 0, 'down': growthRate < 0}">
                {{ Math.abs(growthRate) }}%
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 其他统计卡片 -->
    </el-row>

    <!-- 核心指标图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">教学质量分析</div>
          <div class="chart-container">
            <line-chart :chart-data="teachingData" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">学生就业趋势</div>
          <div class="chart-container">
            <bar-chart :chart-data="employmentData" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 重要通知与待办事项 -->
    <el-row :gutter="20" class="notice-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>重要通知</span>
            <el-button style="float: right; padding: 3px 0" type="text">查看更多</el-button>
          </div>
          <el-table :data="noticeList" style="width: 100%">
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="date" label="发布时间" width="180" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>待办事项</span>
            <el-button style="float: right; padding: 3px 0" type="text">查看更多</el-button>
          </div>
          <el-table :data="todoList" style="width: 100%">
            <el-table-column prop="title" label="事项" />
            <el-table-column prop="deadline" label="截止时间" width="180" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'

export default {
  name: 'Dashboard',
  components: {
    CountTo,
    LineChart,
    BarChart
  },
  data() {
    return {
      studentCount: 12000,
      growthRate: 2.5,
      teachingData: {
        expectedData: [100, 120, 161, 134, 105, 160, 165, 180, 170, 180, 190, 210],
        actualData: [120, 82, 91, 154, 162, 140, 145, 250, 134, 180, 160, 200]
      },
      employmentData: {
        expectedData: [320, 302, 301, 334, 390, 330, 320],
        actualData: [95, 93, 92, 94, 96, 91, 93]
      },
      noticeList: [
        { title: '关于2024年寒假放假安排的通知', date: '2024-01-10' },
        { title: '2024年春季学期开学温馨提示', date: '2024-01-09' }
      ],
      todoList: [
        { title: '教师课程评价填写', deadline: '2024-01-20' },
        { title: '期末成绩录入', deadline: '2024-01-15' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .data-card {
    text-align: center;

    .card-title {
      font-size: 14px;
      color: #666;
    }

    .card-number {
      font-size: 24px;
      font-weight: bold;
      margin: 10px 0;
    }

    .card-footer {
      font-size: 12px;

      .up { color: #67C23A; }
      .down { color: #F56C6C; }
    }
  }

  .chart-row {
    margin-top: 20px;

    .chart-container {
      height: 300px;
    }
  }

  .notice-row {
    margin-top: 20px;
  }
}
</style>
