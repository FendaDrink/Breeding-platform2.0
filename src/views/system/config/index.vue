<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="参数名称" prop="configName">
            <el-input v-model="queryParams.configName" placeholder="请输入参数名称" clearable style="width: 240px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="参数键名" prop="configKey">
            <el-input v-model="queryParams.configKey" placeholder="请输入参数键名" clearable style="width: 240px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="系统内置" prop="configType">
            <el-select v-model="queryParams.configType" placeholder="系统内置" clearable>
               <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
         </el-form-item>
         <el-form-item label="创建时间" style="width: 308px;">
            <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
               start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
               v-hasPermi="['system:config:add']">新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
               v-hasPermi="['system:config:edit']">修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
               v-hasPermi="['system:config:remove']">删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
               v-hasPermi="['system:config:export']">导出</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Refresh" @click="handleRefreshCache"
               v-hasPermi="['system:config:remove']">刷新缓存</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="参数主键" align="center" prop="configId" />
         <el-table-column label="参数名称" align="center" prop="configName" :show-overflow-tooltip="true" />
         <el-table-column label="参数键名" align="center" prop="configKey" :show-overflow-tooltip="true" />
         <el-table-column label="参数键值" align="center" prop="configValue" />
         <el-table-column label="系统内置" align="center" prop="configType">
            <template #default="scope">
               <dict-tag :options="sys_yes_no" :value="scope.row.configType" />
            </template>
         </el-table-column>
         <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
         <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-tooltip content="修改" placement="top">
                  <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:config:edit']"
                     class="table_button"></el-button></el-tooltip>
               <el-tooltip content="删除" placement="top">
                  <el-button type="text" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:config:remove']" class="table_button"></el-button></el-tooltip>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
         @pagination="getList" />

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" v-model="open" width="500px" draggable>
         <el-form ref="configRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="参数名称" prop="configName">
               <el-input v-model="form.configName" placeholder="请输入参数名称" />
            </el-form-item>
            <el-form-item label="参数键名" prop="configKey">
               <el-input v-model="form.configKey" placeholder="请输入参数键名" />
            </el-form-item>
            <el-form-item label="参数键值" prop="configValue">
               <el-input v-model="form.configValue" placeholder="请输入参数键值" />
            </el-form-item>
            <el-form-item label="系统内置" prop="configType">
               <el-radio-group v-model="form.configType">
                  <el-radio v-for="dict in sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
               <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="success" plain @click="submitForm">确 定</el-button>
               <el-button @click="cancel" type="info" plain>取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="Config">
import { listConfig, getConfig, delConfig, addConfig, updateConfig, refreshCache } from "@/api/system/config";

const { proxy } = getCurrentInstance();
const { sys_yes_no } = proxy.useDict("sys_yes_no");

const configList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);

const data = reactive({
   form: {},
   queryParams: {
      pageNum: 1,
      pageSize: 10,
      configName: undefined,
      configKey: undefined,
      configType: undefined
   },
   rules: {
      configName: [{ required: true, message: "参数名称不能为空", trigger: "blur" }],
      configKey: [{ required: true, message: "参数键名不能为空", trigger: "blur" }],
      configValue: [{ required: true, message: "参数键值不能为空", trigger: "blur" }]
   }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询参数列表 */
function getList() {
   loading.value = true;
   listConfig(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
      configList.value = response.rows;
      total.value = response.total;
      loading.value = false;
   });
}
/** 取消按钮 */
function cancel() {
   open.value = false;
   reset();
}
/** 表单重置 */
function reset() {
   form.value = {
      configId: undefined,
      configName: undefined,
      configKey: undefined,
      configValue: undefined,
      configType: "Y",
      remark: undefined
   };
   proxy.resetForm("configRef");
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
   handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.configId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
   reset();
   open.value = true;
   title.value = "添加参数";
}
/** 修改按钮操作 */
function handleUpdate(row) {
   reset();
   const configId = row.configId || ids.value;
   getConfig(configId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改参数";
   });
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["configRef"].validate(valid => {
      if (valid) {
         if (form.value.configId != undefined) {
            updateConfig(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               getList();
            });
         } else {
            addConfig(form.value).then(response => {
               proxy.$modal.msgSuccess("新增成功");
               open.value = false;
               getList();
            });
         }
      }
   });
}
/** 删除按钮操作 */
function handleDelete(row) {
   const configIds = row.configId || ids.value;
   proxy.$modal.confirm('是否确认删除参数编号为"' + configIds + '"的数据项？').then(function () {
      return delConfig(configIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
   proxy.download("system/config/export", {
      ...queryParams.value
   }, `config_${new Date().getTime()}.xlsx`);
}
/** 刷新缓存按钮操作 */
function handleRefreshCache() {
   refreshCache().then(() => {
      proxy.$modal.msgSuccess("刷新缓存成功");
   });
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
   background: var(--theme-color);
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
   background-color: var(--theme-color) !important;
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
   background-color: var(--theme-color) !important; //修改默认的背景色
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
   background-color: var(--theme-color) !important;
   color: #fff !important;
   border: 1px solid var(--theme-color) !important;
}

.green-button:hover {
   background-color: var(--theme-color) !important;
   color: #fff !important;
   border: 1px solid var(--theme-color) !important;
}

.table_button {
   color: var(--theme-color);
}

.table_button:hover {
   color: var(--theme-color);
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
   --el-color-primary: var(--theme-color);
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
   background: var(--theme-color) !important;
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