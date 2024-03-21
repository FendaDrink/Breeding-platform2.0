// zh.js
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'

import phenptype_zh from '../views/infomanage/phenotype/zh.js'
export default {
    title: '基因组育种决策平台2.0',
    login: {
        login: '登录',
        userName: '用户名',
        password: '密码',
        logining: '登 录 中...'
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
    ...zhLocale,
    
    ...phenptype_zh
}
