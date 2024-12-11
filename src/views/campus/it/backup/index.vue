<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <!-- 备份计划管理 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>备份计划</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleCreatePlan"
            >
              新增计划
            </el-button>
          </div>
          <el-table :data="backupPlanList" style="width: 100%">
            <el-table-column prop="name" label="计划名称" />
            <el-table-column prop="type" label="备份类型" width="120">
              <template slot-scope="{row}">
                <el-tag>{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="schedule" label="执行计划" width="120" />
            <el-table-column prop="lastTime" label="上次备份" width="180" />
            <el-table-column prop="nextTime" label="下次备份" width="180" />
            <el-table-column prop="status" label="状态" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                  {{ row.status === 'active' ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="{row}">
                <el-button type="text" @click="handleEditPlan(row)">编辑</el-button>
                <el-button
                  type="text"
                  :type="row.status === 'active' ? 'danger' : 'success'"
                  @click="handleTogglePlan(row)"
                >
                  {{ row.status === 'active' ? '禁用' : '启用' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 备份记录 -->
        <el-card class="box-card" style="margin-top: 20px">
          <div slot="header" class="clearfix">
            <span>备份记录</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleManualBackup"
            >
              立即备份
            </el-button>
          </div>
          <el-table :data="backupRecordList" style="width: 100%">
            <el-table-column prop="id" label="备份编号" width="120" />
            <el-table-column prop="planName" label="计划名称" />
            <el-table-column prop="type" label="备份类型" width="120" />
            <el-table-column prop="size" label="备份大小" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.status | statusFilter">
                  {{ row.status | statusNameFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="备份时间" width="180" />
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="{row}">
                <el-button
                  type="text"
                  :disabled="row.status !== 'success'"
                  @click="handleRestore(row)"
                >
                  恢复
                </el-button>
                <el-button type="text" @click="handleDownload(row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- 恢复记录 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>恢复记录</span>
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in restoreRecordList"
              :key="index"
              :type="item.status | timelineTypeFilter"
              :timestamp="item.time"
            >
              {{ item.content }}
              <div class="timeline-status">
                <el-tag size="mini" :type="item.status | statusFilter">
                  {{ item.status | statusNameFilter }}
                </el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 备份计划表单 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="planForm" :model="planForm" :rules="rules" label-width="100px">
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="planForm.name" />
        </el-form-item>
        <el-form-item label="备份类型" prop="type">
          <el-select v-model="planForm.type" placeholder="请选择备份类型">
            <el-option label="完整备份" value="full" />
            <el-option label="增量备份" value="incremental" />
          </el-select>
        </el-form-item>
        <el-form-item label="备份周期" prop="schedule">
          <el-select v-model="planForm.schedule" placeholder="请选择备份周期">
            <el-option label="每天" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
        </el-form-item>
        <el-form-item label="备份时间" prop="time">
          <el-time-picker
            v-model="planForm.time"
            placeholder="选择时间"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="保留天数" prop="retention">
          <el-input-number v-model="planForm.retention" :min="1" :max="365" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPlan">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BackupManagement',
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        failed: 'danger',
        running: 'warning'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        success: '成功',
        failed: '失败',
        running: '进行中'
      }
      return statusMap[status]
    },
    timelineTypeFilter(status) {
      return status === 'success' ? 'success' : 'danger'
    }
  },
  data() {
    return {
      backupPlanList: [
        {
          name: '数据库完整备份',
          type: '完整备份',
          schedule: '每天',
          lastTime: '2024-01-09 23:00:00',
          nextTime: '2024-01-10 23:00:00',
          status: 'active'
        }
      ],
      backupRecordList: [
        {
          id: 'BK2024001',
          planName: '数据库完整备份',
          type: '完整备份',
          size: '2.5GB',
          status: 'success',
          createTime: '2024-01-09 23:00:00'
        }
      ],
      restoreRecordList: [
        {
          time: '2024-01-09 10:00:00',
          content: '恢复数据库备份 BK2024001',
          status: 'success'
        }
      ],
      dialogVisible: false,
      dialogTitle: '',
      planForm: {
        name: '',
        type: '',
        schedule: '',
        time: '',
        retention: 30
      },
      rules: {
        name: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择备份类型', trigger: 'change' }
        ],
        schedule: [
          { required: true, message: '请选择备份周期', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请选择备份时间', trigger: 'change' }
        ],
        retention: [
          { required: true, message: '请输入保留天数', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCreatePlan() {
      this.dialogTitle = '新增备份计划'
      this.planForm = {
        name: '',
        type: '',
        schedule: '',
        time: '',
        retention: 30
      }
      this.dialogVisible = true
    },
    submitPlan() {
      this.$refs.planForm.validate((valid) => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '备份计划创建成功!'
          })
          this.dialogVisible = false
        }
      })
    },
    handleEditPlan(row) {
      // 实现编辑备份计划
    },
    handleTogglePlan(row) {
      // 实现启用/禁用备份计划
    },
    handleManualBackup() {
      // 实现手动备份
    },
    handleRestore(row) {
      this.$confirm('确认恢复该备份?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '恢复操作已启动!'
        })
      })
    },
    handleDownload(row) {
      // 实现备份下载
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline-status {
  margin-top: 5px;
}
</style>
