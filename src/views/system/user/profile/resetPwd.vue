<template>
  <el-form ref="pwdRef" :model="user" :rules="rules" label-width="120px">
    <el-form-item :label="$t('profile.resetPwd.oldPwd')" prop="oldPassword">
      <el-input v-model="user.oldPassword" :placeholder="$t('profile.rule.oldPwd')" type="password" show-password/>
    </el-form-item>
    <el-form-item :label="$t('profile.resetPwd.newPwd')" prop="newPassword">
      <el-input v-model="user.newPassword" :placeholder="$t('profile.rule.newPwd')" type="password" show-password
                style="margin-bottom:10px"/>
      <PsdStrength :password="user.newPassword"></PsdStrength>
    </el-form-item>
    <el-form-item :label="$t('profile.resetPwd.confirmPwd')" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" :placeholder="$t('profile.rule.confirmPwd')" type="password"
                show-password/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ $t('profile.userInfo.save') }}</el-button>
      <el-button type="danger" @click="close">{{ $t('profile.userInfo.close') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {updateUserPwd} from "@/api/system/user";
import {computed} from "@vue/reactivity";
import {useI18n} from "vue-i18n";
import zh from "element-plus/lib/locale/lang/zh-cn";
import en from "element-plus/lib/locale/lang/en";
import {getCurrentInstance, reactive, ref} from "vue";

const i18n = useI18n();
const locale = computed(() => ((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang')) ? zh : en));

const rule = {
  password: computed(() => i18n.t('profile.rule.password')).value,
  comPwd: computed(() => i18n.t('profile.rule.comPwd')).value,
  oldPwd: computed(() => i18n.t('profile.rule.oldPwd')).value,
  newPwd: computed(() => i18n.t('profile.rule.newPwd')).value,
  confirmPwd: computed(() => i18n.t('profile.rule.comPwd')).value,
  length:computed(()=>i18n.t('profile.rule.length')).value,
  update_success: computed(() => i18n.t('profile.message.update_success')).value,
}
const {proxy} = getCurrentInstance();

const user = reactive({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined
});

// var ISPWD =/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*,\._\+(){}])[0-9a-zA-Z!@#$%^&*,\\._\+(){}]{11,}$/;
var ISPWD = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!?|/@#$%^&*,\._\+(){}])[A-Za-z\d!?|/@#$%^&*,\._\+(){}]{11,}$/;
// var ISPWD =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{11,}$/;
// 密码校验
const validatePassword = (rule, value, callback) => {

  if (!ISPWD.test(value)) {
    callback(new Error(rule.password));
  } else {
    callback();
  }
}

const equalToPassword = (rule, value, callback) => {
  if (user.newPassword !== value) {
    callback(new Error(rule.comPwd));
  } else {
    callback();
  }
};
const rules = ref({
  oldPassword: [{required: true, message: rule.oldPwd, trigger: "blur"}],
  newPassword: [{required: true, message: rule.newPwd, trigger: "blur"}, {
    min: 11,
    message: rule.length,
    trigger: "blur"
  }, {validator: validatePassword, trigger: 'blur'}],
  confirmPassword: [{required: true, message: rule.confirmPwd, trigger: "blur"}, {
    required: true,
    validator: equalToPassword,
    trigger: "blur"
  }]
});

/** 提交按钮 */
function submit() {
  proxy.$refs.pwdRef.validate(valid => {
    if (valid) {
      updateUserPwd(user.oldPassword, user.newPassword).then(response => {
        proxy.$modal.msgSuccess(rule.update_success);
      });
    }
  });
}
;

/** 关闭按钮 */
function close() {
  proxy.$tab.closePage();
};
</script>
