<template>
	<div>


		<!-- <div>
		<div style="
			background: #9abeaf;
				margin: 10px 0;
				color: white;
				height: 50px;
				border-radius: 10px;
				line-height: 50px;
				padding-left: 10px;
				box-shadow: var(--el-box-shadow-lighter);
				">
			基因组预测介绍模块
		</div>
		<div style="width: 90%;margin:0 auto;display: flex;flex-direction: column;gap: 20px;">
			<el-card class="stepcard">
				<template #header>
					<div class="card-header">
						<span>基因组育种决策目的</span>
					</div>
				</template>
				<div class="stepPs">
					<p style="line-height: 2em;">&nbsp; &nbsp;&nbsp;&nbsp;基因组育种决策平台是一个基于基因组和表型大数据，通过<strong
							style="color: #c0392b;">AI算法</strong>实现基因组精准预测的平台。
						给定任意材料的基因型，预测该材料的<strong style="color: #c0392b;">株高，开花期，产量等关键性状</strong>的表型值。
						给定任意材料和一组测验种，预测该材料的一般配合力以及杂交组合的育种价值。
						基于以产量为核心、抗倒耐密早熟为辅的多性状综合选择策略，提供<strong style="color: #c0392b;">育种材料筛选决策建议</strong>。
					</p>
				</div>
			</el-card>
			<el-card class="stepcard">
				<template #header>
					<div class="card-header">
						<span>基因组育种决策流程图</span>
					</div>
				</template>
				<img src="/liucheng1.png" style="width: 100%;">
			</el-card>

			<el-card class="stepcard">
				<template #header>
					<div class="card-header">
						<span>基因组育种决策说明</span>
					</div>
				</template>

				<div class="stepPs">
					<p> <strong><el-icon>
								<CaretRight />
							</el-icon></strong> 训练模型的基因型和表型数据集：
						1) 材料：<strong style="color: #f39c12;">自交系1404</strong> 个材料， 和<strong style="color: #f39c12;">
							6210份杂交种</strong>。
						2) 基因型：<strong style="color: #f39c12;">1000万</strong> 的SNP基因型。
						3) 表型：产量，株高，开花期等<strong style="color: #f39c12;">20个农艺性状</strong></p>
					<p> <strong><el-icon>
								<CaretRight />
							</el-icon></strong> 基因组预测模型：
						1) 统计学习方法：rrBLUP, BayesLASSO, BRR, BayesA, BayesB
						2) 机器学习方法：SVR, RF, LightGBM
						3) 深度学习方法：DeepGS, LCNN, DLGWAS, MLP, gMLP</p>
					<p> <strong><el-icon>
								<CaretRight />
							</el-icon></strong> 模型选择：通过五折<strong
							style="color: #c0392b;">交叉验证</strong>评价每个模型，选取最优模型对输入的材料进行杂交选育评估。</p>
				</div>

			</el-card>
		</div>
		<div style="
											        background: #9abeaf;
											        margin: 10px 0;
											        color: white;
											        height: 50px;
											        border-radius: 10px;
											        line-height: 50px;
											        padding-left: 10px;
											        box-shadow: var(--el-box-shadow-lighter);
											        ">
			基因组预测功能模块
		</div>
		<el-divider content-position="center">输入材料名称 <strong style="color: #f39c12;">或者</strong> 上传基因型文件</el-divider>
		<div style="display: flex;align-items: center;justify-content: center; gap:80px">

			<div style="width: 25%;">
				<div class="">
					<h4 style="font-weight:bold;color: #c0392b;">输入材料名称</h4>
				</div>
				<div class="input-box">
					<el-input v-model="materialName.materialName" placeholder="请输入材料名称" type="textarea"
						:autosize="{ minRows: 4, maxRows: 8 }" style="max-height: 400px;" />
				</div>
				<div class="eg-box">
					例如:
					<el-button type="text" @click="materialName.materialName = 'MG_298'">MG_298</el-button>,
					<el-button type="text" @click="materialName.materialName = 'MG_806'">MG_806</el-button>,
					<el-button type="text" @click="materialName.materialName = 'MG_199'">MG_199</el-button>...
				</div>
			</div>
			<div style="width: 25%;">
				<div class="">
					<h4 style="font-weight:bold;color: #c0392b;">材料基因型文件</h4>
				</div>
				<el-upload v-model:file-list="fileList.materialGenoFile" class="upload-demo" accept=".vcf,.csv" action="#"
					:headers="headers" method="post" :auto-upload="false" multiple :limit="1" drag>
					<el-icon class="el-icon--upload"><upload-filled /></el-icon>
					<div class="el-upload__text">
						拖拽文件 或者 <em>点击上传</em>
					</div>
				</el-upload>
			</div>
		</div>
		<el-divider content-position="center">使用默认数据库测验种 <strong style="color: #f39c12;">或者</strong> 上传测验种文件</el-divider>
		<div style="display: flex;align-items: center;justify-content: center; gap:80px">

			<div style=" width: 25%;">
				<div style=" text-align: center;">
					<h4 style="font-weight:bold;color: #c0392b;">系统测验种</h4>
				</div>
				<section class="svg-container">
					<svg id="test" class="circle" @click="addcircleActive">
						<g>
							<ellipse class="background" ry="60" rx="60" cy="62.5" cx="62.5" stroke-width="2" />
							<ellipse class="foreground" ry="60" rx="60" cy="62.5" cx="62.5" stroke-width="2" />
							<line class="line line1" x1="52" y1="62" x2="74" y2="62" />
							<line class="line line2" x1="52" y1="62" x2="74" y2="62" />
						</g>
					</svg>
				</section>
			</div>

			<div style=" width: 25%;">
				<div>
					<h4 style="font-weight:bold;color: #c0392b;">测验种基因型文件</h4>
				</div>
				<el-upload v-model:file-list="fileList.testGenoFile" class="upload-demo" accept=".vcf,.csv" action="#"
					:headers="headers" method="post" :auto-upload="false" multiple :limit="1" drag>
					<el-icon class="el-icon--upload"><upload-filled /></el-icon>
					<div class="el-upload__text">
						拖拽文件 或者 <em>点击上传</em>
					</div>

				</el-upload>
			</div>

		</div>

		<div style="width:20%;margin: 0 auto;">
			<el-button type="primary" @click="submit"
				style="font-size:18px;width:50%;height: 40px;letter-spacing: 0.5em;">提交</el-button>
			<el-button type=""
				@click="exportGeno('C:\\Users\\Administrator\\Desktop\\sdxx\\xm_2_1\\6210\\vcf_template.vcf')">下载vcf模板</el-button>
		</div>


		<div style="
											        background: #9abeaf;
											        margin: 10px 0;
											        color: white;
											        height: 50px;
											        border-radius: 10px;
											        line-height: 50px;
											        padding-left: 10px;
											        box-shadow: var(--el-box-shadow-lighter);
											        ">
			任务信息展示
		</div>
		<div class="table-box">
			<el-button style="float: right;margin-bottom: 20px;" size="large" @click="reflushTable" icon="RefreshRight"
				type="warning" plain>刷新任务表格
			</el-button>
			<el-table v-loading="loading" trigger :data="tableData" border :cell-style="{ 'text-align': 'center' }"
				:header-cell-style="{ 'text-align': 'center' }">
				<el-table-column label="序号" type="index" width="80" />
				<el-table-column prop="id" label="任务编号" width="180" />
				<el-table-column label="材料名称">
					<template #default="scope">
						<span style="color: #409EFF; cursor: pointer;" @click="DownloadGenoFile(scope.row)">
							{{ scope.row.materialName }}
						</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="材料基因型">
					<template #default="scope">
						<el-button v-if="scope.row.genofile != null" link type="text"
							@click="exportGeno(scope.row.genofile)">
							{{ scope.row.genofile.split("\\").pop() }}
						</el-button>
						<el-button v-else link type="text" disabled>
							无文件
						</el-button>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="测验种基因型">
					<template #default="scope">
						<el-button v-if="scope.row.ceyanfile != null" link type="text"
							@click="exportGeno(scope.row.ceyanfile)">
							{{ scope.row.ceyanfile.split("\\").pop() }}
						</el-button>
						<el-button v-else link type="text" disabled>
							无文件
						</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="createBy" label="创建人" />
				<el-table-column prop="createTime" label="创建时间" />
				<el-table-column label="任务状态" width="150">
					<template #default="scope">
						<div id="status">
							<el-icon style="color: #0dbc79;font-size: 25px;" v-show="scope.row.status == 1">
								<SuccessFilled />
							</el-icon>
							<el-icon style="font-size: 25px;" v-show="scope.row.status == 0">
								<Loading />
							</el-icon>
							<el-icon style="color: #d32f2f; font-size: 25px;" v-show="scope.row.status == 2">
								<CircleCloseFilled />
							</el-icon>
						</div>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="结果下载">
					<template #default="scope">
						<el-button link type="text" @click="exportPdf(scope.row)" v-show="scope.row.status == 1">
							导出pdf
						</el-button>
						<el-button link type="text" disabled v-show="scope.row.status != 1">
							导出pdf
						</el-button>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="结果下载">
					<template #default="scope">
						<el-popover placement="top" title="Info" trigger="hover" :content="scope.row.info">
							<template #reference>
								<el-button link type="text">查看提示信息</el-button>
							</template>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作">
					<template #default="scope">
						<el-popconfirm title="确定删除该任务？" @confirm='handleDelete(scope.row)'>
							<template #reference>
								<el-button link type="text">
									删除
								</el-button>
							</template>
						</el-popconfirm>

					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-show="total > 0" :total="total" :page-sizes="[3, 10, 20, 30, 50]"
				v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
				layout="total, sizes,prev, pager, next, jumper" @size-change="getList" @current-change="getList" />
		</div>
	</div> -->

		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
			<title>基因组育种决策平台</title>
			<link rel="icon" href="../../../images/v1.0/logo.png" type="image/x-icon">
			<meta name="description" content="">
			<meta name="keywords" content="">
			<!-- <link rel="stylesheet" type="text/css" href="../src/css/v1.0/style.css"> -->
		</head>

		<body>
			<div class="page-wrapper pg-wrapper">
				<div class="col-md-12">
					<div class="bacimg">
						<img src="../../../images/v1.0/bac_4.png">
						<div class="bannertext">
							<h1>基因育种，探索更多可能</h1>
							<p>Gene breeding,exploring more possibilities</p>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="robincont">
						<h1>基因组育种决策平台<i>&nbsp;</i></h1>
						<div class="col-md-12 robinc">
							<div class="col-xs-6 col-sm-4">
								<img src="../../../images/v1.0/p1.png">
								<div class="ptli">
									<strong>基因组育种决策平台</strong>
									<p>基因组育种决策平台是一个基于基因组和<span>表型大数据</span>，通过AI算法实现基因组精准预测的平台。</p>
								</div>
							</div>
							<div class="col-xs-6 col-sm-4">
								<img src="../../../images/v1.0/p2.png">
								<div class="ptli">
									<strong>平台作用</strong>
									<p>给定任意材料的基因型，预测该材料的株高，开<span>花期，产量等关键性状</span>的表型值。</p>
								</div>
							</div>
							<div class="col-xs-6 col-sm-4">
								<img src="../../../images/v1.0/p3.png">
								<div class="ptli">
									<strong>核心目的</strong>
									<p>基于以产量为核心、抗倒耐密早熟为辅的多性状综合选择策略，提供<span>育种材料筛选决策建议</span>。</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="robincont jcsm">
						<h1>决策说明<i>&nbsp;</i></h1>
						<div class="col-md-12 robinc minhei">
							<div class="col-xs-5 col-sm-6"></div>
							<div class="col-xs-7 col-sm-6 min">
								<div class="jcsmcont">
									<h3><strong>01</strong>训练模型的基因型和表型数据集：</h3>
									<div class="">
										<p>1) 材料：自交系1404 个材料， 和 6210份杂交种。</p>
										<p>2) 基因型：1000万 的SNP基因型。</p>
										<p>3) 表型：产量，株高，开花期等20个农艺性状。</p>
									</div>
								</div>
								<div class="jcsmcont">
									<h3><strong>02</strong>基因组预测模型</h3>
									<div class="">
										<p>1) 统计学习方法：rrBLUP, BayesLASSO, BRR, BayesA, BayesB 。</p>
										<p>2) 机器学习方法：SVR, RF, LightGBM 。</p>
										<p>3) 深度学习方法：DeepGS, LCNN, DLGWAS, MLP, gMLP</p>
									</div>
								</div>
								<div class="jcsmcont">
									<h3><strong>03</strong>模型选择</h3>
									<div class="">
										<p>通过五折交叉验证评价每个模型，选取最优模型对输入的材料进行杂交选育评估。</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="robincont jyzyc">
						<h1>基因组预测功能模块<i>&nbsp;</i></h1>
						<div class="col-md-12 robinc">
							<div class="col-xs-12 col-sm-6">
								<div class="gbac" style="height: 230px;">
									<h3 style="text-align: center;">输入材料名称或者上传基因型文件</h3>
									<div style="display: flex;align-items: center;justify-content: center; gap:80px">
										<div style="width: 50%;">
											<label for="inputHelpBlock">输入材料名称</label>
											<div class="inputDeep">
												<el-input v-model="materialName.materialName" placeholder="请输入材料名称"
													type="textarea" :autosize="{ minRows: 4, maxRows: 8 }"
													style="max-height: 400px;" />
											</div>
											<div class="eg-box">
												例如:
												<el-button type="text" @click="materialName.materialName = 'B110'"
													style="color: #0dbc79;" class="buttonMini">B110</el-button>,
												<el-button type="text" @click="materialName.materialName = 'CIMBL1'"
													style="color: #0dbc79;" class="buttonMini">CIMBL1</el-button>,
												<el-button type="text" @click="materialName.materialName = '303WX'"
													style="color: #0dbc79;" class="buttonMini">303WX</el-button>...
											</div>
										</div>
										<div style="width: 50%;">
											<label for="inputHelpBlock">上传材料基因型文件</label>
											<el-upload v-model:file-list="fileList.materialGenoFile" class="upload-demo"
												accept=".vcf,.csv" action="#" :headers="headers" method="post"
												:auto-upload="false" multiple :limit="1" drag>
												<el-icon class="el-icon--upload"><upload-filled /></el-icon>
												<div class="el-upload__text">
													点击上传/拖拽文件
												</div>
											</el-upload>
										</div>
									</div>
								</div>
							</div>
							<div class="col-xs-12 col-sm-6">
								<div class="gbac" style="height: 230px;">
									<h3 style="text-align: center;">使用默认数据库测验种或者上传测验种文件</h3>
									<div style="display: flex;align-items: center;justify-content: center; gap:80px">

										<div style=" width: 50%;">
											<label for="inputHelpBlock">系统测验种</label>
											<section class="svg-container">
												<svg id="test" class="circle" @click="addcircleActive">
													<g>
														<ellipse class="background" ry="60" rx="60" cy="62.5" cx="62.5"
															stroke-width="2" />
														<ellipse class="foreground" ry="60" rx="60" cy="62.5" cx="62.5"
															stroke-width="2" />
														<line class="line line1" x1="52" y1="62" x2="74" y2="62" />
														<line class="line line2" x1="52" y1="62" x2="74" y2="62" />
													</g>
												</svg>
											</section>
										</div>

										<div style="width: 50%;">
											<label for="inputHelpBlock">测验种基因型文件</label>
											<el-upload v-model:file-list="fileList.testGenoFile" class="upload-demo"
												accept=".vcf,.csv" action="#" :headers="headers" method="post"
												:auto-upload="false" multiple :limit="1" drag>
												<el-icon class="el-icon--upload"><upload-filled /></el-icon>
												<div class="el-upload__text">
													点击上传/拖拽文件
												</div>

											</el-upload>
										</div>

									</div>
								</div>
							</div>
							<div style="text-align: center;">
								<el-button type="success" @click="submit" plain
									style="width: 110px; margin-top: 6px;">提交</el-button>
								<el-button type="success" plain style="width: 110px; margin-top: 6px;"
									@click="exportGeno('C:\\Users\\Administrator\\Desktop\\sdxx\\xm_2_1\\6210\\vcf_template.vcf')">下载vcf模板</el-button>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="bs-example" data-example-id="hoverable-table">
						<div class="tit"><i class="glyphicon glyphicon-file"></i>任务信息展示</div>
						<div class="table-responsive">
							<el-button style="float: right;margin-bottom: 5px;" size="small" @click="reflushTable"
								icon="RefreshRight" type="success" plain>刷新任务表格
							</el-button>
							<el-table v-loading="loading" trigger :data="tableData" :cell-style="{ 'text-align': 'center' }"
								:header-cell-style="{ 'text-align': 'center' }">
								<el-table-column label="序号" type="index" width="80" />
								<el-table-column prop="id" label="任务编号" width="180" />
								<el-table-column label="材料名称">
									<template #default="scope">
										<span style="color: #1FB864; cursor: pointer;" @click="DownloadGenoFile(scope.row)">
											{{ scope.row.materialName }}
										</span>
									</template>
								</el-table-column>
								<el-table-column fixed="right" label="材料基因型">
									<template #default="scope">
										<el-button v-if="scope.row.genofile != null" link type="text"
											style="color: #0dbc79;" @click="exportGeno(scope.row.genofile)">
											{{ scope.row.genofile.split("\\").pop() }}
										</el-button>
										<el-button v-else link type="text" disabled>
											无文件
										</el-button>
									</template>
								</el-table-column>
								<el-table-column fixed="right" label="测验种基因型">
									<template #default="scope">
										<el-button v-if="scope.row.ceyanfile != null" link type="text"
											style="color: #0dbc79;" @click="exportGeno(scope.row.ceyanfile)">
											{{ scope.row.ceyanfile.split("\\").pop() }}
										</el-button>
										<el-button v-else link type="text" disabled>
											无文件
										</el-button>
									</template>
								</el-table-column>
								<el-table-column prop="createBy" label="创建人" />
								<el-table-column prop="createTime" label="创建时间" />
								<el-table-column label="任务状态" width="150">
									<template #default="scope">
										<div id="status">
											<el-icon style="color: #0dbc79;font-size: 25px;" v-show="scope.row.status == 1">
												<SuccessFilled />
											</el-icon>
											<el-icon style="font-size: 25px;" v-show="scope.row.status == 0">
												<Loading />
											</el-icon>
											<el-icon style="color: #d32f2f; font-size: 25px;"
												v-show="scope.row.status == 2">
												<CircleCloseFilled />
											</el-icon>
										</div>
									</template>
								</el-table-column>
								<el-table-column fixed="right" label="结果下载">
									<template #default="scope">
										<el-button link type="text" @click="exportPdf(scope.row)" style="color: #0dbc79;"
											v-show="scope.row.status == 1">
											导出pdf
										</el-button>
										<el-button link type="text" disabled v-show="scope.row.status != 1">
											导出pdf
										</el-button>
									</template>
								</el-table-column>
								<el-table-column fixed="right" label="提示信息">
									<template #default="scope">
										<el-popover placement="top" title="Info" trigger="hover"
											:content="getPopoverContent(scope.row.info)">
											<template #reference>
												<el-button link type="text" style="color: #1FB864;">查看提示信息</el-button>
											</template>
										</el-popover>
									</template>
								</el-table-column>
								<el-table-column fixed="right" label="操作">
									<template #default="scope">
										<el-popconfirm title="确定删除该任务？" @confirm='handleDelete(scope.row)'>
											<template #reference>
												<el-button link type="text" style="color: #1FB864;">
													删除
												</el-button>
											</template>
										</el-popconfirm>

									</template>
								</el-table-column>
							</el-table>
						</div>
						<div class="mypage" onselectstart="return false">
							<el-pagination v-show="total > 0" :total="total" :page-sizes="[3, 10, 20, 30, 50]"
								v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
								background right layout=" ->, total, sizes,prev, pager, next, jumper" @size-change="getList"
								@current-change="getList" />
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="botbanner mt10">
						—— 通过基因育种决策平台，解锁更多基因管理功能 ——
					</div>
				</div>
			</div>
		</body>
	</div>
