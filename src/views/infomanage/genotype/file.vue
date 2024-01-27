<template>
  <div style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;">
    <el-button
      style="margin: 20px; margin-left: calc(95% - 30px)"
      @click="exportFile"
      type="primary"
      size="large"
      class="green-button"
      >导出</el-button
    >
    <el-container>
      <el-main>
        <div class="file_form">
          <!-- 表格部分 -->
          <el-table
            style="width: 95%; margin: auto"
            ref="multipleTable"
            v-loading="tableLoading"
            :data="tableData"
            tooltip-effect="dark"
            class="trait-form-table"
            stripe
            max-height="100vh - 220px"
          >
            <el-table-column
              label="Edit"
              align="center"
              class-name="small-padding fixed-width"
              fixed="left"
            >
              <template #default="scope">
                <el-button
                  size="small"
                  type="text"
                  icon="Document"
                  link
                  @click="modifFile(scope.row)"
                  class="table_button"
                  >Edit
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-for="column in columns"
              :key="column.prop"
              :label="column.label"
              :prop="column.prop"
              :show-overflow-tooltip="true"
              width="150px"
              max-width="250px"
              align="center"
            >
              <template #default="scope">
                {{ formatTableCell(scope.row[column.prop]) }}
              </template></el-table-column
            >
            <el-table-column label="..." width="auto">...</el-table-column>

          </el-table>
        </div>
      </el-main>

      <el-footer class="footer">
        <div class="demo-pagination-block">
          <el-pagination
            background
            :total="totalPage"
            :current-page="currentpageNum"
            :page-size="pageSize"
            :page-sizes="[15, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-footer>
    </el-container>

    <el-dialog
      title="修改文件详情"
      v-model="dialogFormVisible"
      center
      draggable
      width="30%"
    >
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-container style="height: 500px">
          <el-form
            ref="dataTreeForm"
            :model="form"
            :rules="rules"
            label-position="left"
            label-width="110px"
          >
            <!-- 循环遍历列，并生成表单项 -->
            <template v-for="column in columns" :key="column.prop">
              <el-form-item :label="column.label" :prop="column.prop">
                <el-input
                  v-model="form[column.prop]"
                  placeholder="输入修改的值"
                  :disabled="isUnmodifiableColumn(column.prop)"
                />
              </el-form-item>
            </template>
          </el-form>
        </el-container>
      </el-scrollbar>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click.passive="updateFileData">
            保存
          </el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
  
  <script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getTree } from "@/api/tree";
import { onBeforeRouteLeave } from "vue-router";
import {
  selectDetailByFileId,
  exportGenoFile,
  modifiFileData,
  endUpdate,
} from "@/api/infomanage/genotype";

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();

const route = useRoute();
const total = ref(2);

//分页
const pageSize = ref(15);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数

const tableLoading = ref(false);
const dialogFormVisible = ref(false); // 表单可见
const form = reactive({});

const rules = reactive({
  key: [{ required: true, message: "Please input key name", trigger: "blur" }],
  value: [{ required: true, message: "Please input value", trigger: "blur" }],
});

function formatTableCell(value) {
    return value || '-'; // 如果值为空，返回'-'
  }

