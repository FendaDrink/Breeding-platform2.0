<!--环境因子分析-->
<template>
  <div
    style="
      width: 100%;
      min-height: calc(100vh - 84px);
      background-color: #eeeeee;
    "
  >
    <el-container
      style="padding: 20px; border: 1px solid #eee; height: calc(100vh - 100px)"
      v-loading="loading"
      :element-loading-text="loadingText"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!-- 树 -->
      <el-aside
        width="20%"
        class="mokuai card shadow element-plus-tree"
        style="min-height: calc(100vh - 180px);margin-top: 10px;border-radius: 8px;padding: 0%;margin-top: 0%;"
      >
        <el-tree
          ref="tree"
          :data="routesData"
          :props="defaultProps"
          node-key="treeId"
          :default-expand-all="true"
          highlight-current
          :current-node-key="1"
          @node-click="rowClick"
          @treeNodeChanged="handleTreeNodeChanged"
          class="permission-tree"
          :check-strictly="true"
          :check-on-click-node="true"
          :expand-on-click-node="false"
        >
        </el-tree>
      </el-aside>

      <!-- //右边的盒子 -->
      <el-container>
        <el-main width="78%" style="padding: 0" class="right-box">
          <!-- 操作部分 -->
          <div style="width: 100%">
            <el-button
              type="primary"
              class="my-button"
              style="margin: 10px"
              @click.prevent="addChildNode"
              v-hasPermi="['system:node:add']"
            >
              添加子节点</el-button
            >
            <el-button
              type="danger"
              class="my-button"
              style="margin: 10px"
              @click.prevent="deleteNode"
              v-hasPermi="['system:node:remove']"
              >删除节点</el-button
            >
            <el-button
              type="info"
              class="my-button"
              style="margin: 10px"
              @click.prevent="updateChildNode"
              v-hasPermi="['system:node:update']"
              >修改节点</el-button
            >
            <el-button
              type="primary"
              class="my-button"
              style="margin: 10px"
              @click.prevent="addImage"
              v-hasPermi="['system:image:add']"
              >添加图片</el-button
            >
            <el-button
              type="primary"
              class="my-button"
              style="margin: 10px"
              @click.prevent="addNodeMsg"
              v-hasPermi="['system:image:add']"
              >节点详细信息</el-button
            >
            <el-button
              type="info"
              class="my-button"
              style="margin: 10px"
              :loading="downloadLoading"
              @click.prevent="downloadPython"
              v-hasPermi="['system:image:add']"
              >下载远程连接文件</el-button
            >
            <el-button
              type="primary"
              class="my-button"
              style="margin: 0 10px"
              @click.prevent="autoUploadDialog"
              v-hasPermi="['system:image:add']"
              >图片自动上传</el-button
            >
            <br />
            当前节点状态：
            <el-switch
              v-hasPermi="['system:node:update']"
              v-model="nodeIsShow"
              @change="switchChange()"
            />
          </div>
          <el-button
            type="danger"
            style="margin: 0 10px"
            @click="deleteSelectedImages"
            :loading="buttonLoading"
            v-hasPermi="['system:image:remove']"
            class="my-button"
            >删除选中图片</el-button
          >
          <el-checkbox
            v-model="selectAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            size="large"
            class="my-button"
            ><p>全选该节点所有图片</p></el-checkbox
          >
          <!-- 内容部分 -->
          <div v-if="imageSrcList.length === 0" style="max-height: calc(100vh - 290px);">
            无图片或未选择节点
          </div>
          <div class="image_box img-list" v-else style="max-height: calc(100vh - 290px);width: 100%;">
            <div class="imgCard_container">
              <el-checkbox-group
                class="imgCard_container"
                v-model="checkedPictures"
                @change="handleSelectionChange"
              >
                <el-card
                  class="image_item item"
                  :style="{ width: myWidth, height: myHeight }"
                  v-for="(item, index) in imageSrcList.slice(
                    (currentpageNum - 1) * pageSize,
                    currentpageNum * pageSize
                  )"
                  :key="item.pictureId"
                  ref="cardContainer"
                >
                  <div class="wrapper">
                    <div class="imgBox">
                      <el-checkbox
                        size="large"
                        :key="item.pictureId"
                        v-model="checkedPictures"
                        :label="item.pictureId"
                      ></el-checkbox>
                      <el-image
                        :src="getImageUrlByUrl(item.lessPictureUrl)"
                        :preview-src-list="
                          imageSrcList
                            .slice(
                              (currentpageNum - 1) * pageSize,
                              currentpageNum * pageSize
                            )
                            .map((item) => getImageUrlByUrl(item.pictureUrl))
                        "
                        ref="previewImg"
                        :initial-index="index"
                        :style="{ height: imgHeight }"
                        lazy
                        scroll-container
                      >
                        <template #placeholder>
                          <div class="image-slot">
                            Loading<span class="dot">...</span>
                          </div>
                        </template>
                        <template #error>
                          <el-icon>
                            <Picture />
                          </el-icon>
                        </template>
                      </el-image>
                    </div>
                  </div>

                  <el-button
                    class="delete_button"
                    icon="Delete"
                    size="large"
                    circle
                    type="danger"
                    @click="deleteImage(item.pictureId, item.pictureUrl)"
                    :loading="buttonLoading"
                    v-hasPermi="['system:image:remove']"
                  ></el-button>
                  <div class="detailBox" :style="{ fontSize: fontSize }">
                    <p>图片编号: {{ item.pictureId }}</p>
                    <!-- <p>拍摄设备: {{ item.captureDevice }}</p> -->
                  </div>
                </el-card>
              </el-checkbox-group>
            </div>
          </div>
          
        </el-main>

        <!--分页组件-->
        <el-footer class="footer">
          <div class="demo-pagination-block">
            <el-pagination
              background
              :current-page="currentpageNum"
              :page-sizes="[24, 32, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalPage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-footer>
      </el-container>
      
      
    </el-container>
    <!-- 新增节点对话框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      v-model="dialogFormVisible"
      center
      draggable
      width="30%"
    >
      <el-form
        ref="dataForm"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="110px"
      >
        <el-form-item label="节点新名称：" prop="treeName">
          <el-input v-model="form.treeName" placeholder="输入节点新名称" />
        </el-form-item>
        <el-form-item label="是否公开：" prop="isShow">
          <el-switch v-model="form.isShow" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click.passive="
              dialogStatus === 'create' ? createData() : updateData()
            "
          >
            保存
          </el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 修改节点详细信息对话框 -->
    <el-dialog
      title="节点图片详细信息"
      v-model="msgDialogVisible"
      center
      draggable
      width="30%"
    >
      <el-form
        ref="dataForm"
        :model="form"
        label-position="left"
        label-width="110px"
      >
        <el-form-item label="拍摄设备：">
          <el-input v-model="form.shootEqmt" placeholder="输入拍摄设备名称" />
        </el-form-item>
        <el-form-item label="拍摄时间：">
          <el-date-picker
            v-model="form.shootTime"
            type="datetime"
            placeholder="选择一个日期"
          />
        </el-form-item>
        <el-form-item label="处理方式：">
          <el-input v-model="form.procMeth" placeholder="输入处理方式" />
        </el-form-item>
        <el-form-item label="关键字（用逗号分隔）：">
          <el-input v-model="form.keyword" placeholder="输入关键字" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click.passive="saveNodeDetailsButton">
            保存
          </el-button>
          <el-button @click="msgDialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加图片对话框 -->
    <el-dialog
      title="添加图片"
      v-model="imageDialog"
      center
      draggable
      max-width="50%"
    >
      <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        ref="upload"
        accept=".jpeg,.jpg,.png,.bmp,.webp,.zip,.rar"
        list-type="picture-card"
        :action="uploadUrl"
        :auto-upload="false"
        :headers="{ Authorization: 'Bearer ' + getToken() }"
        :before-upload="handleBeforeUpload"
        :on-preview="handlePictureCardPreview"
        :on-error="uploadImageError"
        :on-success="uploadImageSuccess"
        :on-change="handleUploadFile"
        :http-request="httpRequest"
        :multiple="true"
      >
        <el-button type="primary">Click to upload</el-button>

        <template #tip>
          <div class="el-upload__tip">请上传图片或压缩包</div>
        </template>

        <!-- 自定义进度条 -->
        <template #custom-progress="{ file }">
          <div class="custom-progress">
            <div
              class="progress-bar"
              :style="{ width: file.percent + '%' }"
            ></div>
            <div class="progress-text">{{ file.percent }}%</div>
          </div>
        </template>
      </el-upload>
      <div class="dialog-footer">
        <el-button
          type="primary"
          :loading="submitButtonLoading"
          @click="submitImage"
        >
          添加
        </el-button>
        <el-button @click="suspendSubmitImage">取消</el-button>
      </div>
    </el-dialog>
    <!-- 图片自动上传对话框 -->
    <el-dialog
      title="图片自动上传"
      v-model="autoDialog"
      center
      draggable
      width="30%"
    >
      <el-form
        ref="dataForm2"
        :model="form"
        :rules="autoRules"
        label-position="left"
        label-width="110px"
      >
        <el-form-item label="IP地址：" prop="ip">
          <el-input v-model="form.ip" placeholder="输入IP地址" />
        </el-form-item>
        <el-form-item label="图片目录：" prop="remotePicture">
          <el-input v-model="form.remotePicture" placeholder="输入图片目录" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click.passive="autoUpload">
            保存
          </el-button>
          <el-button @click="autoDialog = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="showImageList">
