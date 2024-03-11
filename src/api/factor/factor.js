import request from '@/utils/request'

// 查询环境因子列表
export function listFactor(query) {
  return request({
    url: '/sidebarTreeEnv/envFactor/list',
    method: 'get',
    params: query
  })
}

// 查询环境因子详细
export function getFactor(factorId) {
  return request({
    url: '/sidebarTreeEnv/envFactor/' + factorId,
    method: 'get'
  })
}

// 新增环境因子
export function addFactor(data) {
  return request({
    url: '/sidebarTreeEnv/envFactor',
    method: 'post',
    data: data
  })
}

// 修改环境因子
export function updateFactor(data) {
  return request({
    url: '/sidebarTreeEnv/envFactor',
    method: 'put',
    data: data
  })
}

// 删除环境因子
export function delFactor(factorId) {
  return request({
    url: '/sidebarTreeEnv/envFactor/' + factorId,
    method: 'delete'
  })
}
