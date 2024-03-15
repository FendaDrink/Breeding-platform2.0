<template>
  <div style="width: 100%; max-height: calc(100vh - 84px); background-color: #eeeeee;padding-top: 10px;">
    <div class="card-container upper">
      <div class="background">
        <div class="main-content">
          <div class="main-title">欢迎使用智能育种平台</div>
          <div class="input-wrapper">
            <div class="input">
              <el-input
                placeholder="请输入材料名称(用逗号或空格隔开)和上传材料基因型文件"
                v-model="textarea2"
                size="large"
              >
                <template #prepend>
                  <el-popover :width="500" placement="bottom-start" :visible.sync="showPopover">
                    <div class="inner-upload">
                      <el-upload v-model:file-list="fileList" class="upload-demo" ref="upload" :limit="1" accept="." drag
                        show-file-list :action="uploadUrl" :auto-upload="false" :headers="{ Authorization: 'Bearer ' + getToken() }"
                        :on-error="uploadFileError" :on-success="uploadFileSuccess"
                        :on-change="handleUploadFile"
                        :before-upload="handleBeforeUpload">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div>将文件拖到此处，或<a href="javascript:;" style="color: #1FB864;">点击上传</a></div>
                      </el-upload>
                      <div class="btns">
                        <div class="close">
                          <el-button type="primary" @click="showPopover=!showPopover" style="width: 80px;"><el-icon><Close /></el-icon>&nbsp;取消</el-button>
                        </div>
                      </div>
                    </div>
                    <template #reference>
                      <el-button class="no-inherit" @click="showPopover=!showPopover"><el-icon :color="showPopover?'#1FB864':'#817d7d'" class="no-inherit"><FolderOpened /></el-icon></el-button>
                    </template>
                  </el-popover>
                </template>
                <template #append>
                  <el-button @click="submit"><el-icon><Search/></el-icon>&nbsp;&nbsp;搜索</el-button>
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-card class="card-container lower">
      <div class="card-header">
        <span>育种任务列表</span>
        <el-button @click="getdataList" type="primary">刷新任务列表</el-button>
      </div>
      <el-table max-height="22vh" :data="dataList" :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
        <el-table-column prop="id" label="育种任务id"></el-table-column>
        <el-table-column prop="materialName" label="材料名称"></el-table-column>
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
            <el-popover placement="top" trigger="hover" :content="scope.row.info?scope.row.info:'无'">
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

<script setup>
import { ref, getCurrentInstance, nextTick, onMounted } from "vue";
import { getEnvAnalyzeList,getDataListAPI,deleteMar, downloadFile} from "@/api/decision/decision";
import { getToken } from "@/utils/auth";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus'
import { blobValidate } from '@/utils/param'
import { get } from "@vueuse/core";

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
  pageSize: 3,
});
// 弹出框
const showPopover = ref(false);

const total = ref(0);

const dataList=ref([]);

// 点击文件按钮
const clickPopover = () => {
  showPopover.value = !showPopover.value;
  console.log(showPopover.value);
};

// function getPopoverContent(info) {
	// if (info === 'The variation information of your file has non [-1,0,1,2] value, maybe your file has empty value or last row is empty, please check your file!') {
  //       return '您文件中的变异信息存在非[-1,0,1,2]的值，可能是您的文件存在空值或文件最后一行为空，请检查您的文件！';
  //     } else if (info === 'The material name you entered was not found in our database, please check it!') {
  //       return '您输入的材料名称在我们的数据库中找不到，请检查!';
  //     } else if (info === 'Flag setting error, please contact the administrator!') {
  //       return 'Flag设置错误，请联系管理员!';
  //     } else if (info === 'Please press the system test species button!') {
  //       return '请点击系统测验种按钮!';
  //     } else if (info === 'Please check the format of your vcf file, null value exists in the file!') {
  //       return '请检查您的vcf文件格式，文件中存在空值!';
  //     } else if (info === 'Please check the format of your vcf file, we need your vcf file to have standard header!') {
  //       return '请检查您的vcf文件的格式，我们需要您的vcf文件有标准的title!';
  //     } else if (info === 'Your vcf file has empty values, please check your vcf file!') {
  //       return '您的vcf文件有空值，请检查您的vcf文件!';
  //     } else if (info === 'Please check the format of your vcf file, we need the format of snp variation is [./.,0/0,0/1,1/1]!') {
  //       return '请检查您的vcf文件格式，我们需要的变异信息的格式是[./.，0/0,0/1,1/1]!';
  //     } else if (info === 'Please check your csv file format!') {
  //       return '请检查您的csv文件格式!';
  //     } else if (info === 'please check material in your test file!') {
  //       return '请检查您的测验种文件中的材料名，它不能为0,-1,1,2!';
  //     }else if (info === 'over!'){
	//   return "完成!";
  // }