import {
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  nextTick,
  onMounted,
  computed,
} from "vue";
import { getTreeNodeIdsByNode, getImageUrlByUrl } from "@/utils/tree";
import { getTree, addNode, updateNode, deleteNodes } from "@/api/tree.js";
import { getToken } from "@/utils/auth";
import {
  getImagesBynodeId,
  deleteImageByIdAndUrl,
  updateByIp,
} from "@/api/infomanage/types";
import zipLogo from "@/assets/zip/zip.webp";
import { fromPairs } from "lodash";
import { parseTime } from "@/utils/param";

const props = defineProps({
  treeType: {
    type: Number,
    default: 1,
  },
});

const cardContainer = ref(null);

// vue实例
const {
  proxy: { $download },
} = getCurrentInstance();

const valueFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSX"; // 时间格式

// vue实例
const {
  proxy: { $modal },
} = getCurrentInstance();

// 加载
const loading = ref(false);
const loadingText = ref("加载中...");

// 图片
const imageSrcList = ref([]);

//图片宽高
const myWidth = ref("23%");
const myHeight = ref("180px");
const imgHeight = ref("170px");
const fontSize = ref("16px");

//分页
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数
const pageSize = ref(24);

const handleSizeChange = (val) => {
  pageSize.value = val;
};

const handleCurrentChange = (val) => {
  currentpageNum.value = val;
  localStorage.setItem("currentPageNum", val);
};

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

