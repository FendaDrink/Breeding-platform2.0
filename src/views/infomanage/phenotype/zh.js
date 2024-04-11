// zh.js
export default {
    phenotype: {
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
            tooltip_histoicalVersions: '查看历史版本',
            tooltip_merge: '合并',

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

            message_fileName: '文件名不能为空',
            message_date: '请选择一个日期',




            message_getListFailed: '获取列表失败！',
            message_input_fileName: '文件名不能为空！',
            message_input_nodeName: '节点名不能为空！',
            message_input_status: '选择状态！',
            message_input_date: '请选择日期！',
            message_upload_csv: '只能上传csv格式的文件！',
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
            mergeSuccess:'合并成功！'

        },
        file: {
            table_speciesName: '物种名',
            table_populationName: '种群名',
            table_location: '地区',
            table_operate: '操作',
            table_kindId: '品种ID',
            table_kindName: '品种名称',
            table_materialId: '材料ID',
            table_fieldId: '田间编号',
            table_controlType: '对照类型',
            table_father: '父本',
            table_mother: '母本',
            table_remark: '备注',
            table_repeat: '重复实验',


            button_search: '搜索',
            button_reset: '重置',
            button_export: '导出',
            button_save: '保存',
            button_cancel: '取消',


            label_meterial: '材料名',
            label_phenotype: '表型名',
            label_operation: '操作',

            placeholder_meterial: '请选择材料名',
            placeholder_phenotype: '请选择表型名',

            title_update: '修改文件信息',

            tooltip_update: '修改文件信息',

            message_updateSuccess: '修改成功！',
            message_updateFail: '修改失败！',
            export_success:'导出成功！',
            export_fail:'导出失败！',
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
            header2: '根据性状搜索地区',

            placeholder_location:'请输入地区名',
            placeholder_trait:'请输入性状名'


        },
        showImage: {
            button: {
                search: '搜索',
                reset: '重置',
                cancel: '取消',
                save: '保存',
                nodeAdd: '添加子节点',
                upload: '上传',
                edit: '编辑',
                delete:'删除',
                node_update: '修改节点',
                node_delete: '删除节点',
                node_detail: '节点详情',
                download_remote: '下载远程连接文件',
                image_download: '下载选中图片',
                image_auto: '图片自动上传',
                image_add: '添加图片',
                image_delete: '删除选中图片',
                image_analyse: '分析选中图片',
                image_update: '编辑选中图片',

            },
            label: {
                current_status: '当前节点状态',
                image_name: '图片名',
                image_uploader: '上传者',
                image_date_taken: '拍摄日期',
                image_date_upload: '上传日期',
                select_all: '全选该节点所有图片',

            },
            title: {
                node_create: '添加节点',
                node_update: '修改节点',
                node_detail: '节点详情',

                image_auto: '图片自动上传',
                image_add: '添加图片',
                image_update: '编辑图片',
                image_upload: '上传图片',

            },
            dialog: {
                label: {
                    nodeName: '节点名称：',
                    status: '是否公开：',
                    description: '信息描述：',
                    upload: '上传',

                    device: '拍摄设备：',
                    date: '拍摄日期：',
                    processing: '处理方式：',
                    keywords: '关键字：',

                    imageNewName: '图片新名称：',
                    imageNewDate: '新拍摄日期：',
                    comment: '备注：',

                    ip: 'IP地址：',
                    catalog: '图片目录：',
                },
                placeholder: {
                    nodeName: '输入节点名称',
                    description: '输入图片描述信息',

                    device: '输入拍摄设备名称',
                    date: '选择拍摄日期',
                    processing: '输入处理方式',
                    keywords: '输入关键字',

                    imageNewName: '输入图片新名称',
                    imageNewDate: '选择新的拍摄日期',
                    comment: '输入备注',

                    ip: '输入IP地址',
                    catalog: '输入图片目录',

                },
                message: {
                    nodeName: '请输入节点名称',
                    description: '请输入图片描述信息',
                },
                tip: {
                    t1: '请上传图片',
                    t2: '或压缩包',
                    t3: '图片请按格式（材料名_拍摄日期）命名，如：',

                },
                other: {
                    description: '描述信息：',
                    dateSelction: '日期选择：',
                    phenoAnalysis: '表型图片分析',
                    noImage: '暂无图片',
                    noName: '暂无名称',
                    dateSelction_empty: '描述信息为空！',
                    date_start: '开始日期',
                    date_end: '结束日期',
                    to: '至',

                    imageInfo:'图片信息',
                    materialName:'材料名：',
                    shootingDate:'拍照时间：',
                    uploadDate:'上传时间：',
                    uploader:'上传者：',
                }
            },
            message: {
                lastWeek: '最近一周',
                lastMonth: '最近一月',
                last3Month: '最近三月',
                chooseAll: '已全选！',
                chooseAllCancle: '已取消全选！',
                mytool1: '全选/取消全选',
                mytool2: '展开/收起图例',
                noChooseImage: '您没有选择图片！',
                downloadImageConfirm: '是否下载选中的图片？',
                downloadImageSuccess: '下载选中图片成功！',
                downloadImageFail: '下载选中图片失败！',
                zipFail: '生成压缩包失败！',

                deleteImageConfirm: '是否删除该图片？',
                deleteImageSuccess: '删除选中图片成功！',
                deleteImageFail: '删除选中图片失败！',

                updateOnlyOne: '您只能选择一张图片进行编辑！',
                fullInfo: '请填写完整信息！',
                updateFail: '编辑失败！',

                untitled: '未命名',


                downloading: '正在下载中，请稍后...',

                isRightName: '存在图片名称格式不规范，这可能导致后续无法正常查询该图片，是否继续上传？',

                suspendSubmitImage: '已取消图片提交！',

                uploadLimit: '只能上传图片或压缩包格式的文件！',
                uploadImageError: '添加/修改图片失败！',
                uploadImageSuccess:'上传成功！',
                uploadImageFail:'上传失败！',
                updateImageSuccess: '编辑成功！',
                resetSearch: '已重置！',

                searchSuccess: '查询成功！',
                searchFail: '查询成功失败！',
                searchNothing: '未查询到相关图片！',


                autoUploadSuccess: '开启自动上传成功！',
                autoUploadFail: '开启自动上传失败！',


                validateIP1: '请输入IP地址！',
                validateIP2: '请输入正确的IP地址！',


                validateDirectory1: '请输入图片目录！',
                validateDirectory2: '请输入正确的文件目录！',

                createSuccess: '添加节点成功！',
                createFail: '添加节点失败！',

                updateSuccess: '修改成功！',

                node_parent: '请选择父节点！',
                node_add_success: '添加节点成功！',
                node_add_fail: '添加节点失败！',
                node_update_success: '更新节点成功！',
                node_update_fail: '更新节点失败！',
                node_select: '请选择节点！',
                node_confirm: '是否删除该节点？',
                node_delete_success: '删除节点成功！',
                node_no_image: '此节点无图片！',
            },
            rule:{
                treeName:'输入节点名称',
                keyword:'输入描述信息',
            }
        },
        laboratory: {
            button: {
                search: '搜索',
                ok: '确定',
            },
            table: {
                index: '序号',
                traitName: '性状名',
                average: '平均值',
                maxmum: '最大值',
                minmum: '最小值'
            },
            header: {
                h1: '表型文件选择',
                h2: '多试验分析',
            },
            other: {
                noFile: '此节点下无文件',
                fileName: '文件名：',
                materialId: '材料Id：',
                selectId: '选择材料Id',

            },
            message: {
                search_success: '搜索成功！',
                select_success: '选择成功！',
                get_success: '获取信息成功！'
            }

        }
    }
}
