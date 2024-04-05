<template>
  <div style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;padding-top: 20px;">
    <el-card class="card-container right-box" v-loading="isLoading">
      <!-- <h1>染色体密度图<i>&nbsp;</i></h1> -->
      <template #header>
        <div class="card-header">
          <h1>染色体密度图<i>&nbsp;</i></h1>
        </div>
      </template>
      <v-chart style="width: 100%; height: 450px" class="echart" :option="option" autoresize v-loading="isLoading" />
<!--      <div-->
<!--        class="echart"-->
<!--        id="chr"-->
<!--        style="width: 100%; height: 450px;"-->
<!--      ></div>-->
    </el-card>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import {test} from "@/api/tree";
import {onMounted, reactive, ref} from "vue";
import VChart from "vue-echarts";
import {useRoute} from "vue-router";

const isLoading = ref(true);
const xData = ref(Array.from({ length: 6000 }, (_, index) => index + 1));
const maxNum = ref(0);
const data = ref([]);
const yData = ref([]);

const option = ref({
  xAxis: {
    type: "category",
    nameLocation: "middle",
    nameGap: 30,
    data: xData,
    splitArea: {
      show: false,
    },
    axisTick: {
      show: true,
    },
    axisLine: {
      show: true,
    },
  },
  yAxis: {
    type: "category",
    data: yData,
    axisLine: {
      show: true,
    },
    axisTick: {
      show: false,
    },
    splitArea: {
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "#ffff",
        width: 5,
      },
    },
  },
  tooltip: {
    trigger: "item",
    formatter: function (params) {
      return "Variation Density<br>" +
          params.data[0] +
          "Mb: " +
          params.data[2];
    },
  },
  visualMap: {
    min: 1, //1,//365,
    max: maxNum, //13313,//78178,
    calculable: true,
    // orient: 'horizontal',
    left: "right",
    text: ["High", "Low"],
    // bottom: '5%',
    inRange: {
      color: ["#0d6e11", "#feff08", "#d01c10"],
    },
  },
  series: [
    {
      type: "heatmap",
      data: data,
      label: {
        normal: {
          show: false,
        },
      },
      emphasis: {
        shadowBlur: 10,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
      zlevel: -1,
    },
  ],
  dataZoom: [
    {
      height: 15, //高度
      type: "slider",
      xAxisIndex: [0], //控制第一个x轴
      bottom: 18, //图表底部距离
      moveHandleSize: 0,
      borderColor: "#eee", //滑动通道的边框颜色
      fillerColor: '#1FB864', //滑动条颜色
      backgroundColor: '#eee',//未选中的滑动条的颜色
      showDataShadow: true,//是否显示数据阴影 默认auto
      rangeMode: ['value', 'value'],
      handleIcon: "arrow",
      showDetail: false,
    }
  ]
})

onMounted(()=>{
  initTem();
})

const { query, params } = useRoute()
const initTem = () => {
  // 模拟数据。改成自己数据时删掉
  const tableName = query.tableName;
  console.log(tableName);
  test(tableName).then((res) => {
    data.value = res.data;
    data.value = data.value.map(function (item) {
      maxNum.value = Math.max(maxNum.value, item[2]);
      return [item[1], item[0] - 1, item[2] || "-"];
    });

    let ySum = data.value[data.value.length - 1][1] + 1;
    for(let i = 1;i<=ySum;i++)
    {
      yData.value.push("chr" + i.toString().padStart(2, '0'));
    }

    let xNum = -1;
    for(let i = 0;i<res.data.length;i++)
    {
      if(res.data[i][1]>xNum) xNum = res.data[i][1];
    }
    xData.value = Array.from({length: xNum + 1}, (_, i) => i + 1);
    isLoading.value = false;
  });
}

// onresize(()=>{
//   //随着屏幕大小调节图表
//   isLoading.value = true;
//   myChartHot.resize();
//   isLoading.value = false;
// })
</script>

<!-- 卡片样式 -->
<style lang="less" scoped>
 .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.el-card__header) {
  background: #9abeaf;
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

.card-container {
  padding: 0px;
  background-color: #fff;
  margin: 0px 20px 20px 20px;
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
.right-box {
  margin-left: 20px;
  margin-right: 20px;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  position: relative;
  background-color: #fff;
}

.card-header:before,
.card-header:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.card-header:before {
  content: "";
  position: absolute;
  bottom: 0;
  /* 将三角形定位在box的底部 */
  left: -60px;
  /* 紧贴box的左边 */
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 60px 60px;
  /* 第一个0表示上边框无宽度，第二个0表示右边框无宽度，第三个值控制三角形的高度（即底部边框宽度），第四个值控制三角形的宽度 */
  // border-color: transparent transparent #f0f0f0 transparent;
  border-color: transparent transparent #fff transparent;
  /* 最后一个透明色表示右下角是透明的，形成直角三角形 */
}

.card-header:after {
  content: "";
  position: absolute;
  bottom: 0;
  /* 将三角形定位在box的底部 */
  right: -60px;
  /* 紧贴box的左边 */
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 60px 0 0 60px;
  /* 第一个值控制三角形的高度（现在是顶部边框宽度），第二个值为0表示无右边框，第三和第四个值分别表示下边框和左边框宽度 */
  border-color: transparent transparent transparent #fff;
  /* 第一个值是三角形的颜色，后面三个透明色分别表示右下、左下和左上角是透明的，形成朝左的直角三角形 */
}

:deep(.el-card__header) {
  // background: rgba(143, 219, 177,0.1);
  background-color: #1FB864;
  height: 60px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px !important;

  h1 {
    margin: 0%;
  }

  // width: 100px; /* 梯形底部宽度 */
  // height: 0; /* 设置元素本身高度为0，通过边框来构建形状 */
  // border-top: 60px solid red; /* 这将成为梯形的高度 */
  // border-right: 0;
  // border-bottom: 0;
  // border-right: 100px solid transparent; /* 左侧边框透明以形成斜边 */
  span {

    font-weight: 700;
    font-size: 20px;
    color: white;
    text-align: center;
    letter-spacing: 2px;
  }


}
</style>