//树
function handleTreeNodeChanged() {
  currentpageNum.value = 1; // 将当前页码设置为1
}

const imageList = [
  {
    pictureId: 1,
    pictureUrl:
      "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  },
  {
    pictureId: 2,
    pictureUrl:
      "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  },
];

const buttonLoading = ref(false);
const autoUploadLoading = ref(false);

//多选删除图片
const selectAll = ref(false);
const isIndeterminate = ref(true);
const checkedPictures = ref([]);

const handleCheckAllChange = (val) => {
  if (val) {
    checkedPictures.value = imageSrcList.value.map((item) => item.pictureId);
  } else {
    checkedPictures.value = [];
  }
  isIndeterminate.value = false;
};

// 选择图片项
function handleSelectionChange(selection) {
  if (selection.length === imageSrcList.value.length) {
    selectAll.value = true;
    isIndeterminate.value = false;
  } else if (selection.length > 0) {
    selectAll.value = false;
    isIndeterminate.value = true;
  } else {
    selectAll.value = false;
    isIndeterminate.value = false;
  }
}

// 全选状态的判定
async function deleteSelectedImages() {
  if (checkedPictures.value.length == 0) {
    $modal.msg("您没有选择图片！");
  } else {
    $modal
      .confirm("是否删除该图片?")
      .then(async () => {
        buttonLoading.value = true;
        const curNode = tree.value.getCurrentNode();

        const deletePromises = checkedPictures.value.map((pictureId) => {
          // 找到对应的图片 URL
          const pictureUrl = imageSrcList.value.find(
            (item) => item.pictureId === pictureId
          ).pictureUrl;

          // 调用删除接口
          return deleteImageByIdAndUrl(pictureId, pictureUrl).catch((error) => {
            console.error(`删除图片失败: ${error}`);
            $modal.msgError("删除选中图片失败");
          });
        });

        try {
          // 等待所有删除操作完成
          await Promise.all(deletePromises);

          // 删除成功
          $modal.msgSuccess("删除选中图片成功");
          rowClick(curNode);
        } catch (error) {
          // 如果有任何一个删除操作失败，都会进入这里
          $modal.msgError("删除选中图片失败");
        } finally {
          // 无论成功或失败，最后都要停止 loading
          buttonLoading.value = false;
          checkedPictures.value = [];
        }
      })
      .catch(() => {
        buttonLoading.value = false;
      });
  }
}

function deleteImage(pictureId, pictureUrl) {
  buttonLoading.value = true;
  $modal
    .confirm("是否删除该图片?")
    .then(() => {
      const curNode = tree.value.getCurrentNode();
      const savedPageNum = localStorage.getItem("currentPageNum");
      deleteImageByIdAndUrl(pictureId, pictureUrl).then(
        () => {
          $modal.msgSuccess("删除图片成功");
          currentpageNum.value = savedPageNum ? parseInt(savedPageNum) : 1;
          rowClick(curNode);
          buttonLoading.value = false;
        },
        () => {
          $modal.msgError("删除图片失败");
          buttonLoading.value = false;
        }
      );
    })
    .catch(() => {
      buttonLoading.value = false;
    });
}

// 打开添加图片对话框
function addImage(imageUrl) {
  imageDialog.value = true;
}

const downloadLoading = ref(false);
let downloadTimer = null;

async function downloadPython() {
  if (downloadLoading.value) {
    return; // Prevent multiple downloads while in progress
  }

  downloadLoading.value = true;
  $modal.msg("正在下载中，请稍后");

  try {
    await $download.resource(
      "C:\\Users\\Administrator\\Desktop\\tabletype\\main.exe"
    );

    // Download completed successfully, start the timer
    downloadTimer = setTimeout(() => {
      downloadLoading.value = false;
      clearTimeout(downloadTimer);
    }, 10000); // 10 seconds
  } catch (error) {
    console.log(error);
    // Handle the error, e.g., show an error message to the user for download failure
    downloadLoading.value = false;
  }
}

// 添加图片对话框
const imageDialog = ref(false);

//自动上传对话框
const autoDialog = ref(false);

const fileList = ref([]);

// 提交添加图片
const upload = ref(null);
const uploadUrl = ref("");

//图片详细信息
const showDetails = ref(false);

const submitButtonLoading = ref(false);

const flushDetail = ref(false);

const submitImage = async () => {
  submitButtonLoading.value = true;
  uploadUrl.value = `${
    import.meta.env.VITE_APP_UPLOAD_URL
  }/system/picture/upload?isShow=1&treeId=${
    tree.value.getCurrentNode().treeId
  }`;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  try {
    await nextTick(); // 等待下一个渲染周期

    await upload.value.submit(); // 上传图片

    await nextTick(); // 图片上传后再次等待下一个渲染周期

    addImage(); // 添加图片
  } catch (error) {
    console.error("上传错误: ", error);
  } finally {
    submitButtonLoading.value = false;
  }
};

//控制图片上传进度
const uploadPercentage = ref(0);
const percent = ref(0);
const fileUploadHandler = (event, file, fileList) => {
  fileList.forEach((f) => {
    const percent = ref(0); // 创建一个进度值的响应式变量
    const interval = setInterval(() => {
      // 模拟文件上传进度增加
      percent.value += 2;

      if (percent.value >= 98) {
        clearInterval(interval); // 进度达到98%，停止增加
      }
    }, 100);
  });
};

const suspendSubmitImage = (file) => {
  nextTick(async () => {
    await upload.value.abort();
    handleRemove(file);
    $modal.msg("已取消图片提交！");
  });

  imageDialog.value = false;
};

//文件上传回调
const handleUploadFile = (file) => {
  const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);

  if (fileType === "zip") {
    flushDetail.value = true;
    var ImgOne = document.getElementsByClassName(
      "el-upload-list__item-thumbnail"
    );
    setTimeout(() => {
      for (let i = 0; i < ImgOne.length; i++) {
        const fileType2 = fileList.value[i].name.substring(
          fileList.value[i].name.lastIndexOf(".") + 1
        );
        if (fileType2 === "zip") {
          ImgOne[i].src = zipLogo;
        } else if (fileType2 === "rar") {
          ImgOne[i].src = zipLogo;
        }
      }
    }, 500);
  } else if (fileType === "rar") {
    flushDetail.value = true;
    var ImgOne = document.getElementsByClassName(
      "el-upload-list__item-thumbnail"
    );
    setTimeout(() => {
      for (let i = 0; i < ImgOne.length; i++) {
        const fileType2 = fileList.value[i].name.substring(
          fileList.value[i].name.lastIndexOf(".") + 1
        );
        if (fileType2 === "zip") {
          ImgOne[i].src = zipLogo;
        } else if (fileType2 === "rar") {
          ImgOne[i].src = zipLogo;
        }
      }
    }, 500);
  }
};

const uploadFilesList = ref();
const imageLists = ref({});
//图片上传前触发
const handleBeforeUpload = (file) => {
  // 拿到文件后缀名
  const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
  const whiteList = [
    "png",
    "PNG",
    "jpg",
    "JPG",
    "jpeg",
    "JPEG",
    "bmp",
    "BMP",
    "webp",
    "WEBP",
    "zip",
    "ZIP",
    "rar",
    "RAR",
  ];
  if (whiteList.indexOf(fileType) === -1) {
    $modal.msgError(
      "只能上传图片或压缩包格式的文件！",
      "error",
      "vab-hey-message-error"
    );
    return false;
  }
  file.percent = 0;
  return true;
};

//图片上传成功回调
async function uploadImageSuccess(res) {
  $modal.msgSuccess(res.msg);

  if (fileList.value.every((it) => it.status == "success")) {
    const uploadedImagesCount = fileList.value.length;
    fileList.value = [];
    const curNode = tree.value.getCurrentNode();
    imageSrcList.value = await getImagesBynodeId(curNode.treeId);
    imageDialog.value = false;

    setTimeout(async () => {
      await rowClick(curNode);
    }, 1000);
  }
}

//图片上传失败回调
function uploadImageError() {
  $modal.msgError("添加图片失败");
}

const previewImg = ref(null);
const viewBigPicture = () => {
  previewImg.value.clickHandler();
};

const showImageViewer = ref(false);
const url = ref([]);
const showImg = () => {
  //预览大图
  showImageViewer.value = true;
};
const close = () => {
  showImageViewer.value = false;
};

//图片自动上传
function autoUploadDialog() {
  autoDialog.value = true;
}

const dataForm2 = ref(null);

//自动上传点击事件
function autoUpload() {
  autoUploadLoading.value = true;
  dataForm2.value.validate((valid) => {
    if (valid) {
      const curNode = tree.value.getCurrentNode();
      updateByIp(form.ip, form.remotePicture, curNode.treeId).then(
        () => {
          $modal.msgSuccess("开启自动上传成功");
          rowClick(curNode);
          autoDialog.value = false;
          autoUploadLoading.value = false;
        },
        () => {
          autoUploadLoading.value = false;
          $modal.msgError("开启自动上传失败");
        },
        (autoUploadLoading.value = false)
      );
    }
  });
}

const sizeMap = reactive({
  4: {
    myWidth: "43%",
    myHeight: "250px",
    imgHeight: "230px",
    fontSize: "24px",
  },
  8: {
    myWidth: "23%",
    myHeight: "180px",
    imgHeight: "160px",
    fontSize: "16px",
  },
  12: {
    myWidth: "23%",
    myHeight: "180px",
    imgHeight: "160px",
    fontSize: "16px",
  },
  24: {
    myWidth: "11%",
    myHeight: "180px",
    imgHeight: "160px",
    fontSize: "16px",
  },
  32: {
    myWidth: "11%",
    myHeight: "180px",
    imgHeight: "160px",
    fontSize: "16px",
  },
  40: {
    myWidth: "11%",
    myHeight: "180px",
    imgHeight: "160px",
    fontSize: "16px",
  },
});

watch(pageSize, () => {
  const size = sizeMap[pageSize.value];
  if (size) {
    myWidth.value = size.myWidth;
    myHeight.value = size.myHeight;
    imgHeight.value = size.imgHeight;
    fontSize.value = size.fontSize;
  }
});

onMounted(() => {
  if (pageSize.value === 4) {
    myWidth.value = "43%";
    myHeight.value = "250px";
    fontSize.value = "24px";
  } else if (pageSize.value === 12) {
    myWidth.value = "23%";
    myHeight.value = "180x";
    fontSize.value = "16px";
  } else if (pageSize.value === 24) {
    myWidth.value = "11%";
    myHeight.value = "180x";
    fontSize.value = "16px";
  }

  const savedPageNum = localStorage.getItem("currentPageNum");
  currentpageNum.value = savedPageNum ? parseInt(savedPageNum) : 1;
});

// 对话框
const dialogFormVisible = ref(false);
const msgDialogVisible = ref(false);
const dialogStatus = ref("create");
const textMap = {
  create: "添加节点",
  update: "修改节点",
};

const form = reactive({
  treeName: "",
  shootEqmt: "",
  shootTime: "",
  procMeth: "",
  keyword: "",
  ip: "",
  remotePicture: "",
  isShow: true,
});

// 重置表单
function resetForm() {
  form.treeName = "";
  form.isShow = true;
}

// 对话框表单
const dataForm = ref(null);

const rules = reactive({
  treeName: [{ required: true, message: "请输入结点名称", trigger: "blur" }],
  isShow: [{ required: true, message: "请选择", trigger: "blur" }],
});

const validateIP = (rule, value, callback) => {
  var regIP =
    /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  var regLocalhost = /^localhost(:\d{1,5})?$/;
  if (value === "") {
    callback(new Error("请输入IP地址"));
  } else if (!regIP.test(value) && !regLocalhost.test(value)) {
    callback(new Error("请输入正确的IP地址"));
  } else {
    callback();
  }
};

const validateDirectory = (rule, value, callback) => {
  var reg = /^[a-zA-Z]:(\\|\/)[^\/\:\*\?\"\<\>\|\n]*$/; // 只允许使用有效的文件路径字符串，不允许使用特殊字符
  if (value === "") {
    callback(new Error("请输入图片目录"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的文件目录"));
  } else {
    callback();
  }
};

const autoRules = reactive({
  ip: [
    {
      required: true,
      validator: validateIP,
      trigger: "blur",
    },
  ],
  remotePicture: [
    {
      required: true,
      validator: validateDirectory,
      trigger: "blur",
    },
  ],
});

//添加节点
function createData() {
  dataForm.value.validate((valid) => {
    if (valid) {
      const id = tree.value.getCurrentNode()
        ? tree.value.getCurrentNode().treeId
        : 0;
      addNode({
        isShow: form.isShow ? 1 : 0,
        treeName: form.treeName,
        parentId: id,
        treeType: props.treeType,
      }).then(
        (res) => {
          $modal.msgSuccess("添加节点成功");
          getTreeList();
        },
        (error) => {
          $modal.msgError("添加节点失败");
        }
      );
      dialogFormVisible.value = false;
    }
  });
}

//更新节点状态
function updateData() {
  dataForm.value.validate((valid) => {
    if (valid) {
      updateNode({
        isShow: form.isShow ? 1 : 0,
        treeName: form.treeName,
        treeId: tree.value.getCurrentNode().treeId,
      }).then(
        () => {
          $modal.msgSuccess("修改成功");
          getTreeList();
        },
        () => {
          $modal.msgError("修改失败");
          getTreeList();
        }
      );
      dialogFormVisible.value = false;
    }
  });
}

//节点详细信息
function saveNodeDetailsButton() {
  dataForm.value.validate((valid) => {
    if (valid) {
      updateNode({
        isShow: form.isShow ? 1 : 0,
        treeId: tree.value.getCurrentNode().treeId,
        treeName: form.treeName,
        shootEqmt: form.shootEqmt,
        shootTime: parseTime(form.shootTime),
        procMeth: form.procMeth,
        keyword: form.keyword,
      }).then(
        (res) => {
          $modal.msgSuccess("修改成功");
          getTreeList();
        },
        (error) => {
          $modal.msgError("修改失败");
          getTreeList();
        }
      );
      msgDialogVisible.value = false;
    }
  });
}

const nodeIsShow = ref(true);
//更新节点状态
const switchChange = () => {
  updateNode({
    //尝试改改
    isShow: nodeIsShow.value ? 1 : 0,
    treeName: form.treeName,
    treeId: tree.value.getCurrentNode().treeId,
  }).then(
    () => {
      $modal.msgSuccess("修改成功");
      getTreeList();
    },
    () => {
      $modal.msgError("修改失败");
      getTreeList();
    }
  );
};

// 树控件
const routesData = ref([]);

const firstLeafNode = ref(null);
const firstLeafNodeKey = ref(null);


const getTreeList = () => {
  getTree(props.treeType, 0, 1).then((res) => {
    routesData.value = res.data.children;
    const firstLeafNodeParent = findFirstLeafNodeParent(routesData.value);

    if (firstLeafNodeParent) {
      nextTick(() => {
        const treeComponent = tree.value;

        if (treeComponent) {
          treeComponent.setCurrentKey(firstLeafNodeParent.treeId);
          rowClick(firstLeafNodeParent);
        }
      });
    }
  });
};

// 递归查找第一个叶子节点的父节点的函数
function findFirstLeafNodeParent(nodes, parentNode = null) {
  for (const node of nodes) {
    if (!node.children || node.children.length === 0) {
      // 如果当前节点是叶子节点，返回其父节点
      return parentNode;
    } else {
      const firstLeafParent = findFirstLeafNodeParent(node.children, node);
      if (firstLeafParent) {
        return firstLeafParent;
      }
    }
  }
  return null;
}

// 获取树
getTreeList();

const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const tree = ref(null);
// 添加节点
function addChildNode() {
  if (!tree.value.getCurrentNode() && routesData.value.length !== 0) {
    $modal.msgWarning("请选择所要添加节点的父节点");
    return;
  }
  resetForm();
  dialogStatus.value = "create";
  dialogFormVisible.value = true;
}
// 修改节点
function updateChildNode() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning("请选择所要修改节点的父节点");
    return;
  }
  //resetForm();
  dialogStatus.value = "update";
  dialogFormVisible.value = true;
}

//增加节点详细信息
function addNodeMsg() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning("请选择所要修改节点的父节点");
    return;
  }
  msgDialogVisible.value = true;
}

