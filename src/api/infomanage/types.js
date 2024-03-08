<<<<<<< HEAD
import request from '@/utils/request';
import axios from 'axios';
import { getToken } from '@/utils/auth';


export function addImages(imageList) {
  return request({
    url: '/image/addImages',
    method: 'post',
  });
}

export function getImagesBynodeId(treeId) {
  return request({
    url: 'system/picture/list',
    method: 'get',
    params: {
      treeId
    }
  });
}

export function deleteImageByIdAndUrl(pictureId,pictureUrl) {
  return request({
    url: '/system/picture/remove',
    method: 'get',
    params: {
      pictureId,
      pictureUrl
    }
  });
}

//自动上传接口
export function updateByIp(ip,parentFile,treeId){
  return request({
    url:'/system/picture/uploadByIp',
    method:'post',
    params:{
      ip,
      parentFile,
      treeId
    }
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

// 图片下载接口
export async function downloadImage(pictureId) {
  try {
    const response = await axios.get("/system/picture/download", {
      baseURL: import.meta.env.VITE_APP_BASE_API,
      timeout: 50000,
      responseType: "blob",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      params: {
        pictureId: pictureId,
      },
    });

    const blob = response.data;
    const imageName = `img${pictureId}.jpg`;

    return { blob, imageName };
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
=======
import request from '@/utils/request';
import axios from 'axios';
import { getToken } from '@/utils/auth';


export function addImages(imageList) {
  return request({
    url: '/image/addImages',
    method: 'post',
  });
}

export function getImagesBynodeId(treeId) {
  return request({
    url: 'system/picture/list',
    method: 'get',
    params: {
      treeId
    }
  });
}

export function deleteImageByIdAndUrl(pictureId,pictureUrl) {
  return request({
    url: '/system/picture/remove',
    method: 'get',
    params: {
      pictureId,
      pictureUrl
    }
  });
}

//自动上传接口
export function updateByIp(ip,parentFile,treeId){
  return request({
    url:'/system/picture/uploadByIp',
    method:'post',
    params:{
      ip,
      parentFile,
      treeId
    }
  })
}

//图片数据统计接口
export function treeCount(treeId){
  return request({
    url:'/system/picture/count',
    method:'get',
    params:{
      treeId
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

// 图片下载接口
export async function downloadImage(pictureId) {
  try {
    const response = await axios.get("/system/picture/download", {
      baseURL: import.meta.env.VITE_APP_BASE_API,
      timeout: 50000,
      responseType: "blob",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      params: {
        pictureId: pictureId,
      },
    });

    const blob = response.data;
    const imageName = `img${pictureId}.jpg`;

    return { blob, imageName };
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
>>>>>>> whb_dev
}