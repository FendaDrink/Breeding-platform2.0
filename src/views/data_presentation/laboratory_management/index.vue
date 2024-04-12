<template>
  <div style="width: 100%;min-height: calc(100vh - 84px);background-color: #eeeeee;">
    <el-config-provider :locale="locale">
    <el-container style="padding: 20px; border: 1px solid #eee; height: calc(100vh - 100px)"
      :element-loading-text="$t('loadingText')" element-loading-background="rgba(0, 0, 0, 0.8)">
      <!--树-->
      <el-aside width="20%" class="mokuai card shadow element-plus-tree"
        style="min-height: calc(100vh - 180px);margin-top: 10px;border-radius: 8px;padding: 0%;margin-top: 0%;">
        <el-tree ref="tree" :data="routesData" :props="defaultProps" node-key="treeId" default-expand-all
          highlight-current :current-node-key="1" :default-current-node-key="firstLeafNodeKey" @node-click="rowClick"
          class="permission-tree" :check-strictly="true" :check-on-click-node="true" :expand-on-click-node="false" />
      </el-aside>
      <!-- //右边的盒子 -->
      <el-main width="78%" style="padding: 0" class="right-box">
        <el-card class="card-container" v-show="fileChooseShow">
          <template #header>
            <div class="card-header">
              <h1><span>{{$t('phenotype.laboratory.header.h1')}}</span> </h1>
            </div>
          </template>
          <div v-if="fileList.length" class="big-wrapper" style="margin-top: 10px">
            <div class="form_choose">
              <el-radio-group :disabled="histogramLoading === true" v-model="declaredDates"
                @change="handleCheckedDatesChange">
                <el-radio :disabled="histogramLoading === true" v-for="date in fileList" :key="date" :label="date">{{
                  date.fileName }}</el-radio>
              </el-radio-group>
            </div>
            <el-row>
              <el-button @click="chooseForm" v-loading="chooseLoading" size="large" type="success" plain
                style="width: 80px">{{ $t('phenotype.laboratory.button.ok') }}</el-button>
            </el-row>
          </div>
          <div v-else>此节点下无文件</div>
        </el-card>
        <el-card class="card-container" v-show="routerFileShow">
          <h1>{{ $t('phenotype.laboratory.header.h1') }}<i>&nbsp;</i></h1>
          <div class="big-wrapper" style="margin-top: 10px">
            <div class="form_choose">
              <h3>{{ $t('phenotype.laboratory.other.fileName') }} {{ routerFileName }}</h3>
              <h3>{{ $t('phenotype.laboratory.other.materialId') }} {{ routerMaterialId }}</h3>
            </div>
          </div>
        </el-card>

        <div class="big_container home" v-show="laboratoryShow" v-loading="laboratoryLoading">
          <el-card class="card-container" style="margin-bottom: 0;">
            <template #header>
              <div class="card-header">
                <h1><span>{{ $t('phenotype.laboratory.header.h2') }}</span></h1>
              </div>
            </template>
            <div style="margin-top: 10px">
              <div v-show="fileChooseShow">
                <!-- <div class="input-title">
                  <h1>请选择材料</h1>
                </div> -->
                <div class="search_table">
                  <el-select v-model="traitValue" filterable :placeholder="$t('phenotype.laboratory.other.selectId')">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                  <el-button style="margin-left: 20px !important" @click="search_trait" v-loading="searchLoading"
                    icon="Search" type="success" plain>{{ $t('phenotype.laboratory.button.search') }}</el-button>
                </div>
              </div>
              <!--  第二部分表单 -->
              <div class="laboratory-table" v-loading="isLaboratoryTableLoading">
                <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="margin: 30px auto"
                  class="trait-form-table" v-show="laboratorFormShow" stripe>
                  <el-table-column :label="$t('phenotype.laboratory.table.index')" width="80" type="index" align="center" :index="indexMethod" />
                  <el-table-column prop="traitName" :label="$t('phenotype.laboratory.table.traitName')" align="center"></el-table-column>
                  <el-table-column prop="average" :label="$t('phenotype.laboratory.table.average')" align="center"></el-table-column>
                  <el-table-column prop="maxNum" :label="$t('phenotype.laboratory.table.maxmum')" align="center"></el-table-column>
                  <el-table-column prop="minNum" :label="$t('phenotype.laboratory.table.minmum')" align="center"></el-table-column>
                </el-table>
              </div>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </el-config-provider>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { getTree } from "@/api/tree";
import { listFile } from "@/api/infomanage/phenoType";
import {
  getDataByFormId,
  getLocationByTraitId,
  getMaterialIdByFileId,
  dataAnalysisByMaterilId,
} from "@/api/data_presentation/laboratory_management";

import zh from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import en from 'element-plus/lib/locale/lang/en' // 英文语言