//删除节点
function deleteNode() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning("请选择节点");
    return;
  }
  $modal.confirm("是否删除该节点?").then(() => {
    const curNode = tree.value.getCurrentNode();
    const curNodeTreeIds = getTreeNodeIdsByNode(curNode);
    deleteNodes(curNodeTreeIds).then(() => {
      $modal.msgSuccess("删除节点成功");
      getTreeList();
    });
    tree.value.setCurrentKey(routesData.value[0]?.treeId);
    rowClick();
  });
}

// 定义一个 ref 变量用于跟踪树节点的变化
const selectedTreeNodeId = ref(null);

// 点击树节点时的回调
async function rowClick(nodeObj) {
  rules.value = {};

  if (selectedTreeNodeId.value !== nodeObj.treeId) {
    currentpageNum.value = 1; // 将分页页码设置为1
  }

  // 更新跟踪树节点变化的变量
  selectedTreeNodeId.value = nodeObj.treeId;

  Object.assign(form, {
    treeName: nodeObj.treeName,
    shootEqmt: nodeObj.shootEqmt,
    shootTime: nodeObj.shootTime,
    procMeth: nodeObj.procMeth,
    keyword: nodeObj.keyword,
    ip: nodeObj.ip,
    remotePicture: nodeObj.parentFile,
  });
  const isShowBool = nodeObj.isShow === 1;
  form.isShow = isShowBool;
  nodeIsShow.value = isShowBool;
  loading.value = true;

  // 使用await等待获取完整的图片列表
  imageSrcList.value = await getImagesBynodeId(nodeObj.treeId);
  totalPage.value = imageSrcList.value.length;
  pageSize.value = 24;
  if (imageSrcList.length === 0) {
    $modal.msgWarning("此节点无图片");
  }
  loading.value = false;
}
</script>

