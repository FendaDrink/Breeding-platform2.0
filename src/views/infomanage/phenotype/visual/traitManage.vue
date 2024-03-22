<template>
  <el-card class="card-container">
    <template #header>
      <div class="card-header">
        <span>性状与分类</span>
      </div>
    </template>
    <div class="big-wrapper" style="margin-top: 10px">
        <div class="echart_wrapper">
            <div id="traitPanMap" :loading="isSunBurstChartLoading" style="width: 100%; height: 55vw"></div>
            <div class="trait-form">
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
                    prop="traitName"
                    label="性状名称"
                    min-width="150px"
                >
                    <template #default="scope">
                    {{ formatTableCell(scope.row.traitName) }}
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="fullName"
                    label="全称"
                    min-width="150px"
                >
                    <template #default="scope">
                    {{ formatTableCell(scope.row.fullName) }}
                    </template>

                </el-table-column>
                <el-table-column
                    prop="abbreviationName"
                    label="缩写"
                    align="center"
                    min-width="150px"
                >
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
import { reactive, ref, onMounted  } from "vue";
import { useRoute } from "vue-router";
import {
  getTraitFormByFileId,
  selectTraitColByFileId,
} from "@/api/data_presentation/trait_management";

//route实例
const route = useRoute();

const fileId=ref(route.query.id);

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
let _phenotypeData = []

const sunBurstData = reactive({
  name: "植物性状",
  children: [
  ],
});

const isSunBurstChartLoading =ref(true)
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


//用于更新phentypeData的函数
function updatePhenotypeData(data) {
  phenotypeData.splice(0, phenotypeData.length, ...data);
  _phenotypeData.splice(0, _phenotypeData.length, ...data);
  createTreeData(phenotypeData);
}

const traitTableLoading = ref(false);

//请求性状信息
function chooseForm() {
  if(!fileId.value) return;
  traitTableLoading.value = true;
  const traitFileId = fileId.value;

  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
  });
  queryParams.pageNum = currentpageNum.value;
  queryParams.pageSize = pageSize.value;
  getTraitFormByFileId({
    fileId: traitFileId,
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum,
  })
    .then((res) => {
      const tableDataValue = [];
      const columnsValue = [];
      totalPage.value = res.total;
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

      traitTableLoading.value = false;
    })
    .catch((err) => {
      traitTableLoading.value = false;
      console.error(err);
    });

  selectTraitColByFileId(traitFileId)
    .then((res) => {
      if (res.code === 200) {
        updatePhenotypeData(res.data);
        handleSunburstStyle()
        totalPage2.value = res.data.length;
        initHistogram();
      }
    })
    .catch((err) => {
      console.error(err);
    });

}

//将请求到的形状信息转换为树形结构
const createTreeData = (data) => {
  console.log(data, 'data');
  //获取环境因子类型
  let traitType = [];
  data.forEach((item) => {
    let isExist = false;
    for (let i = 0; i < traitType.length; i++) {
      if (traitType[i].id === item.traitTypeId) {
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      if (item.traitTypeId == null) {
        traitType.push({
          name: "未定义因子类别",
          id: null,
        })
      } else
        traitType.push({
          name: item.traitTypeName,
          id: item.traitTypeId
        })
    }
  })
  console.log(traitType, 'traitType');
  //创建树形结构
  traitType.forEach((item) => {
    let node = {
      name: item.name,
      value:1,
      type:'TYPE',
      iId:item.id,
      father: {type:'ROOT',id:-2},
      children: []
    }
    node.children = data.filter((item2) => item2.traitTypeId === item.id).map((item3,index) => {
      return {
        name: '',
        type:'BLANK',
        iId:item3.traitId,
        value:1,
        father: {type: 'TYPE', id: item.id},
        children: [
          {
            name: item3.traitName,
            value: 1,
            type: 'FACTOR',
            iId: item3.traitId,
            father: {type: 'BLANK', id: item3.traitId},
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
      fontSize: 24,
      fontWeight: 800,
      textBorderColor: '#000',
      textBorderWidth: 4,
    }
  },
  {
    r0: '20%',
    r: '60%',
    label: {
      fontSize: 16
    }
  },
  {
    r0: '60%',
    r: '70%',
  },
  {
    r0:'70%',
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
  console.log(color,'cccccc');
  return color;
}

const sunBurstOption = {
  backgroundColor: '#f1f6f3',
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
      borderWidth: 14,
      borderColor:'#f1f6f3'
    },
    gap: 50,
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
      phenotypeData.splice(0, phenotypeData.length, ..._phenotypeData.filter(item => item.traitTypeId === id));
      break
    case 'FACTOR':
      phenotypeData.splice(0, phenotypeData.length, _phenotypeData.find(item => item.traitId === id));
      break
    case 'BLANK':
      phenotypeData.splice(0, phenotypeData.length, _phenotypeData.find(item => item.traitId === id));
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
  let chartDoms = document.querySelector("#traitPanMap");
  chartDoms?.removeAttribute("_echarts_instance_")
  let myChart = echarts.init(chartDoms);
  myChart.on("click", sunBurstChartHandler);

  sunBurstOption && myChart.setOption(sunBurstOption);
  isSunBurstChartLoading.value=false
}
onMounted(() => {
  initHistogram();
  chooseForm()
});
</script>

<style lang="less" scoped>
.card {
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
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
    .trait-form {
      width: 100%;
      margin-top: 50px;
    }
  }



.card-container {
  width: 95%;
  border-radius: 50px;
  background-color: #f1f6f3;
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
    //color: 909399;
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
