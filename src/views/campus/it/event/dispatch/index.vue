<template>
  <div class="app-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="事件分派" name="dispatch">
        <el-table :data="dispatchList" border style="width: 100%">
          <el-table-column label="事件编号" prop="id" align="center" width="100" />
          <el-table-column label="事件标题" prop="title" min-width="200" />
          <el-table-column label="当前处理人" width="120" align="center" />
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="handleAssign(row)">
                分派
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="调度规则" name="rules">
        <el-button type="primary" @click="handleAddRule">
          新增规则
        </el-button>
        <el-table :data="rulesList" border style="width: 100%; margin-top: 20px">
          <el-table-column label="规则名称" prop="name" />
          <el-table-column label="事件类型" prop="eventType" />
          <el-table-column label="目标处理组" prop="targetGroup" />
          <el-table-column label="状态" width="100">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.status"
                active-text="启用"
                inactive-text="停用"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="{row}">
              <el-button type="text" @click="handleEditRule(row)">编辑</el-button>
              <el-button type="text" @click="handleDeleteRule(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'EventDispatch',
  data() {
    return {
      activeTab: 'dispatch',
      dispatchList: [],
      rulesList: []
    }
  },
  created() {
    this.getDispatchList()
    this.getRulesList()
  },
  methods: {
    getDispatchList() {
      // TODO: 获取待分派事件列表
    },
    getRulesList() {
      // TODO: 获取调度规则列表
    },
    handleAssign(row) {
      // TODO: 打开分派对��框
    },
    handleAddRule() {
      // TODO: 打开新增规则表单
    },
    handleEditRule(row) {
      // TODO: 打开编辑规则表单
    },
    handleDeleteRule(row) {
      // TODO: 删除规则确认
    }
  }
}
</script> 