<style lang="less" scoped>
.custom-progress {
  position: relative;
  width: 100%;
  height: 10px;
  background-color: #f0f0f0;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #409eff;
}

.progress-text {
  position: absolute;
  top: 0;
  right: 0;
  line-height: 10px;
  padding: 0 5px;
  color: #000;
  font-size: 12px;
}
.imgBox {
  position: relative;
}

.imgBox .el-checkbox {
  position: absolute;
  top: 5px; // 设置具体位置
  left: 10px; // 设置具体位置
}

:deep(.el-image) {
  text-align: center;
  font-size: 40px;
}
:deep(.el-form-item__label) {
  width: 110px;
}

:deep(.el-card) {
  position: relative;
}

:deep(.el-card__body) {
  padding: 8px 8px 8px 8px !important;
  object-fit: fill;
}

.image_item:hover .delete_button {
  opacity: 1;
  transition: 0.4s ease-in-out;
}

.imgCard_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

.delete_button {
  position: absolute;
  bottom: 2.5vw;
  left: 10px;
  z-index: 9;
  opacity: 0;
  transition: 0.4s ease-in-out;
}

.u-main .el-tag + .el-tag {
  margin-left: 10px;
}

.u-main .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.u-main .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.u-main .el-form-item {
  margin: 60px 0;
}

