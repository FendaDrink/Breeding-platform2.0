<template>
  <div style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;">
    <el-container style="padding: 20px; border: 1px solid #eee; height: calc(100vh - 100px)"
      :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
      <!--树-->
      <el-aside width="20%" class="mokuai card shadow element-plus-tree"
        style="min-height: calc(100vh - 180px);margin-top: 10px;border-radius: 8px;padding: 0%;margin-top: 0%;">
        <el-tree ref="tree" :data="routesData" :props="defaultProps" node-key="treeId" default-expand-all
          highlight-current :current-node-key="1" :default-current-node-key="firstLeafNodeKey" @node-click="rowClick"
          class="permission-tree" :check-strictly="true" :check-on-click-node="true" :expand-on-click-node="false">
        </el-tree>
      </el-aside>
      <!-- //右边的盒子 -->
      <el-main width="78%" style="padding: 0;" class="right-box">
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
            </div>
            <el-row>
              <el-button @click="chooseForm" size="large" type="primary" style="width: 80px">确定</el-button>
            </el-row>
          </div>
          <div v-else>此节点下无文件</div>
        </el-card>
        <!-- 
        <div v-show="traitChoosed" class="gene-form">
          <el-card class="card-container">
            <div class="big-wrapper" style="margin-top: 10px">
              <el-table
                v-loading="traitTableLoading"
                ref="multipleTable"
                :data="
                  tableData
                "
                tooltip-effect="dark"
                style="margin: 30px auto"
                class="trait-form-table"
              >
                <el-table-column
                  v-for="column in columns"
                  :key="column.prop"
                  :label="column.label"
                  :prop="column.prop"
                ></el-table-column>
              </el-table>
              <el-pagination
                background
                :total="totalPage"
                :current-page="currentpageNum"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-card>
        </div> -->
        <div v-show="traitChoosed" class="phenome-container">
          <el-card class="card-container" style="margin-bottom: 0;">
            <h1>表型信息详情<i>&nbsp;</i></h1>
            <!-- <template #header>
              <div class="card-header">
                <span>表型信息详情</span>
              </div>
            </template> -->
            <div class="big-wrapper" style="margin-top: 10px">
              <div class="echart_wrapper">
                <!-- <el-image :src="require('@/assets/img/11.png')" class="bgc-img"></el-image> -->
                <img src="@/assets/img/11.png" class="bgc-img">
                <div id="traitPanMap" style="width: 78vw; height: 35vw;">

                </div>
                <div class="trait-form">
                  <!-- <el-button>Download</el-button> -->
                  <el-table :data="
                    phenotypeData.slice(
                      (currentpageNum2 - 1) * pageSize2,
                      currentpageNum2 * pageSize2
                    )
                  " stripe style="margin: 10px auto">
                    <el-table-column label="序号" width="80px" type="index" :index="indexMethod" align="center" />

                    <el-table-column align="center" prop="traitName" label="性状名称" min-width="150px">
                      <template #default="scope">
                        {{ formatTableCell(scope.row.traitName) }}
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="fullName" label="全称" min-width="150px">
                      <template #default="scope">
                        {{ formatTableCell(scope.row.fullName) }}
                      </template>

                    </el-table-column>
                    <el-table-column prop="abbreviationName" label="缩写" align="center" min-width="150px">
                      <template #default="scope">
                        {{ formatTableCell(scope.row.abbreviationName) }}
                      </template>
                    </el-table-column>

                    <el-table-column prop="remark" label="备注" min-width="180px" align="center">
                      <template #default="scope">
                        {{ formatTableCell(scope.row.remark) }}
                      </template>

                    </el-table-column>
                  </el-table>

                  <el-pagination background :total="totalPage2" :current-page="currentpageNum2" :page-size="pageSize2"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2" />
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { reactive, ref, onMounted, getCurrentInstance, nextTick } from "vue";
import { getTree } from "@/api/tree";
import { listFile } from "@/api/infomanage/phenoType";
import {
  getTraitFormByFileId,
  getallTraitByfileId,
  getTraitBytraitId,
  selectTraitColByFileId,
} from "@/api/data_presentation/trait_management";
// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

//分页
const pageSize3 = ref(10);
const totalPage3 = ref(0);

//分页
const pageSize = ref(10);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

const tableLoading = ref(false);

//分页2
const pageSize2 = ref(10);
const totalPage2 = ref(0);
const currentpageNum2 = ref(1); //当前页数

const tableLoading2 = ref(false);