</template>

<script setup >
import { ref, reactive, onMounted } from 'vue';
import { getlist2, addMar, deleteMar, downloadFile, addMarNew } from '../../../api/material';
import { listUser } from "@/api/system/user";
import { blobValidate } from '@/utils/param'
import { useRoute, useRouter } from "vue-router"


import { ElMessage, ElMessageBox } from 'element-plus'
let total = ref(0)
let loading = ref(false)
let materialName = ref({ materialName: "" })
let queryParams = reactive({ pageNum: 1, pageSize: 3 })
let tableData = ref([])


function getPopoverContent(info) {
	if (info === 'The variation information of your file has non [-1,0,1,2] value, maybe your file has empty value or last row is empty, please check your file!') {
        return '您文件中的变异信息存在非[-1,0,1,2]的值，可能是您的文件存在空值或文件最后一行为空，请检查您的文件！';
      } else if (info === 'The material name you entered was not found in our database, please check it!') {
        return '您输入的材料名称在我们的数据库中找不到，请检查!';
      } else if (info === 'Flag setting error, please contact the administrator!') {
        return 'Flag设置错误，请联系管理员!';
      } else if (info === 'Please press the system test species button!') {
        return '请点击系统测验种按钮!';
      } else if (info === 'Please check the format of your vcf file, null value exists in the file!') {
        return '请检查您的vcf文件格式，文件中存在空值!';
      } else if (info === 'Please check the format of your vcf file, we need your vcf file to have standard header!') {
        return '请检查您的vcf文件的格式，我们需要您的vcf文件有标准的title!';
      } else if (info === 'Your vcf file has empty values, please check your vcf file!') {
        return '您的vcf文件有空值，请检查您的vcf文件!';
      } else if (info === 'Please check the format of your vcf file, we need the format of snp variation is [./.,0/0,0/1,1/1]!') {
        return '请检查您的vcf文件格式，我们需要的变异信息的格式是[./.，0/0,0/1,1/1]!';
      } else if (info === 'Please check your csv file format!') {
        return '请检查您的csv文件格式!';
      } else if (info === 'please check material in your test file!') {
        return '请检查您的测验种文件中的材料名，它不能为0,-1,1,2!';
      }else if (info === 'over!'){
		return "完成!";
	  }
}
const router = useRouter()
onMounted(() => {
	getList();
	getUserTrans();
	// setInterval(() => {
	//     reflushTable()
	// }, 1000);
})

