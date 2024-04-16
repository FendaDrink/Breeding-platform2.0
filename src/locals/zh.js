// zh.js
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'

import phenptype_zh from './language/phenotype/zh.js'

import genotype_zh from './language/genotype/zh.js'

import material_zh from './language/material/zh.js'

import environment_zh from './language/environment/zh.js'

import phenotypeVisual_zh from '@/locals/language/phenotype/phenotypeVisual/zh'

export default {
    title: '基因组育种决策平台2.0',
    loadingText:'加载中...',
    login: {
        login: '登录',
        userName: '用户名',
        password: '密码',
        logining: '登 录 中...',
        remember:'记住密码',
        register:'立即注册',
        message:{
            username:'请输入您的账号',
            password:'请输入您的密码',
            code:'请输入验证码'
        }
    },
    navbar: {
        logout: '退出登录',
        setLayout: '布局设置',
        MyAccount: '个人中心',
        setLanguage: 'ENG'
    },
    logo: {
        title: '基因组育种决策平台2.0'
    },
    system: {
        prompt: '系统提示',
        ok: '确定',
        cancel: '取消',
    },

    ...zhLocale,
    
    ...phenptype_zh,

    ...genotype_zh,

    ...material_zh,

    ...environment_zh,

    ...phenotypeVisual_zh

}
