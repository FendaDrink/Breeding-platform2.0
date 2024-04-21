<template>
  <div ref="scrollRef" class="background-container">
    <div ref="upperRef" class="card-container upper">
      <div class="background">
        <div class="main-content" ref="mainContentRef">
          <div class="main-title" ref="titleRef">{{ $t('decision.upload.header') }}</div>
          <div class="input-wrapper">
            <div class="input">
              <el-input
                ref="inputRef"
                :placeholder="$t('decision.upload.placeholder')"
                v-model="textarea2"
                size="large"
              >
                <template #prepend>
                  <el-popover :width="400" placement="bottom-start" :visible.sync="showPopover">
                    <div class="inner-upload">
                      <el-upload v-model:file-list="fileList" class="upload-demo" ref="upload" :limit="1" accept=".vcf" drag
                        show-file-list :action="uploadUrl" :auto-upload="false" :headers="{ Authorization: 'Bearer ' + getToken() }"
                        :on-error="uploadFileError" :on-success="uploadFileSuccess"
                        :on-change="handleUploadFile"
                        :before-upload="handleBeforeUpload">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div>{{ $t('decision.upload.prompt') }}<a href="javascript:;" style="color: var(--theme-color);">{{ $t('decision.upload.click') }}</a></div>
                      </el-upload>
                      <div class="btns">
                        <div class="close">
                          <el-button type="primary" @click="showPopover=!showPopover" style="width: 80px;"><el-icon><Close /></el-icon>&nbsp;{{ $t('decision.upload.cancel') }}</el-button>
                        </div>
                      </div>
                    </div>
                    <template #reference>
                      <el-button class="no-inherit" @click="showPopover=!showPopover">
                        <!-- <el-icon v-if="!showPopover" :color="showPopover?'#fff':'#817d7d'" class="no-inherit"><FolderOpened /></el-icon> -->
                        <svg t="1710852877805" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1564" width="22" height="22"><path d="M62.659316 898.116869 155.237045 329.102536c1.693495-9.590827 10.725469-16.93495 19.757442-16.93495l713.52591 0 0-84.674752c0-9.590827-7.338479-16.93495-16.93495-16.93495l-429.018743 0L366.923925 120.238148 22.579934 120.238148c-9.596472 0-16.93495 7.344123-16.93495 16.93495L5.644983 881.181918c0 9.590827 7.338479 16.93495 16.93495 16.93495L62.659316 898.116869z" :fill="showPopover?'#ffffff':$theme.color" stroke="white" stroke-width="40" p-id="1565"></path><path d="M998.597574 382.16538 228.057332 382.16538c-9.037619 0-18.063947 7.338479-19.192944 16.370452L121.367144 882.310915c-1.693495 9.037619 4.515987 16.370452 13.54796 16.370452l770.540243 0c9.031974 0 18.063947-7.338479 19.187299-16.370452L1012.145535 398.535832C1013.83903 390.068357 1007.629548 382.16538 998.597574 382.16538z" :fill="showPopover?'#ffffff':$theme.color" stroke="white" stroke-width="40" p-id="1566"></path></svg>
                      </el-button>
                    </template>
                  </el-popover>
                </template>
                <template #append>
                  <el-button @click="submit"><el-icon><Search/></el-icon>&nbsp;&nbsp;{{ $t('decision.upload.search') }}</el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div class="nav-container" ref="navContainerRef">
            <div class="nav-item" v-for="(item, index) in typeList" :key="index" :ref="setNavItemRefs">
                <div class="mask" @click="goTo(item.url)">
                  <span>{{item.title }}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-card class="card-container lower">
      <div class="card-header">
        <span>{{ $t('decision.table.title') }}</span>
        <el-button @click="getdataList" type="primary" size="large" icon="Refresh">{{ $t('decision.table.refresh_btn') }}</el-button>
      </div>
      <el-table max-height="70vh" :data="dataList" :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
        <el-table-column prop="id" :label="$t('decision.table.index')"></el-table-column>
        <el-table-column prop="materialName" :label="$t('decision.table.material_name')"></el-table-column>
        <el-table-column fixed="right" :label="$t('decision.table.material_geno')">
          <template #default="scope">
            <el-button v-if="scope.row.genofile != null" link type="text" style="color: #0dbc79;"
                       @click="exportGeno(scope.row.genofile)">
              {{ scope.row.genofile.split("\\").pop() }}
            </el-button>
            <el-button v-else link type="text" disabled>
              {{ $t('decision.table.no_file') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" :label="$t('decision.table.createdBy')" />
        <el-table-column prop="createTime" :label="$t('decision.table.createTime')" />
        <el-table-column :label="$t('decision.table.status')" width="150">
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
        <el-table-column fixed="right" :label="$t('decision.table.result_download')">
          <template #default="scope">
            <el-button link type="text" @click="exportPDf(scope.row)" style="color: #0dbc79;"
                       v-show="scope.row.status === 1">
              {{ $t('decision.table.export') }}
            </el-button>
            <el-button link type="text" disabled v-show="scope.row.status !== 1">
              {{$t('decision.table.export')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('decision.table.prompt')">
          <template #default="scope">
            <el-popover placement="top" trigger="hover" :content="scope.row.info?scope.row.info:'无'">
              <template #reference>
                <el-button link type="text" style="color: var(--theme-color);">{{ $t('decision.table.promptInfo') }}</el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('decision.table.option')">
          <template #default="scope">
            <el-popconfirm :title="$t('decision.table.del_message')" @confirm='handleDelete(scope.row)'>
              <template #reference>
                <el-button link type="text" style="color: var(--theme-color);">
                  {{ $t('decision.table.delete') }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination v-show="total > 0" :total="total" :page-sizes="[ 10, 20, 30, 50]"
                  v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
                  right background layout="total, sizes,prev, pager, next, jumper" @size-change="getdataList"
                  @current-change="getdataList" />
      </div>
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

// 国际化相关包
import zh from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import en from 'element-plus/lib/locale/lang/en' // 英文语言
import { useI18n } from 'vue-i18n'
import {computed} from "@vue/reactivity";
const i18n = useI18n();
const locale = computed(() => ((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? zh : en));

// 国际化相关变量
const message = {
  upload_vcf:computed(()=>i18n.t('decision.message.upload_vcf')).value,
  input_materialName:computed(()=>i18n.t('decision.message.input_materialName')).value,
  upload_file:computed(()=>i18n.t('decision.message.upload_file')).value,
  format_error:computed(()=>i18n.t('decision.message.format_error')).value,
  searching:computed(()=>i18n.t('decision.message.searching')).value,
  searchSuccess:computed(()=>i18n.t('decision.message.searchSuccess')).value,
  template_error:computed(()=>i18n.t('decision.message.template_error')).value,
  upload_fail:computed(()=>i18n.t('decision.message.upload_fail')).value,
  download_failure:computed(()=>i18n.t('decision.message.download_failure')).value,
  export_fail:computed(()=>i18n.t('decision.message.export_fail')).value,
  error:computed(()=>i18n.t('decision.message.error')).value,
  deleteSuccess:computed(()=>i18n.t('decision.message.deleteSuccess')).value,
  querySuccess:computed(()=>i18n.t('decision.message.querySuccess')).value,
  queryFailure:computed(()=>i18n.t('decision.message.queryFailure')).value,
  searchFailed:computed(()=>i18n.t('decision.message.searchFailed')).value,
  phenotype:computed(()=>i18n.t('decision.upload.phenotype')).value,
  genotype:computed(()=>i18n.t('decision.upload.genotype')).value,
  photos:computed(()=>i18n.t('decision.upload.photos')).value,
  material:computed(()=>i18n.t('decision.upload.material')).value,
}

const router = useRouter();

// vue实例
const {
  proxy: { $modal, $download, $theme },
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
// 加载中显示框
const loading=ref(null)
// 弹出框
const showPopover = ref(false);

const total = ref(0);

const dataList=ref([]);

// 点击文件按钮
const clickPopover = () => {
  showPopover.value = !showPopover.value;
  console.log(showPopover.value);
};

// 获取育种任务列表
const getdataList = async () => {
  const res = await getDataListAPI(queryParams.value);
  if (res.code === 200) {
    $modal.msgSuccess(message.querySuccess);
    dataList.value = res.rows;
    total.value = res.total;
  } else {
    $modal.msgError(message.queryFailure);
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
        message.upload_vcf,
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
  if (textarea2.value === ''||textarea2.value.trim() === ''){
    $modal.msgWarning(message.input_materialName);
    return;
  }
  if (fileList.value.length === 0) {
    $modal.msgWarning(message.upload_file);
    return;
  }
  const isRight = /^[\w\s]+(?:,[\w\s]+)*$/.test(textarea2.value);
  if (!isRight) {
    $modal.msgWarning(message.format_error);
    return;
  }
  let formdata = new FormData();
  formdata.append('genofile', fileList.value[0].raw);
  loading.value=ElMessage({
    type:'warning',
    message:message.searching,
    duration:0,
  })
  const res = await getEnvAnalyzeList({ param: textarea2.value},formdata);
  if (res.code === 200) {
    loading.value.close()
    $modal.msgSuccess(message.searchSuccess)
    setTimeout(()=>{
      router.go(0)
    },1000)
  } else {
    $modal.msgError(message.searchFailed);
  }
}

// 文件上传成功回调
// 文件上传成功回调
async function uploadFileSuccess(response) {
  if (response.code === 200) {
    $modal.msgSuccess(response.msg);
  } else {
    $modal.msgError(message.template_error);
  }
}
// 文件上传失败回调
const uploadFileError = (error, file, fileList) => {
  console.log("File upload error", error);
  $modal.msgError(message.upload_fail);
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
		ElMessage.error(message.download_failure);
	})
}
function exportPDf(row) {
	console.log(row)
	if (row.status != 1) {
    ElMessageBox.alert(message.export_fail, message.error, {
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
			const blob = new Blob([res],{type:'text/plain'})
			saveAs(blob, `breed${row.id}.pdf`)
		} else {
			const resText = data.text();
			const rspObj = JSON.parse(resText);
			const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
			Message.error(errMsg);
		}
	}).catch(err => {
		console.log(err)
    ElMessage.error(message.download_failure);
	})
}
async function handleDelete(row) {
	console.log(row)
	await deleteMar(row.id)
  ElMessage.success(message.deleteSuccess)
	getdataList()
}

const scrollRef = ref(null);
const mainContentRef = ref(null);
const navItemRefs = ref([])
const navContainerRef = ref(null);

const setNavItemRefs = (el) =>{
  navItemRefs.value.push(el);
}

const maxScrollY = 1000;

const updateStyle = (scrollY,initTops,initLefts,targetLefts) => {
  const percent = scrollY / maxScrollY
  mainContentRef.value.style.opacity = 1 - percent;
  mainContentRef.value.style.transform = `scale(${1 - percent})`;
      // top: #{(($i + 1) % 2) * 100px};
    // left: calc(#{($i - 1) * 135px} + 50% - 300px);
    // 变为
    // top: calc(50% - 50px);
    // left: calc(#{($i - 1) * 50px / 3} + 50% - 100px);

  navItemRefs.value.forEach((item, index) => {
    // console.log(((150 -initTops[1]) * percent *1.5))
    // console.log(initTops[1],'top');
    // console.log(initTops[1] + ((150 -initTops[1]) * percent *1.5),'sum');
    item.style.top = `${initTops[index] + ((150 -initTops[index]) * percent *1.5)}px`;
    item.style.left = `${initLefts[index] + ((targetLefts[index] - initLefts[index]) * percent * 1.5)}px`;
  });
}


const scrollAnimation = () =>{
  // 监听滚动条滚动事件
  let scrollY = 0;
  let initTops = [];
  let initLefts = [];
  let targetLefts = [];


  // 获取初始位置
  const navContainerW = +getComputedStyle(navContainerRef.value).width.replace('px','');
  console.log(navContainerW,'navContainerW');
  navItemRefs.value.forEach((item, index) => {
    initTops.push(+getComputedStyle(item).top.replace('px',''));
    initLefts.push(+getComputedStyle(item).left.replace('px',''));
    targetLefts.push(index * 50/3 + 0.5*navContainerW - 100);
  });
  console.log(initTops,initLefts);
  scrollRef.value.addEventListener('scroll', ()=>{
    // 关闭文件上传弹窗
    showPopover.value = false;
    scrollY = scrollRef.value.scrollTop;
    // console.log(scrollY);
    updateStyle(scrollY,initTops,initLefts,targetLefts);
    

  });
}

onMounted(() => {
  getdataList();
  scrollAnimation();
});

// 销毁时清除监听
onBeforeUnmount(() => {
  scrollRef.value.removeEventListener('scroll', scrollAnimation);
});
const goTo = (url) => {
  router.push({
    path:url,
  })
}



const typeList = reactive([
  {
    title: message.phenotype,
    url:"/phenotype/phenotype"
  },
  {
    title: message.genotype,
    url:"/genotype/geno"
  },
  {
    title: message.photos,
    url:"/admin/info/photos"
  },
  {
    title: message.material,
    url:"/breed/material-pro"
  },
])


</script>

<style scoped lang="scss">
.nav-container {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  width: 100%;
  height: 200px;
}

.nav-item {
  position: absolute;
  cursor: pointer;
  pointer-events: all;
  width: 150px;
  height: 200px;
  /* 磨砂玻璃 */
  border-radius: 10px;
  background-size:cover;
  filter: blur(0.5px);
  overflow: hidden;
  &:hover{
    .mask{
      transform: translateY(0);
    }
  }
}
@for $i from 1 through 4 {
  .nav-item:nth-child(#{$i}) {
    // 偶数向下偏移
    top: #{(($i + 1) % 2) * 100px};
    left: calc(#{($i - 1) * 135px} + 50% - 300px);
    background-image: url('@/assets/img/#{$i}.jpg');
    // top: calc(50% - 50px);
    // left: calc(#{($i - 1) * 50px / 3} + 50% - 100px);
  }
}

.mask{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background:linear-gradient(#ffffffaa,#1FB864aa);
  border-radius: 10px;
  overflow: hidden;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  transform: translateY(-100%);
  transition: transform 0.3s;
}

</style>

<style lang="scss" scoped>

.background-container{
  width: 100%;
  height: calc(100vh - 51px);
  background-image: url('@/assets/images/corn.jpg');
  background-size: cover;
  overflow: auto;
  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }
}

.upper{
  border-radius: 5px;
  height: 150%;
  .background{
    height: 100%;
    width: 100%;
    // position: relative;
    // top: 0;
    // background-color: #d94646;
    border-radius: 5px;
    // background-image: url('@/assets/images/corn.jpg');
    // filter: brightness(0.99);
    background-size: cover;
    // display: flex;
    // justify-content: center;
    // align-items: flex-start;
    .main-content{
      top: 0;
      pointer-events:none;
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .main-title{
        display: flex;
        align-items: flex-end;
        justify-content: center;
        height: 10%;
        // 混合字体颜色
        color:#ffffff;
        margin-bottom: 50px;
        font-size: 390%;
        font-weight: 700;
        text-align: center;
        // color: var(--theme-color);
        // background-clip: text;
        // -webkit-text-fill-color: transparent;
        // background-image: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
      }
      .input-wrapper{
        // flex: 1;
        margin:0 50px 80px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        .input{
          color: #fff;
          :deep(.el-input){
            --el-input-border-color:var(--theme-color) !important;
          }
          .el-input{
            pointer-events: all;
            width: 800px;
            height: 60px;
            border-radius: 10px;
            font-size: 110%;
            box-shadow: none;
            :deep(.el-input__inner){
              height: 100%;
              // box-shadow: none;
              &::placeholder{
                color: #817d7d;
                font-size: 100%;
              }
            }
            :deep(.el-input-group__prepend){
              border-radius: 10px 0 0 10px;
              background-color: var(--theme-color);
              .el-button{
                .el-icon{
                  // background-color: var(--theme-color);
                  font-size: 120%;
                }
              }
              &:hover{
                background-color: #1ca55a;
              }
            }
            :deep(.el-input-group__append){
              border-radius: 0 10px 10px 0;
              background-color: var(--theme-color);
              color:#fff;
              width: 13%;
              cursor: pointer;
              &:hover{
                background-color: #1ca55a;
              }
            }
            :deep(.el-button){
              width: 100%;
              display: flex;
              justify-content: space-between;
              .icon{
                font-size: 120%;
              }
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
  align-items: center;
  height: 200px;
  .upload-demo{
    width: 95%;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .btns{
    width: 100%;
    display: flex;
    justify-content:flex-end;
    padding-right: 10px;
  }
}
:deep(.el-upload-dragger){
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .el-icon{
    height: 30px;
  }
  div{
    padding: 20px;
  }
}
:deep(.el-upload-list){
  width:100%;
}
// .lower{
//   min-height: 30vh;
// }

.el-table{
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  margin-top:20px;
  padding-top:15px;
  padding-bottom: 20px;
}

.card-container {
  background-color: transparent;
  border: none;
  box-shadow: none;
  // :deep(.el-card__body) {
  //   padding: 15px 20px 20px 20px !important;
  // }

  //padding: 20px 20px 0px;
  padding: 0px;
  // background-color: #fff;
  margin: 0px 20px 20px 20px;
  // box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12);

  h1 {
    font-size: 20px;
    text-align: center;
    position: relative;
    z-index: 1;
    margin: 0 0 20px;
  }

  h1 i {
    background-color: var(--theme-color);
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
  font-size: 26px;
  color: #fff;
  font-weight: bold;
}

:deep(.el-table__header) {
  th {
    background-color: #fff !important;
  }
}

:deep(.el-table__cell) {
  .cell {
    word-break: break-word;
  }

}
</style>

<style lang="less" scoped>
// /* 假设 el-checkbox 是表头中的一个子元素 */

.pagination-container{
  width: 100%;
  height: 50px;
  margin-top: -1px;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  background-color: #ffffff;
}

:deep(.el-pagination){
  position: static;
}

// :deep(.el-table .el-table__header-wrapper tr th) {
//   background-color: var(--theme-color) !important;
//   color: rgb(255, 255, 255);
// }

// /* 修改前后箭头未点击时的背景颜色 */
:deep(.el-pagination .btn-prev){
  background-color: transparent;
}
:deep(.el-pagination .btn-next) {
  background-color: transparent;
}

// /* 修改未点击时的数字方块背景颜色 */
// :deep(.el-pagination .el-pager li:not(.active):not(.disabled):hover) {
//   background-color: #EEEEEE !important;
// }

// // /* 未点击时的数字方块背景颜色 */
// // :deep(.el-pagination .el-pager li:not(.active):not(.disabled)) {
// //   background-color: #fff !important;
// //   color: #000;
// // }

:deep(.el-pagination.is-background .el-pager li) {
  background-color: transparent;
}

// :deep(.el-pagination ul li, .el-pagination .el-pagination__jump) {
//   background-color: transparent;
// }

// :deep(.el-pagination ul li:not(:last-child)) {
//   border-right: #DDDDDD 1px solid;
// }


// :deep(.el-pagination ul) {
//   border: #DDDDDD 1px solid;
// }

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload .el-upload-dragger) {
  width: 100%;
}

.green-button {
  background-color: var(--theme-color) !important;
  color: #fff !important;
  border: 1px solid var(--theme-color) !important;
}

.green-button:hover {
  background-color: var(--theme-color) !important;
  color: #fff !important;
  border: 1px solid var(--theme-color) !important;
}

.table_button {
  color: var(--theme-color);
}

.table_button:hover {
  color: var(--theme-color);
}


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
  border-color: var(--theme-color) !important;
  outline: none !important;
}

:deep(.el-textarea :focus) {
  outline: none !important;
}

.upload-demo {
  height: 200px !important;
}



:deep(.el-button) {
  --el-button-border-color: var(--theme-color);
  --el-button-bg-color: #ffffff;
  --el-button-text-color: #606266;
  --el-button-disabled-text-color: #a8abb2;
  --el-button-disabled-bg-color: #ffffff;
  --el-button-disabled-border-color: #e4e7ed;
  --el-button-divide-border-color: rgba(255, 255, 255, .5);
  --el-button-hover-text-color: var(--theme-color);
  --el-button-hover-bg-color: #ecf5ff;
  --el-button-hover-border-color: var(--theme-color);
  --el-button-active-text-color: var(--theme-color);
  --el-button-active-border-color: var(--theme-color);
  --el-button-active-bg-color: #ecf5ff;
}

:deep(.el-button--primary.is-plain) {
  --el-button-text-color: var(--theme-color) !important;
  --el-button-bg-color: #ecf5ff !important;
  --el-button-border-color: var(--theme-color) !important;
  --el-button-hover-text-color: #ffffff !important;
  --el-button-hover-bg-color: var(--theme-color) !important;
  --el-button-hover-border-color: var(--theme-color) !important;
  --el-button-active-text-color: #ffffff !important;
}

.el-button--primary {
  --el-button-text-color: #ffffff;
  --el-button-bg-color: #21c96c;
  --el-button-border-color: #21c96c;
  --el-button-hover-text-color: #ffffff;
  --el-button-hover-bg-color: var(--theme-color);
  --el-button-hover-border-color: var(--theme-color);
  --el-button-active-bg-color: var(--theme-color);
  --el-button-active-border-color: var(--theme-color);
  --el-button-disabled-text-color: var(--theme-color);
  --el-button-disabled-bg-color: var(--theme-color);
  --el-button-disabled-border-color: var(--theme-color);
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
  --el-color-primary: var(--theme-color);
}
</style>