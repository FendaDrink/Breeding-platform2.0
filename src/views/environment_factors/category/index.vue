<template>
  <el-card class="card-container">
    <template #header>
      <div class="card-header">
        <span>环境因子与分类</span>
      </div>
    </template>
    <div class="big-wrapper" style="margin-top: 10px">
      <div class="echart_wrapper">
        <div id="factorPanMap" style="width: 100%; height: 35vw;margin: 20px 0 100px 0"></div>
        <div class="factor-form">
          <el-table :data="phenotypeData.slice(
            (currentpageNum2 - 1) * pageSize2,
            currentpageNum2 * pageSize2
          )
            " stripe style="margin: 10px auto">
            <el-table-column label="序号" width="80px" type="index" :index="indexMethod" align="center" />

            <el-table-column align="center" prop="factorName" label="环境因子名称" min-width="150px">
              <template #default="scope">
                {{ formatTableCell(scope.row.factorName) }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="factorFullName" label="全称" min-width="150px">
              <template #default="scope">
                {{ formatTableCell(scope.row.factorFullName) }}
              </template>

            </el-table-column>
            <el-table-column prop="factorAbbreviationName" label="缩写" align="center" min-width="150px">
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

          <el-pagination background :total="totalPage2" :current-page="currentpageNum2" :page-size="pageSize2"
            layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2" />
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

const fileId = ref(route.query.id);
// const fileId=ref(1051);

//分页
const pageSize = ref(10);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

//分页2
const pageSize2 = ref(10);
const totalPage2 = ref(0);
const currentpageNum2 = ref(1); //当前页数


let phenotypeData = reactive([
  {
    factorId: "B11",
    factorName: "B11 content",
    factorFullName: "B11含量",
    remark: "45646",
    factorAbbreviationName: "biochemistry",
  },
]);
// phenotypeData副本
let _phenotypeData = []

const echartData = reactive({
  name: "环境因子",
  children: [
  ],
});

const sunBurstData = reactive({
  name: "环境因子",
  type: 'ROOT',
  father:null,
  children: [
  ],
});


const pieOption = {
  title: {
    text: "环境因子统计",
  },
  textStyle: {
    fontSize: 14
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
  _phenotypeData.splice(0, _phenotypeData.length, ...data);
  createTreeData(phenotypeData);
}

const factorTableLoading = ref(false);

//请求环境因子信息
function chooseForm() {
  if (!fileId.value) return;
  factorTableLoading.value = true;
  const factorFileId = fileId.value;

  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
  });
  queryParams.pageNum = currentpageNum.value;
  queryParams.pageSize = pageSize.value;
  factorChoosed.value = true;
  getEnvDetailByFileId({ fileId: factorFileId })
    // selectFactorColByFileId(factorFileId)
    .then((res) => {
      if (res.code === 200) {
        console.log(res)
        const factorsData = getFactorsData(res)
        updatePhenotypeData(factorsData);
        handleSunburstStyle()
        totalPage2.value = factorsData.length;
        initHistogram();
      }
    })
    .catch((err) => {
      console.error(err);
    });

}

// 提取环境因子信息
const getFactorsData = (data) => {
  if (data.length === 0) return []
  const factors = data.rows[0].factors
  const res = factors.map((item, index) => {
    return item[`factor_id_${index}`]
  })
  return res
}

