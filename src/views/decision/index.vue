<template>
  <div style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;padding-top: 20px;">
    <el-card class="card-container">
      <div style="display: flex;align-items: center;justify-content: center; gap:80px">
        <div style="width: 45%; text-align: center;">
          <label for="inputHelpBlock">输入材料名称</label>
          <el-input type="textarea" placeholder="请输入材料名称，可用空格、回车、逗号隔开" v-model="textarea2"
            style="padding: 0%; margin-top: 5px;margin-bottom: 30px;">
          </el-input>
          <el-button type="primary" @click="submit1" plain
            style="width: 110px; margin-top: 6px !important;">提交</el-button>
          <el-button type="info" plain style="width: 110px; margin-top: 6px !important;" @click="">下载预测结果</el-button>
        </div>
        <div style="width: 45%; text-align: center;">
          <label for="inputHelpBlock">上传材料基因型文件</label>
          <!-- <el-upload class="upload-demo" drag multiple>
						<el-icon class="el-icon--upload"><upload-filled /></el-icon>
						<div>将文件拖到此处，或<a href="javascript:;" style="color: #1FB864;">点击上传</a></div>
					</el-upload> -->

          <el-upload v-model:file-list="fileList" class="upload-demo" ref="upload" :limit="1" accept=".vcf" drag
            show-file-list :action="uploadUrl" :auto-upload="false" :headers="{ Authorization: 'Bearer ' + getToken() }"
            :on-error="uploadFileError" :on-success="uploadFileSuccess" :on-exceed="handleExceed"
            style="margin-top: 5px;margin-bottom: 30px;" :on-change="handleUploadFile"
            :before-upload="handleBeforeUpload">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div>将文件拖到此处，或<a href="javascript:;" style="color: #1FB864;">点击上传</a></div>
          </el-upload>
          <el-button type="primary" @click="submit2" plain
            style="width: 110px; margin-top: 3px !important;">提交</el-button>
          <el-button type="info" plain style="width: 110px; margin-top: 3px !important;" @click="">下载预测结果</el-button>
        </div>
      </div>
      <!-- <div style="text-align: center;padding: 5px 0px;margin-top: 50px;">
        <el-button type="primary" @click="createData" plain
          style="width: 110px; margin-top: 6px !important;">提交</el-button>
        <el-button type="info" plain style="width: 110px; margin-top: 6px !important;" @click="">下载预测结果</el-button>
      </div> -->
    </el-card>
    <el-card class="card-container">
      <el-table max-height="40vh" :data="dataList" :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
        <el-table-column prop="id" label="育种任务id"></el-table-column>
        <el-table-column prop="material_name" label="材料名称"></el-table-column>
        <el-table-column fixed="right" label="材料基因型">
          <template #default="scope">
            <el-button v-if="scope.row.genofile != null" link type="text" style="color: #0dbc79;"
              @click="exportGeno(scope.row.genofile)">
              {{ scope.row.genofile.split("\\").pop() }}
            </el-button>
            <el-button v-else link type="text" disabled>
              无文件
            </el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="测验种基因型">
          <template #default="scope">
            <el-button v-if="scope.row.ceyanfile != null" link type="text" style="color: #0dbc79;"
              @click="exportGeno(scope.row.ceyanfile)">
              {{ scope.row.ceyanfile.split("\\").pop() }}
            </el-button>
            <el-button v-else link type="text" disabled>
              无文件
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="任务状态" width="150">
          <template #default="scope">
            <div id="status">
              <el-icon style="color: #0dbc79;font-size: 25px;" v-show="scope.row.status == 1">
                <SuccessFilled />
              </el-icon>
              <el-icon style="font-size: 25px;" v-show="scope.row.status == 0">
                <Loading />
              </el-icon>
              <el-icon style="color: #d32f2f; font-size: 25px;" v-show="scope.row.status == 2">
                <CircleCloseFilled />
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="结果下载">
          <template #default="scope">
            <el-button link type="text" @click="exportPdf(scope.row)" style="color: #0dbc79;"
              v-show="scope.row.status == 1">
              导出pdf
            </el-button>
            <el-button link type="text" disabled v-show="scope.row.status != 1">
              导出pdf
            </el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="提示信息">
          <template #default="scope">
            <el-popover placement="top" title="Info" trigger="hover" :content="getPopoverContent(scope.row.info)">
              <template #reference>
                <el-button link type="text" style="color: #1FB864;">查看提示信息</el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-popconfirm title="确定删除该任务？" @confirm='handleDelete(scope.row)'>
              <template #reference>
                <el-button link type="text" style="color: #1FB864;">
                  删除
                </el-button>
              </template>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-show="total > 0" :total="total" :page-sizes="[3, 10, 20, 30, 50]"
								v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
								background right layout=" ->, total, sizes,prev, pager, next, jumper" @size-change="getdataList"
								@current-change="getdataList" />
    </el-card>
  </div>
</template>

