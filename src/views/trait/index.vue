<template>
  <div class="app-container" style="width: 100%;min-height: calc(100vh - 84px);background-color: #eeeeee;">
    <el-config-provider :locale="locale">
      <el-card>
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="auto">
          <el-form-item :label="$t('basic.label.traitName')" prop="traitName">
            <el-input v-model="queryParams.traitName" :placeholder="$t('basic.placeholder.traitName')" clearable
              @keyup.enter.native="handleQuery" />
            <!-- <el-select v-model="queryParams.traitName" class="m-2" placeholder="请输入性状名称" clearable>
          <el-option
            v-for="item in traitOptions"
            :key="item"
            :value="item"
          />
        </el-select> -->
          </el-form-item>
          <el-form-item :label="$t('basic.label.fullname')" prop="fullName">
            <el-input v-model="queryParams.fullName" :placeholder="$t('basic.placeholder.fullname')" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item :label="$t('basic.label.abbreviation')" prop="abbreviationName">
            <el-input v-model="queryParams.abbreviationName" :placeholder="$t('basic.placeholder.abbreviation')" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8"><el-button type="primary" icon="Search" @click="handleQuery">{{ $t('basic.button.search') }}</el-button>
            <el-button icon="Refresh" @click="resetQuery">{{ $t('basic.button.reset') }}</el-button></el-row>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">

            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:trait:add']">{{
              $t('basic.button.add') }}</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
              v-hasPermi="['system:trait:edit']">{{ $t('basic.button.update') }}</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['system:trait:remove']">{{ $t('basic.button.delete') }}</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:trait:export']">{{
              $t('basic.button.export') }}</el-button>
          </el-col>
          <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>

        <el-table :data="traitList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column :label="$t('basic.table.index')" align="center" type="index" width="80" />
          <el-table-column :label="$t('basic.table.traitName')" align="center" prop="traitName" />
          <el-table-column :label="$t('basic.table.fullname')" align="center" prop="fullName" />
          <el-table-column :label="$t('basic.table.abbreviation')" align="center" prop="abbreviationName" />
          <el-table-column :label="$t('basic.table.comment')" align="center" prop="remark" />
          <el-table-column :label="$t('basic.table.operate')" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-tooltip :content="$t('basic.button.update')" placement="top">
                <el-button type="text" @click="handleUpdate(scope.row)" class="table_button"
                  icon="edit"></el-button></el-tooltip>
              <el-tooltip :content="$t('basic.button.delete')" placement="top">
                <el-button type="text" @click="handleDelete(scope.row)" class="table_button"
                  icon="delete"></el-button></el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination v-show="total > 0" :total="total" :page-sizes="[10, 20, 30, 50]" background
          v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper" @size-change="getList" @current-change="getList" />
      </el-card>
      <!-- 添加或修改【请填写功能名称】对话框 -->
      <el-dialog :title="title" v-model="open" width="500px">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item :label="$t('basic.label.traitName')" prop="traitName">
            <el-input v-model="form.traitName" :placeholder="$t('basic.placeholder.traitName')" />
          </el-form-item>
          <el-form-item :label="$t('basic.label.fullname')" prop="fullName">
            <el-input v-model="form.fullName" :placeholder="$t('basic.placeholder.fullname')" />
          </el-form-item>
          <el-form-item :label="$t('basic.label.abbreviation')" prop="abbreviationName">
            <el-input v-model="form.abbreviationName" :placeholder="$t('basic.placeholder.abbreviation')" />
          </el-form-item>
          <el-form-item :label="$t('basic.label.comment')" prop="remark">
            <el-input v-model="form.remark" type="textarea" :placeholder="$t('basic.placeholder.comment')" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" plain @click="submitForm">{{ $t('basic.button.save') }}</el-button>
          <el-button type="info" plain @click="cancel">{{ $t('basic.button.cancel') }}</el-button>
        </div>
      </el-dialog>
    </el-config-provider>
  </div>
</template>

