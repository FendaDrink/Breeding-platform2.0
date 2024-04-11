<template>
   <div class="app-container">
     <el-row :gutter="20">
       <!--部门数据-->
       <el-col :span="4" :xs="24" >
         <div class="head-container">
           <el-input v-model="deptName" placeholder="请输入部门名称" clearable prefix-icon="Search" style="margin-bottom: 20px" />
         </div>
         <div class="head-container">
           <el-tree :data="deptOptions" :props="{ label: 'label', children: 'children' }" :expand-on-click-node="false" class="permission-tree"
             :filter-node-method="filterNode" ref="deptTreeRef" highlight-current default-expand-all
             @node-click="handleNodeClick" />
         </div>
       </el-col>
       <!--用户数据-->
       <el-col :span="20" :xs="24" style="position: relative;">
         <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
           <el-form-item label="用户名称" prop="userName">
             <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable style="width: 240px"
               @keyup.enter="handleQuery" />
           </el-form-item>
           <el-form-item label="手机号码" prop="phonenumber">
             <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable style="width: 240px"
               @keyup.enter="handleQuery" />
           </el-form-item>
           <el-form-item label="状态" prop="status">
             <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 240px">
               <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
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
             <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:user:add']">新增</el-button>
           </el-col>
           <el-col :span="1.5">
             <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
               v-hasPermi="['system:user:edit']">修改</el-button>
           </el-col>
           <el-col :span="1.5">
             <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
               v-hasPermi="['system:user:remove']">删除</el-button>
           </el-col>
           <el-col :span="1.5">
             <el-button type="info" plain icon="Upload" @click="handleImport"
               v-hasPermi="['system:user:import']">导入</el-button>
           </el-col>
           <el-col :span="1.5">
             <el-button type="warning" plain icon="Download" @click="handleExport"
               v-hasPermi="['system:user:export']">导出</el-button>
           </el-col>
           <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
         </el-row>
 
         <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
           <el-table-column type="selection" width="50" align="center" />
           <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
           <el-table-column label="用户名称" align="center" key="userName" prop="userName" v-if="columns[1].visible"
             :show-overflow-tooltip="true" />
           <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible"
             :show-overflow-tooltip="true" />
           <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible"
             :show-overflow-tooltip="true" />
           <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible"
             width="120" />
           <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
             <template #default="scope">
               <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
                 @change="handleStatusChange(scope.row)"></el-switch>
             </template>
           </el-table-column>
           <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
             <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
             </template>
           </el-table-column>
           <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
             <template #default="scope">
               <el-tooltip content="修改" placement="top" v-if="scope.row.userId !== 1">
                 <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)" class="green-button"
                   v-hasPermi="['system:user:edit']"></el-button>
               </el-tooltip>
               <el-tooltip content="删除" placement="top" v-if="scope.row.userId !== 1">
                 <el-button type="text" icon="Delete" @click="handleDelete(scope.row)" class="green-button"
                   v-hasPermi="['system:user:remove']"></el-button>
               </el-tooltip>
               <el-tooltip content="重置密码" placement="top" v-if="scope.row.userId !== 1">
                 <el-button type="text" icon="Key" @click="handleResetPwd(scope.row)" class="green-button"
                   v-hasPermi="['system:user:resetPwd']"></el-button>
               </el-tooltip>
               <el-tooltip content="分配角色" placement="top" v-if="scope.row.userId !== 1">
                 <el-button type="text" icon="CircleCheck" @click="handleAuthRole(scope.row)" class="green-button"
                   v-hasPermi="['system:user:edit']"></el-button>
               </el-tooltip>
             </template>
           </el-table-column>
         </el-table>
         <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
           v-model:limit="queryParams.pageSize" @pagination="getList" />
       </el-col>
     </el-row>
 
     <!-- 添加或修改用户配置对话框 -->
     <el-dialog :title="title" v-model="open" width="600px" draggable>
       <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
         <el-row>
           <el-col :span="12">
             <el-form-item label="用户昵称" prop="nickName">
               <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="归属部门" prop="deptId">
               <el-tree-select v-model="form.deptId" :data="deptOptions"
                 :props="{ value: 'id', label: 'label', children: 'children' }" value-key="id" placeholder="请选择归属部门"
                 check-strictly />
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="手机号码" prop="phonenumber">
               <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="邮箱" prop="email">
               <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
               <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
             </el-form-item>
           </el-col>
 
         </el-row>
         <el-row>
           <el-col :span="18">
             <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
               <el-input v-model="form.password" placeholder="请输入用户密码" type="password" show-password
                 style="margin-bottom:10px" />
               <PsdStrength :password="form.password"> </PsdStrength>
             </el-form-item>
 
           </el-col>
 
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="用户性别">
               <el-select v-model="form.sex" placeholder="请选择">
                 <el-option v-for="dict in sys_user_sex" :key="dict.value" :label="dict.label"
                   :value="dict.value"></el-option>
               </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="状态">
               <el-radio-group v-model="form.status">
                 <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
                 }}</el-radio>
               </el-radio-group>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="岗位">
               <el-select v-model="form.postIds" multiple placeholder="请选择">
                 <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName" :value="item.postId"
                   :disabled="item.status == 1"></el-option>
               </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="角色">
               <el-select v-model="form.roleIds" multiple placeholder="请选择">
                 <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId"
                   :disabled="item.status == 1"></el-option>
               </el-select>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="24">
             <el-form-item label="备注">
               <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
             </el-form-item>
           </el-col>
         </el-row>
       </el-form>
       <template #footer>
         <div class="dialog-footer">
           <el-button type="success" @click="submitForm" plain>确 定</el-button>
           <el-button plain type="info" @click="cancel">取 消</el-button>
         </div>
       </template>
     </el-dialog>
 
     <!-- 用户导入对话框 -->
     <el-dialog :title="upload.title" v-model="upload.open" width="400px" draggable>
       <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
         :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
         :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
         <el-icon class="el-icon--upload"><upload-filled /></el-icon>
         <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
         <template #tip>
           <div class="el-upload__tip text-center">
             <div class="el-upload__tip">
               <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
             </div>
             <span>仅允许导入xls、xlsx格式文件。</span>
             <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
               @click="importTemplate">下载模板</el-link>
           </div>
         </template>
       </el-upload>
       <template #footer>
         <div class="dialog-footer">
           <el-button plain type="success" @click="submitFileForm">确 定</el-button>
           <el-button plain type="info" @click="upload.open = false">取 消</el-button>
         </div>
       </template>
     </el-dialog>
   </div>
 </template>
 
 <script setup name="User">
 import { getToken } from "@/utils/auth";
 import { treeselect } from "@/api/system/dept";
 import { changeUserStatus, listUser, resetUserPwd, delUser, getUser, updateUser, addUser } from "@/api/system/user";
 
 const router = useRouter();
 const { proxy } = getCurrentInstance();
 const { sys_normal_disable, sys_user_sex } = proxy.useDict("sys_normal_disable", "sys_user_sex");
 
 const userList = ref([]);
 const open = ref(false);
 const loading = ref(true);
 const showSearch = ref(true);
 const ids = ref([]);
 const single = ref(true);
 const multiple = ref(true);
 const total = ref(0);
 const title = ref("");
 const dateRange = ref([]);
 const deptName = ref("");
 const deptOptions = ref(undefined);
 const initPassword = ref(undefined);
 const postOptions = ref([]);
 const roleOptions = ref([]);
 /*** 用户导入参数 */
 const upload = reactive({
   // 是否显示弹出层（用户导入）
   open: false,
   // 弹出层标题（用户导入）
   title: "",
   // 是否禁用上传
   isUploading: false,
   // 是否更新已经存在的用户数据
   updateSupport: 0,
   // 设置上传的请求头部
   headers: { Authorization: "Bearer " + getToken() },
   // 上传的地址
   url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
 });
 // 列显隐信息
 const columns = ref([
   { key: 0, label: `用户编号`, visible: true },
   { key: 1, label: `用户名称`, visible: true },
   { key: 2, label: `用户昵称`, visible: true },
   { key: 3, label: `部门`, visible: true },
   { key: 4, label: `手机号码`, visible: true },
   { key: 5, label: `状态`, visible: true },
   { key: 6, label: `创建时间`, visible: true }
 ]);
 
 // var ISPWD =/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*,\._\+(){}])[0-9a-zA-Z!@#$%^&*,\\._\+(){}]{11,}$/;
 var ISPWD = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!?|/@#$%^&*,\._\+(){}])[A-Za-z\d!?|/@#$%^&*,\._\+(){}]{11,}$/;
 // var ISPWD =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{11,}$/;
 
 // 密码校验
 const validatePassword = (rule, value, callback) => {
 
   if (!ISPWD.test(value)) {
     callback(new Error("用户密码必须包含字母、数字和特殊符号"));
   } else {
     callback();
   }
 }
 
 const data = reactive({
   form: {},
   queryParams: {
     pageNum: 1,
     pageSize: 10,
     userName: undefined,
     phonenumber: undefined,
     status: undefined,
     deptId: undefined
   },
   rules: {
     userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
     nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
     password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 11, message: "用户密码长度必须大于10", trigger: "blur" }, { validator: validatePassword, trigger: 'blur' }],
     email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
     phonenumber: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
   }
 });
 
 const { queryParams, form, rules } = toRefs(data);
 
 /** 通过条件过滤节点  */
 const filterNode = (value, data) => {
   if (!value) return true;
   return data.label.indexOf(value) !== -1;
 };
 /** 根据名称筛选部门树 */
 watch(deptName, val => {
   proxy.$refs["deptTreeRef"].filter(val);
 });
 /** 查询部门下拉树结构 */
 function getTreeselect() {
   treeselect().then(response => {
     deptOptions.value = response.data;
   });
 };
 /** 查询用户列表 */
 function getList() {
   loading.value = true;
   listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
     loading.value = false;
     userList.value = res.rows;
     total.value = res.total;
   });
 };
 /** 节点单击事件 */
 function handleNodeClick(data) {
   queryParams.value.deptId = data.id;
   handleQuery();
 };
 /** 搜索按钮操作 */
 function handleQuery() {
   queryParams.value.pageNum = 1;
   getList();
 };
 /** 重置按钮操作 */
 function resetQuery() {
   dateRange.value = [];
   proxy.resetForm("queryRef");
   handleQuery();
 };
 /** 删除按钮操作 */
 function handleDelete(row) {
   const userIds = row.userId || ids.value;
   proxy.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function () {
     return delUser(userIds);
   }).then(() => {
     getList();
     proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
 };
 /** 导出按钮操作 */
 function handleExport() {
   proxy.download("system/user/export", {
     ...queryParams.value,
   }, `user_${new Date().getTime()}.xlsx`);
 };
 /** 用户状态修改  */
 function handleStatusChange(row) {
   let text = row.status === "0" ? "启用" : "停用";
   proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(function () {
     return changeUserStatus(row.userId, row.status);
   }).then(() => {
     proxy.$modal.msgSuccess(text + "成功");
   }).catch(function () {
     row.status = row.status === "0" ? "1" : "0";
   });
 };
 /** 更多操作 */
 function handleCommand(command, row) {
   switch (command) {
     case "handleResetPwd":
       handleResetPwd(row);
       break;
     case "handleAuthRole":
       handleAuthRole(row);
       break;
     default:
       break;
   }
 };
 /** 跳转角色分配 */
 function handleAuthRole(row) {
   const userId = row.userId;
   router.push("/system/user-auth/role/" + userId);
 };
 /** 重置密码按钮操作 */
 function handleResetPwd(row) {
   proxy.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
     confirmButtonText: "确定",
     cancelButtonText: "取消",
     closeOnClickModal: false,
     inputPattern: ISPWD,
     inputErrorMessage: "用户密码必须包含字母、数字和特殊符号。且长度大于10",
   }).then(({ value }) => {
     resetUserPwd(row.userId, value).then(response => {
       proxy.$modal.msgSuccess("修改成功，新密码是：" + value);
     });
   }).catch(() => { });
 };
 /** 选择条数  */
 function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.userId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
 };
 /** 导入按钮操作 */
 function handleImport() {
   upload.title = "用户导入";
   upload.open = true;
 };
 /** 下载模板操作 */
 function importTemplate() {
   proxy.download("system/user/importTemplate", {
   }, `user_template_${new Date().getTime()}.xlsx`);
 };
 /**文件上传中处理 */
 const handleFileUploadProgress = (event, file, fileList) => {
   upload.isUploading = true;
 };
 /** 文件上传成功处理 */
 const handleFileSuccess = (response, file, fileList) => {
   upload.open = false;
   upload.isUploading = false;
   proxy.$refs["uploadRef"].handleRemove(file);
   proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
   getList();
 };
 /** 提交上传文件 */
 function submitFileForm() {
   proxy.$refs["uploadRef"].submit();
 };
 /** 初始化部门数据 */
 function initTreeData() {
   // 判断部门的数据是否存在，存在不获取，不存在则获取
   if (deptOptions.value === undefined) {
     treeselect().then(response => {
       deptOptions.value = response.data;
     });
   }
 };
 /** 重置操作表单 */
 function reset() {
   form.value = {
     userId: undefined,
     deptId: undefined,
     userName: undefined,
     nickName: undefined,
     password: undefined,
     phonenumber: undefined,
     email: undefined,
     sex: undefined,
     status: "0",
     remark: undefined,
     postIds: [],
     roleIds: []
   };
   proxy.resetForm("userRef");
 };
 /** 取消按钮 */
 function cancel() {
   open.value = false;
   reset();
 };
 /** 新增按钮操作 */
 function handleAdd() {
   reset();
   initTreeData();
   getUser().then(response => {
     postOptions.value = response.posts;
     roleOptions.value = response.roles;
     open.value = true;
     title.value = "添加用户";
     form.value.password = initPassword.value;
   });
 };
 /** 修改按钮操作 */
 function handleUpdate(row) {
   reset();
   initTreeData();
   const userId = row.userId || ids.value;
   getUser(userId).then(response => {
     form.value = response.data;
     postOptions.value = response.posts;
     roleOptions.value = response.roles;
     form.value.postIds = response.postIds;
     form.value.roleIds = response.roleIds;
     open.value = true;
     title.value = "修改用户";
     form.password = "";
   });
 };
 /** 提交按钮 */
 function submitForm() {
   proxy.$refs["userRef"].validate(valid => {
     if (valid) {
       if (form.value.userId != undefined) {
         updateUser(form.value).then(response => {
           proxy.$modal.msgSuccess("修改成功");
           open.value = false;
           getList();
         });
       } else {
         addUser(form.value).then(response => {
           proxy.$modal.msgSuccess("新增成功");
           open.value = false;
           getList();
         });
       }
     }
   });
 };
 
 getTreeselect();
 getList();
 </script>
 
 
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
 :deep(.pagination-container) {
     margin-top: 0px;
 }
 :deep(.pagination-container .el-pagination) {
     left: 0px;
     position: absolute;
 }
 :deep(.el-radio) {
   width: 30%;
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
 :deep(.el-card__header) {
   // background: rgba(143, 219, 177,0.1);
   background-color: var(--theme-color);
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
 
 .card-header {
   display: flex;
   justify-content: center;
   align-items: center;
   height: 60px;
   position: relative;
   background-color: #fff;
   width: 150px;
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
 
 .card-container {
   // width: 97%;
   // border-radius: 50px;
   // margin: auto;
   // margin-top: 10px;
 
   // :deep(.el-card__body) {
   //   padding: 15px 20px 20px 20px !important;
   // }
 
   //padding: 20px 20px 0px;
   padding: 0px;
   background-color: #fff;
   margin: 0px 20px 20px 20px;
   margin-right: 0px;
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
 
 // 设置高亮颜色
 :deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
   //background-color: rgba(rgb(#4f6f46), 0.3) !important;
   background-color: rgba(rgb(#424F63), 0.3) !important;
 
   .el-tree-node__label {
     color: #424F63;
   }
 
   .el-tree-node__expand-icon {
     color: #424F63;
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
 
 :deep(.el-input__inner) {
   margin: 0%;
 }
 
 
 
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
 .green-button {
   // background-color: var(--theme-color) !important;
   color: var(--theme-color) !important;
   // border: 1px solid var(--theme-color) !important;
 }
 
 .green-button:hover {
   // background-color: var(--theme-color) !important;
   color: var(--theme-color) !important;
   // border: 1px solid var(--theme-color) !important;
 }
 
 </style>
 
 <style>
 :root {
   --el-color-primary: var(--theme-color);
 }
 </style>
 
 <style lang="less" scoped>
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
 
 :deep(.el-table__header .el-checkbox) {
   /* Your styles here */
   --el-checkbox-checked-input-border-color: #424F63;
   --el-checkbox-checked-bg-color: #424F63;
   --el-checkbox-input-border-color-hover: #424F63;
 }
 
 </style>