<!-- <script>

import { ref, getCurrentInstance, nextTick, onMounted } from "vue";
import { getTree, addNode, updateNode, deleteNodes } from "@/api/tree.js";
import { listFile, updateFile, delFile } from "@/api/infomanage/phenoType";
import useUserStore from "@/store/modules/user";
import { getJsonByCSV, jsonToTable } from '@/utils/tree';
import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils/param";
import { getTreeNodeIdsByNode } from "@/utils/tree";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

import { uploadFile } from "@/api/gjy/decision.js"
export default {
  data() {
    return {
      textarea2: '',
      materialName: [],
      fileList: [],
      uploadUrl: '',
      param: '#' // 这里假设你有从其他地方获取或初始化param的方式
    }
  },
  async mounted() {
  },
  methods: {
    async submit() {


      console.log(this.textarea2);
      this.textarea2 = this.textarea2.replace(/\ +/g, "\n").replace(/[\r\n]/g, "\n");
      this.textarea2 = this.textarea2.replace(/,/g, "\n");
      this.textarea2 = this.textarea2.replace(/，/g, "\n");
      this.textarea2 = this.textarea2.replace(/\n+/g, '\n');
      // console.log(this.textarea2);
      this.materialName = this.textarea2.split(/\s+/);;
      // console.log(this.materialName);
      const upload = this.$refs.upload;
      // 文件上传
      const uploadUrl = ref("");

      console.log(this.fileList);
      uploadUrl.value = `${import.meta.env.VITE_APP_UPLOAD_URL
        }/system/breed2/NewFile`;
      console.log(uploadUrl);
      // $modal.msg("上传数据较大，请耐心等待！");
      await upload.value.submit();
    },
    getToken() {
      // 根据实际情况获取token，这里仅作示例
      return localStorage.getItem('accessToken') || '';
    },
    handleBeforeUpload(file) {
      // 在上传前进行一些验证操作
      return true; // 返回true表示允许上传
    },
    handleUploadFile(file) {
      this.fileList = [file];
    },
    async uploadFileSuccess(response) {
      // 上传成功后的处理
      console.log('上传成功:', response);
      this.$message.success('文件上传成功');
    },
    uploadFileError(err) {
      // 上传失败的处理
      console.error('上传失败:', err);
      this.$message.error('文件上传失败');
    },
    handleExceed(files, fileList) {
      // 超过限制时的处理
      this.$message.warning(`只能上传一个文件`);
    },
    // async uploadFiles() {
    //   console.log(this.fileList);
    //   uploadFile(this.fileList[0], "#");
    // }
  },
  mounted() {
    // 如果需要在组件挂载后立即上传（例如自动上传的情况）
    // 可以在这里调用uploadFiles方法
    // this.uploadFiles();
  }
}; -->



<script setup>
import { ref, getCurrentInstance, nextTick, onMounted } from "vue";
import { getEnvAnalyzeList,getDataListAPI } from "@/api/decision/decision";
import { addMar, deleteMar, downloadFile, addMarNew } from '@/api/material';
import { getToken } from "@/utils/auth";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus'
import { blobValidate } from '@/utils/param'

const router = useRouter();

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

// 上传实例
const upload = ref(null);
// 文件上传
const uploadUrl = ref("");
// 文件列表
const fileList = ref([]);
// 分页参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
});

const total = ref(0);

const dataList=ref([]);

function getPopoverContent(info) {
	if (info === 'The variation information of your file has non [-1,0,1,2] value, maybe your file has empty value or last row is empty, please check your file!') {
        return '您文件中的变异信息存在非[-1,0,1,2]的值，可能是您的文件存在空值或文件最后一行为空，请检查您的文件！';
      } else if (info === 'The material name you entered was not found in our database, please check it!') {
        return '您输入的材料名称在我们的数据库中找不到，请检查!';
      } else if (info === 'Flag setting error, please contact the administrator!') {
        return 'Flag设置错误，请联系管理员!';
      } else if (info === 'Please press the system test species button!') {
        return '请点击系统测验种按钮!';
      } else if (info === 'Please check the format of your vcf file, null value exists in the file!') {
        return '请检查您的vcf文件格式，文件中存在空值!';
      } else if (info === 'Please check the format of your vcf file, we need your vcf file to have standard header!') {
        return '请检查您的vcf文件的格式，我们需要您的vcf文件有标准的title!';
      } else if (info === 'Your vcf file has empty values, please check your vcf file!') {
        return '您的vcf文件有空值，请检查您的vcf文件!';
      } else if (info === 'Please check the format of your vcf file, we need the format of snp variation is [./.,0/0,0/1,1/1]!') {
        return '请检查您的vcf文件格式，我们需要的变异信息的格式是[./.，0/0,0/1,1/1]!';
      } else if (info === 'Please check your csv file format!') {
        return '请检查您的csv文件格式!';
      } else if (info === 'please check material in your test file!') {
        return '请检查您的测验种文件中的材料名，它不能为0,-1,1,2!';
      }else if (info === 'over!'){
		return "完成!";
	  }
}