import { useI18n } from 'vue-i18n'
const i18n = useI18n();
const locale = computed(() => (localStorage.getItem('lang') === 'zh-CN' ? zh : en))



const route = useRoute();

const laboratoryShow = ref(false);
const fileChooseShow = ref(true);
const routerFileShow = ref(false);
const traitValue = ref("");

const messages = {
  search_success: computed(() => i18n.t('phenotype.laboratory.message.search_success')).value,
  select_success: computed(() => i18n.t('phenotype.laboratory.message.select_success')).value,
  get_success:computed(() => i18n.t('phenotype.laboratory.message.get_success')).value,
  
};

const tableData = reactive([
]);

//用于更新tableData的函数
function updateTableData(data) {
  tableData.splice(0, tableData.length, ...data);
}

const traitFileId = ref(1);
const laboratoryLoading = ref(false);
const isLaboratoryTableLoading = ref(false)
const chooseLoading = ref(false);

//请求性状信息
function chooseForm() {

  laboratoryLoading.value = true;
  isLaboratoryTableLoading.value = true
  laboratoryShow.value = true;
  laboratorSearchShow.value = true;
  chooseLoading.value = true;
  traitFileId.value = declaredDates.value.fileId;
  laboratorFormShow.value = false;

  getMaterialIdByFileId(traitFileId.value)
    .then((res) => {
      laboratoryShow.value = true;
      laboratoryLoading.value = false;
      chooseLoading.value = false;
      $modal.msgSuccess(messages.select_success);
      console.log(res, "hhhh");

      states.value = res.data;
      options.value = states.value.map((item) => {
        return { value: item, label: item };
      });
      traitValue.value = options.value[0].value;
      const materilId = traitValue.value;
      const id = traitFileId.value;
      dataAnalysisByMaterilId(id, materilId)
        .then((res) => {
          searchLoading.value = false;
          laboratorFormShow.value = true;

          updateTableData(res.data);
          isLaboratoryTableLoading.value = false
          searchLoading.value = false;
          $modal.msgSuccess(messages.search_success);
          console.log(res, "res");
        })
        .catch((err) => {
          console.error(err);
          searchLoading.value = false;
        });
    })
    .catch((err) => {
      console.error(err);
      laboratoryLoading.value = false;
      chooseLoading.value = false;
    });
  laboratoryLoading.value = false;
  chooseLoading.value = false;
}

const laboratorFormShow = ref(false);
const laboratorSearchShow = ref(true);
const searchLoading = ref(false);

function search_trait() {
  searchLoading.value = true;
  console.log(traitValue.value, "9090");
  const materilId = traitValue.value;
  const id = traitFileId.value;
  dataAnalysisByMaterilId(id, materilId)
    .then((res) => {
      searchLoading.value = false;
      laboratorFormShow.value = true;

      updateTableData(res.data);
      searchLoading.value = false;
      $modal.msgSuccess(messages.search_success);
      console.log(res, "res");
    })
    .catch((err) => {
      console.error(err);
      searchLoading.value = false;
    });
}

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

//树相关
const curFileUrl = ref(""); // 表格日期对应的文件url
// 表格日期
const dates = ref([]);
const fileList = ref([]); // 文件列表

//显示控制
const traitChoosed = ref(false);

// 加载
const loading = ref(false);
const histogramLoading = ref(false);
const loadingText = ref("加载中...");
const histogrM3DShow = ref(false);

// 请求文件列表
function getList() {
  listFile({
    treeId: tree.value.getCurrentNode().treeId,
  })
    .then((res) => {
      fileList.value = res.rows.map((item) => ({
        ...item,
        fileStatus: item.fileStatus === 1,
      }));
      declaredDates.value = fileList.value[0];
      chooseForm();
    })
    .catch((err) => {
      //console.log(fileList);
    });
}

// 树控件
const routesData = ref([]);
// 树的属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const treeType = 4;
const tree = ref(null); // 树的dom实例

const firstLeafNode = ref(null);
const firstLeafNodeKey = ref(null);

