<template>
	<div class="amp-drawer">
		<div class="drawer-part">
			<h2 class="part-header"><span class="header-text">选择问卷</span><span class="header-fn"><em @click="hide()" class="icon icon-close"></em></span></h2>
			<div class="amp-form amp-form02-1">
				<div class="set-fn">
					<el-form :model="surveyData" label-position="left">
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="页面名称：" label-width="96px">
									<el-input :on-icon-click="clearIconClick" v-model="surveyData.keyword" placeholder="请输入页面名称" icon="circle-close"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="2">
								<el-form-item label="">
									<button class="btn btn-primary" @click.prevent="getSurveyList">查询</button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<div class="add-show">
					<table class="table">
						<tbody>
							<tr>
								<th width="47"><span></span></th>
								<th><span>ID</span></th>
								<th><span>页面名称</span></th>
								<th><span>创建时间</span></th>
							</tr>
							<tr v-if="surveyData.list.length == 0">
								<td colspan="4" style="text-align: center; height: 100px;line-height: 100px;">{{noDataMessage}}</td>
							</tr>
							<tr :class="{'actived': item.checked}" v-for="(item, index) in surveyData.list">
								<td><span><el-radio v-model="selectSurveyId" :label="item.surveyId" class="no_lable"></el-radio></span></td>
								<td><span>{{item.surveyId}}</span></td>
								<td><span>{{item.name}}</span></td>
								<td><span>{{item.createTime}}</span></td>
							</tr>
						</tbody>
					</table>
					<div style="text-align: right;margin-top:18px;">
						<el-pagination  v-show="Math.floor(page.totalCount / page.pageSize) > 0"
							@size-change="pageSizeChange"
							@current-change="pageChange"
							:current-page="page.currentPage"
							:page-sizes="page.pageSizes"
							:page-size="page.pageSize"
							layout="total, sizes, prev, pager, next"
							:total="page.totalCount">
						</el-pagination>
					</div>
				</div>
			</div>
		</div>
		<div class="drawer-btn">
			<button class="btn btn-primary" @click="save()">保存</button>
			<button class="btn btn-gray" @click="hide()">取消</button>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import store from 'store';
import {copyObj} from 'utils/common';
import Event from 'event';
import Http from 'utils/http';
import moment from 'moment';
export default {
	name: 'app-put-new-add-url',
	data() {
		return {
			surveyData: {
				keyword: '',
				list: []
			},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSizes: [20, 30, 50],
				pageSize: 20
			},
			selectSurveyId: '',
			noDataMessage: '无相关查询结果'
		};
	},
	props: ['templateId'],
	created() {
		this.getSurveyList();
	},
	methods: {
		clearIconClick() {
			this.surveyData.keyword = '';
		},
		getSurveyList() {
			Http.get('/api/surveys/approved', {
				params: {
					keyword: this.surveyData.keyword,
					page: this.page.currentPage,
					number: this.page.pageSize
				}
			}).then(res => {
				if (res.data.code === 200) {
					this.surveyData.list = res.data.data.list;
					if (this.surveyData.list.length === 0) {
						this.noDataMessage = '无相关查询结果';
					} else {
						this.surveyData.list.forEach((item) => {
							item.createTime = moment(item.createTime).format('YYYY年MM月DD日');
						});
						this.page.totalCount = res.data.data.totalCount;
					}
				} else {
					this.surveyData.list = [];
					this.noDataMessage = '加载内容失败，请检查网络或刷新当前页面';
				}
			}).catch(e => {
				console.log(e);
			});
		},
		pageChange(page) {
			this.page.currentPage = page;
			this.getSurveyList();
		},
		pageSizeChange(size){
			this.page.pageSize = size;
			this.getSurveyList();
		},
		save() {
			let selectItem = this.surveyData.list.find((item) => {
				return item.surveyId === this.selectSurveyId;
			});
			let surveyArr = [selectItem];
			Event.$emit('drawer-hide-add-survey', surveyArr);
		},
		hide() {
			Event.$emit('drawer-hide-add-survey');
		}
	}
};
</script>
