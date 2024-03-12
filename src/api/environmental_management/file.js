import request from '@/utils/request';

export function getEnvFileList(treeId) {
    return request({
        url: '/sidebarTreeEnv/envFile/list',
        method: 'get',
        params:{
            treeId
        }
    });
}

// 删除树节点上的文件
export function delFile(fileId) {
    return request({
        url: 'sidebarTreeEnv/envFile/' + fileId,
        method: 'delete'
    });
}