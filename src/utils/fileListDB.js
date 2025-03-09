const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("chunk_files", 1);
    request.onupgradeneeded = (e) => {
      // 初始化数据库
      const db = e.target.result;
      let store = null;
      if (!(store = db.objectStoreNames.contains("fileChunkList"))) {
        store = db.createObjectStore("fileChunkList", { keyPath: "fileHash" });
        store.createIndex("fileChunkList", "fileChunkList", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
  });
};

const insertData = async (fileChunkList, fileHash) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    // 存入数据
    const transaction = db.transaction("fileChunkList", "readwrite");
    const store = transaction.objectStore("fileChunkList");
    const getRequest = store.get(fileHash);
    getRequest.onsuccess = () => {
      if (getRequest.result) {
        return resolve(false);
      }
      // 写入新分片
      const putRequest = store.put({
        fileHash,
        fileChunkList: fileChunkList,
      });

      putRequest.onsuccess = () => {
        resolve(true);
      };
      putRequest.onerror = (e) => {
        console.log(e);
        reject(e);
      };
    };
  });
};

const getData = async (hash) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    // 存入数据
    const transaction = db.transaction("fileChunkList", "readwrite");
    const store = transaction.objectStore("fileChunkList");
    const getRequest = store.get(hash);
    getRequest.onsuccess = () => {
      if (getRequest.result) {
        resolve(true);
      }else{
        resolve(false)
      }
    };
    getRequest.onerror = (e) => {
      console.log(e);
      reject(e);
    };
  });
};

const deleteData = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    // 存入数据
    const transaction = db.transaction("fileChunkList", "readwrite");
    const store = transaction.objectStore("fileChunkList");
    const deleteRequest = store.delete("2f869d3f1e972075d1a0f87410d1afe4");
    deleteRequest.onsuccess = () => {
      if (deleteRequest.result) {
        resolve(true);
      }else{
        resolve(false)
      }
    };
    deleteRequest.onerror = (e) => {
      console.log(e);
      reject(e);
    };
  });
};

export { initDB, insertData, getData, deleteData };
