import request from '@/utils/request';

// 上传文件
export function uploadFile(file,params) {
    return request({
        url: '/system/breed2/NewFile',
        method: 'POST',
        params: {
            file,
            params
        }
    })
}