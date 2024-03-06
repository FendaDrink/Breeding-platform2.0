<!--环境因子分析-->
<template>
  <div style="
      width: 100%;
      min-height: calc(100vh - 84px);
      background-color: #eeeeee;
    ">
    <el-container style="padding: 20px; border: 1px solid #eee; height: calc(100vh - 100px)"
      :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-main width="78%" style="padding: 0" class="right-box">
        <div class="phenome-container">
          <!-- 环境因子选择 -->
          <el-card class="card-container">
            <template #header>
              <div class="card-header">
                <span>环境因子选择</span>
              </div>
            </template>
            <div class="big-wrapper" style="margin-top: 10px">
              <div class="block" style="display:flex;justify-content: space-between">
                <!-- 级联选择器 -->
                  <div class="m-4">
                    <span style="font-weight: bold">文件选择：</span>
                    <el-cascader
                        placeholder="请选择文件"
                        :options="fileOptions"
                        :props="{label:'fileName',value:'fileId'}"
                        filterable
                        clearable
                        v-model="fileValue"
                        @change="fileSelectHandler"
                        :show-all-levels="false"
                    />
                  </div>

                  <div class="m-4">
                    <span style="font-weight: bold">环境变量选择：</span>
                    <el-cascader
                        placeholder="请选择环境因子"
                        :options="envOptions"
                        :props="{label:'name',value:'id',children:'chidren'}"
                        filterable
                        clearable
                        v-model="factorValue"
                        @change="factorSelectHandler"
                        :show-all-levels="false"
                    />
                  </div>

                  <div class="block">
                    <span style="font-weight: bold">日期选择：</span>
                    <el-date-picker
                        v-model="value2"
                        type="daterange"
                        unlink-panels range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" :shortcuts="shortcuts"
                        :size="size"
                        style="margin-right: 20px;" @change="chooseDateHandler" />
                  </div>
              </div>
            </div>
          </el-card>

          <!-- 日期选择 -->
<!--          <el-card class="card-container">-->
<!--            <template #header>-->
<!--              <div class="card-header">-->
<!--                <span>日期选择</span>-->
<!--              </div>-->
<!--            </template>-->
<!--            <div class="big-wrapper" style="margin-top: 10px">-->

<!--            </div>-->
<!--          </el-card>-->

          <!-- 可视化 -->
          <el-card class="card-container">
            <template #header>
              <div class="card-header">
                <span>分析可视化</span>
              </div>
            </template>
            <!-- 文件统计 -->
            <div class="big-wrapper">
              <v-chart class="chart1" :option="option2" autoresize v-loading="isLoading" style="margin-top:30px" />
            </div>

          </el-card>


        </div>


      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { reactive, onMounted, getCurrentInstance, nextTick, onBeforeMount } from "vue";
import {ArrowDown, Select} from '@element-plus/icons-vue';
// 引入echarts
import { use } from "echarts/core";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { UniversalTransition } from 'echarts/features';
import { BarChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";
import 'echarts/lib/component/dataZoom'

// 引入接口
import {
  treeCount, treeCountDate,getEnvFileList,getEnvList,getEnvFactorChange
} from "@/api/environment_factors/environment_factors";

import { getTree } from "@/api/tree.js";

use([
  GridComponent,
  UniversalTransition,
  LineChart,
  BarChart,
  CanvasRenderer,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent
]);

provide(THEME_KEY);

const arrName = ref([])
const arrCount = ref([])

// 环境因子数据
const envOptions = ref([])

// 文件数据
const fileOptions = ref([])

// 选择环境因子
const factorValue = ref([])

// 选择文件
const fileValue = ref();

// 选中环境因子的响应函数
const factorSelectHandler = () => {
  console.log('环境因子被选择了',factorValue.value[1]);
  isLoading.value = true;
  updateEcharts();
  chooseDateHandler();
}

// 选择文件的响应函数
const fileSelectHandler = () => {
  console.log('文件被选择了',fileValue.value);
  isLoading.value = true;
  updateEcharts();
}



// 日期选择
const value2 = ref('')
const startDate = ref('')
const endDate = ref('')

//日期选择的数据
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

//获取视口宽度
const viewWidth = document.documentElement.clientWidth;


//折线图图数据
const option = ref();
const seriesArr = ref([])
const nameArr = ref([])
const dateArr = ref([])
const dataArr = ref([])

//折线图数据
const option2 = ref({
  // title: {
  //   text: '文件数量变化统计',
  // },
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    top: '10%',
    right: '4%',
    bottom: '9%',
    left:'4%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: dateArr
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: dataArr,
      type: 'line',
      smooth: true,
      color:'#1FB864'
    }
  ],
  //实现下方拉动的数据
  dataZoom: [
    {
      height: 15, //高度
      type: "slider",
      xAxisIndex: [0], //控制第一个x轴
      left: '4%',
      right: '4%',
      bottom: 18, //图表底部距离
      // handleSize: 10,//左右2个滑动条的大小
      moveHandleSize: 0,
      borderColor: "#eee", //滑动通道的边框颜色
      fillerColor: '#1FB864', //滑动条颜色
      backgroundColor: '#eee',//未选中的滑动条的颜色
      showDataShadow: true,//是否显示数据阴影 默认auto
      rangeMode: ['value', 'value'],
      handleIcon: "arrow",
      handleSize: "100%",
      showDetail: false,
    }
  ],
});