// 多选框
const declaredDates = ref(null);

// 树控件
const routesData = ref([]);
// 树的属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const treeType = 4;
const tree = ref(null); // 树的dom实例

//第一个叶子结点
const firstLeafNode = ref(null);
const firstLeafNodeKey = ref(null);

const phenotypeData = reactive([
  {
    traitId: "B11",
    traitName: "B11 content",
    fullName: "B11含量",
    remark: "45646",
    abbreviationName: "biochemistry",
  },
  {
    traitId: "B11",
    traitName: "B11 content",
    fullName: "B11含量",
    remark: "45646",
    abbreviationName: "biochemistry",
  },
  {
    traitId: "B11",
    traitName: "B11 content",
    fullName: "B11含量",
    remark: "45646",
    abbreviationName: "biochemistry",
  },
  {
    traitId: "B11",
    traitName: "B11 content",
    fullName: "B11含量",
    remark: "45646",
    abbreviationName: "biochemistry",
  },
]);

const data2 = reactive({
  name: "植物性状",
  children: [
    {
      name: "性状一",
      id: "1",
      children: [
        {
          name: "性状1.1",
          id: "2",
        },
        {
          name: "性状1.2",
          id: "3",
        },
      ],
    },
    {
      name: "性状二",
      id: "4",
      children: [
        {
          name: "性状2.1",
          id: "5",
        },
        {
          name: "性状2.2",
          id: "6",
        },
      ],
    },
    {
      name: "性状三",
      id: "7",
      children: [
        {
          name: "性状3.1",
          id: "8",
        },
        {
          name: "性状3.2",
          id: "9",
        },
      ],
    },
    {
      name: "性状四",
      id: "10",
      children: [
        {
          name: "性状4.1",
          id: "11",
        },
        {
          name: "性状4.2",
          id: "12",
        },
      ],
    },
    {
      name: "性状五",
      id: "13",
      children: [
        {
          name: "性状5.1",
          id: "14",
        },
        {
          name: "性状5.2",
          id: "15",
        },
      ],
    },
    {
      name: "性状六",
      id: "16",
      children: [
        {
          name: "性状6.1",
          id: "17",
        },
        {
          name: "性状6.2",
          id: "1",
        },
      ],
    },
  ],
});

const echartData = reactive({
  name: "植物性状",
  children: [
    {
      name: "性状一",
      id: "1",
      children: [
        {
          name: "性状1.1",
          id: "2",
          children: null,
        },
        {
          name: "性状1.2",
          id: "3",
          children: null,
        },
      ],
    },
    {
      name: "性状二",
      id: "4",
      children: [
        {
          name: "性状2.1",
          id: "5",
        },
        {
          name: "性状2.2",
          id: "6",
        },
      ],
    },
    {
      name: "性状三",
      id: "7",
      children: [
        {
          name: "性状3.1",
          id: "8",
        },
        {
          name: "性状3.2",
          id: "9",
        },
      ],
    },
    {
      name: "性状四",
      id: "10",
      children: [
        {
          name: "性状4.1",
          id: "11",
        },
        {
          name: "性状4.2",
          id: "12",
        },
      ],
    },
    {
      name: "性状五",
      id: "13",
      children: [
        {
          name: "性状5.1",
          id: "14",
        },
        {
          name: "性状5.2",
          id: "15",
        },
      ],
    },
    {
      name: "性状六",
      id: "16",
      children: [
        {
          name: "性状6.1",
          id: "17",
        },
        {
          name: "性状6.2",
          id: "1",
        },
      ],
    },
  ],
});

const pieOption = {
  series: [
    {
      type: "tree",
      data: [echartData],
      top: "10%",
      bottom: "18%",
      left: "1%",
      layout: "radial",
      symbol: "emptyCircle",
      symbolSize: 7,
      initialTreeDepth: 3,
      animationDurationUpdate: 750,
      zoom: 1,
      emphasis: {
        focus: "descendant",
      },
      expandAndCollapse: false,
      data: [],
      itemStyle: {
        normal: {
          color: "transparent",
        },
      },
    },
  ],
};

const colorByLevel = ["#FF5733", "#FFAB33", "#33FF57", "#33ABFF"];

function assignColorToNodes(node, level) {
  node.itemStyle = {
    color: colorByLevel[level % colorByLevel.length],
  };

  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      assignColorToNodes(child, level + 1);
    });
  }
}

