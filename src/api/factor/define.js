import request from '@/utils/request'

// 查询关联环境因子和环境因子类型的列表
export function listType(query) {
  return request({
    url: '/sidebarTreeEnv/asFactorType/list',
    method: 'get',
    params: query
  })
}

// 查询关联环境因子和环境因子类型的详细
export function getType(asFactorTypeId) {
  return request({
    url: '/sidebarTreeEnv/asFactorType/' + asFactorTypeId,
    method: 'get'
  })
}

// 新增关联环境因子和环境因子类型的
export function addType(data) {
  return request({
    url: '/sidebarTreeEnv/asFactorType',
    method: 'post',
    data: data
  })
}

// 修改关联环境因子和环境因子类型的
export function updateType(data) {
  return request({
    url: '/sidebarTreeEnv/asFactorType',
    method: 'put',
    data: data
  })
}

// 删除关联环境因子和环境因子类型的
export function delType(asFactorTypeId) {
  return request({
    url: '/sidebarTreeEnv/asFactorType/' + asFactorTypeId,
    method: 'delete'
  })
}