//loading
const isLoading = ref(true);

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

// 树控件
const routesData = ref();
// 树的属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const treeType = ref(2);

// 加载
const loadingText = ref("加载中...");


const getTreeList = async () => {
  getTree(treeType.value, 0, 1).then((res) => {
    routesData.value = res.data;
    // getPictureNumber();
    chooseDateHandler();
  })
};


//如果month或day仅有一位，则+1
function changeDate(num) {
  if (num >= 10) {
    return num
  } else {
    return '0' + num
  }
}

//获取从开始日期到结束日期的一个列表
function getDateList() {
  dateArr.value = []
  let theStart = new Date(value2.value[0]) //开始日期
  let theEnd = new Date(value2.value[1])  //结束日期
  while (theStart <= theEnd) {
    let dateStr = theStart.getFullYear() + '-' + changeDate(theStart.getMonth() + 1) + '-' + changeDate(theStart.getDate())
    dateArr.value.push(dateStr)
    theStart = theStart.setDate(theStart.getDate() + 1)
    theStart = new Date(theStart)
  }
}

//将Date转换为八位字符串的函数
function dateToStr(obj) {
  let year = obj.getFullYear();
  let month = obj.getMonth() + 1;
  let day = obj.getDate();
  month = changeDate(month);
  day = changeDate(day)
  return year + '-'+ month + '-' + day
}

//选择日期以后的操作
async function chooseDateHandler() {
  //清空echarts中的data数据
  seriesArr.value = []
  nameArr.value = []
  dateArr.value = []
  dataArr.value = []
  isLoading.value = true;
  startDate.value = dateToStr(value2.value[0])
  endDate.value = dateToStr(new Date(value2.value[1].getTime() + 3600 * 1000 * 24))
  getDateList();
  await updateEcharts();
}


// 更新可视化图表
async function updateEcharts(){
  await getEnvFactorChange(fileValue.value,factorValue.value[1], startDate.value, endDate.value).then(res => {
    //遍历返回的数据列表并加入echarts中data
    const resData = res.data;
    resData.forEach(item=>{
      nameArr.value.push(item.date);
      dataArr.value.push(item.factor_value_0);
    })
  }).catch(err => {
    console.log(err);
  })
  isLoading.value = false;
}
// const curNode = tree.value.getCurrentNode();



