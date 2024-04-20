// zh.js
export default {
    genotype: {
        index: {
            node_add: '添加子节点',
            node_update: '更新节点',
            node_delete: '删除节点',
            template_download: '下载模板文件',

            search: '搜索',
            reset: '重置',
            download: '下载',
            cancel: '取消',
            preview: '预览',
            merge: '合并',
            save: '保存',
            upload: '上传',


            file_add: '新增',
            file_delete: '删除',

            table_index: '序号',
            table_fileName: '文件名',
            table_speciesName: '物种名称',
            table_populationName: '群体名称',
            table_year: '年份',
            table_location: '地区',
            table_fileStatus: '是否公开',
            table_operate: '操作',
            table_previousVersions: '历史版本',
            table_merge: '合并操作',


            tooltip_detail: '文件详情',
            tooltip_view: '可视化',
            tooltip_delete: '删除',
            tooltip_historicalVersions: '查看历史版本',
            tooltip_merge: '合并',
            tooltip_screen:'基因筛选',
            tooltip_heatmap:'基因热力图',

            placeholder_fileName: '输入文件名称',
            placeholder_node: '输入节点新名称',
            placeholder_comment: '输入备注',

            title_create: '添加文件',
            title_update: '更新文件',
            title_other: '选择合并文件',
            title_createNode: '添加节点',
            title_updateNode: '更新节点',
            title_history: '历史版本',

            dialog_nodeName: '节点名称：',
            dialog_status: '是否公开：',
            dialog_fileName: '文件名称：',
            dialog_comment: '备注：',
            dialog_upload: '上传文件',

            name_require:'文件名格式必须为"物种_群体(不含-)"',

            message_fileName: '文件名不能为空',
            message_date: '请选择一个日期',




            message_getListFailed: '获取列表失败！',
            message_input_fileName: '文件名不能为空！',
            message_input_nodeName: '节点名不能为空！',
            message_input_status: '选择状态！',
            message_input_date: '请选择日期！',
            message_upload_vcf: '只能上传vcf格式的文件！',
            message_upload_wait: '上传数据较大，请耐心等待！',
            message_upload_compare: '格式不正确，请下载模板文件比对！',
            message_upload_fail: '上传失败！',
            message_upload_success: '上传成功！',
            message_delete_select: '您没有选择文件！',
            message_delete_confirm: '是否删除文件？',
            message_delete_success: '删除成功！',
            message_delete_fail: '删除失败！',
            message_update_success: '更新成功！',
            message_update_fail: '更新失败！',
            message_downloading: '正在下载中，请等待',
            message_node_parent: '请选择父节点！',
            message_node_add_success: '添加节点成功！',
            message_node_add_fail: '添加节点失败！',
            message_node_update_success: '更新节点成功！',
            message_node_update_fail: '更新节点失败！',
            message_node_select: '请选择节点！',
            message_node_confirm: '是否删除该节点？',
            message_node_delete_success: '删除节点成功！',
            message_file_confirm: '是否删除文件？',

        },
        file: {
            table_operate: '操作',


            button_search: '搜索',
            button_reset: '重置',
            button_export: '导出',
            button_save: '保存',
            button_cancel: '取消',
            wait:'文件生成中，请等待！',

            label_material: '材料名',
            label_phenotype: '表型名',
            label_operation: '操作',

            placeholder_material: '请选择材料名',
            placeholder_phenotype: '请选择表型名',

            title_update: '修改文件信息',
            tooltip_update: '修改文件信息',
            rule_key:'请输入名称',
            rule_value:'请输入值',
            placeholder:'请输入值',
        },
        area: {
            button_search: '搜索',

            table_index: '序号',
            table_traitName: '性状名',
            table_fullName: '全称',
            table_abbreviationName: '缩写',
            table_remark: '备注',
            table_name: '名称',
            table_type: '数据源类型',
            table_Location: '地区',
            table_longitude: '经度',
            table_latitude: '纬度',

            label_country: '国家',
            label_location: '地区',
            label_longitude: '经度',
            label_latitude: '纬度',

            header1: '根据地区搜索性状',
            header2: '根据性状搜索地区'


        },
        view: {
            header:'染色体密度图',
        },
        filter:{
            header:'基因型数据筛选',
            label:{
                index:'序号',
                name:'材料名',
                placeholder:'请选择'
            },
            t1:'染色体：',
            t2:'位置：',
            t3:'标记编号：',
            t4:'基因信息：',
        },
        heatmap:{
            ph:{
                name:'材料名',
                gene:'基因型',
                start:'起始值',
                end:'终止值',
            }
        },
        pca:{
            header:'表型文件选择',
            noFile:'此节点下无文件'
        },
        visualization:{
            select_date:'日期选择',
            dateRange:{
                start:'开始日期',
                end:'结束日期',
                last_week:'最近一周',
                last_month:'最近一个月',
                last_threeMonth:'最近三个月'
            },
            to:'至',
            barChart_title:'文件数量统计',
            lineChart_title:'文件数量变化统计',
            header:'基因型可视化',
            feature:{
                save:'保存为图片',
                mytool1:'全选/取消全选',
                mytool2:'展开/收起图例',
            },
            chooseAll: '已全选！',
            chooseAllCancel: '已取消全选！'
        }
    }
}
