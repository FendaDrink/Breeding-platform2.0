<template>
  <div class="app-container" style="width: 100%;min-height: calc(100vh - 84px);background-color: #eeeeee;">
    <el-card>
      <el-form :model="queryParams" ref="queryForm"  :inline="true" v-show="showSearch" label-width="140px">
        <el-form-item :label="$t('basic.label.factorTypeName')">
          <el-select v-model="add.type" class="m-2" :placeholder="$t('basic.placeholder.factorTypeName')" clearable>
            <el-option v-for="item in factorOptions" :key="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('basic.label.factorName')">
          <el-input v-model="add.name" :placeholder="$t('basic.placeholder.factorName')" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="isSearching" icon="Search"  @click="handleQuery" >{{ $t('basic.button.search') }}</el-button>
          <el-button icon="Refresh"  @click="resetQuery" >{{ $t('basic.button.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="warning" plain  @click="isModify" :loading="isModifing" icon="edit"
                     v-hasPermi="['system:factor:export']">{{ $t('basic.button.confirmUpdate') }}</el-button>
        </el-col>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table ref="multipleTable" :data="factorList" v-model="selectArr" @selection-change="handleSelectionChange" :cell-style="emptyHandler"
                @select="handleSelect" @select-all="handleSelectAll" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column :label="$t('basic.table.index')" type="index" width="65" />
        <el-table-column :label="$t('basic.table.factorName')" align="center" prop="factorName" />
        <el-table-column :label="$t('basic.table.fullName')" align="center" prop="factorFullName" />
        <el-table-column :label="$t('basic.table.abbreviation')" align="center" prop="factorAbbreviationName" />
        <el-table-column :label="$t('basic.table.comment')" align="center" prop="remark" />
      </el-table>

      <el-pagination v-show="total > 0" :total="total" :page-sizes="[10, 20, 30, 50]" background
                     v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="getHigh" @current-change="getHigh" />
    </el-card>
    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" v-model="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-form-item :label="$t('basic.table.factorName')" prop="factorName">
          <el-input v-model="form.factorName" placeholder="$t('basic.placeholder.factorName')" />
        </el-form-item>
        <el-form-item :label="$t('basic.table.fullName')" prop="factorFullName">
          <el-input v-model="form.factorFullName" placeholder="$t('basic.placeholder.fullName')" />
        </el-form-item>
        <el-form-item :label="$t('basic.table.abbreviation')" prop="factorAbbreviationName">
          <el-input v-model="form.factorAbbreviationName" placeholder="$t('basic.placeholder.abbreviation')" />
        </el-form-item>
        <el-form-item :label="$t('basic.table.comment')" prop="remark">
          <el-input v-model="form.remark" type="textarea" :placeholder="$t('basic.table.comment')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" plain @click="submitForm">{{ $t('basic.button.confirm') }}</el-button>
        <el-button type="info" plain @click="cancel">$t('basic.button.confirm')</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addHigh, selHighLAll, download, getSelect, getLightLine, listFactor,getLightLineAll, addFactor, updateFactor } from "@/api/factor/factor";
import { blobValidate } from '@/utils/param'
import { ElMessage } from "element-plus";
import { saveAs } from 'file-saver'
export default {
  name: "Factor",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      factorId: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      factorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      //记录是否第一次查询
      isFirstSearch: true,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        factorName: [
          {required: true, message: "环境因子名称不能为空", trigger: "blur"}
        ],
        factorFullName: [
          {required: true, message: "全称不能为空", trigger: "blur"}
        ],
        factorAbbreviationName: [
          {required: true, message: "缩写不能为空", trigger: "blur"}
        ],
        createBy: [
          {required: true, message: "创建者不能为空", trigger: "blur"}
        ],
        createTime: [
          {required: true, message: "创建时间不能为空", trigger: "blur"}
        ],
        updateBy: [
          {required: true, message: "更新者不能为空", trigger: "blur"}
        ],
        updateTime: [
          {required: true, message: "更新时间不能为空", trigger: "blur"}
        ],
      },
      //高亮显示
      tableRowClassName: '',
      add: {
        type: "",
        name: ""
      },
      rowid: [],
      factorOptions: [],
      len: "",
      selectArr: [],
      //所有选中的数据
      allSelecArr: {},
      //是否为第一次查询
      isFirstSelection: true,
      //保存每页当前的数据
      pageSelection: [],
      //保存上一次的数据
      lastSelection: [],
      //加载项
      isSearching: false,
      isModifing: false,
      flen: 0,
      Tlen: 0,
    };
  },
  created() {
    this.getHigh();
    this.getsel();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      let query = { ...this.queryParams, ...this.add }
      listFactor(query).then(response => {
        console.log(response);
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
        factorId: null,
        factorName: null,
        factorFullName: null,
        factorAbbreviationName: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.add.type = ""
      this.add.name = ""
      this.len = ""
      this.resetForm("form");

    },
    // 处理空白单元格
    emptyHandler({row,column}){
      row[column.property] = row[column.property] || '-'
    },
    getHigh() {
      this.loading = true;
      getLightLine({...this.queryParams, ...this.add}).then(response => {
        const responseData=response.data
        this.factorList = responseData.data
        this.total = responseData.total
        if ((this.add.type || this.add.name) && responseData.size === 0 && this.isFirstSearch) {
          ElMessage.warning((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? '没有符合条件的数据！' : 'No eligible data!')
        } else if ((this.add.type || this.add.name) && this.isFirstSearch) {
          ElMessage.success((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? '查询成功！' : 'Search successfully!')
        }
        this.isFirstSelection = true
        this.isFirstSearch = false
        this.len = responseData.size
        const num = this.queryParams.pageNum
        const size = this.queryParams.pageSize
        const start = (num - 1) * size
        this.selectArr = this.factorList.slice(0, this.len)
        this.$refs.multipleTable.clearSelection();
        setTimeout(()=>{
          this.pageSelection = []
          this.factorList.forEach((item, index) => {
            if (this.allSelecArr[index + start] && item.factorId === this.allSelecArr[index + start].factorId) {
              this.$refs.multipleTable.toggleRowSelection(item, true)
              this.pageSelection.push(index)
            }
          });
          this.isSearching = false
        },0)
        this.tableRowClassName = ({row, rowIndex}) => {
          if (this.allSelecArr[rowIndex + start] && row.factorId === this.allSelecArr[rowIndex + start].factorId) {
            return "success-row"
          } else return ""
        }
        this.loading = false;
      })
    },
    //查询所有选择的数据
    getAllSelection() {
      return new Promise((resolve, reject) => {
        getLightLineAll({
          ...this.add,
          pageNum: 1,
          pageSize: 1000
        })
            .then(res => {
              const resData = res.data
              resData.data.slice(0, resData.size).forEach((item, index) => {
                  this.allSelecArr[index] = item
                })
                resolve()
            });
      })
    },
    /** 搜索按钮操作 */
    async handleQuery() {
      if (this.add.type === "" && this.add.name === "") {
        ElMessage.warning((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? '请输入查询条件！' : 'Please enter the search criteria!')
        return
      }
      this.queryParams.pageNum = 1;
      this.isFirstSearch = true;
      this.isFirstSelection = true
      this.allSelecArr = {}
      this.factorId = []
      this.isSearching = true
      this.getAllSelection().then(() => {
        this.getHigh();
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.add.name = ""
      this.add.type = ""
      this.len = ""
      this.allSelecArr = {}
      this.factorId = []
      this.queryParams.pageNum = 1;
      this.isFirstSearch = true;
      this.isFirstSelection = true
      this.getHigh();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.isFirstSelection = false
      //获取allSelecArr的id数组
      console.log(this.allSelecArr, "this.allSelecArr111");
      this.factorId = []
      for (let key in this.allSelecArr) {
        this.factorId.push(this.allSelecArr[key].factorId)
      }
      console.log(this.factorId, "this.factorId");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.factorId != null) {
            updateFactor(this.form).then(response => {
              this.$modal.msgSuccess((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? '修改成功' : 'Update successfully!');
              this.open = false;
              this.getList();
            });
          } else {
            addFactor(this.form).then(response => {
              this.$modal.msgSuccess((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? '新增成功' : 'Add successfully!');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // /** 删除按钮操作 */
    /** 导出按钮操作 */
    handleExport() {
      const factor_id = this.factorId
      download(factor_id).then(res => {
        const isLogin = blobValidate(res);
        if (isLogin) {
          const blob = new Blob([res])
          // console.log(blob)
          saveAs(blob, `factor_classification${new Date().getTime()}.xlsx`)
        } else {
          const resText = data.text();
          const rspObj = JSON.parse(resText);
          const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
          Message.error(errMsg);
        }
      })
    },
    //选中行高亮
    handleSelect(selection, row) {
      console.log(selection, "selection");
      const index = this.factorList.findIndex(item => item.factorId === row.factorId) + (this.queryParams.pageNum - 1) * this.queryParams.pageSize
      console.log(this.pageSelection, "this.pageSelection计算前");
      this.lastSelection = this.pageSelection
      this.pageSelection = selection
      console.log(this.pageSelection, this.pageSelection.length, "this.pageSelection");
      console.log(this.lastSelection, this.lastSelection.length, "this.lastSelection");
      if (this.pageSelection.length > this.lastSelection.length) {
        this.allSelecArr[index] = row
      } else {
        delete this.allSelecArr[index]
      }
      console.log(this.allSelecArr, "this.allSelecArr");
    },
    //全选数据
    handleSelectAll(selection) {
      const start = (this.queryParams.pageNum - 1) * this.queryParams.pageSize
      if (selection.length === 0) {
        this.pageSelection = []
        this.factorList.forEach((item, index) => {
          delete this.allSelecArr[index + start]
        })
      } else {
        this.pageSelection = selection
        selection.forEach((item, index) => {
          this.allSelecArr[index + start] = item
        })
      }
      this.factorId = []
      for (let key in this.allSelecArr) {
        this.factorId.push(this.allSelecArr[key].factorId)
      }
    },
    getsel() {
      getSelect().then(res => {
        console.log(res)
        this.factorOptions = res.data
      })
    },
    isModify() {
      let obj = {
        list: [],
        type: ""
      }
      obj.list = this.factorId
      obj.type = this.add.type
      if (obj.type === "" || obj.type == null) {
        ElMessage.warning((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? '请通过性状类型来修改！' : 'Please modify by character type!')
      } else {
        this.isModifing = true
        addHigh(obj).then(res => {
          if (res.code === 200) {
            ElMessage.success((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? '修改成功！' : 'Update successfully!')
          } else {
            ElMessage.error((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? '修改失败！' : 'Update failed!')
          }
          this.resetQuery()
          this.isModifing = false
        })
      }

    }
  }
};
</script>
<style>
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>

<style lang="less" scoped>
:deep(.el-dialog__header) {
  margin-right: 0px;
  background: var(--theme-color);
  height: 60px !important;

  span {

    font-weight: 700;
    font-size: 20px;
    color: white;
    letter-spacing: 2px;
  }
}

:deep(.el-radio) {
  width: 30%;
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

//三级节点选择器
:deep(.el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content) {
  font-weight: 400;
  height: 23px;

  .el-tree-node__label {
    font-size: 14px;
  }
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

// .el-select-dropdown__item.selected {
//   color: var(--theme-color);
// }

// .el-input {
//   --el-input-focus-border-color: var(--theme-color);
// }

// .el-select {
//   --el-select-input-focus-border-color: var(--theme-color);
// }

/* 开关组件 */
// :deep(.el-switch.is-checked .el-switch__core) {
//   border-color: var(--theme-color);
//   background-color: var(--theme-color);
// }

/* 多选组件 */
// :deep(.el-checkbox) {
//   --el-checkbox-checked-input-border-color: var(--theme-color);
//   --el-checkbox-checked-bg-color: var(--theme-color);
//   --el-checkbox-input-border-color-hover: var(--theme-color);
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