const Mock = require('mockjs')

const events = []
const types = ['hardware', 'software', 'network', 'other']
const priorities = ['high', 'medium', 'low']
const impacts = ['personal', 'department', 'school']
const statuses = ['pending', 'processing', 'validating', 'completed']

// 生成模拟数据
for (let i = 0; i < 20; i++) {
  events.push(Mock.mock({
    id: `IT2024${Mock.mock('@integer(1000, 9999)')}`,
    title: '@ctitle(10, 20)',
    type: `@pick(${JSON.stringify(types)})`,
    priority: `@pick(${JSON.stringify(priorities)})`,
    impact: `@pick(${JSON.stringify(impacts)})`,
    status: `@pick(${JSON.stringify(statuses)})`,
    description: '@cparagraph(1, 3)',
    reporter: '@cname',
    handler: '@cname',
    'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'updateTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
  }))
}

module.exports = [
  // 获取事件列表
  {
    url: '/dev-api/it/events',
    type: 'get',
    response: config => {
      const { page = 1, limit = 10, search, type, priority, status, dateRange } = config.query

      const mockList = events.filter(item => {
        if (search && !item.id.includes(search) && !item.title.includes(search)) return false
        if (type && item.type !== type) return false
        if (priority && item.priority !== priority) return false
        if (status && item.status !== status) return false
        if (dateRange && dateRange.length === 2) {
          const start = new Date(dateRange[0])
          const end = new Date(dateRange[1])
          const current = new Date(item.createTime)
          if (current < start || current > end) return false
        }
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  // 创建事件
  {
    url: '/dev-api/it/events',
    type: 'post',
    response: config => {
      const event = config.body
      event.id = `IT2024${Mock.mock('@integer(1000, 9999)')}`
      event.createTime = Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
      event.updateTime = event.createTime
      events.unshift(event)

      return {
        code: 20000,
        data: event
      }
    }
  },

  // 更新事件
  {
    url: '/dev-api/it/events/[A-Za-z0-9]+',
    type: 'put',
    response: config => {
      const { id } = config.query
      const event = config.body
      const index = events.findIndex(item => item.id === id)
      
      if (index > -1) {
        events[index] = Object.assign(events[index], event, {
          updateTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
        })
        return {
          code: 20000,
          data: events[index]
        }
      }
      return {
        code: 50000,
        message: '事件不存在'
      }
    }
  },

  // 删除事件
  {
    url: '/dev-api/it/events/[A-Za-z0-9]+',
    type: 'delete',
    response: config => {
      const { id } = config.query
      const index = events.findIndex(item => item.id === id)
      
      if (index > -1) {
        events.splice(index, 1)
        return {
          code: 20000,
          data: { success: true }
        }
      }
      return {
        code: 50000,
        message: '事件不存在'
      }
    }
  },

  // 批量删除事件
  {
    url: '/dev-api/it/events/batch',
    type: 'delete',
    response: config => {
      const { ids } = config.body
      ids.forEach(id => {
        const index = events.findIndex(item => item.id === id)
        if (index > -1) {
          events.splice(index, 1)
        }
      })
      return {
        code: 20000,
        data: { success: true }
      }
    }
  },

  // 事件历史查询
  {
    url: '/dev-api/it/events/history',
    type: 'get',
    response: config => {
      return getEventHistory(config)
    }
  }
]

function getEventHistory(config) {
  const { page = 1, limit = 10 } = config.query

  const list = []
  const total = 100

  for (let i = 0; i < limit; i++) {
    const index = (page - 1) * limit + i
    if (index >= total) break

    list.push({
      eventId: `EV${String(index + 1).padStart(6, '0')}`,
      eventName: `测试事件 ${index + 1}`,
      eventType: ['硬件故障', '软件问题', '网络故障', '安全事件'][Math.floor(Math.random() * 4)],
      priority: ['高', '中', '低'][Math.floor(Math.random() * 3)],
      status: ['待处理', '处理中', '已完成', '已关闭'][Math.floor(Math.random() * 4)],
      createTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleString(),
      handleTime: `${Math.floor(Math.random() * 48)}小时`
    })
  }

  return {
    code: 20000,
    data: {
      total,
      items: list
    }
  }
} 