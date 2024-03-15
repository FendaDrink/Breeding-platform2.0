import request from '@/utils/request'

export function getEnvAnalyzeList(param,data) {
    return request({
        url: '/system/breed2/NewFile',
        method: 'post',
        params: param,
        data,
        timeout: 1000 * 600,
    })
}

export function getDataListAPI(params) {
    return request({
        url: '/system/breed2/list',
        method: 'get',
        params
    })
}

export function addMar(data) {
    return request({
        url: "/system/breed2",
        method: "post",
        params: data,
        timeout: 1000 * 600
    })
}

export function addMarNew(query, data) {
    return request({
        url: "/system/breed2/NewFile",
        method: "post",
        params: query,
        data,
        timeout: 1000 * 600
    })
}
export function deleteMar(ids) {
    return request({
        url: "/system/breed2/" + ids,
        method: "delete",
    })
}

export function downloadFile(query){
    return request({
      url:"/common/download/resource",
      method:"get",
      params:query,
      responseType:"blob",
      timeout: 1000*600
    })
  }