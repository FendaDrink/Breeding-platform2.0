// locales/setupI18n.ts

import { App } from 'vue';
import { createI18n } from 'vue-i18n'; // 引入vue-i18n组件
import zh from './zh'
import en from './en'


// 注册i8n实例并引入语言文件
const localeData = {
    legacy: false,
    locale: localStorage.getItem('lang') || navigator.language || 'zh-CN',
    // locale: 'en', // 默认显示语言
    messages: {
        'zh-CN': zh,
        'en': en
    }, globalInjection: true,
};

export const i18n = createI18n(localeData);


// setup i18n instance with glob
export const setupI18n = {
    install(app: App) {
        app.use(i18n);
    },
};
