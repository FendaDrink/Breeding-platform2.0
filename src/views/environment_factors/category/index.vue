<template>
  <el-card class="card-container">
    <template #header>
      <div class="card-header">
        <span>环境因子分类</span>
      </div>
    </template>
    <div class="big-wrapper" style="margin-top: 10px">
        <div class="echart_wrapper">
          <img src="@/assets/img/11.png" class="bgc-img" style="width: 100%; height: 100vh">
            <div id="factorPanMap" style="width: 100%; height: 110vh;margin: 20px 0 100px 0"></div>
            <div class="factor-form">
                <el-table
                :data="
                    phenotypeData.slice(
                    (currentpageNum2 - 1) * pageSize2,
                    currentpageNum2 * pageSize2
                    )
                "
                stripe
                style="margin: 10px auto"
                >
                <el-table-column
                    label="序号"
                    width="80px"
                    type="index"
                    :index="indexMethod"
                    align="center"
                />

                <el-table-column
                    align="center"
                    prop="factorName"
                    label="环境因子名称"
                    min-width="150px"
                >
                    <template #default="scope">
                    {{ formatTableCell(scope.row.factorName) }}
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="factorFullName"
                    label="全称"
                    min-width="150px"
                >
                    <template #default="scope">
                    {{ formatTableCell(scope.row.factorFullName) }}
                    </template>

                </el-table-column>
                <el-table-column
                    prop="factorAbbreviationName"
                    label="缩写"
                    align="center"
                    min-width="150px"
                >
                    <template #default="scope">
                    {{ formatTableCell(scope.row.factorAbbreviationName) }}
                    </template>
                </el-table-column>

                <el-table-column prop="remark" label="备注" min-width="180px" align="center">
                    <template #default="scope">
                    {{ formatTableCell(scope.row.remark) }}
                    </template>

                </el-table-column>
                </el-table>

                <el-pagination
                background
                :total="totalPage2"
                :current-page="currentpageNum2"
                :page-size="pageSize2"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                />
            </div>
        </div>
    </div>
  </el-card>
</template>

<script setup>
import * as echarts from "echarts";
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
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

//route实例
const route = useRoute();

const fileId=ref(route.query.id);
// const fileId=ref(1051);

//分页
const pageSize = ref(10);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

//分页2
const pageSize2 = ref(10);
const totalPage2 = ref(0);
const currentpageNum2 = ref(1); //当前页数


const phenotypeData = reactive([
  {
    factorId: "B11",
    factorName: "B11 content",
    factorFullName: "B11含量",
    remark: "45646",
    factorAbbreviationName: "biochemistry",
  },
]);

const echartData = reactive({
  name: "环境因子",
  children: [
  ],
});