.u-main .el-form-item__label {
  font-size: 20px;
}

/* 新增节点对话框 */
:deep(.el-dialog__header) {
  margin-right: 0px;
  padding-right: 16px;
  background: #0F5C32;
  margin-top: 10px;

  .el-dialog__title {
    color: white;
  }
}

:deep(.upload-demo) {
  margin-bottom: 20px;
}

:deep(.el-switch.is-checked .el-switch__core) {
  border-color: green;
  background-color: green;
}
</style>
<style lang="scss" scoped>
.image_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  max-height: calc(100vh - 190px);

  img {
    width: 100%;
  }
}

.image_item {
  box-sizing: border-box;
  margin: 10px 5px;
}

.img-list {
  width: 100%;
  position: relative;
  right: 0;
}

.img-list .item {
  cursor: pointer;
}
.image_slot {
  width: 100%;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #f5f5f5;
}

.bg-purple-light {
  background: rgb(32, 177, 159);
}

.grid-content {
  border-radius: 0px;
  height: 50px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.upload {
  width: 100%;
  // border:1px solid #ccc;
}

.right-box {
  // background-color: #fff;
  // border:1px solid #ccc;
  // margin-bottom: 50px;
  margin-left: 20px;
}

.u-title {
  width: 98%;
  margin: 0 auto;
  height: 50px;
}

.u-title ul {
  display: flex;
}

.u-title ul li {
  flex: 1;
  text-align: center;
}

.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
<style lang="less" scoped>
.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
}