// 获取育种任务列表
const getdataList = async () => {
  const res = await getDataListAPI(queryParams.value);
  if (res.code === 200) {
    $modal.msgSuccess(res.msg);
    dataList.value = res.rows;
    total.value = res.total;
  } else {
    $modal.msgError(res.msg);
  }
};

//文件上传前触发
//文件格式验证
const handleBeforeUpload = (file) => {
  // 拿到文件后缀名
  const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
  const isVcf = fileType === "vcf";
  if (!isVcf) {
    $modal.msgError(
      "只能上传vcf格式的文件！",
      "error",
      "vab-hey-message-error"
    );
    return false;
  }
  return isVcf;
};

const handleUploadFile = (file) => {
  // Handle file upload
  console.log(file);
};


let textarea2 = ref('');

const submit1 = async () => {
  if (textarea2.value === '') {
    $modal.msgWarning("请输入材料名称！");
    return;
  }

  let resultValue = textarea2.value.split(/[ \n,，]+/).join(';');
  console.log(resultValue);
  const res = await getEnvAnalyzeList(resultValue);
  if (res.code === 200) {
    $modal.msgSuccess(res.msg);
  } else {
    $modal.msgError(res.msg);
  }
}

// 提交文件
const submit2 = async () => {
  if (fileList.value.length === 0) {
    $modal.msgWarning("请先上传文件！");
    return;
  }
  const res = await getEnvAnalyzeList(fileList.value[0].raw);
  if (res.code === 200) {
    $modal.msgSuccess(res.msg);
  } else {
    $modal.msgError(res.msg);
  }
};

// 文件上传成功回调
async function uploadFileSuccess(response) {
  if (response.code === 200) {
    $modal.msgSuccess(response.msg);
  } else {
    $modal.msgError("格式不正确，请下载模板文件比对！");
  }
  //$modal.msgSuccess("上传成功");
}

// 文件上传失败回调
const uploadFileError = (error, file, fileList) => {
  console.log("File upload error", error);
  $modal.msgError("上传失败");
};


function exportGeno(fileUrl) {
	let resource = { resource: fileUrl }
	// if(type=='ceyan'){
	//      resource = {resource:row.ceyanfile}
	// }else{
	//      resource = {resource:row.genofile}
	// }
	let filename = resource.resource.split("\\").pop()
	// console.log(filename)
	downloadFile(resource).then(res => {
		console.log(res)
		const isLogin = blobValidate(res);
		if (isLogin) {
			const blob = new Blob([res])
			saveAs(blob, `${filename}`)
		} else {
			const resText = data.text();
			const rspObj = JSON.parse(resText);
			const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
			Message.error(errMsg);
		}
	}).catch(err => {
		console.log(err)
		ElMessage.error('下载文件出现错误，请联系管理员！');
	})
}
function exportPdf(row) {
	console.log(row)
	if (row.status != 1) {
		ElMessageBox.alert('任务尚未成功时不能导出pdf', '错误', {
			// if you want to disable its autofocus
			// autofocus: false,
			confirmButtonText: 'OK',
			type: 'error',
			callback: () => {
			},
		})
		return
	}
	let resource = { resource: row.pdfpath }
	downloadFile(resource).then(res => {
		console.log(res)
		const isLogin = blobValidate(res);
		if (isLogin) {
			const blob = new Blob([res])
			saveAs(blob, `breed${row.id}.pdf`)
		} else {
			const resText = data.text();
			const rspObj = JSON.parse(resText);
			const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
			Message.error(errMsg);
		}
	}).catch(err => {
		console.log(err)
		ElMessage.error('下载文件出现错误，请联系管理员！');
	})
	// let id = {id:row.id}
	// console.log(id)
	// exportPDF(id).then(res => {
	//   console.log(res)
	//   const isLogin = blobValidate(res);
	//   if (isLogin) {
	//     const blob = new Blob([res])
	//     saveAs(blob, `基因组预测比较-${id.id}.pdf`)
	//     pageLoad.value = false
	//   } else {
	//     const resText = data.text();
	//     const rspObj = JSON.parse(resText);
	//     const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
	//     ElMessage.error("下载文件出现错误，请联系管理员！");
	//     pageLoad.value = false
	//   }
	// }).catch(err => {
	//   console.log(err)
	//   pageLoad.value = false
	//   ElMessage.error('下载文件出现错误，请联系管理员！');
	// })
}
async function handleDelete(row) {
	console.log(row)
	await deleteMar(row.id)
	getList()
}

onMounted(() => {
  getdataList();
});

</script>

