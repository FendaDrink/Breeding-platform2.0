<template>
   <el-form ref="userRef" :model="user" :rules="rules" label-width="120px">
      <el-form-item :label="$t('profile.userInfo.nickName')" prop="nickName">
         <el-input v-model="user.nickName" maxlength="30" />
      </el-form-item>
      <el-form-item :label="$t('profile.userInfo.phoneNumber')" prop="phonenumber">
         <el-input v-model="user.phonenumber" maxlength="11" />
      </el-form-item>
      <el-form-item :label="$t('profile.userInfo.email')" prop="email">
         <el-input v-model="user.email" maxlength="50" />
      </el-form-item>
      <el-form-item :label="$t('profile.userInfo.sex')">
         <el-radio-group v-model="user.sex">
            <el-radio label="0">{{ $t('profile.userInfo.male') }}</el-radio>
            <el-radio label="1">{{$t('profile.userInfo.female')}}</el-radio>
         </el-radio-group>
      </el-form-item>
      <el-form-item>
      <el-button type="primary" @click="submit">{{$t('profile.userInfo.save')}}</el-button>
      <el-button type="danger" @click="close">{{$t('profile.userInfo.close')}}</el-button>
      </el-form-item>
   </el-form>
</template>

<script setup>
import { updateUserProfile } from "@/api/system/user";
import {getCurrentInstance,reactive, ref} from "vue";
import {computed} from "@vue/reactivity";
import {useI18n} from "vue-i18n";
import zh from "element-plus/lib/locale/lang/zh-cn";
import en from "element-plus/lib/locale/lang/en";
const i18n = useI18n();
const locale = computed(() => ((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? zh : en));


const rule = {
  nickName:computed(()=>i18n.t('profile.rule.nickName')).value,
  email:computed(()=>i18n.t('profile.rule.email')).value,
  phoneNumber: computed(() => i18n.t('profile.rule.phoneNumber')).value,
  update_success: computed(() => i18n.t('profile.message.update_success')).value,
}
const props = defineProps({
  user: {
    type: Object
  }
});

const { proxy } = getCurrentInstance();

const rules = ref({
  nickName: [{ required: true, message: rule.nickName, trigger: "blur" }],
  email: [{ required: true, message: rule.email, trigger: "blur" }, { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
  phonenumber: [{ required: true, message: rule.phoneNumber, trigger: "blur" }, { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }],
});

/** 提交按钮 */
function submit() {
  proxy.$refs.userRef.validate(valid => {
    if (valid) {
      updateUserProfile(props.user).then(response => {
        proxy.$modal.msgSuccess(rule.update_success);
      });
    }
  });
};
/** 关闭按钮 */
function close() {
  proxy.$tab.closePage();
};
</script>
