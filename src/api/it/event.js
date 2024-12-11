import request from '@/utils/request'

export function getEventHistory(params) {
  return request({
    url: '/it/event/history',
    method: 'get',
    params
  })
} 