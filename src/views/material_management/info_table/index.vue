<template>
  <div style="width: 100%;min-height: calc(100vh - 84px);background-color: #eeeeee;">
    <el-container style="padding: 20px; border: 1px solid #eee; height: calc(100vh - 100px)" :element-loading-text="loadingText"
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
          <h1>表型文件选择<i>&nbsp;</i></h1>
          <!-- <template #header>
            <div class="card-header">
              <span>表型文件选择</span>
            </div>
          </template> -->
          <div v-if="fileList.length" class="big-wrapper" style="margin-top: 10px">
            <div class="form_choose">
              <el-radio-group :disabled="histogramLoading === true" v-model="declaredDates"
                @change="handleCheckedDatesChange">
                <el-radio :disabled="histogramLoading === true" v-for="date in fileList" :key="date" :label="date">{{
                  date.fileName }}</el-radio>
              </el-radio-group>
              <el-row>
                <el-button @click="chooseForm" size="large" type="primary" style="width: 80px">确定</el-button>
              </el-row>
            </div>
          </div>
          <div v-else>
            此节点下无文件
          </div>
        </el-card>
        <div class="gene-form">
          <el-card class="card-container" style="padding-bottom: 36px; margin: 0px; !important">
            <h1>表型文件详情<i>&nbsp;</i></h1>
            <!-- <template #header>
              <div class="card-header">
                <span>表型文件详情</span>
              </div>
            </template> -->
            <div class="material_table" style="width: 100%">
              <!-- 表型表基本信息展示 -->
              <el-form :model="queryParams" ref="queryForm" size="large" :inline="true" v-show="showSearch"
                label-width="68px">
                <el-form-item label="品种ID" prop="kindId">
                  <el-input v-model="queryParams.kindId" placeholder="请输入品种ID" clearable @keyup.enter="handleQuery"
                    class="my-input" />
                </el-form-item>
                <el-form-item label="品种名称" prop="kindName">
                  <el-input v-model="queryParams.kindName" placeholder="请输入品种名称" clearable @keyup.enter="handleQuery"
                    class="my-input" />
                </el-form-item>
                <el-form-item label="材料编号" prop="materialId">
                  <el-input v-model="queryParams.materialId" placeholder="请输入材料编号" clearable @keyup.enter="handleQuery"
                    class="my-input" />
                </el-form-item>
                <el-form-item label="田间编号" prop="fieldId">
                  <el-input v-model="queryParams.fieldId" placeholder="请输入田间编号" clearable @keyup.enter="handleQuery"
                    class="my-input" />
                </el-form-item>
                <el-form-item label="父本" prop="father">
                  <el-input v-model="queryParams.father" placeholder="请输入父本" clearable @keyup.enter="handleQuery"
                    class="my-input" />
                </el-form-item>
                <el-form-item label="母本" prop="mother">
                  <el-input v-model="queryParams.mother" placeholder="请输入母本" clearable @keyup.enter="handleQuery"
                    class="my-input" />
                </el-form-item>
                <el-form-item>
                  <el-button icon="Search" type="primary" size="large" @click="handleQuery">搜索</el-button>
                  <el-button icon="Refresh" size="large" type="primary" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-form>

              <el-table v-loading="loading1" :data="tableList" style="width: 100%;">
                <el-table-column label="序号" type="index" width="80px" align="center">
                  <template #default="{ $index }">
                    {{ (currentPageNum - 1) * pageSize + $index + 1 }}
                  </template>
                </el-table-column>

                <el-table-column label="品种ID" align="center" prop="kindId" width="120px">
                  <template #default="scope">{{ scope.row.kindId ? scope.row.kindId : '-' }}</template>
                </el-table-column>
                <el-table-column label="品种名称" align="center" prop="kindName" width="120px">
                  <template #default="scope">{{ scope.row.kindName ? scope.row.kindName : '-' }}</template>
                </el-table-column>
                <el-table-column label="材料编号" align="center" prop="materialId" width="120px">
                  <template #default="scope">{{ scope.row.materialId ? scope.row.materialId : '-' }}</template>
                </el-table-column>
                <el-table-column label="田间编号" align="center" prop="fieldId" width="120px">
                  <template #default="scope">{{ scope.row.fieldId ? scope.row.fieldId : '-' }}</template>
                </el-table-column>
                <el-table-column label="对照类型" align="center" prop="controlType" width="120px">
                  <template #default="scope">{{ scope.row.controlType ? scope.row.controlType : '-' }}</template>
                </el-table-column>
                <el-table-column label="父本" align="center" prop="father" width="120px">
                  <template #default="scope">{{ scope.row.father ? scope.row.father : '-' }}</template>
                </el-table-column>
                <el-table-column label="母本" align="center" prop="mother" width="120px">
                  <template #default="scope">{{ scope.row.mother ? scope.row.mother : '-' }}</template>
                </el-table-column>
                <el-table-column fixed="right" label="品种谱系" width="120px">

                  <template #default="{ row }">
                    <el-button type="text" size="medium" @click="toGraph(row.materialId)" class="table_button"><el-icon>
                        <PieChart />
                      </el-icon>系谱图</el-button>
                  </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="150px">
                  <template #default="{ row }">
                    <el-button @click="handleExitPhenotype(row.materialId, declaredDates)" size="mini"
                      class="table_button" type="text">表型</el-button>
                    <el-button @click="handleExitPicture(row.materialId, declaredDates)" size="mini" class="table_button"
                      type="text">图片</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页器 -->
              <div class="demo-pagination-block" style="margin-top: 20px;float: left;margin-bottom: 20px">
                <el-pagination background :total="total1" :current-page="currentPageNum" :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                  @current-change="handleCurrentChange" />
              </div>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
