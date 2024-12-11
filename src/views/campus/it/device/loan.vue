<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>设备借用申请</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="handleCreateLoan"
        >
          新增借用
        </el-button>
      </div>
      <el-table :data="loanList" style="width: 100%">
        <el-table-column prop="id" label="申请编号" width="120" />
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="applicant" label="申请人" width="120" />
        <el-table-column prop="loanDate" label="借用日期" width="120" />
        <el-table-column prop="returnDate" label="预计归还日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">{{ row.status | statusNameFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="{row}">
            <el-button
              v-if="row.status === 'pending'"
              type="success"
              size="mini"
              @click="handleApprove(row)"
            >
              审批
            </el-button>
            <el-button
              v-if="row.status === 'using'"
              type="primary"
              size="mini"
              @click="handleReturn(row)"
            >
              归还
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 借用申请表单 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="loanForm" :model="loanForm" :rules="rules" label-width="100px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-select v-model="loanForm.deviceName" placeholder="请选择设备">
            <el-option
              v-for="item in deviceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="借用日期" prop="loanDate">
          <el-date-picker
            v-model="loanForm.loanDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="归还日期" prop="returnDate">
          <el-date-picker
            v-model="loanForm.returnDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="用途说明" prop="purpose">
          <el-input
            v-model="loanForm.purpose"
            type="textarea"
            :rows="3"
            placeholder="请说明借用用途"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitLoan">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DeviceLoan',
  filters: {
    statusFilter(status) {
      const statusMap = {
        pending: 'warning',
        approved: 'success',
        using: 'primary',
        returned: 'info',
        rejected: 'danger'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        pending: '待审批',
        approved: '已批准',
        using: '使用中',
        returned: '已归还',
        rejected: '已拒绝'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      loanList: [
        {
          id: 'DL2024001',
          deviceName: '笔记本电脑',
          applicant: '张三',
          loanDate: '2024-01-15',
          returnDate: '2024-01-20',
          status: 'pending'
        }
      ],
      deviceOptions: [
        { value: 'laptop', label: '笔记本电脑' },
        { value: 'projector', label: '投影仪' },
        { value: 'camera', label: '摄像机' }
      ],
      dialogVisible: false,
      dialogTitle: '',
      loanForm: {
        deviceName: '',
        loanDate: '',
        returnDate: '',
        purpose: ''
      },
      rules: {
        deviceName: [
          { required: true, message: '请选择设备', trigger: 'change' }
        ],
        loanDate: [
          { required: true, message: '请选择借用日期', trigger: 'change' }
        ],
        returnDate: [
          { required: true, message: '请选择归还日期', trigger: 'change' }
        ],
        purpose: [
          { required: true, message: '请说明借用用途', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCreateLoan() {
      this.dialogTitle = '设备借用申请'
      this.loanForm = {
        deviceName: '',
        loanDate: '',
        returnDate: '',
        purpose: ''
      }
      this.dialogVisible = true
    },
    submitLoan() {
      this.$refs.loanForm.validate((valid) => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '申请提交成功!'
          })
          this.dialogVisible = false
        }
      })
    },
    handleApprove(row) {
      this.$confirm('确认批准该借用申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '审批通过!'
        })
      })
    },
    handleReturn(row) {
      this.$confirm('确认归还设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '设备已归还!'
        })
      })
    }
  }
}
</script>
