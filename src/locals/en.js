// en.js
import enLocale from 'element-plus/lib/locale/lang/en'

import phenptype_en from '../views/infomanage/phenotype/en.js'
export default {
    // title: 'Genomic breeding decision-making platform',
    title: 'Breeding-platform2.0',
    loadingText:'Loading...',
    login: {
        login: 'Login',
        userName: 'UserName',
        password: 'Password',
        logining: 'Logining...',
        remember:'Remember Password',
        register:'Sign Up Now',
        message:{
            username:'请输入您的账号',
            password:'请输入您的密码',
            code:'请输入验证码'
        }
    },
    navbar: {
        logout: 'Logout',
        setLayout: 'Set Layout',
        MyAccount: 'My Account',
        setLanguage: '中文'
    },
    logo: {
        title: 'Breeding-platform2.0'
    },
    systom: {
        prompt: 'System prompt',
        ok: 'Confirm',
        cancel: 'Cancel',
    },
    ...enLocale,

    ...phenptype_en,
}
