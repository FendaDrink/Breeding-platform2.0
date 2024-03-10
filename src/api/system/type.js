import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listType(query) {
  return request({
    url: '/traitType/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getType(asTraitTypeId) {
  return request({
    url: '/traitType/' + asTraitTypeId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addType(data) {
  return request({
    url: '/traitType',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateType(data) {
  return request({
    url: '/traitType',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delType(asTraitTypeId) {
  return request({
    url: '/traitType/' + asTraitTypeId,
    method: 'delete'
  })
}
export function download(data){
  return request({
    url:"/traitType/download",
    method:'post',
    responseType:"blob",
    data:data
  })
}
export function checkout(data){
  return request({
    url:"/traitType/checkTraitTypeName",
    method:'post',
    data:data
  })
}