<template>
    <div class="outBox">
        <div class="chooseType">
            <span>{{ $t('phenotypeVisual.index.header') }}：</span>
            <el-select :placeholder="$t('phenotypeVisual.index.label_placehodler')" v-model="visualModule">
                <el-option :label="$t('phenotypeVisual.index.num_label')" value="num"></el-option>
                <el-option :label="$t('phenotypeVisual.index.traitAnalysis_label')" value="traitAnalysis"></el-option>
                <el-option :label="$t('phenotypeVisual.index.traitManage_label')" value="traitManage"></el-option>
            </el-select>
        </div>
        <num v-if="visualModule==='num'"></num>
        <trait-analysis v-if="visualModule==='traitAnalysis'"></trait-analysis>
       <trait-manage v-if="visualModule==='traitManage'"></trait-manage>
    </div>
</template>

<script setup>
//控制可视化模块的显示
const visualModule = ref('num')

import num from './visual/num.vue'
import traitAnalysis from './visual/traitAnalysis.vue'
import traitManage from './visual/traitManage.vue'

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