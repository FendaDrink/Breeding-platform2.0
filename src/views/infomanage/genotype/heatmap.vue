<template>
  <div style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;">
    <el-card class="card-container right-box">
      <h1>基因热力图<i>&nbsp;</i></h1>
      <!-- <template #header>
        <div class="card-header">
          <span>基因热力图</span>
        </div>
      </template> -->

      <el-container>
        <el-select v-model="materialSelected" multiple placeholder="请选择材料名" style="width: 500px;" filterable>
          <el-option v-for="item in materialData" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="chrSelected" single placeholder="请选择基因型" style="width: 250px;">
          <el-option v-for="item in chrData" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="start" type="number" min="0" placeholder="请输入起始值" style="width: 250px;"></el-input>
        <el-input v-model="end" type="number" min="0" placeholder="请输入终止值" style="width: 250px;"></el-input>

        <el-button type="primary" plain icon="edit" @click="searchMaterial" class="filter-item my-button"
          v-model="selectedItem">确认</el-button>
      </el-container>
      <!-- <h1>{{ id }} {{ tableName }}</h1> -->
      <div id="main"  style="width: 80vw; height: 40vw;"></div>
    </el-card>
  </div>
</template>

<script>
import {
  getMaterialInfo,
  getMaterialList,
  getHeatMap,
  getChromRatioAndMaxPos,
  getHeatMapFit,

} from "@/api/tree";
import * as echarts from 'echarts';
export default {
  data() {
    return {
      materialData: [],
      materialSelected: [],
      xData: [],
      yData: [],
      heatMapData: [],
      chrData: [],
      chrSelected: [],
      start: '0',
      end: '1500000',
      min: 10000,
      max: -10000,
    }
  },
  async mounted() {
    await this.getHeatMapFits();
    await this.getMaterialLists();
    //this.getHeatMaps();
    //this.initGenoView();
    await this.getChr();
    this.getXData();
  },
  methods: {
    getHeatMapFits() {
      return new Promise((resolve, reject) => {
        const tableName = this.$route.query.tableName;
        getHeatMapFit(tableName).then(res => {
          this.end = res.data;
          resolve();
        })

      })
    },
    getMaterialLists() {
      return new Promise((resolve, reject) => {
        const tableName = this.$route.query.tableName;
        getMaterialList(tableName).then(res => {
          if (res.code === 200) {
            this.materialData = res.data.map((item, index) => ({ label: item, value: item, index: index })); // 将获取到的数据赋值给options数组
            this.materialSelected = res.data.slice(0, 8);
            //console.log(this.materialSelected, "llllllllllllllll");
          } else {
            console.error('获取数据失败');
          }
          resolve()
        }).catch(error => {
          reject(error)
          console.error(error);
        })
      })
    },
    getChr() {
      return new Promise((resolve, reject) => {
        const tableName = this.$route.query.tableName;
        let chrTempdata = [];
        let responseData = [];
        getChromRatioAndMaxPos(tableName).then(res => {

          responseData = res.data;
          //console.log(responseData);
          let temp = '';
          responseData.forEach((data, index) => {
            if (/^\d+$/.test(data.chrom)) temp = "chr" + data.chrom;
            else temp = data.chrom;
            chrTempdata.push(temp);
          });
          //console.log(chrTempdata,"pppppppppp");
          this.chrData = chrTempdata.map((item, index) => ({ label: item, value: responseData[index].chrom, index: index }));
          this.chrSelected = responseData[0].chrom;
          //console.log(this.chrData, "lllllllllll");
          resolve()
        });
      })

      // this.chrData = [...chrTempdata];
      //this.chrData = Array.from(chrTempdata);
      //console.log(this.chrData,"kkkkkkkkkkk");
    },
    getHeatMaps() {
      console.log("getHeatMaps");
      const tableName = this.$route.query.tableName;
      //console.log(tableName);
      let materialName = '';
      this.materialSelected.forEach((item, index) => {
        materialName += item;
        if (index < this.materialSelected.length - 1) {
          materialName += ',';
        }
      })
      //console.log(materialName);
      // console.log(this.materialSelected);
      //console.log(this.chrSelected);
      const chrName = this.chrSelected;
      const start = this.start;
      const end = this.end;
      this.heatMapData = [];

      // console.log(tableName);
      // console.log(typeof materialName);
      // console.log(chrName);
      // console.log(start);
      // console.log(end);
      getHeatMap(tableName, materialName, chrName, start, end).then(res => {
        //console.log(res,"qqqqqqqqqq");
        var tempData = [];
        tempData = res.data;
        this.heatMapData = res.data.map(function (item) {
          return [item[0] - 1, item[1] - 1, item[2] || '-'];
        });
        tempData.forEach((data, index) => {
          if (data[2] < this.min) this.min = data[2];
          if (data[2] > this.max) this.max = data[2];
        })
        this.initGenoView();
      })
    },
    isValid() {
      if (this.materialSelected.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择至少一个材料名',
          type: 'error'
        });
        return false;
      } else if (this.materialSelected.length >= 10) {
        this.$message({
          showClose: true,
          message: '请缩小选择材料数量',
          type: 'error'
        });
        return false;
      } else if (this.chrSelected.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择基因型',
          type: 'error'
        });
        return false;
      } else if (this.end < this.start || this.start < 0 || this.end < 0) {
        this.$message({
          showClose: true,
          message: '请输入正确范围',
          type: 'error'
        });
        return false;
      }
      return true;
    },
    searchMaterial() {
      if (this.isValid()) {
        this.getXData();
        console.log("yyyyyyyyyyyyyyyyyyyyy");
        //this.getHeatMaps();
      } else {
        console.log("wrong");
      }

      //this.initGenoView();
      ///////////////////////没有重新渲染图标，而是在原先的基础上新增
    },
    getXData() {
      console.log("getXData")
      this.xData = [];
      const tableName = this.$route.query.tableName;
      let materialName = this.materialSelected[0];
      // console.log(materialName);
      const chrName = this.chrSelected;
      const start = this.start;
      const end = this.end;
      console.log(tableName, materialName, chrName, start, end);
      getMaterialInfo(tableName, materialName, chrName, start, end).then(res => {
        //console.log(res, "bbbbbbb");
        let temp = '';
        res.data.forEach((data, index) => {
          if (/^\d+$/.test(data.chrom)) temp = "chr" + data.chrom;
          else temp = data.chrom;
          this.xData.push(temp + '_' + data.position);
        })
        //console.log(this.xData);
        if (this.xData.length > 40) {
          this.$message({
            showClose: true,
            message: '信息量过大，请尝试缩小范围',
            type: 'error'
          });
          //this.getHeatMaps();
        } else {
          this.getHeatMaps();
        }
      });


    },

    initGenoView() {
      console.log("initGenoView")
      var chartDom = document.getElementById('main');
      chartDom.removeAttribute('_echarts_instance_');
      var myChart = echarts.init(chartDom);
      var option;
      window.addEventListener('resize', function () {
        myChart.resize()
      })
      this.yData = this.materialSelected;
      //console.log(this.yData);
      // prettier-ignore
      // const days = [
      //   'Saturday', 'Friday', 'Thursday',
      //   'Wednesday', 'Tuesday', 'Monday', 'Sunday'
      // ];
      // prettier-ignore
      // const data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]
      //   .map(function (item) {
      //     return [item[1], item[0], item[2] || '-'];
      //   });
      option = {
        tooltip: {
          position: 'top'
        },
        grid: {
          height: '50%',
          top: '10%'
        },
        // xAxis: {
        //   type: 'category',
        //   data: this.xData,
        //   splitArea: {
        //     show: true
        //   }
        // },
        xAxis: {
          type: 'category',
          data: this.xData,
          splitArea: {
            show: true
          },
          axisLabel: {
            rotate: -90
          },
          // 添加自定义事件
          axisPointer: {
            type: 'line',
            label: {
              show: true
            },
            // handle: {
            //   show: true,
            //   onHandleDrag: function (params) {
            //     // 获取鼠标悬浮位置的坐标值
            //     var value = params.value;
            //     // 根据坐标值获取真实的坐标内容
            //     var xAxisData = hours[value];
            //     // 显示tooltip悬浮框
            //     myChart.dispatchAction({
            //       type: 'showTip',
            //       seriesIndex: 0,
            //       dataIndex: value,
            //       position: [value, 0]
            //     });
            //   }
            // }
          },
        },
        yAxis: {
          type: 'category',
          data: this.yData,
          splitArea: {
            show: true
          }
        },
        visualMap: {
          min: this.min,
          max: this.max,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%'
        },
        series: [
          {
            name: 'Punch Card',
            type: 'heatmap',
            data: this.heatMapData,
            label: {
              show: true
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      option && myChart.setOption(option);

    }
  }
}

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

</style>
  
  
<style scoped lang="less">
.wrapper {
  width: 100%;
  //background-color:blue;
}

.wrapper .chart {
  height: 30px;
  margin: 100px auto 0;
  width: 100%;
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
  margin-left: 20px !important;
  margin-right: 20px !important;
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