onMounted(async () => {
  // value2.value = [new Date(new Date() - 90 * 24 * 3600 * 1000), new Date()];
  value2.value = [new Date(2014,4,10),new Date(2014,4,29)];
  // 请求文件列表
  await getEnvFileList('475').then(res=>{
    fileOptions.value = res.rows;
    fileValue.value = fileOptions.value[0].fileId;
 }).catch(err=>{
   console.log(err);
 })

  // 请求环境因子列表
  await getEnvList().then(res=>{
    envOptions.value = res.data;
    factorValue.value = [envOptions.value[0].id,envOptions.value[0].chidren[0].id];
  }).catch(err=>{
    console.log(err);
  })

  await getTreeList();
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

#traitPanMap {
  height: 450px;
  width: 400px;
}

/* /deep/ #traitPanMap div {
  height: 450px;
  width: 400px;
} */
:deep(#traitPanMap) div {
  height: 450px;
  width: 400px;
}

.phenome-container {
  display: flex;
  flex-direction: column;
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
  width: 95%;
  border-radius: 50px;
  margin: 10px auto;
}

.card-container .SearchBox-card {
  border-radius: 20px;
}

.big-wrapper {
  width: 90%;
  margin: auto;
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
</style>

<style lang="scss" scoped>
.image_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  max-height: calc(100vh - 190px);

  img {
    width: 100%;
  }
}

.image_item {
  box-sizing: border-box;
  margin: 10px 5px;
  border-right: 6px solid #E1E1E1;
}

.img-list {
  padding-left: 1%;
  padding-right: 1%;
  width: 100%;
  position: relative;
  right: 0;
}

.img-list .item {
  cursor: pointer;
}

.image_slot {
  width: 100%;
}
</style>



<style lang="less" scoped>
:deep(.permission-tree) {
  margin: 5px;
  background: #f2fbf7;
  min-width: 98%;
  display: inline-block;
  width: auto;
  overflow: auto;
  margin-right: 0px;
}

:deep(.el-tree-node__content) {
  border-radius: 5px;
  margin: 1px;
  color: black;
  padding: 0%;
  height: 20px;
}

:deep(.el-tree-node__expand-icon) {
  color: black;
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

      /* ^ 复选框 */
      .el-checkbox {
        margin: 0 7px 0 2px;

        .el-checkbox__inner {
          width: 14px;
          height: 14px;
          border-radius: 2px;
          border: 1px solid #bbb;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          border: 1px solid #5e7ce0;
        }
      }

      /* / 复选框 */

      .el-tree-node__content {
        small {
          font-size: 13px;
        }
      }
    }

    /* ---- ---- ---- ---- /（节点对齐）---- ---- ---- ---- */

    /* ---- ---- ---- ---- ^（文字高亮）---- ---- ---- ---- */
    .el-tree-node.is-current {
      .el-tree-node__content {
        small {
          color: #5e7ce0;
        }
      }

      .el-tree-node__children {
        small {
          color: unset;
        }
      }
    }

    /* ---- ---- ---- ---- /（文字高亮）---- ---- ---- ---- */

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

      .el-tree-node__label {
        //font-size: 8px;
      }

      //background-color: red;
    }

    /* / 设置子节点左外边距 */
    /* ---- ---- ---- ---- /（新增辅助线）---- ---- ---- ---- */
  }
}

:deep(.el-tree-node__content) {
  border-radius: 5px;
  margin: 1px;
  color: black;
  padding: 0%;
  height: 20px;
}

:deep(.el-tree-node__label) {
  font-size: 13px !important;
  padding-left: 5px;
  padding-right: 5px;
}

//一级节点选择器
:deep(.el-tree > .el-tree-node > .el-tree-node__content) {
  font-weight: 600;
  color: #80a492;
  height: 28px !important;

  .el-tree-node__label {
    font-size: 18px !important;
    font-family: "PingFang SC";
  }
}

//二级节点选择器
:deep(.el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content) {
  font-weight: 500;
  color: #99bcac;
  height: 26px !important;

  .el-tree-node__label {
    font-size: 16px !important;
  }
}

//三级节点选择器
:deep(.el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content) {
  font-weight: 400;
  height: 23px !important;

  .el-tree-node__label {
    font-size: 14px !important;
  }
}

// 设置高亮颜色
:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(rgb(#4f6f46), 0.3) !important;

  .el-tree-node__label {
    color: #4f6f46;
  }

  .el-tree-node__expand-icon {
    color: #4f6f46;
  }
}

:deep(.el-tree-node__content:hover) {
  color: #4f6f46;
  background-color: rgba(168, 191, 143, 0.3);

  .el-tree-node__expand-icon {
    color: #4f6f46;
  }
}

.mokuai {
  margin-bottom: 0;
  background-color: #f2fbf7;
  padding: 0% !important;
}

//表型类型
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


:deep(.el-button) {
  margin: 0% !important;
  margin-right: 20px !important;
}

.mytable {
  background-color: #eeeeee;
}

.table_button {
  padding: 0% !important;
  margin: 0 !important;
  margin-right: 5px !important;
}
</style>


<!-- 卡片样式 -->
<style lang="less" scoped>
.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 50px;
}

:deep(.el-card__header) {
  background: #1FB864;
  height: 60px !important;
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

:deep(.el-table__header) {
  border-bottom: 1px solid black;
  border-top: 1px solid #EBEEF5;

  th {
    font-weight: 800;
    //color: 909399;
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

.chart {
  height: 500px;
  // background-color: #bfa;
}

.chart1 {
  height:580px;
}

.chart3 {
  height: 500px;
}

.chooseNameInput,
.chooseDateInput {
  width: 180px;
}

//图片列表样式
.imgCard_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;

}


.imgBox {
  position: relative;
}

.wrapper {
  position: relative;
}


.photoDialog {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex: auto;

  .leftBox,
  .rightBox {
    width: 50%;
  }
}
</style>