const getTreeList = () => {
  getTree(treeType, 0, 1).then((res) => {
    routesData.value = res.data.children;
    const firstLeafNodeParent = findFirstLeafNodeParent(routesData.value);

    if (firstLeafNodeParent) {
      nextTick(() => {
        const treeComponent = tree.value;

        if (treeComponent) {
          treeComponent.setCurrentKey(firstLeafNodeParent.treeId);
          if (!route.query.fileId) {
            rowClick(firstLeafNodeParent);
          }
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

// 获取表格日期
function getTableDate() {
  return Object.keys(tableData.value[0]);
}

const declaredDates = ref(null);
function handleCheckedDatesChange(val) {
  console.log(val.fileId, "opop");
}

//选择框
const value = ref("");
const reqLoading = ref(false);
const options = ref([]);

const states = ref(["110", "110", "120", "900", "800", "700"]);
const routerFileName = ref("");
const routerMaterialId = ref("");

function rowClick(nodeObj) {
  fileChooseShow.value = true;
  routerFileShow.value = false;
  histogrM3DShow.value = false;
  laboratoryShow.value = false;
  loading.value = true;
  histogramLoading.value = false;
  traitChoosed.value = false;
  getList();
}

onMounted(async () => {
  getTreeList();
  routerFileName.value = route.query.fileName;
  routerMaterialId.value = route.query.materialId;
  if (route.query.fileId && route.query.materialId) {
    dataAnalysisByMaterilId(route.query.fileId, route.query.materialId)
      .then((res) => {
        routerFileShow.value = true;
        fileChooseShow.value = false;
        laboratoryShow.value = true;
        laboratorFormShow.value = true;
        laboratorSearchShow.value = false;
        updateTableData(res.data);
        $modal.msgSuccess(messages.get_success);
      })
      .catch((err) => {
        console.error(err);
      });
  }
});
</script>

<style lang="less" scoped>
/* 所有标签 */

#traitPanMap {
  height: 450px;
  width: 400px;
}

:deep(#traitPanMap) div {
  height: 450px;
  width: 400px;
}

.phenome-container {
  //display: flex;
  //flex-direction: column;
  //position: relative;

  .echart_wrapper {
    display: flex;
    flex-direction: column;
    position: relative;

    #traitPanMap {
      width: 100%;
    }

    .trait-form {
      width: 100%;
      margin-top: -50px;
    }
  }

  .bgc-img {
    position: absolute;
    left: 0px;
    top: 0px;
    content: "";
    //display: overflow;
    // background-size: contain;
    // background-repeat: no-repeat;
    // background-position: bottom;
    // box-sizing: border-box;
    width: 60vw;
    width: 100%;
    height: 33vw;
    opacity: 0.2;
    // background-image: linear-gradient(to top, #9be15d 0%, #00e3ae 100%);
  }
}


.echart_wrapper {
  display: flex;
  justify-content: space-between;
}

.laboratory-table{
  min-height: 300px;
}

.card-container {
  padding: 0px;
  margin: 0 0 20px 20px;
  border-radius: 50px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12);

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

.form_choose {
  display: flex;
  flex-direction: column;

  .el-radio-group {
    margin: 20px 0;
  }

  .el-button {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
</style>


<style lang="less" scoped>
:deep(.el-button) {
  margin: 0% !important;
  margin-right: 8px !important;
}


@media (max-width: 1330px) {
  .my-button {
    margin-right: 2px !important;
    /* 缩小元素之间的间距 */
    font-size: 7px;
  }

  .my-input {
    width: 120px;
    /* 缩小输入框的宽度 */
    margin-right: 2px;
    padding: 0% !important;
  }

  .el-button {
    font-size: 12px;
    /* 设置按钮的字体大小为小号 */
    padding: 3px 6px;
    /* 根据需要调整按钮的内边距 */
  }

  :deep(.el-input__inner) {
    padding: 1px 11px;
  }

  :deep(.el-form-item__label) {
    padding: 0%;
  }
}

.hebin-button {
  margin-right: 0% !important;
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

:deep(.el-radio) {
  width: 30%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 50px;
}

:deep(.el-card__header) {
  background: var(--theme-color);
  height: 52px !important;
  display: flex;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  vertical-align: middle;
  padding-left: 50px !important;

  h1 {
    margin: 0%;
  }
  span {
    font-weight: 700;
    font-size: 20px;
    color: white;
    letter-spacing: 2px;
  }


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

:deep(.el-table__cell) {
  .cell {
    word-break: break-word;
  }
}

//一级节点选择器
:deep(.el-tree > .el-tree-node > .el-tree-node__content) {
  font-weight: 600;
  color: #107c10;
  height: 28px;

  .el-tree-node__label {
    font-size: 18px;
    font-family: "PingFang SC";
  }
}

//二级节点选择器
:deep(.el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content) {
  font-weight: 600;
  color: var(--theme-color);
  height: 26px;

  .el-tree-node__label {
    font-size: 16px;
  }
}

三级节点选择器 :deep(.el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content) {
  font-weight: 400;
  height: 23px;

  .el-tree-node__label {
    font-size: 14px;
  }
}
</style>

<style>
:root {
  --el-color-primary: var(--theme-color);
}
</style>

<!-- 树样式 -->
<style lang="less" scoped>
:deep(.permission-tree) {
  margin: 5px;
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

  svg {
    color: black;

  }
}

:deep(.el-tree-node__label) {
  font-size: 16px;
}

:deep(.el-form-item__label) {
  width: 110px;
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