/* 按钮样式 */
.addNode-button {
  background: rgb(85, 123, 116);
}

//图片详细信息
.detailBox {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 20%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  transition: all ease 0.6s;
  opacity: 0;

  p {
    margin-left: 1vw;
    color: #fff;
  }
}

.image_item:hover .detailBox {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 20%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  transition: all ease 0.6s;
  opacity: 1;

  p {
    margin-left: 1vw;
    color: #fff;
  }
}


.footer{
  margin-left: 20px;
  height: fit-content;
  padding: 0%;
}
</style>

<style lang="less" scoped>
.mytable{
  background-color: #EEEEEE;
}
.table_button{
  padding: 0% !important;
  margin: 0 !important;
  margin-right: 5px !important;
}

@media (max-width: 1330px) {
  .my-button {
    margin-right: 2px !important; /* 缩小元素之间的间距 */
    font-size: 7px;
  }

  .my_input {
    width: 120px; /* 缩小输入框的宽度 */
  }

  .el-button {
    font-size: 12px; /* 设置按钮的字体大小为小号 */
    padding: 3px 6px; /* 根据需要调整按钮的内边距 */
  }
}
</style>

<style lang="less" scoped>
/* 假设 el-checkbox 是表头中的一个子元素 */

:deep(.el-table .el-table__header-wrapper tr th) {
  background-color: #1FB864 !important;
  color: rgb(255, 255, 255);
}

/* 修改前后箭头未点击时的背景颜色 */
:deep(.el-pagination .btn-prev, .el-pagination .btn-next) {
  background-color: #fff !important;
}

/* 修改未点击时的数字方块背景颜色 */
:deep(.el-pagination .el-pager li:not(.active):not(.disabled):hover) {
  background-color: #EEEEEE !important;
}

/* 未点击时的数字方块背景颜色 */
:deep(.el-pagination .el-pager li:not(.active):not(.disabled)) {
  background-color: #fff !important;
  color: #000;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #1FB864 !important; //修改默认的背景色
  color: #fff;
}

:deep(.el-pagination ul li, .el-pagination .el-pagination__jump) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.el-pagination ul li:not(:last-child)) {
  border-right: #DDDDDD 1px solid;
}


:deep(.el-pagination ul) {
  border: #DDDDDD 1px solid;
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload .el-upload-dragger) {
  width: 100%;
}




:deep(.el-button) {
  margin: 0% !important;
  margin-right: 8px !important;
}


.white-button,
.el-button--default,
.el-button--primary {
  background-color: #fff !important;
  color: #000 !important;
  border: 1px solid #CCCCCC !important;
}

.white-button:hover,
.el-button--default:hover,
.el-button--primary:hover {
  background-color: #E6E6E6 !important;
  color: #000 !important;
  border: 1px solid #CCCCCC !important;
}


.green-button {
  background-color: #1FB864 !important;
  color: #fff !important;
  border: 1px solid #1FB864 !important;
}

.green-button:hover {
  background-color: #1FB864 !important;
  color: #fff !important;
  border: 1px solid #1FB864 !important;
}

.table_button {
  color: #1FB864;
}

.table_button:hover {
  color: #1FB864;
}

// .el-select-dropdown__item.selected {
//   color: #1FB864;
// }

// .el-input {
//   --el-input-focus-border-color: #1FB864;
// }

// .el-select {
//   --el-select-input-focus-border-color: #1FB864;
// }

/* 开关组件 */
// :deep(.el-switch.is-checked .el-switch__core) {
//   border-color: #1FB864;
//   background-color: #1FB864;
// }

/* 多选组件 */
// :deep(.el-checkbox) {
//   --el-checkbox-checked-input-border-color: #1FB864;
//   --el-checkbox-checked-bg-color: #1FB864;
//   --el-checkbox-input-border-color-hover: #1FB864;
// }

:deep(.el-table__header .el-checkbox) {
  /* Your styles here */
  --el-checkbox-checked-input-border-color: #424F63;
  --el-checkbox-checked-bg-color: #424F63;
  --el-checkbox-input-border-color-hover: #424F63;
}

/* 树结构 */
.el-aside {
  background-color: #fff !important;
}

.el-tree {
  background-color: #fff !important;
  margin: 0px !important;
  color: #000;
  /* 字体大小在上面的代码中修改 */
}

