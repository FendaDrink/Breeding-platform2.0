// en.js
import enLocale from 'element-plus/lib/locale/lang/en'

import phenotype_en from './language/phenotype/en.js'

import genotype_en from './language/genotype/en.js'

import material_en from './language/material/en.js'

import environment_en from './language/environment/en.js'

import phenotypeVisual_en from '@/locals/language/phenotype/phenotypeVisual/en'
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
    system: {
        prompt: 'System prompt',
        ok: 'Confirm',
        cancel: 'Cancel',
    },
    ...enLocale,

    ...phenotype_en,

    ...genotype_en,

    ...material_en,

    ...environment_en,

    ...phenotypeVisual_en
}