let userTrans = reactive({})
async function getUserTrans() {
	let res = await listUser({ pageNum: 1, pageSize: 1000 })

	res.rows.forEach(function (user, index, array) {

		userTrans[user['userId']] = user['userName']

	})

}
function getList() {
	loading.value = true
	console.log(queryParams)
	getlist2(queryParams).then(res => {
		total.value = res.total
		tableData.value = res.rows
		tableData.value.forEach(item => {
			item.createBy = userTrans[parseInt(item.createBy)]
			if (item.createBy == null) item.createBy = "-"
			if (item.createTime == null) item.createTime = "-"
			if (item.materialName == null) item.materialName = "-"
		})
		loading.value = false
	})
}

let fileList = ref({
	materialGenoFile: [],
	testGenoFile: []
});
let formdata = new FormData();

async function submit() {
	console.log(fileList.value)
	if (fileList.value.materialGenoFile.length != 0) formdata.append("genoFile", fileList.value.materialGenoFile[0].raw)
	if (fileList.value.testGenoFile.length != 0) formdata.append("ceyanFile", fileList.value.testGenoFile[0].raw)

	if ((fileList.value.materialGenoFile.length != 0 && fileList.value.materialGenoFile[0].name.indexOf(" ") != -1) ||
		(fileList.value.testGenoFile.length != 0 && fileList.value.testGenoFile[0].name.indexOf(" ") != -1)) {
		ElMessage.error("文件名不能包含空格")
		return
	}
	let param = {
		param: materialName.value.materialName,
		flag: checktest.value
	}

	if (fileList.value.testGenoFile.length == 0 && checktest.value == 0) {
		ElMessage.error("测验种按钮和文件必须至少输入一个！")
		return
	}
	// await addMar(param,formdata);
	let result = await addMarNew(param, formdata);

	if (result.code == 200) {
		getList()
		ElMessage.success("添加成功！")
		materialName.value.materialName = ""

		router.go(0)
	}

}
function exportGeno(fileUrl) {
	let resource = { resource: fileUrl }
	// if(type=='ceyan'){
	//      resource = {resource:row.ceyanfile}
	// }else{
	//      resource = {resource:row.genofile}
	// }
	let filename = resource.resource.split("\\").pop()
	// console.log(filename)
	downloadFile(resource).then(res => {
		console.log(res)
		const isLogin = blobValidate(res);
		if (isLogin) {
			const blob = new Blob([res])
			saveAs(blob, `${filename}`)
		} else {
			const resText = data.text();
			const rspObj = JSON.parse(resText);
			const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
			Message.error(errMsg);
		}
	}).catch(err => {
		console.log(err)
		ElMessage.error('下载文件出现错误，请联系管理员！');
	})
}
function exportPdf(row) {
	console.log(row)
	if (row.status != 1) {
		ElMessageBox.alert('任务尚未成功时不能导出pdf', '错误', {
			// if you want to disable its autofocus
			// autofocus: false,
			confirmButtonText: 'OK',
			type: 'error',
			callback: () => {
			},
		})
		return
	}
	let resource = { resource: row.pdfpath }
	downloadFile(resource).then(res => {
		console.log(res)
		const isLogin = blobValidate(res);
		if (isLogin) {
			const blob = new Blob([res])
			saveAs(blob, `breed${row.id}.pdf`)
		} else {
			const resText = data.text();
			const rspObj = JSON.parse(resText);
			const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
			Message.error(errMsg);
		}
	}).catch(err => {
		console.log(err)
		ElMessage.error('下载文件出现错误，请联系管理员！');
	})
	// let id = {id:row.id}
	// console.log(id)
	// exportPDF(id).then(res => {
	//   console.log(res)
	//   const isLogin = blobValidate(res);
	//   if (isLogin) {
	//     const blob = new Blob([res])
	//     saveAs(blob, `基因组预测比较-${id.id}.pdf`)
	//     pageLoad.value = false
	//   } else {
	//     const resText = data.text();
	//     const rspObj = JSON.parse(resText);
	//     const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
	//     ElMessage.error("下载文件出现错误，请联系管理员！");
	//     pageLoad.value = false
	//   }
	// }).catch(err => {
	//   console.log(err)
	//   pageLoad.value = false
	//   ElMessage.error('下载文件出现错误，请联系管理员！');
	// })
}
async function handleDelete(row) {
	console.log(row)
	await deleteMar(row.id)
	getList()
}
function reflushTable() {
	getList()
}

