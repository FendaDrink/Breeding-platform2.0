<template>
   <!-- 授权用户 -->
   <el-dialog title="选择用户" v-model="visible" width="800px" top="5vh" draggable>
      <el-form :model="queryParams" ref="queryRef" :inline="true">
         <el-form-item label="用户名称" prop="userName">
            <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="refresh" plain @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>
      <el-row>
         <el-table @row-click="clickRow" ref="refTable" :data="userList" @selection-change="handleSelectionChange"
            height="260px">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
            <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true" />
            <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
            <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true" />
            <el-table-column label="状态" align="center" prop="status">
               <template #default="scope">
                  <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
               </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
               <template #default="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
               </template>
            </el-table-column>
         </el-table>
         <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" />
      </el-row>
      <template #footer>
         <div class="dialog-footer">
            <el-button plain type="success" @click="handleSelectUser">确 定</el-button>
            <el-button plain type="info" @click="visible = false">取 消</el-button>
         </div>
      </template>
   </el-dialog>
</template>

<script setup name="SelectUser">
import { authUserSelectAll, unallocatedUserList } from "@/api/system/role";

const props = defineProps({
   roleId: {
      type: [Number, String]
   }
});

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const userList = ref([]);
const visible = ref(false);
const total = ref(0);
const userIds = ref([]);

const queryParams = reactive({
   pageNum: 1,
   pageSize: 10,
   roleId: undefined,
   userName: undefined,
   phonenumber: undefined
});

// 显示弹框
function show() {
   queryParams.roleId = props.roleId;
   getList();
   visible.value = true;
}
/**选择行 */
function clickRow(row) {
   proxy.$refs["refTable"].toggleRowSelection(row);
}
// 多选框选中数据
function handleSelectionChange(selection) {
   userIds.value = selection.map(item => item.userId);
}
// 查询表数据
function getList() {
   unallocatedUserList(queryParams).then(res => {
      userList.value = res.rows;
      total.value = res.total;
   });
}
/** 搜索按钮操作 */
function handleQuery() {
   queryParams.pageNum = 1;
   getList();
}
/** 重置按钮操作 */
function resetQuery() {
   proxy.resetForm("queryRef");
   handleQuery();
}
const emit = defineEmits(["ok"]);
/** 选择授权用户操作 */
function handleSelectUser() {
   const roleId = queryParams.roleId;
   const uIds = userIds.value.join(",");
   if (uIds == "") {
      proxy.$modal.msgError("请选择要分配的用户");
      return;
   }
   authUserSelectAll({ roleId: roleId, userIds: uIds }).then(res => {
      proxy.$modal.msgSuccess(res.msg);
      if (res.code === 200) {
         visible.value = false;
         emit("ok");
      }
   });
}

defineExpose({
   show,
});
</script>

<style lang="less" scoped>
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

:deep(.el-button--primary) {
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

:deep(.el-button--success.is-plain) {
   --el-button-text-color: #67c23a;
   --el-button-bg-color: #f0f9eb;
   --el-button-border-color: #b3e19d;
   --el-button-hover-text-color: #ffffff;
   --el-button-hover-bg-color: #67c23a;
   --el-button-hover-border-color: #67c23a;
   --el-button-active-text-color: #ffffff;
}

:deep(.el-button--danger.is-plain) {
   --el-button-text-color: #f56c6c;
   --el-button-bg-color: #fef0f0;
   --el-button-border-color: #fab6b6;
   --el-button-hover-text-color: #ffffff;
   --el-button-hover-bg-color: #f56c6c;
   --el-button-hover-border-color: #f56c6c;
   --el-button-active-text-color: #ffffff;
}

:deep(.el-button--info.is-plain) {
   --el-button-text-color: #909399;
   --el-button-bg-color: #f4f4f5;
   --el-button-border-color: #c8c9cc;
   --el-button-hover-text-color: #ffffff;
   --el-button-hover-bg-color: #909399;
   --el-button-hover-border-color: #909399;
   --el-button-active-text-color: #ffffff;
}

:deep(.el-button--warning.is-plain) {
   --el-button-text-color: #e6a23c;
   --el-button-bg-color: #fdf6ec;
   --el-button-border-color: #f3d19e;
   --el-button-hover-text-color: #ffffff;
   --el-button-hover-bg-color: #e6a23c;
   --el-button-hover-border-color: #e6a23c;
   --el-button-active-text-color: #ffffff;
}
</style>