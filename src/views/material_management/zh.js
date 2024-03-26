import { mapGamepadToXbox360Controller } from "@vueuse/core";

// en.js
export default {
    material:{
        header1:'表型文件选择',
        header2:'表型文件详情',
        noFile:'此节点下无文件',

        button:{
            confirm:'确定',
            search:'搜索',
            reset:'重置',
        },

        label:{
            index:'序号',
            id:'品种ID',
            name:'品种名称',
            materialNum:'材料编号',
            field:'田间编号',
            control:'对照类型',
            father:'父本',
            mother:'母本',
            pedigree:'品种谱系',
            operate:'操作',
        },

        placeholder:{
            id:'请输入品种ID',
            name:'请输入品种名称',
            materialNum:'请输入材料编号',
            field:'请输入田间编号',
            father:'请输入父本',
            mother:'请输入母本',
        },

        table:{
            index:'序号',
            id:'品种ID',
            name:'品种名称',
            materialNum:'材料编号',
            field:'田间编号',
            control:'对照类型',
            father:'父本',
            mother:'母本',
            pedigree:'品种谱系',
            operate:'操作',

        },

        tooltip:{
            chart:'系谱图',
            phenotype:'表型',
            Image:'图片',
        },

        graph:{
            header:'系谱图'
        }
    },
    geneCompare:{
        header1:'文件选择管理', 
        header2:'文件上传管理',

        table:{
            fileName:'文件名',
            species:'物种名称',
            population:'群体名称',
            year:'采集年份',
            dataType:'数据类型',
    
            index:'序号',
            taskId:'任务编号',
            phenoFile:'表型文件',
            genoFile:'基因型文件',
            creator:'创建人',
            submitTime:'提交时间',
            finishTime:'完成时间',
            taskStatus:'任务状态',
            result:'预测结果',
            downLoad:'结果下载',
        },
    
        button:{
            result:'预测结果',
            download:'下载',
            data1:'原始数据',
            data2:'最新数据',
            upload:'点击上传',
            submit:'提交',
            canel:'取消',
            confirm:'确定',
        },
    
        other:{
            fileSelect:'文件选择',
            fileUpload:'文件上传',
            phenoFile:'表型文件',
            genoFile:'基因型文件',
            mode1:'统计学习模型：',
            mode2:'机器学习模型：',
            mode3:'深度学习模型：',
            tile:'预测结果',
            tip:'模型预测结果如下：',
            status1:'运行中',
            status2:'完成',
            status3:'失败',
            busy:'系统繁忙，请稍后再试...',
            download_error:'下载文件出现错误，请联系管理员！',
            select_success:'选择成功！'
        }
    },
    basic:{
        button:{
            add:'新增',
            update:'修改',
            delete:'删除',
            export:'导出',
            search:'搜索',
            reset:'重置',
            cancel:'取消',
            save:'保存',

        },
        placeholder:{
            species:'请输入物种名称',
            comment:'请输入内容',
            population:'请输入群体名称',
            trait:'请输入性状类型名称',
            traitName:'请输入性状名称',
            fullname:'请输入全称',
            abbreviation:'请输入缩写',
            factorTypeName:'请输入环境因子类型名称',
            factorName:'请输入环境因子名称',
        },
        label:{
            species:'物种名称',
            comment:'备注',
            population:'群体名称',
            trait:'性状类型名称',
            traitName:'性状名称',
            fullname:'全称',
            abbreviation:'缩写',
            factorTypeName:'环境因子类型',
            factorName:'环境因子名称',
        },
        title:{
            updateSpecies:'修改物种信息',
            addSpecies:'添加物种信息',

        },
        message:{
            update_success:'修改成功！',
            species_exist:'该物种名已存在！',
            delete_confirm1:'是否确认删除编号为',
            delete_confirm2:'的数据项？',
            delete_success:'删除成功！',


        },
        table:{
            index:'序号',
            species:'物种名称',
            comment:'备注',
            operate:'操作',
            population:'群体名称',
            trait:'性状类型名称',
            traitName:'性状名称',
            fullname:'全称',
            abbreviation:'缩写',
            factorTypeName:'环境因子类型名称',
            factorName:'环境因子名称',
        },
        rule:{
            speciesName:'物种名称不能为空',
            creator:'创建者不能为空',
            createTime:'创建者时间不能为空',
            updater:'更新者不能为空',
            updateTime:'更新时间不能为空',
            speciesId:'物种ID不能为空',
            populationName:'群体名称不能为空',
            trait:'性状类型名称不能为空',
            traitTypeId:'性状类型ID不能为空',
            traitTypeName:'性状类型名称不能为空',
            traitId:'性状ID不能为空',
            traitName:'性状名称不能为空',
            fullname:'全称不能为空',
            abbreviation:'缩写不能为空',
            factorTypeName:'环境因子类型名称不能为空',
            factorName:'环境因子名称不能为空',


        }
    }
}