<!-- <script setup>
import { ref, getCurrentInstance, nextTick, onMounted } from "vue";
import { getTree, addNode, updateNode, deleteNodes } from "@/api/tree.js";
import { listFile, updateFile, delFile } from "@/api/infomanage/phenoType";
import useUserStore from "@/store/modules/user";
import { getJsonByCSV, jsonToTable } from '@/utils/tree';
import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils/param";
import { getTreeNodeIdsByNode } from "@/utils/tree";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();
// 登录用户权限
const { roles } = useUserStore();
const isDisabled = ref(false);
const isDisabled2 = ref(false);

// 加载
const loading = ref(false);
const loadingText = ref("加载中...");
const tableLoading = ref(false);
const historyTableLoading = ref(false);

// 对话框
const dialogFormVisible = ref(false);
const dialogStatus = ref("");
const textMap = {
  create: "添加文件",
  update: "修改文件",
  other: "选择合并文件",
  createNode: "添加节点",
  updateNode: "修改节点",
};

// 表单实例
const form = ref(null);

// 表单参数
const dataForm = reactive({
  fileId: null,
  fileName: "",
  description: "",
  remark: "",
  fileStatus: true,
  dateTime: null,
});

//删除按钮状态
const deleteDisabled = ref(false);

// 校验规则
const rules = reactive({
  fileName: [{ required: true, message: "请输入文件名", trigger: "blur" }],
  description: [
    { required: false, message: "请输入文件描述备注", trigger: "blur" },
  ],
  dateTime: [{ required: true, message: "请选择一个日期", trigger: "blur" }],
});

const dataForm2 = reactive({
  fileName: "",
  description: "",
  dateTime: "",
  fileStatus: false,
});

const drawer = ref(false); // 文件详情窗口开启状态
const fileName = ref(""); // 选中文件名
const curFileUrl = ref(""); //文件路径

//表单重置
function resetForm() {
  dataForm.fileId = null;
  dataForm.fileName = "";
  dataForm.description = "";
  dataForm.remark = "";
  dataForm.fileStatus = true;
  dataForm.dateTime = null;
}

const drawerTableLoading = ref(false);
const drawerTableData = ref([]);
const tableProps = ref([]);
// 开启文件详情窗口
async function openDrawer(row) {
  fileName.value = row.fileName;
  curFileUrl.value = row.url;
  drawer.value = true;
  drawerTableLoading.value = true;
  getJsonByCSV(row.url).then((result) => {
    tableProps.value = result[0];
    drawerTableData.value = jsonToTable(result);
    drawerTableLoading.value = false;
  });
}

// 上传实例
const upload = ref(null);
// 文件上传
const uploadUrl = ref("");

//文件上传前触发
//文件格式验证
const handleBeforeUpload = (file) => {
  // 拿到文件后缀名
  const fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
  const isCsv = fileType === "csv";
  if (!isCsv) {
    $modal.msgError(
      "只能上传csv格式的文件！",
      "error",
      "vab-hey-message-error"
    );
    return false;
  }
  return isCsv;
};

/* const handleUploadFile = (file) => {
  // Handle file upload
  console.log(file);
}; */

const createData = async () => {
  const valid = await form.value.validate();
  console.log(valid);
  if (valid) {
    uploadUrl.value = `${import.meta.env.VITE_APP_UPLOAD_URL
      }/phenotypeFile/upload?treeId=${tree.value.getCurrentNode().treeId
      }&fileStatus=${dataForm.fileStatus ? 1 : 0}&remark=${dataForm.remark
      }&fileName=${dataForm.fileName}`;

    $modal.msg("上传数据较大，请耐心等待！");
    await upload.value.submit();
    console.log("2");
    isDisabled.value = true;
    onsole.log("3");
    console.log("4");
    tableLoading.value = false;
    tableName.value = "";
  }
  dialogFormVisible.value = false;
  getList();
  setTimeout(() => {
    getList();
  }, 4000);
};

const tableName = ref("");

//文件合并
function mergeFile(row) {
  dialogStatus.value = "other";
  tableName.value = row.tableName;
  fileList.value = [];
  resetForm();
  dialogFormVisible.value = true;
  isDisabled2.value = false;
  /* fileList.value = [];
  dialogFormVisible.value = true;
  form.value.validate((valid) => {
    if (valid) {
      uploadUrl.value = `${
        import.meta.env.VITE_APP_UPLOAD_URL
      }/penotypeFile/merge?tableName=${row.tableName}`;
      nextTick(async () => {
        tableLoading.value = false;
        await upload.value.submit();
        isDisabled.value = true;
        getList();
      });
    }
  }); */
  //dialogFormVisible.value = false;
}

//文件合并

const mergeData = async () => {
  const valid = await form.value.validate();
  console.log(valid);
  if (valid) {
    uploadUrl.value = `${import.meta.env.VITE_APP_UPLOAD_URL
      }/phenotypeFile/merge?tableName=${tableName.value}&remark=${dataForm.remark
      }&fileName=${dataForm.fileName}`;
    $modal.msg("上传数据较大，请耐心等待！");
    await upload.value.submit();
    console.log("2");
    isDisabled2.value = true;

    console.log("4");
    tableLoading.value = false;
    onsole.log("5");
    tableName.value = "";
  }
  dialogFormVisible.value = false;
  getList();
  setTimeout(() => {
    getList();
  }, 4000);
};

