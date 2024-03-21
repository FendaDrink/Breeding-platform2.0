<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="系统模块" prop="title">
            <el-input
               v-model="queryParams.title"
               placeholder="请输入系统模块"
               clearable
               style="width: 240px;"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="操作人员" prop="operName">
            <el-input
               v-model="queryParams.operName"
               placeholder="请输入操作人员"
               clearable
               style="width: 240px;"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="类型" prop="businessType">
            <el-select
               v-model="queryParams.businessType"
               placeholder="操作类型"
               clearable
               style="width: 240px"
            >
               <el-option
                  v-for="dict in sys_oper_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select
               v-model="queryParams.status"
               placeholder="操作状态"
               clearable
               style="width: 240px"
            >
               <el-option
                  v-for="dict in sys_common_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="操作时间" style="width: 308px">
            <el-date-picker
               v-model="dateRange"
               value-format="YYYY-MM-DD"
               type="daterange"
               range-separator="-"
               start-placeholder="开始日期"
               end-placeholder="结束日期"
            ></el-date-picker>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:operlog:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="Delete"
               @click="handleClean"
               v-hasPermi="['system:operlog:remove']"
            >清空</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="Download"
               @click="handleExport"
               v-hasPermi="['system:operlog:export']"
            >导出</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table ref="operlogRef" v-loading="loading" :data="operlogList" @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="日志编号" align="center" prop="operId" />
         <el-table-column label="系统模块" align="center" prop="title" />
         <el-table-column label="操作类型" align="center" prop="businessType">
            <template #default="scope">
               <dict-tag :options="sys_oper_type" :value="scope.row.businessType" />
            </template>
         </el-table-column>
         <el-table-column label="请求方式" align="center" prop="requestMethod" />
         <el-table-column label="操作人员" align="center" prop="operName" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" width="100" />
         <el-table-column label="主机" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
         <el-table-column label="操作状态" align="center" prop="status">
            <template #default="scope">
               <dict-tag :options="sys_common_status" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="操作日期" align="center" prop="operTime" sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.operTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-tooltip content="详细" placement="top">
               <el-button
                  type="text"
                  icon="View"
                  @click="handleView(scope.row, scope.index)"
                  v-hasPermi="['system:operlog:query']"
                  class="table_button"
               ></el-button></el-tooltip>
            </template>
         </el-table-column>
      </el-table>

      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />

      <!-- 操作日志详细 -->
      <el-dialog title="操作日志详细" v-model="open" width="700px" append-to-body>
         <el-form :model="form" label-width="100px">
            <el-row>
               <el-col :span="12">
                  <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
                  <el-form-item
                    label="登录信息："
                  >{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}</el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
                  <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="操作状态：">
                     <div v-if="form.status === 0">正常</div>
                     <div v-else-if="form.status === 1">失败</div>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button @click="open = false" type="info" plain>关 闭</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="Operlog">
import { list, delOperlog, cleanOperlog } from "@/api/monitor/operlog";

const { proxy } = getCurrentInstance();
const { sys_oper_type, sys_common_status } = proxy.useDict("sys_oper_type","sys_common_status");

const operlogList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const defaultSort = ref({ prop: "operTime", order: "descending" });

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: undefined,
    operName: undefined,
    businessType: undefined,
    status: undefined
  }
});

const { queryParams, form } = toRefs(data);

