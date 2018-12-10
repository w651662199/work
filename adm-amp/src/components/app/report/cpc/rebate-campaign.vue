<template>
	<div>
		<div class="account-set account-set-new">
			<div class="set-tab">
				<router-link :to="{name: 'rebate-campaign'}" active-class="active" tag="span">投放计划</router-link>
				<router-link :to="{name: 'rebate-flight'}" active-class="active" tag="span">投放单元</router-link>
				<router-link :to="{name: 'rebate-material'}" active-class="active" tag="span">创意</router-link>
			</div>
			<div class="set-fn">
				<el-form :model="formData" :rules="rules" ref="formData">
					<div class="fn-plan">
						<el-form-item prop="startTime" style="display:inline-block;">
							<span class="plan-title">起止日期：</span>
							<el-date-picker v-model="formData.startTime" type="date" :editable=false style="width:130px;" placeholder="开始日期">
							</el-date-picker>
							<span class="plan-title plan-title-gray">-</span>
							<el-date-picker v-model="formData.endTime" type="date" :editable=false style="width:130px;" placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
					</div>
				</el-form>
				<div class="fn-plan fn-plan-new"><span class="plan-title">投放计划：</span>
					<el-select v-model="selectedCampaignId" clearable style="width:130px;display:inline-block;" placeholder="全部投放计划">
						<el-option label="全部投放计划" value="0">全部投放计划</el-option>
						<el-option
							v-for="campaign in campaigns"
							:label="campaign.name"
							:value="campaign.dspCampaignId">
						</el-option>
					</el-select>
					
					<span class="plan-title" style = "margin-left:20px">返利类型：</span>
					<el-select v-model="formData.rebateType" placeholder="请选择" style="display:inline-block;width:130px;">
							<el-option label="全部" :value="0"></el-option>
							<el-option label="分享返" :value="1"></el-option>
							<el-option label="视频浏览返" :value="2"></el-option>
							<el-option label="调查问卷返" :value="3"></el-option>
					</el-select>
				</div>
				<div class="fn-search"><a href="#" class="btn btn-primary" @click.prevent="search">查询</a></div>
				<div style="float:right;font-size:16px;letter-spacing:3px;padding-top:8px"><a :href="exportExcel"><em class="icon icon-report"></em>导出</a></div>
			</div>
		</div>
		<div class="amp-data">
			<div class="data-table" id="mainDataTable">
    			<div class="main-table-wapper">
					<table class="table main-table">
						<thead>
							<tr class="list-header">
								<th v-for="item in header" :width="120"><span>{{item.msg}}<em v-if='item.isShowPrompt' class="icon icon-TableHead-help" :title="item.content"></em></span></th>
							</tr>
						</thead>
						<tbody>
							<tr class="body-row" v-if="data.length == 0">
								<td :colspan="header.length" style="text-align: center; height: 100px;line-height: 100px;">{{noDataMessage}}</td>
							</tr>
							<tr v-for="items in data" class="body-row"> 
								<td v-for="item in items"><span>{{item}}</span></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<el-pagination v-show="Math.floor(page.totalCount/page.pageSize)>0"
			@size-change="pageSizeChange"
			@current-change="currentPageChange"
			:current-page="page.currentPage"
			:page-sizes="page.pageSizes"
			:page-size="page.pageSize"
			layout="total, sizes, prev, pager, next"
			:total="page.totalCount"
			:class="{'el-pagination-reset': true}"
			>
		</el-pagination>
	</div>
