import request from '@/utils/request'

// 获取服务目录树
export function getCatalogTree() {
  return request({
    url: '/it/service/catalog/tree',
    method: 'get'
  })
}

// 获取服务列表
export function getServiceList(catalogId) {
  return request({
    url: '/it/service/list',
    method: 'get',
    params: { catalogId }
  })
}

// 创建/更新服务
export function saveService(data) {
  return request({
    url: '/it/service/save',
    method: 'post',
    data
  })
}

// 删除服务
export function deleteService(id) {
  return request({
    url: `/it/service/${id}`,
    method: 'delete'
  })
} 