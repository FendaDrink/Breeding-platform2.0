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

export function downloadPdf(id){
    return request({
        url: `/sidebarTreeEnv/envFile/downloadPdf`,
        method: 'get',
        params: {taskId: id},
        responseType:"blob",
        timeout: 1000*600
    });
}