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
export function download(data){
  return request({
    url:"/sidebarTreeEnv/envFactorType/download",
    method:'post',
    responseType:"blob",
    data:data
  })
}

export function getSelect(){
  return request({
    url: '/sidebarTreeEnv/envFactorType/selectFactorTypeName' ,
    method: 'get'
  })
}

export function selHighL(data){
  return request({
    url:"/sidebarTreeEnv/asFactorType/selectHighlightin",
    method:'get',
    params:data
  })
}

export function selHighLAll(data){
  return request({
    url:"/sidebarTreeEnv/asFactorType/selectHighlightinAll",
    method:'get',
    params:data
  })
}

export function addHigh(data){
  return request({
    url:"/sidebarTreeEnv/asFactorType/checkUpdate",
    method:'post',
    // 不知道name是干啥的，后端说得传
    data:{...data,name:''}
  })
}

export function getLightLine(params) {
  return request({
    url: '/sidebarTreeEnv/asFactorType/fuzzyQueryFactorName' ,
    method: 'get',
    params:params
  })
}

export function getLightLineAll(params) {
  return request({
    url: '/sidebarTreeEnv/asFactorType/fuzzyQueryFactorNameAll' ,
    method: 'get',
    params:params,
  })
}

export function checkout(data){
  return request({
    url:"/sidebarTreeEnv/envFactorType/checkFactorTypeName",
    method:'post',
    data:data
  })
}