// }

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

const submit = async () => {
  if (textarea2.value === '') {
    $modal.msgWarning("请输入材料名称！");
    return;
  }
  if (fileList.value.length === 0) {
    $modal.msgWarning("请先上传文件！");
    return;
  }
  let resultValue = textarea2.value.split(/[ \n,，]+/).join(';');
  console.log(resultValue);
  const res = await getEnvAnalyzeList({ param: resultValue},fileList.value[0]);
  if (res.code === 200) {
    $modal.msgSuccess(res.msg);
      getdataList();
  } else {
    $modal.msgError(res.msg);
  }
}

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
  ElMessage.success('删除成功')
	getdataList()
}

onMounted(() => {
  getdataList();
});

</script>

<style lang="less" scoped>
.upper{
  border-radius: 5px;
  height: 50vh;
  .background{
    height: 100%;
    // background-color: #d94646;
    border-radius: 5px;
    background-image: url('@/assets/images/breed.jpg');
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    .main-content{
      width: 50%;
      height: 70%;
      .main-title{
        font-size: 40px;
        font-weight: 700;
        text-align: center;
        margin-top: 20px;
        color:#fff
      }
      .input-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        .input{
          width: 70%;
          @media (max-width: 1500px) {
            width: 90%;
          }
          color: #fff;
          :deep(.el-input){
            --el-input-border-color:#1FB864 !important;
          }
          .el-input{
            width: 100%;
            font-size: 110%;
            box-shadow: none;
            :deep(.el-input__inner){
              // box-shadow: none;
              &::placeholder{
                color: #817d7d;
                font-size: 85%;
              }
            }
            :deep(.el-input-group__prepend){
              background-color: #fff;
              .el-button{
                .el-icon{
                  // background-color: #1FB864;
                  font-size: 120%;
                }
              }
            }
            :deep(.el-input-group__append){
              background-color: #1FB864;
              width: 18%;
              border: none;
              border-radius: 0 5px 5px 0;
              cursor: pointer;
            }
            :deep(.el-button){
              width: 100%;
              color:#fff;
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
}
.inner-upload{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .btns{
    display: flex;
    justify-content:flex-end;
    margin-top: 40px;
  }
}
.lower{
  min-height: 30vh;
}
.card-container {
  // width: 97%;
  // border-radius: 50px;
  // margin: auto;
  // margin-top: 10px;

  // :deep(.el-card__body) {
  //   padding: 15px 20px 20px 20px !important;
  // }

  //padding: 20px 20px 0px;
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
  position: relative;
  background-color: #fff;
  font-size: 20px;
  font-weight: bold;
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
  --el-button-border-color: #1FB864;
  --el-button-bg-color: #ffffff;
  --el-button-text-color: #606266;
  --el-button-disabled-text-color: #a8abb2;
  --el-button-disabled-bg-color: #ffffff;
  --el-button-disabled-border-color: #e4e7ed;
  --el-button-divide-border-color: rgba(255, 255, 255, .5);
  --el-button-hover-text-color: #1FB864;
  --el-button-hover-bg-color: #ecf5ff;
  --el-button-hover-border-color: #1FB864;
  --el-button-active-text-color: #1FB864;
  --el-button-active-border-color: #1FB864;
  --el-button-active-bg-color: #ecf5ff;
}

:deep(.el-button--primary.is-plain) {
  --el-button-text-color: #1FB864 !important;
  --el-button-bg-color: #ecf5ff !important;
  --el-button-border-color: #1FB864 !important;
  --el-button-hover-text-color: #ffffff !important;
  --el-button-hover-bg-color: #1FB864 !important;
  --el-button-hover-border-color: #1FB864 !important;
  --el-button-active-text-color: #ffffff !important;
}

.el-button--primary {
  --el-button-text-color: #ffffff;
  --el-button-bg-color: #21c96c;
  --el-button-border-color: #21c96c;
  --el-button-hover-text-color: #ffffff;
  --el-button-hover-bg-color: #1FB864;
  --el-button-hover-border-color: #1FB864;
  --el-button-active-bg-color: #1FB864;
  --el-button-active-border-color: #1FB864;
  --el-button-disabled-text-color: #1FB864;
  --el-button-disabled-bg-color: #1FB864;
  --el-button-disabled-border-color: #1FB864;
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