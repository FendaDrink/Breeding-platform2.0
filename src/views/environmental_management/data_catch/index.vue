<template>
    <div class="upper">
        <div class="main-content">
            <h1>环境信息抓取模块<i>&nbsp;</i></h1>
            <div class="out-wrapper">
                <div class="col-xs-24 col-sm-6">
                    <div class="gbac" style="height: 230px;">
                        <div style="display: flex;align-items: center;justify-content: center; gap:80px">
                            <div style="width: 100%;">
                                <label for="inputHelpBlock">上传环境信息文件</label>
                                <el-upload class="upload-demo" v-model:file-list="environmentalData" accept=".xlsx"
                                    action="#" :headers="headers" method="post" :auto-upload="false" multiple :limit="1"
                                    drag>
                                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                    <div class="el-upload__text">
                                        点击上传/拖拽文件
                                    </div>
                                </el-upload>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="text-align: center;">
                    <el-button type="success" @click="submit" plain
                        style="width: 110px; margin-top: 6px;">提交</el-button>
                    <!-- <el-button type="success" plain style="width: 110px; margin-top: 6px;"
                        @click="exportGeno('C:\\Users\\Administrator\\Desktop\\sdxx\\xm_2_1\\6210\\vcf_template.vcf')">下载vcf模板</el-button> -->
                </div>
            </div>
        </div>
    </div>
    <div class="data-show">
        <div class="inner-content">
            <div class="title"><el-icon><MessageBox /></el-icon>&nbsp;任务信息展示</div>
            <div class="main-data">
                <el-table v-loading="loading" trigger :data="envCatchDataList">           
                    <el-table-column align="center" label="序号" type="index" width="80"></el-table-column>
                    <el-table-column label="任务编号" prop="id" align="center" width="180" />
                    <el-table-column align="center" prop="createBy" label="创建人" />
                    <el-table-column align="center" prop="createTime" label="创建时间" /> 
                    <el-table-column align="center" label="任务状态" width="150">
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
                    <el-table-column align="center" fixed="right" label="结果下载">
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
                    <!-- <el-table-column align="center" fixed="right" label="提示信息">
                        <template #default="scope">
                            <el-popover placement="top" title="Info" trigger="hover"
                                :content="getPopoverContent(scope.row.info)">
                                <template #reference>
                                    <el-button link type="text" style="color: #1FB864;">查看提示信息</el-button>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column> -->
                    <el-table-column align="center" fixed="right" label="操作">
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
                <el-pagination class="pagination" v-show="queryParams.total > 0" :total="queryParams.total" :page-sizes="[3, 10, 20, 30, 50]"
								v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
								background right layout=" ->, total, sizes,prev, pager, next, jumper" @size-change="getEnvironmentalData"
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
import { postData, getData,deleteData,downloadPdf } from '../../../api/environmental_management/data_catch';

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
const total = ref(0)

// .xlsx文件上传
const submit = () => {
    const formData = new FormData()
    formData.append('file', environmentalData.value[0].raw)
    console.log(formData.get('file'))
    postData(formData).then(res => {
        console.log(res)
        if (res.code === 200) {
            ElMessage.success('提交成功')
            environmentalData.value = []
            setTimeout(() => {
                router.go(0)
            }, 1000)
        } else {
            ElMessage.error('提交失败')
        }
    })
}
// 所有环境分析任务列表获取
const getEnvironmentalData = async () => {
    const res = await getData(queryParams.value);
    if (res.code === 200) {
        envCatchDataList.value = Array.from(res.data)
        total.value = res.total
    } else {
        ElMessage.error('获取数据失败')
    }
    console.log(envCatchDataList.value)
}
// 下载pdf文件
const exportPdf =(row) => {
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
	downloadPdf(row.id).then(res => {
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
// 删除任务
const handleDelete = async (row) => {
    ElMessageBox.confirm('确定删除该任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteData(row.id).then(res => {
            if (res.code === 200) {
                ElMessage.success('删除成功')
                getEnvironmentalData()
            } else {
                ElMessage.error('删除失败')
            }
        })
        console.log('确定')
    }).catch(() => {
        console.log('取消')
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
        .title{
            width: 95%;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        .main-data{
            width: 100%;
            .pagination{
                margin-top: 20px;
                position: relative;
            }
        }
    }
}
</style>
