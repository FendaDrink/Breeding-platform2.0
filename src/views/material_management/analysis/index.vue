<template>
  <div v-loading="pageLoad" style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;">
    <el-tabs type="border-card" class="demo-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="文件选择" style="width: 100%;">
        <el-card class="card-container">
          <h1>文件选择管理<i>&nbsp;</i></h1>
          <!-- <div class="uu">
      文件选择管理
      </div> -->
          <div class="pheno-box">
            <!-- <div class="w">
            <div class="mb-2 flex items-center text-sm">
              <h4>表型数据集</h4>
            </div>
          </div> -->
            <el-aside width="20%" class="mokuai card shadow element-plus-tree"
              style="border-radius: 8px;padding: 0%;margin-top: 20px;">
              <el-tree v-loading="tree2Load" :style="{ height: scrollerHeight, overflow: 'auto' }" ref="tree"
                :data="phenoRouteData" :props="defaultProps" node-key="treeId" default-expand-all highlight-current
                :current-node-key="1" :default-current-node-key="firstLeafNodeKey" @node-click="rowClick"
                class="permission-tree" :expand-on-click-node="false" accordion />

            </el-aside>
            <el-main width="78%" style="padding: 0" class="right-box">
              <div class="table-box">
                <el-table @select="phandleSelection" v-loading="phenoTableLoad" :data="phenoTableData"
                  style="width: 100%;" :cell-style="{ 'text-align': 'center' }"
                  :header-cell-style="{ 'text-align': 'center' }">
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="fileName" label="文件名" width="240" />
                  <el-table-column prop="speciesName" label="物种名称" width="180" />
                  <el-table-column prop="populationName" label="群体名称" width="180" />
                  <el-table-column prop="year" label="采集年份" width="180" />
                  <el-table-column fixed="right" label="数据类型">
                    <template #default>
                      <el-button link type="text" @click="changePhenoToOrigin" class="table_button">原始数据</el-button>
                      <el-button link type="text" @click="changePhenoToNewest" class="table_button">最新数据</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </div>

          <div class="geno-box">
            <!-- <div class="mb-2 flex items-center text-sm">
              <h4>基因型数据集</h4>
            </div> -->
            <el-aside width="20%" class="mokuai card shadow element-plus-tree"
              style="border-radius: 8px;padding: 0%;margin-top: 20px;">
              <el-tree v-loading="tree1Load" ref="tree1" :data="genoRouteData" :props="defaultProps" node-key="treeId"
                default-expand-all highlight-current :current-node-key="1" :default-current-node-key="firstLeafNodeKey"
                @node-click="rowClick1" class="permission-tree" :expand-on-click-node="false" accordion />
            </el-aside>

            <el-main width="78%" style="padding: 0" class="right-box">
              <div class="table-box">
                <el-table @select="ghandleSelection" v-loading="genoTableLoad" :data="genoTableData" style="width: 100%;"
                  :cell-style="{ 'text-align': 'center' }" :header-cell-style="{ 'text-align': 'center' }">
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="fileName" label="文件名" width="240" />
                  <el-table-column prop="speciesName" label="物种名称" width="180" />
                  <el-table-column prop="populationName" label="群体名称" width="180" />
                  <el-table-column fixed="right" label="数据类型">
                    <template #default>
                      <el-button link type="text" @click="changeGenoToOrigin" class="table_button">原始数据</el-button>
                      <el-button link type="text" @click="changeGenoToNewest" class="table_button">最新数据</el-button>
                    </template>
                  </el-table-column>
                </el-table>

              </div>
            </el-main>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="文件上传" style="width: 100%;">
        <el-card class="card-container">
          <h1>上传文件管理<i>&nbsp;</i></h1>
          <!-- <div class="uu">
          上传文件管理
        </div> -->
          <div class="upload-box">
            <div class="pheno-upload">
              <div class="mb-2 flex items-center text-sm">
                <h4>表型文件</h4>
              </div>
              <el-upload v-model:file-list="fileList.phenoFile" class="upload-demo" action="#" :headers="headers"
                method="post" :auto-upload="false" multiple :limit="2">
                <template #trigger>
                  <el-button type="primary" style="margin-right: 5px;">点击上传</el-button>
                </template>

              </el-upload>
            </div>
            <div class="pheno-upload">
              <div class="mb-2 flex items-center text-sm">
                <h4>基因型文件</h4>
              </div>
              <el-upload v-model:file-list="fileList.genoFile" class="upload-demo" action="#" :headers="headers"
                method="post" :auto-upload="false" multiple :limit="2">
                <template #trigger>
                  <el-button type="primary" style="margin-right: 5px;">点击上传</el-button>
                </template>

              </el-upload>
            </div>

          </div>
          <div class="center-box">
            <div class="card-box">
              <div class="title-box">统计学习模型：</div>
              <div class="ul-box">
                <el-checkbox-group v-model="checkedmethods" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="item in methods" :label="item" size="large">{{ item }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="card-box">
              <div class="title-box">机器学习模型：</div>
              <div class="ul-box">
                <el-checkbox-group v-model="checkedmethods1" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="item in methods1" :label="item" size="large">{{ item }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="card-box">
              <div class="title-box">深度学习模型：</div>
              <div class="ul-box">
                <el-checkbox-group v-model="checkedmethods2" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="item in methods2" :label="item" size="large">{{ item }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>


    <div class="submit-box">
      <el-button @click="submitform"
        style="width: 20%;margin-top: 20px; margin-bottom: 20px; font-size: 24px;background-color: #9ABEAF;" size="large"
        class="green-button">
        提交
      </el-button>
    </div>
    <el-card class="card-container" style="margin: 15px; margin-bottom: 0px;">
      <h1>文件选择管理<i>&nbsp;</i></h1>
      <!-- <div class="uu">
        任务信息展示
      </div> -->
      <div style="background: #fff; border-radius: 10px; margin-top: 10px;padding: 10px;">
        <el-table stripe v-loading="tableDataLoad" :data="tableData" style="width: 100%" @select="handleSelect"
          :cell-style="{ 'text-align': 'center' }" :header-cell-style="{ 'text-align': 'center' }">
          <el-table-column label="序号" type="index" width="80" />
          <el-table-column prop="breedId" label="任务编号" width="180" />
          <el-table-column label="表型文件">
            <template #default="scope">
              <span style="color: #1FB864; cursor: pointer;" @click="DownloadPhenoFile(scope.row)">
                {{ scope.row.phenofileName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="基因型文件">
            <template #default="scope">
              <span style="color: #1FB864; cursor: pointer;" @click="DownloadGenoFile(scope.row)">
                {{ scope.row.genofileName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="创建人" />
          <el-table-column prop="submitTime" label="提交时间" />
          <el-table-column prop="finishTime" label="完成时间" />
          <el-table-column prop="status" label="任务状态" />
          <el-table-column prop="result" label="结果">
            <template #default="scope">
              <el-button link type="text" @click="hanldeResult(scope.row)" class="table_button">
                预测结果
              </el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="结果下载">
            <template #default="scope">
              <el-button link type="text" @click="DownloadPdf(scope.row)" class="table_button">
                下载
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-pagination v-show="total > 0" :total="total" :page-sizes="[10, 20, 30, 50]" background
          v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
          layout="total, sizes,prev, pager, next, jumper" @size-change="getList" @current-change="getList" />
      </div>
      <el-dialog v-model="dialogVisible" title="预测结果">
        <h5>模型预测结果如下</h5>
        <h6 v-for="item in arr">
          {{ item }}
        </h6>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogVisible = false">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { getTrees, ddd, ppp, downloadFile, getPdf } from "@/api/material";
import { listFile, listFileGeno } from '@/api/infomanage/phenotype.js';
import { getToken } from "@/utils/auth"
import { ElMessage } from "element-plus";
import { reactive, ref, onMounted, nextTick, computed } from "vue";
import { getBreed, getResult } from "../../../api/system/breed";
import { blobValidate } from '@/utils/param'
let pageLoad = ref(false)
let dialogVisible = ref(false)
let fileList = ref({
  phenoFile: [],
  genoFile: []
});
let formObj = ref({
  phenoDataType: "原始数据",
  genoDataType: "原始数据",
  models: ""
});
let total = ref(0)
let queryParams = reactive({
  pageNum: 1,
  pageSize: 10
})
const scrollerHeight = computed(() => {
  return (window.innerHeight - 400) + 'px'
})
let data = reactive({
  methods: ['rrBLUP', 'BL', 'BRR', 'BayesA', 'BayesB'],
  methods1: ['SVR', 'RF', 'LightGBM'],
  methods2: ['DeepGS', 'ResGS', 'LCNN', 'MLP', 'gMLP']
})
let dialogFormVisible = ref(false)
const checkedmethods = ref([])
const checkedmethods1 = ref([])
const checkedmethods2 = ref([])
const methods = ['rrBLUP', 'BL', 'BRR', 'BayesA', 'BayesB']
const methods1 = ['SVR', 'RF', 'LightGBM']
const methods2 = ['DeepGS', 'ResGS', 'LCNN', 'MLP', 'gMLP']
const handleCheckedCitiesChange = (value) => {
  formObj.value.models = ""
  formObj.value.models = checkedmethods.value.concat(checkedmethods1.value, checkedmethods2.value)
  console.log(formObj.value.models)
}
const headers = ref({ Authorization: "Bearer " + getToken() });
const modelOptions = ref([
  { value: "0", label: "RandomForest" },
  { value: "1", label: "LightGBM" },
  { value: "2", label: "GradientBoosting" },
  { value: "3", label: "XGBoost" },
  { value: "4", label: "GaussianNB" },
  { value: "5", label: "SVM" },
])
let tableDataLoad = ref(true)
onMounted(() => {
  getList()
})
function getList() {
  tableDataLoad.value = true
  getBreed(queryParams).then(res => {
    total.value = res.total
    tableData.value = res.rows
    tableData.value.forEach(item => {
      if (item.status == 0) item.status = "运行中"
      else if (item.status == 1) item.status = "完成"
      else item.status = "失败"
      if (item.createBy == null) item.createBy = "-"
      if (item.finishTime == null) item.finishTime = "-"
    })
    tableDataLoad.value = false
  })
}

let dialogTableVisible = ref(false)
// 树控件
const phenoRouteData = ref([]);
const genoRouteData = ref([]);
// 树组件节点属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});
var tableData = ref([]);
const tree = ref(null); // 数的dom实例
const tree1 = ref(null); // 数的dom实例
const histogramLoading = ref(false)
let tree1Load = ref(true)
let tree2Load = ref(false)
let idArr = ref([])
// 获取整棵树
const getTreeList = (id = 4) => {
  getTrees(id).then((res) => {
    console.log(res)
    phenoRouteData.value = res.data.children;
    const firstLeafNodeParent = findFirstLeafNodeParent(phenoRouteData.value);

    if (firstLeafNodeParent) {
      nextTick(() => {
        const treeComponent = tree.value;

        if (treeComponent) {
          treeComponent.setCurrentKey(firstLeafNodeParent.treeId);
          rowClick(firstLeafNodeParent);
        }
      })
    }
    tree1Load.value = false
  });
};
//你们彭霜凌学姐写的函数 好评！
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
const firstLeafNodeKey = ref(null);
const getTreeList1 = (id = 5) => {
  getTrees(id).then((res) => {
    console.log(res)
    genoRouteData.value = res.data.children;
    const firstLeafNode = findFirstLeafNode(genoRouteData.value);
    if (firstLeafNode) {
      nextTick(() => {
        const treeComponent = tree.value;

        if (treeComponent) {
          treeComponent.setCurrentKey(firstLeafNode.treeId);
          rowClick1(firstLeafNode);
        }
      });
    }
    // nextTick(()=>{
    //   if(!tree1.value.getCurrentNode())
    //   tree1.value.setCurrentNode(genoRouteData.value[0])
    // rowClick1(tree.value.getCurrentNode())
    // })
    tree2Load.value = false
  });
};
getTreeList();
getTreeList1();
//树控件点击回调
const senceOptions = ref([
  { value: "1", label: "基因组预测模块" },
  { value: "2", label: "回交改良" },
  { value: "3", label: "DH系诱导" },
]);

//点击Tree拿到文件信息
let PhenoTypeData = ref([]);
let GeneData = ref([]);
let fromQuery = ref({
  pageSize: 50,
  pageNum: 1
})
let phenoTableData = ref([])
let genoTableData = ref([])
let genoTableLoad = ref(false)
let phenoTableLoad = ref(false)
function rowClick(nodeObj) {
  phenoTableLoad.value = true
  fromQuery.value = nodeObj;
  console.log(phenoRouteData)
  listFile(fromQuery.value).then(res => {
    console.log(res)
    phenoTableData.value = res.rows
    PhenoTypeData.value = [];
    PhenoTypeData.value = res.rows
    phenoTableLoad.value = false
  })

}
function rowClick1(nodeObj) {
  console.log(nodeObj)
  genoTableLoad.value = true
  fromQuery.value = nodeObj;
  console.log(phenoRouteData)
  listFileGeno(fromQuery.value).then(res => {
    genoTableData.value = res.rows
    genoTableData.value.forEach(item => {
      let nameArr = item.fileName.split('_')
      console.log(item.fileName.split('_'));
      item.speciesName = nameArr[0];
      item.populationName = nameArr[1]
    })
    // genoTableData.value
    GeneData.value = []
    GeneData.value = res.rows
    genoTableLoad.value = false
  })
}
let formdata = new FormData();

var fileName =
{
  phenoFileName: "",
  genoFileName: "",
}
function handleSelect(selection, row) {
  console.log(selection, row)
}
function phandleSelection(selection, row) {
  console.log(selection)
  console.log(row)
  formObj.value.phenoFileId = row.fileId;
  fileName.phenoFileName = row.fileName
}
function ghandleSelection(selection, row) {
  console.log(selection)
  console.log(row)
  formObj.value.genoFileId = row.fileId;
  fileName.genoFileName = row.fileName
}
var tabLable = "";
function handleTabClick(pane, ev) {
  console.log(pane)
  console.log(ev)
  tabLable = pane.props.label
}
async function submitform() {
  if (tabLable == "文件上传") {
    pageLoad.value = true
    formdata.append("phenoFile", fileList.value.phenoFile[0].raw)
    formdata.append("genoFile", fileList.value.genoFile[0].raw)
    await ppp(formObj.value, formdata).then(res => {
      pageLoad.value = false
    }).catch(err => {
      ElMessage.warning("系统繁忙，请稍后再试...")
      pageLoad.value = false
    });
    getList()
  }
  else {
    tableDataLoad.value = true
    await ddd(formObj.value).then(res => {
      console.log(res)
    })
    getList()
  }

  console.log(formdata)

}
function DownloadGenoFile(row) {
  console.log(row)
  let resource = { resource: row.genofile }
  downloadFile(resource).then(res => {
    console.log(res)
    const isLogin = blobValidate(res);
    if (isLogin) {
      const blob = new Blob([res])
      saveAs(blob, `breed${new Date().getTime()}.csv`)
    } else {
      const resText = data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg);
    }
  }).catch(err => {
    console.log(err)
    ElMessage.error('下载文件出现错误，请联系管理员！');
  })
}
let result = reactive({
  models: "",
  result: ""
})
let arr = ref([]);
function hanldeResult(row) {
  console.log(row)
  // var id = {id:row.breedId}
  // getResult(id)
  console.log(row.models)
  result.models = row.models
  result.result = row.result
  arr.value = row.result.split('*')
  console.log(arr)
  if (result.result == null) result.result = "空"
  dialogVisible.value = true

}
function DownloadPhenoFile(row) {
  console.log(row)
  let resource = { resource: row.phenofile }
  downloadFile(resource).then(res => {
    console.log(res)
    const isLogin = blobValidate(res);
    if (isLogin) {
      const blob = new Blob([res])
      saveAs(blob, `breed${new Date().getTime()}.csv`)
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
function changePhenoToOrigin() {
  formObj.value.phenoDataType = "原始数据"
  ElMessage.success("选择成功！")
}
function changePhenoToNewest() {
  formObj.value.phenoDataType = "最新数据"
  ElMessage.success("选择成功！")
}
function changeGenoToOrigin() {
  formObj.value.genoDataType = "原始数据"
}
function changeGenoToNewest() {
  formObj.value.phenoDataType = "最新数据"
  ElMessage.success("选择成功！")
}
async function DownloadPdf(row) {
  console.log(row)
  pageLoad.value = true
  var id = { breedId: row.breedId }
  var url = { resource: "" }
  await getPdf(id).then(res => {
    url.resource = res.msg
  })
  await downloadFile(url).then(res => {
    console.log(res)
    const isLogin = blobValidate(res);
    if (isLogin) {
      const blob = new Blob([res])
      saveAs(blob, `基因组预测比较-${id.breedId}.pdf`)
      pageLoad.value = false
    } else {
      const resText = data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error("下载文件出现错误，请联系管理员！");
      pageLoad.value = false
    }
  }).catch(err => {
    console.log(err)
    pageLoad.value = false
    ElMessage.error('下载文件出现错误，请联系管理员！');
  })

}

</script>
<style scoped lang="less">
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

.dialog-footer {
  margin-top: 15px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.pheno-box {
  display: flex;
  width: 100%;
  flex-direction: row;
}

.table-box {
  flex: 1;
  margin-left: 20px;
}

.geno-box {
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-top: 20px;
}

.center-box {
  padding: 10px;
}

.ui.raised.segment {
  -webkit-box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12),
    0 2px 10px 0 rgba(34, 36, 38, 0.15);
  box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12),
    0 2px 10px 0 rgba(34, 36, 38, 0.15);
}

.ui.segment {
  position: relative;
  background: #fff;
  -webkit-box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
  box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
  margin: 1rem 0;
  padding: 1em 1em;
  border-radius: 0.28571429rem;
  border: 1px solid rgba(34, 36, 38, 0.15);
  width: 25%;
  height: 180px;
}

.ui.segment:first-child {
  margin-top: 0;
}

.ui.segment:last-child {
  margin-bottom: 0;
}

.ui.teal.ribbon.label {
  border-color: #00827c !important;
}

.ui.teal.label,
.ui.teal.labels .label {
  background-color: #00b5ad !important;
  /* border-color: #00b5ad!important; */
  color: #fff !important;
}

.ui.ribbon.label {
  left: calc(-1rem - 1.2em);
  margin-right: -1.2em;
  padding-left: calc(1rem + 1.2em);
  padding-right: 1.2em;
}

.ui.ribbon.label {
  cursor: default;
  position: relative;
  margin: 0;
  min-width: -webkit-max-content;
  min-width: 400px;
  min-width: max-content;
  border-radius: 0 0.28571429rem 0.28571429rem 0;
  border-color: rgba(0, 0, 0, 0.15);
}

.ui.label,
.ui.labels .label {
  /* font-size: 0.85714286rem; */
  font-size: 0.95rem;
}

.ui.label {
  display: inline-block;
  line-height: 1;
  vertical-align: baseline;
  margin: 0 0.14285714em;
  background-color: #e8e8e8;
  background-image: none;
  padding: 0.5833em 0.833em;
  color: rgba(0, 0, 0, 0.6);
  text-transform: none;
  font-weight: 700;
  border: 0 solid transparent;
  border-radius: 0.28571429rem;
  -webkit-transition: background 0.1s ease;
  transition: background 0.1s ease;
}

.ui.ribbon.label:after {
  position: absolute;
  content: "";
  top: 100%;
  left: 0;
  background-color: transparent !important;
  border-style: solid;
  border-width: 0 1.2em 1.2em 0;
  border-color: transparent;
  border-right-color: inherit;
  width: 0;
  height: 0;
}

.ui.teal.labels .label:hover,
a.ui.teal.label:hover {
  background-color: #009c95 !important;
  border-color: #009c95 !important;
  color: #fff !important;
}

.model-box {
  // margin: 0 auto;
  // margin-right: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.datadiv {
  height: 160px;
}

.submit-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-box {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  text-align: center;  /*水平居中*/

  .pheno-upload {
    width: 50%;
  }
}

.uu {
  background: #9abeaf;
  margin: 10px 0;
  color: white;
  height: 50px;
  border-radius: 10px;
  line-height: 50px;
  padding-left: 10px;
  box-shadow: var(--el-box-shadow-lighter);
}

.center-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;

  .card-box {
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;

    .title-box {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }

    .ul-box {
      // width:65%;
      height: 40px;
      line-height: 40px;
      width: 60%;
      // background-color: red;
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>

<!-- el-dialog的append-to-body属性会导致el-dialog的样式修改失效，先去掉 -->
<style lang="less" scoped>
:deep(.el-dialog__header) {
  margin-right: 0px;
  background: #0F5C32;
  height: 60px !important;

  span {

    font-weight: 700;
    font-size: 20px;
    color: white;
    letter-spacing: 2px;
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
  padding: 0% !important;
  margin: 0 !important;
  margin-right: 5px !important;
  border: none !important;
  background-color: transparent !important;
}

.table_button {
  color: #1FB864 !important;
}

.table_button:hover {
  color: #1FB864 !important;
  border: none !important;
  background-color: transparent !important;
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
  background: #f6f6f6;
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





:deep(.el-tabs) {
  padding: 0%;
  border: none !important;
  background-color: #eeeeee !important;
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
</style>

