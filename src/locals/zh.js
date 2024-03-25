// zh.js
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'

import phenptype_zh from '../views/infomanage/phenotype/zh.js'
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
            username:'Please enter your username.',
            password:'Please enter your password.',
            code:'Please enter the verification code'
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
    systom: {
        prompt: '系统提示',
        ok: '确定',
        cancel: '取消',
    },
    ...zhLocale,
    
    ...phenptype_zh
}