// 文件创建
/* function createData() {
  form.value.validate((valid) => {
    if (valid) {
      uploadUrl.value = `${
        import.meta.env.VITE_APP_UPLOAD_URL
      }/phenotypeFile/upload?treeId=${
        tree.value.getCurrentNode().treeId
      }&fileStatus=${dataForm.fileStatus ? 1 : 0}&remark=${
        dataForm.remark
      }&fileName=${dataForm.fileName}`;
      nextTick(async () => {
        tableLoading.value = false;
        await upload.value.submit();
        isDisabled.value = true;
        getList();
      });
    }
  });
  dialogFormVisible.value = false;
  getList();
  setTimeout(() => {
    getList();
  }, 4000);
} */

// 文件上传成功回调
async function uploadFileSuccess(response) {
  if (response.code === 200) {
    $modal.msgSuccess(response.msg);
  } else {
    $modal.msgError("格式不正确，请下载模板文件比对！");
  }
  //$modal.msgSuccess("上传成功");

  isDisabled.value = false;
  const curNode = tree.value.getCurrentNode();
  //upload.value.clearFiles();

  getList();
  rowClick(curNode);
  dialogFormVisible.value = false;
}

// 文件上传失败回调
const uploadFileError = (error, file, fileList) => {
  console.log("File upload error", error);
  $modal.msgError("上传失败");
};

//更新文件
async function updateData() {
  form.value.validate((valid) => {
    if (valid) {
      uploadUrl.value = `${import.meta.env.VITE_APP_UPLOAD_URL
        }/phenotypeFile/upload?fileName=${dataForm.fileName}&description=${dataForm.description
        }&fileStatus=${dataForm.fileStatus ? 1 : 0}&treeId=${tree.value.getCurrentNode().treeId
        }&dateTime=${parseTime(dataForm.dateTime)}`;
      nextTick(async () => {
        tableLoading.value = false;
        await upload.value.submit();
        isDisabled.value = true;
        getList();
      });
    }
  });
  dialogFormVisible.value = false;
  getList();
  setTimeout(() => {
    getList();
  }, 4000);
}

//取消文件对话框
function deleteUploadData() {
  dialogFormVisible.value = false;
  isDisabled.value = false;
  /*rules.value = {}; */
  if (form.value) {
    form.value.resetFields();
  }
  getList();
}

//关闭添加文件窗口
const dialogClosed = () => {
  getList();
};

/* const dialogClosed = () => {
  if (form.value) {
    form.value.resetFields();
  }
  getList();
}; */

// 文件替换
function handleExceed(files) {
  upload.value?.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  upload.value?.handleStart(file);
}

/* // 文件修改
async function updateData() {
  form.value.validate((valid) => {
    if (valid) {
      tableLoading.value = true;
      updateFile({ ...dataForm, dateTime: parseTime(dataForm.dateTime) })
        .then((res) => {
          tableLoading.value = false;
          dialogFormVisible.value = false;
          getList();
        })
        .catch((err) => {
          loading.value = false;
          $modal.msgError("修改失败");
        });
    }
  });
} */

// 文件表格
const fileList = ref([]); // 文件列表
const historyFileList = ref([]); //历史文件版本
const ids = ref([]); // 选中数组
const multiple = ref(false); // 是否多选

// 打开添加文件对话框
function handleAdd() {
  dialogStatus.value = "create";
  fileList.value = [];
  resetForm();
  dialogFormVisible.value = true;
  isDisabled.value = false;
}

// 删除文件
function handleDelete() {
  if (ids.value.length == 0) {
    $modal.msg("您没有选择文件！");
  } else {
    $modal.confirm("是否删除文件?").then(() => {
      delFile(ids.value)
        .then((res) => {
          console.log("222");
          $modal.msgSuccess("删除成功！");
          getList();
        })
        .catch((err) => {
          $modal.msgError("删除失败");
        });
    });
  }
}

const allFileId = ref([]);

// 请求文件列表
function getList() {
  tableLoading.value = true;
  listFile({
    ...queryParams,
    treeId: tree.value.getCurrentNode().treeId,
    fileStatus: roles[0] === "admin" ? null : 1,
  })
    .then((res) => {
      tableLoading.value = false;
      fileList.value = res.rows.map((item) => ({
        ...item,
        fileStatus: item.status === 1,
      }));
      fileList.value.forEach((item) => {
        allFileId.value.push(item.fileId);
      });
      total.value = res.total;
    })
    .catch((err) => {
      tableLoading.value = false;
      $modal.msgError("获取列表失败");
    });
}

// 选择文件项
function handleSelectionChange(selection) {
  ids.value = [];
  selection.forEach((item) => {
    ids.value.push(item.fileId);
  });
}