let checktest = ref(0)
function addcircleActive() {
	var div = document.getElementById('test');

	if (div.classList.contains("circleActive")) {
		div.classList.remove('circleActive');
		checktest.value = 0
	}
	else {
		div.classList.add('circleActive');
		checktest.value = 1

	}

}
</script>

<style lang="less" scoped>
.table-box {
	width: 90%;
	margin: 0 auto;
	// margin-top: 40px;
	margin-bottom: 30px;
}

.eg-box {
	// display: flex;
	font-size: 10px;
	color: #8d8484;
	height: 40px;
	line-height: 40px;
	justify-content: center;
	align-items: center;
}

.buttonMini {
	font-size: 10px;
	padding: 0;
	margin: 0;
}

.stepcard {
	width: 90%;
	height: 100%;
	border-color: #18bc9c;
	margin-left: 2rem;
}

.stepcard :deep(.el-card__header) {
	background-color: #18bc9c;
	color: #fff;
	font-size: 22px;
	font-weight: bolder;
	letter-spacing: 0.1em;
	padding-bottom: 15px !important;
	/* border: #A5ECE4; */
}

.stepPs p {
	color: #2c3e50;
	text-align: justify;

	// font-size: 10px;
}

:deep(.el-divider__text) {
	font-size: 20px;
	color: #17a2b8;
	font-weight: bold;
}


