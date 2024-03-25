import request from '@/utils/request';

export function postData(data) {
  return request({
    url: '/sidebarTreeEnv/envFile/getData',
    method: 'post',
    data
  });
}

export function getData(params={}){
    return request({
        url: '/sidebarTreeEnv/envFile/getDataList',
        method: 'get',
        params
    });
}

export function deleteData(id){
    return request({
        url: `/sidebarTreeEnv/envFile/delete/${id}`,
        method: 'post',
    });
}

export function downloadResultCsv(id){
    return request({
        url: `/sidebarTreeEnv/envFile/downloadResult`,
        method: 'get',
        params: {id},
        responseType:"blob",
        timeout: 1000*600
    });
}

export function downloadFile(id){
    return request({
        url: `/sidebarTreeEnv/envFile/download`,
        method: 'get',
        params:{id},
        responseType:"blob",
        timeout: 1000*600
    });
}

export function downloadTemplateAPI(){
    return request({
        url:'/sidebarTreeEnv/envFile/downloadModel',
        method:'get',
        responseType:'blob',
        timeout: 1000*600
    })
}