//将请求到的形状信息转换为树形结构
const createTreeData = (data) => {
  console.log(data, 'data');
  //获取环境因子类型
  let factorType = [];
  data.forEach((item) => {
    let isExist = false;
    for (let i = 0; i < factorType.length; i++) {
      if (factorType[i].id === item.factorTypeId) {
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      if (item.factorTypeId == null) {
        factorType.push({
          name: "未定义因子类别",
          id: null,
        })
      } else
        factorType.push({
          name: item.factorTypeName,
          id: item.factorTypeId
        })
    }
  })
  console.log(factorType, 'factorType');
  //创建树形结构
  factorType.forEach((item) => {
    let node = {
      name: item.name,
      value:1,
      type:'TYPE',
      iId:item.id,
      father: {type:'ROOT',id:-2},
      children: []
    }
    node.children = data.filter((item2) => item2.factorTypeId === item.id).map((item3,index) => {
      return {
        name: '',
        type:'BLANK',
        iId:item3.factorId,
        value:1,
        father: {type: 'TYPE', id: item.id},
        children: [
          {
            name: item3.factorName,
            value: 1,
            type: 'FACTOR',
            iId: item3.factorId,
            father: {type: 'BLANK', id: item3.factorId},
            children: []
          }
        ]
      }
    })
    node.value = node.children.length;
    sunBurstData.children.push(node);
  })
  console.log(sunBurstData, 'sunBurstData');
}

// 可选颜色
const colors = [
  '#ffaaa5',
  '#8785a2',
  '#62d2a2',
  '#1fab89',
  '#625772',
  '#ff6f3c',
  '#00204a',
  '#3498db',
  '#f73859',
  '#4c221b',
  '#003371',
  '#5d513c',
  '#827100',
  '#50616d',
  '#9d2933'
];

const sunburstLevels = [
  {
  },
  {
    label:{
      rotate: 0,
      fontSize: 30,
      fontWeight: 800,
      textBorderColor: '#000',
      textBorderWidth: 4,
    }
  },
  {
    r0: '20%',
    r: '60%',
  },
  {
    r0: '60%',
    r: '70%',
  },
  {
    label:{
      color: '#fff',
      textBorderWidth:3
    }
  },
];

// 生成随机颜色
const randomColor = () => {
  // 如果已经选中了所有的颜色, 则返回随机颜色
  if (colors.length === 0) {
    return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`
  }

  // 先在colors中随机选取一个颜色,同时删除
  let color = colors.splice(Math.floor(Math.random() * colors.length),1)[0];
  return color;
}

const sunBurstOption = {
  // backgroundColor: '#f1f6f3',
  height:'100%',
  series: {
    type: 'sunburst',
    color: randomColor(),
    data: [sunBurstData],
    radius: [0, '90%'],
    label: {
      fontSize: 20,
      color: '#fff',
      textBorderColor: '#000',
      textBorderWidth: 2,
    },
    itemStyle: {
      borderWidth: 20,
      // borderColor:'#f1f6f3'
    },
    levels: sunburstLevels,
  }
};


// 处理旭日图样式
const handleSunburstStyle = () => {
  sunBurstData.children.forEach((item, index) => {
    const color = randomColor()
    item.itemStyle = {
      color: color,
      shadowColor: color,
    }
    item.emphasis = {
        itemStyle: {
          color: color,
          borderWidth: 0,
        }
      }
    item.children.forEach((item2, index2) => {
      item2.emphasis = {
        itemStyle: {
          color: color,
          borderWidth: 0,
        }
      }
      item2.itemStyle = {
        color: color,
        fontSize: 20,
        borderWidth: 8,
      }
      item2.children[0].itemStyle = {
        color: 'transparent',
        // color: color,
        // borderWidth: 0,
        fontSize: 20,
      }
      item2.children[0].emphasis = {
        itemStyle: {
          color: color,
          borderWidth: 0,
        }
      }
      item2.children[0].label={
        textBorderColor: color,
      }
    })
  })
};

// 根据type与id找到对应的元素的父元素
const findFather = (type,id) => {
  if(type==='ROOT') return {type:'ROOT',id:-2}
  if(type==='TYPE') return {type:'ROOT',id:-2}
  for(let i of sunBurstData.children){
    for(let j of i.children){
      if(type==='BLANK'){
        if(id===j.iId){
          return j.father
        }
      }else {
        if (id === j.children[0].iId) {
          return j.children[0].father;
        }
      }
    }
  }
}


// 根据type和id来决定图表内容
const getTableData = (type,id) => {
  switch (type){
    case 'ROOT':
      phenotypeData.splice(0, phenotypeData.length, ..._phenotypeData);
      break
    case 'TYPE':
      phenotypeData.splice(0, phenotypeData.length, ..._phenotypeData.filter(item => item.factorTypeId === id));
      break
    case 'FACTOR':
      phenotypeData.splice(0, phenotypeData.length, _phenotypeData.find(item => item.factorId === id));
      break
    case 'BLANK':
      phenotypeData.splice(0, phenotypeData.length, _phenotypeData.find(item => item.factorId === id));
      break
  }
  totalPage2.value = phenotypeData.length
  currentpageNum2.value = 1
  currentFather = findFather(type,id)
  console.log(currentFather,'father');
  console.log(phenotypeData);
}

// 记录当前显示层的父元素
let currentFather = null

// 图表点击事件
const sunBurstChartHandler = (params) =>{
  console.log(params.data.name)
  const data = params.data
  // 判断是否需要返回
  if(data.type === undefined) {
    // 返回上一层
    getTableData(currentFather.type,currentFather.id);
  }else {
    getTableData(data.type, data.iId)
  }
}

function initHistogram() {
  let chartDoms = document.querySelector("#factorPanMap");
  chartDoms?.removeAttribute("_echarts_instance_")
  let myChart = echarts.init(chartDoms);
  myChart.on("click", sunBurstChartHandler);
  // console.log(pieOption, 'pieOption');
  console.log(sunBurstOption, 'sunBurstOption');
  sunBurstOption && myChart.setOption(sunBurstOption);
  // pieOption && myChart.setOption(pieOption);
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
  //background-color: #f1f6f3;
  //.file-name{
  //  position: absolute;
  //  top: 0;
  //  left: 0;
  //  z-index: 10;
  //  font-size: 24px;
  //  color: #fff;
  //  //text-shadow: #000 1.5px 0 0, #000 0 1.5px 0, #000 -1.5px 0 0, #000 0 -1.5px 0;
  //  font-weight: bold;
  //  //filter:drop-shadow(2px 0 #000) drop-shadow(-2px 0 #000);
  //  -webkit-text-stroke: 3px #000;
  //}
  //.file-name::after{
  //  content:attr(data-content);
  //  position:absolute;
  //  top: 0;
  //  left: 0;
  //  z-index:66;
  //  -webkit-text-stroke:0;
  //}


  .factor-form {
    width: 100%;
    margin-top: -50px;
  }
}

.card-container {
  width: 95%;
  margin: 30px auto;
  border-radius: 50px;
  //background-color: #f1f6f3;
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

:deep(.el-table__header) {
  border-bottom: 1px solid black;
  border-top: 1px solid #EBEEF5;


  th {
    font-weight: 800;
    font-size: 16PX;
    background: var(--theme-color) !important;
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

canvas {
  margin: 0 auto;
}
</style>


<!-- 卡片样式 -->

<style lang="less" scoped>
.card-container {
  border-radius: 50px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-card__header) {
  background: var(--theme-color);
  height: 52px !important;
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
  border-bottom: none;
  border-top: 1px solid #ebeef5;

  th {
    font-weight: 800;
    font-size: 16PX;
    background: var(--theme-color) !important;
    color:#fff;
    letter-spacing: 2px;
    height: 40px !important;
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