// 更新是否公开选项
async function updateFileStatus(row) {
  updateFile({
    fileId: row.fileId,
    fileStatus: row.fileStatus,
    fileName: row.fileName,
    description: row.description,
    dateTime: row.dateTime,
  })
    .then((res) => {
      $modal.msgSuccess("更新成功");
    })
    .catch((err) => {
      $modal.msgError("更新失败");
    });
}

// 下载文件
const downloadLoading = ref(false);
let downloadTimer = null;
async function handleDownload(row) {
  if (downloadLoading.value) {
    return; // Prevent multiple downloads while in progress
  }
  $modal.msg("正在下载中，请等待");
  downloadLoading.value = true;
  try {
    await $download.resource(row.url);

    downloadTimer = setTimeout(() => {
      downloadLoading.value = false;
      clearTimeout(downloadTimer);
    }, 5000);
  } catch (error) {
    console.log(error);
    downloadLoading.value = false;
  }
}

// 修改文件
function handleUpdate(row) {
  dataForm.fileId = row.fileId;
  dataForm.fileName = row.fileName;
  dataForm.description = row.description;
  dataForm.fileStatus = row.fileStatus;
  dataForm.dateTime = row.dateTime;
  dialogFormVisible.value = true;
  dialogStatus.value = "update";
}

// 删除文件
function deleteFile(row) {
  $modal.confirm("是否删除文件?").then(() => {
    delFile([row.fileId])
      .then((res) => {
        $modal.msgSuccess("删除成功！");
        getList();
      })
      .catch((err) => {
        $modal.msgError("删除失败");
      });
  });
}

//跳转文件详情
const openfile = (row) => {
  console.log(row.tableName, "klkl");
  router.push({
    path: "/phenotype/file", // 跳转到的目标页面的路由名称
    query: { id: row.fileId, tableName: row.tableName },
  });
};

//查看文件历史版本
function openHistory(row) {
  historyTableLoading.value = true;
  historyFormVisible.value = true;
  listFile({
    ...queryParams,
    treeId: tree.value.getCurrentNode().treeId,
    fileStatus: roles[0] === "admin" ? null : 1,
    tableName: row.tableName,
  })
    .then((res) => {
      tableLoading.value = false;
      historyFileList.value = res.rows.map((item) => ({
        ...item,
        fileStatus: item.status === 1,
      }));
      historyFileList.value.forEach((item) => {
        allFileId.value.push(item.fileId);
      });
      total.value = res.total;
      historyTableLoading.value = false;
    })
    .catch((err) => {
      tableLoading.value = false;
      historyTableLoading.value = false;
      $modal.msgError("获取列表失败");
    });
}

// 表单提交
const total = ref(2);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  treeId: "",
  fileId: "",
  fileName: "",
  description: "",
  fileStatus: "",
  dateTime: "",
});
const showSearch = ref(true);
const queryForm = ref(null); // 查询表单dom元素
const handleQuery = async () => {
  // 查询回调
  queryParams.treeId = tree.value.getCurrentNode().treeId;

  getList();
};

const resetQuery = () => {
  queryParams.pageNum = 1;
  queryParams.pageSize = 10;
  queryParams.treeId = 0;
  queryParams.fileId = "";
  queryParams.fileName = "";
  queryParams.description = "";
  queryParams.fileStatus = true;
  getList();
};

// 树控件
const routesData = ref([
  /*  {
    treeName: "Level one 1",
    treeId: "1",
    children: [
      {
        treeName: "Level two 1-1",
        treeId: "11",
        children: [
          {
            treeName: "Level three 1-1-1",
            treeId: "111",
          },
        ],
      },
    ],
  }, */
]);

// 树表单
const treeForm = reactive({
  treeName: "",
  isShow: true,
});

const dialogTreeFormVisible = ref(false); // 树表单可见
const historyFormVisible = ref(false); //历史上传记录表单
const dataTreeForm = ref(null); // 树表单dom实例
const dialogTreeStatus = ref("createNode");
//树表单验证规则
const treeRules = reactive({
  treeName: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
  ],
  isShow: [{ required: true, message: "Please select", trigger: "blur" }],
});

// 树组件节点属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const treeType = ref(4); // 树的种类
const tree = ref(null); // 数的dom实例
const firstLeafNode = ref(null);
const firstLeafNodeKey = ref(null);