/** 查询登录日志 */
function getList() {
  loading.value = true;
  list(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
    operlogList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 操作日志类型字典翻译 */
function typeFormat(row, column) {
  return proxy.selectDictLabel(sys_oper_type.value, row.businessType);
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  proxy.$refs["operlogRef"].sort(defaultSort.value.prop, defaultSort.value.order);
  handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.operId);
  multiple.value = !selection.length;
}
/** 排序触发事件 */
function handleSortChange(column, prop, order) {
  queryParams.value.orderByColumn = column.prop;
  queryParams.value.isAsc = column.order;
  getList();
}
/** 详细按钮操作 */
function handleView(row) {
  open.value = true;
  form.value = row;
}
/** 删除按钮操作 */
function handleDelete(row) {
  const operIds = row.operId || ids.value;
  proxy.$modal.confirm('是否确认删除日志编号为"' + operIds + '"的数据项?').then(function () {
    return delOperlog(operIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 清空按钮操作 */
function handleClean() {
  proxy.$modal.confirm("是否确认清空所有操作日志数据项?").then(function () {
    return cleanOperlog();
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("清空成功");
  }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("monitor/operlog/export",{
    ...queryParams.value,
  }, `config_${new Date().getTime()}.xlsx`);
}

getList();
</script>



<style lang="less" scoped>
.u-main .el-tag+.el-tag {
  margin-left: 10px;
}

.u-main .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.u-main .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.u-main .el-form-item {
  margin: 60px 0;
}

.u-main .el-form-item__label {
  font-size: 20px;
}

/* 新增节点对话框 */
:deep(.el-dialog__header) {
  margin-right: 0px;
  padding-right: 16px;
  background: #1FB864;
  margin-top: 10px;

  .el-dialog__title {
    color: white;
  }
}
</style>
<style lang="less" scoped>
.image_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  max-height: calc(100vh - 180px);
}

.image_item {
  box-sizing: border-box;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  width: 25%;
}


.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #f5f5f5;
}

.bg-purple-light {
  background: rgb(32, 177, 159);
}

.grid-content {
  border-radius: 0px;
  height: 50px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.upload {
  width: 100%;
  // border:1px solid #ccc;
}

.right-box {
  // background-color: #fff;
  // border:1px solid #ccc;
  // margin-bottom: 50px;
  margin-left: 20px;
}

.u-title {
  width: 98%;
  margin: 0 auto;
  height: 50px;
}

.u-title ul {
  display: flex;
}

.u-title ul li {
  flex: 1;
  text-align: center;
}

.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}

.addNode-button,
.search-button {
  background: rgb(85, 123, 116);
}

.addExcel {
  background: grey;
  color: #fff;
}
</style>
<style lang="less"  scoped>
.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
  /* 0 3px 3px -2px rgba(0, 0, 0, 0.12),
         0 1px 8px 0 rgba(0, 0, 0, 0.2); */
}
</style>

<style lang="less" scoped>
.filter-item {
  margin-right: 20px;
}

:deep(el-col) {
  padding: 0%;
}

.myform {
  display: flex !important;
  align-items: center !important;
  height: auto;
}
</style>


<style lang="less" scoped>
:deep(.el-button) {
  margin: 0% !important;
  margin-right: 8px !important;
}

.mytable {
  background-color: #eeeeee;
}

.table_button {
  padding: 0% !important;
  margin: 0 !important;
  margin-right: 5px !important;
}

@media (max-width: 1330px) {
  .my-button {
    margin-right: 2px !important;
    /* 缩小元素之间的间距 */
    font-size: 7px;
  }

  .my-input {
    width: 120px;
    /* 缩小输入框的宽度 */
    margin-right: 2px;
    padding: 0%;
  }

  .el-button {
    font-size: 12px;
    /* 设置按钮的字体大小为小号 */
    padding: 3px 6px;
    /* 根据需要调整按钮的内边距 */
  }

  :deep(.el-input__inner) {
    padding: 1px 11px;
  }

  :deep(.el-form-item__label) {
    padding: 0%;
  }
}

.hebin-button {
  margin-right: 0% !important;
}
</style>


<style lang="less" scoped>
:deep(.pagination-container) {
    margin-top: 0px;
}
:deep(.pagination-container .el-pagination) {
    left: 20px;
    position: absolute;
}
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



/* 新增节点对话框 */
:deep(.el-dialog__header) {
  margin-right: 0px;
  padding-right: 16px;
  background: #1FB864 !important;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-dialog__title {
    color: white;
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
</style>