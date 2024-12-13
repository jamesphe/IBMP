<template>
  <div class="app-container">
    <div class="filter-container">
      <el-radio-group v-model="listQuery.viewType" class="filter-item" @change="handleFilter">
        <el-radio-button label="all">全部事件</el-radio-button>
        <el-radio-button label="my">我提交的</el-radio-button>
        <el-radio-button label="pending">待处理的</el-radio-button>
      </el-radio-group>
    </div>

    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="事件标题/编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.status" placeholder="事件状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.priority" placeholder="优先级" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.handler" placeholder="处理人" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in handlerOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        v-model="listQuery.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="filter-item"
        style="width: 240px"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        登记事件
      </el-button>
    </div>

    <el-table
      :data="list"
      border
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column label="事件编号" prop="id" align="center" width="120" sortable="custom">
        <template slot-scope="{row}">
          <span class="event-id">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件标题" prop="title" min-width="200" show-overflow-tooltip />
      <el-table-column label="优先级" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.priority | priorityFilter">{{ row.priority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="处理人" width="120" align="center" prop="handler" />
      <el-table-column label="提交人" width="100" align="center" prop="creator" />
      <el-table-column label="提交人身份" width="100" align="center" prop="creatorRole" />
      <el-table-column label="所属部门" min-width="180" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creatorDept.join(' / ') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)" v-if="checkPermission(['admin', 'handler'])">
            编辑
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
      @pagination="getList"
    />

    <el-dialog 
      :visible.sync="dialogVisible" 
      :title="dialogType==='create'?'登记事件':'编辑事件'"
      width="800px"
      :close-on-click-modal="false"
      custom-class="event-dialog"
    >
      <el-form 
        ref="dataForm" 
        :model="temp" 
        :rules="rules" 
        label-position="right" 
        label-width="120px"
        class="event-form"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">基本信息</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="事件编号" v-if="dialogType==='update'">
                <span class="form-text">{{ temp.id }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="事件标题" prop="title" required>
                <el-input v-model="temp.title" placeholder="请输入事件标题" maxlength="50" show-word-limit/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="事件描述" prop="description" required>
                <el-input 
                  type="textarea" 
                  v-model="temp.description" 
                  :rows="4" 
                  placeholder="请详细描述事件发生的具体情况、影响范围等"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="优先级" prop="priority" required>
                <el-select v-model="temp.priority" placeholder="请选择优先级" class="full-width">
                  <el-option
                    v-for="item in priorityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    <el-tag :type="item.value | priorityFilter" size="small" style="margin-right: 8px">
                      {{ item.label }}
                    </el-tag>
                    <span class="priority-desc">{{ getPriorityDesc(item.value) }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="dialogType==='update'">
              <el-form-item label="处理状态" prop="status">
                <el-select v-model="temp.status" placeholder="请选择状态" class="full-width">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    <el-tag :type="item.value | statusFilter" size="small" style="margin-right: 8px">
                      {{ item.label }}
                    </el-tag>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="dialogType==='update'">
            <el-col :span="12">
              <el-form-item label="处理人" prop="handler">
                <el-select v-model="temp.handler" placeholder="请选择处理人" class="full-width">
                  <el-option v-for="item in handlerOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 提交人信息 -->
        <div class="form-section" v-if="dialogType==='create'">
          <div class="section-header">
            <span class="section-title">提交人信息</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="提交人" prop="creator" required>
                <el-input v-model="temp.creator" placeholder="请输入姓名" maxlength="20"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份" prop="creatorRole" required>
                <el-select v-model="temp.creatorRole" placeholder="请选择身份" class="full-width">
                  <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="所属部门" prop="creatorDept" required>
                <el-cascader
                  v-model="temp.creatorDept"
                  :options="deptOptions"
                  :props="{ checkStrictly: false }"
                  placeholder="请选择所属部门"
                  class="full-width"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 编辑时显示提交信息 -->
        <div class="form-section" v-if="dialogType==='update'">
          <div class="section-header">
            <span class="section-title">提交信息</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="info-item">
                <span class="info-label">提交人：</span>
                <span class="info-value">{{ temp.creator }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <span class="info-label">提交人身份：</span>
                <span class="info-value">{{ temp.creatorRole }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <span class="info-label">提交时间：</span>
                <span class="info-value">{{ temp.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="info-item">
                <span class="info-label">所属部门：</span>
                <span class="info-value">{{ temp.creatorDept.join(' / ') }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogType==='create'?createData():updateData()">
          {{ dialogType==='create'?'提 交':'保 存' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkPermission } from '@/utils/permission'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

// 修改模拟数据列表
const mockList = [
  {
    id: 'EV2024030001',
    title: '教务系统无法登录',
    description: '信息系教师反映无法登录教务系统,影响正常教学',
    priority: '紧急',
    status: '待处理',
    handler: '张工',
    createTime: '2024-03-01 09:30:00',
    creator: '王明',
    creatorRole: '教师',
    creatorDept: ['信息工程学院', '计算机系']
  },
  {
    id: 'EV2024030002',
    title: '多媒体教室投影仪故障',
    description: '综合楼B403教室投影仪无法显示,需要紧急处理',
    priority: '高',
    status: '处理中',
    handler: '王工',
    createTime: '2024-03-01 10:15:00',
    creator: '王明',
    creatorRole: '教师',
    creatorDept: ['信息工程学院', '计算机系']
  },
  {
    id: 'EV2024030003',
    title: '图书馆网络故障',
    description: '图书馆三楼阅览室网络无法访问,影响学生查阅资料',
    priority: '高',
    status: '已完成',
    handler: '刘工',
    createTime: '2024-03-01 11:00:00',
    creator: '陈馆长',
    creatorRole: '教辅人员',
    creatorDept: ['行政部门', '图书馆']
  },
  {
    id: 'EV2024030004',
    title: '机房电脑蓝屏',
    description: '计算机系机房B205有多台电脑出现蓝屏现象',
    priority: '中',
    status: '处理中',
    handler: '李工',
    createTime: '2024-03-01 14:20:00',
    creator: '王明',
    creatorRole: '教师',
    creatorDept: ['信息工程学院', '计算机系']
  },
  {
    id: 'EV2024030005',
    title: '打印机卡纸',
    description: '行政楼203办公打印机卡纸,需要处理',
    priority: '低',
    status: '已完成',
    handler: '张工',
    createTime: '2024-03-01 15:45:00',
    creator: '王明',
    creatorRole: '教师',
    creatorDept: ['信息工程学院', '计算机系']
  },
  {
    id: 'EV2024030006',
    title: '教室空调不制冷',
    description: 'A305教室空调运行异常,影响上课',
    priority: '中',
    status: '待处���',
    handler: '',
    createTime: '2024-03-02 08:30:00',
    creator: '李主任',
    creatorRole: '教师',
    creatorDept: ['机械工程学院', '机械设计系']
  }
]

// 在 mockList 后添加模拟处理人列表
const mockHandlers = [
  { label: '张工', value: '张工' },
  { label: '王工', value: '王工' },
  { label: '刘工', value: '刘工' },
  { label: '李工', value: '李工' }
]

// 添加身份选项
const roleOptions = [
  { label: '教师', value: '教师' },
  { label: '学生', value: '学生' },
  { label: '教辅人员', value: '教辅人员' },
  { label: '行政人员', value: '行政人员' }
]

// 添加部门选项
const deptOptions = [
  {
    value: '信息工程学院',
    label: '信息工程学院',
    children: [
      { value: '计算机系', label: '计算机系' },
      { value: '软件工程系', label: '软件工程系' },
      { value: '网络工程系', label: '网络工程系' }
    ]
  },
  {
    value: '机械工程学院',
    label: '机械工程学院',
    children: [
      { value: '机械设计系', label: '机械设计系' },
      { value: '机电一体化系', label: '机电一体化系' }
    ]
  },
  {
    value: '经济管理学院',
    label: '经济管理学院',
    children: [
      { value: '会计系', label: '会计系' },
      { value: '工商管理系', label: '工商管理系' }
    ]
  },
  {
    value: '行政部门',
    label: '行政部门',
    children: [
      { value: '教务处', label: '教务处' },
      { value: '学生处', label: '学生处' },
      { value: '图书馆', label: '图书馆' },
      { value: '后勤处', label: '后勤处' }
    ]
  }
]

// 修改过滤器和选项
export default {
  name: 'EventSearch',
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
    },
    statusFilter(status) {
      const statusMap = {
        '待处理': 'info',
        '处理中': 'warning',
        '已完成': 'success',
        '已关闭': 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        viewType: 'all',
        keyword: undefined,
        status: undefined,
        priority: undefined,
        handler: undefined,
        dateRange: [],
        sort: '+id'
      },
      statusOptions: [
        { label: '待处理', value: '待处理' },
        { label: '���理中', value: '处理中' },
        { label: '已完成', value: '已完成' },
        { label: '已关闭', value: '已关闭' }
      ],
      priorityOptions: [
        { label: '紧急', value: '紧急' },
        { label: '高', value: '高' },
        { label: '中', value: '中' },
        { label: '低', value: '低' }
      ],
      handlerOptions: mockHandlers, // 使用模拟处理人列表
      dialogVisible: false,
      dialogType: 'create',
      temp: {
        id: undefined,
        title: '',
        description: '',
        priority: '中',
        creator: '',
        creatorRole: '',
        creatorDept: []
      },
      rules: {
        title: [{ required: true, message: '请输入事件标题', trigger: 'blur' }],
        description: [{ required: true, message: '请输入事件描述', trigger: 'blur' }],
        priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
        creator: [{ required: true, message: '请输入提交人姓名', trigger: 'blur' }],
        creatorRole: [{ required: true, message: '请选择身份', trigger: 'change' }],
        creatorDept: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
      },
      roleOptions,
      deptOptions
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    getList() {
      const { keyword, status, priority, handler, viewType, dateRange, sort } = this.listQuery
      
      let filteredList = [...mockList]

      // 根据视图类型过滤
      if (viewType === 'my') {
        filteredList = filteredList.filter(item => item.creator === '王明')
      } else if (viewType === 'pending') {
        filteredList = filteredList.filter(item => item.status === '待处理')
      }

      // 关键字搜索
      if (keyword) {
        filteredList = filteredList.filter(item => 
          item.title.includes(keyword) || item.id.includes(keyword)
        )
      }

      // 状态过滤
      if (status) {
        filteredList = filteredList.filter(item => item.status === status)
      }

      // 优先级过滤
      if (priority) {
        filteredList = filteredList.filter(item => item.priority === priority)
      }

      // 处理人过滤
      if (handler) {
        filteredList = filteredList.filter(item => item.handler === handler)
      }

      // 日期范围过滤
      if (dateRange && dateRange.length === 2) {
        const startDate = dateRange[0]
        const endDate = dateRange[1]
        filteredList = filteredList.filter(item => {
          const itemDate = new Date(item.createTime)
          return itemDate >= startDate && itemDate <= endDate
        })
      }

      // 添加排序逻辑
      if (sort) {
        const sortOrder = sort.charAt(0) === '+' ? 1 : -1
        const sortProp = sort.substring(1)
        filteredList.sort((a, b) => {
          if (sortProp === 'createTime') {
            return sortOrder * (new Date(a[sortProp]) - new Date(b[sortProp]))
          }
          return sortOrder * (a[sortProp] < b[sortProp] ? -1 : 1)
        })
      }

      // 分页处理
      const start = (this.listQuery.page - 1) * this.listQuery.limit
      const end = start + this.listQuery.limit
      this.total = filteredList.length
      this.list = filteredList.slice(start, end)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.dialogType = 'create'
      this.resetTemp()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.dialogType = 'update'
      this.temp = Object.assign({}, row)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDetail(row) {
      this.$router.push({
        name: 'EventDetail',
        params: { id: row.id }
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        description: '',
        priority: '中',
        creator: '',
        creatorRole: '',
        creatorDept: []
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const newEvent = {
            id: `EV${new Date().getTime()}`,
            ...this.temp,
            status: '待处理',
            createTime: new Date().toISOString(),
            creator: '王明',
            creatorRole: '教师',
            creatorDept: ['信息工程学院', '计算机系'],
            handler: ''
          }
          mockList.unshift(newEvent)
          this.dialogVisible = false
          this.getList()
          this.$message({
            type: 'success',
            message: '事件登记成功'
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const index = mockList.findIndex(item => item.id === this.temp.id)
          if (index > -1) {
            mockList[index] = Object.assign({}, mockList[index], this.temp)
            this.dialogVisible = false
            this.getList()
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          }
        }
      })
    },
    handleSortChange(data) {
      const { prop, order } = data
      if (prop) {
        this.listQuery.sort = (order === 'ascending' ? '+' : '-') + prop
      } else {
        this.listQuery.sort = '+id'
      }
      this.getList()
    },
    getPriorityDesc(priority) {
      const descMap = {
        '紧急': '影响教学等核心业务的故障',
        '高': '影响多人工作的重要故障',
        '中': '影响部分工作的一般故障',
        '低': '不影响正常工作的小问题'
      }
      return descMap[priority]
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
.creator-info {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
.event-id {
  white-space: nowrap;
  font-family: Monaco, monospace;
  font-size: 13px;
}

.event-form {
  padding: 20px 20px 0;
  
  .form-section {
    margin-bottom: 24px;
    
    .section-header {
      margin-bottom: 16px;
      padding-left: 8px;
      border-left: 4px solid #409EFF;
      
      .section-title {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
      }
    }
  }
}

.full-width {
  width: 100%;
}

.priority-desc {
  color: #909399;
  font-size: 13px;
}

::v-deep .el-form-item__label {
  font-weight: normal;
  color: #606266;
}

::v-deep .el-form-item.is-required .el-form-item__label:before {
  color: #F56C6C;
}

.event-dialog {
  .el-dialog__body {
    padding: 0;
  }
}

.form-text {
  font-size: 14px;
  color: #606266;
  line-height: 32px;
}

.info-item {
  line-height: 32px;
  .info-label {
    color: #909399;
    margin-right: 8px;
  }
  .info-value {
    color: #606266;
    font-weight: 500;
  }
}
</style> 