async function fetchData(pageNumber, pageSize) {
  try {
    tableLoading.value = true;
    traitFileId.value = route.query.id;

    // 创建查询参数对象
    const queryParams = reactive({
      pageNum: pageNumber,
      pageSize: pageSize,
    });
    selectDetailByFileId({
      fileId: traitFileId.value,
      pageSize: queryParams.pageSize,
      pageNum: queryParams.pageNum,
    })
      .then((res) => {
        const tableDataValue = [];
        const columnsValue = [];

        if (res.rows.length > 0) {
          const firstItemKeys = Object.keys(res.rows[0]);
          const visibleColumns = firstItemKeys.slice(0, 100); // 限制为前100列

          visibleColumns.forEach((key) => {
            columnsValue.push({ label: key, prop: key });
          });
          // 填充数据
          res.rows.forEach((item) => {
            const rowData = {};
            visibleColumns.forEach((key) => {
              rowData[key] = item[key];
            });
            tableDataValue.push(rowData);
          });
        }

        totalPage.value = res.total;
        columns.value = columnsValue;
        tableData.value = tableDataValue;
        tableLoading.value = false;
      })
      .catch((err) => {
        tableLoading.value = false;
        console.error(err);
      });
  } catch (error) {
    tableLoading.value = false;
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
const unmodifiableColumns = ["genotype_id", "chrom", "position", "id"];

// 计算属性，检查列是否为不可修改
const isUnmodifiableColumn = (columnProp) => {
  return unmodifiableColumns.includes(columnProp);
};

const fileList = [
  {
    experimentName: "试验1",
    pilotName: "试点1",
    repeatNumber: "重复编号1",
    fileId: "1",
    fileName: "文件1",
    description: "描述1",
    varietyName: "品种1",
    parentName: "父本1",
    motherName: "母本1",
    fieldNumber: "田间编号1",
    materialNumber: "材料编号1",
    rowNumber: "排1",
    columnNumber: "列1",
    uniqueNumber: "唯一编号1",
  },
];

const traitFileId = ref(60);
const tableName = ref("");

//获取第一个表格
const columns = ref([]); // 表头数据
const tableData = ref([]); //表格数据

//导出
function exportFile() {
  tableName.value = route.query.tableName;
  console.log(tableName.value);
  exportGenoFile(tableName.value)
    .then((res) => {
      console.log(res);
      $modal.msg("文件生成中，请等待！");
      $download.resource(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
}

// 请求性状信息
function chooseForm() {
  traitFileId.value = route.query.id;
  tableLoading.value = true;
  const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
  });
  console.log(traitFileId.value,queryParams.pageSize,queryParams.pageNum,"llllllllllllll");
  queryParams.pageNum = currentpageNum.value;
  queryParams.pageSize = pageSize.value;

  selectDetailByFileId({
    fileId: traitFileId.value,
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum,
  })
    .then((res) => {
      const tableDataValue = [];
      const columnsValue = [];

      totalPage.value = res.total;
      if (res.rows.length > 0) {
        const firstItemKeys = Object.keys(res.rows[0]);
        const visibleColumns = firstItemKeys.slice(0, 100); // 限制为前100列

        visibleColumns.forEach((key) => {
          columnsValue.push({ label: key, prop: key });
        });

        res.rows.forEach((item) => {
          const rowData = {};
          visibleColumns.forEach((key) => {
            rowData[key] = item[key];
          });
          tableDataValue.push(rowData);
        });
      }

      columns.value = columnsValue.filter(column => column.label !== 'genotype_id');
      tableData.value = tableDataValue;
      tableLoading.value = false;
    })
    .catch((err) => {
      tableLoading.value = false;
      console.error(err);
    });
}

function modifFile(row) {
  dialogFormVisible.value = true;
  form.fileId = row.fileId;

  // 将行的值设置到表单中
  for (const column of columns.value) {
    form[column.prop] = row[column.prop];
  }
}

function updateFileData() {
  traitFileId.value = route.query.id;

  // 根据表单属性动态构建负载对象
  const payload = { fileId: traitFileId.value, genotypeId: form.genotype_id };
  for (const column of columns.value) {
    // 只添加不被标记为不可修改的项到负载对象中
    if (!isUnmodifiableColumn(column.prop)) {
      payload[column.prop] = form[column.prop];
    }
  }

  modifiFileData(payload)
    .then((res) => {
      console.log(res);
      $modal.msgSuccess(res.msg);

      // 清空表单输入
      for (const column of columns.value) {
        form[column.prop] = "";
      }
      dialogFormVisible.value = false;
      chooseForm();
    })
    .catch((err) => {
      console.error(err);
      $modal.msgError(err.msg); // 这应该是 res.msg 吗？
    });
}

//暂时
onMounted(() => {
  chooseForm();
});

onBeforeRouteLeave(() => {
  tableName.value = route.query.tableName;
  endUpdate(tableName.value)
    .then((res) => {
      console.log(res);
      //chooseForm();
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>
  
  <style lang="less" scoped>
.demo-pagination-block {
  width: 100%;
  margin: 20px auto;
  display: flex;
  justify-content: center;
}

/* 使 el-table 的表头文本不换行 */
.trait-form-table .el-table__header .cell {
  white-space: nowrap;
}
</style>

<style lang="less" scoped>
.footer{
  position: absolute;
  left: 2.5%;
  bottom: 0;
  padding: 0%;

  .demo-pagination-block {
    width: 100%;
    margin-top: 10px;
    display: flex;

  }

}

:deep(.el-main, .el-footer) {
  padding: 0%;
}
:deep(.el-input__inner) {
  margin-right: 30px;
}
.scrollbar-wrapper {
  height: 400px; /* 设置容器的高度 */
  overflow-y: auto; /* 启用纵向滚动条 */
}

:deep(.el-dialog__header) {
  margin: 0%;
  background-color: #0F5C32;
  span {
    color: white;
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
</style>