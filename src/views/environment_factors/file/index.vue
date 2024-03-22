<template>
  <div style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;">
      <el-button style="margin: 20px; margin-left: calc(95% - 30px)" @click="exportFile" type="warning" size="large"
          plain>导出</el-button>
      <el-container>
          <el-main>
              <div class="file_form">
                  <!-- 表格部分 -->
                  <el-table style="width: 95%; margin: auto" ref="multipleTable" v-loading="tableLoading"
                      :data="tableData" tooltip-effect="dark" class="factor-form-table" stripe max-height="100vh - 220px">
                      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="auto"
                          fixed="left">
                          <template #default="scope">
                              <el-button size="small" type="text" icon="Document" link @click="modifFile(scope.row)"
                                  class="table_button">修改
                              </el-button>
                          </template>
                      </el-table-column>

                      <el-table-column v-for="column in tableColumns" :key="column.prop" :label="column.label"
                          :prop="column.prop" :min-width="column.width" :fixed="column.fixed" align="center">
                          <template #default="scope">
                              {{ formatTableCell(scope.row[column.prop]) }}
                          </template>
                      </el-table-column>
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
                  <el-form ref="dataTreeForm" :model="form" :rules="rules" label-position="left" label-width="110px"
                      style="width: 100%">
                      <el-form-item v-for="column in tableColumns" :label="column.label" :prop="column.prop"
                          :key="column.prop">
                          <el-input v-model="form[column.prop]" :value="form[column.prop]"
                              :disabled="isUnmodifiableColumn(column.prop)" />
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
import {ref, reactive, onMounted, getCurrentInstance} from "vue";
import { useRoute } from "vue-router";
import { onBeforeRouteLeave } from "vue-router";

import {
  getEnvDetailByFileId,
  exportEnvFile,
  modifiFileData,
  endUpdate,
} from "@/api/environment_factors/environment_factors";
// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

const dialogFormVisible = ref(false); // 表单可见
const formKeys = [
  "fileId",
  "environmentId",
  "remark",
];

const form = reactive({});

formKeys.forEach((key) => {
  form[key] = "";
});

// 添加 factor_id_n 属性
for (let i = 0; i <= 39; i++) {
  form[`factor_id_${i}`] = "";
}

const rules = reactive({
  key: [{ required: true, message: "Please input key name", trigger: "blur" }],
  value: [{ required: true, message: "Please input value", trigger: "blur" }],
});

const route = useRoute();
console.log(route);
const total = ref(2);

const factorsArray = reactive([]); // 使用后端提供的性状数据填充这个数组
//分页
const pageSize = ref(20);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

const tableLoading = ref(false);

function formatTableCell(value) {
  return value || '-'; // 如果值为空，返回'-'
}

function fetchData() {
  try {
    tableLoading.value = true;
    environmentFileId.value = route.query.id;
    // 创建查询参数对象
    const queryParams = reactive({
      pageNum: currentpageNum.value,
      pageSize: pageSize.value,
    });

    tableColumns.value = [
      {prop: "environmentId", label: "环境id", width: "80px", fixed: "left",},
      {prop: "remark", label: "备注", width: "80px"},
    ];

    getEnvDetailByFileId({
      fileId: environmentFileId.value,
      pageSize: queryParams.pageSize,
      pageNum: queryParams.pageNum,
    })
        .then((res) => {
          console.log(res.rows[0].factors[0].factor_id_0.factorValue, "123");
          totalPage.value = res.total;
          updateTableData(mapFactorsToTableData(res.rows)); // 确保传递正确的数据

          // 更新tableData
          for (let j = 0; j < res.rows.length; j++) {
            factorRes[j] = new Map();

            for (let i = 0; i < res.rows[j].factors.length; i++) {
              let propertyName = `factor_id_${i}`;
              let factorIdValue = res.rows[j].factors[i][propertyName];
              if (factorIdValue) {
                let factorValue = factorIdValue.factorValue;
                factorRes[j].set(propertyName, factorValue);
              }

              tableData[j][propertyName] = factorRes[j].get(propertyName);

            }
          }

          // 更新tableColumns
          for (let i = 0; i < res.rows[0].factors.length; i++) {
            let propertyName = `factor_id_${i}`;
            tableColumns.value.push({
              prop: `factor_id_${i}`,
              label: res.rows[0].factors[i][propertyName].factorName,
              width: '100px'
            });
          }

          tableLoading.value = false;
        })
        .catch((err) => {
          tableLoading.value = false;
          console.error(err);
        });
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

const unmodifiableColumns = [
  "fileId",
  "environmentId"
]

// 计算属性，检查列是否为不可修改
const isUnmodifiableColumn = (columnProp) => {
  return unmodifiableColumns.includes(columnProp);
};

//导出
function exportFile() {
  tableName.value = route.query.tableName;
  console.log(tableName.value);
  exportEnvFile(tableName.value)
      .then((res) => {
          console.log(res);
          $modal.msgSuccess(res.msg);
          $download.resource(res.data);
      })
      .catch((err) => {
          console.error(err);
          $modal.msgError(res.msg);
      });
}

const fileList = [];

const environmentFileId = ref(route.query.id);

//获取第一个表格
const columns = ref([]); // 表头数据
const tableData = reactive([]); //表格数据

//用于更新tableData的函数
function updateTableData(data) {
  tableData.splice(0, tableData.length, ...data);
}

const tableColumns = ref([]);
const factorRes = reactive([]);

// 将性状数据映射到表格格式的函数
function mapFactorsToTableData(data) {
  return data.map((entry) => {
      const factors = {};
      entry.factors.forEach((factor) => {
          factors[`factor_id_${factor.factorId}`] = factor;
      });
      return { ...entry, factors };
  });
}

const selectedRow = ref(null);

function modifFile(row) {
  dialogFormVisible.value = true;

  const keys = [
      "fileId",
      "environmentId",
      "remark",
  ];

  keys.forEach((key) => {
      form[key] = row[key];
  });

  for (let i = 0; i <= 39; i++) {
      form[`factor_id_${i}`] = row[`factor_id_${i}`];
  }
}
function updateFileData() {
  const baseParams = {
      fileId: form.fileId,
      environmentId:form.environmentId,
      remark: form.remark,
  };

  let factorParams = {};
  for (let i = 0; i <= 39; i++) {
      factorParams[`factor_id_${i}`] = form[`factor_id_${i}`];
  }

  const params = { ...baseParams, ...factorParams };
  
  modifiFileData(params)
      .then((res) => {
          console.log(res);
          $modal.msgSuccess(res.msg);
          dialogFormVisible.value = false;
          fetchData();
      })
      .catch((err) => {
          console.error(err);
          $modal.msgError(err.msg);
          dialogFormVisible.value = false;
      });
}

onMounted(() => {
    fetchData();
});

onBeforeRouteLeave(() => {
  endUpdate(form.tableName)
      .then((res) => {
          console.log(res);
      })
      .catch((err) => {
          console.log(err);
      });
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
  background-color: #0F5C32;

  span {
      color: white;
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


