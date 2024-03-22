import request from '@/utils/request';

export function getEnvFileList(treeId) {
    return request({
        url: '/sidebarTreeEnv/envFile/list',
        method: 'get',
        params:{
            treeId
        }
    });
}export function getEnvFileHistory(query) {
    return request({
        url: '/sidebarTreeEnv/envFile/getFileHistory',
        method: 'get',
        params:query
    });
}


// 修改树节点上的文件
export function updateFile(data) {
    data.status = data.status ? 1 : 0;
    return request({
        url: 'sidebarTreeEnv/envFile',
        method: 'put',
        data
    });
}

// 删除树节点上的文件
export function delFile(fileId) {
    return request({
        url: 'sidebarTreeEnv/envFile/' + fileId,
        method: 'delete'
    });
}