.svg-container {
	height: 124px;
	position: relative;
	width: 124px;

	margin: 0 auto;

	h1 {
		color: #aaa;
		font-family: "Source Sans Pro";
		font-size: 1.2rem;
		left: 50%;
		letter-spacing: 4px;
		position: absolute;
		text-align: center;
		top: -60px;
		transform: translateX(-50%);
		width: 100%;
	}
}

.circle {
	height: 124px;
	width: 124px;
	cursor: pointer;

	.background {
		fill: transparent;
		stroke: #EE3769;
		transition: all 200ms ease;
	}

	.foreground {
		fill: transparent;
		stroke-dasharray: 377;
		stroke-dashoffset: 377;
		stroke: #1abc9c;
		transform-origin: 50% 50%;
		transform: rotate(-270deg);
		transition: all 800ms ease;
	}

	.line {
		stroke-width: 2;
		stroke: #EE3769;
		transform-origin: 50% 50%;
		transition: all 500ms ease;
	}


}

.circleActive {
	cursor: pointer;

	.background {
		stroke: transparent;
	}

	.foreground {
		stroke-dashoffset: 0;
		transform: rotate(-90deg);
	}

	.line {
		stroke: #1abc9c;
	}

	.line {
		transform: rotate(180deg);
	}

	.line2 {
		transform: rotate(90deg);
	}
}

:deep(.el-upload-dragger) {
	width: 240px;
	height: 120px;
}

:deep(.el-icon--upload) {
	margin: 10px 0 10px;
}

:deep(.el-table .el-table__header-wrapper tr th) {
	background-color: #1FB864 !important;
	color: rgb(255, 255, 255);
}

/* 修改前后箭头未点击时的背景颜色 */
:deep .el-pagination .btn-prev,
:deep .el-pagination .btn-next {
	background-color: #fff !important;
}

/* 修改未点击时的数字方块背景颜色 */
:deep .el-pagination .el-pager li:not(.active):not(.disabled):hover {
	background-color: #EEEEEE !important;
}

/* 未点击时的数字方块背景颜色 */
:deep .el-pagination .el-pager li:not(.active):not(.disabled) {
	background-color: #fff !important;
	color: #000;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
	background-color: #1FB864 !important; //修改默认的背景色
	color: #fff;
}

:deep(.el-pagination ul li, .el-pagination .el-pagination__jump) {
	margin: 0 !important;
	padding: 0 !important;
}

:deep(.el-pagination ul li:not(:last-child)) {
	border-right: #DDDDDD 1px solid;
}


:deep(.el-pagination ul) {
	border: #DDDDDD 1px solid;
}

:deep(.el-upload) {
	width: 100%;
}

:deep(.el-upload .el-upload-dragger) {
	width: 100%;
}
</style>

<style>
@charset "UTF-8";

@import url('../../../css/v1.0/bootstrap.min.css');
@import url('../../../css/v1.0/bootstrap-reset.css');
@import url('../../../css/v1.0/font-awesome.min.css');

.el-textarea .el-textarea__inner {
	background-color: transparent !important;
	border: 1px dashed green !important;
	resize: none;
	box-shadow: none;
}

.el-input__inner {
	border: none;
}

.el-upload-dragger {
	border: 1px dashed green !important;
	background-color: transparent;
}

.el-upload__text {
	color: #fff !important;
}

.el-select-dropdown__item.selected {
	color: #1FB864;
}

.el-input {
	--el-input-focus-border-color: #1FB864;
}

.el-select {
	--el-select-input-focus-border-color: #1FB864;
}




.font-orange {
	color: #fb8574;
}

.c999 {
	color: #999;
}

.f16 {
	font-size: 16px !important;
}

.f36 {
	font-size: 36px !important;
}

.font-green {
	color: #1FB864;
}

.font-blue {
	color: #6a8abe;
}

.flor {
	float: right !important;
}

.posa {
	position: absolute;
	line-height: 34px;
}

.h34 {
	height: 34px;
}

.lh34 {
	line-height: 34px;
}

.w100 {
	width: 100px;
}

.mt0 {
	margin-top: 0 !important;
}

.mt5 {
	margin-top: 5px;
}

.mt10 {
	margin-top: 10px;
}

.mt15 {
	margin-top: 15px;
}

.mt20 {
	margin-top: 20px !important;
}

.mt25 {
	margin-top: 25px;
}

.mt30 {
	margin-top: 30px;
}

.ml5 {
	margin-left: 5px;
}

.ml15 {
	margin-left: 15px;
}

.ml30 {
	margin-left: 30px;
}

.mr0 {
	margin-right: 0px !important;
}

.mr10 {
	margin-right: 10px;
}

.mr20 {
	margin-right: 20px;
}

.mr35 {
	margin-right: 35px;
}

.mr100 {
	margin-right: 100px;
}

.mb10 {
	margin-bottom: 10px;
}

.mb20 {
	margin-bottom: 20px;
}

.mtNeg50 {
	margin-top: -50px;
}

.pt10 {
	padding-top: 10px !important;
	;
}

.pb10 {
	padding-bottom: 10px !important;
	;
}

.pl0 {
	padding-left: 0 !important;
}

.pr0 {
	padding-right: 0 !important;
}

.pt0 {
	padding-top: 0 !important;
}

.pb0 {
	padding-bottom: 0 !important;
}

.pl15 {
	padding-left: 15px;
}

.pr15 {
	padding-right: 15px !important;
}

.w100 {
	width: 100px;
}

.w150 {
	width: 150px;
}

.maxw600 {
	max-width: 600px;
	width: 100%;
}

.h95 {
	height: 95px !important;
}

.red {
	color: #ff6c60 !important;
}

textarea {
	resize: none;
}

.tc {
	text-align: center;
}

.inblock {
	display: inline-block;
}

.hide-file-upload {
	position: absolute;
	visibility: hidden;
}

.upload-input {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: block;
	z-index: 9;
	opacity: 0;
	visibility: visible;
}

.error {
	color: red !important;
}

.posr {
	position: relative;
}