function createRingBackground(x, y, innerRadius, outerRadius, color) {
  return {
    type: "circle",
    shape: {
      cx: x,
      cy: y,
      r: outerRadius,
    },
    style: {
      fill: color,
    },
  };
}

function addRingBackground(node, level, centerX, centerY, radius) {
  const color = colorByLevel[level % colorByLevel.length];

  if (node.children && node.children.length > 0) {
    const outerRadius = radius;

    const ringBackground = createRingBackground(
      centerX,
      centerY,
      0,
      outerRadius,
      color
    );

    node.itemStyle.graphic = node.itemStyle.graphic || [];
    node.itemStyle.graphic.push(ringBackground);

    node.children.forEach((child) => {
      addRingBackground(child, level + 1, centerX, centerY, radius + 40);
    });
  }
}

//获取第一个表格
const columns = ref([]); // 表头数据
const tableData = ref([]); // 表格数据

const handleSizeChange2 = (val) => {
  pageSize2.value = val;
};

const handleCurrentChange2 = (val) => {
  currentpageNum2.value = val;
  localStorage.setItem("currentPageNum2", val);
};

function formatTableCell(value) {
  console.log(value, "jhjhk");
  return value || "-"; // 如果值为空，返回'-'
}

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

function handleCheckedDatesChange(val) {
  console.log(val.fileId, "opop");
}

//用于更新phentypeData的函数
function updatePhenotypeData(data) {
  phenotypeData.splice(0, phenotypeData.length, ...data);
}

const traitTableLoading = ref(false);

//请求性状信息
function chooseForm() {
  console.log("1");
  traitTableLoading.value = true;
  const traitFileId = declaredDates.value.fileId;

  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
  });
  queryParams.pageNum = currentpageNum.value;
  queryParams.pageSize = pageSize.value;
  traitChoosed.value = true;
  getTraitFormByFileId({
    fileId: traitFileId,
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum,
  })
    .then((res) => {
      console.log(res, "bnbn");
      const tableDataValue = [];
      const columnsValue = [];
      totalPage.value = res.total;
      console.log(totalPage.value, "totalPage");

      if (res.total > 0) {
        const firstItem = res.list[0];

        // 生成表头
        Object.keys(firstItem).forEach((key) => {
          const trait = firstItem[key];
          const traitKey = Object.keys(trait)[0];
          const traitName = trait[traitKey].traitName;
          columnsValue.push({ label: traitName, prop: traitKey });
        });

        // 生成表格数据
        console.log(res.list);
        res.list.forEach((array) => {
          const rowData = {};
          array.forEach((trait) => {
            const traitKey = Object.keys(trait)[0];
            const traitValue = trait[traitKey].traitValue;
            rowData[traitKey] = traitValue;
          });
          tableDataValue.push(rowData);
        });
      }

      columns.value = columnsValue;
      tableData.value = tableDataValue;

      traitChoosed.value = true;
      traitTableLoading.value = false;

      /* initHistogram(); */
    })
    .catch((err) => {
      traitTableLoading.value = false;
      console.error(err);
    });

  selectTraitColByFileId(traitFileId)
    .then((res) => {
      if (res.code === 200) {
        totalPage2.value = res.data.length;
        updatePhenotypeData(res.data);
        console.log(phenotypeData, "klkl");
      }
    })
    .catch((err) => {
      console.error(err);
    });

  getallTraitByfileId(traitFileId)
    .then((res) => {
      traitChoosed.value = true;
      echartData.children = res.data.map((rootNode) => buildTree(rootNode));
      assignColorToNodes(echartData, 0);
      addRingBackground(echartData, 0, 0, 0, 60);
      pieOption.series[0].data.push(echartData);
      initHistogram();
    })
    .catch((err) => {
      console.error(err);
    });
}

