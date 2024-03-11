import request from '@/utils/request'

// 查询环境因子类型列表
export function listType(query) {
  return request({
    url: '/sidebarTreeEnv/envFactorType/list',
    method: 'get',
    params: query
  })
}

// 查询环境因子类型详细
export function getType(factorTypeId) {
  return request({
    url: '/sidebarTreeEnv/envFactorType/' + factorTypeId,
    method: 'get'
  })
}

// 新增环境因子类型
export function addType(data) {
  return request({
    url: '/sidebarTreeEnv/envFactorType',
    method: 'post',
    data: data
  })
}

// 修改环境因子类型
export function updateType(data) {
  return request({
    url: '/sidebarTreeEnv/envFactorType',
    method: 'put',
    data: data
  })
}

// 删除环境因子类型
export function delType(factorTypeId) {
  return request({
    url: '/sidebarTreeEnv/envFactorType/' + factorTypeId,
    method: 'delete'
  })
}