/*import {
  getSpecies,
  getGroups,
  getYears,
  getAreas,
  getTableName,
  getTableData,
} from "../../../api/material";*/
import { getTree } from "@/api/tree";
import { listFile } from "@/api/infomanage/phenoType";
import { listPhenotype } from "@/api/genotype/geno_material";
// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

const router = useRouter();
/*const toDetail = (row) => {
} from "../../../api/material";
const router = useRouter();
const toDetail = (row) => {
console.log(row.materialId,row.fieldId,'9890890');
  router.push({ path: "/phenotype/laboratory",query:{
    materialId:row.materialId,
    fileId:row.fieldId
  } });
};*/

const toGraph = (materialId) => {
  console.log("wwww", materialId)
  router.push({
    path: "/material_management/graph",
    query: { id: materialId },
  });
};

const tableList = reactive([])
const loading1 = ref(true)
const queryParams = ref({
  kindId: "",
  kindName: "",
  materialId: "",
  fieldId: "",
  controlType: "",
  father: "",
  mother: "",
  fileId: "",
  tableName: ""
})
const total1 = ref(0)
const showSearch = ref(true)
const pageSize = ref(10)
const currentPageNum = ref(1)

const handleSizeChange = (val) => {
  pageSize.value = val;
  getTableList()
};

const handleCurrentChange = (val) => {
  currentPageNum.value = val;
  //localStorage.setItem("currentPageNum", val);
  getTableList()
};
//跳转操作
function handleExitPicture(materialId, param) {
  console.log(materialId)
  const fileId = reactive(param.fileId)
  router.push({ path: '/admin/info/photos', query: { materialId, fileId } })
}
function handleExitPhenotype(materialId, param) {
  // const fileId = reactive(param.fileId)
  console.log(materialId)
  console.log(param, 88888);
  const fileId = reactive(param.fileId)
  const fileName = reactive(param.fileName)
  router.push({ path: '/phenotype/laboratory', query: { materialId, fileId, fileName } })
}

