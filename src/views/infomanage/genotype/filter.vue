<template>
  <div style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;padding-top: 20px;">
    <el-card class="card-container right-box">
      <!-- <h1>基因型数据筛选<i>&nbsp;</i></h1> -->
      <template #header>
        <div class="card-header">
          <h1>{{ $t('genotype.filter.header') }}<i>&nbsp;</i></h1>
        </div>
      </template>

      <el-container>
        <el-main class="">
          <!-- <el-container style="height: 350px"> -->
          <!-- 表格部分 -->
          <el-table @row-click="handleEdit" :data="tableData" ref="singleTable" @selection-change="handleSelectionChange"
            stripe fit highlight-current-row height="250" class="mytable el-table__body-wrapper">
            <el-table-column :label="$t('genotype.filter.label.index')" width="80px" type="index"
              align="center"></el-table-column>
            <el-table-column :label="$t('genotype.filter.label.name')" align="center" prop="label"></el-table-column>
          </el-table>
          <!-- </el-container> -->
          <div class='wrapper'>
            <div class='chart' id='chart'></div>
          </div>
          <el-slider v-model="sliderValue" range :min=min :max=max :key="sliderKey" @change="sliderChange" ref="slider"
            style="max-width: 100%">
          </el-slider>
          <el-select v-model="selectedItem" filterable :placeholder="$t('genotype.filter.label.placeholder')"
            @change="selectChange">
            <el-option v-for="item in options" :key="item.index" :label="item.label" :value="item.index">
            </el-option>
          </el-select>
          <el-button type="success" plain @click="searchMaterial" class="filter-item my-button" style="margin-left: 20px;"
            icon="search" v-model="selectedItem">{{ $t('genotype.index.search') }}</el-button>
        </el-main>
        <!-- 分页 -->
        <!-- <el-footer class="footer">
					<el-pagination v-show="total > 0" :total="total" v-model:currentPage="queryParams.pageNum"
						v-model:page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
						@size-change="getList" @current-change="getList" :background="false" />
				</el-footer> -->
      </el-container>



      <el-main>
        <el-container class="gene-informage-container">
          <div class="scrollable-content" id="geneInformageContainer">
          </div>

        </el-container></el-main>
    </el-card>
  </div>
</template>


<script>
import {
  getMaterialList,
  getChromRatioAndMaxPos,
  getMaterialInfo
} from "@/api/tree";
import * as echarts from "echarts";
import { onMounted } from "vue";

import zh from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import en from 'element-plus/lib/locale/lang/en'
import {computed} from "@vue/reactivity"; // 英文语言

