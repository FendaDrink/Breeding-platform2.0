<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">{{$t('title')}}</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" :placeholder="($t('login.userName'))">
          <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" :placeholder="($t('login.password'))"
          @keyup.enter="handleLogin">
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <!--
      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="loginForm.code"
          size="large"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
    -->
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">{{$t('login.remember')}}</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button class="button_style" :loading="loading" size="large" type="primary" style="width:100%;"
          @click.prevent="handleLogin">
          <span v-if="!loading">{{ $t('login.login') }}</span>
          <span v-else>{{ $t('login.logining') }}</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">{{$t('login.register')}}</router-link>
        </div>
      </el-form-item>
      <!--
      <el-form-item style="width:100%;">
       
        <el-button
          size="large"
          type="primary"
          style="width:100%;"
          @click.prevent="handleUserLogin"
        >
          <span>用 户 登 入</span>
        </el-button>
      
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    -->
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2023</span>
    </div>
  </div>
</template>

<script setup>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from '@/store/modules/user'

import zh from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import en from 'element-plus/lib/locale/lang/en' // 英文语言

import { useI18n } from 'vue-i18n'
import {computed} from "vue";
const i18n = useI18n();
const locale = computed(() => ((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? zh : en));
const userStore = useUserStore()
const router = useRouter();
const { proxy } = getCurrentInstance();

const loginForm = ref({
  username: "",
  password: "",
  rememberMe: false,
  code: "",
  uuid: ""
});
const messages = {
  username: computed(() => i18n.t('login.message.username')).value,
  password: computed(() => i18n.t('login.message.password')).value,
  code: computed(() => i18n.t('login.message.code')).value,
  
  
};

const loginRules = {
  username: [{ required: true, trigger: "blur", message: messages.username }],
  password: [{ required: true, trigger: "blur", message: messages.password }],
  code: [{ required: true, trigger: "change", message: messages.code }]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaOnOff = ref(true);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);

// 管理员或者权限人员登入
function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在cookie中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("yuzhong_password", encrypt(loginForm.value.password), { expires: 30 });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("yuzhong_password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore.login(loginForm.value).then(() => {
        router.push({ path: redirect.value || "/" });
      }).catch(() => {
        loading.value = false;
        // 重新获取验证码
        if (captchaOnOff.value) {
          getCode();
        }
      });
    }
  });
}

// 用户登录
function handleUserLogin() {
  router.push('/user/index')
}

function getCode() {
  getCodeImg().then(res => {
    captchaOnOff.value = res.captchaOnOff === undefined ? true : res.captchaOnOff;
    if (captchaOnOff.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      loginForm.value.uuid = res.uuid;
    }
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("yuzhong_password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

getCode();
getCookie();
</script>


<style lang='scss' scoped>
:deep(.is-checked) {
  color: #707070;
}

:deep(.el-checkbox__label) {
  color: #707070 !important;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #707070;
  border-color: #707070;
}

.button_style {
  // background-color: #707070;
  border: #707070;
  background-image: linear-gradient(to right, #1b9c94, #0f9c8b, #0d9b80, #179a75, #249968, #3c9f64, #50a561, #63ab5d, #82b963, #a0c76b, #bed574, #dce37f);
  text-align: center;
  display: block;
  height: 50px;
  padding: 12px;
  font: 900 18px '';
  border-radius: 10px;
  color: #fff;
  letter-spacing: 3px;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("@/assets/img/banner/banner1.jpg");
  background-size: cover;
  opacity: 0; // 默认设置为透明
  animation: fadeIn 2s forwards; // 2秒渐显效果
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}


.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;

  font: 800 25px '';
  text-align: center;
  letter-spacing: 5px;
  color: #3d3d3d;
}

:deep(.el-input__inner) {
  caret-color: #63ab5d;
}

:deep(.el-input__inner:focus) {
  // el-input输入时设置边框颜色
  border: #63ab5d 1px solid;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 450px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }

  padding: 20px;
  background: linear-gradient(to right bottom,
    rgba(255, 255, 255, .7),
    rgba(255, 255, 255, .5),
    rgba(255, 255, 255, .4));
  /* 使背景模糊化 */
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px #3c9f64;
  border-radius: 15px;
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>