/* 配合select2插件使用，给每个需要用到select2插件的选择框加上该样式，默认每个select的宽为100% */
.sel-col {
	width: 100%;
}

.nobor {
	border-left: none !important;
	border-right: none !important;
}

.tr {
	text-align: right;
}

.jwcolor {
	color: #1FB864;
}

body {
	font-family: 'Microsoft yahei';
}

.page-wrapper {}

.header-navbar {
	background: #1FB864;
	background-clip: padding-box;
	margin: 0;
	min-height: 50px;
	color: #fff;
	box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 99;
}

.header-navbar .navbar-brand {
	width: 240px;
	height: 50px;
	position: relative;
	background: #0F984D;
	padding: 7px 20px;
	margin-left: -15px;
}

.header-navbar .logowrap {
	position: absolute;
	height: 50px;
	top: 0;
	left: 15px;
	right: 15px;
	padding: 0;
	background: #0F984D;
}

.header-navbar a.logo {
	height: 30px;
	display: block;
	margin: 10px auto;
	overflow: hidden;
	position: relative;
}

.header-navbar a.logo .logo-white {
	width: 28px;
	height: 30px;
}

.header-navbar a.logo p {
	position: absolute;
	margin: 0;
	top: 5px;
	left: 40px;
	z-index: 1;
	color: #fff;
}

.header-navbar a.logo .logo-s {
	width: 28px;
	height: 30px;
	display: none;
}

.header-navbar .toggle-btn {
	width: 50px;
	height: 50px;
	color: #fff;
	font-size: 19px;
	text-align: center;
	line-height: 50px;
	-moz-transition: all 0.2s ease-out 0s;
	-webkit-transition: all 0.2s ease-out 0s;
	transition: all 0.2s ease-out 0s;
}

.header-navbar .toggle-btn:hover {
	background: #0F984D;
	color: #fff;
}

.header-navbar .menu-right .ul-menu {
	margin-bottom: 0;
	-webkit-padding-start: 0;
}

.header-navbar .menu-right .ul-menu>li {
	display: inline-block;
	float: left;
	position: relative;
}

.header-navbar .menu-right .ul-menu>li.company-name span {
	display: block;
	height: 50px;
	font-size: 15px;
	padding: 15px;
	color: #fff;
}

.header-navbar .menu-right .ul-menu>li>a {
	display: block;
	height: 50px;
	font-size: 15px;
	padding: 10px;
	color: #fff;
	border-radius: 0;
	border: none;
	-moz-transition: all 0.2s ease-out 0s;
	-webkit-transition: all 0.2s ease-out 0s;
	transition: all 0.2s ease-out 0s;
}

.header-navbar .menu-right .ul-menu>li>a:hover,
.header-navbar .menu-right .ul-menu>li.open .dropdown-toggle {
	color: #fff;
	background: #0F984D;
}

.header-navbar .menu-right .ul-menu>li>a .badge {
	background: #FF6C60;
	position: absolute;
	right: 4px;
	top: 8px;
}

.header-navbar .menu-right .ul-menu>li>a .photo {
	height: 28px;
	border-radius: 14px;
}

.header-navbar .menu-right .ul-menu>li>a .name {
	padding: 0 5px;
	font-size: 14px;
}

.header-navbar .menu-right .ul-menu>li>a .icon-user,
.header-navbar .menu-right .ul-menu>li>a .icon-caret-down {
	font-size: 12px;
}

.header-navbar .notifications-list,
.header-navbar .usermenu-dropdown {
	min-width: 119px;
	border: 0;
	margin-top: 0;
	border-radius: 0;
	box-shadow: none;
	padding: 0;
	right: 0;
	left: auto;
}

.header-navbar .organization-list:after,
.header-navbar .notifications-list:after,
.header-navbar .usermenu-dropdown:after {
	border-bottom: 6px solid #f1f2f5;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	content: "";
	display: inline-block;
	right: 10px;
	position: absolute;
	top: -6px;
}

.header-navbar .usermenu-dropdown {
	background-color: #f1f2f5;
	padding: 5px;
	border-radius: 2px 0 2px 2px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}

.header-navbar .usermenu-dropdown li a {
	color: #4B5B76;
	font-size: 12px;
	padding: 7px 10px;
	border-radius: 2px;
	-moz-transition: all 0.2s ease-out 0s;
	-webkit-transition: all 0.2s ease-out 0s;
	transition: all 0.2s ease-out 0s;
}

.header-navbar .usermenu-dropdown li a:hover {
	background-color: #cee5dc;
}

.header-navbar .usermenu-dropdown li a i {
	margin-right: 8px;
}

.con-wrapper {
	background-color: #424f63;
	padding: 0;
	position: relative;
}

.con-wrapper .left-nav-col {
	width: 240px;
	background: #424f63;
	position: absolute;
	height: 100%;
}

.con-wrapper .right-con-box {
	background: #eff0f4;
	height: 100%;
	margin-top: 0;
	margin-bottom: 0;
	position: relative;
	margin-left: 240px;
}

.con-wrapper .right-con-box .iframe-box {
	height: 100%;
	padding-bottom: 5px;
}

.index-left-nav li {
	height: 46px;
	line-height: 46px;
	overflow: hidden;
	-moz-transition: all 0.2s ease-out 0s;
	-webkit-transition: all 0.2s ease-out 0s;
	transition: all 0.2s ease-out 0s;
}

.index-left-nav li.active {
	background-color: #353f4f;
	/* height: auto; */
}

.index-left-nav li.openli {
	background-color: #353f4f;
	height: auto;
}

.index-left-nav li a {
	display: block;
	padding: 0 15px;
	border-radius: 0;
	color: #fff;
	font-size: 14px;
	background: url(../../../images/v1.0/plus-white.png) no-repeat 93% center;
	-moz-user-select: none;
	-ms-user-select: none;
	-webkit-user-select: none;
	user-select: none;
}

.index-left-nav>li>a i {
	width: 16px;
	display: inline-block;
	margin-right: 10px;
	text-align: center;
	font-size: 15px;
}

.index-left-nav li.nav-hover a,
.index-left-nav>li.active>a {
	background-image: url(../../../images/v1.0/plus.png);
}

.index-left-nav>li.openli>a,
.index-left-nav>li ul li.openli>a {
	background-image: url(../../../images/v1.0/minus.png);
	color: #1FB864;
}

.index-left-nav>li.active>a,
.index-left-nav>li.active>a:focus,
.index-left-nav>li.active>a:hover,
.index-left-nav>li>a:focus,
.index-left-nav>li>a:hover {
	background-color: #353f4f;
	color: #1FB864;
}

.index-left-nav li.baselink a {
	background-image: none;
}

.index-left-nav .sub-menu-list {
	padding: 0;
	font-size: 13px;
}

.index-left-nav .sub-menu-list>li>a {
	padding-left: 50px;
}

.index-left-nav .sub-menu-list>li.active a,
.index-left-nav .sub-menu-list>li>a:hover {
	background-color: #2a323f;
	color: #1FB864;
}