<script>
import { download, checkout, listTrait, getTrait, delTrait, addTrait, updateTrait, getSelect } from "@/api/system/trait";
import { blobValidate } from '@/utils/param'
import { saveAs } from 'file-saver'
export default {
  name: "Trait",
  data() {
    return {
      name: "",
      ifAdd: 0,
      // 遮罩层
      loading: true,
      // 选中数组
      traitId: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      traitList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        traitName: null,
        fullName: null,
        abbreviationName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      locale: computed(() => (localStorage.getItem('lang') === 'zh-CN' ? zh : en)),
      //性状名称下拉框
      traitOptions: []
      // addition:
    };
  },
  created() {
    this.getList();
    // this.getsel();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listTrait(this.queryParams).then(response => {
        this.traitList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        traitId: null,
        traitName: null,
        fullName: null,
        abbreviationName: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.traitId = selection.map(item => item.traitId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.locale.name === 'en' ? "Add Trait Information" : "添加性状信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const traitId = row.traitId || this.traitId
      getTrait(traitId).then(response => {
        this.form = response.data;
        this.name = this.form.traitName
        this.open = true;
        this.title = this.locale.name === 'en' ? "Update Trait Information" : "修改性状信息";
      });
    },
    /** 提交按钮 */
    submitForm() {

      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.traitId != null) {
            if (this.name == this.form.traitName) {
              updateTrait(this.form).then(response => {
                this.$modal.msgSuccess(this.locale.name === 'en' ? "Update successfully!" : "修改成功！");
                this.open = false;
                this.getList();
              });
            }
            else {
              checkout(this.form).then(res => {
                this.ifAdd = res.data;
                if (this.ifAdd == 0) {
                  updateTrait(this.form).then(response => {
                    this.$modal.msgSuccess(this.locale.name === 'en' ? "Update successfully!" : "修改成功！");
                    this.open = false;
                    this.getList();
                  });
                }
                else { this.$modal.msgWarning(this.locale.name === 'en' ? "This species name already exists!" : "该名称已存在！") }
              })
            }
          } else {
            checkout(this.form).then(res => {
              this.ifAdd = res.data
              if (this.ifAdd == 0) {
                addTrait(this.form).then(response => {
                  this.$modal.msgSuccess(this.locale.name === 'en' ? "Add Successfully!" : "新增成功！")
                  this.open = false;
                  this.getList();
                });
              }
              else {
                this.$modal.msgWarning(this.locale.name === 'en' ? "This species name already exists!" : "该名称已存在！")
              }
            })

          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const traitIds = row.traitId || this.traitId;
      this.$modal.confirm(this.locale.name === 'en' ? 'Are you sure you want to delete the item numbered"' + traitIds + '"?' : '是否确认删除编号为"' + traitIds + '"的数据项？').then(function () {
        return delTrait(traitIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess(this.locale.name === 'en' ? 'Delete successfully!' : "删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const trait_id = this.traitId
      // let formdata = new FormData()
      // formdata.append("species_id",species_id)
      download(trait_id).then(res => {
        const isLogin = blobValidate(res);
        if (isLogin) {
          const blob = new Blob([res])
          // console.log(blob)
          saveAs(blob, `trait${new Date().getTime()}.xlsx`)
        } else {
          const resText = data.text();
          const rspObj = JSON.parse(resText);
          const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
          Message.error(errMsg);
        }
      })
    },

  }
};
</script>

<script setup>
import { computed } from "@vue/reactivity";

import zh from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import en from 'element-plus/lib/locale/lang/en' // 英文语言

import { useI18n } from 'vue-i18n'
const i18n = useI18n();
const locale = computed(() => ((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? zh : en));

const messages = {
  rules: {
    speciesName: computed(() => i18n.t('basic.rule.speciesName')).value,
    creator: computed(() => i18n.t('basic.rule.creator')).value,
    createTime: computed(() => i18n.t('basic.rule.createTime')).value,
    updater: computed(() => i18n.t('basic.rule.updater')).value,
    updateTime: computed(() => i18n.t('basic.rule.updateTime')).value,
    speciesId: computed(() => i18n.t('basic.rule.speciesId')).value,
    populationName: computed(() => i18n.t('basic.rule.populationName')).value,
    traitName: computed(() => i18n.t('basic.rule.traitName')).value,
    fullname: computed(() => i18n.t('basic.rule.fullname')).value,
    abbreviation: computed(() => i18n.t('basic.rule.abbreviation')).value,
  },
  title: {
    updateSpecies: computed(() => i18n.t('basic.title.updateSpecies')).value,
    addSpecies: computed(() => i18n.t('basic.title.update_addSpecies')).value,
  },
  update_success: computed(() => i18n.t('basic.message.update_success')).value,
  species_exist: computed(() => i18n.t('basic.message.species_exist')).value,
  delete_confirm1: computed(() => i18n.t('basic.message.delete_confirm1')).value,
  delete_confirm2: computed(() => i18n.t('basic.message.delete_confirm2')).value,
  delete_success: computed(() => i18n.t('basic.message.delete_success')).value,

};

const rules = reactive({
  traitName: [
    { required: true, message: messages.rules.traitName, trigger: "blur" }
  ],
  fullName: [
    { required: true, message: messages.rules.fullname, trigger: "blur" }
  ],
  abbreviationName: [
    { required: true, message: messages.rules.abbreviation, trigger: "blur" }
  ],
  createBy: [
    { required: true, message: messages.rules.creator, trigger: "blur" }
  ],
  createTime: [
    { required: true, message: messages.rules.createTime, trigger: "blur" }
  ],
  updateBy: [
    { required: true, message: messages.rules.updater, trigger: "blur" }
  ],
  updateTime: [
    { required: true, message: messages.rules.updateTime, trigger: "blur" }
  ],
})
</script>

<!-- el-dialog的append-to-body属性会导致el-dialog的样式修改失效，先去掉 -->
<style lang="less" scoped>
:deep(.el-dialog__header) {
  margin-right: 0px;
  background: #0F5C32;
  height: 60px !important;

  span {

    font-weight: 700;
    font-size: 20px;
    color: white;
    letter-spacing: 2px;

    align-items: center;
    justify-content: center;
    display: flex;
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

:deep(.el-radio) {
  width: 30%;
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

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  position: relative;
  background-color: #fff;
  width: auto;
  min-width: 150px;
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

:deep(.el-input__inner) {
  margin: 0%;
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
