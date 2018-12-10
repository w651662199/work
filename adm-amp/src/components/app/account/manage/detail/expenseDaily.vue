<template>
	<div class="page-content">
		<div class="page-title" style="padding-left: 0;">支出明细</div>
		<p class="page-route"><router-link :to="{name: 'detail'}">账户明细</router-link><span>&gt;</span><router-link :to="{name: 'detail'}">消费记录</router-link><span>&gt;</span><span>支出明细</span></p>
		<div class="content">
			<p class="content-msg">{{title}}</p>
			<div class="amp-data">
				<div class="data-table" id="mainDataTable">
					<div class="main-table-wapper">
						<table class="table">
							<thead>
								<tr>
									<th :width="120"><span>计划名称</span></th>
									<th :width="120"><span>账户</span></th>
									<th :width="120"><span>支出(元)</span></th>
								</tr>
							</thead>
							<tbody>
								<tr class="body-row" v-if="data.length == 0">
									<td colspan="3" style="text-align: center; height: 100px;line-height: 100px;">{{noDataMessage}}</td>
								</tr>
								<tr v-for="items in data">
									<td v-for="(item, i) in items">
										<span>{{item}}</span>
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
	</div>
</template>
<script>
import http from "http";
import {formatDate, mixin} from 'utils/common';

export default {
	name: "AccountExpenseDaily",
	data(){
		return {
			data: {},
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSizes: [20, 30, 50],
				pageSize: 30
			},
			noDataMessage: '无相关查询结果'
		};
	},
	created() {
		this.getList();
	},
	computed: {
		date() {
			return this.$route.params.date;
		},
		title() {
			var date = this.$route.params.date;
			return formatDate(date, "yyyy年MM月dd日") + "费用支出明细";
		}
	},
	methods: {
		getList(){
			http.get("/api/account/expense/daily", {
				params: {
					time: new Date(this.date).valueOf(),
					page: this.page.currentPage,
					number: this.page.pageSize
				}
			}).then((res) => {
				if(res.data.code == 200){
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
			}).catch(function(error){
				console.log(error);
			});
		},
		pageSizeChange(size){
			this.page.pageSize = size;
			this.getList();
		},
		currentPageChange(page){
			this.page.currentPage = page;
			this.getList();
		},
		exportList(){

		}
	},
	watch: {
		date() {
			this.getList();
		}
	}
};

</script>
<style lang="less" scoped>
.page-route {
	padding-bottom: 20px;
	span {
		display: inline-block;
		margin: 0 10px;
		color: #02c286;
		&:last-child {
			margin: 0;
			color: #404d5f;
		}
	}
}
</style>
