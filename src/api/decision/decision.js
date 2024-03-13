import request from '@/utils/request'

export function getEnvAnalyzeList(param) {
    if(typeof param == 'string'){
        return request({
            url: '/system/breed2/NewFile',
            method: 'post',
            param
        })
    }else{
        return request({
            url: '/system/breed2/NewFile',
            method: 'post',
            geoFile:param
        })
    }
}

export function getDataListAPI(params) {
    return request({
        url: '/system/breed2/list',
        method: 'get',
        params
    })
}