const getTreeList = () => {
  getTree(treeType.value, 0, 1).then((res) => {
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

// 递归查找第一个叶子节点的函数
function findFirstLeafNode(nodes) {
  for (const node of nodes) {
    if (!node.children || node.children.length === 0) {
      return node;
    } else {
      const firstLeaf = findFirstLeafNode(node.children);
      if (firstLeaf) {
        return firstLeaf;
      }
    }
  }
  return null;
}

// 重置树表单
function resetTreeForm() {
  treeForm.treeName = "";
  treeForm.isShow = true;
}

// 添加节点
function addChildNode() {
  if (!tree.value.getCurrentNode() && routesData.value.length !== 0) {
    $modal.msgWarning("请选择所要添加节点的父节点");
    return;
  }
  resetTreeForm();
  dialogTreeStatus.value = "createNode";
  dialogTreeFormVisible.value = true;
}

// 修改节点
function updateChildNode() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning("请选择所要修改节点的父节点");
    return;
  }
  resetTreeForm();
  dialogTreeStatus.value = "updateNode";
  dialogTreeFormVisible.value = true;
}

//下载模板文件
function downloadTemplate() {
  //下载
  $download.resource(
    "C:\\Users\\Administrator\\Desktop\\yuzhong\\表型数据模板.csv"
  );
}

// 创建树节点
function createTreeData() {
  dataTreeForm.value.validate((valid) => {
    if (valid) {
      const id = tree.value.getCurrentNode()
        ? tree.value.getCurrentNode().treeId
        : 0;
      addNode({
        isShow: treeForm.isShow ? 1 : 0,
        treeName: treeForm.treeName,
        parentId: id,
        treeType: treeType.value,
      }).then(
        () => {
          $modal.msgSuccess("添加节点成功");
          getTreeList();
        },
        () => {
          $modal.msgError("添加节点失败");
        }
      );
      dialogTreeFormVisible.value = false;
    }
  });
}

// 更新树节点
function updateTreeData() {
  dataTreeForm.value.validate((valid) => {
    if (valid) {
      updateNode({
        isShow: treeForm.isShow ? 1 : 0,
        treeName: treeForm.treeName,
        treeId: tree.value.getCurrentNode().treeId,
      }).then(
        () => {
          $modal.msgSuccess("修改成功");
          getTreeList();
        },
        () => {
          $modal.msgError("修改失败");
        }
      );
      dialogTreeFormVisible.value = false;
    }
  });
}

//删除节点
function deleteNode() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning("请选择节点");
    return;
  }
  $modal.confirm("是否删除该节点").then(() => {
    const curNode = tree.value.getCurrentNode();
    const curNodeTreeIds = getTreeNodeIdsByNode(curNode);
    deleteNodes(curNodeTreeIds).then(() => {
      $modal.msgSuccess("删除节点成功");
      getTreeList();
    });
  });
}

//树控件点击回调
function rowClick(nodeObj) {
  if (nodeObj.disabled) {
    return;
  }
  /* resetForm(); */
  treeRules.value = {};
  /* rules.value = {};  */
  treeForm.treeName = nodeObj.treeName;
  if (nodeObj.isShow == 1) {
    treeForm.isShow == true;
  } else {
    treeForm.isShow == false;
  }

  queryParams.treeId = nodeObj.treeId;
  resetQuery();
  getList();
}

onMounted(() => {
  getTreeList();
});
</script> -->

<style lang="less" scoped>
.card-container {
  // width: 97%;
  // border-radius: 50px;
  // margin: auto;
  // margin-top: 10px;

  // :deep(.el-card__body) {
  //   padding: 15px 20px 20px 20px !important;
  // }

  //padding: 20px 20px 0px;
  max-height: 50vh;
  padding: 0px;
  background-color: #fff;
  margin: 0px 20px 20px 20px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12);

  h1 {
    font-size: 20px;
    text-align: center;
    position: relative;
    z-index: 1;
    margin: 0 0 20px;
  }

  h1 i {
    background-color: #1FB864;
    height: 5px;
    width: 150px;
    margin-left: -75px;
    position: absolute;
    left: 50%;
    bottom: 0;
    z-index: 0;
    opacity: .5;
  }
}

.big-wrapper {
  margin: auto;
}

.area_top {
  display: flex;
  flex-direction: row;
  margin: 20px auto;
  justify-content: space-between;

  .search_table {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    float: right;
  }
}

.map_sys {
  display: flex;

  .city_form {
    width: 38%;
    margin-left: -40px;
    position: relative;

    .cityForm_item {
      margin-top: 3vw;
    }
  }
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

#chinaMap {
  padding-left: 50px;
}
</style>


<!-- 卡片样式 -->
<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  position: relative;
  background-color: #fff;
}

.card-header:before,
.card-header:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.card-header:before {
  content: "";
  position: absolute;
  bottom: 0;
  /* 将三角形定位在box的底部 */
  left: -60px;
  /* 紧贴box的左边 */
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 60px 60px;
  /* 第一个0表示上边框无宽度，第二个0表示右边框无宽度，第三个值控制三角形的高度（即底部边框宽度），第四个值控制三角形的宽度 */
  // border-color: transparent transparent #f0f0f0 transparent;
  border-color: transparent transparent #fff transparent;
  /* 最后一个透明色表示右下角是透明的，形成直角三角形 */
}