async function fetchData(pageNumber, pageSize) {
  try {
    traitTableLoading.value = true;
    const traitFileId = declaredDates.value.fileId;

    // 创建查询参数对象
    const queryParams = reactive({
      pageNum: pageNumber,
      pageSize: pageSize,
    });

    traitChoosed.value = true;

    getTraitFormByFileId({
      fileId: traitFileId,
      pageSize: queryParams.pageSize,
      pageNum: queryParams.pageNum,
    })
      .then((res) => {
        console.log(res, "bnbn");
        const tableDataValue = [];
        const columnsValue = [];
        totalPage.value = res.total;
        console.log(totalPage.value, "totalPage");

        if (res.total > 0) {
          const firstItem = res.list[0];

          // 生成表头
          Object.keys(firstItem).forEach((key) => {
            const trait = firstItem[key];
            const traitKey = Object.keys(trait)[0];
            const traitName = trait[traitKey].traitName;
            columnsValue.push({ label: traitName, prop: traitKey });
          });

          // 生成表格数据
          console.log(res.list);
          res.list.forEach((array) => {
            const rowData = {};
            array.forEach((trait) => {
              const traitKey = Object.keys(trait)[0];
              const traitValue = trait[traitKey].traitValue;
              rowData[traitKey] = traitValue;
            });
            tableDataValue.push(rowData);
          });
        }

        columns.value = columnsValue;
        tableData.value = tableDataValue;

        traitChoosed.value = true;
        traitTableLoading.value = false;

        /* initHistogram(); */
      })
      .catch((err) => {
        traitTableLoading.value = false;
        console.error(err);
      });
  } catch (error) {
    // 发生错误时，设置 traitTableLoading 为 false 并记录错误信息
    traitTableLoading.value = false;
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

function buildTree(node) {
  // 如果节点没有chidren属性或其值为null，则返回该节点本身
  if (!node.chidren) {
    return {
      name: node.name,
      id: node.id.toString(),
      children: null,
    };
  }
  // 否则，遍历chidren并递归构建
  return {
    name: node.name,
    id: node.id.toString(),
    children: node.chidren.map((child) => buildTree(child)),
  };
}

function isLeafNode(node) {
  return !node.children || node.children.length === 0;
}

// 递归查找父节点ID
function findParentNodeId(nodeId, treeData) {
  for (let i = 0; i < treeData.length; i++) {
    const current = treeData[i];
    if (current.children) {
      for (let j = 0; j < current.children.length; j++) {
        if (current.children[j].id === nodeId) {
          return current.id; // 返回父节点ID
        } else {
          const foundId = findParentNodeId(nodeId, current.children);
          if (foundId) return foundId;
        }
      }
    }
  }
  return null;
}

function initHistogram() {
  let chartDoms = document.querySelector("#traitPanMap");
  let myChart = echarts.init(chartDoms);
  window.addEventListener('resize', function () {
    myChart.resize()
  })
  pieOption && myChart.setOption(pieOption);

  // 点击事件处理函数
  myChart.on("click", (params) => {
    if (params.data && params.data.name !== "植物性状") {
      const isLeaf = isLeafNode(params.data);
      const chartData = pieOption.series[0].data; // 根据您的配置来修改
      const typeIdToSend = isLeaf
        ? findParentNodeId(params.data.id, chartData)
        : params.data.id;

      getTraitBytraitId(typeIdToSend)
        .then((res) => {
          console.log(res, "klklk");

          if (!isLeaf) {
            totalPage2.value = res.data.length;
            updatePhenotypeData(res.data);
          } else {
            const leafName = params.data.name;
            const filteredData = res.data.filter(
              (item) => item && item.traitName === leafName
            );

            totalPage2.value = filteredData.length;
            updatePhenotypeData(filteredData);
          }
        })
        .catch((err) => {
          $modal.msg("该性状未被定义");
        });

      // 展开所有子节点
      expandNode(params.data, myChart);
    }
  });
}

function expandNode(node, chart) {
  if (node.children) {
    node.children.forEach((child) => {
      chart.dispatchAction({
        type: "expandAndCollapse",
        nodeId: child.id,
        expand: true,
      });
      expandNode(child, chart); // 注意这里也要传递chart
    });
  }
}

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
      console.log(fileList.value[0].fileId, "45646456");
      declaredDates.value = fileList.value[0];
      chooseForm();
    })
    .catch((err) => {
      //console.log(fileList);
    });
}

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

// 根据节点ID查找节点的函数，替换为您的实际查找方法
function findNodeById(nodes, nodeId) {
  console.log(nodeId, "opopopop");
  // 根据节点ID查找节点的逻辑，例如使用数组过滤或映射
  nodes.forEach((item) => {
    if (item.parentId === nodeId) {
      console.log(item, "me???");
    }
  });
  return nodes.find((node) => node.treeId === nodeId);
}

function rowClick(nodeObj) {
  histogrM3DShow.value = false;
  loading.value = true;
  histogramLoading.value = false;
  traitChoosed.value = false;
  getList();
}

function getDates(dateArr) {
  dates.value = dateArr;
}

onMounted(() => {
  initHistogram();
  getTreeList();
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

.right-box {
  margin-left: 20px;
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

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #fff !important;
}

:deep(.el-icon) {
  color: black;
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