<template>
  <div style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;">
    <el-button style="margin: 20px; margin-left: calc(95% - 30px)" @click="exportFile" type="warning" size="large"
               plain>导出</el-button>
    <el-container>
      <el-main>
        <div class="file_form">
          <!-- 表格部分 -->
          <el-table style="width: 95%; margin: auto" ref="multipleTable" v-loading="tableLoading"
                    :data="tableData" tooltip-effect="dark" class="trait-form-table" stripe max-height="100vh - 220px">
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="auto"
                             fixed="left">
              <template #default="scope">
                <el-button size="small" type="text" icon="Document" link @click="modifFile(scope.row)"
                           class="table_button">修改
                </el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column v-for="column in tableColumns" :key="column.prop" :label="column.label"
                            :prop="column.prop" :min-width="column.width" :fixed="column.fixed" align="center">
                            <template #default="scope">
                                {{ formatTableCell(scope.row[column.prop]) }}
                            </template>
                        </el-table-column> -->
            <el-table-column prop="environment_id" label="环境id" align="center" width="100px"></el-table-column>
            <el-table-column prop="date" label="日期" align="center" width="100px"></el-table-column>
            <el-table-column prop="area" label="地区" align="center" width="100px"></el-table-column>
            <el-table-column prop="factor_id" label="环境因子id" align="center" width="150px"></el-table-column>
            <el-table-column prop="factorAbbreviationName" label="环境因子缩写" align="center"
                             width="150px"></el-table-column>
            <el-table-column prop="factorFullName" label="环境因子全称" align="center"
                             width="150px"></el-table-column>
            <el-table-column prop="factorName" label="环境因子名称" align="center" width="150px"></el-table-column>
            <el-table-column prop="factorValue" label="环境因子数值" align="center" width="150px"></el-table-column>
            <el-table-column prop="createBy" label="创建者" align="center" width="100px"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" width="100px"></el-table-column>
            <el-table-column prop="updateBy" label="更新者" align="center" width="100px"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" align="center" width="100px"></el-table-column>
            <el-table-column prop="remark" label="备注" align="center" width="200px"></el-table-column>
          </el-table>
        </div>
      </el-main>

      <el-footer class="footer">
        <div class="demo-pagination-block">
          <el-pagination background :total="totalPage" :current-page="currentpageNum" :page-size="pageSize"
                         :page-sizes="[20, 30, 40, 50]" layout="total, sizes, prev, pager, next, jumper"
                         @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-footer>
    </el-container>

    <el-dialog title="修改文件详情" v-model="dialogFormVisible" center draggable width="30%">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-container style="height: 500px">
          <el-form ref="dataTreeForm" :model="dataForm" :rules="rules" label-position="left" label-width="110px"
                   style="width: 100%">
            <!-- <el-form-item v-for="column in tableColumns" :label="column.label" :prop="column.prop"
              :key="column.prop">
              <el-input v-model="form[column.prop]" :value="form[column.prop]"
                :disabled="isUnmodifiableColumn(column.prop)" />
            </el-form-item> -->

            <el-form-item prop="environment_id" label="环境id">
              <el-input v-model="dataForm.environment_id" placeholder="输入环境id" disabled />
            </el-form-item>
            <el-form-item prop="date" label="日期">
              <el-input v-model="dataForm.date" placeholder="输入日期" disabled />
            </el-form-item>
            <el-form-item prop="area" label="地区">
              <el-input v-model="dataForm.area" placeholder="输入地区" />
            </el-form-item>
            <el-form-item prop="factor_id" label="环境因子id">
              <el-input v-model="dataForm.factor_id" placeholder="环境因子id" disabled />
            </el-form-item>
            <el-form-item prop="factorAbbreviationName" label="环境因子缩写">
              <el-input v-model="dataForm.factorAbbreviationName" placeholder="输入环境因子缩写" />
            </el-form-item>
            <el-form-item prop="factorFullName" label="环境因子全称">
              <el-input v-model="dataForm.factorFullName" placeholder="输入环境因子全称" />
            </el-form-item>
            <el-form-item prop="factorName" label="环境因子名称">
              <el-input v-model="dataForm.factorName" placeholder="输入环境因子名称" />
            </el-form-item>
            <el-form-item prop="factorValue" label="环境因子数值">
              <el-input v-model="dataForm.factorValue" placeholder="输入环境因子数值" />
            </el-form-item>
            <el-form-item prop="createBy" label="创建者">
              <el-input v-model="dataForm.createBy" placeholder="输入创建者" />
            </el-form-item>
            <el-form-item prop="createTime" label="创建时间">
              <el-input v-model="dataForm.createTime" placeholder="输入创建时间" />
            </el-form-item>
            <el-form-item prop="updateBy" label="更新者">
              <el-input v-model="dataForm.updateBy" placeholder="输入更新者" />
            </el-form-item>
            <el-form-item prop="updateTime" label="更新时间">
              <el-input v-model="dataForm.updateTime" placeholder="输入更新时间" />
            </el-form-item>
            <el-form-item prop="remark" label="备注">
              <el-input v-model="dataForm.remark" placeholder="输入备注" />
            </el-form-item>
          </el-form>
        </el-container>
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="success" @click.passive="updateFileData" plain>
            保存
          </el-button>
          <el-button @click="dialogFormVisible = false" type="info" plain>取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs } from "vue";