/* 左边导航折叠后样式 */
.header-navbar .small-navbar-brand {
	width: 50px;
	padding: 0;
}

.header-navbar .small-navbar-brand .logowrap {
	height: 100%;
	left: 0;
	right: 0;
	padding: 8px;
}

.header-navbar .small-navbar-brand .logowrap a.logo {
	width: 90%;
	height: 90%;
	margin: 0 auto;
}

.header-navbar .small-navbar-brand .logowrap a.logo .logo-s {
	width: 100%;
	height: 100%;
	display: block;
}

.header-navbar .small-navbar-brand .logowrap .logo-white {
	display: none;
}

.header-navbar .small-navbar-brand p {
	display: none;
}

.small-nav-col .left-nav-col {
	width: 50px;
	overflow: visible !important;
	padding-top: 0;
}

.small-nav-col .right-con-box {
	margin-left: 50px;
}

.small-nav-col .index-left-nav li {
	height: auto;
	line-height: 1;
	overflow: inherit;
}

.small-nav-col .index-left-nav li a {
	background: none;
	padding: 13px 10px;
}

.small-nav-col .index-left-nav li a i {
	width: 100%;
	margin-right: 0;
}

.small-nav-col .index-left-nav li a span {
	position: absolute;
	background: #1FB864;
	color: #fff;
	padding: 13px 10px;
	left: 50px;
	top: 0;
	min-width: 190px;
	text-align: left;
	z-index: 100;
	display: none;
}

.small-nav-col .index-left-nav>li>a span:after {
	right: 100%;
	top: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
	border-color: rgba(0, 0, 0, 0);
	border-right-color: #1FB864;
	border-width: 6px;
	margin-top: -6px;
}

.small-nav-col .index-left-nav .sub-menu-list {
	display: none;
	position: absolute;
	top: 40px;
	left: 51px;
	margin: 0;
	min-width: 189px;
	background: #353F4F;
	z-index: 100;
	-moz-border-radius: 0 0 2px 0;
	-webkit-border-radius: 0 0 2px 0;
	border-radius: 0 0 2px 0;
}

.small-nav-col .index-left-nav .nav-hover>a,
.small-nav-col .index-left-nav .nav-hover.active>a {
	background-color: #fff;
	color: #424f63;
}

.small-nav-col .index-left-nav .nav-hover a span,
.small-nav-col .index-left-nav .nav-hover ul {
	display: block;
}

.small-nav-col .index-left-nav .nav-hover .sub-menu-list a {
	color: #fff;
}

.small-nav-col .index-left-nav .nav-hover li.threenav {
	width: 100%;
	position: absolute;
	top: -40px;
	left: 189px;
}

.small-nav-col .index-left-nav .nav-hover li.threenav a.threenav-a {
	padding: 0;
}

.small-nav-col .index-left-nav .nav-hover li.threenav a.threenav-a span,
.small-nav-col .index-left-nav .nav-hover li.threenav ul {
	position: static;
}

.small-nav-col .index-left-nav .nav-hover li.threenav a.threenav-a:hover {
	background: none;
}

/*1.html*/
.pg-wrapper .breadcrumb {
	margin-bottom: 10px;
}

.breadcrumb a {
	color: #1FB864;
}

.bacimg {
	position: relative;
}

.bacimg img {
	width: 100%;
	height: auto;
}

.bannertext {
	position: absolute;
	left: 8%;
	top: 50%;
	z-index: 1;
	color: #fff;
	height: 106px;
	margin-top: -53px;
}

.bacimg h1 {
	font-weight: bold;
}

.bacimg p {
	display: block;
	font-size: 18px;
}

.robincont {
	position: relative;
	width: 100%;
	overflow: hidden;
	background: url(../../../images/v1.0/bac_1.png) no-repeat;
	background-size: 100% 100%;
}

.robincont h1 {
	font-size: 20px;
	text-align: center;
	position: relative;
	z-index: 1;
	margin: 30px 0 20px;
}

.robincont h1 i {
	background-color: #1FB864;
	height: 5px;
	width: 150px;
	margin-left: -75px;
	position: absolute;
	left: 50%;
	bottom: 0;
	z-index: 0;
	opacity: .5;
}

.robincont img {
	width: 100%;
}

.ptli {
	background: #fff;
	padding: 10px 20px;
	min-height: 102px;
}

.ptli p {
	font-size: 12px;
	padding-top: 5px;
	margin-bottom: 5px;
}

.ptli p span {
	color: #1FB864;
	font-size: 12px;
	font-weight: bold;
}

.robinc {
	display: block;
	padding-bottom: 30px;
	overflow: hidden;
}

.jcsm {
	background: url(../../../images/v1.0/bac_2.png) no-repeat;
	background-size: 100%;
}

.jcsm h1 i {
	background-color: #1890FF;
	width: 60px;
	margin-left: -30px;
}

.jcsmcont h3 {
	font-size: 14px;
	color: #1890FF;
	margin-top: 15px;
}

.jcsmcont h3 strong {
	font-size: 24px;
	opacity: .5;
	padding-right: 5px;
}

.jcsmcont p {
	font-size: 12px;
	margin: 0;
	line-height: 18px;
}

.jyzyc {
	background: url(../../../images/v1.0/bac_3.png);
	background-size: 100%;
}

.jyzyc h1 {
	color: #fff
}

.gbac {
	padding: 1px 20px 20px;
	background: url(../../../images/v1.0/bac_g.png);
	border-radius: 6px;
}

.gbac h3 {
	font-size: 16px;
	color: #1FB864;
}

.gbac label {
	color: #fff;
}

.gbac .form-control,
.fir {
	background: none;
	border-radius: 2px;
	border: 1px #76B7A3 dotted;
}

.fir {
	height: 100px;
	position: relative;
}

.fir input {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	opacity: 0;
}

.filbut {
	position: absolute;
	top: 20%;
	z-index: 1;
	color: #fff;
	display: block;
	text-align: center;
	width: 100%;
	font-size: 12px;
}

.filbut span {
	width: 100%;
}

.tipstxt {
	width: 100%;
	font-size: 12px;
	color: #fff;
	line-height: 12px;
	padding: 10px 0 0;
	opacity: .6;
}

.tabc {
	width: 100%;
	overflow: auto;
}

table {
	table-layout: fixed;
	width: 100%;
}

/* 表格th/td样式 */
td,
th {
	width: 120px;
	box-sizing: border-box;
	/*超出长度...*/
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	height: 30px;
}

/* 表头固定 */
thead tr th {
	position: sticky;
	top: 0;
	background: #fff;
	height: 30px;
}

/* 首列固定/最后一列固定*/
th:first-child,
th:last-child,
td:first-child,
td:last-child {
	position: sticky;
	left: 0;
	background: #fff;
	text-align: center;
	right: 0px;
	width: 100px;
}

th:first-child,
td:first-child {
	width: 50px;
}