const locale = computed(() => ((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? zh : en));
// let t={
//   t1 : computed(() => i18n.t('genotype.filter.t1')).value,
//   t2 : computed(() => i18n.t('genotype.filter.t2')).value,
//   t3 : computed(() => i18n.t('genotype.filter.t3')).value,
//   t4 : computed(() => i18n.t('genotype.filter.t4')).value,
// }
export default {
  data() {
    return {
      tableData: [],
      value: '',
      options: [],
      currentRow: null,
      selectedItem: null,
      start: 0,
      end: 0,
      min: 0,
      max: 0,
      geneName: '',
      sliderKey: 0,
      sliderValue: [],
    }
  },
  async mounted() {
    this.init();
    await this.getMaterialLists();
    await this.getChromRatioAndMaxPoss();
    this.drawChart();
    //this.getMaterialInfos();

    this.func();
  },

  methods: {
    init() {
      this.tableData = []
      this.value = ''
      this.options = []
      this.currentRow = null
      this.selectedItem = null
      this.start = 0
      this.end = 0
      this.min = 0
      this.max = 0
      this.geneName = ''
      this.sliderKey = 0
      this.sliderValue = []
    },
    getMaterialLists() {
      return new Promise((resove, reject) => {
        console.log("getMaterialLists");
        const tableName = this.$route.query.tableName;
        getMaterialList(tableName).then(res => {
          if (res.code === 200 & res.data.length != 0) {
            // this.options = res.data; // 将获取到的数据赋值给options数组
            this.tableData = res.data.map(item => ({ label: item, value: item })); // 将获取到的数据赋值给options数组
            this.options = res.data.map((item, index) => ({ label: item, value: item, index: index })); // 将获取到的数据赋值给options数组
            console.log(res, "lllllll");
            this.$refs.singleTable.setCurrentRow(this.tableData[0]);
            this.selectedItem = this.tableData[0].label;
            console.log(this.selectedItem);


            const rows = document.querySelectorAll('.el-table__body-wrapper tbody tr');
            // 遍历所有行
            rows.forEach((row, index) => {
              // 在这里执行对每一行的操作
              //console.log(row); // 打印每一行的DOM元素
              row.id = index.toString();
            });
            resove();
          } else {
            console.error('获取数据失败');
          }
        }).catch(error => {
          reject(error);
          console.error(error);
        })

        // 获取el-table中的所有行

      })

    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      //this.currentRow = val;
    },
    searchMaterial() {
      //this.getMaterialInfos();
      this.func();
    },
    selectChange(value) {
      this.selectedItem = this.tableData[value].label;
      //console.log(value,"vvv");
      this.$refs.singleTable.setCurrentRow(this.tableData[value]);
      this.scrollToRow(value);
    },

    handleEdit(row) {
      this.selectedItem = row.label;
    },
    handleSelectionChange(selection) {
      this.selectedItem = selection[0];
    },
    sliderChange(val) {
      this.start = val[0];
      this.end = val[1];
      this.sliderValue = val;
    },
    scrollToRow(rowNumber) {
      const Tbody = this.$refs.singleTable.$el.querySelector('.el-table__body-wrapper');
      setTimeout(() => {
        Tbody.querySelector('.current-row')?.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' })
      }, 300);
    },
    resetSlider(min, max) {
      this.min = min;
      this.max = max;
      // console.log(this.min,"mmmmmin");
      // console.log(this.max,"mmmmmmax");
      this.start = this.min;
      this.end = this.max;
      //this.sliderValue[0] = min;
      //this.sliderValue[1] = max;
      this.sliderValue = [min, max];
      //this.sliderKey += 1;
      //console.log(this.min,this.max,this.start,this.end,this.sliderValue,"///////////");
      console.log(this.sliderValue, "ppppppppp");

      //this.$refs.slider.syncValue();
      //this.$refs.slider.$forceUpdate();
      //this.$refs.slider.set(this,'slider',[min,max]);  // 常用的vue更新视图方法，解决vue2双向绑定问题
    },
    getChromRatioAndMaxPoss() {
      return new Promise((resove, reject) => {
        const tableName = this.$route.query.tableName;
        getChromRatioAndMaxPos(tableName).then(res => {
          this.responseData = res.data;
          this.test_series = [];
          console.log(this.responseData);
          this.geneName = this.responseData[0].chrom;
          let temp = '';
          this.responseData.forEach((data, index) => {
            if (/^\d+$/.test(data.chrom)) temp = "chr" + data.chrom;
            else temp = data.chrom;
            this.test_series.push({
              type: 'bar',
              name: temp,
              stack: '总量',
              //barMaxWidth: 20,
              label: {
                show: true,
                position: 'inside',
                formatter: '{a}'
              },
              itemStyle: {
                color: '#9ABEAF',
                borderWidth: 1, //设置border的宽度有多大
                borderColor: '#fff',
              },
              //data: data.ratio
              data: [data.ratio]
            });
            this.test_series[0].itemStyle = {
              color: '#409EFF',
              borderWidth: 1, //设置border的宽度有多大
              borderColor: '#fff',
            };
          });
          this.resetSlider(this.responseData[0].min, this.responseData[0].max);
          //this.func();
          resove();
        }).catch(error => {
          reject(error);
        })
      })
    },

    drawChart() {
      let chart = echarts.init(document.getElementById('chart'));
      let chartDom = document.getElementById('chart');
      chartDom.removeAttribute('_echarts_instance');
      window.addEventListener('resize', function () { chart.resize() });
      console.log(this.test_series, "iii");

      chart.setOption({
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        grid: {
          top: "0px",
          left: "0px",
          right: "0px",
          bottom: "0px",
          //height: "29px",// 高度
          containLabel: true
        },
        // tooltip: {
        // 	trigger: 'axis',
        // 	axisPointer: {
        // 		type: 'none'
        // 	},
        // 	textStyle: {
        // 		color: '#cdd3ee'
        // 	},
        // 	formatter: '{b}<br />{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}: {c2}%'
        // },
        legend: {
          show: false,
          selectedMode: "true",
          //data: ['已完成', '进行中', '未完成']
        },
        xAxis: {
          type: 'value',
          min: 0,  // 设置最小刻度值
          max: 1,  // 设置最大刻度值
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#cdd3ee'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false,
              fontSize: 16,
              color: '#cdd3ee',
              formatter: '{value}'
            },
          }
        ],
        series: this.test_series,
        aria: {
          enabled: true,
          decal: {
            show: true,
            decals: {
              symbol: 'line',
              rotation: 0.423,
              color: 'rgba(250, 200, 88,0.8)',
              dashArrayX: [10, 0],
              dashArrayY: [10, 0],
            }
          }
        },
      });
      // chart.on('click', function(params) {
      //   // 控制台打印数据的名
      //   this.geneName = params.seriesName;
      //   console.log(this.geneName);
      // });
      chart.on('click', (params) => {
        // 控制台打印数据的名
        this.geneName = this.responseData[params.seriesIndex].chrom
        console.log(params, "ppppppp");
        //console.log(this.responseData,"qqqqqqqq");
        this.resetSlider(this.responseData[params.seriesIndex].min, this.responseData[params.seriesIndex].max);



      });

      chart.on('click', (params) => {
        //console.log(this.test_series);
        //console.log(series);
        for (let i = 0; i < this.test_series.length; i++) {
          if (i === params.seriesIndex) {
            this.test_series[i].itemStyle = {
              color: '#409EFF',
            };
          } else {
            this.test_series[i].itemStyle = {
              color: '#9ABEAF',
            };
          }
        }
        chart.setOption({ series: this.test_series });
      });
      // this.func();

    },

    initPresentationBox(box_num) {
      const container = document.getElementById("geneInformageContainer");

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      for (let i = 0; i < box_num; i++) {
        // const popover = document.createElement('el-popover');
        // popover.title = 'Popover Title';
        // popover.content = '这是一段内容,这是一段内容,这是一段内容,这是一段内容。';
        // popover.width = '200px';
        // popover.trigger = 'hover';
        // popover.className = 'popover';
        // container.appendChild(popover);


        // const buttonDetail = document.createElement('el-button');
        // buttonDetail.slot='reference';
        // buttonDetail.innerHTML = 'dianji';
        // buttonDetail.height = "100px";
        // container.appendChild(buttonDetail);

        const bigdiv = document.createElement("div");
        bigdiv.className = "child-div";
        container.appendChild(bigdiv);

        const smalldiv1 = document.createElement("div");
        const smalldiv2 = document.createElement("div");
        const smalldiv3 = document.createElement("div");
        smalldiv1.className = "upper-child-div";
        smalldiv2.className = "lower-child-div";
        smalldiv3.className = "additional-div";
        bigdiv.appendChild(smalldiv1);
        bigdiv.appendChild(smalldiv2);
        bigdiv.appendChild(smalldiv3);


        const textDiv = document.createElement("div");
        textDiv.className = "textDiv";
        smalldiv1.appendChild(textDiv);

      };

    },

    func() {
      // setTimeout(() => {
      console.log("this.func");
      const tableName = this.$route.query.tableName;
      const materialName = this.selectedItem;
      // console.log(materialName);
      //const materialName = 'MG_1000';
      const geneName = this.geneName;
      const start = this.start;
      const end = this.end;
      console.log(tableName, materialName, geneName, start, end);
      getMaterialInfo(tableName, materialName, geneName, start, end).then(res => {
        //getMaterialInfo('genotype_maize_amp507_998191','04K5672','chr1',start,end).then(res =>{
        console.log(res);
        const box_num = res.data.length;
        this.initPresentationBox(box_num);

        //const textDiv = document.getElementById("textDiv");
        //textDiv.textContent = "123";

        const materialData = res.data;
        const elements1 = [...document.getElementsByClassName("textDiv")];
        const elements2 = [...document.getElementsByClassName("lower-child-div")];
        const bigdivs = document.getElementsByClassName('child-div');
        materialData.forEach((data, index) => {
          //console.log(data,index,"iiiiiiiiiii");
          let temp = '';
          if (/^\d+$/.test(data.chrom)) temp = "chr" + data.chrom;
          else temp = data.chrom;
          const text1 = temp + '_' + data.position;

          elements1[index].textContent = '';
          elements1[index].textContent = text1;
          let text2 = '';

          if (data.original === "0/0") {
            text2 = data.ref + "/" + data.ref;
          } else if (data.original === "0/1") {
            text2 = data.ref + "/" + data.alt;
          } else if (data.original === "1/1") {
            text2 = data.alt + "/" + data.alt;
          }
          elements2[index].textContent = '';
          elements2[index].textContent = text2;


          bigdivs[index].addEventListener("mouseover", function () {
            const hoverDiv = document.createElement("div");
            if(localStorage.getItem('lang') === 'en')
            {
              hoverDiv.innerHTML = 'Chrom: ' + temp + "<br>" + 'Position: ' + data.position + "<br>" + 'Marker: ' + text1 + "<br>" + 'Info: ' + text2;
            }else{
              hoverDiv.innerHTML = '染色体：' + temp + "<br>" + '位置：' + data.position + "<br>" + '标记编号：' + text1 + "<br>" + '基因信息：' + text2;
            }
            
            hoverDiv.className = "hoverDiv";
            bigdivs[index].insertBefore(hoverDiv, bigdivs[index].firstChild);
          });

          bigdivs[index].addEventListener("mouseout", function () {
            const hoverDiv = document.querySelector(".hoverDiv");
            hoverDiv.remove();
          });
        })


      }).catch(err => {
        console.log(err);
      })
      // }, 2000);

    },


  }
}
</script>


