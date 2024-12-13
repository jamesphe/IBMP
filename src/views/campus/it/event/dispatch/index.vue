<template>
  <div class="app-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="事件分派" name="dispatch">
        <div class="filter-container">
          <el-input
            v-model="listQuery.keyword"
            placeholder="事件标题/编号"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-select v-model="listQuery.eventType" placeholder="事件类型" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in eventTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="listQuery.priority" placeholder="优先级" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>
        </div>

        <el-table :data="dispatchList" border style="width: 100%">
          <el-table-column label="事件编号" prop="id" align="center" width="120">
            <template slot-scope="{row}">
              <span class="event-id">{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="事件标题" prop="title" min-width="200" show-overflow-tooltip />
          <el-table-column label="事件类型" min-width="120" align="center">
            <template slot-scope="{row}">
              <el-tag size="medium">{{ row.eventType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="优先级" width="100" align="center">
            <template slot-scope="{row}">
              <el-tag :type="row.priority | priorityFilter">{{ row.priority }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="提交人" width="100" align="center" prop="creator" />
          <el-table-column label="所属部门" min-width="180" align="center">
            <template slot-scope="{row}">
              <span>{{ row.creatorDept.join(' / ') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="180" align="center">
            <template slot-scope="{row}">
              <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="handleAssign(row)">
                分派
              </el-button>
              <el-button size="mini" @click="handleDetail(row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getDispatchList"
        />
      </el-tab-pane>

      <el-tab-pane label="调度规则" name="rules">
        <div class="filter-container">
          <el-button type="primary" @click="handleAddRule">
            新增规则
          </el-button>
        </div>

        <el-table :data="rulesList" border style="width: 100%; margin-top: 20px">
          <el-table-column label="规则名称" prop="name" min-width="150" />
          <el-table-column label="事件类型" min-width="150">
            <template slot-scope="{row}">
              <el-tag size="medium">{{ row.eventType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="优先级" width="100" align="center">
            <template slot-scope="{row}">
              <el-tag :type="row.priority | priorityFilter">{{ row.priority }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="目标处理组" prop="targetGroup" min-width="150" />
          <el-table-column label="状态" width="100" align="center">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.status"
                active-text="启用"
                inactive-text="停用"
                @change="handleRuleStatusChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="{row}">
              <el-button type="text" @click="handleEditRule(row)">编辑</el-button>
              <el-button type="text" class="danger-text" @click="handleDeleteRule(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="事件分派"
      :visible.sync="assignDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="assignForm" :model="assignForm" :rules="assignRules" label-width="100px">
        <el-form-item label="处理人" prop="handler" required>
          <el-select v-model="assignForm.handler" placeholder="请选择处理人" style="width: 100%">
            <el-option
              v-for="item in handlerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分派说明" prop="note">
          <el-input
            type="textarea"
            v-model="assignForm.note"
            :rows="4"
            placeholder="请输入分派说明(选填)"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAssign">确认分派</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="ruleDialogType === 'create' ? '新增规则' : '编辑规则'"
      :visible.sync="ruleDialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="ruleRules" label-width="100px">
        <el-form-item label="规则名称" prop="name" required>
          <el-input v-model="ruleForm.name" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="事件类型" prop="eventType" required>
          <el-select v-model="ruleForm.eventType" placeholder="请选择事件类型" style="width: 100%">
            <el-option
              v-for="item in eventTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority" required>
          <el-select v-model="ruleForm.priority" placeholder="请选择优先级" style="width: 100%">
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标处理组" prop="targetGroup" required>
          <el-select v-model="ruleForm.targetGroup" placeholder="请选择处理组" style="width: 100%">
            <el-option
              v-for="item in groupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规则说明" prop="description">
          <el-input
            type="textarea"
            v-model="ruleForm.description"
            :rows="4"
            placeholder="请输入规则说明(选填)"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ruleDialogType === 'create' ? createRule() : updateRule()">
          {{ ruleDialogType === 'create' ? '确认新增' : '确认修改' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkPermission } from '@/utils/permission'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

// 模拟待分派事件列表
const mockDispatchList = [
  {
    id: 'EV2024030007',
    title: '网络连接异常',
    priority: '高',
    creator: '李老师',
    creatorDept: ['信息工程学院', '网络工程系'],
    createTime: '2024-03-02 14:30:00',
    eventType: '网络故障'
  },
  {
    id: 'EV2024030008',
    title: '邮件系统故障',
    priority: '紧急',
    creator: '张主任',
    creatorDept: ['行政部门', '教务处'],
    createTime: '2024-03-02 15:00:00',
    eventType: '系统故障'
  }
]

// 模拟调度规则列表
const mockRulesList = [
  {
    id: 1,
    name: '网络故障处理规则',
    eventType: '网络故障',
    priority: '高',
    targetGroup: '网络运维组',
    status: true,
    description: '处理各类网络连接、访问异常等问题'
  },
  {
    id: 2,
    name: '系统故障处理规则',
    eventType: '系统故障',
    priority: '紧急',
    targetGroup: '系统运维组',
    status: true,
    description: '处理各类系统崩溃、无法访问等问题'
  }
]

export default {
  name: 'EventDispatch',
  components: {
    Pagination
  },
  directives: { waves },
  filters: {
    priorityFilter(priority) {
      const priorityMap = {
        '紧急': 'danger',
        '高': 'warning',
        '中': '',
        '低': 'info'
      }
      return priorityMap[priority]
    }
  },
  data() {
    return {
      activeTab: 'dispatch',
      // 分派列表相关
      dispatchList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
        priority: undefined,
        eventType: undefined
      },
      // 规则列表相关
      rulesList: [],
      // 分派对话框
      assignDialogVisible: false,
      assignForm: {
        handler: '',
        note: ''
      },
      assignRules: {
        handler: [{ required: true, message: '请选择处理人', trigger: 'change' }]
      },
      currentRow: null,
      // 规则对话框
      ruleDialogVisible: false,
      ruleDialogType: 'create',
      ruleForm: {
        name: '',
        eventType: '',
        priority: '',
        targetGroup: '',
        description: ''
      },
      ruleRules: {
        name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        eventType: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
        priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
        targetGroup: [{ required: true, message: '请选择目标处理组', trigger: 'change' }]
      },
      // 选项数据
      priorityOptions: [
        { label: '紧急', value: '紧急' },
        { label: '高', value: '高' },
        { label: '中', value: '中' },
        { label: '低', value: '低' }
      ],
      handlerOptions: [
        { label: '张工', value: '张工' },
        { label: '王工', value: '王工' },
        { label: '李工', value: '李工' }
      ],
      eventTypeOptions: [
        { label: '网络故障', value: '网络故障' },
        { label: '系统故障', value: '系统故障' },
        { label: '硬件故障', value: '硬件故障' },
        { label: '软件故障', value: '软件故障' },
        { label: '账号问题', value: '账号问题' },
        { label: '数据问题', value: '数据问题' },
        { label: '其他问题', value: '其他问题' }
      ],
      groupOptions: [
        { label: '网络运维组', value: '网络运维组' },
        { label: '系统运维组', value: '系统运维组' },
        { label: '应用支持组', value: '应用支持组' }
      ]
    }
  },
  created() {
    this.getDispatchList()
    this.getRulesList()
  },
  methods: {
    checkPermission,
    handleFilter() {
      this.listQuery.page = 1
      this.getDispatchList()
    },
    getDispatchList() {
      // TODO: 调用API获取待分派事件列表
      this.dispatchList = mockDispatchList
      this.total = mockDispatchList.length
    },
    getRulesList() {
      // TODO: 调用API获取调度规则列表
      this.rulesList = mockRulesList
    },
    handleAssign(row) {
      this.currentRow = row
      this.assignDialogVisible = true
      this.assignForm = {
        handler: '',
        note: ''
      }
    },
    confirmAssign() {
      this.$refs.assignForm.validate(valid => {
        if (valid) {
          // TODO: 调用分派API
          this.$message.success('事件分派成功')
          this.assignDialogVisible = false
          this.getDispatchList()
        }
      })
    },
    handleDetail(row) {
      this.$router.push(`/campus/it/event/detail/${row.id}`)
    },
    handleAddRule() {
      this.ruleDialogType = 'create'
      this.ruleForm = {
        name: '',
        eventType: '',
        priority: '',
        targetGroup: '',
        description: ''
      }
      this.ruleDialogVisible = true
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    handleEditRule(row) {
      this.ruleDialogType = 'update'
      this.ruleForm = Object.assign({}, row)
      this.ruleDialogVisible = true
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    createRule() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // TODO: 调用新增规则API
          this.rulesList.unshift({
            id: Date.now(),
            ...this.ruleForm,
            status: true
          })
          this.$message.success('规则添加成功')
          this.ruleDialogVisible = false
        }
      })
    },
    updateRule() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // TODO: 调用更新规则API
          const index = this.rulesList.findIndex(item => item.id === this.ruleForm.id)
          this.rulesList.splice(index, 1, Object.assign({}, this.ruleForm))
          this.$message.success('规则更新成功')
          this.ruleDialogVisible = false
        }
      })
    },
    handleDeleteRule(row) {
      this.$confirm('确认删除该规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO: 调用删除规则API
        const index = this.rulesList.findIndex(item => item.id === row.id)
        this.rulesList.splice(index, 1)
        this.$message.success('规则删除成功')
      })
    },
    handleRuleStatusChange(row) {
      // TODO: 调用更新规则状态API
      this.$message.success(`规则${row.status ? '启用' : '停用'}成功`)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    margin-right: 10px;
  }
}

.event-id {
  font-family: Monaco, monospace;
  font-size: 13px;
}

.danger-text {
  color: #F56C6C;
}

::v-deep {
  .el-switch__label {
    color: #909399;
    font-size: 12px;
  }
}
</style> 