const pieOption = {
    title: {
        text: "环境因子统计",
    },
  textStyle:{
    fontSize:14
  },
    series: [
        {
        type: "tree",
        data: [echartData],
        top: "15%",
        bottom: "20%",
        left: "2%",
        layout: "radial",
        symbol: "emptyCircle",
        symbolSize: 17,
        initialTreeDepth: 3,
        animationDurationUpdate: 750,
        zoom: 1.1,
        emphasis: {
            focus: "descendant",
        },
        expandAndCollapse: false,
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
  return value || "-"; 
}


//显示控制
const factorChoosed = ref(false);


//用于更新phentypeData的函数
function updatePhenotypeData(data) {
  phenotypeData.splice(0, phenotypeData.length, ...data);
  createTreeData(phenotypeData);
}

const factorTableLoading = ref(false);

//请求环境因子信息
function chooseForm() {
  if(!fileId.value) return;
  factorTableLoading.value = true;
  const factorFileId = fileId.value;

  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
  });
  queryParams.pageNum = currentpageNum.value;
  queryParams.pageSize = pageSize.value;
  factorChoosed.value = true;
  // getFactorFormByFileId({
  //   fileId: factorFileId,
  //   pageSize: queryParams.pageSize,
  //   pageNum: queryParams.pageNum,
  // })
  //   .then((res) => {
  //     const tableDataValue = [];
  //     const columnsValue = [];
  //     totalPage.value = res.total;
  //     if (res.total > 0) {
  //       const firstItem = res.list[0];
  //
  //       // 生成表头
  //       Object.keys(firstItem).forEach((key) => {
  //         const factor = firstItem[key];
  //         const factorKey = Object.keys(factor)[0];
  //         const factorName = factor[factorKey].factorName;
  //         columnsValue.push({ label: factorName, prop: factorKey });
  //       });
  //
  //       // 生成表格数据
  //       res.list.forEach((array) => {
  //         const rowData = {};
  //         array.forEach((factor) => {
  //           const factorKey = Object.keys(factor)[0];
  //           const factorValue = factor[factorKey].factorValue;
  //           rowData[factorKey] = factorValue;
  //         });
  //         tableDataValue.push(rowData);
  //       });
  //     }
  //
  //     columns.value = columnsValue;
  //     tableData.value = tableDataValue;
  //
  //     factorChoosed.value = true;
  //     factorTableLoading.value = false;
  //
  //     /* initHistogram(); */
  //   })
  //   .catch((err) => {
  //     factorTableLoading.value = false;
  //     console.error(err);
  //   });

  getEnvDetailByFileId({fileId:factorFileId})
  // selectFactorColByFileId(factorFileId)
  .then((res) => {
      if (res.code === 200) {
        console.log(res)
        const factorsData = getFactorsData(res)
        console.log(factorsData)
        totalPage2.value = factorsData.length;
        updatePhenotypeData(factorsData);
        assignColorToNodes(echartData, 0);
        addRingBackground(echartData, 0, 0, 0, 60);
        pieOption.series[0].data.push(echartData);
        initHistogram();
      }
    })
    // .catch((err) => {
    //   console.error(err);
    // });

}

// 提取环境因子信息
const getFactorsData = (data)=>{
  if(data.length===0) return []
  const factors = data.rows[0].factors
  const res = factors.map((item,index) => {
    return item[`factor_id_${index}`]
  })
  return res
}


//将请求到的形状信息转换为树形结构
function createTreeData(data) {
    console.log(data,'data');
  //获取环境因子类型
  echartData.children = [];
  let factorType = [];
  data.forEach((item) => {
    let isExist = false;
    for(let i=0;i<factorType.length;i++){
      if(factorType[i].id == item.factorTypeId){
        isExist = true;
        break;
      }
    }
    if(!isExist){
      if(item.factorTypeId ==null){
        factorType.push({
          name: "未定义环境因子类别",
          id: null
        })
      }else
      factorType.push({
        name: item.factorTypeName,
        id: item.factorTypeId
      })
    }
  })
  console.log(factorType,'factorType');
  //创建树形结构
  factorType.forEach((item) => {
    let node={
      name: item.name,
      id: item.id,
      children: []
    }
    node.children=data.filter((item2) => item2.factorTypeId === item.id).map((item3) => {
      return {
        name: item3.factorName,
        id: item3.factorTypeId,
        children: null
      }
    });
    echartData.children.push(node);
  })
  console.log(echartData,'echartData');
}

// async function fetchData(pageNumber, pageSize) {
//   try {
//     factorTableLoading.value = true;
//     const factorFileId = fileId.value;
//
//     // 创建查询参数对象
//     const queryParams = reactive({
//       pageNum: pageNumber,
//       pageSize: pageSize,
//     });
//
//     factorChoosed.value = true;
//
//     getFactorFormByFileId({
//       fileId: factorFileId,
//       pageSize: queryParams.pageSize,
//       pageNum: queryParams.pageNum,
//     })
//       .then((res) => {
//         const tableDataValue = [];
//         const columnsValue = [];
//         totalPage.value = res.total;
//         if (res.total > 0) {
//           const firstItem = res.list[0];
//
//           // 生成表头
//           Object.keys(firstItem).forEach((key) => {
//             const factor = firstItem[key];
//             const factorKey = Object.keys(factor)[0];
//             const factorName = factor[factorKey].factorName;
//             columnsValue.push({ label: factorName, prop: factorKey });
//           });
//
//           // 生成表格数据
//           res.list.forEach((array) => {
//             const rowData = {};
//             array.forEach((factor) => {
//               const factorKey = Object.keys(factor)[0];
//               const factorValue = factor[factorKey].factorValue;
//               rowData[factorKey] = factorValue;
//             });
//             tableDataValue.push(rowData);
//           });
//         }
//
//         columns.value = columnsValue;
//         tableData.value = tableDataValue;
//
//         factorChoosed.value = true;
//         factorTableLoading.value = false;
//
//         /* initHistogram(); */
//       })
//       .catch((err) => {
//         factorTableLoading.value = false;
//         console.error(err);
//       });
//   } catch (error) {
//
//     factorTableLoading.value = false;
//     console.error("获取数据时出错：", error);
//   }
// }


