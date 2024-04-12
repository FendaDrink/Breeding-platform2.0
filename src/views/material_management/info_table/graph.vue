<template>
  <!-- <div style="
      background: #f6f6f6;
      min-height: 91vh;
      padding: 10px;
      border: 1px solid #f6f6f6;
    ">
    <div style="
        background: #9abeaf;
        margin: 10px 0;
        color: white;
        height: 50px;
        border-radius: 10px;
        line-height: 50px;
        padding-left: 10px;
        box-shadow: var(--el-box-shadow-lighter);
      ">
      关系图
    </div>
    <div style="position: relative">
      <div style="
          background: green;
          height: 3px;
          width: 50px;
          position: absolute;
          left: 10px;
          top: 10px;
        "></div>
      <div style="position: absolute;left: 65px;top: 0px;">父本</div>
      <div style="
          background: red;
          height: 3px;
          width: 50px;
          position: absolute;
          left: 100px;
          top: 10px;
        "></div>
      <div style="position: absolute;left: 155px;top: 0px;">母本</div>
      <div style="float: right">
        <el-button type="primary" @click="screenshotAndSave"><el-icon>
            <Download />
          </el-icon></el-button>
      </div>
      <div id="mynetwork" style="
          width: 100%;
          height: 70vh;
          border: none;
          background: #fff;
          border-radius: 10px;
        "></div>
    </div>
  </div> -->
  <div style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;padding-top: 20px;">
    <el-card class="card-container right-box">
      <!-- <h1>关系图<i>&nbsp;</i></h1> -->
      <template #header>
      <div class="card-header">
        <span>关系图</span>
      </div>
    </template>

      <first-chart></first-chart>
      <second-chart></second-chart>
      <third-chart></third-chart>
      <fourth-chart></fourth-chart>
      <fifth-chart></fifth-chart>
      <sixth-chart></sixth-chart>
      <seventh-chart></seventh-chart>
      <eighth-chart></eighth-chart>
    </el-card>
  </div>
</template>
<!-- <script setup>
import { getRelations } from "../../../api/material";
import html2canvas from "html2canvas";
import {
  DataSet,
  Network,
} from "vis-network/standalone/umd/vis-network.min.js";
const route = useRoute();
const options = [];

const fetchGraph = () => {
  getRelations(route.query.id).then((res) => {
    console.log(route.query.id)
    let relations = res.data;
    console.log(res.data)
    const nodeArr = [],
      edgeArr = [];
    const uniqueNodes = new Set();

    relations.forEach((relation, index) => {
      if (!uniqueNodes.has(relation.material_id)) {
        nodeArr.push({
          id: relation.material_id,
          label: relation.material_id,
          color: "#f6f6f6",
          shape: "box",
        });
        uniqueNodes.add(relation.material_id);
      }
      if (!uniqueNodes.has(relation.parent)) {
        nodeArr.push({
          id: relation.parent,
          label: relation.parent,
          color: "#f6f6f6",
          shape: "box",
        });
        uniqueNodes.add(relation.parent);
      }
      edgeArr.push({
        from: relation.parent,
        to: relation.material_id,
        color: relation.flag === 1 ? "#EE0001" : "#83EC86",
      });
    });

    var nodes = new DataSet(nodeArr);
    var edges = new DataSet(edgeArr);

    const container = document.getElementById("mynetwork");

    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {
      physics: {
        enabled: false,
      },
      layout: {
        hierarchical: {
          parentCentralization: false,
          direction: "DU",
          sortMethod: "directed",
          levelSeparation: 50,
        },
      },
    };

    new Network(container, data, options);
  });
};

fetchGraph();
const screenshotAndSave = () => {
  const canvas = document.createElement("canvas");
  let canvasBox = document.getElementById("mynetwork");
  const width = parseInt(window.getComputedStyle(canvasBox).width);
  const height = parseInt(window.getComputedStyle(canvasBox).height);
  canvas.width = width * 4;
  canvas.height = height * 4;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const context = canvas.getContext("2d");
  context.scale(2, 2);
  const options = {
    backgroundColor: null,
    canvas: canvas,
    useCORS: true,
  };
  html2canvas(canvasBox, options).then((canvas) => {
    let dataURL = canvas.toDataURL("image/png");
    downloadImage(dataURL);
  });
};
//下载图片
const downloadImage = (url) => {
  let a = document.createElement("a");
  a.href = url;
  a.download = "首页截图";
  a.click();
};
</script> -->


<script>
import firstChart from "./components/firstChart.vue";
import secondChart from "./components/secondChart.vue";
import thirdChart from "./components/thirdChart.vue";
import fourthChart from "./components/fourthChart.vue";
import fifthChart from "./components/fifthChart.vue";
export default {
  components: {
    firstChart,
    secondChart,
    thirdChart,
    fourthChart,
    fifthChart,
  },
};
</script>
<style scoped>
#mynetwork {
  width: 600px;
  height: 400px;
  border: 1px solid lightgray;
}
</style>


<!-- 卡片样式 -->
<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 50px;
}

:deep(.el-card__header) {
  background: var(--theme-color);
  height: 52px !important;
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

.right-box {
  margin: 0 20px;
}
:deep(.el-radio) {
  width: 30%;
}

.card-container {
  padding: 0px;
  background-color: #fff;
  margin: 0px 20px 20px 20px;
  border-radius: 50px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12);

  h1 {
    font-size: 20px;
    text-align: center;
    position: relative;
    z-index: 1;
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
  color: var(--theme-color);
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