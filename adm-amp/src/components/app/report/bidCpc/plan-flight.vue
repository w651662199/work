<template>
	<div>
		<div class="account-tab">
			<router-link :to="{name: 'bidcpc-plan-campaign'}" class="active" tag="span">广告报表</router-link>
			<router-link :to="{name: 'bidcpc-effect-order'}" tag="span">效果报表</router-link>
		</div>
		<div class="account-set account-set-new">
			<div class="set-tab">
				<router-link :to="{name: 'bidcpc-plan-campaign'}" active-class="active" tag="span">投放计划</router-link>
				<router-link :to="{name: 'bidcpc-plan-flight'}" active-class="active" tag="span">投放单元</router-link>
				<router-link :to="{name: 'bidcpc-plan-material'}" active-class="active" tag="span">创意</router-link>
				<router-link :to="{name: 'bidcpc-plan-keywords'}" active-class="active" tag="span">关键词</router-link>
			</div>

			<div class="set-fn">
				<el-form :model="formData" :rules="rules" ref="formData">
					<div class="fn-plan">
						<el-form-item prop="startTime" style="display:inline-block;margin-bottom: 0;">
							<span class="plan-title">起止日期：</span>
							<el-date-picker v-model="formData.startTime" type="date" :editable=false style="width:130px;" placeholder="开始日期">
							</el-date-picker>
							<span class="plan-title plan-title-gray">-</span>
							<el-date-picker v-model="formData.endTime" type="date" :editable=false style="width:130px;" placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
					</div>
				</el-form>
				<div class="fn-plan">
					<div class="fn-plan fn-plan-new"><span class="plan-title">投放计划：</span>
						<el-select v-model="selectedDspCampaignId" clearable style="width:130px;display:inline-block;" placeholder="全部投放计划">
							<el-option label="全部投放计划" value="0">全部投放计划</el-option>
							<el-option
								v-for="campaign in campaigns"
								:label="campaign.name"
								:value="campaign.dspCampaignId">
							</el-option>
						</el-select>
					</div>
					<div class="fn-plan fn-plan-new"><span class="plan-title">投放单元：</span>
						<el-select v-model="selectedDspFlightId" clearable style="width:130px;display:inline-block;" placeholder="全部投放单元">
							<el-option label="全部投放单元" value="0">全部投放单元</el-option>
							<el-option
									   v-for="flight in flights"
									   :label="flight.name"
									   :value="flight.dspFlightId">
							</el-option>
						</el-select>
					</div>
				</div>
				<div class="fn-plan" style="margin-top:20px;width:100%;position:relative;">
					<div class="fn-plan fn-plan-new"><span class="plan-title">设备类型：</span>
						<el-select v-model="deviceType" clearable style="width:130px;display:inline-block;" placeholder="全部">
							<el-option label="全部" value="0">全部</el-option>
							<el-option label="APP" value="1">APP</el-option>
							<el-option label="WAP" value="2">WAP</el-option>
							<el-option label="PC" value="3">PC</el-option>
							<el-option label="小程序" value="5">小程序</el-option>
						</el-select>
					</div>
					<div class="fn-plan fn-plan-new"><span class="plan-title">跟单时效<em class="icon icon-TableHead-help" :title="orderDaysContent"></em>：</span>
						<el-select v-model="orderDays" clearable style="width:130px;display:inline-block;" placeholder="全部">
							<el-option label="15天" :value="15"></el-option>
							<el-option label="当天" :value="1"></el-option>
						</el-select>
					</div>
					<div class="fn-search"><a href="#" class="btn btn-primary" @click.prevent="search" style="width:130px">查询</a></div>
					<div style="float:right;font-size:16px;letter-spacing:3px;position:absolute;bottom:0;right:0;"><a :href="exportExcel" style="margin-bottom:0px;display:block;"><em class="icon icon-report"></em>导出</a></div>
				</div>
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
	name: "app-report-bidcpc-plan-flight",
	data() {
		return {
			orderDaysContent: '当天：用户的点击广告行为和购买行为发生在同一个自然日内\r\n15天：用户的点击广告行为和购买行为时间间隔在15个自然日（含15个自然日）内。',
			formData: {
				startTime: '',
				endTime: '',
			},
			header: [],
			data: {},
			campaigns: {},
			selectedDspCampaignId:'',
			flights: {},
			selectedDspFlightId: '',
			deviceType: '0',
			orderDays:15,
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
		this.getCampaignsAndFlightsList();
	},
	mounted() {
		if (this.header.length != 0) {
	    	initWindowResize('mainDataTable', true, 4);
	    }
	},
    updated() {
    	if (this.header.length != 0) {
    		tableHandler('mainDataTable', true, 4);
    	}
    },
    destroyed() {
        offWindowEvent('mainDataTable');
    },
	computed:{
	  exportExcel:function() {
	     let url = $CONFIG['domain']+'/api/report/anice/flight/export';
		 let startTime= this.formData.startTime ? new Date(this.formData.startTime).valueOf() : 0;
		 let endTime= this.formData.endTime ? new Date(this.formData.endTime).valueOf() : 0;
		 let campaignId = this.selectedDspCampaignId;
		 let flightId = this.selectedDspFlightId;
		 let deviceType = this.deviceType;
		 let orderDays = this.orderDays;
	     return url +'?productLine=3&startTime='+startTime+'&endTime='+endTime+'&campaignId='+campaignId+'&flightId='+flightId+ '&deviceType=' + deviceType+'&orderDays='+orderDays;
	  }
	},
	methods: {
		getCampaignsAndFlightsList(){
			http('api/campaigns/flights/all?productLine=3', {
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
			http('api/report/anice/flight', {
				method: 'get',
				params: {
					startTime: this.formData.startTime ? new Date(this.formData.startTime).valueOf() : 0,
					endTime: this.formData.endTime ? new Date(this.formData.endTime).valueOf() : 0,
					page: this.page.currentPage,
					number: this.page.pageSize,
					campaignId: this.selectedDspCampaignId,
					flightId: this.selectedDspFlightId,
					productLine: "3",
					deviceType: this.deviceType
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
							case '展现数':{
								prompt = true;
								content = '广告在报表显示的维度和条件下的展现数';
								break;
							}
							case '点击数':{
								prompt = true;
								content = '广告在报表显示的维度和条件下的点击数';
								break;
							}
							case '点击率':{
								prompt = true;
								content = '点击率=点击数/展现数*100%';
								break;
							}
							case '总现金花费(元)':{
								prompt = true;
								content = '该投放单元在选定时间内的广告总现金花费';
								break;
							}
							case '总虚拟金花费(元)':{
								prompt = true;
								content = '该投放单元在选定时间内的广告总虚拟金花费';
								break;
							}
							case 'ROI':{
								prompt = true;
								content = '总商品金额/总费用';
								break;
							}
							case '平均点击单价(元)':{
								prompt = true;
								content = '总费用/点击数';
								break;
							}
							case '千次展现成本(元)':{
								prompt = true;
								content = '总费用/展现数*1000';
								break;
							}
							case '直接商品行':{
								prompt = true;
								content = '用户A点击了绑定某SKU的广告，之后用户A下单购买了该SKU商品，称为一个直接商品行。\r\n在包含多SKU的订单中，按照SKU维度拆分订单，一个SKU对应一个商品行';
								break;
							}
							case '直接商品金额(元)':{
								prompt = true;
								content = '直接商品行对应的商品实付金额';
								break;
							}
							case '间接商品行':{
								prompt = true;
								content = '用户A点击了绑定某SKU的广告，之后用户A购买了该SKU所属店铺其他商品。\r\n在包含多SKU的订单中，按照SKU维度拆分订单，一个SKU对应一个商品行。';
								break;
							}
							case '间接商品金额(元)':{
								prompt = true;
								content = '间接商品行对应的商品实付金额';
								break;
							}
							case '总商品行':{
								prompt = true;
								content = '直接商品行+间接商品行';
								break;
							}
							case '总商品金额(元)':{
								prompt = true;
								content = '直接商品金额+间接商品金额';
								break;
							}
							case '转化率':{
								prompt = true;
								content = '总商品行/点击量*100%';
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
	},
	watch: {
		// 如果 selectedDspCampaignId 发生改变，这个函数就会运行
		selectedDspCampaignId: function(selectedDspCampaignId) {
			console.log(selectedDspCampaignId);
			if (selectedDspCampaignId == 0) {
				this.selectedDspFlightId = '0';
				this.flights = [];
				return;
			}
			this.flights = this.campaigns.filter(function(item) {
				return item.dspCampaignId == selectedDspCampaignId;
			})[0].flightList;
			if (this.flights == ""){
				this.selectedDspFlightId = '0';
				return;
			}
			this.selectedDspFlightId = '0';
		}
	},
};
</script>
