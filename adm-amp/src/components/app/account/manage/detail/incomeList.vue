<template>
	<div class="content">
		<!-- 查询-->
		<div class="set-fn">
			<div class="fn-plan">
				<span class="plan-title">日期：</span>
				<el-date-picker v-model="formData.time" type="date" :editable="false" placeholder="查询日期" :picker-options="pickerOptions">
				</el-date-picker>
			</div>
			<div class="fn-plan"><span class="plan-title">状态：</span>
				<el-select v-model="formData.state.value" style="width:190px;display:inline-block;" placeholder="全部">
					<el-option v-for="item in formData.state.options" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div class="fn-search"><a href="#" class="btn btn-primary" @click.prevent="getList">查询</a></div>
		</div>
		<!-- 列表-->
		<div class="amp-data">
			<div class="data-table" id="mainDataTable">
				<div class="main-table-wapper">
					<table class="table main-table">
						<thead>
							<tr class="list-header">
								<th :width="120"><span>充值日期</span></th>
								<th :width="120"><span>名称</span></th>
								<th :width="120"><span>状态</span></th>
								<th :width="230"><span>流水单号</span></th>
								<th :width="120"><span>金额(元)</span></th>
							</tr>
						</thead>
						<tbody>
							<tr class="body-row" v-if="data.length == 0">
								<td colspan="5" style="text-align: center; height: 100px;line-height: 100px;">{{noDataMessage}}</td>
							</tr>
							<tr v-for="items in data" class="body-row">
								<td v-for="(item, i) in items">
									<span v-if=" i == 4">{{item.toFixed(2)}}</span>
									<span v-else>{{item}}</span>
								</td>
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
			:class="{'el-pagination-reset': true}"
			:total="page.totalCount">
		</el-pagination>
	</div>
</template>
<script>
import http from "http";
export default {
	name: "AccountManageDetailIncomeList",
	data(){
		return {
			formData: {
				time: '',
				state: {
					options: [{
						label: "全部",
						value: "0"
					},{
						label: "处理中",
						value: "1"
					},{
						label: "成功",
						value: "2"
					}],
					value: "0"
				}
			},
			data: {},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSizes: [20, 30, 50],
				pageSize: 30
			},
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now() - 86400000;
				}
			},
			noDataMessage: '无相关查询结果'
		};
	},
	created(){
		this.getList();
	},
	methods: {
		getList() {
			http('api/account/income', {
				method: 'get',
				params: {
					time: this.formData.time ? new Date(this.formData.time).valueOf() : 0,
					state : this.formData.state.value,
					page: this.page.currentPage,
					number: this.page.pageSize
				}
			})
			.then((res) => {
				if(res.data.code == 200) {
					this.data = res.data.data.list.data;
					this.page.totalCount = res.data.data.totalCount;
					if (this.data.length === 0) {
						this.noDataMessage = '暂无结果';
					}
				} else if (res.data.code >= 500) {
					this.data = [];
					this.noDataMessage = '服务器异常，请稍后再试。';
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
		}
	}
};
</script>
