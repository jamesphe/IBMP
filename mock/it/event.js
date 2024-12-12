const Mock = require('mockjs')

const eventTypes = ['硬件故障', '软件故障', '网络故障']
const priorities = ['高', '中', '低']
const handlers = ['张三', '李四', '王五', '赵六']
const statuses = ['处理中', '已完成', '已关闭']

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    eventId: '@increment',
    eventType: '@pick(' + JSON.stringify(eventTypes) + ')',
    priority: '@pick(' + JSON.stringify(priorities) + ')',
    handler: '@pick(' + JSON.stringify(handlers) + ')',
    handleTime: '@float(1, 48, 1, 1)',
    status: '@pick(' + JSON.stringify(statuses) + ')',
    createdAt: '@datetime',
    'finishedAt|1': ['@datetime', null]
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/it/event/statistics',
    type: 'get',
    response: config => {
      const { page = 1, limit = 10 } = config.query

      // 生成统计数据
      const timelineData = {
        type: 'timeline',
        title: '各优先级平均处理时长',
        xAxis: priorities,
        series: priorities.map(() => Mock.Random.float(1, 48, 1, 1))
      }

      const typeData = {
        type: 'pie',
        title: '事件类型分布',
        series: eventTypes.map(type => ({
          name: type,
          value: Mock.Random.integer(10, 100)
        }))
      }

      const handlerData = {
        type: 'bar',
        title: '处理人事件统计',
        xAxis: handlers,
        series: handlers.map(() => Mock.Random.integer(5, 30))
      }

      const items = List.slice((page - 1) * limit, page * limit)

      return {
        code: 20000,
        data: {
          total: List.length,
          items,
          timelineData,
          typeData,
          handlerData
        }
      }
    }
  }
] 