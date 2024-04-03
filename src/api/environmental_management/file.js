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

//大文件合并接口
export function mergeChunkApi(fileName,treeId,isShow){
    return request({
        url:'/system/picture/mergeChunks',
        method:'post',
        params:{
            fileName,
            treeId,
            isShow
        }
    })
}

// 大文件传输完毕确认接口
export function uploadFileEndApi({treeId,status,remark,fileName,filePath,area,longitude,latitude}){
    return request({
        url:'/sidebarTreeEnv/envFile/loadUp',
        method:'post',
        params:{
            treeId,
            status,
            remark,
            fileName,
            filePath,
            area,
            longitude,
            latitude
        },
        timeout:100000
    })
}