<template>
   <div class="app-container">
      <el-row :gutter="20">
         <el-col :span="6" :xs="24">
            <el-card class="box-card">
               <template v-slot:header>
                 <div class="clearfix">
                   <span>{{ $t('profile.index.header')}}</span>
                 </div>
               </template>
               <div>
                  <div class="text-center">
                     <userAvatar :user="state.user" />
                  </div>
                  <ul class="list-group list-group-striped">
                     <li class="list-group-item">
                        <svg-icon icon-class="user" />{{ $t('profile.index.userName')}}
                        <div class="pull-right">{{ state.user.userName }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="phone" />{{ $t('profile.index.phoneNumber')}}
                        <div class="pull-right">{{ state.user.phonenumber }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="email" />{{ $t('profile.index.email')}}
                        <div class="pull-right">{{ state.user.email }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="tree" />{{ $t('profile.index.dept')}}
                        <div class="pull-right" v-if="state.user.dept">{{ state.user.dept.deptName }} / {{ state.postGroup }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="peoples" />{{ $t('profile.index.roleGroup')}}
                        <div class="pull-right">{{ state.roleGroup }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="date" />{{ $t('profile.index.createTime')}}
                        <div class="pull-right">{{ state.user.createTime }}</div>
                     </li>
                  </ul>
               </div>
            </el-card>
         </el-col>
         <el-col :span="18" :xs="24">
            <el-card>
               <template v-slot:header>
                 <div class="clearfix">
                   <span>{{ $t('profile.index.userInfo')}}</span>
                 </div>
               </template>
               <el-tabs v-model="activeTab">
                  <el-tab-pane :label="$t('profile.index.userInfo')" name="userinfo">
                     <userInfo :user="state.user" />
                  </el-tab-pane>
                  <el-tab-pane :label="$t('profile.index.resetPwd')" name="resetPwd">
                     <resetPwd :user="state.user" />
                  </el-tab-pane>
               </el-tabs>
            </el-card>
         </el-col>
      </el-row>
   </div>
</template>

<script setup name="Profile">
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

const activeTab = ref("userinfo");
const state = reactive({
  user: {},
  roleGroup: {},
  postGroup: {}
});

// 国际化相关包
import { computed } from "@vue/reactivity";
import zh from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import en from 'element-plus/lib/locale/lang/en' // 英文语言

import { useI18n } from 'vue-i18n'
import {reactive, ref} from "vue";
const i18n = useI18n();
const locale = computed(() => ((localStorage.getItem('lang') === 'zh-CN' || !localStorage.getItem('lang'))  ? zh : en));


function getUser() {
  getUserProfile().then(response => {
    state.user = response.data;
    state.roleGroup = response.roleGroup;
    state.postGroup = response.postGroup;
  });
};

getUser();
</script>
