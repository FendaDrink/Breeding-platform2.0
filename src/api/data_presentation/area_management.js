import request from '@/utils/request';

//获取地图数据接口
export const getMap = () => {
    return request({
        url: '/sidebarTreeEnv/envFile/getAreaData',
        method: 'get'
    })
}

//根据环境因子查询地区
export function getLocationByFactor(name){
    return request({
        url:`/sidebarTreeEnv/envFile/listLocationByFactorId`,
        method:'get',
        params:{
            name
        },
        timeout:10000000
    })
}

//根据地区获取环境因子名
export function selectFactorByLocation(area){
    return request({
        url:`/sidebarTreeEnv/envFile/selectFactorByLocation`,
        method:'get',
        params:{
            area
        }
    })
}

//获得所有环境因子名
export function getAllFactorFromFile() {
    return request({
        url: '/sidebarTreeEnv/envFile/getAllFactorFromFile',
        method: 'get',
    })
}