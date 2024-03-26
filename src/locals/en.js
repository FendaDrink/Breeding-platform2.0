// en.js
import enLocale from 'element-plus/lib/locale/lang/en'

import phenptype_en from '../views/infomanage/phenotype/en.js'

import genotype_en from '../views/infomanage/genotype/en.js'

import material_en from '../views/material_management/en.js'

import environment_en from '../views/environmental_management/en.js'
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
            username:'Please enter your username.',
            password:'Please enter your password.',
            code:'Please enter the verification code'
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

    ...genotype_en,

    ...material_en,

    ...environment_en,
}
