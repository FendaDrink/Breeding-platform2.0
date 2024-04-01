<template>
  <div class="home" style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;">
    <el-config-provider :locale="locale">
    <el-button style="margin: 20px; margin-left: calc(95% - 30px)" @click="exportFile" type="warning" plain
      size="large">{{ $t('phenotype.file.button_export') }}</el-button>
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item :label="$t('phenotype.file.label_meterial')">
        <el-select v-model="searchForm.searchMaterialId" multiple filterable clearable
          :placeholder="$t('phenotype.file.placeholder_meterial')">
          <el-option v-for="(item, index) in materialoptions" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('phenotype.file.label_phenotype')">
        <el-select v-model="searchForm.searchTraitId" multiple filterable clearable
          :placeholder="$t('phenotype.file.placeholder_phenotype')">
          <el-option v-for="(item, index) in traitoptions" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="search-button" type="primary" @click="searchSubmit" icon="Search">{{
          $t('phenotype.file.button_search') }}</el-button>
        <el-button @click="reset" icon="refresh">{{ $t('phenotype.file.button_reset') }}</el-button>
      </el-form-item>
    </el-form>
    <el-container>
      <el-main>
        <div class="file_form">
          <!-- 表格部分 -->
          <el-table style="width: 95%; margin: auto" ref="multipleTable" v-loading="tableLoading" :data="tableData"
            tooltip-effect="dark" class="trait-form-table" stripe max-height="100vh - 280px">
            <el-table-column :label="$t('phenotype.file.label_operation')" align="center" class-name="small-padding fixed-width" width="120px" fixed="left">
              <template #default="scope">
                <el-tooltip :content="$t('phenotype.file.tooltip_update')" placement="top">
                  <el-button size="small" type="text" icon="Document" link @click="modifFile(scope.row)"
                    class="table_button">
                  </el-button></el-tooltip>
              </template>


            </el-table-column>

            <el-table-column v-for="column in tableColumns" :key="column.prop" :label="column.label" :prop="column.prop"
              :min-width="column.width" :fixed="column.fixed" align="center">
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

    <el-dialog :title="$t('phenotype.file.title_update')" v-model="dialogFormVisible" center draggable width="30%">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-container style="height: 500px">
          <el-form ref="dataTreeForm" :model="form" :rules="rules" label-position="left" label-width="110px"
            style="width: 100%">
            <el-form-item v-for="column in tableColumns" :label="column.label" :prop="column.prop" :key="column.prop">
              <el-input v-model="form[column.prop]" :value="form[column.prop]"
                :disabled="isUnmodifiableColumn(column.prop)" />
            </el-form-item>
          </el-form>
        </el-container>
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="success" plain @click.passive="updateFileData">
            {{ $t('phenotype.file.button_save') }}
          </el-button>
          <el-button type="info" plain @click="dialogFormVisible = false">{{ $t('phenotype.file.button_cancel')
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </el-config-provider>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, toRefs, computed} from "vue";
import { useRoute } from "vue-router";
import { onBeforeRouteLeave } from "vue-router";

import {
  listFile,
  searchBox,
  selectDetailByFileId,
  exportPenoFile,
  modifiFileData,
  endUpdate,
  traitAndMaterialList
} from "@/api/infomanage/phenotype";
import { I18nD } from "vue-i18n";

import zh from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import en from 'element-plus/lib/locale/lang/en' // 英文语言

import { useI18n } from 'vue-i18n'
const i18n = useI18n();
const locale = computed(() => ((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? zh : en));

const traitFileId = ref(60);

const searchForm = reactive({
  searchMaterialId: [],
  searchTraitId: [],
})

function searchSubmit() {
  if(!searchForm.searchMaterialId.length && !searchForm.searchTraitId.length){
    reset();
    return
  }
  searchBox({
    fileId: traitFileId.value,
    searchMaterialId: searchForm.searchMaterialId,
    searchTraitId: searchForm.searchTraitId,
  }).then((res) => {
    // console.log(res.rows[0].traits[0].trait_id_0.traitValue, "123");
    totalPage.value = res.total;
    updateTableData(mapTraitsToTableData(res.rows)); // 确保传递正确的数据
    tableColumns.value = [
      { prop: "speciesName", label: i18n.t('phenotype.file.table_speciesName'), width: "80px", fixed: "left" },
      { prop: "populationName", label: i18n.t('phenotype.file.table_populationName'), width: "140px", fixed: "left", },
      { prop: "location", label: i18n.t('phenotype.file.table_location'), width: "80px", fixed: "left" },
      { prop: "repeat", label: i18n.t('phenotype.file.table_repeat'), width: "120px" },
      { prop: "kindId", label: i18n.t('phenotype.file.table_kindId'), width: "120px" },
      { prop: "kindName", label: i18n.t('phenotype.file.table_kindName'), width: "200px" },
      { prop: "materialId", label: i18n.t('phenotype.file.table_materialId'), width: "120px" },
      { prop: "fieldId", label: i18n.t('phenotype.file.table_fieldId'), width: "120px" },
      { prop: "controlType", label: i18n.t('phenotype.file.table_controlType'), width: "120px" },
      { prop: "father", label: i18n.t('phenotype.file.table_father'), width: "100px" },
      { prop: "mother", label: i18n.t('phenotype.file.table_mother'), width: "100px" },
      { prop: "remark", label: i18n.t('phenotype.file.table_remark'), width: "380px" },

    ];
    // 更新tableData
    for (let j = 0; j < res.rows.length; j++) {
      traitRes[j] = new Map();

      for (let i = 0; i < res.rows[j].traits.length; i++) {
        let propertyName = `trait_id_${i}`;
        let traitIdValue = res.rows[j].traits[i][propertyName];
        if (traitIdValue) {
          let traitValue = traitIdValue.traitValue;
          traitRes[j].set(propertyName, traitValue);
        }

        tableData[j][propertyName] = traitRes[j].get(propertyName);
      }
    }
    console.log("1");
    // 更新tableColumns

    for (let i = 0; i < res.rows[0].traits.length; i++) {
      let propertyName = `trait_id_${i}`;
      tableColumns.value.push({
        prop: `trait_id_${i}`,
        label: res.rows[0].traits[i][propertyName].traitName,
        width: '100px'
      });
    }
    console.log(tableColumns.value, "ioio");

    tableLoading.value = false;
  })
    .catch((err) => {
      tableLoading.value = false;
      console.error(err);
    });
}

//重置
function reset() {
  searchForm.searchMaterialId = [];
  searchForm.searchTraitId = [];
  chooseForm();
  tableName.value = route.query.tableName;
  traitAndMaterialList(tableName.value).then((res) => {
    traitoptions.value = res.data.trait;
    materialoptions.value = res.data.material;
  }).catch((err) => {
    $modal.msgError(res.msg);
  })
}


const traitoptions = ref([]);
const materialoptions = ref([]);





// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

const dialogFormVisible = ref(false); // 表单可见
const formKeys = [
  "tableName",
  "fileId",
  "phenotypeId",
  "father",
  "mother",
  "location",
  "fieldId",
  "controlType",
  "kindId",
  "kindName",
  "populationId",
  "speciesName",
  "populationName",
  "remark",
  "materialId",
];

const form = reactive({});

formKeys.forEach((key) => {
  form[key] = "";
});

// 添加 trait_id_n 属性
for (let i = 0; i <= 39; i++) {
  form[`trait_id_${i}`] = "";
}

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
    traitFileId.value = route.query.id;
    // 创建查询参数对象
    const queryParams = reactive({
      pageNum: pageNumber,
      pageSize: pageSize,
    });
    selectDetailByFileId({
      fileId: traitFileId.value,
      pageSize: queryParams.pageSize,
      pageNum: queryParams.pageNum,
    })
      .then((res) => {
        console.log(res, "9090");
        let i = ref(0);

        totalPage.value = res.total;
        tableColumns.value = [
          { prop: "speciesName", label: i18n.t('phenotype.file.table_speciesName'), width: "80px", fixed: "left" },
          { prop: "populationName", label: i18n.t('phenotype.file.table_populationName'), width: "140px", fixed: "left", },
          { prop: "location", label: i18n.t('phenotype.file.table_location'), width: "80px", fixed: "left" },
          { prop: "repeat", label: i18n.t('phenotype.file.table_repeat'), width: "120px" },
          { prop: "kindId", label: i18n.t('phenotype.file.table_kindId'), width: "120px" },
          { prop: "kindName", label: i18n.t('phenotype.file.table_kindName'), width: "200px" },
          { prop: "materialId", label: i18n.t('phenotype.file.table_materialId'), width: "120px" },
          { prop: "fieldId", label: i18n.t('phenotype.file.table_fieldId'), width: "120px" },
          { prop: "controlType", label: i18n.t('phenotype.file.table_controlType'), width: "120px" },
          { prop: "father", label: i18n.t('phenotype.file.table_father'), width: "100px" },
          { prop: "mother", label: i18n.t('phenotype.file.table_mother'), width: "100px" },
          { prop: "remark", label: i18n.t('phenotype.file.table_remark'), width: "380px" },
        ];

        selectDetailByFileId({
          fileId: traitFileId.value,
          pageSize: queryParams.pageSize,
          pageNum: queryParams.pageNum,
        })
          .then((res) => {
            console.log(res.rows[0].traits[0].trait_id_0.traitValue, "123");
            totalPage.value = res.total;
            updateTableData(mapTraitsToTableData(res.rows)); // 确保传递正确的数据

            // 更新tableData
            for (let j = 0; j < res.rows.length; j++) {
              traitRes[j] = new Map();

              for (let i = 0; i < res.rows[j].traits.length; i++) {
                let propertyName = `trait_id_${i}`;
                let traitIdValue = res.rows[j].traits[i][propertyName];
                if (traitIdValue) {
                  let traitValue = traitIdValue.traitValue;
                  traitRes[j].set(propertyName, traitValue);
                }

                tableData[j][propertyName] = traitRes[j].get(propertyName);

              }
            }

            // 更新tableColumns
            for (let i = 0; i < res.rows[0].traits.length; i++) {
              let propertyName = `trait_id_${i}`;
              tableColumns.value.push({
                prop: `trait_id_${i}`,
                label: res.rows[0].traits[i][propertyName].traitName,
                width: '100px'
              });
            }

            tableLoading.value = false;
          })
          .catch((err) => {
            tableLoading.value = false;
            console.error(err);
          });
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
  "tableName",
  "fileId",
  "phenotypeId",
  "location",
  "speciesName",
  "populationName",
];

// 计算属性，检查列是否为不可修改
const isUnmodifiableColumn = (columnProp) => {
  return unmodifiableColumns.includes(columnProp);
};

//导出
function exportFile() {
  tableName.value = route.query.tableName;
  console.log(tableName.value);
  exportPenoFile(tableName.value)
    .then((res) => {
      console.log(res);
      $modal.msgSuccess(i18n.t('phenotype.file.export_success'));
      $download.resource(res.data);
    })
    .catch((err) => {
      console.error(err);
      $modal.msgError(i18n.t('phenotype.file.export_fail'));
    });
}

const fileList = [];



//获取第一个表格
const columns = ref([]); // 表头数据
const tableData = reactive([]); //表格数据

//用于更新tableData的函数
function updateTableData(data) {
  tableData.splice(0, tableData.length, ...data);
}

const tableColumns = ref([]);
const traitRes = reactive([]);
const columnsValue = [];

//请求性状信息
function chooseForm() {
  tableLoading.value = true;
  traitFileId.value = route.query.id;
  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
  });
  queryParams.pageNum = currentpageNum.value;
  queryParams.pageSize = pageSize.value;
  selectDetailByFileId({
    fileId: traitFileId.value,
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum,
  })
    .then((res) => {
      console.log(res, "9090");
      let i = ref(0);

      totalPage.value = res.total;
      tableColumns.value = [

        { prop: "speciesName", label: i18n.t('phenotype.file.table_speciesName'), width: "80px", fixed: "left" },
        { prop: "populationName", label: i18n.t('phenotype.file.table_populationName'), width: "140px", fixed: "left", },
        { prop: "location", label: i18n.t('phenotype.file.table_location'), width: "80px", fixed: "left" },
        { prop: "repeat", label: i18n.t('phenotype.file.table_repeat'), width: "120px" },
        { prop: "kindId", label: i18n.t('phenotype.file.table_kindId'), width: "120px" },
        { prop: "kindName", label: i18n.t('phenotype.file.table_kindName'), width: "200px" },
        { prop: "materialId", label: i18n.t('phenotype.file.table_materialId'), width: "120px" },
        { prop: "fieldId", label: i18n.t('phenotype.file.table_fieldId'), width: "120px" },
        { prop: "controlType", label: i18n.t('phenotype.file.table_controlType'), width: "120px" },
        { prop: "father", label: i18n.t('phenotype.file.table_father'), width: "100px" },
        { prop: "mother", label: i18n.t('phenotype.file.table_mother'), width: "100px" },
        { prop: "remark", label: i18n.t('phenotype.file.table_remark'), width: "380px" },

      ];

      selectDetailByFileId({
        fileId: traitFileId.value,
        pageSize: queryParams.pageSize,
        pageNum: queryParams.pageNum,
      })
        .then((res) => {
          console.log(res.rows[0].traits[0].trait_id_0.traitValue, "123");
          totalPage.value = res.total;
          updateTableData(mapTraitsToTableData(res.rows)); // 确保传递正确的数据

          // 更新tableData
          for (let j = 0; j < res.rows.length; j++) {
            traitRes[j] = new Map();

            for (let i = 0; i < res.rows[j].traits.length; i++) {
              let propertyName = `trait_id_${i}`;
              let traitIdValue = res.rows[j].traits[i][propertyName];
              if (traitIdValue) {
                let traitValue = traitIdValue.traitValue;
                traitRes[j].set(propertyName, traitValue);
              }

              tableData[j][propertyName] = traitRes[j].get(propertyName);
            }
          }
          console.log("1");
          // 更新tableColumns
          for (let i = 0; i < res.rows[0].traits.length; i++) {
            let propertyName = `trait_id_${i}`;
            tableColumns.value.push({
              prop: `trait_id_${i}`,
              label: res.rows[0].traits[i][propertyName].traitName,
              width: '100px'
            });
          }
          console.log(tableColumns.value, "ioio");

          tableLoading.value = false;
        })
        .catch((err) => {
          tableLoading.value = false;
          console.error(err);
        });
    })
    .catch((err) => {
      tableLoading.value = false;
      console.error(err);
    });
}

// 将性状数据映射到表格格式的函数
function mapTraitsToTableData(data) {
  return data.map((entry) => {
    const traits = {};
    entry.traits.forEach((trait) => {
      traits[`trait_id_${trait.traitId}`] = trait;
    });
    return { ...entry, traits };
  });
}

const selectedRow = ref(null);

function modifFile(row) {
  dialogFormVisible.value = true;

  const keys = [
    "tableName",
    "fileId",
    "phenotypeId",
    "repeat",
    "father",
    "mother",
    "controlType",
    "location",
    "kindId",
    "fieldId",
    "kindName",
    "populationId",
    "speciesName",
    "populationName",
    "remark",
    "materialId",
  ];

  keys.forEach((key) => {
    form[key] = row[key];
  });

  for (let i = 0; i <= 39; i++) {
    form[`trait_id_${i}`] = row[`trait_id_${i}`];
  }
}
function updateFileData() {
  const baseParams = {
    fileId: form.fileId,
    tableName: form.tableName,
    phenotypeId: form.phenotypeId,
    father: form.father,
    mother: form.mother,
    repeat: form.repeat,
    location: form.location,
    kindId: form.kindId,
    kindName: form.kindName,
    populationId: form.populationId,
    speciesName: form.speciesName,
    populationName: form.populationName,
    remark: form.remark,
    materialId: form.materialId,
  };

  let traitParams = {};
  for (let i = 0; i <= 39; i++) {
    traitParams[`trait_id_${i}`] = form[`trait_id_${i}`];
  }

  const params = { ...baseParams, ...traitParams };

  modifiFileData(params)
    .then((res) => {
      console.log(res);
      $modal.msgSuccess(i18n.t('phenotype.file.message_updateSuccess'));
      dialogFormVisible.value = false;
      chooseForm();
    })
    .catch((err) => {
      console.error(err);
      $modal.msgError(i18n.t('phenotype.file.message_updateFail'));
      dialogFormVisible.value = false;
    });
}

onMounted(() => {
  chooseForm();
  tableName.value = route.query.tableName;
  traitAndMaterialList(tableName.value).then((res) => {
    traitoptions.value = res.data.trait;
    materialoptions.value = res.data.material;
  }).catch((err) => {
    $modal.msgError(res.msg);
  })
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

<style scoped lang="less"> .search-form {
   margin-left: 50px;
 }
</style>
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

el-main {
  height: 100px;
  overflow: auto;
}
</style>

<style lang="less" scoped>
.footer {
  position: absolute;
  left: 2.5%;
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

.el-button--warning.is-plain {
  --el-button-text-color: #e6a23c;
  --el-button-bg-color: #fdf6ec;
  --el-button-border-color: #f3d19e;
  --el-button-hover-text-color: #ffffff;
  --el-button-hover-bg-color: #e6a23c;
  --el-button-hover-border-color: #e6a23c;
  --el-button-active-text-color: #ffffff;
}
</style>

<style>
:root {
  --el-color-primary: #1FB864;
}
</style>