/* 表头首列和最后一列强制最顶层 */
th:last-child,
th:first-child {
	z-index: 3;
	/*左上角单元格z-index，切记要设置，不然表格纵向横向滚动时会被该单元格右方或者下方的单元格遮挡*/
	background: #fff;
}

th.q1 {
	width: 80px;
}

th.q2 {
	width: 220px;
}

th.q3 {
	width: 120px;
}

th.q4 {
	width: 160px;
}

th.q5 {
	width: 100px;
}

th.q6 {
	width: 100px;
}

th.q7 {
	width: 100px;
}

th.q8 {
	width: 180px;
}

th.q9 {
	width: 180px;
}

.form-check-input:checked {
	background-position: right center;
	background-image: url(../../../images/v1.0/y.svg);
	background-color: #1FB864;
	border-color: #1FB864;
}

.form-check-input {
	height: 15px;
	width: 30px;
	border-radius: 15px;
	transition: background-position .15s ease-in-out;
	background-repeat: no-repeat;
	-webkit-appearance: none;
	-moz-appearance: none;
	-webkit-print-color-adjust: exact;
	appearance: none;
	border: 1px solid #1FB864;
}

.position-static {
	position: static !important;
}




.table .opr_a {
	color: #1FB864;
}

.bs-example {
	position: relative;
	padding: 20px 20px 0;
	background: #fff;
	box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12);
}

.bs-example th {
	background: #1FB864;
	color: #fff;
	border-bottom: none !important;
}

.bs-example td {
	border-bottom: 1px solid #ddd !important;
	border-top: none !important;
}

.tit {
	font-size: 16px;
	display: block;
	line-height: 22px;
	font-weight: bold;
	overflow: hidden;
	padding: 10px 0;
}

.mypage {
	text-align: right;
	font-size: 12px;
}

.mypage ul.pagination {
	vertical-align: middle;
	margin-right: 10px;
	-moz-user-select: none;
}

.mypage .num-inp {
	width: 40px;
	height: 30px;
	border: 1px solid #ddd;
	border-radius: 2px;
	padding: 0 5px;
	text-align: center;
	outline: none;
	vertical-align: middle;
}

.mypage .btn {
	height: 30px;
	font-size: 12px;
	margin-left: 5px;
}

.mrb0 {
	margin-bottom: 0 !important;
}

.mypage ul li.active a,
.mypage ul li.active a:hover {
	background: #1FB864 !important;
	border-color: #1FB864;
}

.tit .glyphicon {
	top: 2px;
	padding-right: 2px;
}

.botbanner {
	background: url(../../../images/v1.0/bac_5.png) no-repeat;
	background-size: 100%;
	width: 100%;
	height: 80px;
	line-height: 80px;
	color: #fff;
	font-size: 26px;
	text-align: center;
}

.leftnav {
	width: 210px;
	position: absolute;
	box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12);
	padding: 10px 15px;
	background: #fff;
}

.stit {
	font-size: 16px;
	font-weight: bold;
	line-height: 48px;
}

.smallnav {
	display: block;
	overflow: hidden;
	white-space: nowrap;
}

.smallnav ul {
	padding: 0;
}

.smallnav li {
	line-height: 36px;
	overflow: hidden;
}

.smallnav i {
	font-size: 12px;
	padding: 0 5px 0 0;
	color: #666;
}

.smallnav span {
	padding: 0 0 0 5px;
}

.smallnav ul.twonav {
	padding-left: 20px;
}

.smallnav ul.threenav {
	padding-left: 45px;
}

.smallnav ul.threenav i {
	font-size: 14px;
	padding: 0 5px 0 0;
}

.smallnav ul.threenav span {
	padding: 0;
}

.smallnav a {
	color: #333;
}

.padmar {
	padding: 15px 20px !important;
	margin: 0 0 20px !important;
}

.btn-green {
	background-color: #1FB864;
	border-color: #1FB864;
	color: #fff;
}

a.btn-green:hover {
	border-color: #26c16c;
	color: #fff;
	background-color: #26c16c;
}

a.btn-green:active,
a.btn-green:focus {
	border-color: #009f48;
	color: #fff;
	background-color: #009f48;
}

input:active,
input:focus {
	border-color: #1FB864 !important;
}

.rightcont {
	height: 100%;
	margin-top: 0;
	margin-bottom: 0;
	position: relative;
	margin-left: 240px;
}

.gbac1 {
	background: #F7F7F7;
	padding: 15px 20px;
}

#login {
	height: 100%;
	box-sizing: inherit;
}

body,
html {
	display: block;
	height: 100%;
}

.login {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background-image: url(../../images/v1.0/banner1.jpg);
	background-size: cover;
}

.logincont {
	background-color: rgba(255, 255, 255, 0.5);
	backdrop-filter: blur(10px);
	padding: 0 20px 20px;
	border-radius: 10px;
	width: 360px;
}

.logincont h3 {
	text-align: center;
}

.login .btn-green {
	display: block;
}

.el-login-footer {
	height: 40px;
	line-height: 40px;
	position: fixed;
	bottom: 0;
	width: 100%;
	text-align: center;
	color: #fff;
	font-size: 12px;
	letter-spacing: 1px;
}


@media screen and (max-width: 992px) {}

@media screen and (max-width: 896px) {
	.min {
		max-height: 170px;
		overflow: auto;
	}
}

@media screen and (max-width: 768px) {
	.header-navbar>div {
		padding-left: 0;
		padding-right: 0;
	}

	.header-navbar .navbar-brand {
		display: none;
	}

	.con-wrapper .left-nav-col {
		display: none;
	}

	.con-wrapper .right-con-box {
		margin-left: 0;
	}

	.small-nav-col .left-nav-col {
		display: block;
	}

	.small-nav-col .right-con-box {
		margin-left: 50px;
	}

	.con-wrapper .right-con-box .iframe-box {
		padding-bottom: 0;
	}

	footer {
		display: none;
	}

	.min {
		max-height: 170px;
		overflow: auto;
	}

	.gbac {
		margin-bottom: 20px;
	}

	.botbanner {
		height: 64px;
		line-height: 64px;
		font-size: 22px;
	}
}

@media screen and (max-width: 375px) {
	.bannertext {
		height: 50px;
		margin-top: -18px;
	}

	.bacimg h1 {
		font-size: 18px;
		line-height: 20px;
		margin: 0 0 8px;
	}

	.bacimg p {
		font-size: 9px;
		line-height: 10px;
	}

	.jcsm {
		background-size: 180%;
		background-position: top;
	}

	.ptli {
		min-height: 102px;
	}

	.gbac {
		margin-bottom: 20px;
	}

	.jyzyc {
		background-size: 410%;
	}

	.robinc {
		padding-bottom: 0;
	}

	.min {
		max-height: 180px;
		overflow: auto;
	}

	.minhei {
		min-height: 190px;
	}

	.botbanner {
		background-size: 200%;
		font-size: 12px;
	}
}
</style>