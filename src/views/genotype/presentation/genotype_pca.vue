<template>
  <div style="width: 100%;min-height: calc(100vh - 84px);background-color: #eeeeee;">
    <el-container style="padding: 20px; border: 1px solid #eee" :element-loading-text="loadingText"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <!--树-->
      <el-aside width="20%" class="mokuai card shadow element-plus-tree"
        style="min-height: calc(100vh - 180px);margin-top: 10px;border-radius: 8px;padding: 0%;margin-top: 0%;">
        <el-tree ref="tree" :data="routesData" :props="defaultProps" node-key="treeId" default-expand-all
          highlight-current :current-node-key="1" @node-click="rowClick" class="permission-tree" :check-strictly="true"
          :check-on-click-node="true" :expand-on-click-node="false" :default-current-node-key="firstLeafNodeKey" />
      </el-aside>
      <!-- //右边的盒子 -->
      <el-main width="78%" style="padding: 0; height: calc(100vh - 150px)" class="right-box">
        <el-card class="card-container">
          <!-- <h1>表型文件选择<i>&nbsp;</i></h1> -->
          <template #header>
            <div class="card-header">
              <span>{{ $t('genotype.pca.header') }}</span>
            </div>
          </template>
          <div v-if="fileList.length" class="big-wrapper" style="margin-top: 10px">
            <div class="form_choose">
              <el-radio-group :disabled="histogramLoading === true" v-model="declaredDates"
                @change="handleCheckedDatesChange">
                <el-radio :disabled="histogramLoading === true" v-for="date in fileList" :key="date" :label="date">{{
                  date.fileName }}</el-radio>
              </el-radio-group>
              <el-row>
                <el-button plain @click="chooseForm" size="large" type="success" >{{ $t('genotype.index.search') }}</el-button>
                <!--<el-button @click="handleExitPca(declaredDates)" size="large" type="primary" style="width: 80px">PCA分析</el-button>-->
              </el-row>
            </div>
          </div>
          <div v-else>
            {{ $t('genotype.pca.noFile') }}
          </div>
        </el-card>
        <div class="gene-form">
          <el-card class="card-container" style="padding-bottom: 25px !important; margin-bottom: 0px; !important">
            <!-- <h1>PCA<i>&nbsp;</i></h1> -->
            <template #header>
              <div class="card-header">
                <span>PCA</span>
              </div>
            </template>
            <div class="geno_pca">
              <div class="title">
                <el-card class="box-card-left">
                  <div id="point3D" style="width: 90%;height: 350px;margin-left: 5%"></div>
                </el-card>
                <el-card class="box-card-right">
                  <div id="point2D" style="width: 90%;height: 350px;margin-left: 5%"></div>
                </el-card>
              </div>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import 'echarts-gl'
import { listPCA } from "@/api/genotype/genotype_pca";
//import {useRoute} from "vue-router";
import { reactive, ref, onMounted, getCurrentInstance, nextTick } from "vue";
import { getTree } from "@/api/tree";
import { genoListFile } from "@/api/infomanage/genoType";

//const route = useRoute()
const checkedDates = ref([]);
const declaredDates = ref([]);
let fileId

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

//3D散点图数据
const data1 = ref([])

//2D散点图数据
const data2 = ref([])

const total = ref(0)

//3D散点图
function initHistogram() {
  let chartDom1 = document.querySelector("#point3D")
  let myChart1 = echarts.init(chartDom1)
  listPCA(fileId).then(res => {
    console.log(fileId)
    console.log(res.data)
    data1.value = res.data.map(function (item) {
      return [item.material, item.pca1, item.pca2, item.pca3]
    })
    console.log(data1.value)
    document.getElementById("point3D")?.removeAttribute("_echarts_instance_");
    //3D散点图配置项
    const pointOption1 = {
      title: {
        text: '3D View'
      },
      grid3D: {
        axisPointer: {
          lineStyle: {
            color: '#ffbd67'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#b3d1b1'
          }
        }
      },
      xAxis3D: {
        type: 'value',
        name: 'pc1',
      },
      tooltip: {// 提示框组件。
        trigger: 'item',
        formatter: function (params) {
          const a = params.value[0];
          const b = Number(params.value[1]).toFixed(2);
          const c = Number(params.value[2]).toFixed(2);
          const d = Number(params.value[3]).toFixed(2);
          const message = a + '</br>' + '-pca1: ' + b + '</br>' + '-pca2: ' + c + '</br>' + '-pca3: ' + d;
          return message;
        },
        confine: true,
      },
      yAxis3D: {
        type: 'value',
        name: 'pc2',
      },
      zAxis3D: {
        type: 'value',
        name: 'pc3',
      },
      dataset: {
        source: data1.value,
        dimensions: [
          'material',
          'pca1',
          'pca2',
          'pca3',
        ]
      },
      series: [
        {
          type: 'scatter3D',
          symbolSize: 7,
          name: '',
          encode: {
            x: 'pca1',
            y: 'pca2',
            z: 'pca3',
          },
        }
      ]
    }
    myChart1.setOption(pointOption1);
  })
}
//2D散点图
function initHistogram1() {
  let chartDom2 = document.querySelector("#point2D")
  let myChart2 = echarts.init(chartDom2)
  listPCA(fileId).then(res => {
    console.log(fileId, "1a1a")
    data2.value = res.data.map(function (item) {
      return [item.material, item.pca1, item.pca2]
    })
    console.log(data2.value)
    document.getElementById("point2D")?.removeAttribute("_echarts_instance_");
    //2D散点图配置项
    const pointOption2 = {
      title: {
        text: '2D View'
      },
      grid: {},
      xAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: '#b3d1b1'
          }
        },
        name: 'pc1',
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: '#b3d1b1'
          }
        },
        name: 'pc2',
      },
      tooltip: {// 提示框组件。
        trigger: 'item',
        confine: true,
        formatter: function (params) {
          const a = params.value[0];
          const b = Number(params.value[1]).toFixed(2);
          const c = Number(params.value[2]).toFixed(2);
          const message = a + '</br>' + '-pca1: ' + b + '</br>' + '-pca2: ' + c;
          return message;
        },
      },
      dataset: {
        dimensions: [
          'material',
          'pca1',
          'pca2',
        ],
        source: data2.value
      },
      series: [{
        symbolSize: 10,
        type: 'scatter',
        encode: {
          x: 'pca1',
          y: 'pca2',
        }
      }]
    }
    myChart2.setOption(pointOption2);
  })
}