.card-header:after {
  content: "";
  position: absolute;
  bottom: 0;
  /* 将三角形定位在box的底部 */
  right: -60px;
  /* 紧贴box的左边 */
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 60px 0 0 60px;
  /* 第一个值控制三角形的高度（现在是顶部边框宽度），第二个值为0表示无右边框，第三和第四个值分别表示下边框和左边框宽度 */
  border-color: transparent transparent transparent #fff;
  /* 第一个值是三角形的颜色，后面三个透明色分别表示右下、左下和左上角是透明的，形成朝左的直角三角形 */
}

:deep(.el-card__header) {
  background: #525559;
  height: 60px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px !important;

  h1 {
    margin: 0%;
  }

  // width: 100px; /* 梯形底部宽度 */
  // height: 0; /* 设置元素本身高度为0，通过边框来构建形状 */
  // border-top: 60px solid red; /* 这将成为梯形的高度 */
  // border-right: 0;
  // border-bottom: 0;
  // border-right: 100px solid transparent; /* 左侧边框透明以形成斜边 */
  span {

    font-weight: 700;
    font-size: 20px;
    color: white;
    text-align: center;
    letter-spacing: 2px;
  }


}



// :deep(.el-table__header) {
//   border-bottom: 1px solid black;
//   border-top: 1px solid #EBEEF5;

//   th {
//     font-weight: 800;
//     font-size: 16PX;
//     background: #FAFAFA !important;
//     letter-spacing: 2px;
//     height: 60px !important;
//   }
// }

:deep(.el-table__cell) {
  .cell {
    word-break: break-word;
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

:deep(.el-textarea__inner) {
  background-color: transparent !important;
  border: 1px dashed #DCDFE6 !important;
  resize: none;
  box-shadow: none;
  height: 200px !important;

  :hover {
    border: 1px dashed #DCDFE6 !important;
  }

}

:deep(.el-textarea :hover) {
  border-color: #1FB864 !important;
  outline: none !important;
}

:deep(.el-textarea :focus) {
  outline: none !important;
}

.upload-demo {
  height: 200px !important;
}

:deep(.el-upload-dragger) {
  height: 200px !important;
}


:deep(.el-button) {
  --el-button-border-color: #dcdfe6;
  --el-button-bg-color: #ffffff;
  --el-button-text-color: #606266;
  --el-button-disabled-text-color: #a8abb2;
  --el-button-disabled-bg-color: #ffffff;
  --el-button-disabled-border-color: #e4e7ed;
  --el-button-divide-border-color: rgba(255, 255, 255, .5);
  --el-button-hover-text-color: #409eff;
  --el-button-hover-bg-color: #ecf5ff;
  --el-button-hover-border-color: #c6e2ff;
  --el-button-active-text-color: #409eff;
  --el-button-active-border-color: #409eff;
  --el-button-active-bg-color: #ecf5ff;
}

:deep(.el-button--primary.is-plain) {
  --el-button-text-color: #409eff !important;
  --el-button-bg-color: #ecf5ff !important;
  --el-button-border-color: #a0cfff !important;
  --el-button-hover-text-color: #ffffff !important;
  --el-button-hover-bg-color: #409eff !important;
  --el-button-hover-border-color: #409eff !important;
  --el-button-active-text-color: #ffffff !important;
}

.el-button--primary {
  --el-button-text-color: #ffffff;
  --el-button-bg-color: #409eff;
  --el-button-border-color: #409eff;
  --el-button-hover-text-color: #ffffff;
  --el-button-hover-bg-color: #79bbff;
  --el-button-hover-border-color: #79bbff;
  --el-button-active-bg-color: #337ecc;
  --el-button-active-border-color: #337ecc;
  --el-button-disabled-text-color: #337ecc;
  --el-button-disabled-bg-color: #a0cfff;
  --el-button-disabled-border-color: #a0cfff;
}

.el-button--success.is-plain {
  --el-button-text-color: #67c23a;
  --el-button-bg-color: #f0f9eb;
  --el-button-border-color: #b3e19d;
  --el-button-hover-text-color: #ffffff;
  --el-button-hover-bg-color: #67c23a;
  --el-button-hover-border-color: #67c23a;
  --el-button-active-text-color: #ffffff;
}

.el-button--danger.is-plain {
  --el-button-text-color: #f56c6c;
  --el-button-bg-color: #fef0f0;
  --el-button-border-color: #fab6b6;
  --el-button-hover-text-color: #ffffff;
  --el-button-hover-bg-color: #f56c6c;
  --el-button-hover-border-color: #f56c6c;
  --el-button-active-text-color: #ffffff;
}

.el-button--info.is-plain {
  --el-button-text-color: #909399;
  --el-button-bg-color: #f4f4f5;
  --el-button-border-color: #c8c9cc;
  --el-button-hover-text-color: #ffffff;
  --el-button-hover-bg-color: #909399;
  --el-button-hover-border-color: #909399;
  --el-button-active-text-color: #ffffff;
}
</style>

<style>
:root {
  --el-color-primary: #1FB864;
}
</style>