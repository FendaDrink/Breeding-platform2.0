<template>
  <div style="width: 100%; min-height: calc(100vh - 84px); background-color: #eeeeee;">
    <el-config-provider :locale="locale">
      <el-container style="padding: 20px; border: 1px solid #eee; height: calc(100vh - 100px)" v-loading="loading"
        :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-aside width="20%" class="mokuai card shadow element-plus-tree"
          style="min-height: calc(100vh - 180px);margin-top: 10px;border-radius: 8px;padding: 0%;margin-top: 0%;">
          <el-tree ref="tree" :data="routesData" :props="defaultProps" node-key="treeId" default-expand-all
            highlight-current :current-node-key="1" :default-current-node-key="firstLeafNodeKey" @node-click="rowClick"
            class="permission-tree" :check-strictly="true" :check-on-click-node="true" :expand-on-click-node="false">
          </el-tree>
        </el-aside>

        <el-container>
          <!-- //右边的盒子 -->
          <el-main width="78%" style="padding: 0; height: calc(100vh - 150px)" class="right-box">
            <div style="height: auto; margin-bottom: 10px">
              <div class="div1">
                <el-button plain type="primary" class="filter-item my-button" @click.prevent="addChildNode" icon="plus"
                  v-hasPermi="['system:node:add']">
                  {{ $t('genotype.index.node_add') }}</el-button>
                <el-button plain type="success" class="filter-item my-button" @click.prevent="updateChildNode" icon="edit"
                  v-hasPermi="['system:node:update']">{{ $t('genotype.index.node_update') }}</el-button>
                <el-button plain type="danger" class="filter-item my-button" @click.prevent="deleteNode" icon="delete"
                  v-hasPermi="['system:node:remove']">{{ $t('genotype.index.node_delete') }}</el-button>
                <el-button plain type="info" class="filter-item my-button" @click.prevent="downloadTemplate"
                  icon="download" v-hasPermi="['system:node:update']">{{ $t('genotype.index.template_download')
                  }}</el-button>
              </div>
              <div class="div2">
                <el-input v-model="queryParams.fileName" :placeholder="$t('genotype.index.placeholder_fileName')"
                  clearable @keyup.enter="handleQuery" class="my-input" style="width: 180px; margin-right: 8px;" />
                <el-button type="primary" class="my-button" @click="handleQuery" icon="search">{{
                  $t('genotype.index.search') }}</el-button>
                <el-button @click="resetQuery" class="my-button white-button" icon="Refresh">{{ $t('genotype.index.reset')
                }}</el-button>
              </div>
              <div class="div3">
                <!-- 操作部分 -->
                <el-button type="primary" plain class="filter-item my-button" @click="handleAdd" icon="plus"
                  v-hasPermi="['system:logininfor:add']">{{ $t('genotype.index.file_add') }}</el-button>
                <el-button type="danger" plain @click="handleDelete" :disabled="deleteDisabled" icon="delete"
                  v-hasPermi="['system:logininfor:remove']" class="filter-item my-button">{{
                    $t('genotype.index.file_delete') }}</el-button>
                <el-container style="min-height: calc(100vh - 400px);">
                  <!-- 表格部分 -->
                  <el-table v-loading="tableLoading" :data="fileList" @selection-change="handleSelectionChange" stripe fit
                    max-height="100%" class="mytable">
                    <el-table-column type="selection" width="auto" align="center" fixed="left" />
                    <el-table-column :label="$t('genotype.index.table_index')" width="80" type="index"
                      :index="indexMethod" align="center" />
                    <!-- <el-table-column label="文件ID" width="80px" align="center" prop="fileId" /> -->
                    <!-- <el-table-column label="表型名" width="280px" align="center" prop="tableName" /> -->
                    <el-table-column :label="$t('genotype.index.table_fileName')" align="center" prop="fileName"
                      width="150px" />
                    <el-table-column :label="$t('genotype.index.table_speciesName')" width="150px" align="center"
                      prop="fileSpecies" />
                    <el-table-column :label="$t('genotype.index.table_populationName')" width="150px" align="center"
                      prop="filePposition" />
                    <el-table-column :label="$t('genotype.index.table_fileStatus')" align="center" prop="fileStatus"
                      v-hasPermi="['system:file:remove']" width="120">
                      <template #default="scope">
                        <el-switch v-model="fileList[scope.$index].fileStatus" @change="updateFileStatus(scope.row)">
                        </el-switch>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column label="文件时间" align="center" prop="dateTime" /> -->
                    <el-table-column :label="$t('genotype.index.table_operate')" align="center"
                      class-name="small-padding fixed-width" width="150px">
                      <template #default="scope">
                        <el-tooltip :content="$t('genotype.index.tooltip_view')" placement="top">
                          <el-button size="medium" type="text" icon="View" link @click="openVis(scope.row)"
                            class="table_button">
                          </el-button></el-tooltip>
                        <el-tooltip :content="$t('genotype.index.tooltip_screen')" placement="top">
                          <el-button size="medium" type="text" icon="search" link @click="openFilter(scope.row)"
                            class="table_button">
                          </el-button></el-tooltip>
                        <el-tooltip :content="$t('genotype.index.tooltip_heatmap')" placement="top">
                          <el-button size="medium" type="text" icon="place" link @click="openHeatmap(scope.row)"
                            class="table_button">
                          </el-button></el-tooltip>
                        <el-tooltip :content="$t('genotype.index.tooltip_detail')" placement="top">
                          <el-button size="medium" type="text" icon="Document" link @click="openfile(scope.row)"
                            class="table_button">
                          </el-button></el-tooltip>
                        <el-tooltip :content="$t('genotype.index.tooltip_delete')" placement="top">
                          <el-button size="medium" type="text" icon="Delete" @click="deleteFile(scope.row)"
                            v-hasPermi="['system:file:remove']" class="table_button"></el-button></el-tooltip>
                      </template>
                    </el-table-column>

                    <el-table-column icon="timer" :label="$t('genotype.index.table_previousVersions')" align="center"
                      class-name="small-padding fixed-width" min-width="auto">
                      <template #default="scope">
                        <el-tooltip :content="$t('genotype.index.tooltip_histoicalVersions')" placement="top">
                          <el-button icon="timer" type="text" size="medium" :loading="downloadLoading"
                            @click="openHistory(scope.row)" class="table_button">
                          </el-button></el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('genotype.index.table_merge')" align="center"
                      class-name="small-padding fixed-width" width="auto">
                      <template #default="scope">
                        <el-tooltip :content="$t('genotype.index.tooltip_merge')" placement="top">
                          <el-button icon="set-up" :loading="downloadLoading" @click="mergeFile(scope.row)" type="text"
                            class="table_button">
                          </el-button></el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-container>
              </div>

            </div>


          </el-main>
          <!-- 分页 -->
          <el-footer class="footer">
            <el-pagination v-show="total > 0" :total="total" v-model:currentPage="queryParams.pageNum"
              v-model:page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
              @size-change="getList" @current-change="getList" :background="false" />
          </el-footer>
        </el-container>
      </el-container>
      <!-- 节点对话框 -->
      <el-dialog :title="textMaps[dialogTreeStatus]" v-model="dialogTreeFormVisible" center draggable width="30%">
        <el-form ref="dataTreeForm" :model="treeForm" :rules="treeRules" label-position="left" label-width="110px">
          <el-form-item :label="$t('genotype.index.dialog_nodeName')" prop="treeName">
            <el-input v-model="treeForm.treeName" :placeholder="$t('genotype.index.placeholder_node')" />
          </el-form-item>
          <el-form-item :label="$t('genotype.index.dialog_status')" prop="isShow">
            <el-switch v-model="treeForm.isShow" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="success" plain @click.passive="
              dialogTreeStatus === 'createNode'
                ? createTreeData()
                : updateTreeData()
            ">
              {{ $t('genotype.index.save') }}
            </el-button>
            <el-button @click="dialogTreeFormVisible = false" type="info" plain>取消</el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog :title="textMaps[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false"
        @close="dialogClosed" center draggable width="30%">
        <el-form ref="form" :rules="rules" :model="dataForm" label-position="left" label-width="100px">
          <div class="el-upload__tip" style="margin-bottom: 10px">
            {{ $t('genotype.index.name_require') }}
          </div>

          <el-form-item :label="$t('genotype.index.dialog_fileName')" prop="fileName" style="margin-bottom: 30px;">
            <el-input v-model="dataForm.fileName" :placeholder="$t('genotype.index.placeholder_fileName')" />
          </el-form-item>

          <el-form-item :label="$t('genotype.index.dialog_comment')" prop="remark">
            <el-input v-model="dataForm.remark" :placeholder="$t('genotype.index.placeholder_comment')" />
          </el-form-item>
          <el-form-item :label="$t('genotype.index.dialog_status')" prop="fileStatus">
            <el-switch v-model="dataForm.fileStatus" />
          </el-form-item>
          <el-form-item :label="$t('genotype.index.dialog_upload')" prop="file"
            v-show="dialogStatus === 'create' || 'other'">
            <el-upload v-model:file-list="uploadFileList" class="upload-demo" ref="upload" :limit="1" accept=".vcf"
              :action="uploadUrl" :auto-upload="false" :headers="{ Authorization: 'Bearer ' + getToken() }"
              :on-error="uploadFileError" :on-success="uploadFileSuccess" :on-exceed="handleExceed"
              :on-change="handleUploadFile" :before-upload="handleBeforeUpload">
              <el-button type="primary">{{ $t('genotype.index.upload') }}</el-button>
              <template #tip>
                <div class="el-upload__tip">select a file to upload</div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="success" plain v-if="dialogStatus === 'create'"
              @click="dialogStatus === 'create' ? createData() : updateData()" :disabled="isDisabled">
              {{ $t('genotype.index.save') }}
            </el-button>
            <el-button type="success" plain v-else @click="mergeData()" :disabled="isDisabled2">
              {{ $t('genotype.index.merge') }}
            </el-button>
            <el-button type="info" plain @click="deleteUploadData()">{{ $t('genotype.index.cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog :title="$t('genotype.index.title_history')" v-model="historyFormVisible" :close-on-click-modal="false"
        @close="dialogClosed" center draggable width="70%">
        <el-table v-loading="tableLoading" :data="historyFileList">
          <el-table-column :label="$t('genotype.index.table_index')" align="center" width="80" type="index"
            :index="indexMethod" />
          <el-table-column :label="$t('genotype.index.table_fileName')" align="center" prop="fileName" />
          <el-table-column :label="$t('genotype.index.table_operate')" align="center"
            class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button size="small" type="text" icon="Download" :loading="downloadLoading" class="table_button"
                @click="handleDownload(scope.row)">{{ $t('genotype.index.download') }}
              </el-button>
              <el-button size="small" type="text" icon="Document" @click="openDrawer(scope.row)" class="table_button">{{
                $t('genotype.index.preview') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-drawer v-model="drawer" :title="fileName" size="70%">
        <el-container>
          <el-main>
            <div class="file_form">
              <!-- 表格部分 -->
              <el-table style="width: 95%; margin: auto" ref="multipleTable" v-loading="historyTableLoading"
                :data="tableData" tooltip-effect="dark" class="trait-form-table" stripe max-height="100vh - 220px">
                <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop"
                  :show-overflow-tooltip="true" width="150px" align="center">
                  <template #default="scope">
                    {{ formatTableCell(scope.row[column.prop]) }}
                  </template></el-table-column>
                <el-table-column label="..." width="auto">...</el-table-column>
              </el-table>
            </div>
          </el-main>

          <el-footer class="footer">
            <div class="demo-pagination-block">
              <el-pagination background :total="totalPage" :current-page="currentpageNum" :page-size="pageSize"
                :page-sizes="[15, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
          </el-footer>
        </el-container>
      </el-drawer>
    </el-config-provider>
  </div>
</template>

<script setup>
import {ref, getCurrentInstance, nextTick, onMounted, reactive} from "vue";
import { getTree, addNode, updateNode, deleteNodes } from "@/api/tree.js";
import {
  genoListFile,
  selectDetailByFileId,
  selectHistoryDetailByFileId,
  delFile,
  updateFile, genoHistoryListFile,
} from "@/api/infomanage/genotype";
import { getJsonByCSV, jsonToTable } from "@/utils/tree";
import useUserStore from "@/store/modules/user";
import { getToken } from "@/utils/auth";
import ShowCSVTable from "./ShowCSVTable.vue";
import { parseTime } from "@/utils/param";
import { getTreeNodeIdsByNode } from "@/utils/tree";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";

import { computed } from "@vue/reactivity";

import zh from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import en from 'element-plus/lib/locale/lang/en' // 英文语言

import { useI18n } from 'vue-i18n'
const i18n = useI18n();
const locale = computed(() => ((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? zh : en));


const text = {
  message: {
    getListFailed: computed(() => i18n.t('genotype.index.message_getListFailed')).value,
    input_fileName: computed(() => i18n.t('genotype.index.message_ message_input_fileName')).value,
    input_nodeName: computed(() => i18n.t('genotype.index.message_input_nodeName')).value,
    input_status: computed(() => i18n.t('genotype.index.message_input_status')).value,
    input_date: computed(() => i18n.t('genotype.index.message_input_date')).value,
    upload_vcf: computed(() => i18n.t('genotype.index.message_upload_vcf')).value,
    upload_wait: computed(() => i18n.t('genotype.index.message_upload_wait')).value,
    upload_compare: computed(() => i18n.t('genotype.index.message_upload_compare')).value,
    upload_fail: computed(() => i18n.t('genotype.index.message_upload_fail')).value,
    upload_success: computed(() => i18n.t('genotype.index.message_upload_success')).value,
    delete_select: computed(() => i18n.t('genotype.index.message_delete_select')).value,
    delete_confirm: computed(() => i18n.t('genotype.index.message_delete_confirm')).value,
    delete_success: computed(() => i18n.t('genotype.index.message_delete_success')).value,
    delete_fail: computed(() => i18n.t('genotype.index.message_delete_fail')).value,
    update_success: computed(() => i18n.t('genotype.index.message_update_success')).value,
    update_fail: computed(() => i18n.t('genotype.index.message_update_fail')).value,
    downloading: computed(() => i18n.t('genotype.index.message_downloading')).value,
    node_parent: computed(() => i18n.t('genotype.index.message_node_parent')).value,
    node_add_success: computed(() => i18n.t('genotype.index.message_node_add_success')).value,
    node_add_fail: computed(() => i18n.t('genotype.index.message_node_add_fail')).value,
    node_update_success: computed(() => i18n.t('genotype.index.message_node_update_success')).value,
    node_update_fail: computed(() => i18n.t('genotype.index.message_node_update_fail')).value,
    node_select: computed(() => i18n.t('genotype.index.message_node_select')).value,
    node_confirm: computed(() => i18n.t('genotype.index.message_node_confirm')).value,
    node_delete_success: computed(() => i18n.t('genotype.index.message_node_delete_success')).value,
    file_confirm: computed(() => i18n.t('genotype.index.message_file_confirm')).value,
  },
  rule:{
    name_require: computed(() => i18n.t('genotype.index.name_require')).value,

  }

};


const router = useRouter();

// vue实例
const {
  proxy: { $modal, $download },
} = getCurrentInstance();
// 登录用户权限
const { roles } = useUserStore();
const isDisabled = ref(false);
const isDisabled2 = ref(false);

// 加载
const loading = ref(false);
const loadingText = ref("加载中...");
const tableLoading = ref(false);

// 对话框
const dialogFormVisible = ref(false);
const dialogStatus = ref("create");
const textMap = {
  create: "添加文件",
  update: "修改文件",
  other: "选择合并文件",
  createNode: "添加节点",
  updateNode: "修改节点",
};

const titles = {
  create: computed(() => i18n.t('genotype.index.title_create')),
  update: computed(() => i18n.t('genotype.index.title_update')),
  other: computed(() => i18n.t('genotype.index.title_other')),
  createNode: computed(() => i18n.t('genotype.index.title_createNode')),
  updateNode: computed(() => i18n.t('genotype.index.title_updateNode')),
}

const textMaps = {
  create: titles.create.value,
  update: titles.update.value,
  other: titles.other.value,
  createNode: titles.createNode.value,
  updateNode: titles.updateNode.value,
};


// 表单实例
const form = ref(null);

// 表单参数
const dataForm = reactive({
  fileId: null,
  fileName: "",
  description: "",
  remark: "",
  fileStatus: true,
  dateTime: null,
});

//删除按钮状态
const deleteDisabled = ref(false);

// 校验规则
const rules = reactive({
  fileName: [
    {
      validator: (rule, value, callback) => {
        if (!value || !value.includes("_")) {
          callback(new Error(text.rule.name_require));
        } else {
          callback();
        }
      },
      trigger: "blur",
      required: true,
    },
  ],
  description: [
    { required: false, message: "请输入文件描述备注", trigger: "blur" },
  ],
  dateTime: [{ required: true, message: "请选择一个日期", trigger: "blur" }],
});

const dataForm2 = reactive({
  fileName: "",
  description: "",
  dateTime: "",
  fileStatus: false,
});

const drawer = ref(false); // 文件详情窗口开启状态
const fileName = ref(""); // 选中文件名
const curFileUrl = ref(""); //文件路径

//表单重置
function resetForm() {
  dataForm.fileId = null;
  dataForm.fileName = "";
  dataForm.description = "";
  dataForm.remark = "";
  dataForm.fileStatus = true;
  dataForm.dateTime = null;
}

const historyTableLoading = ref(false);
const drawerTableData = ref([]);
const tableProps = ref([]);
const pageSize = ref(15);
const totalPage = ref(0);
const currentpageNum = ref(1); //当前页数
//获取第一个表格
const columns = ref([]); // 表头数据
const tableData = ref([]); //表格数据

const traitFileId = ref(60);


function formatTableCell(value) {
  return value || '-'; // 如果值为空，返回'-'
}
// 开启文件详情窗口
async function openDrawer(row) {
  fileName.value = row.fileName;
  drawer.value = true;
  traitFileId.value = row.fileId;
  historyTableLoading.value = true;
  const queryParams2 = reactive({
    pageNum: 1,
    pageSize: 15,
  });
  queryParams2.pageNum = currentpageNum.value;
  queryParams2.pageSize = pageSize.value;

  selectHistoryDetailByFileId({
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
          console.log(tableDataValue, 'jkljk');
        });
      }

      columns.value = columnsValue.filter(column => column.label !== 'genotype_id');
      tableData.value = tableDataValue;
      console.log(tableData.value, '890');
      historyTableLoading.value = false;
    })
    .catch((err) => {
      tableLoading.value = false;
      console.error(err);
    });
}

async function fetchData(pageNumber, pageSize) {
  try {
    historyTableLoading.value = true;


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
          const visibleColumns = firstItemKeys.slice(0, 20); // 限制为前100列

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
        historyTableLoading.value = false;
      })
      .catch((err) => {
        historyTableLoading.value = false;
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

//预览
function modifFile(row) {
  dialogFormVisible.value = true;
  form.fileId = row.fileId;

  // 将行的值设置到表单中
  for (const column of columns.value) {
    form[column.prop] = row[column.prop];
  }
}


// 上传实例
const upload = ref(null);
// 文件上传
const uploadUrl = ref("");

//文件上传前触发
//文件格式验证
const handleBeforeUpload = (file) => {
  // 拿到文件后缀名
  const fileType = file?.name?.substring(file.name.lastIndexOf(".") + 1);
  const isVcf = fileType === "vcf";
  if (!isVcf) {
    $modal.msgError(
      text.message.upload_vcf,
      "error",
      "vab-hey-message-error"
    );
    return false;
  }
  return isVcf;
};

const handleUploadFile = (file) => {
  // Handle file upload
  console.log(file);
  dataForm.fileName =  dataForm.fileName ? dataForm.fileName : file.name.split('.')[0];
};

// 文件创建
const createData = async () => {
  const valid = await form.value.validate();
  dialogFormVisible.value = false;
  if (valid) {
    uploadUrl.value = `${import.meta.env.VITE_APP_UPLOAD_URL
      }/genotypeFile/upload?treeId=${tree.value.getCurrentNode().treeId
      }&status=${dataForm.fileStatus ? 1 : 0}&remark=${dataForm.remark
      }&fileName=${dataForm.fileName}`;

    try {
      dialogFormVisible.value = false;
      await upload.value.submit();
      await uploadFileSuccess({code:200,msg:'上传成功，请等待后台进行处理'});
    } catch (err) {
      $modal.msgError(err)
    } finally {
      isDisabled.value = true;
      tableLoading.value = false;
      tableName.value = "";
    }
  }

};

// 文件上传成功回调
async function uploadFileSuccess(response) {
  if (response.code === 200) {
    $modal.msgSuccess(response.msg);
  } else {
    $modal.msgError(response.msg);
  }
  isDisabled.value = false;
  const curNode = tree.value.getCurrentNode();
  rowClick(curNode);
  dialogFormVisible.value = false;
}

// 文件上传失败回调
const uploadFileError = (error) => {
  console.log("File upload error", error);
  $modal.msgError(text.message.upload_fail);
};

const tableName = ref("");

//文件合并
function mergeFile(row) {
  uploadFileList.value = [];
  dialogStatus.value = "other";
  tableName.value = row.tableName;
  uploadFileList.value = [];
  // resetForm();
  dialogFormVisible.value = true;
  isDisabled2.value = false;
}

const mergeData = async () => {
  const valid = await form.value.validate();
  if (valid) {
    uploadUrl.value = `${import.meta.env.VITE_APP_UPLOAD_URL
      }/genotypeFile/merge?tableName=${tableName.value
      }&fileName=${dataForm.fileName
      }&remark=${dataForm.remark}`;

    $modal.msg(text.message.upload_wait);

    try {
      await upload.value.submit();
      isDisabled2.value = true;
    } catch (error) {
      console.error(error);
    } finally {
      tableLoading.value = false;
      tableName.value = "";
      dialogFormVisible.value = false;
    }
  }

};

// 文件合并
async function updateData() {
  form.value.validate((valid) => {
    if (valid) {
      uploadUrl.value = `${import.meta.env.VITE_APP_UPLOAD_URL
        }/phenotypeFile/upload?fileName=${dataForm.fileName}&description=${dataForm.description
        }&fileStatus=${dataForm.fileStatus ? 1 : 0}&treeId=${tree.value.getCurrentNode().treeId
        }&dateTime=${parseTime(dataForm.dateTime)}`;
      nextTick(async () => {
        tableLoading.value = false;
        await upload.value.submit();
        isDisabled.value = true;
        getList();
      });
    }
  });
  dialogFormVisible.value = false;
  getList();
  setTimeout(() => {
    getList();
  }, 4000);
}

//取消文件对话框
function deleteUploadData() {
  dialogFormVisible.value = false;
  isDisabled.value = false;
  /*rules.value = {}; */
  if (form.value) {
    form.value.resetFields();
  }
  getList();
}

//关闭添加文件窗口
const dialogClosed = () => {
  getList();
};

/* const dialogClosed = () => {
  if (form.value) {
    form.value.resetFields();
  }
  getList();
}; */

// 文件替换
function handleExceed(files) {
  upload.value?.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  upload.value?.handleStart(file);
}

// 文件表格
const fileList = ref([]); // 文件列表
const uploadFileList = ref([]); // 上传文件列表
const historyFileList = ref([]); //历史文件版本
const ids = ref([]); // 选中数组
const multiple = ref(false); // 是否多选

// 打开添加文件对话框
function handleAdd() {
  dialogStatus.value = "create";
  uploadFileList.value = [];
  resetForm();
  dialogFormVisible.value = true;
  isDisabled.value = false;
}

// 删除文件
function handleDelete() {
  if (ids.value.length == 0) {
    $modal.msg(text.message.delete_select);
  } else {
    $modal.confirm(text.message.delete_confirm).then(() => {
      delFile(ids.value)
        .then((res) => {
          $modal.msgSuccess(text.message.delete_success);
          getList();
        })
        .catch((err) => {
          $modal.msgError(text.message.delete_fail);
        });
    });
  }
}

const allFileId = ref([]);

// 请求文件列表
// 请求文件列表
function getList() {
  tableLoading.value = true;
  genoListFile({
    ...queryParams,
    treeId: tree.value.getCurrentNode().treeId,
    fileStatus: roles[0] === "admin" ? null : 1,
  })
    .then((res) => {
      tableLoading.value = false;
      fileList.value = res.rows.map((item) => ({
        ...item,
        fileStatus: item.status === 1,
        // 根据 fileName 分割物种和群体
        fileSpecies: item.fileName.split("_")[0], // 分割前面的物种部分
        filePposition: item.fileName.split("_")[1], // 分割后面的群体部分
      }));
      fileList.value.forEach((item) => {
        allFileId.value.push(item.fileId);
      });
      fileList.value = fileList.value.filter(item => item.fileName.includes(queryParams.fileName));
      total.value = res.total;
    })
    .catch((err) => {
      tableLoading.value = false;
      console.log(err);
      $modal.msgError(text.message.getListFailed);
    });
}

// 选择文件项
function handleSelectionChange(selection) {
  ids.value = [];
  selection.forEach((item) => {
    ids.value.push(item.fileId);
  });
}

// 更新是否公开选项
async function updateFileStatus(row) {
  updateFile({
    fileId: row.fileId,
    fileStatus: row.fileStatus,
    fileName: row.fileName,
    description: row.description,
    dateTime: row.dateTime,
  })
    .then((res) => {
      $modal.msgSuccess(text.message.update_success);
    })
    .catch((err) => {
      $modal.msgError(text.message.update_fail);
    });
}

// 下载文件
const downloadLoading = ref(false);
let downloadTimer = null;
async function handleDownload(row) {
  console.log(row, '~~~~~');
  if (downloadLoading.value) {
    return;
  }
  $modal.msg(text.message.downloading);
  downloadLoading.value = true;
  try {
    await $download.resource(row.url);

    downloadTimer = setTimeout(() => {
      downloadLoading.value = false;
      clearTimeout(downloadTimer);
    }, 5000);
  } catch (error) {
    console.log(error);
    downloadLoading.value = false;
  }
}

// 修改文件
function handleUpdate(row) {
  dataForm.fileId = row.fileId;
  dataForm.fileName = row.fileName;
  dataForm.description = row.description;
  dataForm.fileStatus = row.fileStatus;
  dataForm.dateTime = row.dateTime;
  dialogFormVisible.value = true;
  dialogStatus.value = "update";
}

// 删除文件
function deleteFile(row) {
  $modal.confirm(text.message.delete_confirm).then(() => {
    delFile([row.fileId])
      .then((res) => {
        $modal.msgSuccess(text.message.delete_success);
        getList();
      })
      .catch((err) => {
        $modal.msgError(text.message.delete_fail);
      });
  });
}

//跳转文件详情
const openfile = (row) => {
  router.push({
    path: "/genotype/genofile",
    query: { id: row.fileId, tableName: row.tableName },
  });
};

const openVis = (row) => {
  router.push({
    path: "/genotype/genoview",
    query: { id: row.fileId, tableName: row.tableName },
  });
};

const openFilter = (row) => {
  router.push({
    path: "/genotype/filter",
    query: { id: row.fileId, tableName: row.tableName },
  });
};

const openHeatmap = (row) => {
  router.push({
    path: "/genotype/heatmap",
    query: { id: row.fileId, tableName: row.tableName },
  });
};

//查看文件历史版本
function openHistory(row) {
  historyFormVisible.value = true;
  genoHistoryListFile({
    ...queryParams,
    treeId: tree.value.getCurrentNode().treeId,
    fileStatus: roles[0] === "admin" ? null : 1,
    tableName: row.tableName,
  })
    .then((res) => {
      tableLoading.value = false;
      historyFileList.value = res.rows.map((item) => ({
        ...item,
        fileStatus: item.status === 1,
      }));
      historyFileList.value.forEach((item) => {
        allFileId.value.push(item.fileId);
      });
    })
    .catch((err) => {
      tableLoading.value = false;
      $modal.msgError(text.message.getListFailed);
    });
}

// 表单提交
const total = ref(2);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  treeId: "",
  fileId: "",
  fileName: "",
  description: "",
  fileStatus: "",
  dateTime: "",
});
const showSearch = ref(true);
const queryForm = ref(null); // 查询表单dom元素
const handleQuery = async () => {
  // 查询回调
  queryParams.treeId = tree.value.getCurrentNode().treeId;
  getList();
};

const resetQuery = () => {
  queryParams.pageNum = 1;
  queryParams.pageSize = 10;
  queryParams.treeId = 0;
  queryParams.fileId = "";
  queryParams.fileName = "";
  queryParams.description = "";
  queryParams.fileStatus = true;
  getList();
};

// 树控件
const routesData = ref([
  /*  {
    treeName: "Level one 1",
    treeId: "1",
    children: [
      {
        treeName: "Level two 1-1",
        treeId: "11",
        children: [
          {
            treeName: "Level three 1-1-1",
            treeId: "111",
          },
        ],
      },
    ],
  }, */
]);

// 树表单
const treeForm = reactive({
  treeName: "",
  isShow: true,
});

const dialogTreeFormVisible = ref(false); // 树表单可见
const historyFormVisible = ref(false); //历史上传记录表单
const dataTreeForm = ref(null); // 树表单dom实例
const dialogTreeStatus = ref("createNode");
//树表单验证规则
const treeRules = reactive({
  treeName: [
    { required: true, message: text.message.input_nodeName, trigger: "blur" },
  ],
  isShow: [{ required: true, message: "Please select", trigger: "blur" }],
});

// 树组件节点属性
const defaultProps = ref({
  children: "children",
  label: "treeName",
});

const treeType = ref(5); // 树的种类
const tree = ref(null); // 数的dom实例

const firstLeafNode = ref(null);
const firstLeafNodeKey = ref(null);

const getTreeList = () => {
  getTree(treeType.value, 0, 1).then((res) => {
    routesData.value = res.data.children;
    const firstLeafNode = findFirstLeafNode(routesData.value);
    if (firstLeafNode) {
      nextTick(() => {
        const treeComponent = tree.value;

        if (treeComponent) {
          treeComponent.setCurrentKey(firstLeafNode.treeId);
          rowClick(firstLeafNode);
        }
      });
    }
  });
};

// 递归查找第一个叶子节点的父节点的函数
function findFirstLeafNodeParent(nodes, parentNode = null) {
  for (const node of nodes) {
    if (!node.children || node.children.length === 0) {
      // 如果当前节点是叶子节点，返回其父节点
      return parentNode;
    } else {
      const firstLeafParent = findFirstLeafNodeParent(node.children, node);
      if (firstLeafParent) {
        return firstLeafParent;
      }
    }
  }
  return null;
}

// 递归查找第一个叶子节点的函数
function findFirstLeafNode(nodes) {
  for (const node of nodes) {
    if (!node.children || node.children.length === 0) {
      return node;
    } else {
      const firstLeaf = findFirstLeafNode(node.children);
      if (firstLeaf) {
        return firstLeaf;
      }
    }
  }
  return null;
}

// 重置树表单
function resetTreeForm() {
  treeForm.treeName = "";
  treeForm.isShow = true;
}

// 添加节点
function addChildNode() {
  if (!tree.value.getCurrentNode() && routesData.value.length !== 0) {
    $modal.msgWarning(text.message.node_parent);
    return;
  }
  resetTreeForm();
  dialogTreeStatus.value = "createNode";
  dialogTreeFormVisible.value = true;
}

// 修改节点
function updateChildNode() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning(text.message.node_parent);
    return;
  }
  resetTreeForm();
  dialogTreeStatus.value = "updateNode";
  dialogTreeFormVisible.value = true;
}

//下载模板文件
function downloadTemplate() {
  //下载
  $download.resource(
    "C:\\Users\\Administrator\\Desktop\\yuzhong\\基因型数据模板 .vcf"
  );
}

// 创建树节点
function createTreeData() {
  dataTreeForm.value.validate((valid) => {
    if (valid) {
      const id = tree.value.getCurrentNode()
        ? tree.value.getCurrentNode().treeId
        : 0;
      addNode({
        isShow: treeForm.isShow ? 1 : 0,
        treeName: treeForm.treeName,
        parentId: id,
        treeType: treeType.value,
      }).then(
        () => {
          $modal.msgSuccess(text.message.node_add_success);
          getTreeList();
        },
        () => {
          $modal.msgError(text.message.node_add_fail);
        }
      );
      dialogTreeFormVisible.value = false;
    }
  });
}

// 更新树节点
function updateTreeData() {
  dataTreeForm.value.validate((valid) => {
    if (valid) {
      updateNode({
        isShow: treeForm.isShow ? 1 : 0,
        treeName: treeForm.treeName,
        treeId: tree.value.getCurrentNode().treeId,
      }).then(
        () => {
          $modal.msgSuccess(text.message.node_update_success);
          getTreeList();
        },
        () => {
          $modal.msgError(text.message.node_update_fail);
        }
      );
      dialogTreeFormVisible.value = false;
    }
  });
}

//删除节点
function deleteNode() {
  if (!tree.value.getCurrentNode()) {
    $modal.msgWarning(text.message.delete_select);
    return;
  }
  $modal.confirm(text.message.node_confirm).then(() => {
    const curNode = tree.value.getCurrentNode();
    const curNodeTreeIds = getTreeNodeIdsByNode(curNode);
    deleteNodes(curNodeTreeIds).then(() => {
      $modal.msgSuccess(text.message.delete_success);
      getTreeList();
    });
  });
}

//树控件点击回调
function rowClick(nodeObj) {
  /* resetForm(); */
  treeRules.value = {};
  /* rules.value = {};  */
  treeForm.treeName = nodeObj.treeName;
  treeForm.isShow = nodeObj.isShow === 1;

  queryParams.treeId = nodeObj.treeId;
  resetQuery();
  getList();
}

onMounted(() => {
  getTreeList();
});
</script>

<style lang="less" scoped>
:deep(.el-form-item__label) {
  width: 110px;
}

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
  background: #0F5C32;
  margin-top: 10px;

  .el-dialog__title {
    color: white;
  }
}

:deep(.dialog-footer) {
  .el-button--primary {
    background: rgb(85, 123, 116);
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
  display: inline-block;
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

:deep(.el-tree) {
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

:deep(.el-radio) {
  width: 30%;
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