/*onMounted(() => {
  initHistogram();
  initHistogram1();
})*/

window.addEventListener("DOMContentLoaded", function () {
  initHistogram();
  initHistogram1()
});

//树相关
const curFileUrl = ref(""); // 表格日期对应的文件url
// 表格日期
const dates = ref([]);
const fileList = ref([]); // 文件列表

// 加载
//const histogramLoading = ref(false);
const loadingText = ref("加载中...");
const histogrM3DShow = ref(false);

// 请求文件列表
function getList() {
  genoListFile({
    treeId: tree.value.getCurrentNode().treeId,
  })
    .then((res) => {
      fileList.value = res.rows.map((item) => ({
        ...item,
        fileStatus: item.fileStatus === 1,
      }));
      total.value = res.total;
      declaredDates.value = fileList.value[0];
      const declaredDates1 = fileList.value[0].fileId;
      fileId = declaredDates1;
      initHistogram();
      initHistogram1()
    })
    .catch((err) => {
      //console.log(fileList);
    });
}

// 获取表格日期
function getTableDate() {
  return Object.keys(tableData.value[0]);
}

// 全选框
const checkAll = ref(false);
const isIndeterminate = ref(true);
// 全选函数
function handleCheckAllChange(val) {
  checkAll.value = val;
  isIndeterminate.value = false;
  checkedDates.value = val ? dates.value : [];
  declaredDates.value = val ? fileList.value : [];
}

// 多选框

function handleCheckedDatesChange(val) {
  const checkedCount = val.length;
  checkAll.value = checkedCount === fileList.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < fileList.value.length;
}

// 树控件
const routesData = ref([]);
// 树的属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const treeType = 5
const tree = ref(null); // 树的dom实例

const firstLeafNode = ref(null)
const firstLeafNodeKey = ref(null)

const getTreeList = () => {
  getTree(treeType, 0, 1).then((res) => {
    routesData.value = res.data.children;
    const firstLeafNode = findFirstLeafNode(routesData.value);
    if (firstLeafNode) {
      nextTick(() => {
        const treeComponent = tree.value;

        if (treeComponent) {
          treeComponent.setCurrentKey(firstLeafNode.treeId);
          rowClick(firstLeafNode);
        }
      });
    }
  });
};


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


function chooseForm() {
  fileId = declaredDates.value.fileId;
  console.log(fileId);
  console.log(declaredDates.fileId);
  initHistogram();
  initHistogram1()
}

function rowClick(nodeObj) {
  console.log(nodeObj, "123")
  getList();
}

onMounted(() => {
  getTreeList();
});
</script>

<style lang="less">
.title {
  width: 95%;
  margin: auto;
}

.node-title {
  background-color: rgb(154, 190, 175);
  color: #fff;
  height: 50px;
  width: 100%;
  border-radius: 10px;
  margin: 10px auto;
}

.node-title-content {
  float: left;
  margin-left: 20px;
  font-size: 16px;
  line-height: 50px;
}

.box-card-left {
  width: 47%;
  height: 400px;
  margin-top: 20px;
  margin-bottom: 30px;
  margin-left: 2%;
  float: left;
}

.box-card-right {
  width: 47%;
  height: 400px;
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 30px;
  margin-right: 2%;
  float: right;
}

/* 所有标签 */
.node-title-content {
  float: left;
  margin-left: 20px;
  font-size: 16px;
  line-height: 50px;
}

.phenome-container {
  display: flex;
  flex-direction: column;

  .echart_wrapper {
    display: flex;

    #traitPanMap {
      width: 40%;
      margin-left: -40px;
    }

    .trait-form {
      width: 60%;
    }
  }
}

.description-form {
  margin-bottom: 40px;
}

.gene-description {
  display: flex;
  flex-direction: row;
}

.echart_wrapper {
  display: flex;
  justify-content: space-between;
}

.description-form {
  width: 55%;
}

.description-echart {
  width: 45%;
}

.gene-form-table {
  margin: 30px 0px;
}

.card-container .SearchBox-card {
  border-radius: 20px;
}

.big-wrapper {
  margin: auto;
}

.container-wrapper {
  width: 70%;
  margin: auto;
}

:deep(.el-tree-node__label) {
  font-size: 16px;
}

:deep(.el-tree) {
  background-color: #fff;
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #fff !important;
}


.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
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
  margin-right: 20px !important;
}

.mytable {
  background-color: #EEEEEE;
}

.table_button {
  padding: 0% !important;
  margin: 0 !important;
  margin-right: 5px !important;
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

  span {
    font-weight: 700;
    font-size: 20px;
    color: white;
    letter-spacing: 2px;
  }
}

.card-container {
  padding: 0px;
  background-color: #fff;
  margin: 0px 20px 20px 20px;
  border-radius: 50px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12);

  h1 {
    font-size: 20px;
    text-align: center;
    position: relative;
    z-index: 1;
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

//三级节点选择器 
:deep(.el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content) {
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