const serviceList = [
  {
    id: 1,
    name: '网络故障报修',
    code: 'NET_REPAIR',
    type: '故障报修',
    status: '启用'
  }
  // ... 其他服务数据
]

const slaList = [
  {
    id: 1,
    name: '普通故障SLA',
    serviceType: '故障报修',
    responseTime: 30,
    resolveTime: 4,
    availability: 99.9
  }
  // ... 其他SLA数据
]

const evaluationList = [
  {
    id: 1,
    serviceId: 1,
    serviceName: '网络故障报修',
    score: 5,
    comment: '服务很及时',
    createTime: '2024-01-01 10:00:00'
  }
  // ... 其他评价数据
]

export default [
  {
    url: '/it/service/catalog/tree',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: serviceList
      }
    }
  },
  {
    url: '/it/service/sla/list',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: slaList
      }
    }
  },
  {
    url: '/it/service/evaluation/list',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: evaluationList
      }
    }
  }
] 