//获取表格序号
const getIndex = (index) => {
  return (currentPageNum - 1) * pageSize + index + 1
};
//获取表格数据
const getTableList = () => {
  loading1.value = true;
  // const jsonString = JSON.stringify(queryParams);
  console.log(queryParams.value)
  //let data = JSON.parse(JSON.stringify(queryParams.value))
  //console.log(data)
  listPhenotype(queryParams.value, currentPageNum.value, pageSize.value).then(res => {

    tableList.value = res.rows;
    console.log(tableList.value)
    total1.value = res.total;
    console.log(total1.value)
    console.log(res.rows, 'kjkj')
    upDateTableList(res.rows)
    loading1.value = false;
  });
}
/*function handleExitPhenotype(materialId,param){
  // const fileId = reactive(param.fileId)
  console.log(materialId)
  const fileId = reactive(param.fileId)
  const fileName = reactive(param.fileName)
  router.push({path:'/phenotype/laboratory',query:{materialId,fileId,fileName}})
}*/

//更新表格数据
function upDateTableList(data) {
  tableList.splice(0, tableList.length, ...data)
}

//搜索按钮操作
function handleQuery() {
  queryParams.pageNum = 1;
  getTableList();
}
//重置按钮操作
function resetQuery() {
  queryParams.value.pageNum = 1;
  queryParams.value.pageSize = 10;
  queryParams.value.kindId = null;
  queryParams.value.kindName = null;
  queryParams.value.materialId = null;
  queryParams.value.fieldId = null;
  queryParams.value.controlType = null;
  queryParams.value.father = null;
  queryParams.value.mother = null;
  queryParams.value.tableName = null;
  getTableList();
}

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
  listFile({
    treeId: tree.value.getCurrentNode().treeId,
  })
    .then((res) => {
      fileList.value = res.rows.map((item) => ({
        ...item,
        fileStatus: item.fileStatus === 1,
      }));
      declaredDates.value = fileList.value[0];
      const declaredDates1 = fileList.value[0].fileId
      console.log(declaredDates.value, "1s1s")
      queryParams.value.fileId = declaredDates1;
      getTableList()
      total.value = res.total;
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
const checkedDates = ref([]);
const declaredDates = ref([]);
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

const treeType = 4
const tree = ref(null); // 树的dom实例

const firstLeafNode = ref(null)
const firstLeafNodeKey = ref(null)

const getTreeList = () => {
  getTree(treeType, 0, 1).then((res) => {
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


function chooseForm() {
  queryParams.value.fileId = declaredDates.value.fileId
  console.log(declaredDates.value)
  console.log(queryParams.fileId)
  console.log(queryParams.value)
  getTableList()
}

function rowClick(nodeObj) {
  console.log(nodeObj, "123")
  getList();
}

onMounted(() => {
  getTreeList();
});
</script>
<style lang="less" scoped>
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

.card-container {
  padding: 20px 20px 0px;
  background-color: #fff;
  margin: 0px 0px 20px;
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

.container-wrapper {
  width: 70%;
  margin: auto;
}

.right-box {
  margin-left: 20px;
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
  margin-right: 8px !important;
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


<!-- 卡片样式 -->
<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-card__header) {
  background: #9ABEAF;
  height: 60px !important;
  display: flex;
  vertical-align: middle;
  padding-left: 50px !important;

  span {
    font-weight: 700;
    font-size: 20px;
    color: white;
    letter-spacing: 2px;
  }
}
</style>

<!-- 响应式 -->
<style lang="less" scoped>
:deep(.el-input__inner) {
  padding-left: 5px !important;
  padding-right: 5px !important;
}

.my-input {
  width: 200px;
}

@media (max-width: 1550px) {
  .my_item {
    margin-right: 5px;
    /* 缩小元素之间的间距 */
  }

  .my-input {
    width: 150px;
    /* 缩小输入框的宽度 */
  }
}

@media (max-width: 1450px) {
  .my_item {
    margin-right: 5px;
    /* 缩小元素之间的间距 */
  }

  .my-input {
    width: 120px;
    /* 缩小输入框的宽度 */
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