import { useRoute } from "vue-router";
import { getTree } from "@/api/tree";
import { onBeforeRouteLeave } from "vue-router";

import {
  listFile,
  selectDetailByFileId,
  exportPenoFile,
  modifiFileData,
  endUpdate,
} from "@/api/infomanage/phenotype";



import { getEnvDetailByFileId, exportEnvFile, updateEnvironmentData } from "@/api/environment_factors/environment_factors"
// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

const dialogFormVisible = ref(false); // 表单可见

// 表单参数
let dataForm = reactive({
  environment_id: "",
  date: "",
  area: "",
  factor_id: "",
  factorAbbreviationName: "",
  factorFullName: "",
  factorValue: "",
  createBy: "",
  createTime: "",
  updateBy: "",
  updateTime: "",
  remark: "",
  factorName: ""
});

const rules = reactive({
  key: [{ required: true, message: "Please input key name", trigger: "blur" }],
  value: [{ required: true, message: "Please input value", trigger: "blur" }],
});

const route = useRoute();
const total = ref(2);

const traitsArray = reactive([]); // 使用后端提供的性状数据填充这个数组
//分页
const pageSize = ref(20);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

const tableLoading = ref(false);

function formatTableCell(value) {
  return value || '-'; // 如果值为空，返回'-'
}