function buildTree(node) {
  if (!node.chidren) {
    return {
      name: node.name,
      id: node.id.toString(),
      children: null,
    };
  }
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
  let chartDoms = document.querySelector("#factorPanMap");
  chartDoms?.removeAttribute("_echarts_instance_")
  let myChart = echarts.init(chartDoms);
  myChart.on("click", (params) => {
    // if (params.data && params.data.name !== "环境因子") {
    //   console.log('woce')
    //   const isLeaf = isLeafNode(params.data);
    //   const chartData = pieOption.series[0].data;
    //   const typeIdToSend = isLeaf
    //     ? findParentNodeId(params.data.id, chartData)
    //     : params.data.id;
    //
    //   getFactorByfactorId(typeIdToSend)
    //     .then((res) => {
    //
    //       if (!isLeaf) {
    //         totalPage2.value = res.data.length;
    //         updatePhenotypeData(res.data);
    //       } else {
    //         const leafName = params.data.name;
    //         const filteredData = res.data.filter(
    //           (item) => item && item.factorName === leafName
    //         );
    //
    //         totalPage2.value = filteredData.length;
    //         updatePhenotypeData(filteredData);
    //       }
    //     })
    //     .catch((err) => {
    //       $modal.msg("该环境因子未被定义");
    //     });
    //
    //   // 展开所有子节点
    //   expandNode(params.data, myChart);
    // }
  });
  pieOption && myChart.setOption(pieOption);
}

function expandNode(node, chart) {
  if (node.children) {
    node.children.forEach((child) => {
      chart.dispatchAction({
        type: "expandAndCollapse",
        nodeId: child.id,
        expand: true,
      });
      expandNode(child, chart); 
    });
  }
}


onMounted(() => {
  initHistogram();
  chooseForm()
});
</script>

<style lang="less" scoped>
.card {
  position: relative;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

/* 所有标签 */


  .echart_wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: relative;
    .bgc-img{
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.1;
    }
    .factor-form {
      width: 100%;
      margin-top: -50px;
    }
  }



.card-container {
  width: 95%;
  margin: 30px auto;
  border-radius: 50px;
}

.card-container .SearchBox-card {
  border-radius: 20px;
}

.big-wrapper {
  width: 100%;
}


.card {
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  border-radius: 20px;
}

:deep(.el-table__header){
  border-bottom: 1px solid black;
  border-top: 1px solid #EBEEF5;

  th{
    font-weight: 800;
    font-size: 16PX;
    background: #FAFAFA !important;
    letter-spacing: 2px;
    height: 60px !important;
  }
}
.mokuai {
  margin-bottom: 0;
  background-color: rgb(183, 202, 189);
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

canvas{
  margin: 0 auto;
}
</style>


<!-- 卡片样式 -->

<style lang="less" scoped>

.card-container{
  border-radius: 50px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-card__header) {
  background: #1FB864;
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

:deep(.el-table__header) {
  border-bottom: 1px solid black;
  border-top: 1px solid #ebeef5;

  th {
    font-weight: 800;
    font-size: 16PX;
    background: #FAFAFA !important;
    letter-spacing: 2px;
    height: 60px !important;
  }
}

:deep(.el-table__cell) {
  .cell {
    word-break: break-word;
  }
}

.chooseType {
  margin-left: 50px;
  margin-bottom: 20px;

  span {
    margin-right: 20px;
    font-weight: 600;
    font-size: 20px;
    color: #606266;
  }
}
</style>
