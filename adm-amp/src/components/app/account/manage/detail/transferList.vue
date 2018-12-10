<template>
	<div class="content">
		<!-- 查询-->
		<div class="set-fn" style="margin-bottom: 10px;">
			<div class="fn-plan">
				<span class="plan-title">日期</span>
				<el-date-picker v-model="dateRange" type="daterange" :editable="false" placeholder="日期范围" :picker-options="pickerOptions" style="width: 240px;">
				</el-date-picker>
			</div>
			<div class="fn-plan">
				<span class="plan-title">转账类型</span>
				<el-select v-model="transferType.value" placeholder="全部">
					<el-option v-for="item in transferType.options" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div class="fn-plan">
				<span class="plan-title">产品线</span>
				<el-select v-model="productLine.value" placeholder="全部">
					<el-option v-for="item in productLine.options" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div class="fn-plan">
				<span class="plan-title">资金类型</span>
				<el-select v-model="accountType.value" placeholder="全部">
					<el-option v-for="item in accountType.options" :label="item.label" :value="item.value">
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
								<th :width="120"><span>日期</span></th>
								<th :width="150"><span>转账类型</span></th>
								<th :width="120"><span>产品线</span></th>
								<th :width="120"><span>产品线账户</span></th>
								<th :width="120"><span>资金类型</span></th>
								<th :width="100"><span>申请金额</span></th>
								<th :width="120"><span>实际到账金额</span></th>
								<th :width="120"><span>状态</span></th>
							</tr>
						</thead>
						<tbody>
							<tr class="body-row" v-if="data.length == 0">
								<td colspan="8" style="text-align: center; height: 100px;line-height: 100px;">{{noDataMessage}}</td>
							</tr>
							<tr v-for="item in data" class="body-row">
								<td><span>{{item.createTime | moment('YYYY-MM-DD')}}</span></td>
								<td><span>{{item.transferType==1?'总账户转账到产品线':'产品线转账到总账户'}}</span></td>
								<td><span>{{getListProductLine(item.productLine)}}</span></td>
								<td><span>{{item.amountType==1?'广告账户':'返利账户'}}</span></td>
								<td><span>{{getListAccountType(item.accountType)}}</span></td>
								<td><span>{{item.amount | currency('', 2)}}</span></td>
								<td v-if='item.status==1'><span>{{item.actualAmount | currency('', 2)}}</span></td>
								<td v-if='item.status!=1'><span>-</span></td>
								<td><span :class="{'c-primary': item.status == 1, 'c-error': item.status != 1}">{{getStatus(item.status)}}</span></td>
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
import actions from 'actions';
import http from "http";
import moment from 'moment';
export default {
	name: "AccountManageDetailTransferList",
	data() {
		return {
			page: {
				totalCount: 0,
				currentPage: 1,
				pageSizes: [20, 30, 50],
				pageSize: 30
			},
			dateRange: [],
			transferType: {
				options: [{
					label: "全部",
					value: 0
				},{
					label: "总账户转账到产品线",
					value: 1
				},{
					label: "产品线转账到总账户",
					value: 2
				}],
				value: 0
			},
			accountType: {
				options: [{
					label: "全部",
					value: 0
				},{
					label: "现金",
					value: 1
				},{
					label: "内部流转金",
					value: 2
				},{
					label: "虚拟金",
					value: 3
				}],
				value: 0
			},
			productLine: {},
			data: [],
			noDataMessage: '无相关查询结果',
			startTime: '',
			endTime: '',
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now() - 86400000;
				}
			}
		};
	},
	created(){
		this.getList();
		this.getProductLine();
	},
	computed: {
		productLines: () => store.state.productLines,
	},
	methods: {
		getList() {
			http('/api/account/transfer/pline', {
				method: 'get',
				params: {
					startTime: this.startTime,
					endTime: this.endTime,
					transferType: this.transferType.value,
					productLine: this.productLine.value,
					accountType: this.accountType.value,
					page: this.page.currentPage,
					number: this.page.pageSize
				}
			})
			.then((res) => {
				if(res.data.code == 200) {
					this.data = res.data.data.list;
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
		},
		getProductLine() {
			let productLine = {
				options: [{
					label: "全部",
					value: 0
				}],
				value: 0
			};
			this.productLines.forEach((item, index) => {
				let option;
				if (item.productLineName == '合约 ') {
					option = {
						label: '国美合约',
						value: 1
					}
				} else if (item.productLineName == '众达') {
					option = {
						label: '国美众达',
						value: 2
					}
				} else if (item.productLineName == '点效') {
					option = {
						label: '国美点效',
						value: 3
					}
				}  else if (item.productLineName == '站外') {
					option = {
						label: '国美站外',
						value: 4
					}
				}
				productLine.options.push(option);
			});
			this.productLine = productLine;
		},
		getListProductLine(type) {
			if (type == 1) {
				return '国美合约';
			} else if (type == 2) {
				return '国美众达';
			} else if (type == 3) {
				return '国美点效';
			} else if (type == 4) {
				return '国美站外';
			}
		},
		getListAccountType(type) {
			if (type == 1) {
				return '现金';
			} else if (type == 2) {
				return '内部流转金';
			} else if (type == 3) {
				return '虚拟金';
			}
		},
		getStatus(status) {
			if (status != 1) {
				return '转账中';
			} else {
				return '已到账';
			}
		}
	},
	watch: {
		'dateRange': {
			handler: function(value) {
				if (value && value.length > 0 && value[0] !== null) {
					this.startTime = moment(value[0]).startOf('day').valueOf();
					this.endTime = moment(value[1]).endOf('day').valueOf();
				} else {
					this.startTime = '';
					this.endTime = '';
				}
			},
			deep: true
		},
		'productLines': function() {
			if (this.productLines.length) {
				this.getProductLine();
			}
		}
	}
};
</script>