async function fetchData(pageNumber, pageSize) {
  try {
    tableLoading.value = true;
    //   environmentFileId.value = route.query.id;
    environmentFileId.value = 37;
    // 创建查询参数对象
    const queryParams = reactive({
      pageNum: pageNumber,
      pageSize: pageSize,
    });
    // console.log(environmentFileId.value);
    getEnvDetailByFileId({
      fileId: environmentFileId.value,
      pageSize: queryParams.pageSize,
      pageNum: queryParams.pageNum,
    })
        .then((res) => {
          console.log(res, "9090");
          let i = ref(0);
          totalPage.value = res.total;
          res.rows.forEach((row, index) => {
            // console.log(row);

            row.factors.forEach((factor, index) => {
              // console.log(`factor_id_${index}`);
              // console.log(factor['factor_id_'+index].factorId);
              // console.log(factor[0]);
              tableData.push({
                environment_id: row.environmentId || '-',
                date: row.date || '-',
                area: row.area || '-',
                factor_id: (factor && factor['factor_id_' + index].factorId) || '-',
                factorAbbreviationName: (factor && factor['factor_id_' + index].factorAbbreviationName) || '-',
                factorFullName: (factor && factor['factor_id_' + index].factorFullName) || '-',
                factorName: (factor && factor['factor_id_' + index].factorName) || '-',
                factorValue: (factor && factor['factor_id_' + index].factorValue) || '-',
                createBy: row.createBy || '-',
                createTime: row.createTime || '-',
                updateBy: row.updateBy || '-',
                updateTime: row.updateTime || '-',
                remark: (factor && factor['factor_id_' + index].remark) || '-',
              })

            })
          })
          // console.log(tableData);
          tableLoading.value = false;
        })
  } catch (error) {
    tableLoading.value = false;
    console.error("获取数据时出错：", error);
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchData(currentpageNum.value, val);

};

const handleCurrentChange = (val) => {
  currentpageNum.value = val;
  localStorage.setItem("currentPageNum", val);
  fetchData(val, pageSize.value);
};
const tableName = ref("");

//导出
function exportFile() {
  // tableName.value = route.query.tableName;
  tableName.value = 'environment_开发测试_952272';
  // console.log(tableName.value);
  exportEnvFile(tableName.value)
      .then((res) => {
        // console.log(res);
        $modal.msgSuccess(res.msg);
        $download.resource(res.data);
      })
      .catch((err) => {
        console.error(err);
        $modal.msgError(res.msg);
      });
}

const fileList = [];

const environmentFileId = ref(60);

//获取第一个表格
const columns = ref([]); // 表头数据
const tableData = reactive([]); //表格数据

const tableColumns = ref([]);




function modifFile(row) {
  const keys = [
    "environment_id",
    "date",
    "area",
    "factor_id",
    "factorAbbreviationName",
    "factorFullName",
    "factorValue",
    "createBy",
    "createTime",
    "updateBy",
    "updateTime",
    "remark",
    "factorName"
  ]
  keys.forEach((key) => {
    dataForm[key] = row[key];
  });
  dialogFormVisible.value = true;
  console.log(row);
}

function updateFileData() {
  const baseParams = {
    environment_id: dataForm.environment_id,
    date: dataForm.date,
    area: dataForm.area,
    factor_id: dataForm.factor_id,
    factorAbbreviationName: dataForm.factorAbbreviationName,
    factorFullName: dataForm.factorFullName,
    factorValue: dataForm.factorValue,
    createBy: dataForm.createBy,
    createTime: dataForm.createTime,
    updateBy: dataForm.updateBy,
    updateTime: dataForm.updateTime,
    remark: dataForm.remark,
    factorName: dataForm.factorName
  };

  const params = { ...baseParams };

  updateEnvironmentData(37, 3, params)
      .then((res) => {
        console.log(res);
        $modal.msgSuccess(res.msg);
        dialogFormVisible.value = false;
        fetchData(1, pageSize);
      })
      .catch((err) => {
        console.error(err);
        $modal.msgError(res.msg);
        dialogFormVisible.value = false;
      });
}
onMounted(() => {
  fetchData(1, pageSize);
});

onBeforeRouteLeave(() => {
});
</script>

<style lang="less" scoped>
.footer {
  position: absolute;
  left: 2.5%;
  bottom: 0;
  padding: 0%;

  .demo-pagination-block {
    width: 100%;
    margin-top: 10px;
    display: flex;

  }

}

:deep(.el-main, .el-footer) {
  padding: 0%;
}

:deep(.el-input__inner) {
  margin-right: 30px;
}

.scrollbar-wrapper {
  height: 400px;
  /* 设置容器的高度 */
  overflow-y: auto;
  /* 启用纵向滚动条 */
}

:deep(.el-dialog__header) {
  margin: 0%;
  background-color: var(--theme-color);

  span {
    color: white;
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

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload .el-upload-dragger) {
  width: 100%;
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

// .el-select-dropdown__item.selected {
//   color: var(--theme-color);
// }

// .el-input {
//   --el-input-focus-border-color: var(--theme-color);
// }

// .el-select {
//   --el-select-input-focus-border-color: var(--theme-color);
// }

/* 开关组件 */
// :deep(.el-switch.is-checked .el-switch__core) {
//   border-color: var(--theme-color);
//   background-color: var(--theme-color);
// }

/* 多选组件 */
// :deep(.el-checkbox) {
//   --el-checkbox-checked-input-border-color: var(--theme-color);
//   --el-checkbox-checked-bg-color: var(--theme-color);
//   --el-checkbox-input-border-color-hover: var(--theme-color);
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
  --el-color-primary: var(--theme-color);
}
</style>


