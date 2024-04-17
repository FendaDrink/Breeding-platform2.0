<template>
    <div class="upper">
        <div class="main-content">
            <div class="out-wrapper">
                <div class="gbac">
                    <h1>{{ $t('environment.dataCatch.upload.header') }}<i>&nbsp;</i></h1>
                    <div class="main-upload">
                      <div>
                          <label for="inputHelpBlock">{{ $t('environment.dataCatch.upload.title') }}</label>
                          <el-upload class="upload-demo" v-model:file-list="environmentalData" accept=".csv"
                              action="#" :headers="headers" method="post" :auto-upload="false" multiple :limit="1"
                              :before-upload="handleBeforeUpload"
                              drag>
                              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                              <div class="el-upload__text">
                                {{ $t('environment.dataCatch.upload.prompt') }}
                              </div>
                          </el-upload>
                      </div>
                  </div>
                    <div class="btn" style="text-align: center;">
                        <el-button type="success" plain style="margin-top: 20px;"
                        @click="downloadTemplate">{{ $t('environment.dataCatch.upload.download_btn') }}</el-button>
                        <el-button type="success" @click="submit" plain
                        style="width: 110px; margin-top: 20px;">{{ $t('environment.dataCatch.upload.submit_btn') }}</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="data-show">
        <div class="inner-content">
            <div class="title">
                <div>
                    <el-icon>
                        <MessageBox />
                    </el-icon>
                    &nbsp;{{ $t('environment.dataCatch.table.title') }}
                </div>
                <div>
                    <el-button @click="getEnvironmentalData" type="primary">{{ $t('environment.dataCatch.table.refresh_btn') }}</el-button>
                </div>
            </div>
            <div class="main-data">
                <el-table v-loading="loading" trigger :data="envCatchDataList">
                    <el-table-column align="center" :label="$t('environment.dataCatch.table.index')" type="index" width="80"></el-table-column>
                    <el-table-column :label="$t('environment.dataCatch.table.indexId')" prop="id" align="center" width="180" />
                    <el-table-column align="center" prop="createBy" :label="$t('environment.dataCatch.table.createdBy')" />
                    <el-table-column align="center" prop="createTime" :label="$t('environment.dataCatch.table.createTime')" width="180" />
                    <el-table-column align="center" :label="$t('environment.dataCatch.table.status')" width="150">
                        <template #default="scope">
                            <div id="status">
                                <el-icon style="color: #0dbc79;font-size: 25px;" v-show="scope.row.status == 2">
                                    <SuccessFilled />
                                </el-icon>
                                <el-icon style="font-size: 25px;"
                                    v-show="scope.row.status == 0 || scope.row.status == 1">
                                    <Loading />
                                </el-icon>
                                <el-icon style="color: #d32f2f; font-size: 25px;" v-show="scope.row.status == 3">
                                    <CircleCloseFilled />
                                </el-icon>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" :label="$t('environment.dataCatch.table.inputFile_download')">
                        <template #default="scope">
                            <el-button link type="text" @click="exportFile(scope.row)" style="color: #0dbc79;"
                            >
                                {{ scope.row.inputCondition.split('\\').pop() }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" :label="$t('environment.dataCatch.table.result_download')">
                        <template #default="scope">
                            <el-button link type="text" @click="exportCsv(scope.row)" style="color: #0dbc79;"
                                v-show="scope.row.status == 2">
                              {{ $t('environment.dataCatch.table_inner.export') }}
                            </el-button>
                            <el-button link type="text" disabled v-show="scope.row.status != 2">
                              {{ $t('environment.dataCatch.table_inner.export') }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" :label="$t('environment.dataCatch.table.prompt')">
                        <template #default="scope">
                            <el-popover placement="top" trigger="hover">
                                <text>{{ scope.row.info===''?'无提示信息':scope.row.info }}</text>
                                <template #reference>
                                    <el-button link type="text" style="color: var(--theme-color);">
                                      {{ $t('environment.dataCatch.table_inner.promptInfo') }}</el-button>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" :label="$t('environment.dataCatch.table.option')">
                        <template #default="scope">
                            <el-popconfirm :title="$t('environment.dataCatch.table_inner.del_message')" @confirm='handleDelete(scope.row)'>
                                <template #reference>
                                    <el-button link type="text" style="color: var(--theme-color);">
                                      {{ $t('environment.dataCatch.table_inner.delete') }}
                                    </el-button>
                                </template>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="pagination" v-show="total > 0" :total="total" :page-sizes="[3, 10, 20, 30, 50]"
                    v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize" background right
                    layout=" ->, total, sizes,prev, pager, next, jumper" @size-change="getEnvironmentalData"
                    @current-change="getEnvironmentalData" />
            </div>
        </div>
    </div>
    <!-- <div class="col-md-12">
        <div class="botbanner mt10">
            —— 通过基因育种决策平台，解锁更多基因管理功能 ——
        </div>·
    </div> -->
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from "vue-router"
import { blobValidate } from '@/utils/param'
import { ElMessage, ElMessageBox } from 'element-plus'
import { postData, getData, deleteData, downloadResultCsv, downloadFile, downloadTemplateAPI} from '../../../api/environmental_management/data_catch';

// 国际化相关包
import zh from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import en from 'element-plus/lib/locale/lang/en' // 英文语言
import { useI18n } from 'vue-i18n'
import {computed} from "@vue/reactivity";
import {MessageBox} from "@element-plus/icons-vue";
const i18n = useI18n();
const locale = computed(() => ((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? zh : en));

// 国际化相关变量
const message = {
  getSuccess:computed(()=>i18n.t('environment.dataCatch.message.getSuccess')).value,
  getFailure:computed(()=>i18n.t('environment.dataCatch.message.getFailure')).value,
  uploadSuccess:computed(()=>i18n.t('environment.dataCatch.message.uploadSuccess')).value,
  uploadFailure:computed(()=>i18n.t('environment.dataCatch.message.uploadFailure')).value,
  upload_warning:computed(()=>i18n.t('environment.dataCatch.message.upload_warning')).value,
  upload_csv:computed(()=>i18n.t('environment.dataCatch.message.upload_csv')).value,
  saveAs:computed(()=>i18n.t('environment.dataCatch.message.saveAs')).value,
  download_failure:computed(()=>i18n.t('environment.dataCatch.message.download_failure')).value,
  export_fail:computed(()=>i18n.t('environment.dataCatch.message.export_fail')).value,
  error:computed(()=>i18n.t('environment.dataCatch.message.error')).value,
  del_message:computed(()=>i18n.t('environment.dataCatch.message.del_message')).value,
  warning:computed(()=>i18n.t('environment.dataCatch.message.warning')).value,
  confirm:computed(()=>i18n.t('environment.dataCatch.message.confirm')).value,
  cancel:computed(()=>i18n.t('environment.dataCatch.message.cancel')).value,
  delSuccess:computed(()=>i18n.t('environment.dataCatch.message.delSuccess')).value,
  delFailure:computed(()=>i18n.t('environment.dataCatch.message.delFailure')).value,
}
const router = useRouter()

const loading = ref(false)

// 上传的环境信息文件
const environmentalData = ref([])
// 环境信息抓取列表
const envCatchDataList = ref([])
const headers = { Authorization: localStorage.getItem("token"), }
// 分页参数
const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
})
// 环境分析任务总数
const total = ref(10)

// .csv文件上传前校验
const handleBeforeUpload = (file) => {
    const fileType = file?.name?.substring(file.name.lastIndexOf(".") + 1);
    const isCsv = fileType === "csv";
    if (!isCsv) {
        $modal.msgError(message.upload_csv);
        return false;
    }
    return isCsv;
}

// .csv文件上传
const submit = () => {
    if (environmentalData.value.length === 0) {
        ElMessage.warning(message.upload_warning)
        return
    }
    console.log(environmentalData.value[0].name)
    // 文件.csv校验
    if (environmentalData.value[0].name.split('.').pop() !== 'csv') {
        ElMessage.warning(message.upload_csv)
        return
    }
    const formData = new FormData()
    formData.append('file', environmentalData.value[0].raw)
    console.log(formData.get('file'))
    postData(formData).then(res => {
        console.log(res)
        if (res.code === 200) {
            ElMessage.success(message.uploadSuccess)
            environmentalData.value = []
            setTimeout(() => {
              getEnvironmentalData();
            }, 1000)
        } else {
            ElMessage.error(message.uploadFailure)
        }
    })
}
// 所有环境分析任务列表获取
const getEnvironmentalData = async () => {
    const res = await getData(queryParams.value);
    if (res.code === 200) {
        ElMessage.success(message.getSuccess)
        envCatchDataList.value = Array.from(res.data.list)
        total.value = res.data.total
    } else {
        ElMessage.error(message.getFailure)
    }
    console.log(envCatchDataList.value)
}
// 下载模版文件
const downloadTemplate = () => {
    downloadTemplateAPI().then(res =>{
        const isLogin = blobValidate(res);
        if(isLogin){
            const blob = new Blob([res])
            saveAs(blob,message.saveAs)
        }else{
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
// 下载csv文件
const exportCsv = (row) => {
    console.log(row)
    if (row.status != 2) {
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
    downloadResultCsv(row.id).then(res => {
        console.log(res)
        const isLogin = blobValidate(res);
        if (isLogin) {
            const blob = new Blob([res])
            saveAs(blob, `breed${row.id}.csv`)
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
// 下载输入文件
const exportFile = (row) => {
    downloadFile(row.id).then(res => {
        console.log(res)
        const isLogin = blobValidate(res);
        if (isLogin) {
            const blob = new Blob([res])
            saveAs(blob, `breed${row.id}.csv`)
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
// 删除任务
const handleDelete = async (row) => {
    ElMessageBox.confirm(message.del_message, message.warning, {
        confirmButtonText: message.confirm,
        cancelButtonText:message.cancel,
        type: 'warning'
    }).then(() => {
        deleteData(row.id).then(res => {
            if (res.code === 200) {
                ElMessage.success(message.delSuccess)
                getEnvironmentalData()
            } else {
                ElMessage.error(message.delFailure)
            }
        })
        console.log(message.confirm)
    }).catch(() => {
        console.log(message.cancel)
    })
}
onMounted(() => {
    getEnvironmentalData()
})
</script>

<style lang="less" scoped>
.upper {
    padding: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    color: white;

    .main-content {
        width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-image: url("../../../assets/images/environment.jpg");
        background-size: cover;
        border-radius: 10px;
        padding: 20px;

        .out-wrapper {
            height: 60vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .gbac{
                h1{
                    text-align: center;
                    font-size: 240%;
                }
                height: 80%;
                .btn{
                    margin-top: 10%;
                    display: flex;
                    justify-content: space-around;
                }
              .main-upload{
                display: flex;
                justify-content: center;
              }
            }
        }
    }
}

:deep(.el-upload__text) {
    color: white;
}

:deep(.el-upload-dragger) {
    border: 2px dashed white;
    background-color: rgba(59, 187, 187, 0.1);
}

:deep(.el-upload-list__item-name) {
    color: white;
}

:deep(.el-icon--document) {
    color: white;
}

:deep(.el-upload-list__item:hover) {
    background-color: rgba(195, 193, 193, 0.5);
}

.el-icon--upload {
    color: white;
}

.data-show {
    display: flex;
    justify-content: center;

    .inner-content {
        width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .title {
            width: 95%;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .main-data {
            width: 100%;

            .pagination {
                margin-top: 20px;
                position: relative;
            }
        }
    }
}
</style>

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

:deep(.el-table__cell) {
    .cell {
        word-break: break-word;
    }
}
</style>

<style lang="less" scoped>
/* 假设 el-checkbox 是表头中的一个子元素 */

:deep(.el-table .el-table__header-wrapper tr th) {
    background-color: var(--theme-color) !important;
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
    background-color: var(--theme-color) !important; //修改默认的背景色
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
    border-color: var(--theme-color) !important;
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
