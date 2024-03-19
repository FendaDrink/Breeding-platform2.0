<template>
  <div class="app-container" style="width: 100%;min-height: calc(100vh - 84px);background-color: #eeeeee;">
    <el-card>
      <el-form :model="queryParams" ref="queryForm" size="large" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item label="环境因子类型">
          <el-select v-model="add.type" class="m-2" placeholder="请选择形状类型" clearable>
            <el-option v-for="item in factorOptions" :key="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="环境因子名称">
          <el-input v-model="add.name" placeholder="请输入环境因子名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" size="large" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" size="large" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="warning" plain size="large" @click="isModify"
                     v-hasPermi="['system:factor:export']">确认修改</el-button>
        </el-col>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table ref="multipleTable" :data="factorList" v-model="selectArr" @selection-change="handleSelectionChange"
                @select="handleSelect" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column label="环境因子名称" align="center" prop="factorName" />
        <el-table-column label="全称" align="center" prop="factorFullName" />
        <el-table-column label="缩写" align="center" prop="factorAbbreviationName" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>

      <el-pagination v-show="total > 0" :total="total" :page-sizes="[10, 20, 30, 50]" background
                     v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" @size-change="getHigh" @current-change="getHigh" />
    </el-card>
    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" v-model="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="环境因子名称" prop="factorName">
          <el-input v-model="form.factorName" placeholder="请输入环境因子名称" />
        </el-form-item>
        <el-form-item label="全称" prop="factorFullName">
          <el-input v-model="form.factorFullName" placeholder="请输入全称" />
        </el-form-item>
        <el-form-item label="缩写" prop="factorAbbreviationName">
          <el-input v-model="form.factorAbbreviationName" placeholder="请输入缩写" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addHigh, selHighL, download, getSelect, getLightLine, listFactor, addFactor, updateFactor } from "@/api/factor/factor";
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        factorName: [
          { required: true, message: "环境因子名称不能为空", trigger: "blur" }
        ],
        factorFullName: [
          { required: true, message: "全称不能为空", trigger: "blur" }
        ],
        factorAbbreviationName: [
          { required: true, message: "缩写不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建者不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateBy: [
          { required: true, message: "更新者不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
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
      flen: 0,
      Tlen: 0
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
        console.log(response)
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
    getHigh() {
      this.loading = true;
      let formdata = new FormData()
      formdata.append("type", this.add.type)
      formdata.append("name", this.add.name)
      getLightLine(this.queryParams, formdata).then(response => {
        console.log(response)
        this.factorList = response.rows
        this.total = response.total
        let query = { ...this.add, ...this.queryParams }
        selHighL(query).then(res => {
          console.log(res)
          this.len = res.data
          this.selectArr = this.factorList.slice(0, this.len)
          this.$refs.multipleTable.clearSelection();
          this.selectArr.forEach(item => {
            this.$refs.multipleTable.toggleRowSelection(item, true)
          })
          this.tableRowClassName = ({ row, rowIndex }) => {
            console.log(row)
            console.log(rowIndex)
            if (rowIndex < this.len) {
              return "success-row"
            }
            else return ""
          }
        })

        this.loading = false;
      });
    },
    gethigh() {
      this.loading = true;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getHigh();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.add.name = ""
      this.add.type = ""
      this.len = ""
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection)
      this.factorId = selection.map(item => item.factorId)
      console.log(this.factorId)
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.factorId != null) {
            updateFactor(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFactor(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
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
      // let formdata = new FormData()
      // formdata.append("species_id",species_id)
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
      console.log(selection)
      console.log(row)
      selection.forEach(item => {
        console.log(item)
        //让某一行默认选中
        this.$refs.multipleTable.toggleRowSelection(item, true)
      });

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
      if (obj.type == "" || obj.type == null) {
        ElMessage.warning("请通过形状类型来修改！！")
      }
      else {
        addHigh(obj).then(res => {
          this.resetQuery()
        })
      }

    }
  }
};
</script>
<style lang="scss">
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
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
