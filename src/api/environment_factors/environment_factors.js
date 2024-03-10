import request from '@/utils/request';

//图片数据统计接口
export function treeCount(treeId, status) {
    return request({
        url: '/system/picture/selectLeaves',
        method: 'GET',
        params: {
            treeId,
            status
        }
    })
}

//图片或文件数据（按日期）统计接口 status 0为文件 1为图片
export function treeCountDate(treeId, startDate, endDate, status) {
    return request({
        url: '/system/picture/selectDateLeaves',
        method: 'GET',
        params: {
            treeId,
            startDate,
            endDate,
            status
        }
    })
}

//查询图片接口

export function searchPhotoBynameAndTime(name, time, createBy, createTime) {
    return request({
        url: '/system/picture/qureyPictrue',
        method: 'post',
        params: {
            name,
            time,
            createBy,
            createTime
        }
    })
}

// 查询当前treeType下的所有图片
export function getAllPicture(treeType) {
    return request({
        url: '/system/picture/AllPictureList',
        method: 'GET',
        params: {
            treeType
        }
    })
}


// 筛选图片接口（通过名称 拍照时间 上传时间 上传人）
export function searchPhotoDetail(name, time, createTime, createBy) {
    return request({
        url: '/system/picture/qureyPictrue',
        method: 'POST',
        params: {
            name,
            time,
            createTime,
            createBy
        }
    })
}

//图片查询下按日期查询图片数量
export function treeSingleCountDate(treeId, startDate, endDate, status, rank) {
    return request({
        url: '/system/picture/SignalDocumentNumSF',
        method: 'GET',
        params: {
            treeId,
            startDate,
            endDate,
            status,
            rank
        }
    })
}

// 根据url获取文件
export function getImagesByUrl(url) {
    return axios.get(`${import.meta.env.VITE_APP_BASE_API}/image/${url}`, {
        responseType: 'blob',
    }, {
        headers: {
            Authorization: "Bearer " + getToken(),
        }
    })
}

// 获取环境文件列表
export function getEnvFileList(treeId) {
    return request({
        url: '/sidebarTreeEnv/envFile/list',
        method: 'GET',
        params: {
            treeId
        }
    })
}

// 获取环境因子列表
export function getEnvList() {
    return request({
        url: '/sidebarTreeEnv/asFactorType/getListByType',
        method: 'GET'
    })
}

// 获取环境环境因子变化数据
export function getEnvFactorChange(fileId, factorId, start, end) {
    return request({
        url: '/sidebarTreeEnv/environment/getLineChartOfEnvFactor',
        method: 'GET',
        params: {
            fileId,
            factorId,
            start,
            end
        }
    })
}

// 查询文件详情
export function getEnvDetailByFileId(query) {
    return request({
        url: `/sidebarTreeEnv/envFile/getEnvDetailByFileId/${query.fileId}`,
        method: 'get',
        params: {
            pageNum: query.pageNum,
            pageSize: query.pageSize
        }
    })
}

// 导出文件
export function exportEnvFile(tableName) {
    return request({
        url: '/sidebarTreeEnv/environment/exportFile',
        method: 'get',
        params: {
            tableName
        }
    })
}

// 修改环境数据内容
export function updateEnvironmentData(fileId,environmentId,request) {
    return request({
        url: '/sidebarTreeEnv/environment/updateEnvironmentData',
        method: 'POST',
        params: {
            fileId,
            environmentId,
            request
        }
    })
}