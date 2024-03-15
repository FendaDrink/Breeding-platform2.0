<template>
  <div class="outBox">
    <div class="chooseType">
      <span>表型数据可视化：</span>
      <el-select placeholder="请选择可视化模块" v-model="visualModule">
        <el-option label="环境因子分类" value="category"></el-option>
        <el-option label="环境数据分析" value="factorAnalysis"></el-option>
        <el-option label="统计分析" value="staticAnalysis"></el-option>
      </el-select>
    </div>
    <category v-if="visualModule==='category'"></category>
    <factor-analysis v-if="visualModule==='factorAnalysis'"></factor-analysis>
    <static-analysis v-if="visualModule==='staticAnalysis'"></static-analysis>
  </div>
</template>

<script setup>
//控制可视化模块的显示
const visualModule = ref('category')

import category from '../environment_factors/category/index.vue'
import factorAnalysis from '../environment_factors/factors_analysis/index.vue'
import staticAnalysis from '../environment_factors/static_analysis/index.vue'

</script>

<style scoped>

.outBox{
  margin: 2%;
}

.chooseType{
  margin: 20px 0;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  font-size: 20px;
  border-radius: 30px;
}

</style>