.div1 {
  padding: 15px 20px;
  background-color: #EEEEEE;
}

.div2 {
  padding: 15px 20px;
  background-color: #fff;
  margin: 0px 0px 20px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12);
}

.div3 {
  padding: 20px 20px 0px;
  background-color: #fff;
  margin: 0px 0px 20px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12);
}

.el-table {
  background-color: #EEEEEE !important;
  margin-top: 20px;
}

.footer {
  height: fit-content;
}
</style>

<style>
:root {
  --el-color-primary: #1FB864;
}
</style>

<!-- 树样式 -->
<style lang="less" scoped>
:deep(.permission-tree) {
  margin: 5px;
  // background: #f2fbf7;
  min-width: 98%;
  display: inline-block;
  width: auto;
  overflow: auto;
  margin-right: 0px;
  padding: 3px;
  padding-right: 15px;
}

:deep(.el-tree-node__content) {
  border-radius: 5px;
  margin: 1px;
  line-height: 30px;
  font-size: 14px;
  color: black;
  padding: 0%;
}

:deep(.el-tree-node__label) {
  font-size: 16px;
}

:deep(.el-form-item__label) {
  width: 110px;
}

:deep(.el-tree-node__expand-icon) {
  color: black;
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #fff !important;
}

.card {
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0;
  box-sizing: border-box;
}

.element-plus-tree {
  //padding: 100px;

  :deep(.el-tree) {

    /* ---- ---- ---- ---- ^（节点对齐）---- ---- ---- ---- */
    .el-tree-node {

      /* ^ 所有节点 */
      i.el-tree-node__expand-icon {
        padding: 6px;

        &::before {
          font-family: element-ui-icons;
          font-style: normal;
          //content: "\e6d9";
          //color: #000000;
          border: 1px solid #606266;
          border-radius: 2px;
        }

        // svg {
        //   display: true; // 隐藏所有节点的 svg 图标
        // }
      }

      /* / 所有节点 */

      /* ^ 已展开的父节点 */
      i.el-tree-node__expand-icon.expanded {
        //transform: rotate(0deg); // 取消旋转
        //-webkit-transform: rotate(0deg); // 取消旋转

        &::before {
          font-family: element-ui-icons;
          font-style: normal;
          //content: "\e6d8";
          //color: #000000;
          border: 1px solid #606266;
          border-radius: 2px;
        }
      }

      /* / 已展开的父节点 */

      /* ^ 叶子节点 */
      i.el-tree-node__expand-icon.is-leaf {
        &::before {
          display: none;
        }
      }

      /* / 叶子节点 */

      /* ^ 设置子节点左外边距 */
      .el-tree-node__content:has(.is-leaf) {
        // color: #00ffff;
        margin-left: 12px !important;

        .el-tree-node__label {
          //font-size: 8px;
        }

        //background-color: red;
      }
    }

    /* ---- ---- ---- ---- ^（新增辅助线）---- ---- ---- ---- */
    /* ^ 树节点 */
    .el-tree-node {
      position: relative;
      width: auto;
      // width: max-content; // 显示文字宽度
      padding-left: 13px;

      &::before {
        width: 1px;
        height: 100%;
        content: "";
        position: absolute;
        top: -38px;
        bottom: 0;
        left: 0;
        right: auto;
        border-width: 1px;
        border-left: 1px solid #b8b9bb;
      }

      &::after {
        width: 13px;
        height: 13px;
        content: "";
        position: absolute;
        z-index: 0;
        left: 0;
        right: auto;
        top: 12px;
        bottom: auto;
        border-width: 1px;
        border-top: 1px solid #b8b9bb;
      }

      .el-tree-node__content {
        position: relative;
        z-index: 1;
        //color: #000;
        padding-left: 0 !important;

        /* ^ 复选框 */
        .el-checkbox {
          margin: 0 10px 0 5.5px;
        }

        /* / 复选框 */
      }

      .el-tree-node__children {
        padding-left: 12px;
      }

      &:last-child::before {
        height: 50px;
      }
    }

    /* / 树节点 */

    /* ^ 第一层节点 */
    >.el-tree-node {
      padding-left: 0;

      &::before {
        border-left: none;
      }

      &::after {
        border-top: none;
      }
    }

    /* / 第一层节点 */

    /* ^ 叶子节点 */
    i.el-tree-node__expand-icon.is-leaf {
      display: none;
    }

    /* / 叶子节点 */

    /* ^ 设置子节点左外边距 */
    .el-tree-node__content:has(.is-leaf) {
      // color: #00ffff;
      margin-left: 12px !important;
    }

    /* / 设置子节点左外边距 */
    /* ---- ---- ---- ---- /（新增辅助线）---- ---- ---- ---- */
  }

  :deep(.el-tree-node__content) {
    border-radius: 5px;
    margin: 1px;
    color: black;
    padding: 0%;
    height: 20px;
  }

  :deep(.el-tree-node__label) {
    font-size: 15px;
    padding-left: 5px;
    padding-right: 5px;
  }
}

// 设置高亮颜色
:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(rgb(#424F63), 0.3) !important;

  .el-tree-node__label {
    color: #424F63;
  }

  .el-tree-node__expand-icon {
    color: #424F63;
  }
}
</style>