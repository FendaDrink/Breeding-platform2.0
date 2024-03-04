import request from '@/utils/request';

// 获取整棵树
/* export function getTree(treeType, parentId, isShow) {
  return request({
    url: '/system/tree/list',
    method: 'get',
    params: {
      treeType,
      parentId,
      isShow
    }
  });
} */

export function getTree(treeType,parentId, isShow) {
  return request({
    url: '/system/tree/list',
    method: 'get',
    params: {
      treeType,
      parentId,
      isShow
    }
  });
}

// 删除树节点
export function deleteNodes(treeIds) {
  return request({
    url: '/system/tree/' + treeIds,
    method: 'delete'
  });
}

// 添加树节点
export function addNode(data) {
  return request({
    url: '/system/tree',
    method: 'post',
    data
  });
}

// 更新树节点
export function updateNode(data) {
  return request({
    url: '/system/tree',
    method: 'put',
    data
  })
}

export function test(tableName) {
  return request({
    method: 'GET',
    url: '/genotypeFile/getChromDensity',
    params: {
      tableName: tableName
    },
  })
}



export function getMaterialList(tableName) {
  return request({
    method: 'GET',
    url: '/genotypeFile/getMaterialList',
    params: {
      tableName: tableName
    },
  })
}

export function getChromRatioAndMaxPos(tableName) {
  return request({
    method: 'GET',
    url: '/genotypeFile/getChromRatioAndMaxPos',
    params: {
      tableName: tableName
    },
  })
}

export function getMaterialInfo(tableName,materialName,chrom,start,end) {
  return request({
    method: 'GET',
    url: '/genotypeFile/getMaterialInfo',
    params: {
      tableName: tableName,
      materialName: materialName,
      chrom: chrom,
      start: start,
      end: end,
    },
  })
}

export function getHeatMap(tableName,materialName,chrom,start,end) {
  return request({
    method: 'GET',
    url: '/genotypeFile/getHeatMap',
    params: {
      tableName: tableName,
      materialName: materialName,
      chrom: chrom,
      start: start,
      end: end,
    },
  })
}

export function getHeatMapFit(tableName) {
  return request({
    method: 'GET',
    url: '/genotypeFile/getHeatMapFit',
    params: {
      tableName: tableName,
    },
  })
}

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

export function searchPhotoBynameAndTime(name,time,createBy,createTime){
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
export function getImagesByUrl(url){
  return axios.get(`${import.meta.env.VITE_APP_BASE_API}/image/${url}`,{
    responseType:'blob',
  },{
    headers:{
      Authorization: "Bearer " + getToken(),
    }
  })
}