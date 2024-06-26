// zh.js
export default {
    environment: {
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
            table_start:'开始时间',
            table_end:'结束时间',
            table_longitude:'经度',
            table_latitude:'纬度',
            table_location: '地区',
            table_fileStatus: '是否公开',
            table_operate: '操作',
            table_previousVersions: '历史版本',
            table_merge: '合并操作',


            tooltip_detail: '文件详情',
            tooltip_view1: '环境分类可视化',
            tooltip_view2: '环境因子可视化',
            tooltip_delete: '删除',
            tooltip_historicalVersions: '查看历史版本',
            tooltip_merge: '合并',
            tooltip_screen:'可视化',
            tooltip_heatmap:'基因热力图',

            placeholder_fileName: '输入文件名称',
            placeholder_node: '输入节点新名称',
            placeholder_comment: '输入备注',
            placeholder_location:'输入地区',
            placeholder_longitude:'输入经度',
            placeholder_latitude:'输入纬度',

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
            dialog_location:'地区：',
            dialog_longitude:'经度：',
            dialog_latitude:'纬度：',

            name_require:'文件名格式必须为"物种_群体"',

            message_fileName: '文件名不能为空',
            message_date: '请选择一个日期',




            message_getListFailed: '获取列表失败！',
            message_input_fileName: '文件名不能为空！',
            message_input_nodeName: '节点名不能为空！',
            message_input_commentName:'备注不能为空！',
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

            message_area1:'请输入地区(中文)',
            message_area2:'地区只能输入中文',
            message_longitude:'请输入经度',
            message_latitude:'请输入纬度',
            message_merge_success:'合并成功！',

        },
        file: {
            table_operate: '操作',
            table_env:'环境Id',
            table_location:'地区',
            table_date:'日期',
            table_comment:'备注',



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
            table_fullName: '全称',
            table_abbreviationName: '缩写',
            table_remark: '备注',
            table_type: '数据源类型',
            table_location: '地区',
            table_longitude: '经度',
            table_latitude: '纬度',
            table_factorName:'环境因子名',
            table_name:'名称',

            label_country: '国家',
            label_location: '地区',
            label_longitude: '经度',
            label_latitude: '纬度',

            header1: '根据地区搜索环境因子',
            header2: '根据环境因子搜索地区'


        },
        categoryVisual:{
            sunBurstChat_title:'环境因子',
            header:'环境因子分类',
            unclassified_factor:'未定义因子类别',
            table_label:{
                index:'序号',
                factorName:'因子名称',
                fullName:'全称',
                abbreviationName:'缩写',
                remark:'备注'
            }
        },
        factorVisual:{
            factorSelect:{
                header:'环境因子选择',
                file_select:'文件选择',
                file_select_placeholder:'请选择文件',
                variable_select:'环境变量选择',
                variable_select_placeholder:'请选择环境因子',
                select_date:'日期选择',
                dateRange:{
                    start:'开始日期',
                    end:'结束日期',
                    last_week:'最近一周',
                    last_month:'最近一个月',
                    last_threeMonth:'最近三个月'
                },
                to:'至',
                save:'保存为图片'
            },
            analysis_header:'分析可视化'
        },
        dataCatch:{
            upload:{
                header:'环境信息抓取模块',
                title:'上传环境信息文件',
                prompt:'点击上传/拖拽文件',
                download_btn:'下载模板文件',
                submit_btn:'提交'
            },
            table:{
                title:'任务信息展示',
                refresh_btn:'刷新任务列表',
                index:'序号',
                indexId:'任务编号',
                createdBy:'创建人',
                createTime:'创建时间',
                status:'任务状态',
                inputFile_download:'输入文件下载',
                result_download:'结果下载',
                prompt:'提示信息',
                option:'操作'
            },
            table_inner:{
                export:'导出csv',
                promptInfo:'查看提示信息',
                delete:'删除',
                del_message:'确定删除该任务？'
            },
            message:{
                getSuccess:'获取数据成功！',
                getFailure:'获取数据失败！',
                uploadSuccess:'提交成功！',
                uploadFailure:'提交失败！',
                upload_warning:'请上传文件',
                upload_csv:'请上传.csv文件',
                saveAs:'模版文件.csv',
                download_failure:'下载文件出现错误，请联系管理员！',
                export_fail:'任务尚未成功时不能导出csv',
                error:'错误',
                del_message:'确定删除该任务？',
                warning:'提示',
                confirm:'确定',
                cancel:'取消',
                delSuccess:'删除成功！',
                delFailure:'删除失败！',
            }
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
            header:'环境数据可视化',
            feature:{
                save:'保存为图片',
                mytool1:'全选/取消全选',
                mytool2:'展开/收起图例',
            },
        }

    }
}
