import request from '@/utils/request'

export function getEventHistory(params) {
  return request({
    url: '/it/event/history',
    method: 'get',
    params
  })
}

export function getEventStatistics(query) {
  console.log('Request URL:', process.env.VUE_APP_BASE_API + '/it/events/statistics')
  return request({
    url: '/it/events/statistics',
    method: 'get',
    params: query
  })
} 