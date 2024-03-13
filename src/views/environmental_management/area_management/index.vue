<template>
  <div class="big_container home" style="width: 100%; height:100%; background-color: #eeeeee;">
    <!-- 地图 -->
    <el-card class="card-container">
      <div class="big-wrapper" style="margin-top: 10px">
        <div class="map_sys">
          <!-- 城市表格 -->
          <div class="city_form">
            <el-form label-width="100px" :model="cityForm">
              <el-form-item class="cityForm_item" label="城市">
                <el-input disabled v-model="cityForm.city" />
              </el-form-item>
              <el-form-item class="cityForm_item" label="国家">
                <el-input disabled v-model="cityForm.country" />
              </el-form-item>
              <el-form-item class="cityForm_item" label="经度">
                <el-input disabled v-model="cityForm.longitude" />
              </el-form-item>
              <el-form-item class="cityForm_item" label="纬度">
                <el-input disabled v-model="cityForm.latitude" />
              </el-form-item>
            </el-form>
          </div>
          <!-- 地图 -->
          <div id="chinaMap" style="width: 750px; height: 450px"></div>
        </div>
      </div>
    </el-card>
    <el-card class="card-container">
      <h1>根据地区搜索环境因子<i>&nbsp;</i></h1>
      <!-- <template #header>
        <div class="card-header">
          <span>根据地区搜索性状</span>
        </div>
      </template> -->
      <div class="big-wrapper" style="margin-top: 10px">
        <div class="area_top">
          <div class="search_table">
            <el-select v-model="location" filterable placeholder="请输入地区名">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button icon="search" @click="search_trait" type="primary" style="margin-left: 25px">
              搜索
            </el-button>
          </div>
        </div>
        <div class="area_form">
          <el-table v-loading="traitLoading" ref="multipleTable" :data="
            tableData2.slice(
              (currentpageNum2 - 1) * pageSize2,
              currentpageNum2 * pageSize2
            )
          " tooltip-effect="dark" style="width: 100%" class="gene-form-table" stripe>
            <!-- <el-table-column prop="traitId" label="性状代码"></el-table-column> -->
            <el-table-column label="序号" width="80" type="index" :index="indexMethod" align="center" />
            <el-table-column prop="factorName" label="环境因子名" width="130px" align="center">
              <template #default="scope">
                {{ formatTableCell(scope.row.factorName) }}
              </template>
            </el-table-column>
            <el-table-column prop="factorFullName" label="全称" width="280px" align="center">
              <template #default="scope">
                {{ formatTableCell(scope.row.factorFullName) }}
              </template>
            </el-table-column>
            <el-table-column prop="factorAbbreviationName" label="缩写" width="120px" align="center">
              <template #default="scope">
                {{ formatTableCell(scope.row.factorAbbreviationName) }}
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" align="center">
              <template #default="scope">
                {{ formatTableCell(scope.row.remark) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="demo-pagination-block">
            <el-pagination background :total="totalPage2" :current-page="currentpageNum2" :page-size="pageSize2"
                           layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange2"
                           @current-change="handleCurrentChange2" />
          </div>
        </div>
      </div>
    </el-card>
    <!-- 经纬度信息 -->
    <el-card class="card-container">
      <h1>根据环境因子搜索地区<i>&nbsp;</i></h1>
      <!-- <template #header>
        <div class="card-header">
          <span>根据性状搜索地区</span>
        </div>
      </template> -->
      <div class="big-wrapper" style="margin-top: 10px">
        <div class="area_top">
          <div class="search_table">
            <el-select v-model="factorName" filterable remote reserve-keyword placeholder="请输入环境因子名"
                       :remote-method="remoteMethod" :loading="reqLoading" @change="Screening(value)">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>

            <el-button icon="search" @click="search_city" type="primary" style="margin-left: 25px">
              搜索
            </el-button>
          </div>
        </div>
        <div class="area_form">
          <el-table v-loading="cityLoading" ref="multipleTable" :data="
            tableData.slice(
              (currentpageNum - 1) * pageSize,
              currentpageNum * pageSize
            )
          " tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" class="gene-form-table"
                    stripe>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="type" label="数据源类型" align="center"></el-table-column>
            <el-table-column prop="city" label="城市" align="center"></el-table-column>
            <el-table-column prop="longitude" label="经度" align="center"></el-table-column>
            <el-table-column prop="latitude" label="纬度" align="center"></el-table-column>
          </el-table>
          <div class="demo-pagination-block">
            <el-pagination background :total="totalPage" :current-page="currentpageNum" :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" />
          </div>

        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { reactive, ref, nextTick, onMounted } from "vue";
import chinaData from "echarts/map/json/china.json";
import { FIRST_LAST_KEYS } from "element-plus";
import {
  getMap,
  getLocationByFactor,
  selectFactorByLocation,
  getAllFactorFromFile,
} from "@/api/environmental_management/area_management";

// 注册中国地图
echarts.registerMap("china", chinaData);

//城市
const cityForm = ref({
  city: "",
  country: "",
  longitude: "",
  latitude: "",
});

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

//搜索
const factorName = ref("");
const location = ref("");

//加载
const traitLoading = ref(false);
const cityLoading = ref(false);

const states = ref([]);
const states2 = ref([]);

//获得地图信息
function getMaps() {
  getMap().then((res) => {
    console.log(res, "jjj");
    if (res.code === 200) {
      const mapData = MapOption.series[0].data;
      res.data.forEach((item) => {
        const { count, area:location } = item;
        const mapItem = mapData.find((dataItem) => dataItem.name === location);
        if (mapItem) {
          mapItem.value = count;
        }
        if (location !== undefined) {
          states.value.push(location);
          options.value = states.value.map((item) => {
            return { value: item, label: item };
          });
        }
        options.value = states.value.map((item) => {
          return { value: item, label: item };
        });
      });
    }
    initCharts();
    // 模拟点击北京
    const defaultLocation = "北京";
    // 将 location.value 设置为北京
    location.value = defaultLocation;
    console.log("1");
    mapcharts.dispatchAction({
      type: "click",
      name: defaultLocation,
    });
    console.log("2");
  });
  getAllFactorFromFile().then((res) => {
    console.log(res, "9090");
    res.data.map((item) => {
      states2.value.push(item.factorName);
    });
  });
}

function formatTableCell(value) {
  console.log(value, "jhjhk");
  return value || "-"; // 如果值为空，返回'-'
}
//选择框

const value = ref("");
const reqLoading = ref(false);
const options = ref([]);
const options2 = ref([]);
function remoteMethod(query) {
  if (query !== "") {
    reqLoading.value = true;
    setTimeout(() => {
      reqLoading.value = false;
      //输入关键词后显示的列表
      options2.value = listSet.value.filter((item) => {
        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
      });
    }, 200);
  } else {
    options2.value = [];
  }
}

const listSet = computed(() => {
  return states2.value.map((item) => {
    return { value: item, label: item };
  });
});

watch(states2, () => {
  listSet.value = states2.value.map((item) => {
    return { value: item, label: item };
  });
});

//信息
const form = ref({});

const tableData = ref([]);
const tableData2 = reactive([]);

const addDialog = ref(false);

function addData() {
  addDialog.value = true;
}

//分页
const pageSize = ref(10);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

const handleSizeChange = (val) => {
  pageSize.value = val;
};

const handleCurrentChange = (val) => {
  currentpageNum.value = val;
  localStorage.setItem("currentPageNum", val);
};

//分页2
const pageSize2 = ref(10);
const totalPage2 = ref(0);
const currentpageNum2 = ref(1); //当前页数

const handleSizeChange2 = (val) => {
  pageSize2.value = val;
};

const handleCurrentChange2 = (val) => {
  currentpageNum2.value = val;

  localStorage.setItem("currentPageNum", val);
};

//地图数据
const MapOption = {
  series: [
    {
      type: "map",
      map: "china",
      layoutCenter: ["40%", "50%"], // 地图布局中心点
      layoutSize: 270,
      label: {
        show: FIRST_LAST_KEYS,
        color: "#ffffff",
        fontSize: 10,
      },
      itemStyle: {
        areaColor: "#eee",
        borderColor: "#24dafe",
      },
      roam: true,
      zoom: 2, // 初始缩放级别
      scaleLimit: { min: 1, max: 5 }, // 设置缩放范围
      emphasis: {
        label: {
          color: "#fff",
          fontSize: 12,
          fontWeight: "bold",
        },
        itemStyle: {
          areaColor: "none",
          borderColor: "#ff",
          borderWidth: 2,
        },
      },
      data: [
        { name: "北京", value: 0, selected: true },
        { name: "天津", value: 0 },
        { name: "上海", value: 0 },
        { name: "重庆", value: 0 },
        { name: "河北", value: 0 },
        { name: "河南", value: 0 },
        { name: "云南", value: 0 },
        { name: "辽宁", value: 0 },
        { name: "黑龙江", value: 0 },
        { name: "湖南", value: 0 },
        { name: "安徽", value: 0 },
        { name: "山东", value: 0 },
        { name: "新疆", value: 0 },
        { name: "江苏", value: 0 },
        { name: "浙江", value: 0 },
        { name: "江西", value: 0 },
        { name: "湖北", value: 0 },
        { name: "广西", value: 0 },
        { name: "甘肃", value: 0 },
        { name: "山西", value: 0 },
        { name: "内蒙古", value: 0 },
        { name: "陕西", value: 0 },
        { name: "吉林", value: 0 },
        { name: "福建", value: 0 },
        { name: "贵州", value: 0 },
        { name: "广东", value: 0 },
        { name: "青海", value: 0 },
        { name: "西藏", value: 0 },
        { name: "四川", value: 0 },
        { name: "宁夏", value: 0 },
        { name: "海南", value: 0 },
        { name: "台湾", value: 0 },
        { name: "香港", value: 0 },
        { name: "澳门", value: 0 },
      ],
    },
  ],
  visualMap: [
    {
      type: "piecewise",
      show: false,
      pieces: [
        { min: 0, max: 0 },
        { min: 0, max: 9999 },
      ],
      textStyle: {
        color: "#828994",
      },
      itemWidth: 64, // 每个图元的宽度
      itemHeight: 12,
      top: "top",
      right: "0",
      inRange: {
        borderRadius: 4,
        color: ["#70b4ff", "rgb(225, 251, 56)"],
      },
    },
  ],
  tooltip: {
    trigger: "item", //数据项图形触发
    backgroundColor: "#fff",
    borderWidth: 0,
    formatter: "地区：{b}<br/>数据：{c}",
  },
  toolbox: {
    show: true,
    orient: "vertical",
    left: "right",
    bottom: "0",
    feature: {
      saveAsImage: {},
    },
  },
};

let provinceData = {
  北京: {
    city: "北京",
    country: "中国",
    longitude: "116.4074",
    latitude: "39.9042",
  },
  天津: {
    city: "天津",
    country: "中国",
    longitude: "117.2008",
    latitude: "39.0840",
  },
  河北: {
    city: "河北",
    country: "中国",
    longitude: "114.5025",
    latitude: "38.0455",
  },
  山西: {
    city: "山西",
    country: "中国",
    longitude: "112.5489",
    latitude: "37.8706",
  },
  内蒙古: {
    city: "内蒙古",
    country: "中国",
    longitude: "111.7510",
    latitude: "40.8415",
  },
  辽宁: {
    city: "辽宁",
    country: "中国",
    longitude: "123.4315",
    latitude: "41.8057",
  },
  吉林: {
    city: "吉林",
    country: "中国",
    longitude: "125.3235",
    latitude: "43.8171",
  },
  黑龙江: {
    city: "黑龙江",
    country: "中国",
    longitude: "126.5350",
    latitude: "45.8038",
  },
  上海: {
    city: "上海",
    country: "中国",
    longitude: "121.4737",
    latitude: "31.2304",
  },
  江苏: {
    city: "江苏",
    country: "中国",
    longitude: "118.7969",
    latitude: "32.0603",
  },
  浙江: {
    city: "浙江",
    country: "中国",
    longitude: "120.1551",
    latitude: "30.2741",
  },
  安徽: {
    city: "安徽",
    country: "中国",
    longitude: "117.2857",
    latitude: "31.8616",
  },
  福建: {
    city: "福建",
    country: "中国",
    longitude: "119.2965",
    latitude: "26.0745",
  },
  江西: {
    city: "江西",
    country: "中国",
    longitude: "115.8169",
    latitude: "28.6366",
  },
  山东: {
    city: "山东",
    country: "中国",
    longitude: "117.0009",
    latitude: "36.6753",
  },
  河南: {
    city: "河南",
    country: "中国",
    longitude: "113.6654",
    latitude: "34.7570",
  },
  湖北: {
    city: "湖北",
    country: "中国",
    longitude: "114.2986",
    latitude: "30.5951",
  },
  湖南: {
    city: "湖南",
    country: "中国",
    longitude: "112.9823",
    latitude: "28.1941",
  },
  广东: {
    city: "广东",
    country: "中国",
    longitude: "113.2644",
    latitude: "23.1291",
  },
  广西: {
    city: "广西",
    country: "中国",
    longitude: "108.3275",
    latitude: "22.8152",
  },
  海南: {
    city: "海南",
    country: "中国",
    longitude: "110.3492",
    latitude: "20.0174",
  },
  重庆: {
    city: "重庆",
    country: "中国",
    longitude: "106.5516",
    latitude: "29.5630",
  },
  四川: {
    city: "四川",
    country: "中国",
    longitude: "104.0758",
    latitude: "30.6519",
  },
  贵州: {
    city: "贵州",
    country: "中国",
    longitude: "106.7072",
    latitude: "26.5982",
  },
  云南: {
    city: "云南",
    country: "中国",
    longitude: "102.7123",
    latitude: "25.0406",
  },
  西藏: {
    city: "西藏",
    country: "中国",
    longitude: "91.1172",
    latitude: "29.6469",
  },
  陕西: {
    city: "陕西",
    country: "中国",
    longitude: "108.9542",
    latitude: "34.2655",
  },
  甘肃: {
    city: "甘肃",
    country: "中国",
    longitude: "103.8263",
    latitude: "36.0594",
  },
  青海: {
    city: "青海",
    country: "中国",
    longitude: "101.7801",
    latitude: "36.6209",
  },
  宁夏: {
    city: "宁夏",
    country: "中国",
    longitude: "106.2782",
    latitude: "38.4664",
  },
  新疆: {
    city: "新疆",
    country: "中国",
    longitude: "87.6177",
    latitude: "43.7928",
  },
  台湾: {
    city: "台湾",
    country: "中国",
    longitude: "120.9605",
    latitude: "23.6978",
  },
  香港: {
    city: "香港",
    country: "中国",
    longitude: "114.1694",
    latitude: "22.3193",
  },
  澳门: {
    city: "澳门",
    country: "中国",
    longitude: "113.5491",
    latitude: "22.1987",
  },
};

let mapcharts; // 声明一个变量用于保存地图实例

function initCharts() {
  let chinaMap = document.querySelector("#chinaMap");
  mapcharts = echarts.init(chinaMap); // 保存地图实例到全局变量
  MapOption && mapcharts.setOption(MapOption);

  // 地图点击事件处理
  mapcharts.on("click", (params) => {
    location.value = params.name;
    traitLoading.value = true;
    let selectedProvince = location.value;
    selectFactorByLocation(selectedProvince).then((res) => {
      if (res.code === 200) {
        updateTableData2(res.data);
        traitLoading.value = false;
        totalPage2.value = res.data.length;
      }
    });

    if (provinceData[selectedProvince]) {
      Object.assign(cityForm.value, provinceData[selectedProvince]);
    } else {
      Object.assign(cityForm.value, {
        city: "",
        country: "",
        longitude: "",
        latitude: "",
      });
    }
  });
  // 窗口大小调整事件处理
  window.addEventListener("resize", () => {
    mapcharts.resize();
  });
}

const areaData = ref([]);

async function search_city() {
  areaData.value = [];
  if (factorName.value !== "") {
    cityLoading.value = true;
    const res = await getLocationByFactor(factorName.value);
    if (res.code === 200) {
      res.data.map((item) => {
        if (item !== null) {
          areaData.value.push(item);
        }
      });
      totalPage.value = areaData.value.length;
      tableData.value = matchedData(areaData.value);

      cityLoading.value = false;
    }
  } else {
    $modal.msg("请先选择环境因子名！");
  }

  cityLoading.value = false;
}

//用于更新tableData的函数
function updateTableData2(data) {
  tableData2.splice(0, tableData2.length, ...data);
}

// 通过地区名获取该地区所有数据
async function search_trait() {
  const selectedLocation = location.value;
  let selectedProvince = location.value;
  traitLoading.value = true;

  // 清除地图的所有选中状态
  mapcharts.dispatchAction({
    type: "unSelectAll",
  });

  // 更新地图高亮
  MapOption.series[0].data.forEach((item) => {
    item.selected = item.name === selectedLocation;
  });

  // 设置选中状态
  mapcharts.dispatchAction({
    type: "select",
    name: selectedLocation,
  });

  if (provinceData[selectedProvince]) {
    Object.assign(cityForm.value, provinceData[selectedProvince]);
  } else {
    Object.assign(cityForm.value, {
      city: "",
      country: "",
      longitude: "",
      latitude: "",
    });
  }

  // 使用全局保存的地图实例进行设置
  /*  mapcharts.setOption(MapOption); */

  selectFactorByLocation(location.value).then((res) => {
    if (res.code === 200) {
      updateTableData2(res.data);
      totalPage2.value = res.data.length;
      traitLoading.value = false;
    }
  });
}

function matchedData(data) {
  // 根据省份名称匹配经纬度
  return data.map((province) => ({
    name: province,
    type: "Local", // 请替换为真实的数据源类型
    city: provinceData[province].city,
    longitude: provinceData[province].longitude,
    latitude: provinceData[province].latitude,
    year: "年份", // 请替换为真实的年份
  }));
}

// 在您的 onMounted 函数内
onMounted(() => {
  initCharts();
  getMaps();

  location.value = "北京";
  traitLoading.value = true;
  let selectedProvince = location.value;
  selectFactorByLocation(selectedProvince).then((res) => {
    if (res.code === 200) {
      updateTableData2(res.data);
      traitLoading.value = false;
      totalPage2.value = res.data.length;
    }
  });

  if (provinceData[selectedProvince]) {
    Object.assign(cityForm.value, provinceData[selectedProvince]);
  } else {
    Object.assign(cityForm.value, {
      city: "",
      country: "",
      longitude: "",
      latitude: "",
    });
  }

  // 在这里更新表格数据或执行其他必要的操作
  totalPage.value = tableData.length;

  factorName.value = ' PTD1'
  search_city()
});

// 页面加载时调用 initCharts
window.addEventListener("DOMContentLoaded", function () {
  // 初始化地图和设置默认地区为北京
  initCharts();

  // 模拟点击北京事件
  const defaultLocation = "北京"; // 设置默认地区为北京，你可以根据需要修改
  mapcharts.dispatchAction({
    type: "click",
    name: defaultLocation,
  });
  location.value = defaultLocation;
});
</script>

<style lang="less" scoped>
.card-container {
  // width: 97%;
  // border-radius: 50px;
  // margin: auto;
  // margin-top: 10px;

  // :deep(.el-card__body) {
  //   padding: 15px 20px 20px 20px !important;
  // }

  padding: 20px 20px 0px;
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

.big-wrapper {
  margin: auto;
}

.area_top {
  display: flex;
  flex-direction: row;
  margin: 20px auto;
  justify-content: space-between;

  .search_table {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    float: right;
  }
}

.map_sys {
  display: flex;

  .city_form {
    width: 38%;
    margin-left: -40px;
    position: relative;

    .cityForm_item {
      margin-top: 3vw;
    }
  }
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

#chinaMap {
  padding-left: 50px;
}
</style>


<!-- 卡片样式 -->
<style lang="less" scoped>
// .card-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// }

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

// :deep(.el-table__header) {
//   border-bottom: 1px solid black;
//   border-top: 1px solid #EBEEF5;

//   th {
//     font-weight: 800;
//     font-size: 16PX;
//     background: #FAFAFA !important;
//     letter-spacing: 2px;
//     height: 60px !important;
//   }
// }

:deep(.el-table__cell) {
  .cell {
    word-break: break-word;
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
:deep( .el-pagination .btn-prev,.el-pagination .btn-next) {
  background-color: #fff !important;
}

/* 修改未点击时的数字方块背景颜色 */
:deep( .el-pagination .el-pager li:not(.active):not(.disabled):hover) {
  background-color: #EEEEEE !important;
}

/* 未点击时的数字方块背景颜色 */
:deep( .el-pagination .el-pager li:not(.active):not(.disabled)) {
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