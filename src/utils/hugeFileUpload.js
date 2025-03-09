import axios from "axios";
import { ElMessage } from "element-plus";
import {
  mergeChunkApi,
  uploadFileEndApi,
  getDoneChunkApi,
} from "@/api/infomanage/phenotype";
import { insertData, deleteData, getData } from "./fileListDB";
// 分片上传
const uploadChunk = (formData) => {
  return () => {
    axios.post(
      `${import.meta.env.VITE_APP_UPLOAD_URL}/system/picture/uploadChunk`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + getToken(),
        },
      }
    );
  };
};

// 检查文件编码格式
const chectCharDet = () => {
  ElMessage.info("上传文件较大，正在检查文件编码格式...");
  return new Promise((resolve, reject) => {
    const file = uploadFileList.value[0].raw;
    const reader = new FileReader();
    let isUTF8 = false;
    reader.onload = (event) => {
      const fileData = event.target.result;
      // 遍历字符串，检查是否有汉字
      const strList = fileData.split("");
      isUTF8 = strList.some((str) => isZh(str));
      if (!isUTF8) {
        ElMessage.warning("请将文件转为utf-8编码后进行上传！");
      }
      resolve();
    };
    reader.readAsText(file);
  });
};

// 判断是否有汉字
const isZh = (str) => {
  let re = /[^\u4e00-\u9fa5]/;
  if (re.test(str)) return false;
  return true;
};

// 合并分片
const mergeChunk = () => {
  return mergeChunkApi(file.name, tree.value.getCurrentNode().treeId, 1);
};

// 后端保存文件
const uploadFileEnd = (endParams) => {
  return uploadFileEndApi(endParams);
};

// 并发控制
const controller = (tasks, max) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const runner = () => {
      if (count > tasks.length * 2) {
        reject({ msg: "文件可能已经损坏，请重新上传" });
      }
      const task = tasks.shift();
      count++;
      if (task) {
        task()
          .then((res) => {
            runner();
          })
          .catch((e) => {
            // 重新执行
            tasks.push(task);
          });
      } else {
        resolve();
      }
    };
    while (max-- > 0) {
      runner();
    }
  });
};

// 创建workr线程计算hash
const computeChunkFileHash = (file, chunkSize) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./hash-worker.js", import.meta.url), {
      type: "module",
    });
    worker.postMessage({ file, chunkSize });
    worker.onerror = (err) => {
      reject({ msg: "文件hash计算错误" });
    };

    worker.onmessage = (e) => {
      resolve(e.data);
    };
  });
};

//大文件分块上传
const upLoadHugeFileList = async (
  fileChunkList,
  fileHash,
  endParams
) => {
  // 检查编码
  await chectCharDet();
  ElMessage.info("文件体积较大，正在上传，请耐心等待");
  const totalChunks = fileChunkList.length;
  return new Promise(async (reslove, reject) => {
    // 创建分片上传任务
    const tasks = [];
    for (let i = 0; i < totalChunks; i++) {
      // 创建formData对象
      const formData = new FormData();
      formData.append("file", fileChunkList[i].chunkFile);
      formData.append("fileHash", fileHash);
      formData.append("totalChunks", totalChunks);
      formData.append("currentChunk", i);
      tasks.push(uploadChunk(formData));
    }
    try {
      // 并发上传分片
      await controller(tasks, 6);
      // 合并请求
      const mergeRes = await mergeChunk();
      filePath = mergeRes.data.replace(/\\/g, "/");
      // 发送文件信息用于后端保存文件
      const endRes = await uploadFileEnd({ ...endParams, filePath });
      reslove(endRes);
      // 删除indexDB的文件
      deleteData(fileHash);
    } catch (err) {
      reject(err);
    }
  });
};

// 大文件上传
export const upLoadHugeFile = async (file, endParams) => {
  // 分片
  const chunkSize = 5 * 1024 * 1024; // 5*1MB
  const { fileHash, fileChunkList } = await computeChunkFileHash(
    file,
    chunkSize
  );
  await insertData(fileChunkList, fileHash);
  return upLoadHugeFileList(fileChunkList, fileHash, endParams);
};

// 大文件重传
export const reUploadHugeFile = async (fileHash,endParams) => {
  try {
    const { fileChunkList } = await getData(fileHash);
    const { doneChunckList } = await getDoneChunkApi(fileHash);
    // 过滤已上传分片
    fileChunkList = fileChunkList.filter(
      (_, index) => !doneChunckList.includes(index)
    );
    return upLoadHugeFileList(fileChunkList, fileHash, endParams);
  } catch (e) {
    return Promise.reject({ msg: "重传失败" });
  }
};