</template>
<script>
import http from "../../../../utils/http";
import apiConfig from '../../../../config/api.config.js';
import {tableHandler, offWindowEvent, initWindowResize} from 'utils/table';
export default {
	name: "app-report-rebate-campaign",
	data() {
		return {
			formData: {
				startTime: '',
				endTime: '',
				rebateType:0
			},
			header: [],
			data: {},
			campaigns: {},
			selectedCampaignId:'',
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSizes: [20, 30, 50],
				pageSize: 30
			},
			noDataMessage: '无相关查询结果',
			rules: {
				startTime: [{
					validator: (rule, value, callback) => {
						if (+this.formData.startTime > +this.formData.endTime) {
							callback(new Error("结束时间不能早于开始时间"));
						} else {
							callback();
						}
					},
					trigger: "change"
				}],
				endTime: [{
					validator: (rule, value, callback) => {
						if (+this.formData.startTime > +this.formData.endTime) {
							callback(new Error("结束时间不能早于开始时间"));
						} else {
							callback();
						}
					},
					trigger: "change"
				}]
			}
		};
	},
	created() {
		this.getList();
		this.getCampaignList();
	},
	mounted() {
		if (this.header.length != 0) { 
			 initWindowResize('mainDataTable', true, 4);
		}
	   
	},
    updated() {
    	if (this.header.length !=0) {
    		tableHandler('mainDataTable', true, 4);
    	}
    },
    destroyed() {
        offWindowEvent('mainDataTable');
    },
	computed:{
	  exportExcel:function() {
	     let url = $CONFIG['domain']+'/api/report/rebate/campaign/export';
		 let startTime= this.formData.startTime ? new Date(this.formData.startTime).valueOf() : 0;
		 let endTime= this.formData.endTime ? new Date(this.formData.endTime).valueOf() : 0;
		 let campaignId = this.selectedCampaignId;
		 let rebateType = this.formData.rebateType;
	     return url +'?startTime='+startTime+'&endTime='+endTime+'&campaignId='+campaignId+'&rebateType='+rebateType;
	  }
	},
	methods: {
		getCampaignList(){
			http('api/campaigns/all', {
				method: 'get',
			})
				.then((res) => {
				if (res.data.code == 200) {
				this.campaigns = res.data.data.list;
			}
		})
		.catch(function(error) {
				console.log(error);
			});
		},
		getList() {
			http('api/report/rebate/campaign', {
				method: 'get',
				params: {
					startTime: this.formData.startTime ? new Date(this.formData.startTime).valueOf() : 0,
					endTime: this.formData.endTime ? new Date(this.formData.endTime).valueOf() : 0,
					page: this.page.currentPage,
					number: this.page.pageSize,
					campaignId: this.selectedCampaignId,
					rebateType:this.formData.rebateType
				}
			})
			.then((res) => {
				if (res.data.code == 200) {
					let headerArr = res.data.data.list.header;
					let header = [];
					headerArr.forEach((item, index) => {
						let prompt = false;
						let content = '';
						switch (item) {
							case '着陆页PV':{
								prompt = true;
								content = '指用户通过广告点击进入广告中间页的次数';
								break;
							}
							case '着陆页UV':{
								prompt = true;
								content = '指通过广告点击进入广告中间页的独立用户数';
								break;
							}
							case '分享页PV':{
								prompt = true;
								content = '指用户通过分享链接点击进入广告中间页的次数';
								break;
							}
							case '计费分享次数':{
								prompt = true;
								content = '参与分享返利的广告按返利规则分享并成功返利的次数';
								break;
							}
							case '平均分享单价(元)':{
								prompt = true;
								content = '分享费用/计费分享次数';
								break;
							}
							case '分享费用(元)':{
								prompt = true;
								content = '参与分享返利的广告按返利规则分享并成功返利的总金额';
								break;
							}
							case '视频计费浏览次数':{
								prompt = true;
								content = '参与视频浏览返利的广告按返利规则被浏览并成功返利的次数';
								break;
							}
							case '平均浏览单价(元)':{
								prompt = true;
								content = '视频浏览费用/视频计费浏览次数';
								break;
							}
							case '视频浏览费用(元)':{
								prompt = true;
								content = '参与视频浏览返利的广告按返利规则被浏览并成功返利的总金额';
								break;
							}
							case '有效问卷数':{
								prompt = true;
								content = '参与调研问卷返利的广告回收的有效问卷数';
								break;
							}
							case '问卷平均返利单价(元)':{
								prompt = true;
								content = '问卷费用/有效问卷数';
								break;
							}
							case '问卷费用(元)':{
								prompt = true;
								content = '参与调研问卷返利的广告用于回收问卷的总金额';
								break;
							}
							case '总费用(元)':{
								prompt = true;
								content = '分享费用+视频浏览费用+问卷费用';
								break;
							}
						};
						header.push({msg: item, isShowPrompt: prompt, content: content})
					});
					this.header = header;
					this.data = res.data.data.list.data;
					this.page.totalCount = res.data.data.totalCount;
					if (this.data.length == 0) {
						this.noDataMessage = '无相关查询结果';
					}
				} else {
					this.data = [];
					this.noDataMessage = '加载内容失败，请检查网络或刷新当前页面';
				}
			})
			.catch(function(error) {
				console.log(error);
			});
		},
		pageSizeChange(size) {
			this.page.pageSize = size;
			this.getList();
		},
		currentPageChange(page) {
			this.page.currentPage = page;
			this.getList();
		},
		search() {
			var that = this;
			this.$refs.formData.validate(function(valid){
				if (!valid) {
					return;
				}
				if (that.page.currentPage > 1) {
					that.page.currentPage = 1;
				} else {
					that.getList();
				}
			});
		}
	}
};
</script>
<style scoped>
.account-set-new{
	margin-top: 30px;
}
</style>