<style scoped lang="less">
.wrapper .chart {
  height: 30px;
  margin: 0 auto;
  width: 100%;
  //background-color: blue;
}
</style>

<style lang="less">
.gene-informage-container {
  height: auto;
  width: 100%;
  background-color: #F2F4F3;
  margin-top: 50px;
  overflow-x: auto;
}

.scrollable-content {
  /* 给内容容器设置一个适当的高度，以便内容超过这个高度时出现滚动条 */
  height: 100%;
  display: flex;
  /* 使用flex布局 */
  //flex-wrap: wrap; /* 当一行放不下所有子元素时换行 */
}

.child-div {
  height: 220px;
  margin: 5px;
  // background-color:blue;
  display: inline-block;
  width: 50px;

}

.child-div:hover {
  /* Add your hover styles here */
  background-color: lightgray;
  border: 1px solid #9ABEAF;
  cursor: pointer;
  position: relative;
}

.additional-div {
  display: none;
  position: absolute;
  width: 200px;
  height: 100px;
  background-color: lightblue;
  z-index: 1;
}

.hoverDiv {
  position: absolute;
  top: 0px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 999;
  max-width: 300px;
  min-width: 200px;

  word-break: break-all !important;

  border-radius: 5px;
  background-color: rgba(0, 75, 28, 0.9);
  color: aliceblue;
  font-size: 13px;
  text-align: center;
}



.upper-child-div {
  height: 80%;
  margin: 2px;
  // background-color: #9ABEAF;
  //position:absolute;

  // writing-mode: vertical-rl;
  // text-orientation: upright;
  //width:30px;
}

.textDiv {
  // padding-top:35px;
  // display: inline-block;
  // transform: rotate(90deg);
  // transform-origin: right;
  // background-color:orange;

  // position:relative;
  // //top:20px;
  // right:0;
  // text-align: center;
  // width:100%;
  // height:20px;

  margin-left: 20px;
  display: block;
  transform: rotate(90deg);
  transform-origin: bottom left;
  white-space: nowrap;
  color: #2B86CF;
  font-weight: 600;
}

.lower-child-div {
  height: 15%;
  padding: 3px;
  margin: 2px;
  // background-color: green;
  text-align: right;
  //width:100%;
  word-break: break-all;
  //max-width:150px;
  //width:auto;


  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  //max-width: 200px;
}

// .lower-child-div:hover {
//   white-space: normal;
//   overflow: visible;
//   text-overflow: unset;
// }
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
:deep(.el-radio) {
  width: 30%;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  position: relative;
  background-color: #fff;
  width: auto;
  min-width:150px;
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
  background: #1FB864;
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
  color: #1FB864;
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
