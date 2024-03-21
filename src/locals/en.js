// en.js
import enLocale from 'element-plus/lib/locale/lang/en'

import phenptype_en from '../views/infomanage/phenotype/en.js'
export default {
    // title: 'Genomic breeding decision-making platform',
    title: 'Breeding-platform2.0',
    login: {
        login: 'Login',
        userName: 'UserName',
        password: 'Password',
        logining: 'Logining...',
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
